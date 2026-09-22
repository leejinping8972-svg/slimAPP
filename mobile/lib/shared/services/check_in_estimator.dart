import '../models/models.dart';

/// Estimates nutrition / activity deltas from chat or quick check-in text.
class CheckInEstimator {
  static String _nowTime() {
    final n = DateTime.now();
    return '${n.hour.toString().padLeft(2, '0')}:${n.minute.toString().padLeft(2, '0')}';
  }

  static TodayRecord applyProductShake(TodayRecord today) {
    if (today.productTaken == ProductTakenStatus.taken &&
        today.meals.any((m) => m.name.contains('Solar Protein'))) {
      return today.copyWith(productTaken: ProductTakenStatus.taken);
    }
    final meal = MealLogEntry(
      meal: 'Meal Replacement',
      name: 'Solar Protein Shake',
      time: _nowTime(),
      quantityG: 280,
      kcal: 280,
      protein: 28,
      carbs: 12,
      fat: 8,
      source: 'chat',
    );
    return today.copyWith(
      productTaken: ProductTakenStatus.taken,
      meals: [...today.meals, meal],
      intakeKcal: today.intakeKcal + meal.kcal,
      proteinG: today.proteinG + meal.protein,
      carbsG: today.carbsG + meal.carbs,
      fatG: today.fatG + meal.fat,
      fiberG: today.fiberG + 4,
    );
  }

  static TodayRecord applyStructuredCheckIn(
    TodayRecord today, {
    required CheckInType type,
    required String name,
    required String time,
    required int value,
  }) {
    if (type == CheckInType.meal) {
      final meal = _structuredMeal(name: name, time: time, grams: value);
      return today.copyWith(
        meals: [...today.meals, meal],
        intakeKcal: today.intakeKcal + meal.kcal,
        proteinG: today.proteinG + meal.protein,
        carbsG: today.carbsG + meal.carbs,
        fatG: today.fatG + meal.fat,
        fiberG: today.fiberG + _fiberFor(meal),
      );
    }

    final minutes = value.clamp(1, 600).toInt();
    final exercise = ExerciseLogEntry(
      name: name,
      time: time,
      minutes: minutes,
      kcal: (minutes * 7.1).round(),
      source: 'chat',
    );
    return today.copyWith(
      exerciseLogs: [...today.exerciseLogs, exercise],
      exerciseMinutes: today.exerciseMinutes + minutes,
      exerciseKcal: today.exerciseKcal + exercise.kcal,
      exerciseSessions: today.exerciseSessions + 1,
    );
  }

  static TodayRecord applyMealFromText(TodayRecord today, String lower) {
    final meal = _guessMeal(lower, quantityG: _extractGrams(lower) ?? 200);
    return today.copyWith(
      meals: [...today.meals, meal],
      intakeKcal: today.intakeKcal + meal.kcal,
      proteinG: today.proteinG + meal.protein,
      carbsG: today.carbsG + meal.carbs,
      fatG: today.fatG + meal.fat,
      fiberG: today.fiberG + _fiberFor(meal),
    );
  }

  static TodayRecord applyExerciseFromText(TodayRecord today, String lower) {
    final minutes = _extractMinutes(lower) ?? 30;
    final kcal = (minutes * 7.1).round(); // ~moderate activity
    final exercise = ExerciseLogEntry(
      name: _exerciseNameFrom(lower),
      time: _nowTime(),
      minutes: minutes,
      kcal: kcal,
      source: 'chat',
    );
    return today.copyWith(
      exerciseLogs: [...today.exerciseLogs, exercise],
      exerciseMinutes: today.exerciseMinutes + minutes,
      exerciseKcal: today.exerciseKcal + kcal,
      exerciseSessions: today.exerciseSessions + 1,
    );
  }

  static TodayRecord applySleepFromText(TodayRecord today, String lower) {
    final hours = _extractHours(lower) ?? 7.0;
    final quality = lower.contains('poor') || lower.contains('bad')
        ? 'poor'
        : lower.contains('great') || lower.contains('good')
        ? 'good'
        : 'okay';
    return today.copyWith(sleepHours: hours, sleepQuality: quality);
  }

  static List<CheckInRecord> recordsFor(TodayRecord today, CheckInType type) {
    if (type == CheckInType.meal) {
      return [
        for (var i = 0; i < today.meals.length; i++)
          CheckInRecord(
            id: 'meal_$i',
            type: CheckInType.meal,
            name: today.meals[i].name,
            time: today.meals[i].time,
            value: today.meals[i].quantityG,
            estimatedKcal: today.meals[i].kcal,
          ),
      ];
    }
    return [
      for (var i = 0; i < today.exerciseLogs.length; i++)
        CheckInRecord(
          id: 'exercise_$i',
          type: CheckInType.exercise,
          name: today.exerciseLogs[i].name,
          time: today.exerciseLogs[i].time,
          value: today.exerciseLogs[i].minutes,
          estimatedKcal: today.exerciseLogs[i].kcal,
        ),
    ];
  }

