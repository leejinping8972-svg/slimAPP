import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../l10n/app_locale.dart';
import '../l10n/app_strings.dart';
import '../models/models.dart';
import '../repositories/mock_data_repository.dart';
import '../services/mock_order_service.dart';
import '../services/onboarding_chat_guide.dart';
import '../services/sunny_intent_router.dart';
import '../services/vitality_scorer.dart';

final mockRepoProvider = Provider<MockDataRepository>(
  (ref) => MockDataRepository(),
);

final sunnyRouterProvider = Provider<SunnyIntentRouter>(
  (ref) => SunnyIntentRouter(),
);

final mockOrderServiceProvider = Provider<MockOrderService>(
  (ref) => MockOrderService(),
);

final appStringsProvider = Provider<AppStrings>((ref) {
  final code = ref.watch(appStateProvider.select((s) => s.profile.language));
  return AppStrings.fromCode(code);
});

class AppState {
  const AppState({
    required this.profile,
    required this.demoDay,
    required this.journey,
    required this.chatMessages,
    required this.showLoading,
    required this.showError,
    this.launchGuideSeen = false,
    this.sunnyOpeningSeen = false,
  });

  final UserProfile profile;
  final DemoDay demoDay;
  final JourneyState journey;
  final List<ChatMessage> chatMessages;
  final bool showLoading;
  final bool showError;

  /// Session flag: guest must finish launch guide before /login or /register.
  final bool launchGuideSeen;

  /// Session flag: guest must finish fixed Sunny opening before /register.
  final bool sunnyOpeningSeen;

  AppState copyWith({
    UserProfile? profile,
    DemoDay? demoDay,
    JourneyState? journey,
    List<ChatMessage>? chatMessages,
    bool? showLoading,
    bool? showError,
    bool? launchGuideSeen,
    bool? sunnyOpeningSeen,
  }) {
    return AppState(
      profile: profile ?? this.profile,
      demoDay: demoDay ?? this.demoDay,
      journey: journey ?? this.journey,
      chatMessages: chatMessages ?? this.chatMessages,
      showLoading: showLoading ?? this.showLoading,
      showError: showError ?? this.showError,
      launchGuideSeen: launchGuideSeen ?? this.launchGuideSeen,
      sunnyOpeningSeen: sunnyOpeningSeen ?? this.sunnyOpeningSeen,
    );
  }
}

class AppStateNotifier extends StateNotifier<AppState> {
  AppStateNotifier(this._repo, this._router, this._orderService)
    : super(
        AppState(
          profile: const UserProfile(),
          demoDay: DemoDay.day12,
          journey: MockDataRepository().journeyForDay(DemoDay.day12),
          chatMessages: MockDataRepository().initialChatMessages(12),
          showLoading: false,
          showError: false,
        ),
      );

  final MockDataRepository _repo;
  final SunnyIntentRouter _router;
  final MockOrderService _orderService;

  void markLaunchGuideSeen() {
    if (state.launchGuideSeen) return;
    state = state.copyWith(launchGuideSeen: true);
  }

  void markSunnyOpeningSeen() {
    if (state.sunnyOpeningSeen) return;
    state = state.copyWith(sunnyOpeningSeen: true);
  }

  void loginExistingUser() {
    state = state.copyWith(
      profile: state.profile.copyWith(
        isLoggedIn: true,
        isNewRegistration: false,
        onboardingComplete: true,
        couponRewardSeen: true,
        sunnyIntroSeen: true,
        orderLinkStatus: OrderLinkStatus.linked,
        productSource: ProductAcquisitionSource.orderLinked,
        slimPlanStatus: SlimPlanStatus.active,
        userPlanType: UserPlanType.mealReplacement,
        linkedOrderNo: 'LD-DEMO-001',
        linkedProductName: 'Solar Protein 28-Day',
        linkedProducts: const [
          LinkedProductRef(
            orderNo: 'LD-DEMO-001',
            productName: 'Solar Protein 28-Day',
            productId: 'solar_protein',
            isMealReplacement: true,
            series: 'Vitalidad Slim',
          ),
        ],
      ),
    );
  }

  void completeRegistration() {
    final profile = state.profile.copyWith(
      isLoggedIn: true,
      isNewRegistration: true,
      couponRewardSeen: true,
      orderLinkStatus: OrderLinkStatus.skipped,
      userPlanType: UserPlanType.noProduct,
      onboardingComplete: false,
      onboardingStep: '',
      sunnyIntroSeen: true,
    );
    state = state.copyWith(
      profile: profile,
      chatMessages: const [],
      journey: _buildBasicJourney(profile),
    );
  }

