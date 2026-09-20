import '../models/models.dart';

/// Applies a confirmed [CheckInDraft] onto [TodayRecord].
class CheckInApply {
  static String nowTime() {
    final n = DateTime.now();
    return '${n.hour.toString().padLeft(2, '0')}:${n.minute.toString().padLeft(2, '0')}';
  }

  static String newMealId() => 'meal_${DateTime.now().microsecondsSinceEpoch}';

  static TodayRecord apply(TodayRecord today, CheckInDraft draft) {
    return switch (draft.mode) {
      CheckInDraftMode.create => _create(today, draft),
      CheckInDraftMode.edit => _edit(today, draft),
    };
  }

  static TodayRecord _create(TodayRecord today, CheckInDraft draft) {
    switch (draft.type) {
      case CheckInType.water:
        final add = int.tryParse(draft.value) ?? 250;
        return today.copyWith(hydrationMl: today.hydrationMl + add);
      case CheckInType.sleep:
        final hours = double.tryParse(draft.value) ?? 7;
        final quality = draft.rawFields['quality'] ?? 'okay';
        return today.copyWith(
          sleepHours: hours,
          sleepQuality: quality,
          sleepBedtime: draft.time.isNotEmpty
              ? draft.time
              : (draft.rawFields['bedtime'] ?? today.sleepBedtime),
          sleepWakeTime: draft.rawFields['wake'] ?? today.sleepWakeTime,
        );
      case CheckInType.weight:
        final kg = double.tryParse(draft.value) ?? 0;
        return today.copyWith(
          weightRecorded: true,
          weightValueKg: kg > 0 ? kg : today.weightValueKg,
        );
      case CheckInType.exercise:
        final minutes = int.tryParse(draft.value) ?? 30;
        final kcal = int.tryParse(draft.rawFields['kcal'] ?? '') ??
            (minutes * 7.1).round();
        return today.copyWith(
          exerciseMinutes: today.exerciseMinutes + minutes,
          exerciseKcal: today.exerciseKcal + kcal,
          exerciseSessions: today.exerciseSessions + 1,
        );
      case CheckInType.mood:
        return today.copyWith(moodTag: draft.value.isEmpty ? 'tired' : draft.value);
      case CheckInType.product:
        final meal = MealLogEntry(
          id: newMealId(),
          meal: 'Meal Replacement',
          name: 'Solar Protein Shake',
          time: draft.time.isNotEmpty ? draft.time : nowTime(),
          kcal: 280,
          protein: 28,
          carbs: 12,
          fat: 8,
          source: 'chat',
        );
        if (today.productTaken == ProductTakenStatus.taken &&
            today.meals.any((m) => m.name.contains('Solar Protein'))) {
          return today.copyWith(productTaken: ProductTakenStatus.taken);
        }
        return today.copyWith(
          productTaken: ProductTakenStatus.taken,
          meals: [...today.meals, meal],
          intakeKcal: today.intakeKcal + meal.kcal,
          proteinG: today.proteinG + meal.protein,
          carbsG: today.carbsG + meal.carbs,
          fatG: today.fatG + meal.fat,
          fiberG: today.fiberG + 4,
        );
      case CheckInType.meal:
        final kcal = int.tryParse(draft.rawFields['kcal'] ?? '') ?? 320;
        final meal = MealLogEntry(
          id: newMealId(),
          meal: draft.rawFields['meal'] ?? 'Meal',
          name: draft.value.isEmpty ? 'Comida' : draft.value,
          time: draft.time.isNotEmpty ? draft.time : nowTime(),
          kcal: kcal,
          protein: int.tryParse(draft.rawFields['protein'] ?? '') ?? 18,
          carbs: int.tryParse(draft.rawFields['carbs'] ?? '') ?? 30,
          fat: int.tryParse(draft.rawFields['fat'] ?? '') ?? 10,
          source: 'chat',
        );
        return today.copyWith(
          meals: [...today.meals, meal],
          intakeKcal: today.intakeKcal + meal.kcal,
          proteinG: today.proteinG + meal.protein,
          carbsG: today.carbsG + meal.carbs,
          fatG: today.fatG + meal.fat,
        );
    }
  }

  static TodayRecord _edit(TodayRecord today, CheckInDraft draft) {
    switch (draft.type) {
      case CheckInType.water:
        final ml = int.tryParse(draft.value) ?? today.hydrationMl;
        return today.copyWith(hydrationMl: ml);
      case CheckInType.sleep:
        final hours = double.tryParse(draft.value) ?? today.sleepHours;
        return today.copyWith(
          sleepHours: hours,
          sleepQuality: draft.rawFields['quality'] ?? today.sleepQuality,
          sleepBedtime: draft.time.isNotEmpty
              ? draft.time
              : (draft.rawFields['bedtime'] ?? today.sleepBedtime),
          sleepWakeTime: draft.rawFields['wake'] ?? today.sleepWakeTime,
        );
      case CheckInType.weight:
        final kg = double.tryParse(draft.value) ?? today.weightValueKg;
        return today.copyWith(weightRecorded: true, weightValueKg: kg);
      case CheckInType.exercise:
        final minutes = int.tryParse(draft.value) ?? today.exerciseMinutes;
        final kcal = int.tryParse(draft.rawFields['kcal'] ?? '') ??
            (minutes * 7.1).round();
        return today.copyWith(
          exerciseMinutes: minutes,
          exerciseKcal: kcal,
          exerciseSessions: today.exerciseSessions == 0 ? 1 : today.exerciseSessions,
        );
      case CheckInType.mood:
        return today.copyWith(moodTag: draft.value);
      case CheckInType.product:
        // Edit product: keep taken; optionally rename linked shake meal.
        return today.copyWith(productTaken: ProductTakenStatus.taken);
      case CheckInType.meal:
        final meals = <MealLogEntry>[];
        var deltaKcal = 0;
        var deltaP = 0;
        var deltaC = 0;
        var deltaF = 0;
        for (var i = 0; i < today.meals.length; i++) {
          final m = today.meals[i];
          final id = m.id.isNotEmpty ? m.id : 'meal_idx_$i';
          if (id != draft.targetId) {
            meals.add(m);
            continue;
          }
          final kcal = int.tryParse(draft.rawFields['kcal'] ?? '') ?? m.kcal;
          final updated = m.copyWith(
            id: m.id.isNotEmpty ? m.id : id,
            name: draft.value.isEmpty ? m.name : draft.value,
            time: draft.time.isNotEmpty ? draft.time : m.time,
            kcal: kcal,
            meal: draft.rawFields['meal'] ?? m.meal,
          );
          deltaKcal += updated.kcal - m.kcal;
          deltaP += updated.protein - m.protein;
          deltaC += updated.carbs - m.carbs;
          deltaF += updated.fat - m.fat;
          meals.add(updated);
        }
        return today.copyWith(
          meals: meals,
          intakeKcal: today.intakeKcal + deltaKcal,
          proteinG: today.proteinG + deltaP,
          carbsG: today.carbsG + deltaC,
          fatG: today.fatG + deltaF,
        );
    }
  }
}
