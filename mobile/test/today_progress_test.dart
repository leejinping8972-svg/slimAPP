import 'package:chatviva_slim/core/widgets/ld_components.dart';
import 'package:chatviva_slim/core/widgets/ld_feedback.dart';
import 'package:chatviva_slim/shared/models/models.dart';
import 'package:chatviva_slim/shared/services/today_tasks.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('today progress shows the same count as completed tasks', (
    tester,
  ) async {
    final tasks = todayTasksOf(
      const TodayRecord(weightRecorded: true, weightValueKg: 60),
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(body: LdTodayProgress(tasks: tasks)),
      ),
    );

    expect(find.text('1 / 4'), findsOneWidget);
    expect(find.text('Registro de peso'), findsOneWidget);
    expect(find.text('Bebe 2 vasos'), findsOneWidget);
  });

  testWidgets('check-in button submits once and then shows Registrado', (
    tester,
  ) async {
    var calls = 0;
    ChatCardStatus status = ChatCardStatus.pending;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (context, setState) {
              return CheckInCardBubble(
                data: const CheckInCardData(
                  kind: ChatCardKind.confirmCheckIn,
                  type: CheckInType.exercise,
                  name: 'Yoga',
                  time: '18:00',
                  value: 30,
                ),
                status: status,
                onConfirm: (_) {
                  calls += 1;
                  setState(() => status = ChatCardStatus.confirmed);
                },
              );
            },
          ),
        ),
      ),
    );

    await tester.tap(find.text('Registrar'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 700));

    expect(calls, 1);
    expect(find.text('Registrar'), findsNothing);
    expect(find.text('Registrado'), findsOneWidget);
  });
}