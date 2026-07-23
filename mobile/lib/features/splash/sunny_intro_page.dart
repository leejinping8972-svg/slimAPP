import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';

/// Fixed Sunny opening — short self-intro before registration.
class SunnyIntroPage extends ConsumerWidget {
  const SunnyIntroPage({super.key});

  static const _capabilities = [
    (Icons.wb_sunny_outlined, 'Daily Ritual', 'Build habits that brighten every day'),
    (Icons.bar_chart_rounded, 'Vitality Dashboard', 'Track your data and see your progress'),
    (Icons.spa_outlined, 'Scientific Formula', 'Professional formulas, gentle companionship'),
    (Icons.people_outline_rounded, 'Community Support', 'Support each other and grow together'),
    (Icons.shopping_bag_outlined, 'Health Mall', 'Curated picks for a healthier lifestyle'),
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
                    const SizedBox(height: LuckdateSpacing.xl),
                    LdCard(
                      child: Column(
                        children: [
                          for (var i = 0; i < _capabilities.length; i++) ...[
                            if (i > 0) const SizedBox(height: LuckdateSpacing.base),
                            _CapabilityRow(
                              icon: _capabilities[i].$1,
                              title: _capabilities[i].$2,
                              subtitle: _capabilities[i].$3,
                            ),
                          ],
                        ],
                      ),
                    ),
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

class _CapabilityRow extends StatelessWidget {
  const _CapabilityRow({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: LuckdateColors.ivoryWhite,
            shape: BoxShape.circle,
            border: Border.all(color: LuckdateColors.lineSoft),
          ),
          child: Icon(icon, size: 20, color: LuckdateColors.chocolateBrown),
        ),
        const SizedBox(width: LuckdateSpacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: LuckdateTextStyles.body.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 2),
              Text(subtitle, style: LuckdateTextStyles.caption),
            ],
          ),
        ),
      ],
    );
  }
}
