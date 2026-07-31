import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ritual_sheets.dart';
import '../../core/widgets/today_widgets.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/sleep_record_helper.dart';

class HoyPage extends ConsumerStatefulWidget {
  const HoyPage({super.key});

  @override
  ConsumerState<HoyPage> createState() => _HoyPageState();
}

class _HoyPageState extends ConsumerState<HoyPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => _maybeShowViajeComplete(),
    );
  }

  void _maybeShowViajeComplete() {
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
        title: const Text('Viaje completado'),
        content: const Text(
          'Creciste hacia la luz durante 28 días. Consulta tu informe de finalización y explora tu próximo viaje.',
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
            child: const Text('Ver informe'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(appStateProvider, (previous, next) {
      if (previous?.journey.day != next.journey.day ||
          previous?.profile.journeyCompleteSeen !=
              next.profile.journeyCompleteSeen) {
        WidgetsBinding.instance.addPostFrameCallback(
          (_) => _maybeShowViajeComplete(),
        );
      }
    });

    final state = ref.watch(appStateProvider);
    if (state.showLoading)
      return const LdScaffold(body: StatePlaceholder(type: 'loading'));
    if (state.showError) {
      return LdScaffold(
        body: StatePlaceholder(
          type: 'error',
          onRetry: () =>
              ref.read(appStateProvider.notifier).toggleErrorDemo(false),
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
                      Text(
                        '${profile.nickname} ★',
                        style: LuckdateTextStyles.title,
                      ),
                      if (profile.userPlanType ==
                          UserPlanType.mealReplacement)
                        Text(
                          'Día ${journey.day} · Crece hacia la luz',
                          style: LuckdateTextStyles.caption,
                        ),
                    ],
                  ),
                ),
                LdProfileAvatar(
                  nickname: profile.nickname,
                  onTap: () => context.push('/profile'),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            TopMetricsRow(
              vitality: scores.dailyVitality,
              ritualPercent: scores.ritualCompletion,
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            ConsistencyCalendarCard(
              consistency5d: journey.consistency5d,
              consistencyScore: scores.consistencyScore,
              journeyDay: journey.day,
              planType: profile.userPlanType,
              todayRecord: record,
              weightTrend: journey.weightTrend,
              onDayTap: (index, date, dayRecord) => _showDayCheckInSheet(
                context,
                date: date,
                journeyDay: journey.day - (4 - index),
                record: dayRecord,
                planType: profile.userPlanType,
                isHoy: index == 4,
              ),
            ),
            if (journey.weightTrend.isNotEmpty) ...[
              const SizedBox(height: LuckdateSpacing.lg),
              PesoTrendCard(
                weights: journey.weightTrend,
                targetKg: profile.targetWeightKg,
              ),
            ],
            const SizedBox(height: LuckdateSpacing.xl),
            if (!profile.hidePurchaseGuideCard &&
                profile.userPlanType == UserPlanType.noProduct &&
                !profile.isAwaitingReceipt) ...[
              _bindOrderGuideCard(context, ref),
              const SizedBox(height: LuckdateSpacing.lg),
            ],
            Text(
              profile.userPlanType == UserPlanType.mealReplacement
                  ? 'Ritual de hoy'
                  : 'Registro rápido',
              style: LuckdateTextStyles.h2,
            ),
            if (profile.userPlanType == UserPlanType.mealReplacement) ...[
              const SizedBox(height: LuckdateSpacing.sm),
              Text(
                'Viaje Slim de 28 días · Día ${journey.day}',
                style: LuckdateTextStyles.caption,
              ),
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
                        Text('Sunny dice', style: LuckdateTextStyles.caption),
                        Text(
                          journey.sunnyCardMessage,
                          style: LuckdateTextStyles.body,
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.chevron_right,
                    size: 20,
                    color: LuckdateColors.textSecondary,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            _nutritionBanner(context),
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
    void add(
      String title,
      String subtitle,
      IconData icon,
      bool completed,
      VoidCallback onTap,
    ) {
      items.add(
        _RitualItem(
          title: title,
          subtitle: subtitle,
          icon: icon,
          completed: completed,
          onTap: onTap,
        ),
      );
    }

    switch (profile.userPlanType) {
      case UserPlanType.noProduct:
        add(
          'Peso',
          record.weightRecorded
              ? '${record.weightValueKg.toStringAsFixed(1)} kg registrado'
              : 'Registrar hoy',
          Icons.monitor_weight_outlined,
          record.weightRecorded,
          () => _showPesoSheet(context, ref, record, profile),
        );
        add(
          'Hidratación',
          '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
          Icons.water_drop_outlined,
          record.hydrationMl > 0,
          () => _showHydrationSheet(
            context,
            ref,
            record,
            profile.hydrationTargetMl,
          ),
        );
      case UserPlanType.nonMealReplacement:
        add(
          profile.linkedProductName.isEmpty
              ? 'Tu producto'
              : profile.linkedProductName,
          record.productTaken == ProductTakenStatus.taken
              ? 'Tomado hoy'
              : 'Recuerda tomar tu producto',
          Icons.medication_outlined,
          record.productTaken == ProductTakenStatus.taken,
          () => _completadoProducto(ref, record),
        );
        add(
          'Hidratación',
          '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
          Icons.water_drop_outlined,
          record.hydrationMl > 0,
          () => _showHydrationSheet(
            context,
            ref,
            record,
            profile.hydrationTargetMl,
          ),
        );
        add(
          'Peso',
          record.weightRecorded
              ? '${record.weightValueKg.toStringAsFixed(1)} kg registrado'
              : 'Registrar hoy',
          Icons.monitor_weight_outlined,
          record.weightRecorded,
          () => _showPesoSheet(context, ref, record, profile),
        );
      case UserPlanType.mealReplacement:
        add(
          'Solar Protein™',
          record.productTaken == ProductTakenStatus.taken
              ? 'Completado'
              : 'Toca para registrar',
          Icons.local_drink_outlined,
          record.productTaken == ProductTakenStatus.taken,
          () => _completadoProducto(ref, record),
        );
        add(
          'Hidratación',
          '${record.hydrationMl} / ${profile.hydrationTargetMl} ml',
          Icons.water_drop_outlined,
          record.hydrationMl > 0,
          () => _showHydrationSheet(
            context,
            ref,
            record,
            profile.hydrationTargetMl,
          ),
        );
        add(
          'Peso',
          record.weightRecorded
              ? '${record.weightValueKg.toStringAsFixed(1)} kg registrado'
              : 'Registrar hoy',
          Icons.monitor_weight_outlined,
          record.weightRecorded,
          () => _showPesoSheet(context, ref, record, profile),
        );
        add(
          'Sueño',
          record.hasSleepRecord
              ? SleepRecordHelper.summary(record)
              : 'Registra sueño',
          Icons.bedtime_outlined,
          record.hasSleepRecord,
          () => showSleepSheet(context, ref, record),
        );
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

  Widget _bindOrderGuideCard(BuildContext context, WidgetRef ref) {
    return LdCard(
      accentColor: LuckdateColors.sunGold,
      onTap: () => context.push('/link-order'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Activa tu plan de 28 días',
            style: LuckdateTextStyles.title,
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          Text(
            'Vincula un pedido externo de reemplazo de comida para iniciar tu recorrido Slim.',
            style: LuckdateTextStyles.bodySmall,
          ),
          const SizedBox(height: LuckdateSpacing.lg),
          LdPrimaryButton(
            label: 'Vincular pedido',
            onPressed: () => context.push('/link-order'),
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () =>
                  ref.read(appStateProvider.notifier).hidePurchaseGuideCard(),
              child: const Text('Cerrar'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _nutritionBanner(BuildContext context) {
    return LdCard(
      onTap: () => context.push('/link-order'),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: LuckdateColors.sunGold.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.link_outlined,
              color: LuckdateColors.chocolateBrown,
            ),
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Vincular pedido', style: LuckdateTextStyles.title),
                Text(
                  'Activa tu recorrido Slim con un pedido externo de reemplazo de comida.',
                  style: LuckdateTextStyles.bodySmall,
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: LuckdateColors.textSecondary),
        ],
      ),
    );
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Buenos días';
    if (hour < 17) return 'Buenas tardes';
    return 'Buenas noches';
  }

  void _completadoProducto(WidgetRef ref, TodayRecord record) {
    ref
        .read(appStateProvider.notifier)
        .updateTodayRecord(
          record.copyWith(productTaken: ProductTakenStatus.taken),
        );
  }

  void _showHydrationSheet(
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
      builder: (ctx) =>
          _HydrationSheet(record: record, target: target, ref: ref),
    );
  }

  void _showPesoSheet(
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
      builder: (ctx) =>
          _PesoSheet(baseline: baseline, record: record, ref: ref),
    );
  }

  void _showDayCheckInSheet(
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
  const _HydrationSheet({
    required this.record,
    required this.target,
    required this.ref,
  });

  final TodayRecord record;
  final int target;
  final WidgetRef ref;

  @override
  State<_HydrationSheet> createState() => _HydrationSheetState();
}

class _HydrationSheetState extends State<_HydrationSheet>
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
    widget.ref
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
          content: const Text('Meta diaria de hidratacion alcanzada.'),
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

class _PesoSheet extends StatefulWidget {
  const _PesoSheet({
    required this.baseline,
    required this.record,
    required this.ref,
  });

  final double baseline;
  final TodayRecord record;
  final WidgetRef ref;

  @override
  State<_PesoSheet> createState() => _PesoSheetState();
}

class _PesoSheetState extends State<_PesoSheet> {
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
            widget.ref
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