  void beginOnboardingChat() {
    // Skip / no-product: health need → basic info → Messenger.
    // Linked-product users use beginProductIntroChat instead.
    final noProduct = state.profile.userPlanType == UserPlanType.noProduct;
    state = state.copyWith(
      chatMessages: noProduct
          ? OnboardingChatGuide.noProductSeedMessages(state.profile)
          : OnboardingChatGuide.seedMessages(state.profile),
      profile: state.profile.copyWith(
        onboardingStep: noProduct ? 'health_need' : 'privacy',
      ),
    );
  }

  /// After order lookup — greet by name, show product cards, then plan offer.
  void beginProductIntroChat() {
    final profile = state.profile.copyWith(onboardingStep: 'plan_offer');
    state = state.copyWith(
      profile: profile,
      chatMessages: OnboardingChatGuide.productIntroSeedMessages(profile),
    );
  }

  void acknowledgeCouponReward() {
    state = state.copyWith(
      profile: state.profile.copyWith(couponRewardSeen: true),
    );
  }

  OrderLinkResult linkOrder({
    required String recipientName,
    required String phoneLast4,
  }) {
    final result = _orderService.linkOrder(
      recipientName: recipientName,
      phoneLast4: phoneLast4,
    );
    if (!result.success) {
      state = state.copyWith(
        profile: state.profile.copyWith(
          recipientName: recipientName.trim(),
          linkedOrderNo: '',
          linkedProductName: '',
          linkedProducts: const [],
          orderLinkStatus: OrderLinkStatus.failed,
        ),
      );
      return result;
    }

    final linked = result.products
        .map(
          (p) => LinkedProductRef(
            orderNo: p.orderNo,
            productName: p.productName,
            productId: p.productId,
            isMealReplacement: p.isMealReplacement,
            series: p.series,
            blurb: p.blurb,
          ),
        )
        .toList();
    final planType = _orderService.planTypeFor(result);
    final displayName = result.recipientName.isNotEmpty
        ? result.recipientName
        : recipientName.trim();
    var profile = state.profile.copyWith(
      recipientName: displayName,
      nickname: displayName.isNotEmpty ? displayName : state.profile.nickname,
      linkedOrderNo: linked.isNotEmpty ? linked.first.orderNo : '',
      linkedProductName: result.productName,
      linkedProducts: linked,
      orderLinkStatus: OrderLinkStatus.linked,
      productSource: ProductAcquisitionSource.orderLinked,
      membershipPlan: result.productName,
      userPlanType: planType,
      slimPlanStatus: planType == UserPlanType.mealReplacement
          ? SlimPlanStatus.active
          : SlimPlanStatus.notStarted,
    );

    if (planType == UserPlanType.mealReplacement) {
      _applySlimJourneyActivation(
        profile: profile,
        refreshChat: profile.onboardingComplete,
      );
    } else {
      state = state.copyWith(profile: profile);
    }
    return result;
  }

  void skipOrderLink() {
    state = state.copyWith(
      profile: state.profile.copyWith(
        orderLinkStatus: OrderLinkStatus.skipped,
        userPlanType: UserPlanType.noProduct,
        slimPlanStatus: SlimPlanStatus.notStarted,
        productSource: ProductAcquisitionSource.none,
        linkedProducts: const [],
        linkedOrderNo: '',
        linkedProductName: '',
      ),
    );
  }

  void confirmReceipt() {
    if (state.profile.slimPlanStatus != SlimPlanStatus.awaitingReceipt) return;
    final shouldGuideDay1 = state.profile.onboardingComplete;
    _applySlimJourneyActivation(
      profile: state.profile.copyWith(
        linkedProductName: state.profile.linkedProductName.isEmpty
            ? 'Solar Protein™'
            : state.profile.linkedProductName,
        linkedOrderNo: state.profile.linkedOrderNo.isEmpty
            ? 'PURCHASE-DEMO'
            : state.profile.linkedOrderNo,
      ),
      refreshChat: false,
    );
    if (shouldGuideDay1) {
      final follow = ChatMessage(
        id: '${DateTime.now().millisecondsSinceEpoch}_day1',
        isUser: false,
        text: OnboardingChatGuide.day1RitualGuide(state.profile),
        timestamp: DateTime.now(),
        actionLabels: const [
          'Comenzar el registro del Día 1',
          'Registrar agua',
          'Registrar comida',
          'Ir al viaje',
        ],
      );
      state = state.copyWith(chatMessages: [...state.chatMessages, follow]);
    }
  }

