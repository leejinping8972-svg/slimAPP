import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'app/app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Keep a cream scaffold visible if a frame throws (avoid hard blank).
  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    if (kDebugMode) {
      debugPrint(details.toString());
    }
  };
  // Hash routing works reliably on static H5 hosting (no server rewrite needed).
  setUrlStrategy(const HashUrlStrategy());
  runApp(const ProviderScope(child: ChatVivaApp()));
}