  static TodayRecord replaceCheckIn(
    TodayRecord today, {
    required CheckInRecord record,
    required int newValue,
  }) {
    final value = newValue
        .clamp(1, record.type == CheckInType.meal ? 3000 : 600)
        .toInt();
    if (record.type == CheckInType.meal) {
      final index = int.tryParse(record.id.replaceFirst('meal_', ''));
      if (index == null || index < 0 || index >= today.meals.length) {
        return today;
      }
      final existing = today.meals[index];
      final updated = existing.copyWith(
        quantityG: value,
        kcal: _scaled(existing.kcal, existing.quantityG, value),
        protein: _scaled(existing.protein, existing.quantityG, value),
        carbs: _scaled(existing.carbs, existing.quantityG, value),
        fat: _scaled(existing.fat, existing.quantityG, value),
      );
      final meals = [...today.meals]..[index] = updated;
      return today.copyWith(
        meals: meals,
        intakeKcal: today.intakeKcal - existing.kcal + updated.kcal,
        proteinG: today.proteinG - existing.protein + updated.protein,
        carbsG: today.carbsG - existing.carbs + updated.carbs,
        fatG: today.fatG - existing.fat + updated.fat,
      );
    }

    final index = int.tryParse(record.id.replaceFirst('exercise_', ''));
    if (index == null || index < 0 || index >= today.exerciseLogs.length) {
      return today;
    }
    final existing = today.exerciseLogs[index];
    final updated = existing.copyWith(
      minutes: value,
      kcal: (value * 7.1).round(),
    );
    final exerciseLogs = [...today.exerciseLogs]..[index] = updated;
    return today.copyWith(
      exerciseLogs: exerciseLogs,
      exerciseMinutes:
          today.exerciseMinutes - existing.minutes + updated.minutes,
      exerciseKcal: today.exerciseKcal - existing.kcal + updated.kcal,
    );
  }

  static MealLogEntry _structuredMeal({
    required String name,
    required String time,
    required int grams,
  }) {
    final meal = _mealSlotForTime(time);
    final kcal = (grams * 1.8).round();
    return MealLogEntry(
      meal: meal,
      name: name,
      time: time,
      quantityG: grams,
      kcal: kcal,
      protein: (grams * 0.12).round(),
      carbs: (grams * 0.15).round(),
      fat: (grams * 0.06).round(),
    );
  }

  static MealLogEntry _guessMeal(String lower, {required int quantityG}) {
    final time = _nowTime();
    if (lower.contains('breakfast') ||
        lower.contains('yogurt') ||
        lower.contains('oatmeal')) {
      return MealLogEntry(
        meal: 'Breakfast',
        name: _titleFrom(lower, fallback: 'Breakfast bowl'),
        time: time,
        quantityG: quantityG,
        kcal: 320,
        protein: 18,
        carbs: 35,
        fat: 12,
      );
    }
    if (lower.contains('lunch') ||
        lower.contains('salad') ||
        lower.contains('chicken')) {
      return MealLogEntry(
        meal: 'Lunch',
        name: _titleFrom(lower, fallback: 'Balanced lunch plate'),
        time: time,
        quantityG: quantityG,
        kcal: 520,
        protein: 42,
        carbs: 38,
        fat: 16,
      );
    }
    if (lower.contains('dinner') ||
        lower.contains('salmon') ||
        lower.contains('rice')) {
      return MealLogEntry(
        meal: 'Dinner',
        name: _titleFrom(lower, fallback: 'Evening dinner'),
        time: time,
        quantityG: quantityG,
        kcal: 440,
        protein: 36,
        carbs: 22,
        fat: 24,
      );
    }
    if (lower.contains('snack') ||
        lower.contains('fruit') ||
        lower.contains('nuts')) {
      return MealLogEntry(
        meal: 'Snack',
        name: _titleFrom(lower, fallback: 'Light snack'),
        time: time,
        quantityG: quantityG,
        kcal: 150,
        protein: 5,
        carbs: 18,
        fat: 6,
      );
    }
    return MealLogEntry(
      meal: 'Meal',
      name: _titleFrom(lower, fallback: 'Comida registrada'),
      time: time,
      quantityG: quantityG,
      kcal: 360,
      protein: 22,
      carbs: 30,
      fat: 14,
    );
  }

  static String _titleFrom(String lower, {required String fallback}) {
    if (lower.length < 8) return fallback;
    final clipped = lower.length > 42 ? '${lower.substring(0, 42)}…' : lower;
    return clipped[0].toUpperCase() + clipped.substring(1);
  }

  static int _fiberFor(MealLogEntry meal) {
    if (meal.meal == 'Breakfast') return 6;
    if (meal.meal == 'Lunch') return 8;
    if (meal.meal == 'Dinner') return 5;
    return 3;
  }

  static String _mealSlotForTime(String time) {
    final hour = int.tryParse(time.split(':').first) ?? 12;
    if (hour < 11) return '早餐';
    if (hour < 16) return '午餐';
    return '晚餐';
  }

  static String _exerciseNameFrom(String lower) {
    if (lower.contains('yoga')) return 'Yoga';
    if (lower.contains('跑') || lower.contains('run')) return '跑步';
    if (lower.contains('骑') || lower.contains('cycling')) return '骑行';
    if (lower.contains('walk') || lower.contains('camin')) return '散步';
    return '运动';
  }

  static int _scaled(int value, int oldQuantity, int newQuantity) {
    if (oldQuantity <= 0) return value;
    return (value * newQuantity / oldQuantity).round();
  }

  static int? _extractGrams(String lower) {
    final m = RegExp(r'(\d{1,4})\s*(g|克|grams?)').firstMatch(lower);
    return m == null ? null : int.tryParse(m.group(1)!);
  }

  static int? _extractMinutes(String lower) {
    final m = RegExp(r'(\d{1,3})\s*(min|mins|minutes)').firstMatch(lower);
    if (m != null) return int.tryParse(m.group(1)!);
    if (lower.contains('hour')) return 60;
    return null;
  }

  static double? _extractHours(String lower) {
    final m = RegExp(r'(\d(?:\.\d)?)\s*(h|hr|hrs|hours)').firstMatch(lower);
    if (m != null) return double.tryParse(m.group(1)!);
    final sleep = RegExp(r'slept\s+(\d(?:\.\d)?)').firstMatch(lower);
    if (sleep != null) return double.tryParse(sleep.group(1)!);
    return null;
  }
}
