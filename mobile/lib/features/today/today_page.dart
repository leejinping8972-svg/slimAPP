import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/today_widgets.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

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
    final rituals = _ritualItems(context, ref, profile, journey, record);

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
                      if (profile.userPlanType == UserPlanType.mealReplacement)
                        Text('Day ${journey.day} · Grow Toward the Light', style: LuckdateTextStyles.caption),
                    ],
                  ),
                ),
                const Icon(Icons.wb_sunny_rounded, color: LuckdateColors.sunGold, size: 36),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            TopMetricsRow(
              vitality: scores.dailyVitality,
              ritualPercent: scores.ritualCompletion,
              consistency5d: journey.consistency5d,
            ),
            if (journey.weightTrend.isNotEmpty) ...[
              const SizedBox(height: LuckdateSpacing.lg),
              WeightTrendCard(weights: journey.weightTrend, targetKg: profile.targetWeightKg),
            ],
            const SizedBox(height: LuckdateSpacing.xl),
            if (!profile.hidePurchaseGuideCard && profile.userPlanType == UserPlanType.noProduct) ...[
              _purchaseGuideCard(context, ref),
              const SizedBox(height: LuckdateSpacing.lg),
            ],
            Text(
              profile.userPlanType == UserPlanType.mealReplacement ? 'Today\'s Ritual' : 'Quick Log',
              style: LuckdateTextStyles.h2,
            ),
            if (profile.userPlanType == UserPlanType.mealReplacement) ...[
              const SizedBox(height: LuckdateSpacing.sm),
              Text('28-Day Slim Journey · Day ${journey.day}', style: LuckdateTextStyles.caption),
            ],
            const SizedBox(height: LuckdateSpacing.md),
            ..._orderedRituals(rituals),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              onTap: () => context.push('/chat'),
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
          ],
        ),
      ),
    );
  }

  List<_RitualItem> _ritualItems(
    BuildContext context,
    WidgetRef ref,
    UserProfile profile,
    JourneyState journey,
    TodayRecord record,
  ) {
    final items = <_RitualItem>[];
    void add(String title, String subtitle, IconData icon, bool completed, VoidCallback onTap) {
      items.add(_RitualItem(title: title, subtitle: subtitle, icon: icon, completed: completed, onTap: onTap));
    }

    switch (profile.userPlanType) {
      case UserPlanType.noProduct:
        add('Weight', record.weightRecorded ? '${record.weightValueKg.toStringAsFixed(1)} kg logged' : 'Log today',
            Icons.monitor_weight_outlined, record.weightRecorded, () => _showWeightSheet(context, ref, record, profile));
        add('Hydration', '${record.hydrationMl} / ${profile.hydrationTargetMl} ml', Icons.water_drop_outlined,
            record.hydrationMl > 0, () => _showHydrationSheet(context, ref, record, profile.hydrationTargetMl));
      case UserPlanType.nonMealReplacement:
        add(
          profile.linkedProductName.isEmpty ? 'Your product' : profile.linkedProductName,
          record.productTaken == ProductTakenStatus.taken ? 'Taken today' : 'Remember to take your product',
          Icons.medication_outlined,
          record.productTaken == ProductTakenStatus.taken,
          () => _completeProduct(ref, record),
        );
        add('Hydration', '${record.hydrationMl} / ${profile.hydrationTargetMl} ml', Icons.water_drop_outlined,
            record.hydrationMl > 0, () => _showHydrationSheet(context, ref, record, profile.hydrationTargetMl));
        add('Weight', record.weightRecorded ? '${record.weightValueKg.toStringAsFixed(1)} kg logged' : 'Log today',
            Icons.monitor_weight_outlined, record.weightRecorded, () => _showWeightSheet(context, ref, record, profile));
      case UserPlanType.mealReplacement:
        add('Solar Protein™', record.productTaken == ProductTakenStatus.taken ? 'Completed' : 'Tap to log',
            Icons.local_drink_outlined, record.productTaken == ProductTakenStatus.taken, () => _completeProduct(ref, record));
        add('Hydration', '${record.hydrationMl} / ${profile.hydrationTargetMl} ml', Icons.water_drop_outlined,
            record.hydrationMl > 0, () => _showHydrationSheet(context, ref, record, profile.hydrationTargetMl));
        add('Weight', record.weightRecorded ? '${record.weightValueKg.toStringAsFixed(1)} kg logged' : 'Log today',
            Icons.monitor_weight_outlined, record.weightRecorded, () => _showWeightSheet(context, ref, record, profile));
        add('Sleep', record.sleepHours > 0 ? '${record.sleepHours.toStringAsFixed(1)}h logged' : 'How long did you sleep?',
            Icons.bedtime_outlined, record.sleepHours > 0, () => _showSleepSheet(context, ref, record));
    }
    return items;
  }

  List<Widget> _orderedRituals(List<_RitualItem> items) {
    final pending = items.where((e) => !e.completed).toList();
    final done = items.where((e) => e.completed).toList();
    return [...pending, ...done]
        .map(
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
        )
        .toList();
  }

  Widget _purchaseGuideCard(BuildContext context, WidgetRef ref) {
    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Unlock your full health plan', style: LuckdateTextStyles.title),
          const SizedBox(height: LuckdateSpacing.sm),
          Text(
            'Buy Solar Protein or another meal replacement to start your 28-day journey.',
            style: LuckdateTextStyles.bodySmall,
          ),
          const SizedBox(height: LuckdateSpacing.lg),
          LdPrimaryButton(label: 'View products', onPressed: () => context.go('/collection')),
          const SizedBox(height: LuckdateSpacing.sm),
          Row(
            children: [
              Expanded(child: LdSecondaryButton(label: 'Browse first', onPressed: () => context.go('/collection'))),
              TextButton(
                onPressed: () => ref.read(appStateProvider.notifier).hidePurchaseGuideCard(),
                child: const Text('Dismiss for 24h'),
              ),
            ],
          ),
        ],
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
    ref.read(appStateProvider.notifier).updateTodayRecord(record.copyWith(productTaken: ProductTakenStatus.taken));
  }

  void _showHydrationSheet(BuildContext context, WidgetRef ref, TodayRecord record, int target) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: LuckdateColors.ivoryWhite,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (ctx) => _HydrationSheet(record: record, target: target, ref: ref),
    );
  }

  void _showWeightSheet(BuildContext context, WidgetRef ref, TodayRecord record, UserProfile profile) {
    final baseline = record.weightValueKg > 0
        ? record.weightValueKg
        : (profile.currentWeightKg > 0 ? profile.currentWeightKg : 68.0);
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: LuckdateColors.ivoryWhite,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (ctx) => _WeightSheet(baseline: baseline, record: record, ref: ref),
    );
  }

  void _showSleepSheet(BuildContext context, WidgetRef ref, TodayRecord record) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: LuckdateColors.ivoryWhite,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (ctx) => _SleepSheet(record: record, ref: ref),
    );
  }
}

