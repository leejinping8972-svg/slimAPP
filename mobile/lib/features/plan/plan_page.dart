import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ld_shell.dart';
import '../../core/widgets/ritual_sheets.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

enum _PlanTab { inProgreso, myPlans }

class PlanPage extends ConsumerStatefulWidget {
  const PlanPage({super.key});

  @override
  ConsumerState<PlanPage> createState() => _PlanPageState();
}

class _PlanPageState extends ConsumerState<PlanPage> {
  _PlanTab _tab = _PlanTab.inProgreso;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStateProvider);
    final profile = state.profile;
    final journey = state.journey;

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            _PlanHeader(onBack: () => context.go('/ritual')),
            Padding(
              padding: const EdgeInsets.fromLTRB(
                LuckdateSpacing.lg,
                0,
                LuckdateSpacing.lg,
                LuckdateSpacing.md,
              ),
              child: LdSegmentedControl<_PlanTab>(
                options: const [_PlanTab.inProgreso, _PlanTab.myPlans],
                selected: _tab,
                onChanged: (v) => setState(() => _tab = v),
                labelBuilder: (t) => switch (t) {
                  _PlanTab.inProgreso => 'En curso',
                  _PlanTab.myPlans => 'Mis planes',
                },
              ),
            ),
            Expanded(
              child: switch (_tab) {
                _PlanTab.inProgreso => _buildInProgreso(
                  context,
                  profile: profile,
                  journey: journey,
                ),
                _PlanTab.myPlans => _MyPlansView(
                  profile: profile,
                  journey: journey,
                  onOpenDetails: () =>
                      setState(() => _tab = _PlanTab.inProgreso),
                ),
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInProgreso(
    BuildContext context, {
    required UserProfile profile,
    required ViajeState journey,
  }) {
    if (profile.isAwaitingReceipt) {
      return _AwaitingReceiptView(
        productName: profile.linkedProductoName,
        onConfirmReceipt: () {
          ref.read(appStateProvider.notifier).confirmReceipt();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('¡Plan iniciado! Te damos la bienvenida al día 1.'),
            ),
          );
          context.go('/plan');
        },
        onViewOverview: () => context.push('/plan/intro'),
      );
    }

    return switch (profile.userPlanType) {
      UserPlanType.mealReemplazament => _MealPlanInProgreso(
        journey: journey,
        profile: profile,
        onPlanDetails: () => context.push('/journey/report'),
        onCompartir: () {},
      ),
      UserPlanType.noProducto => _PurchaseGuideView(
        hideCard: profile.hidePurchaseGuideCard,
        onBrowse: () => context.go('/mall'),
        onBuyProducto: () => context.push('/collection/product/solar_protein'),
        onProvideOrder: () => context.push('/link-order'),
        onCerrar: () =>
            ref.read(appStateProvider.notifier).hidePurchaseGuideCard(),
      ),
      UserPlanType.nonMealReemplazament => _ProductoCarePlanView(
        profile: profile,
        journey: journey,
        onBrowse: () => context.go('/mall'),
      ),
    };
  }
}

class _PlanHeader extends StatelessWidget {
  const _PlanHeader({required this.onBack});

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
              'Plan de 28 días',
              textAlign: TextAlign.center,
              style: LuckdateTextStyles.title,
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.calendar_month_outlined, size: 22),
            color: LuckdateColors.textPrimary,
          ),
        ],
      ),
    );
  }
}

class _MealPlanInProgreso extends ConsumerWidget {
  const _MealPlanInProgreso({
    required this.journey,
    required this.profile,
    required this.onPlanDetails,
    required this.onCompartir,
  });

