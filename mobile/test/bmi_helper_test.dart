import 'package:chatviva_slim/shared/services/bmi_helper.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('recommended target stays below current weight', () {
    final target = BmiHelper.recommendedTargetKg(
      ageRange: '35-50',
      heightCm: 165,
      currentWeightKg: 86,
    );
    expect(target, lessThan(86));
    expect(target, greaterThan(40));
  });

  test('recommended target BMI stays in healthy range', () {
    final target = BmiHelper.recommendedTargetKg(
      ageRange: '35-50',
      heightCm: 165,
      currentWeightKg: 86,
    );
    final bmi = BmiHelper.bmi(target, 165);
    expect(bmi, greaterThanOrEqualTo(BmiHelper.healthyMin));
    expect(bmi, lessThanOrEqualTo(BmiHelper.healthyMax));
  });
}
