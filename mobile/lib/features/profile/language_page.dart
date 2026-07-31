import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';

import '../../app/theme/luckdate_theme.dart';
import '../../shared/l10n/app_locale.dart';
import '../../shared/providers/app_providers.dart';

/// Dedicated language picker — Español (México) / 中文.
class LanguagePage extends ConsumerWidget {
  const LanguagePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = ref.watch(appStringsProvider);
    final current = AppLangX.fromCode(
      ref.watch(appStateProvider.select((s) => s.profile.language)),
    );

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      appBar: AppBar(
        backgroundColor: LuckdateColors.cloudIvory,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18),
          color: LuckdateColors.textPrimary,
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/me');
            }
          },
        ),
        title: Text(strings.languagePageTitle, style: LuckdateTextStyles.title),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        children: [
          Text(
            strings.languagePageSubtitle,
            style: LuckdateTextStyles.body,
          ),
          const SizedBox(height: LuckdateSpacing.xl),
          for (final lang in AppLang.values) ...[
            _LanguageCard(
              lang: lang,
              selected: current == lang,
              onTap: () async {
                ref.read(appStateProvider.notifier).setLanguage(lang);
                try {
                  await initializeDateFormatting(lang.intlLocale);
                  Intl.defaultLocale = lang.intlLocale;
                } catch (_) {}
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(strings.languageApplied)),
                  );
                }
              },
            ),
            const SizedBox(height: LuckdateSpacing.md),
          ],
          const SizedBox(height: LuckdateSpacing.xl),
          Container(
            padding: const EdgeInsets.all(LuckdateSpacing.lg),
            decoration: BoxDecoration(
              color: LuckdateColors.ivoryWhite,
              borderRadius: BorderRadius.circular(LuckdateRadius.lg),
              border: Border.all(color: LuckdateColors.lineSoft),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  current == AppLang.zh ? '中文预览' : 'Vista previa',
                  style: LuckdateTextStyles.title,
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                Text(
                  current == AppLang.zh
                      ? '欢迎使用 luckdate。切换语言后，欢迎页、导航、设置与 Sunny 引导等关键界面会显示中文。'
                      : 'Bienvenida a luckdate. Al cambiar el idioma, la bienvenida, la navegación, ajustes y la guía de Sunny se muestran en el idioma elegido.',
                  style: LuckdateTextStyles.body,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _LanguageCard extends StatelessWidget {
  const _LanguageCard({
    required this.lang,
    required this.selected,
    required this.onTap,
  });

  final AppLang lang;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: LuckdateColors.ivoryWhite,
      borderRadius: BorderRadius.circular(LuckdateRadius.lg),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(LuckdateRadius.lg),
        child: Container(
          padding: const EdgeInsets.all(LuckdateSpacing.lg),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(LuckdateRadius.lg),
            border: Border.all(
              color: selected ? LuckdateColors.deepSage : LuckdateColors.lineSoft,
              width: selected ? 2 : 1,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: LuckdateColors.deepSage.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  lang == AppLang.zh ? '中' : 'ES',
                  style: LuckdateTextStyles.title.copyWith(
                    color: LuckdateColors.deepSage,
                  ),
                ),
              ),
              const SizedBox(width: LuckdateSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(lang.displayName, style: LuckdateTextStyles.title),
                    Text(
                      lang == AppLang.zh
                          ? '简体中文界面'
                          : 'Interfaz en español (México)',
                      style: LuckdateTextStyles.caption,
                    ),
                  ],
                ),
              ),
              if (selected)
                const Icon(Icons.check_circle, color: LuckdateColors.deepSage),
            ],
          ),
        ),
      ),
    );
  }
}