  final ViajeState journey;
  final UserProfile profile;
  final VoidCallback onPlanDetails;
  final VoidCallback onCompartir;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final record = journey.todayRecord;
    final tasks = _todayTasks(record);
    final doneCount = tasks.where((t) => t.done).length;

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        LuckdateSpacing.lg,
        0,
        LuckdateSpacing.lg,
        LuckdateSpacing.xl,
      ),
      children: [
        _ActualPlanHero(
          day: journey.day,
          totalDays: journey.totalDays,
          percent: journey.completionPercent,
          onDetails: onPlanDetails,
        ),
        const SizedBox(height: LuckdateSpacing.xl),
        Row(
          children: [
            Text('De hoy Tasks', style: LuckdateTextStyles.h2),
            const Spacer(),
            Text(
              '$doneCount/${tasks.length} Completado',
              style: LuckdateTextStyles.caption.copyWith(
                color: LuckdateColors.deepSage,
                fontPeso: FontPeso.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: LuckdateSpacing.md),
        ...tasks.map(
          (task) => Padding(
            padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
            child: _TaskRow(
              task: task,
              onTap: () => _openQuickSheet(context, ref, task.action, record),
            ),
          ),
        ),
        const SizedBox(height: LuckdateSpacing.md),
        Text('Fases del plan', style: LuckdateTextStyles.h2),
        const SizedBox(height: LuckdateSpacing.md),
        _FasesRow(currentDay: journey.day),
        const SizedBox(height: LuckdateSpacing.xl),
        Text('Herramientas del plan', style: LuckdateTextStyles.h2),
        const SizedBox(height: LuckdateSpacing.md),
        const _PlanToolsRow(),
        const SizedBox(height: LuckdateSpacing.xl),
        _CompartirBanner(onCompartir: onCompartir),
        if (journey.day >= 28) ...[
          const SizedBox(height: LuckdateSpacing.lg),
          LdPrimaryButton(
            label: 'Ver informe del día 28',
            onPressed: onPlanDetails,
          ),
        ],
      ],
    );
  }

  void _openQuickSheet(
    BuildContext context,
    WidgetRef ref,
    _PlanTaskAction action,
    TodayRecord record,
  ) {
    switch (action) {
      case _PlanTaskAction.meal:
        showMealCheckInSheet(context, ref, record);
      case _PlanTaskAction.water:
        showHydrationSheet(context, ref, record, profile.hydrationTargetMl);
      case _PlanTaskAction.weight:
        showPesoSheet(context, ref, record, profile);
      case _PlanTaskAction.sleep:
        showSleepSheet(context, ref, record);
    }
  }

  List<_PlanTask> _todayTasks(TodayRecord record) {
    final mealListo =
        record.productTaken == ProductoTakenStatus.taken ||
        record.productTaken == ProductoTakenStatus.partial ||
        record.meals.isNotEmpty;
    final sleepDone = record.sleepHours > 0 || record.sleepQuality.isNotEmpty;

    return [
      _PlanTask(
        icon: Icons.monitor_weight_outlined,
        color: const Color(0xFF8FA86E),
        title: 'Record de peso',
        subtitle: 'Ritual matutino',
        time: '07:30',
        done: record.weightRecorded,
        valueText: record.weightRecorded && record.weightValueKg > 0
            ? '${record.weightValueKg.toStringAsFixed(1)} kg'
            : (record.weightRecorded ? 'Registrado' : null),
        action: _PlanTaskAction.weight,
      ),
      _PlanTask(
        icon: Icons.local_cafe_outlined,
        color: const Color(0xFFC4A484),
        title: 'Comida nutritiva',
        subtitle: 'Protein matutina',
        time: '08:00',
        done: mealListo,
        valueText: _mealValueText(record),
        action: _PlanTaskAction.meal,
      ),
      _PlanTask(
        icon: Icons.water_drop_outlined,
        color: const Color(0xFF7BA3C4),
        title: 'Bebe 2 vasos',
        subtitle: 'Bebe agua',
        time: '10:00',
        done: record.hydrationMl >= 500,
        valueText: record.hydrationMl > 0 ? '${record.hydrationMl} ml' : null,
        action: _PlanTaskAction.water,
      ),
      _PlanTask(
        icon: Icons.bedtime_outlined,
        color: const Color(0xFF6B7A9E),
        title: 'Preparación para dormir',
        subtitle: 'Protege tu ritmo',
        time: '22:30',
        done: sleepDone,
        valueText: record.sleepHours > 0
            ? '${record.sleepHours.toStringAsFixed(1)} h'
            : (sleepDone ? 'Registrado' : null),
        action: _PlanTaskAction.sleep,
      ),
    ];
  }

  String? _mealValueText(TodayRecord record) {
    MealLogEntry? meal;
    for (final entry in record.meals) {
      final name = entry.name.toLowerCase();
      final type = entry.meal.toLowerCase();
      if (name.contains('protein') || type.contains('replacement')) {
        meal = entry;
        break;
      }
    }
    meal ??= record.meals.isNotEmpty ? record.meals.first : null;
    if (meal != null) return '${meal.kcal} kcal';
    if (record.intakeKcal > 0) return '${record.intakeKcal} kcal';
    if (record.productTaken == ProductoTakenStatus.taken ||
        record.productTaken == ProductoTakenStatus.partial) {
      return 'Registrado';
    }
    return null;
  }
}

