import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ld_shell.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/onboarding_chat_guide.dart';

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
    ('☀️', 'Daily Ritual'),
    ('💧', 'I drank a glass of water'),
    ('🏃', 'I did 45 minutes of yoga'),
    ('🥗', 'I ate a chicken salad for lunch'),
    ('😴', 'I slept 7 hours last night'),
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
        title: const Text('Journey Complete'),
        content: const Text(
          'You grew toward the light for 28 days. View your completion report and explore your next journey.',
        ),
        actions: [
          TextButton(
            onPressed: () {
              ref.read(appStateProvider.notifier).markJourneyCompleteSeen();
              Navigator.pop(ctx);
            },
            child: const Text('Not now'),
          ),
          TextButton(
            onPressed: () {
              ref.read(appStateProvider.notifier).markJourneyCompleteSeen();
              Navigator.pop(ctx);
              context.push('/journey/report');
            },
            child: const Text('View report'),
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

  void _onActionTap(String label) {
    if (label == '立即获取') {
      ref.read(appStateProvider.notifier).sendChatMessage('立即获取');
      return;
    }
    if (label == 'View Detailed Plan' || label == 'View My Plan') {
      context.push('/plan');
    } else if (label == 'Browse Mall') {
      context.go('/mall');
    } else if (label == 'Set Sleep Goal' ||
        label == 'Enter Day 1' ||
        label == 'Start Day 1 Ritual' ||
        label == 'Start Day 1 Check-in' ||
        label == 'Go to Ritual') {
      context.go('/ritual');
    } else if (label == 'Log Water') {
      ref.read(appStateProvider.notifier).sendQuickAction('water');
    } else if (label == 'Log Meal') {
      ref.read(appStateProvider.notifier).sendQuickAction('meal');
    } else if (label == 'Log Sleep') {
      ref.read(appStateProvider.notifier).sendQuickAction('sleep');
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStateProvider);
    final messages = state.chatMessages;
    final profile = state.profile;

    ref.listen(appStateProvider, (_, __) => _scrollToBottom());

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            _HomeHeader(
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
            _QuickAskRow(
              items: profile.onboardingComplete
                  ? _quickAsks
                  : OnboardingChatGuide.quickAsksFor(
                      profile.onboardingStep.isEmpty
                          ? 'privacy'
                          : profile.onboardingStep,
                    ),
              onTap: (text) {
                if (text == 'Daily Ritual') {
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
              hintText: 'Chat with Sunny...',
              disclaimer:
                  'Sunny may make mistakes. Please use for reference based on your own situation.',
            ),
          ],
        ),
      ),
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
  const _HomeHeader({required this.onBack});

  final VoidCallback onBack;

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
                  'Sunny AI Chat',
                  style: LuckdateTextStyles.title.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  'Your Vitality Companion',
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
    required this.onLearnMore,
  });

  final String nickname;
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
                        'AI Companion',
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
                  'Hi $nickname, I\'m Sunny. What would you like to chat about today?',
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
                      'Learn about Sunny >',
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
  const _QuickAskRow({required this.items, required this.onTap});

  final List<(String, String)> items;
  final ValueChanged<String> onTap;

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
          Text('You might want to ask', style: LuckdateTextStyles.caption),
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
