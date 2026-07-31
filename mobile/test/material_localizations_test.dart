import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';

/// Regression: locale es/zh + supportedLocales without
/// GlobalMaterialLocalizations → TextField "Null check operator used on a null value".
void main() {
  Future<void> pumpAuthField(
    WidgetTester tester, {
    required Locale locale,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: locale,
        supportedLocales: const [
          Locale('es', 'MX'),
          Locale('zh'),
          Locale('en', 'US'),
        ],
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        home: const Scaffold(
          body: TextField(
            decoration: InputDecoration(labelText: 'Número de teléfono'),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('TextField builds under es-MX with GlobalMaterialLocalizations', (
    tester,
  ) async {
    await pumpAuthField(tester, locale: const Locale('es', 'MX'));

    expect(find.byType(TextField), findsOneWidget);
    expect(find.byType(ErrorWidget), findsNothing);
    expect(
      MaterialLocalizations.of(tester.element(find.byType(TextField))),
      isNotNull,
    );
  });

  testWidgets('TextField builds under zh with GlobalMaterialLocalizations', (
    tester,
  ) async {
    await pumpAuthField(tester, locale: const Locale('zh'));

    expect(find.byType(TextField), findsOneWidget);
    expect(find.byType(ErrorWidget), findsNothing);
  });
}