  void activateSlimJourney() {
    confirmReceipt();
  }

  void _applySlimJourneyActivation({
    required UserProfile profile,
    bool refreshChat = false,
  }) {
    final activated = profile.copyWith(
      userPlanType: UserPlanType.mealReplacement,
      slimPlanStatus: SlimPlanStatus.active,
      hidePurchaseGuideCard: true,
      isLoggedIn: true,
    );
    final journey = _repo.journeyForDay(DemoDay.day1);
    state = state.copyWith(
      profile: activated,
      demoDay: DemoDay.day1,
      journey: journey,
      chatMessages: refreshChat
          ? _repo.initialChatMessages(
              1,
              planType: UserPlanType.mealReplacement,
              hasWelcomeCoupon: activated.welcomeCoupon != null,
              linkedProductName: activated.linkedProductName,
            )
          : state.chatMessages,
    );
  }

  void setLoggedIn() {
    loginExistingUser();
  }

  void clearLoginSession() {
    state = state.copyWith(profile: const UserProfile());
  }

  void hidePurchaseGuideCard() {
    state = state.copyWith(
      profile: state.profile.copyWith(hidePurchaseGuideCard: true),
    );
  }

  void markSunnyIntroSeen() {
    state = state.copyWith(
      profile: state.profile.copyWith(sunnyIntroSeen: true),
    );
  }

  void markJourneyCompleteSeen() {
    state = state.copyWith(
      profile: state.profile.copyWith(journeyCompleteSeen: true),
    );
  }

  void updateReminders({required String reminderTime, String? reminderTime2}) {
    state = state.copyWith(
      profile: state.profile.copyWith(
        reminderTime: reminderTime,
        reminderTime2: reminderTime2 ?? state.profile.reminderTime2,
      ),
    );
  }

  void updateExerciseTarget(int kcal) {
    state = state.copyWith(
      profile: state.profile.copyWith(
        exerciseTargetKcal: kcal.clamp(100, 2000),
      ),
    );
    updateTodayRecord(state.journey.todayRecord);
  }

  void updateCalorieTarget(int kcal) {
    state = state.copyWith(
      profile: state.profile.copyWith(calorieTargetKcal: kcal.clamp(800, 4000)),
    );
    updateTodayRecord(state.journey.todayRecord);
  }

  void logMood(String moodTag) {
    final record = state.journey.todayRecord.copyWith(moodTag: moodTag);
    updateTodayRecord(record);
    final moodMsg = ChatMessage(
      id: '${DateTime.now().millisecondsSinceEpoch}_mood',
      isUser: true,
      text: 'Hoy me siento $moodTag',
      timestamp: DateTime.now(),
    );
    final reply = ChatMessage(
      id: '${moodMsg.id}_reply',
      isUser: false,
      text: switch (moodTag) {
        'great' => 'Me encanta esa energía. Mantén un ritmo suave esta noche.',
        'okay' =>
          'Estar bien también cuenta como un logro. Descansa cuando lo necesites.',
        'tired' =>
          'Gracias por compartirlo. Una noche más ligera puede ayudarte.',
        _ => 'Gracias por registrarte. Estoy aquí si quieres platicar.',
      },
      timestamp: DateTime.now(),
    );
    state = state.copyWith(
      chatMessages: [...state.chatMessages, moodMsg, reply],
    );
  }

  void updateProfile(UserProfile profile) {
    state = state.copyWith(profile: profile);
  }

  void setLanguage(AppLang lang) {
    state = state.copyWith(
      profile: state.profile.copyWith(language: lang.code),
    );
  }

  void completeOnboarding(UserProfile profile, {bool preserveChat = false}) {
    final journey = profile.hasActiveSlimPlan
        ? _repo.journeyForDay(DemoDay.day1)
        : _buildBasicJourney(profile);
    state = state.copyWith(
      profile: profile.copyWith(
        onboardingComplete: true,
        isLoggedIn: true,
        isNewRegistration: false,
        onboardingStep: 'done',
      ),
      demoDay: DemoDay.day1,
      journey: journey,
      chatMessages: preserveChat
          ? state.chatMessages
          : _repo.initialChatMessages(
              1,
              planType: profile.userPlanType,
              hasWelcomeCoupon: profile.welcomeCoupon != null,
              linkedProductName: profile.linkedProductName,
            ),
    );
  }

