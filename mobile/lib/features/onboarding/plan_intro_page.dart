import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

class PlanIntroPage extends ConsumerWidget {
  const PlanIntroPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(appStateProvider).profile;
    final awaitingReceipt = profile.isAwaitingReceipt;

    return LdScaffold(
      showBack: true,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(child: LdSunnyAvatar(size: 72)),
            const SizedBox(height: LuckdateSpacing.xl),
            Text('Your 28-Day Slim Journey', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Solar Protein powers a gentle, structured plan — not perfection, but rhythm.',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            _phaseRow('Days 1–7', 'Launch', 'Build your daily ritual habit'),
            _phaseRow('Days 8–14', 'Adaptation', 'Track hydration and weight trends'),
            _phaseRow('Days 15–21', 'Stability', 'Optimize meals and sleep'),
            _phaseRow('Days 22–28', 'Completion', 'Celebrate progress and next steps'),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('What you will do daily', style: LuckdateTextStyles.title),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    '• Log Solar Protein\n'
                    '• Track hydration and weight\n'
                    '• Record sleep\n'
                    '• Chat with Sunny anytime',
                    style: LuckdateTextStyles.bodySmall,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
            if (awaitingReceipt) ...[
              LdAwaitingReceiptPanel(
                productName: profile.linkedProductName,
                onConfirmReceipt: () {
                  ref.read(appStateProvider.notifier).confirmReceipt();
                  context.go('/ritual');
                },
              ),
            ] else
              LdPrimaryButton(
                label: 'Go to Ritual',
                onPressed: () => context.go('/ritual'),
              ),
          ],
        ),
      ),
    );
  }

  Widget _phaseRow(String range, String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: LdCard(
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: LuckdateColors.sunGold.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(LuckdateRadius.md),
              ),
              child: const Icon(
                Icons.wb_sunny_outlined,
                color: LuckdateColors.chocolateBrown,
              ),
            ),
            const SizedBox(width: LuckdateSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(range, style: LuckdateTextStyles.caption),
                  Text(title, style: LuckdateTextStyles.title),
                  Text(subtitle, style: LuckdateTextStyles.bodySmall),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
