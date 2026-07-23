import 'package:chatviva_slim/app/router.dart';
import 'package:chatviva_slim/app/theme/luckdate_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

void main() {
  testWidgets('Splash stays on / then reveals guide with Start My Journey',
      (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

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

    expect(find.text('Start My Journey'), findsNothing);

    await tester.pump(const Duration(seconds: 2));
    await tester.pump();

    expect(find.text('Start My Journey'), findsOneWidget);
    expect(find.text('Log in'), findsOneWidget);
    expect(find.textContaining('Feel Alive'), findsOneWidget);
    expect(find.textContaining('One Small Ritual'), findsOneWidget);
    expect(router.state.uri.path, '/');

    await tester.tap(find.text('Start My Journey'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('Create your account'), findsOneWidget);
    expect(find.text('Meet Sunny'), findsNothing);
    expect(router.state.uri.path, '/register');
  });
}