  JourneyState _buildBasicJourney(UserProfile profile) {
    return JourneyState(
      day: 1,
      totalDays: 28,
      completionPercent: 0,
      phase: profile.userPlanType == UserPlanType.nonMealReplacement
          ? 'Cuidado del producto'
          : 'Modo básico',
      themeEn: profile.userPlanType == UserPlanType.nonMealReplacement
          ? 'Recordatorio diario'
          : 'Registra y chatea',
      themeZh: '',
      encouragement: profile.userPlanType == UserPlanType.nonMealReplacement
          ? 'Te recordaremos usar tu producto cada día.'
          : 'Registra tus hábitos y chatea con Sunny a tu ritmo.',
      vitalityTrend: const [],
      weightTrend: const [],
      consistency5d: const [false, false, false, false, false],
      dayStatuses: const [],
      unlockedMilestones: const [],
      todayRecord: const TodayRecord(),
      vitalityScores: const VitalityScores(),
      sunnyCardMessage: profile.userPlanType == UserPlanType.noProduct
          ? 'Aún no tienes un plan específico, pero puedes seguir chateando conmigo. Vincula un pedido externo cuando quieras activar tu recorrido.'
          : 'Recuerda tomar tu producto hoy.',
    );
  }

  void switchDemoDay(DemoDay day) {
    final journey = _repo.journeyForDay(day);
    state = state.copyWith(
      demoDay: day,
      journey: journey,
      chatMessages: _repo.initialChatMessages(
        journey.day,
        planType: state.profile.userPlanType,
        hasWelcomeCoupon: state.profile.welcomeCoupon != null,
        linkedProductName: state.profile.linkedProductName,
      ),
    );
  }

  void updateTodayRecord(TodayRecord record) {
    final scores = VitalityScorer.calculate(
      record: record,
      hydrationTargetMl: state.profile.hydrationTargetMl,
      planType: state.profile.userPlanType,
      consistency7d: record.consistency7d,
      calorieTargetKcal: state.profile.calorieTargetKcal,
      exerciseTargetKcal: state.profile.exerciseTargetKcal,
    );
    state = state.copyWith(
      journey: JourneyState(
        day: state.journey.day,
        totalDays: state.journey.totalDays,
        completionPercent: state.journey.completionPercent,
        phase: state.journey.phase,
        themeEn: state.journey.themeEn,
        themeZh: state.journey.themeZh,
        encouragement: state.journey.encouragement,
        vitalityTrend: state.journey.vitalityTrend,
        weightTrend: state.journey.weightTrend,
        consistency5d: state.journey.consistency5d,
        dayStatuses: state.journey.dayStatuses,
        unlockedMilestones: state.journey.unlockedMilestones,
        todayRecord: record,
        vitalityScores: scores,
        sunnyCardMessage: state.journey.sunnyCardMessage,
      ),
    );
  }

  Future<void> sendChatMessage(String text) async {
    final userMsg = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      isUser: true,
      text: text,
      timestamp: DateTime.now(),
    );
    final messages = [...state.chatMessages, userMsg];
    final placeholder = ChatMessage(
      id: '${userMsg.id}_reply',
      isUser: false,
      text: '',
      isStreaming: true,
      timestamp: DateTime.now(),
    );
    state = state.copyWith(chatMessages: [...messages, placeholder]);

    late final SunnyIntentResult result;
    if (!state.profile.onboardingComplete) {
      final guided = OnboardingChatGuide.handle(
        input: text,
        profile: state.profile,
      );
      state = state.copyWith(profile: guided.profile);
      if (guided.profile.onboardingComplete) {
        completeOnboarding(guided.profile, preserveChat: true);
      }
      result = guided.result;
    } else if (!state.profile.hasActiveSlimPlan &&
        OnboardingChatGuide.wantsPlanRequest(text)) {
      // No mall upsell after commerce removal — guide users to support.
      result = const SunnyIntentResult(
        reply:
            'Para activar un plan personalizado, habla con nuestro equipo en '
            'Messenger. Ellos pueden orientarte según tu necesidad.\n\n'
            'Toca «Hablar por Messenger» cuando quieras.',
        intents: ['plan_request_contact_support'],
        actionLabels: [
          'Hablar por Messenger',
          'Ir al viaje',
        ],
      );
    } else {
      result = _router.route(
        input: text,
        today: state.journey.todayRecord,
        journeyDay: state.journey.day,
        hydrationTargetMl: state.profile.hydrationTargetMl,
        nickname: state.profile.nickname,
      );

      if (result.todayUpdates != null) {
        updateTodayRecord(result.todayUpdates!);
      }
    }

