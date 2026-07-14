import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';

class SunnySuggestionPage extends ConsumerStatefulWidget {
  const SunnySuggestionPage({super.key});

  @override
  ConsumerState<SunnySuggestionPage> createState() =>
      _SunnySuggestionPageState();
}

class _SunnySuggestionPageState extends ConsumerState<SunnySuggestionPage> {
  int? _feedbackIndex;

  @override
  Widget build(BuildContext context) {
    final journey = ref.watch(appStateProvider).journey;
    final now = DateTime.now();
    final dateLabel = DateFormat('EEEE, MMMM d, y').format(now);

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            _Header(
              onBack: () => context.go('/ritual'),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.sm,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.xl,
                ),
                children: [
                  _IntroRow(
                    dateLabel: dateLabel,
                    day: journey.day,
                  ),
                  const SizedBox(height: LuckdateSpacing.lg),
                  const _ThemeBanner(),
                  const SizedBox(height: LuckdateSpacing.lg),
                  _PlanCard(
                    onComplete: (route) {
                      if (route != null) context.go(route);
                    },
                  ),
                  const SizedBox(height: LuckdateSpacing.lg),
                  const _TipCard(),
                  const SizedBox(height: LuckdateSpacing.lg),
                  const _QuoteCard(),
                  const SizedBox(height: LuckdateSpacing.xl),
                  Text(
                    'Was this suggestion helpful?',
                    style: LuckdateTextStyles.title,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: LuckdateSpacing.md),
                  _FeedbackRow(
                    selected: _feedbackIndex,
                    onSelect: (i) => setState(() => _feedbackIndex = i),
                  ),
                  const SizedBox(height: LuckdateSpacing.lg),
                  Text(
                    'Suggestions are generated based on your data and goals, for reference only.',
                    style: LuckdateTextStyles.caption,
                    textAlign: TextAlign.center,
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

class _Header extends StatelessWidget {
  const _Header({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        LuckdateSpacing.sm,
        LuckdateSpacing.sm,
        LuckdateSpacing.sm,
        LuckdateSpacing.md,
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: onBack,
            icon: const Icon(Icons.arrow_back_ios_new, size: 18),
            color: LuckdateColors.textPrimary,
          ),
          Expanded(
            child: Text(
              'Sunny Suggestion Card',
              textAlign: TextAlign.center,
              style: LuckdateTextStyles.title,
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.ios_share_rounded, size: 20),
            color: LuckdateColors.textPrimary,
          ),
        ],
      ),
    );
  }
}

class _IntroRow extends StatelessWidget {
  const _IntroRow({required this.dateLabel, required this.day});

