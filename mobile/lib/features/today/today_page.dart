import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/vitality_scorer.dart';

class TodayPage extends ConsumerWidget {
  const TodayPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    if (state.showLoading) return const LdScaffold(body: StatePlaceholder(type: 'loading'));
    if (state.showError) {
      return LdScaffold(
        body: StatePlaceholder(
          type: 'error',
          onRetry: () => ref.read(appStateProvider.notifier).toggleErrorDemo(false),
        ),
      );
    }

    final journey = state.journey;
    final record = journey.todayRecord;
    final scores = journey.vitalityScores;
    final profile = state.profile;

    return LdScaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(_greeting(), style: LuckdateTextStyles.h1),
                      Text('${profile.nickname} ☀️', style: LuckdateTextStyles.title),
                      Text('Day ${journey.day} · Grow Toward the Light', style: LuckdateTextStyles.caption),
                    ],
                  ),
                ),
                const Icon(Icons.wb_sunny_rounded, color: LuckdateColors.sunGold, size: 36),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Text('Today\'s Ritual', style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.md),
            RitualCard(
              title: 'Solar Protein™',
              subtitle: record.productTaken == ProductTakenStatus.taken ? 'Completed' : 'Tap to log',
              icon: Icons.local_drink_outlined,
              completed: record.productTaken == ProductTakenStatus.taken,
              onTap: () => _completeProduct(ref, record),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            RitualCard(
              title: 'Hydration',
              subtitle: '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
              icon: Icons.water_drop_outlined,
              completed: record.hydrationMl > 0,
              onTap: () => _showHydrationSheet(context, ref, record, profile.hydrationTargetMl),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            RitualCard(
              title: 'Weight',
              subtitle: record.weightRecorded ? '${record.weightValueKg.toStringAsFixed(1)} kg logged' : 'Log today',
              icon: Icons.monitor_weight_outlined,
              completed: record.weightRecorded,
              onTap: () => _showWeightSheet(context, ref, record),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            RitualCard(
              title: 'How do you feel?',
              subtitle: record.moodTag.isEmpty ? 'Choose mood' : record.moodTag,
              icon: Icons.sentiment_satisfied_alt_outlined,
              completed: record.moodTag.isNotEmpty,
              onTap: () => _showMoodSheet(context, ref, record),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            RitualCard(
              title: 'Sleep',
              subtitle: record.sleepHours > 0 ? '${record.sleepHours}h · ${record.sleepQuality}' : 'Log sleep',
              icon: Icons.bedtime_outlined,
              completed: record.sleepHours > 0,
              onTap: () => _showSleepSheet(context, ref, record),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              onTap: () => context.go('/chat'),
              child: Row(
                children: [
                  const LdSunnyAvatar(),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Sunny says', style: LuckdateTextStyles.caption),
                        Text(journey.sunnyCardMessage, style: LuckdateTextStyles.body),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios, size: 16, color: LuckdateColors.textSecondary),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Text('Vitality Today', style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.md),
            Row(
              children: [
                Expanded(
                  child: VitalityMetricCard(
                    label: 'Vitality Score',
                    value: '${scores.dailyVitality}',
                    subtitle: VitalityScorer.vitalityLabel(scores.dailyVitality),
                  ),
                ),
                const SizedBox(width: LuckdateSpacing.sm),
                Expanded(
                  child: VitalityMetricCard(
                    label: 'Ritual',
                    value: '${scores.ritualCompletion}%',
                    subtitle: 'Completion',
                  ),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            VitalityMetricCard(
              label: 'Consistency',
              value: '${scores.consistencyScore}%',
              subtitle: 'Last 7 days rhythm',
            ),
          ],
        ),
      ),
    );
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  void _completeProduct(WidgetRef ref, TodayRecord record) {
    ref.read(appStateProvider.notifier).updateTodayRecord(
          record.copyWith(productTaken: ProductTakenStatus.taken),
        );
  }

  void _showHydrationSheet(BuildContext context, WidgetRef ref, TodayRecord record, int target) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: LuckdateColors.ivoryWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Hydration', style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.base),
            Text('${record.hydrationMl} / $target ml', style: LuckdateTextStyles.display.copyWith(fontSize: 36)),
            const SizedBox(height: LuckdateSpacing.lg),
            Row(
              children: [
                Expanded(
                  child: LdPrimaryButton(
                    label: '+ 250 ml',
                    onPressed: () {
                      ref.read(appStateProvider.notifier).updateTodayRecord(
                            record.copyWith(hydrationMl: record.hydrationMl + 250),
                          );
                      Navigator.pop(ctx);
                    },
                  ),
                ),
                const SizedBox(width: LuckdateSpacing.sm),
                Expanded(
                  child: LdSecondaryButton(
                    label: 'Fill goal',
                    onPressed: () {
                      ref.read(appStateProvider.notifier).updateTodayRecord(
                            record.copyWith(hydrationMl: target),
                          );
                      Navigator.pop(ctx);
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showWeightSheet(BuildContext context, WidgetRef ref, TodayRecord record) {
    var weight = record.weightValueKg > 0 ? record.weightValueKg : 68.0;
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: LuckdateColors.ivoryWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setState) => Padding(
          padding: const EdgeInsets.all(LuckdateSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Weight', style: LuckdateTextStyles.h2),
              Text('Your trend matters more than one day.', style: LuckdateTextStyles.bodySmall),
              Slider(
                value: weight,
                min: 40,
                max: 120,
                divisions: 800,
                activeColor: LuckdateColors.deepSage,
                onChanged: (v) => setState(() => weight = v),
              ),
              Text('${weight.toStringAsFixed(1)} kg', style: LuckdateTextStyles.h1),
              const SizedBox(height: LuckdateSpacing.base),
              LdPrimaryButton(
                label: 'Log weight',
                onPressed: () {
                  ref.read(appStateProvider.notifier).updateTodayRecord(
                        record.copyWith(weightRecorded: true, weightValueKg: weight),
                      );
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showMoodSheet(BuildContext context, WidgetRef ref, TodayRecord record) {
    const moods = ['good', 'okay', 'tired', 'stressed', 'calm'];
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: LuckdateColors.ivoryWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('How do you feel?', style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.base),
            Wrap(
              spacing: 8,
              children: moods.map((m) {
                return LdChoiceChip(
                  label: m,
                  selected: record.moodTag == m,
                  onTap: () {
                    ref.read(appStateProvider.notifier).updateTodayRecord(
                          record.copyWith(moodTag: m, energyTag: m),
                        );
                    Navigator.pop(ctx);
                  },
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  void _showSleepSheet(BuildContext context, WidgetRef ref, TodayRecord record) {
    var hours = record.sleepHours > 0 ? record.sleepHours : 7.0;
    var quality = record.sleepQuality.isEmpty ? 'okay' : record.sleepQuality;
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: LuckdateColors.ivoryWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setState) => Padding(
          padding: const EdgeInsets.all(LuckdateSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Sleep', style: LuckdateTextStyles.h2),
              Slider(
                value: hours,
                min: 3,
                max: 12,
                divisions: 18,
                activeColor: LuckdateColors.deepSage,
                label: '${hours.toStringAsFixed(1)}h',
                onChanged: (v) => setState(() => hours = v),
              ),
              Wrap(
                spacing: 8,
                children: ['poor', 'okay', 'good'].map((q) {
                  return LdChoiceChip(
                    label: q,
                    selected: quality == q,
                    onTap: () => setState(() => quality = q),
                  );
                }).toList(),
              ),
              const SizedBox(height: LuckdateSpacing.base),
              LdPrimaryButton(
                label: 'Save',
                onPressed: () {
                  ref.read(appStateProvider.notifier).updateTodayRecord(
                        record.copyWith(sleepHours: hours, sleepQuality: quality),
                      );
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
