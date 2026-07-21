import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';

/// Fixed Sunny opening — self-intro + product system + journey overview (single page).
class SunnyIntroPage extends ConsumerWidget {
  const SunnyIntroPage({super.key});

  static const _capabilities = [
    ('☀️', 'Daily Rituals', 'Cultivate habits, brighten every day'),
    ('📊', 'Vitality Dashboard', 'Track your data, see your progress'),
    ('🪷', 'Scientific Formula', 'Professional formulas, reliable companionship'),
    ('👥', 'Community Support', 'Support each other, grow together'),
    ('🛍️', 'Health Mall', 'Curated quality products for a healthier lifestyle'),
  ];

  static const _series = [
    ('🌿', 'Slim'),
    ('✨', 'Beauty'),
    ('🧬', 'Aging'),
    ('🌸', 'Women'),
    ('🧠', 'Mind'),
    ('⚡', 'Energy'),
    ('☀️', 'Daily'),
  ];

  static const _journey = [
    ('📦', 'Link your order'),
    ('🎯', 'A few core questions'),
    ('📋', 'Personalized 28-day plan'),
  ];

  void _continue(WidgetRef ref, BuildContext context) {
    ref.read(appStateProvider.notifier).markSunnyOpeningSeen();
    context.go('/register');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
              child: Text(
                'Meet Sunny',
                textAlign: TextAlign.center,
                style: LuckdateTextStyles.title,
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.lg,
                ),
                child: Column(
                  children: [
                    const LdSunnyAvatar(size: 110),
                    const SizedBox(height: LuckdateSpacing.lg),
                    Text(
                      'Hi, I\'m Sunny',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.h1,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Your Daily Vitality Ritual Partner',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.body.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Scientific Formula · AI Companionship · '
                      'Daily Rituals · Growing Together',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.caption.copyWith(height: 1.5),
                    ),
                    const SizedBox(height: LuckdateSpacing.xl),
                    ..._capabilities.map((h) {
                      return Padding(
                        padding: const EdgeInsets.only(
                          bottom: LuckdateSpacing.sm,
                        ),
                        child: LdCard(
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(h.$1, style: const TextStyle(fontSize: 22)),
                              const SizedBox(width: LuckdateSpacing.md),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      h.$2,
                                      style: LuckdateTextStyles.body.copyWith(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(h.$3, style: LuckdateTextStyles.caption),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                    const SizedBox(height: LuckdateSpacing.md),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Luckdate Slim Vitality',
                        style: LuckdateTextStyles.title,
                      ),
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'A science-backed product system — from slim support '
                      'to beauty, energy, and healthy aging.',
                      style: LuckdateTextStyles.bodySmall.copyWith(height: 1.45),
                    ),
                    const SizedBox(height: LuckdateSpacing.md),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _series
                          .map(
                            (s) => Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: LuckdateColors.ivoryWhite,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: LuckdateColors.lineSoft,
                                ),
                              ),
                              child: Text(
                                '${s.$1} ${s.$2}',
                                style: LuckdateTextStyles.caption.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          )
                          .toList(),
                    ),
                    const SizedBox(height: LuckdateSpacing.xl),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Your 28-Day Journey',
                        style: LuckdateTextStyles.title,
                      ),
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    ..._journey.map((j) {
                      return Padding(
                        padding: const EdgeInsets.only(
                          bottom: LuckdateSpacing.sm,
                        ),
                        child: LdCard(
                          child: Row(
                            children: [
                              Text(j.$1, style: const TextStyle(fontSize: 20)),
                              const SizedBox(width: LuckdateSpacing.md),
                              Expanded(
                                child: Text(
                                  j.$2,
                                  style: LuckdateTextStyles.body.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(
                LuckdateSpacing.lg,
                LuckdateSpacing.sm,
                LuckdateSpacing.lg,
                LuckdateSpacing.lg,
              ),
              child: LdPrimaryButton(
                label: 'Create my account',
                onPressed: () => _continue(ref, context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
