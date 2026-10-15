import '../models/models.dart';
import 'sleep_record_helper.dart';

/// Today's plan tasks, derived only from [TodayRecord].
///
/// Completion rules match the existing plan page: recording a value is not
/// the same as hitting a health target, and the set is the four rituals the
/// plan already shows. Callers must not increment a local counter.
enum TodayTaskKind { weight, meal, water, sleep }

class TodayTaskView {
  const TodayTaskView({
    required this.kind,
    required this.title,
    required this.subtitle,
    required this.time,
    required this.done,
    this.valueText,
  });

  final TodayTaskKind kind;
  final String title;
  final String subtitle;
  final String time;
  final bool done;
  final String? valueText;

  String get detail =>
      done && (valueText?.isNotEmpty ?? false) ? valueText! : subtitle;
}

List<TodayTaskView> todayTasksOf(TodayRecord record) {
  final mealReady =
      record.productTaken == ProductTakenStatus.taken ||
      record.productTaken == ProductTakenStatus.partial ||
      record.meals.isNotEmpty;
  final sleepDone = record.hasSleepRecord;

  return [
    TodayTaskView(
      kind: TodayTaskKind.weight,
      title: 'Registro de peso',
      subtitle: 'Ritual matutino',
      time: '07:30',
      done: record.weightRecorded,
      valueText: record.weightRecorded && record.weightValueKg > 0
          ? '${record.weightValueKg.toStringAsFixed(1)} kg'
          : (record.weightRecorded ? 'Registrado' : null),
    ),
    TodayTaskView(
      kind: TodayTaskKind.meal,
      title: 'Comida nutritiva',
      subtitle: 'Proteína matutina',
      time: '08:00',
      done: mealReady,
      valueText: _mealValueText(record),
    ),
    TodayTaskView(
      kind: TodayTaskKind.water,
      title: 'Bebe 2 vasos',
      subtitle: 'Bebe agua',
      time: '10:00',
      done: record.hydrationMl >= 500,
      valueText: record.hydrationMl > 0 ? '${record.hydrationMl} ml' : null,
    ),
    TodayTaskView(
      kind: TodayTaskKind.sleep,
      title: 'Preparación para dormir',
      subtitle: 'Protege tu ritmo',
      time: '22:30',
      done: sleepDone,
      valueText: sleepDone ? SleepRecordHelper.summary(record) : null,
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
  if (record.productTaken == ProductTakenStatus.taken ||
      record.productTaken == ProductTakenStatus.partial) {
    return 'Registrado';
  }
  return null;
}
