import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

class PlanPage extends ConsumerWidget {
  const PlanPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    final profile = state.profile;

    return switch (profile.userPlanType) {
      UserPlanType.mealReplacement => _MealPlanView(
          journey: state.journey,
          profile: profile,
        ),
      UserPlanType.noProduct => _PurchaseGuideView(
          hideCard: profile.hidePurchaseGuideCard,
          onBrowse: () => context.go('/mall'),
          onViewPlan: () =>
              context.push('/collection/product/solar_protein'),
          onDismiss: () =>
              ref.read(appStateProvider.notifier).hidePurchaseGuideCard(),
        ),
      UserPlanType.nonMealReplacement => _ProductCarePlanView(
          profile: profile,
          journey: state.journey,
          onBrowse: () => context.go('/mall'),
        ),
    };
  }
}

class _MealPlanView extends ConsumerWidget {
  const _MealPlanView({required this.journey, required this.profile});

  final JourneyState journey;
  final UserProfile profile;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final milestonesAsync = ref.watch(milestonesProvider);

    return LdScaffold(
      title: '28-Day Plan',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _PlanTimeline(currentDay: journey.day, totalDays: journey.totalDays),
            const SizedBox(height: LuckdateSpacing.xl),
            Center(
              child: LdProgressRing(
                percent: journey.completionPercent.toDouble(),
                centerLabel: '${journey.completionPercent}%',
                subLabel: 'Day ${journey.day} / ${journey.totalDays}',
                ringColor: LuckdateColors.deepSage,
              ),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Center(
              child: Text(journey.themeEn, style: LuckdateTextStyles.title),
            ),
            Center(
              child: Text(
                journey.encouragement,
                style: LuckdateTextStyles.bodySmall,
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Text('Phase: ${journey.phase}', style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.md),
            _phaseCard('Launch', 'Days 1-7', journey.day <= 7),
            _phaseCard('Adaptation', 'Days 8-14', journey.day > 7 && journey.day <= 14),
            _phaseCard('Stability', 'Days 15-21', journey.day > 14 && journey.day <= 21),
            _phaseCard('Completion', 'Days 22-28', journey.day > 21),
            const SizedBox(height: LuckdateSpacing.xl),
            Text('Day Map', style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.md),
            _dayMap(journey),
            const SizedBox(height: LuckdateSpacing.sm),
            Row(
              children: [
                _legendDot(LuckdateColors.deepSage, 'Completed'),
                const SizedBox(width: LuckdateSpacing.md),
                _legendDot(LuckdateColors.sunGold, 'Today'),
                const SizedBox(width: LuckdateSpacing.md),
                _legendDot(
                  LuckdateColors.lineSoft.withValues(alpha: 0.8),
                  'Upcoming',
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Text('Milestones', style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.md),
            milestonesAsync.when(
              data: (list) => Column(
                children: list.map((m) {
                  return Padding(
                    padding:
                        const EdgeInsets.only(bottom: LuckdateSpacing.sm),
                    child: BadgeCard(
                      day: m.day,
                      title: m.title,
                      description: m.description,
                      unlocked: m.unlocked,
                    ),
                  );
                }).toList(),
              ),
              loading: () => const StatePlaceholder(type: 'loading'),
              error: (_, __) => const StatePlaceholder(type: 'error'),
            ),
            if (journey.day >= 28) ...[
              const SizedBox(height: LuckdateSpacing.xl),
              LdPrimaryButton(
                label: 'View Day 28 Report',
                onPressed: () => context.push('/journey/report'),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _phaseCard(String name, String range, bool active) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: LdCard(
        completed: active,
        child: Row(
          children: [
            Icon(
              active ? Icons.wb_sunny_rounded : Icons.wb_sunny_outlined,
              color: active
                  ? LuckdateColors.sunGold
                  : LuckdateColors.textSecondary,
            ),
            const SizedBox(width: LuckdateSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: LuckdateTextStyles.title),
                  Text(range, style: LuckdateTextStyles.caption),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _dayMap(JourneyState journey) {
    return Wrap(
      spacing: 6,
      runSpacing: 6,
      children: List.generate(28, (i) {
        final status = journey.dayStatuses[i];
        final isMilestone = [0, 13, 20, 27].contains(i);
        Color color;
        if (status == 'completed') {
          color = LuckdateColors.deepSage;
        } else if (status == 'today') {
          color = LuckdateColors.sunGold;
        } else {
          color = LuckdateColors.lineSoft;
        }
        return Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: color.withValues(alpha: status == 'open' ? 0.4 : 1),
            shape: BoxShape.circle,
          ),
          child: isMilestone
              ? Icon(
                  Icons.star,
                  size: 14,
                  color: status == 'open'
                      ? LuckdateColors.textSecondary
                      : LuckdateColors.ivoryWhite,
                )
              : Center(
                  child: Text(
                    '${i + 1}',
                    style: LuckdateTextStyles.caption.copyWith(
                      color: status == 'open'
                          ? LuckdateColors.textSecondary
                          : LuckdateColors.ivoryWhite,
                      fontSize: 9,
                    ),
                  ),
                ),
        );
      }),
    );
  }
}

class _PurchaseGuideView extends StatelessWidget {
  const _PurchaseGuideView({
    required this.hideCard,
    required this.onBrowse,
    required this.onViewPlan,
    required this.onDismiss,
  });

  final bool hideCard;
  final VoidCallback onBrowse;
  final VoidCallback onViewPlan;
  final VoidCallback onDismiss;

  @override
  Widget build(BuildContext context) {
    return LdScaffold(
      title: 'Plan',
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Start your 28-day journey', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Solar Protein unlocks the full Slim Journey — daily rituals, milestones, and Sunny support.',
              style: LuckdateTextStyles.body,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            if (!hideCard)
              LdCard(
                accentColor: LuckdateColors.sunGold,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Unlock your full health plan',
                      style: LuckdateTextStyles.title,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Get Solar Protein to start your 28-day Slim Journey.',
                      style: LuckdateTextStyles.bodySmall,
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    LdPrimaryButton(
                      label: 'View 28-Day Plan',
                      onPressed: onViewPlan,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Row(
                      children: [
                        Expanded(
                          child: LdSecondaryButton(
                            label: 'Browse Mall',
                            onPressed: onBrowse,
                          ),
                        ),
                        TextButton(
                          onPressed: onDismiss,
                          child: const Text('Dismiss'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            const Spacer(),
            LdPrimaryButton(label: 'Browse Mall', onPressed: onBrowse),
          ],
        ),
      ),
    );
  }
}

class _ProductCarePlanView extends StatelessWidget {
  const _ProductCarePlanView({
    required this.profile,
    required this.journey,
    required this.onBrowse,
  });

  final UserProfile profile;
  final JourneyState journey;
  final VoidCallback onBrowse;

  @override
  Widget build(BuildContext context) {
    final productName = profile.linkedProductName.isEmpty
        ? 'Your product'
        : profile.linkedProductName;

    return LdScaffold(
      title: 'Plan',
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Product Care Plan', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Daily reminders for $productName. Log rituals in Sunny chat and track your vitality on Ritual.',
              style: LuckdateTextStyles.body,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(productName, style: LuckdateTextStyles.title),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    'Reminder: ${profile.reminderTime} & ${profile.reminderTime2}',
                    style: LuckdateTextStyles.bodySmall,
                  ),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    journey.todayRecord.productTaken == ProductTakenStatus.taken
                        ? 'Taken today ✓'
                        : 'Not logged yet today',
                    style: LuckdateTextStyles.caption.copyWith(
                      color: LuckdateColors.deepSage,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            LdCard(
              onTap: onBrowse,
              child: Row(
                children: [
                  const Icon(
                    Icons.upgrade_outlined,
                    color: LuckdateColors.deepSage,
                  ),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Upgrade to 28-Day Slim Journey',
                          style: LuckdateTextStyles.title,
                        ),
                        Text(
                          'Meal replacement unlocks the full plan with milestones.',
                          style: LuckdateTextStyles.bodySmall,
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right),
                ],
              ),
            ),
            const Spacer(),
            LdPrimaryButton(label: 'Browse Mall', onPressed: onBrowse),
          ],
        ),
      ),
    );
  }
}

Widget _legendDot(Color color, String label) {
  return Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Container(
        width: 10,
        height: 10,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      ),
      const SizedBox(width: 4),
      Text(label, style: LuckdateTextStyles.caption),
    ],
  );
}

class _PlanTimeline extends StatelessWidget {
  const _PlanTimeline({required this.currentDay, required this.totalDays});

  final int currentDay;
  final int totalDays;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('28-Day Slim Journey', style: LuckdateTextStyles.title),
          const SizedBox(height: LuckdateSpacing.sm),
          ClipRRect(
            borderRadius: BorderRadius.circular(LuckdateRadius.pill),
            child: LinearProgressIndicator(
              value: currentDay / totalDays,
              minHeight: 8,
              backgroundColor: LuckdateColors.lineSoft,
              color: LuckdateColors.deepSage,
            ),
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Day $currentDay', style: LuckdateTextStyles.caption),
              Text('$totalDays days', style: LuckdateTextStyles.caption),
            ],
          ),
        ],
      ),
    );
  }
}
