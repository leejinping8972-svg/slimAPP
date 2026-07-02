import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'app/app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Hash routing works reliably on static H5 hosting (no server rewrite needed).
  setUrlStrategy(const HashUrlStrategy());
  runApp(const ProviderScope(child: ChatVivaApp()));
}
