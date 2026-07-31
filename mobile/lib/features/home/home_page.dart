import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ld_shell.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/onboarding_chat_guide.dart';
import '../../shared/ui/contact_support.dart';
import '../../shared/l10n/app_strings.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  bool _canSend = false;

  static const _quickAsks = [
    ('☀️', 'Recorrido diario'),
    ('💧', 'Tomé un vaso de agua'),
    ('🏃', 'Hice 45 minutos de yoga'),
    ('🥗', 'Comí una ensalada de pollo en el almuerzo'),
    ('😴', 'Dormí 7 horas anoche'),
  ];

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      final canSend = _controller.text.trim().isNotEmpty;
      if (canSend != _canSend) setState(() => _canSend = canSend);
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _maybeShowJourneyComplete());
  }

  void _maybeShowJourneyComplete() {
    final state = ref.read(appStateProvider);
    final profile = state.profile;
    final journey = state.journey;
    if (!mounted) return;
    if (profile.userPlanType != UserPlanType.mealReplacement) return;
    if (journey.day < 28 || profile.journeyCompleteSeen) return;

    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Recorrido completado'),
        content: const Text(
          'Avanzaste hacia la luz durante 28 días. Consulta tu reporte final y explora tu próximo recorrido.',
        ),
        actions: [
          TextButton(
            onPressed: () {
              ref.read(appStateProvider.notifier).markJourneyCompleteSeen();
              Navigator.pop(ctx);
            },
            child: const Text('Ahora no'),
          ),
          TextButton(
            onPressed: () {
              ref.read(appStateProvider.notifier).markJourneyCompleteSeen();
              Navigator.pop(ctx);
              context.push('/journey/report');
            },
            child: const Text('Ver reporte'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 240),
          curve: Curves.easeOut,
        );
      }
    });
  }

  bool _hasInlineActions(List<ChatMessage> messages) {
    for (var i = messages.length - 1; i >= 0; i--) {
      final msg = messages[i];
      if (msg.isUser) continue;
      final labels = msg.actionLabels;
      return labels != null && labels.isNotEmpty;
    }
    return false;
  }

  void _onActionTap(String label) {
    // Plan-offer / onboarding choices — labels must match emitters exactly.
    if (label == 'Obtener un plan' ||
        label == 'Obtener plan' ||
        label == 'Obtenerlo ahora' ||
        label == 'Solo ayuda con productos' ||
        label == 'Solo explorar' ||
        label == 'Solo estoy explorando' ||
        label == 'Ahora no') {
      ref.read(appStateProvider.notifier).sendChatMessage(label);
      return;
    }
    // Health-need chips (no-product onboarding) — send as chat text.
    final healthActions = [
      ...OnboardingChatGuide.healthNeedActions,
      ...AppStrings.fromCode('zh').healthNeedActions,
    ];
    if (healthActions.contains(label)) {
      ref.read(appStateProvider.notifier).sendChatMessage(label);
      return;
    }
    if (label == ContactSupport.label ||
        label == ContactSupport.legacyLabel ||
        label == '通过 Messenger 咨询' ||
        label == 'Hablar por Messenger' ||
        ContactSupport.matchesLabel(label)) {
      final zh = ref.read(appStateProvider).profile.language.startsWith('zh');
      ContactSupport.show(context, zh: zh);
      return;
    }
    // Shell branches: always go() — push() from /home or across branches
    // blanks the IndexedStack body.
    if (label == 'Ver plan detallado' ||
        label == 'Ver mi plan' ||
        label == '查看方案' ||
        label == '查看我的方案') {
      context.go('/plan');
      return;
    }
    if (label == 'Vincular pedido' || label == '关联订单') {
      // Post-registration bind remains available; upgrade upsells use CS.
      context.push('/link-order');
      return;
    }
    if (label == 'Establecer meta de sueño' ||
        label == 'Entrar al día 1' ||
        label == 'Iniciar ritual del día 1' ||
        label == 'Iniciar registro del día 1' ||
        label == 'Comenzar el registro del Día 1' ||
        label == 'Ir al ritual' ||
        label == 'Ir al recorrido' ||
        label == 'Ir al viaje' ||
        label == '前往旅程') {
      context.go('/ritual');
      return;
    }
    if (label == 'Registrar agua' || label == '记录喝水') {
      ref.read(appStateProvider.notifier).sendQuickAction('water');
      return;
    }
    if (label == 'Registrar comida' || label == '记录饮食') {
      ref.read(appStateProvider.notifier).sendQuickAction('meal');
      return;
    }
    if (label == 'Registrar sueño' || label == '记录睡眠') {
      ref.read(appStateProvider.notifier).sendQuickAction('sleep');
      return;
    }
    // Fallback: treat unknown action chips as chat text so buttons never no-op.
    ref.read(appStateProvider.notifier).sendChatMessage(label);
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStateProvider);
    final messages = state.chatMessages;
    final profile = state.profile;
    final strings = ref.watch(appStringsProvider);

    ref.listen(appStateProvider, (_, __) => _scrollToBottom());

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            _HomeHeader(
              title: strings.chatWithSunny,
              subtitle: strings.sunnySubtitle,
              onBack: () {
                if (context.canPop()) {
                  context.pop();
                } else {
                  context.go('/ritual');
                }
              },
            ),
            Expanded(
              child: ListView(
                controller: _scrollController,
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.sm,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.md,
                ),
                children: [
                  if (profile.onboardingComplete) ...[
                    _SunnyIntroCard(
                      nickname: profile.nickname,
                      companionLabel:
                          strings.isZh ? 'AI 伙伴' : 'Compañera de IA',
                      greeting: strings.isZh
                          ? '你好，${profile.nickname}。我是 Sunny。今天想聊点什么？'
                          : 'Hola, ${profile.nickname}. Soy Sunny. ¿Sobre qué te gustaría platicar hoy?',
                      learnMoreLabel:
                          strings.isZh ? '认识 Sunny >' : 'Conoce a Sunny >',
                      onLearnMore: () => context.push('/sunny/suggestions'),
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                  ],
                  ...messages.map((msg) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: LuckdateSpacing.md),
                      child: msg.isUser
                          ? UserBubble(
                              text: msg.text,
                              timestamp: msg.timestamp,
                              nickname: profile.nickname,
                            )
                          : SunnyBubble(
                              text: msg.text,
                              isStreaming: msg.isStreaming,
                              timestamp: msg.timestamp,
                              suggestions: msg.suggestions,
                              actionLabels: msg.actionLabels,
                              onActionTap: _onActionTap,
                            ),
                    );
                  }),
                ],
              ),
            ),
            if (!_hasInlineActions(messages))
              _QuickAskRow(
                title: strings.isZh ? '你可能想问' : 'Quizá quieras preguntar',
                items: _localizedQuickAsks(profile),
                onTap: (text) {
                  if (text == 'Recorrido diario' ||
                      text == 'Ritual diario' ||
                      text == '每日旅程') {
                    context.go('/ritual');
                    return;
                  }
                  ref.read(appStateProvider.notifier).sendChatMessage(text);
                },
              ),
            LdChatComposer(
              controller: _controller,
              canSend: _canSend,
              onSend: _send,
              hintText: strings.chatHint,
              disclaimer: strings.chatDisclaimer,
            ),
          ],
        ),
      ),
    );
  }

  List<(String, String)> _localizedQuickAsks(UserProfile profile) {
    final zh = profile.language == 'zh' || profile.language.startsWith('zh');
    if (profile.onboardingComplete) {
      return zh
          ? const [
              ('☀️', '每日旅程'),
              ('💧', '我喝了一杯水'),
              ('🏃', '我做了 45 分钟瑜伽'),
              ('🥗', '午餐吃了鸡肉沙拉'),
              ('😴', '昨晚睡了 7 小时'),
            ]
          : _quickAsks;
    }
    return OnboardingChatGuide.quickAsksFor(
      profile.onboardingStep.isEmpty ? 'privacy' : profile.onboardingStep,
      language: profile.language,
    );
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    _controller.clear();
    ref.read(appStateProvider.notifier).sendChatMessage(text);
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader({
    required this.onBack,
    required this.title,
    required this.subtitle,
  });

  final VoidCallback onBack;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        LuckdateSpacing.sm,
        LuckdateSpacing.sm,
        LuckdateSpacing.sm,
        LuckdateSpacing.md,
      ),
      decoration: const BoxDecoration(
        color: LuckdateColors.cloudIvory,
        border: Border(
          bottom: BorderSide(color: LuckdateColors.lineSoft, width: 0.5),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: onBack,
            icon: const Icon(Icons.arrow_back_ios_new, size: 18),
            color: LuckdateColors.textPrimary,
          ),
          Expanded(
            child: Column(
              children: [
                Text(
                  title,
                  style: LuckdateTextStyles.title.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  subtitle,
                  style: LuckdateTextStyles.caption,
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.more_horiz, size: 22),
            color: LuckdateColors.textPrimary,
          ),
        ],
      ),
    );
  }
}

