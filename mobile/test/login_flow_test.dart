import 'package:chatviva_slim/app/router.dart';
import 'package:chatviva_slim/app/theme/luckdate_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

void main() {
  Future<GoRouter> pumpApp(WidgetTester tester) async {
    late GoRouter router;
    await tester.pumpWidget(
      ProviderScope(
        child: Consumer(
          builder: (context, ref, _) {
            router = ref.watch(routerProvider);
            return MaterialApp.router(
              theme: buildLuckdateTheme(),
              routerConfig: router,
            );
          },
        ),
      ),
    );
    await tester.pump();
    router.go('/login');
    await tester.pumpAndSettle();
    return router;
  }

  testWidgets('Login Sign in navigates to ritual', (tester) async {
    final router = await pumpApp(tester);

    expect(find.text('Sign In'), findsOneWidget);

    await tester.enterText(find.byType(TextField).first, 'hq@flowhealth.com');
    await tester.enterText(find.byType(TextField).last, 'password123');
    await tester.pump();

    await tester.tap(find.widgetWithText(ElevatedButton, 'Sign in'));
    await tester.pumpAndSettle();

    expect(find.text('My Vitality Score'), findsOneWidget);
    expect(find.text('Sunny'), findsWidgets);
    expect(find.text('Ritual'), findsOneWidget);

    await tester.tap(find.text('Me'));
    await tester.pumpAndSettle();
    expect(find.text('Vitality Member'), findsOneWidget);
    expect(find.text('Check-in Record'), findsOneWidget);
  });

  testWidgets('Register opens Sunny onboarding chat', (tester) async {
    final router = await pumpApp(tester);
    router.go('/register');
    await tester.pumpAndSettle();

    await tester.tap(find.widgetWithText(ElevatedButton, 'Create account'));
    await tester.pumpAndSettle();

    expect(find.textContaining('privacy policy'), findsOneWidget);
    expect(find.textContaining('I agree'), findsWidgets);
  });
}