enum _PlanTaskAction { meal, water, weight, sleep }

class _PlanTask {
  const _PlanTask({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    required this.time,
    required this.done,
    required this.action,
    this.valueText,
  });

  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final String time;
  final bool done;
  final String? valueText;
  final _PlanTaskAction action;
}

class _ActualPlanHero extends StatelessWidget {
  const _ActualPlanHero({
    required this.day,
    required this.totalDays,
    required this.percent,
    required this.onDetails,
  });

  final int day;
  final int totalDays;
  final int percent;
  final VoidCallback onDetails;

  @override
  Widget build(BuildContext context) {
    final milestoneCount = 12;
    final completedMarks = ((day / totalDays) * milestoneCount)
        .clamp(0, milestoneCount)
        .round();

    return ClipRRect(
      borderRadius: BorderRadius.circular(LuckdateRadius.xl),
      child: Container(
        height: 220,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF6B7A5F), Color(0xFF4A5D45), Color(0xFF3D4A38)],
          ),
        ),
        child: Stack(
          children: [
            Positioned(
              right: -20,
              top: -10,
              child: Icon(
                Icons.self_improvement_rounded,
                size: 160,
                color: Colors.white.withValues(alpha: 0.08),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(LuckdateSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.18),
                      borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                    ),
                    child: Text(
                      'Plan actual',
                      style: LuckdateTextStyles.caption.copyWith(
                        color: LuckdateColors.ivoryWhite,
                        fontPeso: FontPeso.w600,
                      ),
                    ),
                  ),
                  const SizedBox(height: LuckdateSpacing.md),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          'Plan inicial de vitalidad de 28 días',
                          style: LuckdateTextStyles.h2.copyWith(
                            color: LuckdateColors.ivoryWhite,
                          ),
                        ),
                      ),
                      const Icon(
                        Icons.eco_rounded,
                        color: Color(0xFFB8D4A8),
                        size: 20,
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Crea el hábito. Transforma tu vida.',
                    style: LuckdateTextStyles.bodySmall.copyWith(
                      color: LuckdateColors.ivoryWhite.withValues(alpha: 0.85),
                    ),
                  ),
                  const Spacer(),
                  Row(
                    children: [
                      Text(
                        'Progreso: día $day / $totalDays',
                        style: LuckdateTextStyles.caption.copyWith(
                          color: LuckdateColors.ivoryWhite,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '$percent%',
                        style: LuckdateTextStyles.caption.copyWith(
                          color: LuckdateColors.ivoryWhite,
                          fontPeso: FontPeso.w700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                    child: LinearProgresoIndicator(
                      value: (percent / 100).clamp(0.0, 1.0),
                      minHeight: 6,
                      backgroundColor: Colors.white.withValues(alpha: 0.2),
                      color: const Color(0xFFB8D4A8),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      ...List.generate(milestoneCount, (i) {
                        final done = i < completedMarks;
                        return Padding(
                          padding: const EdgeInsets.only(right: 4),
                          child: Container(
                            width: 16,
                            height: 16,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: done
                                  ? const Color(0xFFB8D4A8)
                                  : Colors.transparent,
                              border: Border.all(
                                color: done
                                    ? const Color(0xFFB8D4A8)
                                    : Colors.white.withValues(alpha: 0.45),
                              ),
                            ),
                            child: done
                                ? const Icon(
                                    Icons.check,
                                    size: 10,
                                    color: Color(0xFF3D4A38),
                                  )
                                : null,
                          ),
                        );
                      }),
                      const Spacer(),
                      TextButton(
                        onPressed: onDetails,
                        style: TextButton.styleFrom(
                          backgroundColor: LuckdateColors.ivoryWhite,
                          foregroundColor: LuckdateColors.textPrimary,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                              LuckdateRadius.pill,
                            ),
                          ),
                        ),
                        child: Text(
                          'Detalles del plan >',
                          style: LuckdateTextStyles.caption.copyWith(
                            fontPeso: FontPeso.w700,
                          ),
                        ),
                      ),
                    ],
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

class _TaskRow extends StatelessWidget {
  const _TaskRow({required this.task, required this.onTap});

  final _PlanTask task;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      onTap: onTap,
      padding: const EdgeInsets.symmetric(
        horizontal: LuckdateSpacing.md,
        vertical: LuckdateSpacing.md,
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: task.color.withValues(alpha: 0.18),
              shape: BoxShape.circle,
            ),
            child: Icon(task.icon, color: task.color, size: 20),
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  task.title,
                  style: LuckdateTextStyles.body.copyWith(
                    fontPeso: FontPeso.w600,
                  ),
                ),
                Text(
                  task.done && (task.valueText?.isNotEmpty ?? false)
                      ? task.valueText!
                      : task.subtitle,
                  style: LuckdateTextStyles.caption.copyWith(
                    color: task.done && (task.valueText?.isNotEmpty ?? false)
                        ? LuckdateColors.deepSage
                        : LuckdateColors.textSecondary,
                    fontPeso: task.done && (task.valueText?.isNotEmpty ?? false)
                        ? FontPeso.w600
                        : FontPeso.w400,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            task.done
                ? Icons.check_circle_rounded
                : Icons.radio_button_unchecked,
            size: 20,
            color: task.done
                ? LuckdateColors.deepSage
                : LuckdateColors.lineSoft,
          ),
          const SizedBox(width: LuckdateSpacing.sm),
          Text(task.time, style: LuckdateTextStyles.caption),
          const Icon(
            Icons.chevron_right_rounded,
            color: LuckdateColors.textSecondary,
            size: 20,
          ),
        ],
      ),
    );
  }
}

