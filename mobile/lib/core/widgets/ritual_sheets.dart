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

void showPesoSheet(
  BuildContext context,
  WidgetRef ref,
  TodayRecord record,
  UserProfile profile,
) {
  final baseline = record.weightValueKg > 0
      ? record.weightValueKg
      : (profile.currentPesoKg > 0 ? profile.currentPesoKg : 68.0);
  showModalBottomSheet<void>(
    context: context,
    useRootNavigator: true,
    isScrollControlled: true,
    backgroundColor: LuckdateColors.ivoryWhite,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (ctx) => PesoSheet(baseline: baseline, record: record),
  );
}

void showSleepSheet(BuildContext context, WidgetRef ref, TodayRecord record) {
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
  required bool isHoy,
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
      isHoy: isHoy,
    ),
  );
}

class HydrationSheet extends ConsumerStatefulWidget {
  const HydrationSheet({super.key, required this.record, required this.target});

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

  void _addAgua(int amount) {
    setState(() => _ml += amount);
    _pulse.forward(from: 0.92).then((_) => _pulse.reverse());
    ref
        .read(appStateProvider.notifier)
        .updateTodayRecord(widget.record.copyWith(hydrationMl: _ml));
    if (_ml >= widget.target && widget.record.hydrationMl < widget.target) {
      showDialog<void>(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          title: const Text('Meta de hidratación alcanzada'),
          content: const Text('Meta diaria de hidratación alcanzada ✓'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Listo'),
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
        Text('Hidratación', style: LuckdateTextStyles.h2),
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
        LdPrimaryButton(label: '+ 250 ml', onPressed: () => _addAgua(250)),
        const SizedBox(height: LuckdateSpacing.sm),
        LdSecondaryButton(
          label: 'Listo',
          onPressed: () => Navigator.pop(context),
        ),
      ],
    );
  }
}

class PesoSheet extends ConsumerStatefulWidget {
  const PesoSheet({super.key, required this.baseline, required this.record});

  final double baseline;
  final TodayRecord record;

  @override
  ConsumerState<PesoSheet> createState() => _PesoSheetState();
}

class _PesoSheetState extends ConsumerState<PesoSheet> {
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
        Text('Peso', style: LuckdateTextStyles.h2),
        Text(
          'Rango predeterminado ±3 kg. Arrastra hasta el borde para ampliarlo.',
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
        Text('${_weight.toStringAsFixed(1)} kg', style: LuckdateTextStyles.h1),
        const SizedBox(height: LuckdateSpacing.base),
        LdPrimaryButton(
          label: 'Registrar peso',
          onPressed: () {
            ref
                .read(appStateProvider.notifier)
                .updateTodayRecord(
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
        Text('¿Cuánto dormiste?', style: LuckdateTextStyles.h2),
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
          label: 'Guardar',
          onPressed: () {
            ref
                .read(appStateProvider.notifier)
                .updateTodayRecord(
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
    final alreadyLogged =
        record.productTaken == ProductoTakenStatus.taken ||
        record.productTaken == ProductoTakenStatus.partial;

    return LdBottomSheetBody(
      children: [
        Text('Comida nutritiva', style: LuckdateTextStyles.h2),
        const SizedBox(height: LuckdateSpacing.sm),
        Text(
          alreadyLogged
              ? 'La proteína matutina ya está registrada hoy.'
              : 'Registra rápidamente tu Solar Protein o comida matutina. La IA estimará las calorías en el registro diario.',
          style: LuckdateTextStyles.bodySmall,
        ),
        const SizedBox(height: LuckdateSpacing.lg),
        LdPrimaryButton(
          label: alreadyLogged ? 'Registrado ✓' : 'Registrar Solar Protein',
          onPressed: alreadyLogged
              ? () => Navigator.pop(context)
              : () {
                  final updated = CheckInEstimator.applyProductoShake(record);
                  ref
                      .read(appStateProvider.notifier)
                      .updateTodayRecord(updated);
                  Navigator.pop(context);
                },
        ),
        const SizedBox(height: LuckdateSpacing.sm),
        LdSecondaryButton(
          label: 'Cancelar',
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

  void add(String title, String subtitle, IconData icon, bool completed) {
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
    case UserPlanType.noProducto:
      add(
        'Peso',
        record.weightRecorded
            ? '${record.weightValueKg.toStringAsFixed(1)} kg registrado'
            : 'Registrar hoy',
        Icons.monitor_weight_outlined,
        record.weightRecorded,
      );
      add(
        'Hidratación',
        '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
        Icons.water_drop_outlined,
        record.hydrationMl > 0,
      );
    case UserPlanType.nonMealReemplazament:
      add(
        profile.linkedProductoName.isEmpty
            ? 'Tu producto'
            : profile.linkedProductoName,
        record.productTaken == ProductoTakenStatus.taken
            ? 'Tomado hoy'
            : 'Recuerda tomar tu producto',
        Icons.medication_outlined,
        record.productTaken == ProductoTakenStatus.taken,
      );
      add(
        'Hidratación',
        '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
        Icons.water_drop_outlined,
        record.hydrationMl > 0,
      );
      add(
        'Peso',
        record.weightRecorded
            ? '${record.weightValueKg.toStringAsFixed(1)} kg registrado'
            : 'Registrar hoy',
        Icons.monitor_weight_outlined,
        record.weightRecorded,
      );
    case UserPlanType.mealReemplazament:
      add(
        'Solar Protein™',
        record.productTaken == ProductoTakenStatus.taken
            ? 'Completado'
            : 'Toca para registrar',
        Icons.local_drink_outlined,
        record.productTaken == ProductoTakenStatus.taken,
      );
      add(
        'Hidratación',
        '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
        Icons.water_drop_outlined,
        record.hydrationMl > 0,
      );
      add(
        'Peso',
        record.weightRecorded
            ? '${record.weightValueKg.toStringAsFixed(1)} kg registrado'
            : 'Registrar hoy',
        Icons.monitor_weight_outlined,
        record.weightRecorded,
      );
      add(
        'Sueño',
        record.sleepHours > 0
            ? '${record.sleepHours.toStringAsFixed(1)} h registrado'
            : '¿Cuánto dormiste?',
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
