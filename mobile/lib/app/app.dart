import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router.dart';
import 'theme/luckdate_theme.dart';
import '../shared/l10n/app_locale.dart';
import '../shared/providers/app_providers.dart';

class ChatVivaApp extends ConsumerWidget {
  const ChatVivaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final lang = AppLangX.fromCode(
      ref.watch(appStateProvider.select((s) => s.profile.language)),
    );
    return MaterialApp.router(
      title: 'luckdate',
      debugShowCheckedModeBanner: false,
      locale: lang.locale,
      supportedLocales: const [
        Locale('es', 'MX'),
        Locale('es'),
        Locale('zh', 'CN'),
        Locale('zh'),
        Locale('en', 'US'),
      ],
      // Without these, locale es/zh + supportedLocales makes
      // MaterialLocalizations.of(context)! null → TextField crash.
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: buildLuckdateTheme(),
      routerConfig: router,
    );
  }
}