class _FasesRow extends StatelessWidget {
  const _FasesRow({required this.currentDay});

  final int currentDay;

  @override
  Widget build(BuildContext context) {
    final phases = const [
      (1, 'Inicio', 'Day 1-7', Icons.spa_outlined, 1, 7),
      (2, 'Adaptación', 'Day 8-14', Icons.eco_outlined, 8, 14),
      (3, 'Mejora', 'Day 15-21', Icons.park_outlined, 15, 21),
      (4, 'Consolidación', 'Day 22-28', Icons.landscape_outlined, 22, 28),
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (var i = 0; i < phases.length; i++) ...[
            if (i > 0)
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 4),
                child: Icon(
                  Icons.chevron_right_rounded,
                  size: 18,
                  color: LuckdateColors.textSecondary,
                ),
              ),
            _FaseCard(
              index: phases[i].$1,
              name: phases[i].$2,
              range: phases[i].$3,
              icon: phases[i].$4,
              completed: currentDay > phases[i].$6,
              active: currentDay >= phases[i].$5 && currentDay <= phases[i].$6,
            ),
          ],
        ],
      ),
    );
  }
}

class _FaseCard extends StatelessWidget {
  const _FaseCard({
    required this.index,
    required this.name,
    required this.range,
    required this.icon,
    required this.completed,
    required this.active,
  });

