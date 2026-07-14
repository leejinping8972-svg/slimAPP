import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/check_in_estimator.dart';
import 'ld_components.dart';
import 'today_widgets.dart';

void showHydrationSheet(
  BuildContext context,
  WidgetRef ref,
  TodayRecord record,
  int target,
) {
  showModalBottomSheet<void>(
    context: context,
    useRootNavigator: true,
    isScrollControlled: true,
    backgroundColor: LuckdateColors.ivoryWhite,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (ctx) => HydrationSheet(record: record, target: target),
  );
}

void showWeightSheet(
  BuildContext context,
  WidgetRef ref,
  TodayRecord record,
  UserProfile profile,
) {
  final baseline = record.weightValueKg > 0
      ? record.weightValueKg
      : (profile.currentWeightKg > 0 ? profile.currentWeightKg : 68.0);
  showModalBottomSheet<void>(
    context: context,
    useRootNavigator: true,
    isScrollControlled: true,
    backgroundColor: LuckdateColors.ivoryWhite,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (ctx) => WeightSheet(baseline: baseline, record: record),
  );
}

void showSleepSheet(
  BuildContext context,
  WidgetRef ref,
  TodayRecord record,
) {
  showModalBottomSheet<void>(
    context: context,
    useRootNavigator: true,
    isScrollControlled: true,
    backgroundColor: LuckdateColors.ivoryWhite,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (ctx) => SleepSheet(record: record),
  );
}

void showMealCheckInSheet(
  BuildContext context,
  WidgetRef ref,
  TodayRecord record,
) {
  showModalBottomSheet<void>(
    context: context,
    useRootNavigator: true,
    isScrollControlled: true,
    backgroundColor: LuckdateColors.ivoryWhite,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (ctx) => MealCheckInSheet(record: record),
  );
}

void showDayCheckInSheet(
  BuildContext context, {
  required DateTime date,
  required int journeyDay,
  required TodayRecord record,
  required UserPlanType planType,
  required bool isToday,
}) {
  showModalBottomSheet<void>(
    context: context,
    useRootNavigator: true,
    isScrollControlled: true,
    backgroundColor: LuckdateColors.ivoryWhite,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (ctx) => DayCheckInSheet(
      date: date,
      journeyDay: journeyDay > 0 ? journeyDay : null,
      record: record,
      planType: planType,
      isToday: isToday,
    ),
  );
}

class HydrationSheet extends ConsumerStatefulWidget {
  const HydrationSheet({
    super.key,
    required this.record,
    required this.target,
  });

  final TodayRecord record;
  final int target;

  @override
  ConsumerState<HydrationSheet> createState() => _HydrationSheetState();
}

