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

  static TodayRecord applyMealFromText(TodayRecord today, String lower) {
    final meal = _guessMeal(lower);
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
    return today.copyWith(
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

  static MealLogEntry _guessMeal(String lower) {
    final time = _nowTime();
    if (lower.contains('breakfast') || lower.contains('yogurt') || lower.contains('oatmeal')) {
      return MealLogEntry(
        meal: 'Breakfast',
        name: _titleFrom(lower, fallback: 'Breakfast bowl'),
        time: time,
        kcal: 320,
        protein: 18,
        carbs: 35,
        fat: 12,
      );
    }
    if (lower.contains('lunch') || lower.contains('salad') || lower.contains('chicken')) {
      return MealLogEntry(
        meal: 'Lunch',
        name: _titleFrom(lower, fallback: 'Balanced lunch plate'),
        time: time,
        kcal: 520,
        protein: 42,
        carbs: 38,
        fat: 16,
      );
    }
    if (lower.contains('dinner') || lower.contains('salmon') || lower.contains('rice')) {
      return MealLogEntry(
        meal: 'Dinner',
        name: _titleFrom(lower, fallback: 'Evening dinner'),
        time: time,
        kcal: 440,
        protein: 36,
        carbs: 22,
        fat: 24,
      );
    }
    if (lower.contains('snack') || lower.contains('fruit') || lower.contains('nuts')) {
      return MealLogEntry(
        meal: 'Snack',
        name: _titleFrom(lower, fallback: 'Light snack'),
        time: time,
        kcal: 150,
        protein: 5,
        carbs: 18,
        fat: 6,
      );
    }
    return MealLogEntry(
      meal: 'Meal',
      name: _titleFrom(lower, fallback: 'Logged meal'),
      time: time,
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
