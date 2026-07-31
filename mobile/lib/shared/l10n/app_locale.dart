import 'package:flutter/material.dart';

/// App display languages (demo: Mexican Spanish + Chinese).
enum AppLang {
  esMx,
  zh,
}

extension AppLangX on AppLang {
  String get code => switch (this) {
        AppLang.esMx => 'es-MX',
        AppLang.zh => 'zh',
      };

  String get displayName => switch (this) {
        AppLang.esMx => 'Español (México)',
        AppLang.zh => '中文',
      };

  String get nativeLabel => switch (this) {
        AppLang.esMx => 'Español',
        AppLang.zh => '中文',
      };

  Locale get locale => switch (this) {
        AppLang.esMx => const Locale('es', 'MX'),
        AppLang.zh => const Locale('zh'),
      };

  String get intlLocale => switch (this) {
        AppLang.esMx => 'es_MX',
        AppLang.zh => 'zh_CN',
      };

  static AppLang fromCode(String? code) {
    final c = (code ?? '').trim().toLowerCase();
    if (c.startsWith('zh')) return AppLang.zh;
    return AppLang.esMx;
  }
}
