import 'package:flutter_test/flutter_test.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';

void main() {
  test('date formatting works after initializeDateFormatting es_MX', () async {
    await initializeDateFormatting('es_MX');
    Intl.defaultLocale = 'es_MX';

    expect(DateFormat('M/d').format(DateTime(2026, 7, 31)), isNotEmpty);
    expect(
      DateFormat("EEEE, d 'de' MMMM 'de' y", 'es_MX').format(DateTime(2026, 7, 31)),
      contains('2026'),
    );
  });
}