  final int index;
  final String name;
  final String range;
  final IconData icon;
  final bool completed;
  final bool active;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 108,
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: active ? LuckdateColors.sageSoft : LuckdateColors.ivoryWhite,
        borderRadius: BorderRadius.circular(LuckdateRadius.lg),
        border: Border.all(
          color: active ? LuckdateColors.deepSage : LuckdateColors.lineSoft,
        ),
        boxShadow: LuckdateShadows.soft,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'Fase $index',
                style: LuckdateTextStyles.caption.copyWith(
                  fontPeso: FontPeso.w600,
                ),
              ),
              const Spacer(),
              Icon(icon, size: 16, color: LuckdateColors.deepSage),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            name,
            style: LuckdateTextStyles.bodySmall.copyWith(
              fontPeso: FontPeso.w600,
              color: LuckdateColors.textPrimary,
            ),
          ),
          Text(range, style: LuckdateTextStyles.caption),
          const SizedBox(height: 8),
          if (completed)
            const Icon(
              Icons.check_circle_rounded,
              size: 18,
              color: LuckdateColors.deepSage,
            )
          else
            Container(
              width: 20,
              height: 20,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: active
                    ? LuckdateColors.deepSage
                    : LuckdateColors.lineSoft.withValues(alpha: 0.6),
              ),
              child: Text(
                '$index',
                style: LuckdateTextStyles.caption.copyWith(
                  color: active
                      ? LuckdateColors.ivoryWhite
                      : LuckdateColors.textSecondary,
                  fontPeso: FontPeso.w700,
                  fontSize: 10,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _PlanToolsRow extends StatelessWidget {
  const _PlanToolsRow();

  static const _tools = [
    (
      Icons.restaurant_menu_outlined,
      'Guía de alimentación',
      'Nutrition y recetas',
    ),
    (
      Icons.ondemand_video_outlined,
      'Videos de ejercicio',
      'Biblioteca de entrenamiento',
    ),
    (Icons.headphones_outlined, 'Audio de meditación', 'Relájate y enfócate'),
    (Icons.favorite_outline, 'Seguimiento de hábitos', 'Ver progreso'),
    (Icons.insights_outlined, 'Informes de datos', 'Ver tu avance'),
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 132,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _tools.length,
        separatorBuilder: (_, __) => const SizedBox(width: LuckdateSpacing.sm),
        itemBuilder: (context, index) {
          final tool = _tools[index];
          return Container(
            width: 118,
            padding: const EdgeInsets.all(LuckdateSpacing.md),
            decoration: BoxDecoration(
              color: LuckdateColors.ivoryWhite,
              borderRadius: BorderRadius.circular(LuckdateRadius.lg),
              border: Border.all(color: LuckdateColors.lineSoft),
              boxShadow: LuckdateShadows.soft,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: LuckdateColors.sageSoft,
                    borderRadius: BorderRadius.circular(LuckdateRadius.md),
                  ),
                  child: Icon(
                    tool.$1,
                    size: 18,
                    color: LuckdateColors.deepSage,
                  ),
                ),
                const Spacer(),
                Text(
                  tool.$2,
                  style: LuckdateTextStyles.bodySmall.copyWith(
                    fontPeso: FontPeso.w600,
                    color: LuckdateColors.textPrimary,
                  ),
                ),
                Text(tool.$3, style: LuckdateTextStyles.caption),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _CompartirBanner extends StatelessWidget {
  const _CompartirBanner({required this.onCompartir});

  final VoidCallback onCompartir;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.base),
      decoration: BoxDecoration(
        color: const Color(0xFFF3EDE4),
        borderRadius: BorderRadius.circular(LuckdateRadius.xl),
        border: Border.all(color: LuckdateColors.lineSoft),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.wb_sunny_outlined,
            color: LuckdateColors.sunGold,
            size: 28,
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Cada esfuerzo diario hará que tu yo del futuro te lo agradezca.',
                  style: LuckdateTextStyles.bodySmall.copyWith(
                    color: LuckdateColors.textPrimary,
                    fontPeso: FontPeso.w500,
                  ),
                ),
                Text(
                  'Cada pequeño paso cuenta.',
                  style: LuckdateTextStyles.caption,
                ),
              ],
            ),
          ),
          const SizedBox(width: LuckdateSpacing.sm),
          ElevatedButton(
            onPressed: onCompartir,
            style: ElevatedButton.styleFrom(
              backgroundColor: LuckdateColors.deepSage,
              foregroundColor: LuckdateColors.ivoryWhite,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(LuckdateRadius.pill),
              ),
            ),
            child: Text(
              'Compartir plan',
              style: LuckdateTextStyles.caption.copyWith(
                color: LuckdateColors.ivoryWhite,
                fontPeso: FontPeso.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MyPlansView extends StatelessWidget {
  const _MyPlansView({
    required this.profile,
    required this.journey,
    required this.onOpenDetails,
  });

  final UserProfile profile;
  final ViajeState journey;
  final VoidCallback onOpenDetails;

  @override
  Widget build(BuildContext context) {
    final hasMealPlan = profile.hasActiveSlimPlan;
    final awaitingReceipt = profile.isAwaitingReceipt;

    return ListView(
      padding: const EdgeInsets.all(LuckdateSpacing.lg),
      children: [
        Text('Mis planes', style: LuckdateTextStyles.h2),
        const SizedBox(height: LuckdateSpacing.lg),
        if (awaitingReceipt)
          LdCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  profile.linkedProductoName.isEmpty
                      ? 'Solar Protein™'
                      : profile.linkedProductoName,
                  style: LuckdateTextStyles.title,
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                Text(
                  'Entrega pendiente: confirma la recepción para iniciar el día 1.',
                  style: LuckdateTextStyles.bodySmall,
                ),
              ],
            ),
          )
        else if (hasMealPlan)
          LdCard(
            onTap: onOpenDetails,
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: LuckdateColors.sageSoft,
                    borderRadius: BorderRadius.circular(LuckdateRadius.md),
                  ),
                  child: const Icon(
                    Icons.eco_rounded,
                    color: LuckdateColors.deepSage,
                  ),
                ),
                const SizedBox(width: LuckdateSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Plan inicial de vitalidad de 28 días',
                        style: LuckdateTextStyles.title,
                      ),
                      Text(
                        'En curso · día ${journey.day} / ${journey.totalDays}',
                        style: LuckdateTextStyles.bodySmall,
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right_rounded),
              ],
            ),
          )
        else
          LdCard(
            child: Text(
              'Aún no tienes un plan activo de 28 días. Explora la tienda para comenzar.',
              style: LuckdateTextStyles.bodySmall,
            ),
          ),
      ],
    );
  }
}

