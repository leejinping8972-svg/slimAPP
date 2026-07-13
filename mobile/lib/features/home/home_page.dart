import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ld_shell.dart';
import '../../core/widgets/ritual_sheets.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  bool _canSend = false;

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

  void _handleRitualTap(String title, UserProfile profile, TodayRecord record) {
    switch (title) {
      case 'Hydration':
        showHydrationSheet(
          context,
          ref,
          record,
          profile.hydrationTargetMl,
        );
      case 'Weight':
        showWeightSheet(context, ref, record, profile);
      case 'Sleep':
        showSleepSheet(context, ref, record);
      case 'Solar Protein™':
      case 'Your product':
        ref.read(appStateProvider.notifier).updateTodayRecord(
              record.copyWith(productTaken: ProductTakenStatus.taken),
            );
      default:
        if (title == profile.linkedProductName) {
          ref.read(appStateProvider.notifier).updateTodayRecord(
                record.copyWith(productTaken: ProductTakenStatus.taken),
              );
        }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStateProvider);
    final messages = state.chatMessages;
    final profile = state.profile;
    final journey = state.journey;
    final record = journey.todayRecord;

    ref.listen(appStateProvider, (_, __) => _scrollToBottom());

    final ritualItems = ritualItemsForPlan(
      profile: profile,
      record: record,
      onItemTap: (title) => _handleRitualTap(title, profile, record),
    );
    final pendingRituals = ritualItems.where((e) => !e.completed).length;
    final showMoodCard = _isEveningMoodWindow();

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            _HomeHeader(
              nickname: profile.nickname,
              onProfileTap: () => context.go('/me'),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: LuckdateSpacing.lg),
              child: Text(
                'Sunny provides lifestyle companionship — not medical advice.',
                style: LuckdateTextStyles.caption,
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Expanded(
              child: ListView(
                controller: _scrollController,
                padding: const EdgeInsets.all(LuckdateSpacing.lg),
                children: [
                  if (!profile.sunnyIntroSeen) ...[
                    _SunnyIntroCard(
                      onDismiss: () => ref
                          .read(appStateProvider.notifier)
                          .markSunnyIntroSeen(),
                    ),
                    const SizedBox(height: LuckdateSpacing.md),
                  ],
                  _DailyRitualCard(
                    pendingCount: pendingRituals,
                    items: ritualItems,
                  ),
                  const SizedBox(height: LuckdateSpacing.md),
                  _ProductRecCard(
                    planType: profile.userPlanType,
                    linkedProductName: profile.linkedProductName,
                    onBrowse: () => context.go('/mall'),
                    onViewPlan: () =>
                        context.push('/collection/product/solar_protein'),
                  ),
                  if (showMoodCard) ...[
                    const SizedBox(height: LuckdateSpacing.md),
                    _MoodCheckInCard(record: record),
                  ],
                  const SizedBox(height: LuckdateSpacing.lg),
                  ...messages.map((msg) {
                    return Padding(
                      padding:
                          const EdgeInsets.only(bottom: LuckdateSpacing.md),
                      child: msg.isUser
                          ? UserBubble(text: msg.text)
                          : SunnyBubble(
                              text: msg.text,
                              isStreaming: msg.isStreaming,
                            ),
                    );
                  }),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: LuckdateSpacing.lg),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _quickBtn('Water', 'water'),
                    _quickBtn('Meal', 'meal'),
                    _quickBtn('Adjust', 'adjust'),
                  ],
                ),
              ),
            ),
            LdChatComposer(
              controller: _controller,
              canSend: _canSend,
              onSend: _send,
            ),
          ],
        ),
      ),
    );
  }

  Widget _quickBtn(String label, String action) {
    return Padding(
      padding: const EdgeInsets.only(right: LuckdateSpacing.sm),
      child: LdChoiceChip(
        label: label,
        selected: false,
        onTap: () =>
            ref.read(appStateProvider.notifier).sendQuickAction(action),
      ),
    );
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    _controller.clear();
    ref.read(appStateProvider.notifier).sendChatMessage(text);
  }

  bool _isEveningMoodWindow() {
    final hour = DateTime.now().hour;
    return hour >= 20 && hour < 22;
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader({
    required this.nickname,
    required this.onProfileTap,
  });

  final String nickname;
  final VoidCallback onProfileTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        LuckdateSpacing.lg,
        LuckdateSpacing.sm,
        LuckdateSpacing.lg,
        LuckdateSpacing.md,
      ),
      decoration: const BoxDecoration(
        gradient: LuckdateGradients.pageHeader,
        border: Border(
          bottom: BorderSide(color: LuckdateColors.lineSoft, width: 0.5),
        ),
      ),
      child: Row(
        children: [
          const LdSunnyAvatar(size: 36),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Sunny', style: LuckdateTextStyles.title),
                Text(
                  'Your vitality companion',
                  style: LuckdateTextStyles.caption,
                ),
              ],
            ),
          ),
          LdProfileAvatar(
            nickname: nickname,
            radius: 18,
            onTap: onProfileTap,
          ),
        ],
      ),
    );
  }
}

