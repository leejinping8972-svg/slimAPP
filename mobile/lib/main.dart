import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';
import 'app/app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Ritual / suggestion pages use DateFormat; without this, web throws
  // LocaleDataException and paints a blank flutter-view.
  await initializeDateFormatting('es_MX');
  await initializeDateFormatting('es');
  await initializeDateFormatting('zh_CN');
  await initializeDateFormatting('zh');
  Intl.defaultLocale = 'es_MX';

  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    if (kDebugMode) {
      debugPrint(details.toString());
    }
  };
  ErrorWidget.builder = (details) {
    return Material(
      color: const Color(0xFFEDE4D8),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            kReleaseMode
                ? 'Something went wrong. Please reload.\n出了点问题，请刷新页面。'
                : details.exceptionAsString(),
            style: const TextStyle(color: Color(0xFF5E6B45)),
          ),
        ),
      ),
    );
  };

  // Hash routing works reliably on static H5 hosting (no server rewrite needed).
  setUrlStrategy(const HashUrlStrategy());
  runApp(const ProviderScope(child: ChatVivaApp()));
}
