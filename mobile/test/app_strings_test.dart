import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:chatviva_slim/shared/l10n/app_locale.dart';
import 'package:chatviva_slim/shared/l10n/app_strings.dart';
import 'package:chatviva_slim/shared/providers/app_providers.dart';
import 'package:chatviva_slim/shared/services/onboarding_chat_guide.dart';

void main() {
  test('AppStrings switches es-MX and zh for key UI copy', () {
    final es = AppStrings(AppLang.esMx);
    final zh = AppStrings(AppLang.zh);

    expect(es.tabJourney, 'Recorrido');
    expect(zh.tabJourney, '旅程');
    expect(es.language, 'Idioma');
    expect(zh.language, '语言');
    expect(es.talkMessenger, 'Hablar por Messenger');
    expect(zh.talkMessenger, '通过 Messenger 咨询');
    expect(zh.healthNeedActions, contains('减重'));
    expect(es.healthNeedActions, contains('Perder peso'));
  });

  test('AppLangX.fromCode maps zh variants', () {
    expect(AppLangX.fromCode('zh'), AppLang.zh);
    expect(AppLangX.fromCode('zh-CN'), AppLang.zh);
    expect(AppLangX.fromCode('es-MX'), AppLang.esMx);
    expect(AppLangX.fromCode(null), AppLang.esMx);
  });

  test('setLanguage updates profile and appStringsProvider', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    expect(container.read(appStringsProvider).isZh, isFalse);

    container.read(appStateProvider.notifier).setLanguage(AppLang.zh);
    expect(container.read(appStateProvider).profile.language, 'zh');
    expect(container.read(appStringsProvider).isZh, isTrue);
    expect(container.read(appStringsProvider).welcomeStart, '开始我的旅程');
  });

  test('quickAsksFor returns Chinese chips when language is zh', () {
    final zh = OnboardingChatGuide.quickAsksFor('health_need', language: 'zh');
    expect(zh.map((e) => e.$2), contains('减重'));

    final privacy = OnboardingChatGuide.quickAsksFor('privacy', language: 'zh');
    expect(privacy.map((e) => e.$2), contains('我同意'));
  });
}
