import 'package:flutter_test/flutter_test.dart';
import 'package:chatviva_slim/shared/models/models.dart';
import 'package:chatviva_slim/shared/services/check_in_estimator.dart';
import 'package:chatviva_slim/shared/services/vitality_scorer.dart';

void main() {
  test('Score breakdown tracks chat and quick check-in logs', () {
    var today = const TodayRecord();

    today = CheckInEstimator.applyProductShake(today);
    today = CheckInEstimator.applyExerciseFromText(today, 'i did 45 minutes of yoga');
    today = CheckInEstimator.applySleepFromText(today, 'i slept 7 hours last night');
    today = today.copyWith(hydrationMl: 1500, moodTag: 'okay', weightRecorded: true);

    final scores = VitalityScorer.calculate(
      record: today,
      hydrationTargetMl: 2000,
      planType: UserPlanType.mealReplacement,
      calorieTargetKcal: 1600,
      exerciseTargetKcal: 500,
    );

    expect(scores.nutritionScore, greaterThan(0));
    expect(scores.exerciseScore, greaterThan(0));
    expect(scores.sleepScore, greaterThanOrEqualTo(80));
    expect(scores.hydrationScore, 75);
    expect(scores.moodCheckScore, greaterThan(0));
    expect(scores.consistencyScore, greaterThan(0));
    expect(scores.dailyVitality, greaterThan(0));

    final dims = VitalityScorer.breakdown(scores);
    expect(dims.map((d) => d.key).toList(), [
      'nutrition',
      'exercise',
      'body_mind',
      'sleep',
      'hydration',
      'habits',
    ]);
    expect(dims.firstWhere((d) => d.key == 'nutrition').score, scores.nutritionScore);
    expect(dims.firstWhere((d) => d.key == 'exercise').score, scores.exerciseScore);
  });

  test('Empty day stays at zero until something is logged', () {
    final scores = VitalityScorer.calculate(
      record: const TodayRecord(),
      hydrationTargetMl: 2000,
      planType: UserPlanType.mealReplacement,
    );
    expect(scores.nutritionScore, 0);
    expect(scores.exerciseScore, 0);
    expect(scores.dailyVitality, 0);
  });
}
