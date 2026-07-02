import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/models.dart';
import '../repositories/mock_data_repository.dart';
import '../services/sunny_intent_router.dart';
import '../services/vitality_scorer.dart';

final mockRepoProvider = Provider<MockDataRepository>((ref) => MockDataRepository());

final sunnyRouterProvider = Provider<SunnyIntentRouter>((ref) => SunnyIntentRouter());

class AppState {
  const AppState({
    required this.profile,
    required this.demoDay,
    required this.journey,
    required this.chatMessages,
    required this.showLoading,
    required this.showError,
  });

  final UserProfile profile;
  final DemoDay demoDay;
  final JourneyState journey;
  final List<ChatMessage> chatMessages;
  final bool showLoading;
  final bool showError;

  AppState copyWith({
    UserProfile? profile,
    DemoDay? demoDay,
    JourneyState? journey,
    List<ChatMessage>? chatMessages,
    bool? showLoading,
    bool? showError,
  }) {
    return AppState(
      profile: profile ?? this.profile,
      demoDay: demoDay ?? this.demoDay,
      journey: journey ?? this.journey,
      chatMessages: chatMessages ?? this.chatMessages,
      showLoading: showLoading ?? this.showLoading,
      showError: showError ?? this.showError,
    );
  }
}

class AppStateNotifier extends StateNotifier<AppState> {
  AppStateNotifier(this._repo, this._router)
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

  void setLoggedIn() {
    state = state.copyWith(
      profile: state.profile.copyWith(isLoggedIn: true),
    );
  }

  void clearLoginSession() {
    state = state.copyWith(
      profile: state.profile.copyWith(isLoggedIn: false),
    );
  }

  void setActivationCode(String code) {
    state = state.copyWith(
      profile: state.profile.copyWith(activationCode: code),
    );
  }

  void updateProfile(UserProfile profile) {
    state = state.copyWith(profile: profile);
  }

  void completeOnboarding(UserProfile profile) {
    final journey = _repo.journeyForDay(DemoDay.day1);
    state = state.copyWith(
      profile: profile.copyWith(onboardingComplete: true, isLoggedIn: true),
      demoDay: DemoDay.day1,
      journey: journey,
      chatMessages: _repo.initialChatMessages(1),
    );
  }

  void switchDemoDay(DemoDay day) {
    final journey = _repo.journeyForDay(day);
    state = state.copyWith(
      demoDay: day,
      journey: journey,
      chatMessages: _repo.initialChatMessages(journey.day),
    );
  }

  void updateTodayRecord(TodayRecord record) {
    final scores = VitalityScorer.calculate(
      record: record,
      hydrationTargetMl: state.profile.hydrationTargetMl,
      consistency7d: record.consistency7d,
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

    final result = _router.route(
      input: text,
      today: state.journey.todayRecord,
      journeyDay: state.journey.day,
      hydrationTargetMl: state.profile.hydrationTargetMl,
      nickname: state.profile.nickname,
    );

    if (result.todayUpdates != null) {
      updateTodayRecord(result.todayUpdates!);
    }

    await _streamReply(placeholder.id, result.reply);
  }

  Future<void> sendQuickAction(String action) async {
    switch (action) {
      case 'water':
        await sendChatMessage('I drank a glass of water');
      case 'meal':
        await sendChatMessage('I had my Solar Protein shake');
      case 'mood':
        await sendChatMessage('I feel a bit tired today');
      case 'adjust':
        await sendChatMessage('I have a dinner party tonight, can we adjust?');
    }
  }

  Future<void> _streamReply(String id, String fullText) async {
    var current = '';
    for (var i = 0; i < fullText.length; i++) {
      await Future<void>.delayed(const Duration(milliseconds: 18));
      current += fullText[i];
      final updated = state.chatMessages.map((m) {
        if (m.id == id) {
          return m.copyWith(text: current, isStreaming: i < fullText.length - 1);
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

final appStateProvider =
    StateNotifierProvider<AppStateNotifier, AppState>((ref) {
  return AppStateNotifier(
    ref.watch(mockRepoProvider),
    ref.watch(sunnyRouterProvider),
  );
});

final productsProvider = FutureProvider<List<Product>>((ref) async {
  return ref.watch(mockRepoProvider).loadProducts();
});

final milestonesProvider = FutureProvider<List<Milestone>>((ref) async {
  final unlocked = ref.watch(appStateProvider).journey.unlockedMilestones;
  return ref.watch(mockRepoProvider).loadMilestones(unlocked: unlocked);
});
