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
    await tester.pumpAndSettle();
    return router;
  }

  testWidgets('Login Sign in navigates to onboarding', (tester) async {
    final router = await pumpApp(tester);
    router.go('/login');
    await tester.pumpAndSettle();

    expect(find.text('Sign In'), findsOneWidget);

    await tester.enterText(find.byType(TextField).first, 'hq@flowhealth.com');
    await tester.enterText(find.byType(TextField).last, 'password123');
    await tester.pump();

    await tester.tap(find.widgetWithText(ElevatedButton, 'Sign in'));
    await tester.pumpAndSettle();

    expect(find.text('Hi, I am Sunny'), findsOneWidget);
  });

  testWidgets('Onboarding back returns to login from first step', (tester) async {
    final router = await pumpApp(tester);
    router.go('/onboarding');
    await tester.pumpAndSettle();

    expect(find.text('Hi, I am Sunny'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.arrow_back_ios_new).first);
    await tester.pumpAndSettle();

    expect(find.text('Sign In'), findsOneWidget);
  });
}