class _AwaitingReceiptView extends StatelessWidget {
  const _AwaitingReceiptView({
    required this.productName,
    required this.onConfirmReceipt,
    required this.onViewOverview,
  });

  final String productName;
  final VoidCallback onConfirmReceipt;
  final VoidCallback onViewOverview;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(LuckdateSpacing.lg),
      children: [
        Text('Plan en pausa', style: LuckdateTextStyles.h1),
        const SizedBox(height: LuckdateSpacing.sm),
        Text(
          'Tu viaje Slim de 28 días se desbloquea cuando confirmes la entrega.',
          style: LuckdateTextStyles.body,
        ),
        const SizedBox(height: LuckdateSpacing.xl),
        LdAwaitingReceiptPanel(
          productName: productName,
          onConfirmReceipt: onConfirmReceipt,
          onViewOverview: onViewOverview,
        ),
      ],
    );
  }
}

class _PurchaseGuideView extends StatelessWidget {
  const _PurchaseGuideView({
    required this.hideCard,
    required this.onBrowse,
    required this.onBuyProducto,
    required this.onProvideOrder,
    required this.onCerrar,
  });

  final bool hideCard;
  final VoidCallback onBrowse;
  final VoidCallback onBuyProducto;
  final VoidCallback onProvideOrder;
  final VoidCallback onCerrar;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(LuckdateSpacing.lg),
      children: [
        Text('Inicia tu viaje de 28 días', style: LuckdateTextStyles.h1),
        const SizedBox(height: LuckdateSpacing.sm),
        Text(
          'Solar Protein desbloquea el viaje Slim completo: rituales diarios, hitos y apoyo de Sunny.',
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
                  'Desbloquea tu plan de salud completo',
                  style: LuckdateTextStyles.title,
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                Text(
                  'Obtén Solar Protein para iniciar tu viaje Slim de 28 días.',
                  style: LuckdateTextStyles.bodySmall,
                ),
                const SizedBox(height: LuckdateSpacing.lg),
                LdPrimaryButton(
                  label: 'Comprar producto',
                  onPressed: onBuyProducto,
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                LdSecondaryButton(
                  label: 'Proporcionar número de pedido',
                  onPressed: onProvideOrder,
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                Row(
                  children: [
                    Expanded(
                      child: LdSecondaryButton(
                        label: 'Explorar tienda',
                        onPressed: onBrowse,
                      ),
                    ),
                    TextButton(
                      onPressed: onCerrar,
                      child: const Text('Cerrar'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        const SizedBox(height: LuckdateSpacing.lg),
        LdPrimaryButton(label: 'Comprar producto', onPressed: onBuyProducto),
        const SizedBox(height: LuckdateSpacing.sm),
        LdSecondaryButton(
          label: 'Proporcionar número de pedido',
          onPressed: onProvideOrder,
        ),
      ],
    );
  }
}

class _ProductoCarePlanView extends StatelessWidget {
  const _ProductoCarePlanView({
    required this.profile,
    required this.journey,
    required this.onBrowse,
  });

  final UserProfile profile;
  final ViajeState journey;
  final VoidCallback onBrowse;

  @override
  Widget build(BuildContext context) {
    final productName = profile.linkedProductoName.isEmpty
        ? 'Tu producto'
        : profile.linkedProductoName;

    return ListView(
      padding: const EdgeInsets.all(LuckdateSpacing.lg),
      children: [
        Text('Plan de cuidado del producto', style: LuckdateTextStyles.h1),
        const SizedBox(height: LuckdateSpacing.sm),
        Text(
          'Recordatorios diarios para $productName. Registra rituales en el chat con Sunny y sigue tu vitalidad en Viaje.',
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
                'Recordatorio: ${profile.reminderTime} & ${profile.reminderTime2}',
                style: LuckdateTextStyles.bodySmall,
              ),
              const SizedBox(height: LuckdateSpacing.sm),
              Text(
                journey.todayRecord.productTaken == ProductoTakenStatus.taken
                    ? 'Tomado hoy ✓'
                    : 'Aún no registrado hoy',
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
                      'Mejorar al viaje Slim de 28 días',
                      style: LuckdateTextStyles.title,
                    ),
                    Text(
                      'El reemplazo de comida desbloquea el plan completo con hitos.',
                      style: LuckdateTextStyles.bodySmall,
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
        const SizedBox(height: LuckdateSpacing.lg),
        LdPrimaryButton(label: 'Explorar tienda', onPressed: onBrowse),
      ],
    );
  }
}
