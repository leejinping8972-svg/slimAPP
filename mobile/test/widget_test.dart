import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:chatviva_slim/app/app.dart';

void main() {
  testWidgets('App smoke test', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: ChatVivaApp()));
    await tester.pump();
    expect(find.text('ChatViva Slim'), findsOneWidget);
    await tester.pump(const Duration(seconds: 3));
  });
}
