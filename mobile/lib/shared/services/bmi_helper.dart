/// BMI helpers for onboarding target-weight suggestions.
class BmiHelper {
  static const healthyMin = 18.5;
  static const healthyMax = 24.9;

  static double bmi(double weightKg, double heightCm) {
    final h = heightCm / 100;
    if (h <= 0) return 0;
    return weightKg / (h * h);
  }

  static double weightForBmi(double bmi, double heightCm) {
    final h = heightCm / 100;
    return bmi * h * h;
  }

  /// Midpoint of healthy BMI range, adjusted slightly by age band.
  static double targetBmiForAge(String ageRange) {
    return switch (ageRange) {
      'Under 18' => 21.0,
      '18-34' => 22.0,
      '35-50' => 22.5,
      '51-64' => 23.0,
      '65+' => 23.5,
      _ => 22.5,
    };
  }

  /// Suggested target weight within healthy BMI, capped below current weight.
  static double recommendedTargetKg({
    required String ageRange,
    required double heightCm,
    required double currentWeightKg,
  }) {
    final minHealthy = weightForBmi(healthyMin, heightCm);
    final ideal = weightForBmi(targetBmiForAge(ageRange), heightCm);

    var target = ideal;
    if (currentWeightKg <= minHealthy) {
      target = currentWeightKg;
    } else if (ideal >= currentWeightKg) {
      // Already at or below ideal — suggest a modest 3–5% reduction.
      target = currentWeightKg * 0.95;
    }

    target = target.clamp(minHealthy, currentWeightKg);
    if (target >= currentWeightKg && currentWeightKg > minHealthy) {
      target = (currentWeightKg - 0.5).clamp(minHealthy, currentWeightKg);
    }
    return double.parse(target.toStringAsFixed(1));
  }
}