    await _streamReply(
      placeholder.id,
      result.reply,
      suggestions: result.suggestions,
      actionLabels: result.actionLabels,
    );
    if (result.intents.contains('onboarding_complete')) {
      if (state.profile.hasActiveSlimPlan) {
        final follow = ChatMessage(
          id: '${placeholder.id}_day1',
          isUser: false,
          text: '',
          isStreaming: true,
          timestamp: DateTime.now(),
        );
        state = state.copyWith(chatMessages: [...state.chatMessages, follow]);
        await _streamReply(
          follow.id,
          OnboardingChatGuide.day1RitualGuide(state.profile),
          suggestions: OnboardingChatGuide.day1RitualItems(state.profile),
          actionLabels: const [
            'Comenzar el registro del Día 1',
            'Registrar agua',
            'Registrar comida',
            'Registrar sueño',
          ],
        );
      } else if (state.profile.isAwaitingReceipt) {
        final follow = ChatMessage(
          id: '${placeholder.id}_receipt',
          isUser: false,
          text: '',
          isStreaming: true,
          timestamp: DateTime.now(),
        );
        state = state.copyWith(chatMessages: [...state.chatMessages, follow]);
        await _streamReply(
          follow.id,
          'Tu Solar Protein está en camino. '
          'Confirma la recepción en Plan o Perfil cuando llegue; '
          'después te guiaré en tu registro del Día 1.',
          actionLabels: const ['Ver mi plan'],
        );
      } else {
        final follow = ChatMessage(
          id: '${placeholder.id}_unlock',
          isUser: false,
          text: '',
          isStreaming: true,
          timestamp: DateTime.now(),
        );
        state = state.copyWith(chatMessages: [...state.chatMessages, follow]);
        await _streamReply(
          follow.id,
          'Gracias por completar tu perfil. '
          'Habla con nuestro equipo en Messenger para recibir orientación '
          'según tu necesidad de salud; ellos te ayudarán con el siguiente paso.',
          actionLabels: const ['Hablar por Messenger', 'Ir al viaje'],
        );
      }
    }
  }

  Future<void> sendQuickAction(String action) async {
    switch (action) {
      case 'water':
        await sendChatMessage('Tomé un vaso de agua');
      case 'meal':
        await sendChatMessage('Tomé mi batido Solar Protein');
      case 'mood':
        await sendChatMessage('Hoy me siento un poco cansada');
      case 'adjust':
        await sendChatMessage(
          'Tengo una cena con amigos esta noche, ¿podemos ajustar el plan?',
        );
      case 'exercise':
        await sendChatMessage('Hice 45 minutos de yoga');
      case 'sleep':
        await sendChatMessage('Dormí 7 horas anoche');
    }
  }

  Future<void> _streamReply(
    String id,
    String fullText, {
    List<ChatSuggestionItem>? suggestions,
    List<String>? actionLabels,
  }) async {
    var current = '';
    for (var i = 0; i < fullText.length; i++) {
      await Future<void>.delayed(const Duration(milliseconds: 18));
      current += fullText[i];
      final updated = state.chatMessages.map((m) {
        if (m.id == id) {
          return m.copyWith(
            text: current,
            isStreaming: i < fullText.length - 1,
          );
        }
        return m;
      }).toList();
      state = state.copyWith(chatMessages: updated);
    }
    if (suggestions != null || actionLabels != null) {
      final updated = state.chatMessages.map((m) {
        if (m.id == id) {
          return m.copyWith(
            suggestions: suggestions,
            actionLabels: actionLabels,
          );
        }
        return m;
      }).toList();
      state = state.copyWith(chatMessages: updated);
    }
  }

  void toggleLoadingDemo(bool value) {
    state = state.copyWith(showLoading: value, showError: false);
  }

  void toggleErrorDemo(bool value) {
    state = state.copyWith(showError: value, showLoading: false);
  }
}

final appStateProvider = StateNotifierProvider<AppStateNotifier, AppState>((
  ref,
) {
  return AppStateNotifier(
    ref.watch(mockRepoProvider),
    ref.watch(sunnyRouterProvider),
    ref.watch(mockOrderServiceProvider),
  );
});

final productsProvider = FutureProvider<List<Product>>((ref) async {
  return ref.watch(mockRepoProvider).loadProducts();
});

final milestonesProvider = FutureProvider<List<Milestone>>((ref) async {
  final unlocked = ref.watch(appStateProvider).journey.unlockedMilestones;
  return ref.watch(mockRepoProvider).loadMilestones(unlocked: unlocked);
});