class _SunnyIntroCard extends StatelessWidget {
  const _SunnyIntroCard({
    required this.nickname,
    required this.companionLabel,
    required this.greeting,
    required this.learnMoreLabel,
    required this.onLearnMore,
  });

  final String nickname;
  final String companionLabel;
  final String greeting;
  final String learnMoreLabel;
  final VoidCallback onLearnMore;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(LuckdateSpacing.base),
      decoration: BoxDecoration(
        color: const Color(0xFFF9F6F1),
        borderRadius: BorderRadius.circular(LuckdateRadius.xl),
        border: Border.all(color: LuckdateColors.lineSoft.withValues(alpha: 0.7)),
        boxShadow: LuckdateShadows.soft,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const LdSunnyAvatar(size: 44),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  crossAxisAlignment: WrapCrossAlignment.center,
                  spacing: LuckdateSpacing.sm,
                  children: [
                    Text(
                      'Sunny ☀️',
                      style: LuckdateTextStyles.title.copyWith(fontSize: 15),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: LuckdateColors.ivoryWhite,
                        borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                        border: Border.all(color: LuckdateColors.lineSoft),
                      ),
                      child: Text(
                        companionLabel,
                        style: LuckdateTextStyles.caption.copyWith(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  greeting,
                  style: LuckdateTextStyles.bodySmall,
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                Align(
                  alignment: Alignment.centerRight,
                  child: OutlinedButton(
                    onPressed: onLearnMore,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: LuckdateColors.chocolateBrown,
                      side: const BorderSide(color: LuckdateColors.lineSoft),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 8,
                      ),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(LuckdateRadius.pill),
                      ),
                    ),
                    child: Text(
                      learnMoreLabel,
                      style: LuckdateTextStyles.caption.copyWith(
                        fontWeight: FontWeight.w600,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickAskRow extends StatelessWidget {
  const _QuickAskRow({
    required this.items,
    required this.onTap,
    required this.title,
  });

  final List<(String, String)> items;
  final ValueChanged<String> onTap;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        LuckdateSpacing.lg,
        0,
        LuckdateSpacing.lg,
        LuckdateSpacing.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: LuckdateTextStyles.caption),
          const SizedBox(height: LuckdateSpacing.sm),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: items.map((item) {
                return Padding(
                  padding: const EdgeInsets.only(right: LuckdateSpacing.sm),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => onTap(item.$2),
                      borderRadius:
                          BorderRadius.circular(LuckdateRadius.pill),
                      child: Ink(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: LuckdateColors.ivoryWhite,
                          borderRadius:
                              BorderRadius.circular(LuckdateRadius.pill),
                          border: Border.all(color: LuckdateColors.lineSoft),
                        ),
                        child: Text(
                          '${item.$1} ${item.$2}',
                          style: LuckdateTextStyles.caption.copyWith(
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
