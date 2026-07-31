import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/sleep_record_helper.dart';

class CheckInRecordPage extends ConsumerStatefulWidget {
  const CheckInRecordPage({super.key});

  @override
  ConsumerState<CheckInRecordPage> createState() => _CheckInRecordPageState();
}

class _CheckInRecordPageState extends ConsumerState<CheckInRecordPage> {
  late DateTime _selectedDay;

  @override
  void initState() {
    super.initState();
    _selectedDay = DateTime.now();
  }

  bool get _isHoy {
    final now = DateTime.now();
    return _selectedDay.year == now.year &&
        _selectedDay.month == now.month &&
        _selectedDay.day == now.day;
  }

  Future<void> _editExerciseGoal(int current) async {
    final controller = TextEditingController(text: '$current');
    final result = await showDialog<int>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LuckdateRadius.xl),
        ),
        title: const Text('Editar meta de ejercicio'),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          autofocus: true,
          decoration: const InputDecoration(
            labelText: 'Meta diaria (kcal)',
            suffixText: 'kcal',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              final v = int.tryParse(controller.text.trim());
              if (v != null && v > 0) Navigator.pop(ctx, v);
            },
            child: const Text('Guardar'),
          ),
        ],
      ),
    );
    controller.dispose();
    if (result != null) {
      ref.read(appStateProvider.notifier).updateExerciseTarget(result);
    }
  }

  Future<void> _editCalorieGoal(int current) async {
    final controller = TextEditingController(text: '$current');
    final result = await showDialog<int>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LuckdateRadius.xl),
        ),
        title: const Text('Editar meta de calorías'),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          autofocus: true,
          decoration: const InputDecoration(
            labelText: 'Meta diaria de consumo (kcal)',
            suffixText: 'kcal',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              final v = int.tryParse(controller.text.trim());
              if (v != null && v > 0) Navigator.pop(ctx, v);
            },
            child: const Text('Guardar'),
          ),
        ],
      ),
    );
    controller.dispose();
    if (result != null) {
      ref.read(appStateProvider.notifier).updateCalorieTarget(result);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(appStateProvider).profile;
    final record = ref.watch(appStateProvider).journey.todayRecord;

    // Historical days are demo-empty; live AI estimates only apply to today.
    final live = _isHoy ? record : const TodayRecord();
    final calorieMeta = profile.calorieTargetKcal;
    final exerciseMeta = profile.exerciseTargetKcal;
    final waterMl = live.hydrationMl;
    final waterMeta = profile.hydrationTargetMl > 0
        ? profile.hydrationTargetMl
        : 2000;
    final waterCups = (waterMeta / 250).round().clamp(4, 10);
    final filledCups = ((waterMl / waterMeta) * waterCups).round().clamp(
      0,
      waterCups,
    );
    final intakePct = calorieMeta <= 0
        ? 0
        : ((live.intakeKcal / calorieMeta) * 100).round().clamp(0, 999);
    final exercisePct = exerciseMeta <= 0
        ? 0
        : ((live.exerciseKcal / exerciseMeta) * 100).round().clamp(0, 999);

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            _Header(
              onBack: () {
                if (context.canPop()) {
                  context.pop();
                } else {
                  context.go('/ritual');
                }
              },
              onChat: () => context.push('/home'),
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
                  _SourceBanner(onChat: () => context.push('/home')),
                  const SizedBox(height: LuckdateSpacing.md),
                  _DateSwitcher(
                    date: _selectedDay,
                    isHoy: _isHoy,
                    onPrev: () => setState(
                      () => _selectedDay = _selectedDay.subtract(
                        const Duration(days: 1),
                      ),
                    ),
                    onNext: () => setState(
                      () => _selectedDay = _selectedDay.add(
                        const Duration(days: 1),
                      ),
                    ),
                  ),
                  const SizedBox(height: LuckdateSpacing.lg),
                  _IntakeOverviewCard(
                    intakeKcal: live.intakeKcal,
                    goalKcal: calorieMeta,
                    percent: intakePct,
                    protein: live.proteinG,
                    carbs: live.carbsG,
                    fat: live.fatG,
                    fiber: live.fiberG,
                    onEditGoal: () => _editCalorieGoal(calorieMeta),
                  ),
                  const SizedBox(height: LuckdateSpacing.lg),
                  _ExerciseCard(
                    burnedKcal: live.exerciseKcal,
                    goalKcal: exerciseMeta,
                    percent: exercisePct,
                    minutes: live.exerciseMinutes,
                    sessions: live.exerciseSessions,
                    onEditGoal: () => _editExerciseGoal(exerciseMeta),
                  ),
                  const SizedBox(height: LuckdateSpacing.lg),
                  _SleepCard(record: live),
                  const SizedBox(height: LuckdateSpacing.xl),
                  Text('Comidas de hoy', style: LuckdateTextStyles.h2),
                  const SizedBox(height: LuckdateSpacing.md),
                  if (live.meals.isEmpty)
                    LdCard(
                      child: Text(
                        'Aún no has registrado comidas. Dile a Sunny qué comiste o usa un registro rápido: las calorías se estiman automáticamente.',
                        style: LuckdateTextStyles.bodySmall,
                      ),
                    )
                  else
                    ...live.meals.map(
                      (meal) => Padding(
                        padding: const EdgeInsets.only(
                          bottom: LuckdateSpacing.sm,
                        ),
                        child: _MealCard(meal: meal),
                      ),
                    ),
                  Center(
                    child: TextButton.icon(
                      onPressed: () => context.push('/home'),
                      icon: const Icon(Icons.add, size: 18),
                      label: Text(
                        'Registrar con Sunny',
                        style: LuckdateTextStyles.caption.copyWith(
                          fontWeight: FontWeight.w600,
                          color: LuckdateColors.deepSage,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: LuckdateSpacing.md),
                  Text('Agua de hoy', style: LuckdateTextStyles.h2),
                  const SizedBox(height: LuckdateSpacing.md),
                  _AguaCard(
                    filledCups: filledCups,
                    totalCups: waterCups,
                    ml: waterMl,
                    targetMl: waterMeta,
                  ),
                  const SizedBox(height: LuckdateSpacing.xl),
                  Text('Análisis de nutrición', style: LuckdateTextStyles.h2),
                  const SizedBox(height: LuckdateSpacing.md),
                  _NutritionAnalysisSection(meals: live.meals),
                  const SizedBox(height: LuckdateSpacing.lg),
                  _TipBanner(
                    onViewAdvice: () => context.push('/sunny/suggestions'),
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

class _SourceBanner extends StatelessWidget {
  const _SourceBanner({required this.onChat});

  final VoidCallback onChat;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onChat,
      borderRadius: BorderRadius.circular(LuckdateRadius.lg),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(LuckdateSpacing.md),
        decoration: BoxDecoration(
          color: LuckdateColors.sageSoft,
          borderRadius: BorderRadius.circular(LuckdateRadius.lg),
          border: Border.all(
            color: LuckdateColors.vitalitySage.withValues(alpha: 0.35),
          ),
        ),
        child: Row(
          children: [
            const Icon(
              Icons.auto_awesome,
              color: LuckdateColors.deepSage,
              size: 18,
            ),
            const SizedBox(width: LuckdateSpacing.sm),
            Expanded(
              child: Text(
                'La dieta, el ejercicio, el sueño y el agua se sincronizan desde el chat con Sunny y los registros rápidos. La IA estima consumo y gasto calórico.',
                style: LuckdateTextStyles.caption.copyWith(
                  color: LuckdateColors.textPrimary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.onBack, required this.onChat});

  final VoidCallback onBack;
  final VoidCallback onChat;

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
              'Registro diario',
              textAlign: TextAlign.center,
              style: LuckdateTextStyles.title,
            ),
          ),
          IconButton(
            onPressed: onChat,
            icon: const Icon(Icons.chat_bubble_outline_rounded, size: 22),
            color: LuckdateColors.textPrimary,
            tooltip: 'Registrar con Sunny',
          ),
        ],
      ),
    );
  }
}

class _DateSwitcher extends StatelessWidget {
  const _DateSwitcher({
    required this.date,
    required this.isHoy,
    required this.onPrev,
    required this.onNext,
  });

  final DateTime date;
  final bool isHoy;
  final VoidCallback onPrev;
  final VoidCallback onNext;

  @override
  Widget build(BuildContext context) {
    final label = DateFormat('MMMM d, y').format(date);
    return LdCard(
      padding: const EdgeInsets.symmetric(
        horizontal: LuckdateSpacing.sm,
        vertical: LuckdateSpacing.sm,
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: onPrev,
            icon: const Icon(Icons.chevron_left_rounded),
          ),
          Expanded(
            child: Text(
              isHoy ? '$label · Hoy' : label,
              textAlign: TextAlign.center,
              style: LuckdateTextStyles.body.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
          IconButton(
            onPressed: onNext,
            icon: const Icon(Icons.chevron_right_rounded),
          ),
        ],
      ),
    );
  }
}

class _IntakeOverviewCard extends StatelessWidget {
  const _IntakeOverviewCard({
    required this.intakeKcal,
    required this.goalKcal,
    required this.percent,
    required this.protein,
    required this.carbs,
    required this.fat,
    required this.fiber,
    required this.onEditGoal,
  });

  final int intakeKcal;
  final int goalKcal;
  final int percent;
  final int protein;
  final int carbs;
  final int fat;
  final int fiber;
  final VoidCallback onEditGoal;

  @override
  Widget build(BuildContext context) {
    final macros = [
      ('Proteína', protein, 120, 'Recomendado 80-120g', LuckdateColors.deepSage),
      ('Carbohidratos', carbs, 160, 'Recomendado 120-180g', const Color(0xFFD4A373)),
      ('Grasas', fat, 60, 'Recomendado 40-75g', const Color(0xFF9A8BB5)),
      ('Fibra', fiber, 25, 'Recomendado 20-30g', const Color(0xFF7BA3C4)),
    ];

    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Resumen de consumo diario', style: LuckdateTextStyles.title),
          const SizedBox(height: LuckdateSpacing.md),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$intakeKcal kcal',
                      style: LuckdateTextStyles.h1.copyWith(fontSize: 28),
                    ),
                    InkWell(
                      onTap: onEditGoal,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Meta $goalKcal kcal',
                            style: LuckdateTextStyles.caption,
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.edit_outlined,
                            size: 12,
                            color: LuckdateColors.textSecondary,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(
                width: 84,
                height: 84,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 84,
                      height: 84,
                      child: CircularProgressIndicator(
                        value: (percent / 100).clamp(0.0, 1.0),
                        strokeWidth: 8,
                        backgroundColor: LuckdateColors.lineSoft.withValues(
                          alpha: 0.5,
                        ),
                        color: LuckdateColors.deepSage,
                        strokeCap: StrokeCap.round,
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '$percent%',
                          style: LuckdateTextStyles.title.copyWith(
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          'Alcanzado',
                          style: LuckdateTextStyles.caption.copyWith(
                            fontSize: 9,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.lg),
          ...macros.map((m) {
            final progress = m.$3 == 0 ? 0.0 : (m.$2 / m.$3).clamp(0.0, 1.0);
            return Padding(
              padding: const EdgeInsets.only(bottom: LuckdateSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        m.$1,
                        style: LuckdateTextStyles.bodySmall.copyWith(
                          fontWeight: FontWeight.w600,
                          color: LuckdateColors.textPrimary,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '${m.$2} / ${m.$3}g',
                        style: LuckdateTextStyles.caption,
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                    child: LinearProgressIndicator(
                      value: progress,
                      minHeight: 8,
                      backgroundColor: LuckdateColors.lineSoft,
                      color: m.$5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(m.$4, style: LuckdateTextStyles.caption),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _ExerciseCard extends StatelessWidget {
  const _ExerciseCard({
    required this.burnedKcal,
    required this.goalKcal,
    required this.percent,
    required this.minutes,
    required this.sessions,
    required this.onEditGoal,
  });

  final int burnedKcal;
  final int goalKcal;
  final int percent;
  final int minutes;
  final int sessions;
  final VoidCallback onEditGoal;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text("Hoy's Exercise Burn", style: LuckdateTextStyles.title),
              const SizedBox(width: 4),
              const Icon(
                Icons.info_outline,
                size: 16,
                color: LuckdateColors.textSecondary,
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.md),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '$burnedKcal',
                          style: LuckdateTextStyles.h1.copyWith(
                            fontSize: 32,
                            color: LuckdateColors.deepSage,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Padding(
                          padding: const EdgeInsets.only(bottom: 6),
                          child: Text('kcal', style: LuckdateTextStyles.body),
                        ),
                      ],
                    ),
                    InkWell(
                      onTap: onEditGoal,
                      borderRadius: BorderRadius.circular(LuckdateRadius.sm),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              "Hoy's goal $goalKcal kcal",
                              style: LuckdateTextStyles.caption,
                            ),
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.edit_outlined,
                              size: 14,
                              color: LuckdateColors.textSecondary,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(
                width: 88,
                height: 88,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 88,
                      height: 88,
                      child: CircularProgressIndicator(
                        value: (percent / 100).clamp(0.0, 1.0),
                        strokeWidth: 8,
                        backgroundColor: LuckdateColors.lineSoft.withValues(
                          alpha: 0.5,
                        ),
                        color: LuckdateColors.deepSage,
                        strokeCap: StrokeCap.round,
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '$percent%',
                          style: LuckdateTextStyles.title.copyWith(
                            fontSize: 18,
                          ),
                        ),
                        Text(
                          'Alcanzado',
                          style: LuckdateTextStyles.caption.copyWith(
                            fontSize: 9,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.md),
          Row(
            children: [
              Expanded(
                child: _MiniStat(
                  icon: Icons.schedule_rounded,
                  label: 'Duración',
                  value: '$minutes min',
                ),
              ),
              const SizedBox(width: LuckdateSpacing.sm),
              Expanded(
                child: _MiniStat(
                  icon: Icons.local_fire_department_outlined,
                  label: 'Sesiones',
                  value: '$sessions / ${sessions > 0 ? sessions : 1}',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: LuckdateColors.cloudIvory,
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
        border: Border.all(color: LuckdateColors.lineSoft),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: LuckdateColors.deepSage),
              const SizedBox(width: 4),
              Text(label, style: LuckdateTextStyles.caption),
            ],
          ),
          const SizedBox(height: 6),
          Text(value, style: LuckdateTextStyles.title.copyWith(fontSize: 16)),
        ],
      ),
    );
  }
}

class _SleepCard extends StatelessWidget {
  const _SleepCard({required this.record});

  final TodayRecord record;

  @override
  Widget build(BuildContext context) {
    final hasData = record.hasSleepRecord;
    return LdCard(
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: LuckdateColors.sageSoft,
              borderRadius: BorderRadius.circular(LuckdateRadius.md),
            ),
            child: const Icon(
              Icons.bedtime_outlined,
              color: LuckdateColors.deepSage,
            ),
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Registro de sueño', style: LuckdateTextStyles.title),
                Text(
                  hasData
                      ? SleepRecordHelper.summary(record)
                      : 'Dile a Sunny cómo dormiste: se sincroniza aquí automáticamente.',
                  style: LuckdateTextStyles.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MealCard extends StatelessWidget {
  const _MealCard({required this.meal});

  final MealLogEntry meal;

  IconData get _icon {
    switch (meal.meal.toLowerCase()) {
      case 'breakfast':
        return Icons.breakfast_dining_outlined;
      case 'lunch':
        return Icons.lunch_dining_outlined;
      case 'dinner':
        return Icons.dinner_dining_outlined;
      default:
        return Icons.restaurant_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    return LdCard(
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      child: Row(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: LuckdateColors.sageSoft,
              borderRadius: BorderRadius.circular(LuckdateRadius.md),
            ),
            child: Icon(_icon, color: LuckdateColors.deepSage, size: 28),
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      meal.meal,
                      style: LuckdateTextStyles.caption.copyWith(
                        fontWeight: FontWeight.w700,
                        color: LuckdateColors.deepSage,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(meal.time, style: LuckdateTextStyles.caption),
                    const Spacer(),
                    Text(
                      '${meal.kcal} kcal',
                      style: LuckdateTextStyles.bodySmall.copyWith(
                        fontWeight: FontWeight.w700,
                        color: LuckdateColors.textPrimary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  meal.name,
                  style: LuckdateTextStyles.body.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'P ${meal.protein}g · C ${meal.carbs}g · F ${meal.fat}g · vía ${meal.source}',
                  style: LuckdateTextStyles.caption,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AguaCard extends StatelessWidget {
  const _AguaCard({
    required this.filledCups,
    required this.totalCups,
    required this.ml,
    required this.targetMl,
  });

  final int filledCups;
  final int totalCups;
  final int ml;
  final int targetMl;

  @override
  Widget build(BuildContext context) {
    final reached = ml >= targetMl;
    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                reached
                    ? '$filledCups / $totalCups goal reached'
                    : '$filledCups / $totalCups cups',
                style: LuckdateTextStyles.body.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const Spacer(),
              Text(
                '$ml ml',
                style: LuckdateTextStyles.caption.copyWith(
                  fontWeight: FontWeight.w700,
                  color: LuckdateColors.deepSage,
                ),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.md),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: List.generate(totalCups, (i) {
              final filled = i < filledCups;
              return Icon(
                filled ? Icons.local_drink : Icons.local_drink_outlined,
                size: 28,
                color: filled
                    ? LuckdateColors.deepSage
                    : LuckdateColors.lineSoft,
              );
            }),
          ),
        ],
      ),
    );
  }
}

class _NutritionAnalysisSection extends StatelessWidget {
  const _NutritionAnalysisSection({required this.meals});

  final List<MealLogEntry> meals;

  @override
  Widget build(BuildContext context) {
    final breakfast = meals
        .where((m) => m.meal.toLowerCase() == 'breakfast')
        .fold(0, (s, m) => s + m.kcal);
    final lunch = meals
        .where((m) => m.meal.toLowerCase() == 'lunch')
        .fold(0, (s, m) => s + m.kcal);
    final dinner = meals
        .where((m) => m.meal.toLowerCase() == 'dinner')
        .fold(0, (s, m) => s + m.kcal);
    final total = (breakfast + lunch + dinner).clamp(1, 99999);
    final bars = [
      ('Desayuno', breakfast / total),
      ('Comida', lunch / total),
      ('Cena', dinner / total),
    ];

    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _DonutCard(
                title: 'Fuente de proteína',
                centerLabel: meals.isEmpty ? '--' : 'Excelente',
                sections: const [
                  (0.6, LuckdateColors.deepSage, 'Animal 60%'),
                  (0.3, LuckdateColors.vitalitySage, 'Vegetal 30%'),
                  (0.1, LuckdateColors.sunGold, 'Otro 10%'),
                ],
              ),
            ),
            const SizedBox(width: LuckdateSpacing.sm),
            Expanded(
              child: _DonutCard(
                title: 'Equilibrio de la dieta',
                centerLabel: meals.isEmpty ? '--' : 'Bien',
                sections: const [
                  (0.45, LuckdateColors.vitalitySage, 'Verduras 45%'),
                  (0.30, LuckdateColors.sunGold, 'Granos 30%'),
                  (0.25, LuckdateColors.deepSage, 'Proteína 25%'),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: LuckdateSpacing.sm),
        LdCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Distribución de calorías',
                style: LuckdateTextStyles.caption.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: LuckdateSpacing.md),
              if (meals.isEmpty)
                Text(
                  'La distribución aparece después de registrar comidas en el chat.',
                  style: LuckdateTextStyles.caption,
                )
              else
                ...bars.map((b) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 72,
                          child: Text(b.$1, style: LuckdateTextStyles.caption),
                        ),
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(
                              LuckdateRadius.pill,
                            ),
                            child: LinearProgressIndicator(
                              value: b.$2,
                              minHeight: 10,
                              backgroundColor: LuckdateColors.lineSoft,
                              color: LuckdateColors.deepSage,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${(b.$2 * 100).round()}%',
                          style: LuckdateTextStyles.caption.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  );
                }),
            ],
          ),
        ),
      ],
    );
  }
}

class _DonutCard extends StatelessWidget {
  const _DonutCard({
    required this.title,
    required this.centerLabel,
    required this.sections,
  });

  final String title;
  final String centerLabel;
  final List<(double, Color, String)> sections;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: LuckdateTextStyles.caption.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          SizedBox(
            height: 88,
            child: Stack(
              alignment: Alignment.center,
              children: [
                PieChart(
                  PieChartData(
                    sectionsSpace: 2,
                    centerSpaceRadius: 22,
                    sections: [
                      for (final s in sections)
                        PieChartSectionData(
                          value: s.$1,
                          color: s.$2,
                          radius: 16,
                          showTitle: false,
                        ),
                    ],
                  ),
                ),
                Text(
                  centerLabel,
                  style: LuckdateTextStyles.caption.copyWith(
                    fontWeight: FontWeight.w700,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          ...sections.map(
            (s) => Padding(
              padding: const EdgeInsets.only(bottom: 2),
              child: Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: s.$2,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      s.$3,
                      style: LuckdateTextStyles.caption.copyWith(fontSize: 9),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TipBanner extends StatelessWidget {
  const _TipBanner({required this.onViewAdvice});

  final VoidCallback onViewAdvice;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.base),
      decoration: BoxDecoration(
        color: LuckdateColors.sageSoft,
        borderRadius: BorderRadius.circular(LuckdateRadius.xl),
        border: Border.all(
          color: LuckdateColors.vitalitySage.withValues(alpha: 0.35),
        ),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.wb_sunny_outlined,
            color: LuckdateColors.sunGold,
            size: 22,
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Text(
              'Consejo: acompaña la cena con verduras para favorecer un mejor sueño.',
              style: LuckdateTextStyles.bodySmall,
            ),
          ),
          TextButton(
            onPressed: onViewAdvice,
            style: TextButton.styleFrom(
              foregroundColor: LuckdateColors.deepSage,
              padding: const EdgeInsets.symmetric(horizontal: 8),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: Text(
              'Ver consejos',
              style: LuckdateTextStyles.caption.copyWith(
                fontWeight: FontWeight.w700,
                color: LuckdateColors.deepSage,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