  final String dateLabel;
  final int day;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const LdSunnyAvatar(size: 52),
        const SizedBox(width: LuckdateSpacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Recommended for you by Sunny',
                style: LuckdateTextStyles.title,
              ),
              const SizedBox(height: 4),
              Text(
                'Scientific · Personalized · Growth Companion',
                style: LuckdateTextStyles.caption,
              ),
            ],
          ),
        ),
        const SizedBox(width: LuckdateSpacing.sm),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(dateLabel, style: LuckdateTextStyles.caption),
            const SizedBox(height: 4),
            Text(
              'Day $day',
              style: LuckdateTextStyles.caption.copyWith(
                color: LuckdateColors.deepSage,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _ThemeBanner extends StatelessWidget {
  const _ThemeBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.base),
      decoration: BoxDecoration(
        color: LuckdateColors.mossDark,
        borderRadius: BorderRadius.circular(LuckdateRadius.xl),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: LuckdateColors.ivoryWhite.withValues(alpha: 0.16),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.eco_rounded,
              color: LuckdateColors.ivoryWhite,
              size: 20,
            ),
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Today\'s Theme: Stability · Enhance Focus',
                  style: LuckdateTextStyles.title.copyWith(
                    color: LuckdateColors.ivoryWhite,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Focus is the amplifier of vitality — let\'s stay clear and efficient today ✨',
                  style: LuckdateTextStyles.bodySmall.copyWith(
                    color: LuckdateColors.ivoryWhite.withValues(alpha: 0.9),
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

class _PlanCard extends StatelessWidget {
  const _PlanCard({required this.onComplete});

  final ValueChanged<String?> onComplete;

  static const _tasks = [
    (
      Icons.wb_sunny_outlined,
      'Daily Ritual Check-in',
      'Log hydration, sleep, and product rituals to keep your vitality streak.',
      '/ritual',
    ),
    (
      Icons.schedule_rounded,
      '10-Minute Morning Meditation',
      'Clear your mind, stabilize emotions, and set a focus mode for your brain.',
      null,
    ),
    (
      Icons.psychology_outlined,
      'Omega-3 Supplement',
      'Supports brain health and helps improve attention and memory.',
      null,
    ),
    (
      Icons.water_drop_outlined,
      'Drink 2 Cups of Water',
      'Stay hydrated to improve brain efficiency.',
      '/ritual',
    ),
    (
      Icons.directions_run_rounded,
      '30-Minute Moderate Exercise',
      'Boosts dopamine, enhancing focus and mood.',
      null,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.track_changes_rounded,
                color: LuckdateColors.deepSage,
                size: 22,
              ),
              const SizedBox(width: LuckdateSpacing.sm),
              Text('Focus Enhancement Plan', style: LuckdateTextStyles.title),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          Text(
            'Improving focus needs science and good habits. Try these suggestions!',
            style: LuckdateTextStyles.bodySmall,
          ),
          const SizedBox(height: LuckdateSpacing.md),
          ..._tasks.map((task) {
            return Padding(
              padding: const EdgeInsets.only(bottom: LuckdateSpacing.md),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: LuckdateColors.sageSoft,
                      borderRadius: BorderRadius.circular(LuckdateRadius.md),
                    ),
                    child: Icon(
                      task.$1,
                      size: 20,
                      color: LuckdateColors.deepSage,
                    ),
                  ),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          task.$2,
                          style: LuckdateTextStyles.body.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(task.$3, style: LuckdateTextStyles.caption),
                      ],
                    ),
                  ),
                  const SizedBox(width: LuckdateSpacing.sm),
                  OutlinedButton(
                    onPressed: () => onComplete(task.$4 ?? '/ritual'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: LuckdateColors.textPrimary,
                      backgroundColor: LuckdateColors.cloudIvory,
                      side: const BorderSide(color: LuckdateColors.lineSoft),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 8,
                      ),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                      ),
                    ),
                    child: Text(
                      'Complete',
                      style: LuckdateTextStyles.caption.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _TipCard extends StatelessWidget {
  const _TipCard();

  @override
  Widget build(BuildContext context) {
    return LdCard(
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.auto_awesome_rounded,
                      size: 18,
                      color: LuckdateColors.sunGold,
                    ),
                    const SizedBox(width: LuckdateSpacing.sm),
                    Text('Today\'s Tip', style: LuckdateTextStyles.title),
                  ],
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                Text(
                  'Pomodoro Technique: 25 mins focus + 5 mins rest to finish tasks efficiently and avoid fatigue.',
                  style: LuckdateTextStyles.bodySmall,
                ),
              ],
            ),
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: const Color(0xFFFFE8E0),
              borderRadius: BorderRadius.circular(LuckdateRadius.lg),
            ),
            child: const Icon(
              Icons.timer_outlined,
              size: 36,
              color: Color(0xFFE25B45),
            ),
          ),
        ],
      ),
    );
  }
}

class _QuoteCard extends StatelessWidget {
  const _QuoteCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.lg),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(LuckdateRadius.xl),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFEFE6DA), Color(0xFFD8C4B0)],
        ),
        boxShadow: LuckdateShadows.soft,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '“',
            style: LuckdateTextStyles.display.copyWith(
              color: LuckdateColors.deepSage.withValues(alpha: 0.45),
              fontSize: 48,
              height: 1,
            ),
          ),
          Text(
            'Focus on every step of the present; your future self will thank you.',
            style: LuckdateTextStyles.title.copyWith(
              fontWeight: FontWeight.w500,
              height: 1.45,
            ),
          ),
        ],
      ),
    );
  }
}

class _FeedbackRow extends StatelessWidget {
  const _FeedbackRow({required this.selected, required this.onSelect});

  final int? selected;
  final ValueChanged<int> onSelect;

  static const _items = [
    ('😣', 'Not at all'),
    ('😕', 'Not helpful'),
    ('😐', 'Neutral'),
    ('🙂', 'Helpful'),
    ('🤗', 'Very helpful'),
  ];

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(_items.length, (index) {
        final item = _items[index];
        final isSelected = selected == index;
        return Expanded(
          child: InkWell(
            onTap: () => onSelect(index),
            borderRadius: BorderRadius.circular(LuckdateRadius.md),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Column(
                children: [
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 160),
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? LuckdateColors.sageSoft
                          : Colors.transparent,
                      shape: BoxShape.circle,
                    ),
                    child: Text(item.$1, style: const TextStyle(fontSize: 22)),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.$2,
                    textAlign: TextAlign.center,
                    style: LuckdateTextStyles.caption.copyWith(
                      fontSize: 9,
                      color: isSelected
                          ? LuckdateColors.deepSage
                          : LuckdateColors.textSecondary,
                      fontWeight:
                          isSelected ? FontWeight.w600 : FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }),
    );
  }
}
