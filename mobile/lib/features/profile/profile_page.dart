import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    final profile = state.profile;
    final journey = state.journey;

    return LdScaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundColor: LuckdateColors.solarSand.withValues(
                    alpha: 0.4,
                  ),
                  child: Text(
                    profile.nickname.isNotEmpty ? profile.nickname[0] : 'F',
                    style: LuckdateTextStyles.h2,
                  ),
                ),
                const SizedBox(width: LuckdateSpacing.base),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(profile.nickname, style: LuckdateTextStyles.h2),
                      Text(
                        'Day ${journey.day} · Slim Journey',
                        style: LuckdateTextStyles.caption,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            _sectionTitle('Membership'),
            _tile(
              Icons.card_membership,
              profile.membershipPlan,
              profile.membershipExpires,
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            _sectionTitle('My Journey'),
            _tile(
              Icons.explore_outlined,
              'Slim Journey 28 Days',
              'Phase: ${journey.phase}',
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            _sectionTitle('Settings'),
            _settingsTile(
              context,
              Icons.straighten,
              'Units',
              '${profile.weightUnit} / ${profile.heightUnit}',
            ),
            _settingsTile(context, Icons.language, 'Language', 'English (US)'),
            _settingsTile(
              context,
              Icons.notifications_outlined,
              'Reminders',
              profile.userPlanType == UserPlanType.mealReplacement
                  ? '${profile.reminderTime} / ${profile.reminderTime2}'
                  : profile.reminderTime,
            ),
            _settingsTile(
              context,
              Icons.privacy_tip_outlined,
              'Privacy & Health Disclaimer',
              'View',
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            _sectionTitle('Orders & Achievements'),
            _settingsTile(
              context,
              Icons.shopping_bag_outlined,
              'Orders',
              profile.linkedOrderNo.isEmpty
                  ? 'No linked order'
                  : profile.linkedOrderNo,
            ),
            _settingsTile(
              context,
              Icons.emoji_events_outlined,
              'Achievements',
              '${journey.unlockedMilestones.length} badges',
            ),
            if (profile.welcomeCoupon != null)
              _settingsTile(
                context,
                Icons.local_offer_outlined,
                'Coupons',
                '\$${profile.welcomeCoupon!.amount.toStringAsFixed(0)} ${profile.welcomeCoupon!.status}',
              ),
            const SizedBox(height: LuckdateSpacing.lg),
            _sectionTitle('Product Center'),
            LdCard(
              onTap: () => context.push('/collection'),
              child: Row(
                children: [
                  const Icon(
                    Icons.storefront_outlined,
                    color: LuckdateColors.deepSage,
                  ),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '补充其他营养',
                          style: LuckdateTextStyles.body.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          '进入商品中心，查看全部营养方案。',
                          style: LuckdateTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.chevron_right,
                    size: 20,
                    color: LuckdateColors.textSecondary,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            _sectionTitle('Demo Controls'),
            Text(
              'Switch journey day for presentations',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.md),
            Row(
              children: [
                Expanded(
                  child: _dayBtn(ref, DemoDay.day1, 'Day 1', state.demoDay),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _dayBtn(ref, DemoDay.day12, 'Day 12', state.demoDay),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _dayBtn(ref, DemoDay.day28, 'Day 28', state.demoDay),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.md),
            Row(
              children: [
                Expanded(
                  child: LdSecondaryButton(
                    label: 'Show Loading',
                    onPressed: () => ref
                        .read(appStateProvider.notifier)
                        .toggleLoadingDemo(true),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: LdSecondaryButton(
                    label: 'Show Error',
                    onPressed: () => ref
                        .read(appStateProvider.notifier)
                        .toggleErrorDemo(true),
                  ),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdSecondaryButton(
              label: 'Restart Onboarding',
              onPressed: () {
                ref
                    .read(appStateProvider.notifier)
                    .updateProfile(profile.copyWith(onboardingComplete: false));
                context.go('/onboarding');
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: Text(title, style: LuckdateTextStyles.title),
    );
  }

  Widget _tile(IconData icon, String title, String subtitle) {
    return LdCard(
      child: Row(
        children: [
          Icon(icon, color: LuckdateColors.deepSage),
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
                Text(subtitle, style: LuckdateTextStyles.caption),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _settingsTile(
    BuildContext context,
    IconData icon,
    String title,
    String value,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: LdCard(
        onTap: () {
          if (title.contains('Disclaimer')) {
            showDialog<void>(
              context: context,
              builder: (ctx) => AlertDialog(
                title: const Text('Health Disclaimer'),
                content: const Text(
                  'luckdate provides lifestyle and product-use companionship. It does not provide medical diagnosis or treatment. Consult a professional if you have health conditions, are pregnant, or take medication.',
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('OK'),
                  ),
                ],
              ),
            );
          }
        },
        child: Row(
          children: [
            Icon(icon, color: LuckdateColors.deepSage, size: 22),
            const SizedBox(width: LuckdateSpacing.md),
            Expanded(child: Text(title, style: LuckdateTextStyles.body)),
            Text(value, style: LuckdateTextStyles.caption),
            const Icon(
              Icons.chevron_right,
              size: 20,
              color: LuckdateColors.textSecondary,
            ),
          ],
        ),
      ),
    );
  }

  Widget _dayBtn(WidgetRef ref, DemoDay day, String label, DemoDay current) {
    return LdSecondaryButton(
      label: label,
      selected: current == day,
      onPressed: () => ref.read(appStateProvider.notifier).switchDemoDay(day),
    );
  }
}
