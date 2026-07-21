import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

/// Shown after a successful order link — introduce the product before Sunny Q&A.
class ProductIntroPage extends ConsumerWidget {
  const ProductIntroPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(appStateProvider).profile;
    final productName = profile.linkedProductName.isNotEmpty
        ? profile.linkedProductName
        : 'Solar Protein™';
    final isMeal = profile.userPlanType == UserPlanType.mealReplacement ||
        profile.hasActiveSlimPlan;

    return LdScaffold(
      showBack: true,
      onBack: () => context.go('/link-order'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(child: LdSunnyAvatar(size: 88)),
            const SizedBox(height: LuckdateSpacing.lg),
            Text('Meet your product', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              isMeal
                  ? 'Your order is linked. Here is how $productName powers your 28-day Slim Journey.'
                  : 'Your order is linked. Here is how $productName fits into your daily vitality ritual.',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              accentColor: LuckdateColors.sunGold,
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: LuckdateColors.sageSoft,
                      borderRadius: BorderRadius.circular(LuckdateRadius.md),
                    ),
                    child: const Icon(
                      Icons.eco_rounded,
                      color: LuckdateColors.deepSage,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(productName, style: LuckdateTextStyles.title),
                        const SizedBox(height: 4),
                        Text(
                          isMeal
                              ? '28-Day Slim Journey unlocked'
                              : 'Daily product care plan',
                          style: LuckdateTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            Text('How to use', style: LuckdateTextStyles.title),
            const SizedBox(height: LuckdateSpacing.sm),
            ..._bullets(
              isMeal
                  ? const [
                      'Mix one serving with water or milk as your meal support.',
                      'Log your shake in Sunny chat or Ritual each day.',
                      'Pair with hydration, sleep, and gentle movement.',
                      'Stay consistent — Day 1 starts after a few quick questions.',
                    ]
                  : const [
                      'Take as directed on your product label.',
                      'Set a daily reminder so Sunny can check in with you.',
                      'Log each serving in Sunny chat to build your streak.',
                      'Upgrade anytime with Solar Protein for the full 28-day plan.',
                    ],
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            Text('What happens next', style: LuckdateTextStyles.title),
            const SizedBox(height: LuckdateSpacing.sm),
            ..._bullets(
              isMeal
                  ? const [
                      'Sunny asks a few core questions to personalize your plan.',
                      'Then she guides you through your Day 1 check-in.',
                      'Your Ritual dashboard tracks vitality as you go.',
                    ]
                  : const [
                      'Sunny asks a few core questions for your profile.',
                      'You can browse Mall anytime to unlock the full Slim Journey.',
                    ],
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
            LdPrimaryButton(
              label: 'Continue with Sunny',
              onPressed: () {
                final onboarded =
                    ref.read(appStateProvider).profile.onboardingComplete;
                if (onboarded) {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/ritual');
                  }
                } else {
                  final hasProducts = ref
                      .read(appStateProvider)
                      .profile
                      .linkedProducts
                      .isNotEmpty;
                  if (hasProducts) {
                    ref.read(appStateProvider.notifier).beginProductIntroChat();
                  } else {
                    ref.read(appStateProvider.notifier).beginOnboardingChat();
                  }
                  context.go('/home');
                }
              },
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Center(
              child: TextButton(
                onPressed: () {
                  final onboarded =
                      ref.read(appStateProvider).profile.onboardingComplete;
                  if (onboarded) {
                    context.go('/ritual');
                  } else {
                    ref.read(appStateProvider.notifier).beginOnboardingChat();
                    context.go('/home');
                  }
                },
                child: const Text('Skip for now'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _bullets(List<String> items) {
    return items
        .map(
          (t) => Padding(
            padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('•  ', style: TextStyle(height: 1.4)),
                Expanded(
                  child: Text(t, style: LuckdateTextStyles.bodySmall),
                ),
              ],
            ),
          ),
        )
        .toList();
  }
}