class _HydrationSheetState extends ConsumerState<HydrationSheet>
    with SingleTickerProviderStateMixin {
  late int _ml;
  late final AnimationController _pulse;

  @override
  void initState() {
    super.initState();
    _ml = widget.record.hydrationMl;
    _pulse = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 420),
      lowerBound: 0.92,
      upperBound: 1.08,
    )..value = 1;
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  void _addWater(int amount) {
    setState(() => _ml += amount);
    _pulse.forward(from: 0.92).then((_) => _pulse.reverse());
    ref
        .read(appStateProvider.notifier)
        .updateTodayRecord(widget.record.copyWith(hydrationMl: _ml));
    if (_ml >= widget.target && widget.record.hydrationMl < widget.target) {
      showDialog<void>(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: const Text('Hydration goal reached'),
          content: const Text('Daily hydration goal reached ✓'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Done'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return LdBottomSheetBody(
      children: [
        Text('Hydration', style: LuckdateTextStyles.h2),
        const SizedBox(height: LuckdateSpacing.base),
        ScaleTransition(
          scale: _pulse,
          child: Icon(
            Icons.water_drop_rounded,
            size: 56,
            color: LuckdateColors.deepSage.withValues(alpha: 0.85),
          ),
        ),
        const SizedBox(height: LuckdateSpacing.sm),
        Text(
          '$_ml / ${widget.target} ml',
          style: LuckdateTextStyles.display.copyWith(fontSize: 36),
        ),
        const SizedBox(height: LuckdateSpacing.lg),
        LdPrimaryButton(label: '+ 250 ml', onPressed: () => _addWater(250)),
        const SizedBox(height: LuckdateSpacing.sm),
        LdSecondaryButton(
          label: 'Done',
          onPressed: () => Navigator.pop(context),
        ),
      ],
    );
  }
}

class WeightSheet extends ConsumerStatefulWidget {
  const WeightSheet({
    super.key,
    required this.baseline,
    required this.record,
  });

  final double baseline;
  final TodayRecord record;

  @override
  ConsumerState<WeightSheet> createState() => _WeightSheetState();
}

class _WeightSheetState extends ConsumerState<WeightSheet> {
  late double _weight;
  late double _min;
  late double _max;

  @override
  void initState() {
    super.initState();
    _weight = widget.baseline;
    _min = (_weight - 3).clamp(40, 120);
    _max = (_weight + 3).clamp(40, 120);
  }

  @override
  Widget build(BuildContext context) {
    return LdBottomSheetBody(
      children: [
        Text('Weight', style: LuckdateTextStyles.h2),
        Text(
          'Default range ±3 kg. Drag to the edge to expand.',
          style: LuckdateTextStyles.bodySmall,
        ),
        Slider(
          value: _weight.clamp(_min, _max),
          min: _min,
          max: _max,
          divisions: ((_max - _min) * 10).round().clamp(1, 800),
          activeColor: LuckdateColors.deepSage,
          onChanged: (v) {
            setState(() {
              _weight = v;
              if (v <= _min + 0.05) _min = (_min - 1).clamp(40, _weight);
              if (v >= _max - 0.05) _max = (_max + 1).clamp(_weight, 120);
            });
          },
        ),
        Text(
          '${_weight.toStringAsFixed(1)} kg',
          style: LuckdateTextStyles.h1,
        ),
        const SizedBox(height: LuckdateSpacing.base),
        LdPrimaryButton(
          label: 'Log weight',
          onPressed: () {
            ref.read(appStateProvider.notifier).updateTodayRecord(
                  widget.record.copyWith(
                    weightRecorded: true,
                    weightValueKg: _weight,
                  ),
                );
            Navigator.pop(context);
          },
        ),
      ],
    );
  }
}

class SleepSheet extends ConsumerStatefulWidget {
  const SleepSheet({super.key, required this.record});

  final TodayRecord record;

  @override
  ConsumerState<SleepSheet> createState() => _SleepSheetState();
}

class _SleepSheetState extends ConsumerState<SleepSheet> {
  late double _hours;

  @override
  void initState() {
    super.initState();
    _hours = widget.record.sleepHours > 0 ? widget.record.sleepHours : 7;
  }

  @override
  Widget build(BuildContext context) {
    return LdBottomSheetBody(
      children: [
        Text('How long did you sleep?', style: LuckdateTextStyles.h2),
        const SizedBox(height: LuckdateSpacing.md),
        Text(
          '${_hours.toStringAsFixed(1)} hours',
          style: LuckdateTextStyles.display.copyWith(fontSize: 32),
        ),
        Slider(
          value: _hours,
          min: 4,
          max: 12,
          divisions: 16,
          activeColor: LuckdateColors.deepSage,
          onChanged: (v) => setState(() => _hours = v),
        ),
        LdPrimaryButton(
          label: 'Save',
          onPressed: () {
            ref.read(appStateProvider.notifier).updateTodayRecord(
                  widget.record.copyWith(
                    sleepHours: _hours,
                    sleepQuality: 'logged',
                  ),
                );
            Navigator.pop(context);
          },
        ),
      ],
    );
  }
}

class MealCheckInSheet extends ConsumerWidget {
  const MealCheckInSheet({super.key, required this.record});

  final TodayRecord record;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final alreadyLogged = record.productTaken == ProductTakenStatus.taken ||
        record.productTaken == ProductTakenStatus.partial;

    return LdBottomSheetBody(
      children: [
        Text('Nutritional Meal', style: LuckdateTextStyles.h2),
        const SizedBox(height: LuckdateSpacing.sm),
        Text(
          alreadyLogged
              ? 'Morning protein is already logged for today.'
              : 'Quick-log your Solar Protein or morning meal. AI will estimate calories in Check-in Record.',
          style: LuckdateTextStyles.bodySmall,
        ),
        const SizedBox(height: LuckdateSpacing.lg),
        LdPrimaryButton(
          label: alreadyLogged ? 'Logged ✓' : 'Log Solar Protein',
          onPressed: alreadyLogged
              ? () => Navigator.pop(context)
              : () {
                  final updated = CheckInEstimator.applyProductShake(record);
                  ref.read(appStateProvider.notifier).updateTodayRecord(updated);
                  Navigator.pop(context);
                },
        ),
        const SizedBox(height: LuckdateSpacing.sm),
        LdSecondaryButton(
          label: 'Cancel',
          onPressed: () => Navigator.pop(context),
        ),
      ],
    );
  }
}

