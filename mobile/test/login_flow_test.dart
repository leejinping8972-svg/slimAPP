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

  testWidgets('Login Iniciar sesión navigates to ritual', (tester) async {
    final router = await pumpApp(tester);

    expect(find.text('Qué bueno verte de nuevo'), findsOneWidget);

    await tester.tap(find.bySemanticsLabel('Correo electrónico'));
    await pumpFrames(tester);
    await tester.enterText(find.byType(TextField).first, 'hq@flowhealth.com');
    await tester.enterText(find.byType(TextField).last, 'password123');
    await tester.pump();

    await tester.tap(find.widgetWithText(ElevatedButton, 'Iniciar sesión'));
    await pumpFrames(tester, 12);

    expect(find.text('Mi puntuación de vitalidad'), findsOneWidget);
    expect(find.text('Sunny'), findsWidgets);
    expect(find.text('Recorrido'), findsOneWidget);

    await tester.tap(find.text('Yo'));
    await pumpFrames(tester, 12);
    expect(find.text('Miembro Vitalidad'), findsOneWidget);
    expect(find.text('Registro'), findsOneWidget);
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

    expect(find.text('Crea tu cuenta'), findsOneWidget);
    expect(find.text('Crear cuenta'), findsOneWidget);

    // Phone or email only — no password / verification code.
    await tester.tap(find.bySemanticsLabel('Correo electrónico'));
    await pumpFrames(tester);
    final fields = find.byType(TextField);
    expect(fields, findsOneWidget);
    await tester.enterText(fields.at(0), 'new@luckdate.com');
    await tester.pump();
    await tester.tap(find.widgetWithText(ElevatedButton, 'Crear cuenta'));
    await pumpFrames(tester, 12);

    expect(find.text('Vincula tu pedido'), findsOneWidget);
    expect(find.text('Buscar'), findsOneWidget);
    expect(find.text('Ver información del producto'), findsOneWidget);

    await tester.scrollUntilVisible(
      find.text('Omitir por ahora'),
      200,
      scrollable: find.byType(Scrollable).last,
    );
    await pumpFrames(tester, 4);
    await tester.ensureVisible(find.text('Omitir por ahora'));
    await tester.tap(find.text('Omitir por ahora'));
    await pumpFrames(tester, 16);

    expect(find.textContaining('compañera diaria de vitalidad'), findsOneWidget);
    expect(find.textContaining('Ritual diario'), findsOneWidget);
    expect(find.textContaining('Política de privacidad'), findsOneWidget);
    expect(find.textContaining('Acepto'), findsWidgets);
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
