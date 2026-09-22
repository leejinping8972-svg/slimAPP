import 'package:chatviva_slim/shared/models/models.dart';
import 'package:chatviva_slim/shared/services/sunny_intent_router.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final router = SunnyIntentRouter();

  TodayRecord recordWith({
    List<MealLogEntry> meals = const [],
    List<ExerciseLogEntry> exerciseLogs = const [],
  }) {
    return TodayRecord(
      meals: meals,
      exerciseLogs: exerciseLogs,
      intakeKcal: meals.fold(0, (sum, meal) => sum + meal.kcal),
      exerciseMinutes: exerciseLogs.fold(
        0,
        (sum, exercise) => sum + exercise.minutes,
      ),
      exerciseKcal: exerciseLogs.fold(
        0,
        (sum, exercise) => sum + exercise.kcal,
      ),
      exerciseSessions: exerciseLogs.length,
    );
  }

  test('meal check-in returns a pending confirmation card', () {
    final result = router.route(
      input: '我吃了鸡胸肉 150 克 12:30',
      today: const TodayRecord(),
      journeyDay: 1,
      hydrationTargetMl: 2000,
      nickname: '我',
    );

    expect(result.cardData?.kind, ChatCardKind.confirmCheckIn);
    expect(result.cardData?.type, CheckInType.meal);
    expect(result.cardData?.name, '鸡胸肉');
    expect(result.cardData?.time, '12:30');
    expect(result.cardData?.value, 150);
    expect(result.todayUpdates, isNull);
  });

  test('exercise check-in returns a duration card', () {
    final result = router.route(
      input: '我做了快走 30 分钟 18:00',
      today: const TodayRecord(),
      journeyDay: 1,
      hydrationTargetMl: 2000,
      nickname: '我',
    );

    expect(result.cardData?.kind, ChatCardKind.confirmCheckIn);
    expect(result.cardData?.type, CheckInType.exercise);
    expect(result.cardData?.value, 30);
    expect(result.cardData?.time, '18:00');
  });

  test('modification asks for time before searching records', () {
    final result = router.route(
      input: '把运动改成 40 分钟',
      today: recordWith(
        exerciseLogs: const [
          ExerciseLogEntry(name: '快走', time: '18:00', minutes: 30, kcal: 213),
        ],
      ),
      journeyDay: 1,
      hydrationTargetMl: 2000,
      nickname: '我',
    );

    expect(result.intents, contains('clarify_modify_check_in'));
    expect(result.cardData, isNull);
  });

  test('multiple records create a modification selection card', () {
    final result = router.route(
      input: '修改早餐为 250 克',
      today: recordWith(
        meals: const [
          MealLogEntry(
            meal: '早餐',
            name: '酸奶',
            time: '08:00',
            quantityG: 180,
            kcal: 240,
          ),
          MealLogEntry(
            meal: '早餐',
            name: '燕麦',
            time: '09:00',
            quantityG: 200,
            kcal: 300,
          ),
        ],
      ),
      journeyDay: 1,
      hydrationTargetMl: 2000,
      nickname: '我',
    );

    expect(result.cardData?.kind, ChatCardKind.modifyCheckIn);
    expect(result.cardData?.candidates, hasLength(2));
    expect(result.cardData?.value, 250);
  });

  test('one exact record is modified directly with high confidence', () {
    final result = router.route(
      input: '修改 18:00 的运动为 40 分钟',
      today: recordWith(
        exerciseLogs: const [
          ExerciseLogEntry(name: '快走', time: '18:00', minutes: 30, kcal: 213),
        ],
      ),
      journeyDay: 1,
      hydrationTargetMl: 2000,
      nickname: '我',
    );

    expect(result.intents, contains('modify_check_in'));
    expect(result.todayUpdates?.exerciseMinutes, 40);
    expect(result.cardData, isNull);
  });

  test('meal slot modification is high confidence without a meal name', () {
    final result = router.route(
      input: '修改晚餐为 200 克',
      today: recordWith(
        meals: const [
          MealLogEntry(
            meal: '晚餐',
            name: '三文鱼',
            time: '18:30',
            quantityG: 260,
            kcal: 440,
          ),
        ],
      ),
      journeyDay: 1,
      hydrationTargetMl: 2000,
      nickname: '我',
    );

    expect(result.intents, contains('modify_check_in'));
    expect(result.todayUpdates?.meals.single.quantityG, 200);
    expect(result.cardData, isNull);
  });

  test(
    'unknown records ask the user to clarify instead of creating a card',
    () {
      final result = router.route(
        input: '修改晚餐为 200 克',
        today: const TodayRecord(),
        journeyDay: 1,
        hydrationTargetMl: 2000,
        nickname: '我',
      );

      expect(result.intents, contains('clarify_modify_check_in'));
      expect(result.cardData, isNull);
    },
  );
}
