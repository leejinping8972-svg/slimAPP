import '../models/models.dart';

/// Maps [TodayRecord] fields into pseudo-records for modify matching.
class ListTodayCheckIns {
  static String aggregateId(CheckInType type) => 'today:${type.name}';

  static List<CheckInDraft> byType(TodayRecord today, CheckInType type) {
    switch (type) {
      case CheckInType.water:
        if (today.hydrationMl <= 0) return const [];
        return [
          CheckInDraft(
            type: type,
            value: '${today.hydrationMl}',
            unit: 'ml',
            label: '${today.hydrationMl} ml',
            targetId: aggregateId(type),
            mode: CheckInDraftMode.edit,
            confidence: 1,
            rawFields: {'value': '${today.hydrationMl}'},
          ),
        ];
      case CheckInType.sleep:
        if (!today.hasSleepRecord) return const [];
        return [
          CheckInDraft(
            type: type,
            value: today.sleepHours > 0
                ? today.sleepHours.toString()
                : today.sleepQuality,
            unit: today.sleepHours > 0 ? 'h' : '',
            time: today.sleepBedtime,
            label: today.sleepHours > 0
                ? '${today.sleepHours} h (${today.sleepQuality})'
                : today.sleepQuality,
            targetId: aggregateId(type),
            mode: CheckInDraftMode.edit,
            confidence: 1,
            rawFields: {
              'value': today.sleepHours > 0
                  ? today.sleepHours.toString()
                  : today.sleepQuality,
              'quality': today.sleepQuality,
              'bedtime': today.sleepBedtime,
              'wake': today.sleepWakeTime,
            },
          ),
        ];
      case CheckInType.weight:
        if (!today.weightRecorded) return const [];
        return [
          CheckInDraft(
            type: type,
            value: today.weightValueKg > 0
                ? today.weightValueKg.toString()
                : 'logged',
            unit: 'kg',
            label: today.weightValueKg > 0
                ? '${today.weightValueKg} kg'
                : 'peso registrado',
            targetId: aggregateId(type),
            mode: CheckInDraftMode.edit,
            confidence: 1,
            rawFields: {
              'value': today.weightValueKg > 0
                  ? today.weightValueKg.toString()
                  : '',
            },
          ),
        ];
      case CheckInType.exercise:
        if (today.exerciseMinutes <= 0 && today.exerciseSessions <= 0) {
          return const [];
        }
        return [
          CheckInDraft(
            type: type,
            value: '${today.exerciseMinutes}',
            unit: 'min',
            label: '${today.exerciseMinutes} min · ${today.exerciseKcal} kcal',
            targetId: aggregateId(type),
            mode: CheckInDraftMode.edit,
            confidence: 1,
            rawFields: {
              'value': '${today.exerciseMinutes}',
              'kcal': '${today.exerciseKcal}',
            },
          ),
        ];
      case CheckInType.mood:
        if (today.moodTag.isEmpty) return const [];
        return [
          CheckInDraft(
            type: type,
            value: today.moodTag,
            label: today.moodTag,
            targetId: aggregateId(type),
            mode: CheckInDraftMode.edit,
            confidence: 1,
            rawFields: {'value': today.moodTag},
          ),
        ];
      case CheckInType.product:
        if (today.productTaken != ProductTakenStatus.taken) return const [];
        return [
          CheckInDraft(
            type: type,
            value: 'taken',
            label: 'Solar Protein',
            targetId: aggregateId(type),
            mode: CheckInDraftMode.edit,
            confidence: 1,
            rawFields: {'value': 'taken'},
          ),
        ];
      case CheckInType.meal:
        return [
          for (var i = 0; i < today.meals.length; i++)
            CheckInDraft(
              type: type,
              value: today.meals[i].name,
              time: today.meals[i].time,
              unit: 'kcal',
              label:
                  '${today.meals[i].name} · ${today.meals[i].kcal} kcal · ${today.meals[i].time}',
              targetId: today.meals[i].id.isNotEmpty
                  ? today.meals[i].id
                  : 'meal_idx_$i',
              mode: CheckInDraftMode.edit,
              confidence: 1,
              rawFields: {
                'value': today.meals[i].name,
                'kcal': '${today.meals[i].kcal}',
                'time': today.meals[i].time,
                'meal': today.meals[i].meal,
              },
            ),
        ];
    }
  }
}