class _SunnyIntroCard extends StatelessWidget {
  const _SunnyIntroCard({required this.onDismiss});

  final VoidCallback onDismiss;

  @override
  Widget build(BuildContext context) {
    return _SunnyCardFrame(
      child: LdCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const LdSunnyAvatar(size: 40),
                const SizedBox(width: LuckdateSpacing.md),
                Expanded(
                  child: Text(
                    'Hi, I am Sunny',
                    style: LuckdateTextStyles.title,
                  ),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.md),
            Text(
              'Your growth companion for daily rituals, gentle guidance, and product care. Log rituals right here — I will cheer you on.',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.md),
            LdPrimaryButton(label: 'Nice to meet you', onPressed: onDismiss),
          ],
        ),
      ),
    );
  }
}

class _DailyRitualCard extends StatelessWidget {
  const _DailyRitualCard({
    required this.pendingCount,
    required this.items,
  });

  final int pendingCount;
  final List<RitualLogItem> items;

  @override
  Widget build(BuildContext context) {
    final ordered = [
      ...items.where((e) => !e.completed),
      ...items.where((e) => e.completed),
    ];

    return _SunnyCardFrame(
      child: LdCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Today\'s Ritual', style: LuckdateTextStyles.title),
            const SizedBox(height: 4),
            Text(
              pendingCount > 0
                  ? '$pendingCount items left — tap to log'
                  : 'All rituals logged today ✓',
              style: LuckdateTextStyles.caption,
            ),
            const SizedBox(height: LuckdateSpacing.md),
            ...ordered.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
                child: RitualCard(
                  title: item.title,
                  subtitle: item.subtitle,
                  icon: item.icon,
                  completed: item.completed,
                  onTap: item.onTap,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProductRecCard extends StatelessWidget {
  const _ProductRecCard({
    required this.planType,
    required this.linkedProductName,
    required this.onBrowse,
    required this.onViewPlan,
  });

  final UserPlanType planType;
  final String linkedProductName;
  final VoidCallback onBrowse;
  final VoidCallback onViewPlan;

  @override
  Widget build(BuildContext context) {
    final (title, body, cta, action) = switch (planType) {
      UserPlanType.noProduct => (
          'Unlock your 28-day plan',
          'Solar Protein starts your Slim Journey — rituals, tracking, and Sunny support.',
          'View 28-Day Plan',
          onViewPlan,
        ),
      UserPlanType.nonMealReplacement => (
          'Complement your routine',
          linkedProductName.isEmpty
              ? 'Browse nutrition picks that pair well with your product.'
              : 'More picks to support $linkedProductName and your daily rhythm.',
          'Browse Mall',
          onBrowse,
        ),
      UserPlanType.mealReplacement => (
          'Additional Nutrition',
          'Curated picks to complement your Solar Protein ritual.',
          'Browse Mall',
          onBrowse,
        ),
    };

    return _SunnyCardFrame(
      child: LdCard(
        onTap: action,
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: LuckdateColors.sunGold.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.local_mall_outlined,
                color: LuckdateColors.chocolateBrown,
              ),
            ),
            const SizedBox(width: LuckdateSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: LuckdateTextStyles.title),
                  Text(body, style: LuckdateTextStyles.bodySmall),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    '$cta →',
                    style: LuckdateTextStyles.caption.copyWith(
                      color: LuckdateColors.deepSage,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MoodCheckInCard extends ConsumerWidget {
  const _MoodCheckInCard({required this.record});

  final TodayRecord record;

  static const _moods = [
    ('great', '😊', 'Great'),
    ('okay', '😐', 'Okay'),
    ('tired', '😴', 'Tired'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return _SunnyCardFrame(
      child: LdCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Evening check-in', style: LuckdateTextStyles.title),
            const SizedBox(height: 4),
            Text(
              'How are you feeling tonight?',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.md),
            Wrap(
              spacing: LuckdateSpacing.sm,
              runSpacing: LuckdateSpacing.sm,
              children: _moods.map((mood) {
                final selected = record.moodTag == mood.$1;
                return Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () =>
                        ref.read(appStateProvider.notifier).logMood(mood.$1),
                    borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                    child: Ink(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: selected
                            ? LuckdateColors.sageSoft
                            : Colors.transparent,
                        borderRadius:
                            BorderRadius.circular(LuckdateRadius.pill),
                        border: Border.all(
                          color: selected
                              ? LuckdateColors.deepSage
                              : LuckdateColors.lineSoft,
                        ),
                      ),
                      child: Text(
                        '${mood.$2} ${mood.$3}',
                        style: LuckdateTextStyles.caption.copyWith(
                          fontWeight:
                              selected ? FontWeight.w600 : FontWeight.w400,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _SunnyCardFrame extends StatelessWidget {
  const _SunnyCardFrame({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const LdSunnyAvatar(size: 32),
        const SizedBox(width: LuckdateSpacing.sm),
        Expanded(child: child),
      ],
    );
  }
}
