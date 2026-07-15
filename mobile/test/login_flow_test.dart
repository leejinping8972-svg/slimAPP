import 'package:chatviva_slim/app/router.dart';
import 'package:chatviva_slim/app/theme/luckdate_theme.dart';
import 'package:chatviva_slim/shared/providers/app_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

void main() {
  Future<void> pumpFrames(WidgetTester tester, [int count = 6]) async {
    for (var i = 0; i < count; i++) {
      await tester.pump(const Duration(milliseconds: 50));
    }
  }

  Future<GoRouter> pumpApp(WidgetTester tester) async {
    late GoRouter router;
    late WidgetRef widgetRef;
    await tester.pumpWidget(
      ProviderScope(
        child: Consumer(
          builder: (context, ref, _) {
            widgetRef = ref;
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
    // Simulate having left the launch guide.
    widgetRef.read(appStateProvider.notifier).markLaunchGuideSeen();
    router.go('/login');
    await pumpFrames(tester);
    return router;
  }

  testWidgets('Login Sign in navigates to ritual', (tester) async {
    final router = await pumpApp(tester);

    expect(find.text('Sign In'), findsOneWidget);

    await tester.enterText(find.byType(TextField).first, 'hq@flowhealth.com');
    await tester.enterText(find.byType(TextField).last, 'password123');
    await tester.pump();

    await tester.tap(find.widgetWithText(ElevatedButton, 'Sign in'));
    await pumpFrames(tester, 12);

    expect(find.text('My Vitality Score'), findsOneWidget);
    expect(find.text('Sunny'), findsWidgets);
    expect(find.text('Ritual'), findsOneWidget);

    await tester.tap(find.text('Me'));
    await pumpFrames(tester, 12);
    expect(find.text('Vitality Member'), findsOneWidget);
    expect(find.text('Check-in Record'), findsOneWidget);
  });

  testWidgets('Register opens Sunny onboarding chat', (tester) async {
    final router = await pumpApp(tester);
    router.go('/register');
    await pumpFrames(tester);

    await tester.tap(find.widgetWithText(ElevatedButton, 'Create account'));
    await pumpFrames(tester, 12);

    expect(find.textContaining('privacy policy'), findsOneWidget);
    expect(find.textContaining('I agree'), findsWidgets);
  });

  testWidgets('Guest deep-link to register is forced back to launch',
      (tester) async {
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
    router.go('/register');
    await tester.pump();
    expect(router.state.uri.path, '/');
    expect(find.text('Create Account'), findsNothing);
  });
}
