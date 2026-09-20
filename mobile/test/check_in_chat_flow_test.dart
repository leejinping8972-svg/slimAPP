import 'package:chatviva_slim/shared/models/check_in_chat.dart';
import 'package:chatviva_slim/shared/models/models.dart';
import 'package:chatviva_slim/shared/services/check_in_apply.dart';
import 'package:chatviva_slim/shared/services/check_in_chat_flow.dart';
import 'package:chatviva_slim/shared/services/check_in_intent_parser.dart';
import 'package:chatviva_slim/shared/services/list_today_check_ins.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('parse create water with cup default', () {
    final r = CheckInIntentParser.parse('Tomé un vaso de agua');
    expect(r.isModify, isFalse);
    expect(r.type, CheckInType.water);
    expect(r.slotsComplete, isTrue);
    expect(r.draft!.value, '250');
  });

  test('parse modify sleep missing value', () {
    final r = CheckInIntentParser.parse('修改睡眠');
    expect(r.isModify, isTrue);
    expect(r.type, CheckInType.sleep);
    expect(r.missing, contains('value'));
  });

  test('apply create water does not write until apply', () {
    const today = TodayRecord(hydrationMl: 100);
    final draft = CheckInDraft(
      type: CheckInType.water,
      value: '250',
      unit: 'ml',
      mode: CheckInDraftMode.create,
    );
    final next = CheckInApply.apply(today, draft);
    expect(next.hydrationMl, 350);
  });

  test('create flow returns confirm card without todayUpdates', () {
    final flow = CheckInChatFlow();
    final result = flow.handle(
      input: 'Tomé un vaso de agua',
      today: const TodayRecord(),
      language: 'es-MX',
    );
    expect(result, isNotNull);
    expect(result!.todayUpdates, isNull);
    expect(result.card?.kind, CheckInCardKind.checkInConfirm);
    expect(result.card?.draft?.type, CheckInType.water);
  });

  test('modify water with no records asks to create', () {
    final flow = CheckInChatFlow();
    final result = flow.handle(
      input: '修改喝水为 400 ml',
      today: const TodayRecord(),
      language: 'zh',
    );
    expect(result!.intents, contains('check_in_modify_empty'));
    expect(result.todayUpdates, isNull);
  });

  test('modify single high-confidence water applies directly', () {
    final flow = CheckInChatFlow();
    final result = flow.handle(
      input: 'cambiar agua a 500 ml',
      today: const TodayRecord(hydrationMl: 250),
      language: 'es-MX',
    );
    expect(result!.intents, contains('check_in_modify_applied'));
    expect(result.todayUpdates?.hydrationMl, 500);
  });

  test('modify multiple meals returns pick card', () {
    final flow = CheckInChatFlow();
    final today = TodayRecord(
      meals: [
        MealLogEntry(
          id: 'm1',
          meal: 'Lunch',
          name: 'Ensalada',
          time: '13:00',
          kcal: 320,
        ),
        MealLogEntry(
          id: 'm2',
          meal: 'Dinner',
          name: 'Salmón',
          time: '20:00',
          kcal: 440,
        ),
      ],
    );
    final result = flow.handle(
      input: 'modificar comida ensalada',
      today: today,
      language: 'es-MX',
    );
    expect(result!.card?.kind, CheckInCardKind.checkInPick);
    expect(result.card!.candidates.length, 2);
  });

  test('list today meals by type', () {
    final today = TodayRecord(
      meals: [
        const MealLogEntry(
          id: 'm1',
          meal: 'Lunch',
          name: 'Salad',
          time: '12:00',
          kcal: 300,
        ),
      ],
    );
    final list = ListTodayCheckIns.byType(today, CheckInType.meal);
    expect(list.length, 1);
    expect(list.first.targetId, 'm1');
  });
}