List<RitualLogItem> ritualItemsForPlan({
  required UserProfile profile,
  required TodayRecord record,
  required void Function(String title) onItemTap,
}) {
  final items = <RitualLogItem>[];

  void add(
    String title,
    String subtitle,
    IconData icon,
    bool completed,
  ) {
    items.add(
      RitualLogItem(
        title: title,
        subtitle: subtitle,
        icon: icon,
        completed: completed,
        onTap: () => onItemTap(title),
      ),
    );
  }

  switch (profile.userPlanType) {
    case UserPlanType.noProduct:
      add(
        'Weight',
        record.weightRecorded
            ? '${record.weightValueKg.toStringAsFixed(1)} kg logged'
            : 'Log today',
        Icons.monitor_weight_outlined,
        record.weightRecorded,
      );
      add(
        'Hydration',
        '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
        Icons.water_drop_outlined,
        record.hydrationMl > 0,
      );
    case UserPlanType.nonMealReplacement:
      add(
        profile.linkedProductName.isEmpty
            ? 'Your product'
            : profile.linkedProductName,
        record.productTaken == ProductTakenStatus.taken
            ? 'Taken today'
            : 'Remember to take your product',
        Icons.medication_outlined,
        record.productTaken == ProductTakenStatus.taken,
      );
      add(
        'Hydration',
        '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
        Icons.water_drop_outlined,
        record.hydrationMl > 0,
      );
      add(
        'Weight',
        record.weightRecorded
            ? '${record.weightValueKg.toStringAsFixed(1)} kg logged'
            : 'Log today',
        Icons.monitor_weight_outlined,
        record.weightRecorded,
      );
    case UserPlanType.mealReplacement:
      add(
        'Solar Protein™',
        record.productTaken == ProductTakenStatus.taken
            ? 'Completed'
            : 'Tap to log',
        Icons.local_drink_outlined,
        record.productTaken == ProductTakenStatus.taken,
      );
      add(
        'Hydration',
        '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
        Icons.water_drop_outlined,
        record.hydrationMl > 0,
      );
      add(
        'Weight',
        record.weightRecorded
            ? '${record.weightValueKg.toStringAsFixed(1)} kg logged'
            : 'Log today',
        Icons.monitor_weight_outlined,
        record.weightRecorded,
      );
      add(
        'Sleep',
        record.sleepHours > 0
            ? '${record.sleepHours.toStringAsFixed(1)}h logged'
            : 'How long did you sleep?',
        Icons.bedtime_outlined,
        record.sleepHours > 0,
      );
  }
  return items;
}

class RitualLogItem {
  const RitualLogItem({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.completed,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final bool completed;
  final VoidCallback onTap;
}
