import 'package:chatviva_slim/app/router.dart';
import 'package:chatviva_slim/app/theme/luckdate_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

void main() {
  testWidgets('Splash stays on / then reveals guide with register and login',
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
    router.go('/');
    await tester.pump();

    // Still splash — no CTAs yet.
    expect(find.text('Start My Journey'), findsNothing);
    expect(find.text('Log in'), findsNothing);

    await tester.pump(const Duration(seconds: 2));
    await tester.pump(); // reveal guide (avoid settle — infinite motion loops)

    expect(find.text('Start My Journey'), findsOneWidget);
    expect(find.text('Log in'), findsOneWidget);
    expect(find.textContaining('Feel Alive'), findsOneWidget);
    expect(router.state.uri.path, '/');

    await tester.tap(find.text('Log in'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('Sign In'), findsOneWidget);
  });
}
