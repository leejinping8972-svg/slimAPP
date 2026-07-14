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
    expect(find.text('Chat with Sunny'), findsOneWidget);
  });

  testWidgets('Register success back clears session and returns to login',
      (tester) async {
    final router = await pumpApp(tester);
    router.go('/register');
    await tester.pumpAndSettle();

    await tester.tap(find.widgetWithText(ElevatedButton, 'Create account'));
    await tester.pumpAndSettle();

    expect(find.text('Welcome to luckdate'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.arrow_back_ios_new).first);
    await tester.pumpAndSettle();

    expect(find.text('Sign In'), findsOneWidget);
  });
}
