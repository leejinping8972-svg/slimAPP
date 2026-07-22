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
    // Simulate having left the launch guide and Sunny opening.
    widgetRef.read(appStateProvider.notifier).markLaunchGuideSeen();
    widgetRef.read(appStateProvider.notifier).markSunnyOpeningSeen();
    router.go('/login');
    await pumpFrames(tester);
    return router;
  }

  testWidgets('Login Sign in navigates to ritual', (tester) async {
    final router = await pumpApp(tester);

    expect(find.text('Welcome back'), findsOneWidget);

    await tester.tap(find.bySemanticsLabel('Email'));
    await pumpFrames(tester);
    await tester.enterText(find.byType(TextField).first, 'hq@flowhealth.com');
    await tester.enterText(find.byType(TextField).last, 'password123');
    await tester.pump();

    await tester.tap(find.widgetWithText(ElevatedButton, 'Sign in'));
    await pumpFrames(tester, 12);

    expect(find.text('My Vitality Score'), findsOneWidget);
    expect(find.text('Sunny'), findsWidgets);
    expect(find.text('Journey'), findsOneWidget);

    await tester.tap(find.text('Me'));
    await pumpFrames(tester, 12);
    expect(find.text('Vitality Member'), findsOneWidget);
    expect(find.text('Check-in'), findsOneWidget);
  });

  testWidgets('Register goes to link order then Sunny questions', (tester) async {
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
    widgetRef.read(appStateProvider.notifier).markLaunchGuideSeen();
    widgetRef.read(appStateProvider.notifier).markSunnyOpeningSeen();
    router.go('/register');
    await pumpFrames(tester);

    expect(find.text('Create your account'), findsOneWidget);
    expect(find.text('Create account'), findsOneWidget);

    // Email + verification code (no password on register).
    await tester.tap(find.bySemanticsLabel('Email'));
    await pumpFrames(tester);
    final fields = find.byType(TextField);
    expect(fields, findsNWidgets(2));
    await tester.enterText(fields.at(0), 'new@luckdate.com');
    await tester.tap(find.text('Send code'));
    await pumpFrames(tester);
    ScaffoldMessenger.of(tester.element(find.byType(Scaffold).first))
        .clearSnackBars();
    await tester.pump();
    await tester.enterText(fields.at(1), '1234');
    await tester.pump();
    await tester.tap(find.widgetWithText(ElevatedButton, 'Create account'));
    await pumpFrames(tester, 12);

    expect(find.text('Link your order'), findsOneWidget);
    expect(find.text('Query'), findsOneWidget);
    expect(find.text('Get product info'), findsOneWidget);

    ScaffoldMessenger.of(tester.element(find.byType(Scaffold).first))
        .clearSnackBars();
    await tester.pump();
    await tester.scrollUntilVisible(
      find.text('Skip for now'),
      200,
      scrollable: find.byType(Scrollable).last,
    );
    await pumpFrames(tester, 4);
    await tester.ensureVisible(find.text('Skip for now'));
    await tester.tap(find.text('Skip for now'));
    await pumpFrames(tester, 16);

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
    expect(find.text('Join with Sunny'), findsNothing);
  });
}
