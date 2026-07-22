import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';

/// Fixed Sunny opening — short self-intro before registration.
class SunnyIntroPage extends ConsumerWidget {
  const SunnyIntroPage({super.key});

  static const _highlights = [
    ('☀️', 'Daily rituals & reminders'),
    ('📋', 'Personalized 28-day plan'),
    ('🛍️', 'Curated vitality products'),
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
                  LuckdateSpacing.xl,
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
                      'Your daily vitality ritual partner.',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.body.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'I\'ll help you create an account, link your order, '
                      'and start a gentle 28-day journey.',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.bodySmall.copyWith(height: 1.45),
                    ),
                    const SizedBox(height: LuckdateSpacing.xl),
                    ..._highlights.map((h) {
                      return Padding(
                        padding: const EdgeInsets.only(
                          bottom: LuckdateSpacing.sm,
                        ),
                        child: LdCard(
                          child: Row(
                            children: [
                              Text(h.$1, style: const TextStyle(fontSize: 22)),
                              const SizedBox(width: LuckdateSpacing.md),
                              Expanded(
                                child: Text(
                                  h.$2,
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
