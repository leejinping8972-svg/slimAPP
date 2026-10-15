import 'package:chatviva_slim/shared/models/models.dart';
import 'package:chatviva_slim/shared/services/today_tasks.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('empty day leaves every ritual pending', () {
    final tasks = todayTasksOf(const TodayRecord());

    expect(tasks, hasLength(4));
    expect(tasks.where((task) => task.done), isEmpty);
  });

  test('recorded values complete only their own ritual', () {
    final tasks = todayTasksOf(
      const TodayRecord(
        weightRecorded: true,
        weightValueKg: 62.4,
        hydrationMl: 499,
        meals: [
          MealLogEntry(
            meal: 'desayuno',
            name: 'Avena',
            time: '08:10',
            kcal: 320,
          ),
        ],
      ),
    );

    expect(tasks[0].done, isTrue);
    expect(tasks[0].valueText, '62.4 kg');
    expect(tasks[1].done, isTrue);
    expect(tasks[1].valueText, '320 kcal');
    expect(tasks[2].done, isFalse);
    expect(tasks[3].done, isFalse);
  });

  test('two glasses of water and a sleep record complete those rituals', () {
    final tasks = todayTasksOf(
      const TodayRecord(hydrationMl: 500, sleepHours: 7),
    );

    expect(tasks[2].done, isTrue);
    expect(tasks[2].valueText, '500 ml');
    expect(tasks[3].done, isTrue);
  });
}