class _RitualItem {
  const _RitualItem({
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

class _HydrationSheet extends StatefulWidget {
  const _HydrationSheet({required this.record, required this.target, required this.ref});

  final TodayRecord record;
  final int target;
  final WidgetRef ref;

  @override
  State<_HydrationSheet> createState() => _HydrationSheetState();
}

class _HydrationSheetState extends State<_HydrationSheet> with SingleTickerProviderStateMixin {
  late int _ml;
  late final AnimationController _pulse;

  @override
  void initState() {
    super.initState();
    _ml = widget.record.hydrationMl;
    _pulse = AnimationController(vsync: this, duration: const Duration(milliseconds: 420), lowerBound: 0.92, upperBound: 1.08)
      ..value = 1;
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  void _addWater(int amount) {
    setState(() => _ml += amount);
    _pulse.forward(from: 0.92).then((_) => _pulse.reverse());
    widget.ref.read(appStateProvider.notifier).updateTodayRecord(widget.record.copyWith(hydrationMl: _ml));
    if (_ml >= widget.target) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Daily hydration goal reached ✓')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(LuckdateSpacing.lg),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('Hydration', style: LuckdateTextStyles.h2),
          const SizedBox(height: LuckdateSpacing.base),
          ScaleTransition(
            scale: _pulse,
            child: Icon(Icons.water_drop_rounded, size: 56, color: LuckdateColors.deepSage.withValues(alpha: 0.85)),
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          Text('$_ml / ${widget.target} ml', style: LuckdateTextStyles.display.copyWith(fontSize: 36)),
          const SizedBox(height: LuckdateSpacing.lg),
          LdPrimaryButton(label: '+ 250 ml', onPressed: () => _addWater(250)),
          const SizedBox(height: LuckdateSpacing.sm),
          LdSecondaryButton(
            label: 'Done',
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }
}

class _WeightSheet extends StatefulWidget {
  const _WeightSheet({required this.baseline, required this.record, required this.ref});

  final double baseline;
  final TodayRecord record;
  final WidgetRef ref;

  @override
  State<_WeightSheet> createState() => _WeightSheetState();
}

class _WeightSheetState extends State<_WeightSheet> {
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
    return Padding(
      padding: const EdgeInsets.all(LuckdateSpacing.lg),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('Weight', style: LuckdateTextStyles.h2),
          Text('Default range ±3 kg. Drag to the edge to expand.', style: LuckdateTextStyles.bodySmall),
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
          Text('${_weight.toStringAsFixed(1)} kg', style: LuckdateTextStyles.h1),
          const SizedBox(height: LuckdateSpacing.base),
          LdPrimaryButton(
            label: 'Log weight',
            onPressed: () {
              widget.ref.read(appStateProvider.notifier).updateTodayRecord(
                    widget.record.copyWith(weightRecorded: true, weightValueKg: _weight),
                  );
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}

class _SleepSheet extends StatefulWidget {
  const _SleepSheet({required this.record, required this.ref});

  final TodayRecord record;
  final WidgetRef ref;

  @override
  State<_SleepSheet> createState() => _SleepSheetState();
}

class _SleepSheetState extends State<_SleepSheet> {
  late double _hours;

  @override
  void initState() {
    super.initState();
    _hours = widget.record.sleepHours > 0 ? widget.record.sleepHours : 7;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(LuckdateSpacing.lg),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('How long did you sleep?', style: LuckdateTextStyles.h2),
          const SizedBox(height: LuckdateSpacing.md),
          Text('${_hours.toStringAsFixed(1)} hours', style: LuckdateTextStyles.display.copyWith(fontSize: 32)),
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
              widget.ref.read(appStateProvider.notifier).updateTodayRecord(
                    widget.record.copyWith(sleepHours: _hours, sleepQuality: 'logged'),
                  );
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}
