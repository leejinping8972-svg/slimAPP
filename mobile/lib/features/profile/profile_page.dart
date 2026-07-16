import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ld_shell.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/vitality_scorer.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key, this.rootTab = false});

  final bool rootTab;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    final profile = state.profile;
    final journey = state.journey;

    final page = SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(LuckdateSpacing.lg),
              decoration: BoxDecoration(
                gradient: LuckdateGradients.pageHeader,
                borderRadius: BorderRadius.circular(LuckdateRadius.xl),
                border: Border.all(color: LuckdateColors.lineSoft),
                boxShadow: LuckdateShadows.card,
              ),
              child: Row(
                children: [
                  LdProfileAvatar(nickname: profile.nickname, radius: 32),
                  const SizedBox(width: LuckdateSpacing.base),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(profile.nickname, style: LuckdateTextStyles.h2),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: LuckdateColors.sageSoft,
                            borderRadius:
                                BorderRadius.circular(LuckdateRadius.pill),
                          ),
                          child: Text(
                            'Vitality Member',
                            style: LuckdateTextStyles.caption.copyWith(
                              color: LuckdateColors.deepSage,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _profileSubtitle(profile, journey),
                          style: LuckdateTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            LdCard(
              child: Row(
                children: [
                  LdScoreRing(
                    score: journey.vitalityScores.dailyVitality,
                    label: VitalityScorer.vitalityLabel(
                      journey.vitalityScores.dailyVitality,
                    ),
                    size: 96,
                  ),
                  const SizedBox(width: LuckdateSpacing.lg),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Vitality Score', style: LuckdateTextStyles.title),
                        const SizedBox(height: 4),
                        Text(
                          'Ritual ${journey.vitalityScores.ritualCompletion}% · Consistency ${journey.vitalityScores.consistencyScore}%',
                          style: LuckdateTextStyles.bodySmall,
                        ),
                        const SizedBox(height: LuckdateSpacing.sm),
                        Text(
                          profile.membershipExpires,
                          style: LuckdateTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            _sectionTitle('Quick Menu'),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 3,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 1.1,
              children: [
                _menuTile(Icons.restaurant_menu_outlined, 'Check-in Record', () {
                  context.push('/record');
                }),
                _menuTile(Icons.shopping_bag_outlined, 'Orders', () {
                  context.push('/link-order');
                }),
                _menuTile(Icons.local_offer_outlined, 'Coupons', () {}),
                _menuTile(Icons.notifications_outlined, 'Reminders', () {
                  context.push('/profile/reminders');
                }),
                _menuTile(Icons.storefront_outlined, 'Mall', () {
                  context.go('/mall');
                }),
                _menuTile(Icons.event_note_outlined, 'Plan', () {
                  context.go('/plan');
                }),
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
            if (profile.isAwaitingReceipt) ...[
              _sectionTitle('Pending Delivery'),
              LdCard(
                accentColor: LuckdateColors.sunGold,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      profile.linkedProductName.isEmpty
                          ? 'Solar Protein™'
                          : profile.linkedProductName,
                      style: LuckdateTextStyles.title,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Confirm receipt to start your 28-day Slim Journey.',
                      style: LuckdateTextStyles.bodySmall,
                    ),
                    const SizedBox(height: LuckdateSpacing.md),
                    LdPrimaryButton(
                      label: 'Confirm Receipt',
                      onPressed: () {
                        ref.read(appStateProvider.notifier).confirmReceipt();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Plan started — welcome to Day 1!'),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: LuckdateSpacing.lg),
            ],
            if (profile.userPlanType == UserPlanType.mealReplacement) ...[
              _sectionTitle('My Journey'),
              _tile(
                Icons.explore_outlined,
                'Slim Journey 28 Days',
                'Phase: ${journey.phase} · Day ${journey.day}',
              ),
              const SizedBox(height: LuckdateSpacing.lg),
            ],
            _sectionTitle('Settings'),
            _settingsTile(
              context,
              Icons.straighten,
              'Units',
              '${profile.weightUnit} / ${profile.heightUnit}',
              showChevron: false,
            ),
            _settingsTile(
              context,
              Icons.language,
              'Language',
              'English (US)',
              showChevron: false,
            ),
            _settingsTile(
              context,
              Icons.notifications_outlined,
              'Reminders',
              profile.userPlanType == UserPlanType.mealReplacement
                  ? '${profile.reminderTime} / ${profile.reminderTime2}'
                  : profile.reminderTime,
              onTap: () => context.push('/profile/reminders'),
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
              onTap: () => context.push('/link-order'),
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
                '\$${profile.welcomeCoupon!.amount.toStringAsFixed(0)} · ${_couponDaysLeft(profile.welcomeCoupon!.expiresAt)} days left',
              ),
            const SizedBox(height: LuckdateSpacing.lg),
            _sectionTitle('Mall'),
            LdCard(
              onTap: () => context.go('/mall'),
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
                          'Additional Nutrition',
                          style: LuckdateTextStyles.body.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          'Enter Mall to view all nutrition plans.',
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
            if (kDebugMode) ...[
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
                  const SizedBox(width: LuckdateSpacing.sm),
                  Expanded(
                    child: _dayBtn(ref, DemoDay.day12, 'Day 12', state.demoDay),
                  ),
                  const SizedBox(width: LuckdateSpacing.sm),
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
                  const SizedBox(width: LuckdateSpacing.sm),
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
                      .updateProfile(
                        profile.copyWith(onboardingComplete: false),
                      );
                  context.go('/onboarding');
                },
              ),
            ],
          ],
        ),
    );

    if (rootTab) {
      return Scaffold(
        backgroundColor: LuckdateColors.cloudIvory,
        body: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.sm,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.md,
                ),
                child: Center(
                  child: Text('Me', style: LuckdateTextStyles.title),
                ),
              ),
              Expanded(child: page),
            ],
          ),
        ),
      );
    }

    return LdScaffold(
      title: 'Me',
      showBack: true,
      body: page,
    );
  }

  Widget _menuTile(IconData icon, String label, VoidCallback onTap) {
    return LdCard(
      onTap: onTap,
      padding: const EdgeInsets.all(LuckdateSpacing.sm),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: LuckdateColors.deepSage, size: 22),
          const SizedBox(height: 6),
          Text(
            label,
            style: LuckdateTextStyles.caption,
            textAlign: TextAlign.center,
          ),
        ],
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
    String value, {
    VoidCallback? onTap,
    bool showChevron = true,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: LdCard(
        onTap:
            onTap ??
            () {
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
            if (showChevron)
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

  String _profileSubtitle(UserProfile profile, JourneyState journey) {
    return switch (profile.userPlanType) {
      UserPlanType.mealReplacement => 'Day ${journey.day} · Slim Journey',
      UserPlanType.nonMealReplacement => 'Product reminder plan',
      UserPlanType.noProduct => 'Basic tracking mode',
    };
  }

  int _couponDaysLeft(DateTime expiresAt) {
    final days = expiresAt.difference(DateTime.now()).inDays;
    return days < 0 ? 0 : days;
  }
}
