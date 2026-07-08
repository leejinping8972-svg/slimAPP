import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';
import '../splash/splash_page.dart';

class RegionPage extends ConsumerWidget {
  const RegionPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return LdScaffold(
      title: 'Region & Language',
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Welcome to luckdate', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Choose your region and language. Spanish (Mexico) coming soon.',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              child: Row(
                children: [
                  const Icon(Icons.language, color: LuckdateColors.deepSage),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('English (US)', style: LuckdateTextStyles.title),
                        Text(
                          'Default units: lb, ft/in, fl oz',
                          style: LuckdateTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.check_circle,
                    color: LuckdateColors.deepSage,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.md),
            LdCard(
              child: Row(
                children: [
                  Icon(
                    Icons.language,
                    color: LuckdateColors.textSecondary.withValues(alpha: 0.5),
                  ),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Español (México)',
                          style: LuckdateTextStyles.title.copyWith(
                            color: LuckdateColors.textSecondary,
                          ),
                        ),
                        Text('Coming soon', style: LuckdateTextStyles.caption),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            LdPrimaryButton(
              label: 'Continue',
              onPressed: () {
                ref
                    .read(appStateProvider.notifier)
                    .updateProfile(
                      ref
                          .read(appStateProvider)
                          .profile
                          .copyWith(region: 'US', language: 'en-US'),
                    );
                context.go('/activation');
              },
            ),
          ],
        ),
      ),
    );
  }
}

class ActivationPage extends ConsumerStatefulWidget {
  const ActivationPage({super.key});

  @override
  ConsumerState<ActivationPage> createState() => _ActivationPageState();
}

class _ActivationPageState extends ConsumerState<ActivationPage> {
  final _codeController = TextEditingController(text: 'SOLAR-2026-FREYA');

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LdScaffold(
      title: 'Activate',
      showBack: true,
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const LdSunnyAvatar(size: 56),
            const SizedBox(height: LuckdateSpacing.base),
            Text('Activate your Solar Protein', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Enter the code from your product package to unlock your 28-day Slim Journey.',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            TextField(
              controller: _codeController,
              decoration: const InputDecoration(labelText: 'Activation code'),
            ),
            const SizedBox(height: LuckdateSpacing.base),
            LdCard(
              child: Row(
                children: [
                  const Icon(
                    Icons.card_giftcard,
                    color: LuckdateColors.sunGold,
                  ),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Solar Protein 28-Day',
                          style: LuckdateTextStyles.title,
                        ),
                        Text(
                          'Membership + Viva companion',
                          style: LuckdateTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            LdPrimaryButton(
              label: 'Activate & Continue',
              onPressed: () => context.go('/link-order'),
            ),
          ],
        ),
      ),
    );
  }
}

class LoginPage extends ConsumerWidget {
  const LoginPage({super.key});

  void _signIn(GoRouter router, WidgetRef ref) {
    ref.read(appStateProvider.notifier).loginExistingUser();
    final profile = ref.read(appStateProvider).profile;
    if (profile.onboardingComplete) {
      router.go('/today');
    } else {
      router.go('/onboarding');
    }
  }

  void _signUp(GoRouter router) => router.go('/register');

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter.of(context);
    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: IntrinsicHeight(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const _LoginHeroHeader(),
                      Transform.translate(
                        offset: const Offset(0, -28),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: LuckdateSpacing.lg,
                          ),
                          child: _LoginFormCard(
                            onSignIn: () => _signIn(router, ref),
                          ),
                        ),
                      ),
                      const Spacer(),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(
                          LuckdateSpacing.lg,
                          LuckdateSpacing.sm,
                          LuckdateSpacing.lg,
                          LuckdateSpacing.lg,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Create account? ',
                              style: LuckdateTextStyles.bodySmall,
                            ),
                            GestureDetector(
                              onTap: () => _signUp(router),
                              child: Text(
                                'Sign up',
                                style: LuckdateTextStyles.bodySmall.copyWith(
                                  color: LuckdateColors.deepSage,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _LoginHeroHeader extends StatelessWidget {
  const _LoginHeroHeader();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFAF8F2), Color(0xFFF5F0E4), Color(0xFFEDE6D6)],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            right: -20,
            top: 8,
            child: Opacity(
              opacity: 0.35,
              child: const SymbolHero(size: 130, showRing: false),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(
              LuckdateSpacing.lg,
              LuckdateSpacing.xl,
              LuckdateSpacing.lg,
              52,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _BrandLogo(),
                const SizedBox(height: LuckdateSpacing.xl),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome',
                            style: LuckdateTextStyles.display.copyWith(
                              fontSize: 34,
                            ),
                          ),
                          const SizedBox(height: LuckdateSpacing.sm),
                          Text(
                            'A refined wellness ritual\nstarts with one tap.',
                            style: LuckdateTextStyles.body.copyWith(
                              color: LuckdateColors.textSecondary,
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: LuckdateSpacing.sm),
                          Text(
                            'Grow Toward the Light',
                            style: LuckdateTextStyles.caption.copyWith(
                              color: LuckdateColors.chocolateBrown.withValues(
                                alpha: 0.7,
                              ),
                              letterSpacing: 1.0,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SymbolHero(size: 72),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BrandLogo extends StatelessWidget {
  const _BrandLogo();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'luckdate',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w300,
            letterSpacing: 4,
            color: LuckdateColors.chocolateBrown,
          ),
        ),
        Text(
          'The House of Vitality',
          style: LuckdateTextStyles.caption.copyWith(
            color: LuckdateColors.textSecondary,
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }
}

class _LoginFormCard extends StatelessWidget {
  const _LoginFormCard({required this.onSignIn});

  final VoidCallback onSignIn;

  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: 0,
      borderRadius: BorderRadius.circular(LuckdateRadius.xl),
      child: Container(
        padding: const EdgeInsets.all(LuckdateSpacing.xl),
        decoration: BoxDecoration(
          color: LuckdateColors.ivoryWhite,
          borderRadius: BorderRadius.circular(LuckdateRadius.xl),
          border: Border.all(
            color: LuckdateColors.lineSoft.withValues(alpha: 0.8),
          ),
          boxShadow: const [
            BoxShadow(
              color: Color(0x12000000),
              offset: Offset(0, 10),
              blurRadius: 28,
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Sign In', style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.xl),
            const _UnderlineField(label: 'Email', hint: 'you@email.com'),
            const SizedBox(height: LuckdateSpacing.lg),
            const _UnderlineField(
              label: 'Password',
              hint: '••••••••',
              obscure: true,
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
            LdPrimaryButton(label: 'Sign in', onPressed: onSignIn),
          ],
        ),
      ),
    );
  }
}

class _UnderlineField extends StatelessWidget {
  const _UnderlineField({
    required this.label,
    required this.hint,
    this.obscure = false,
  });

  final String label;
  final String hint;
  final bool obscure;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: LuckdateTextStyles.caption),
        TextField(
          obscureText: obscure,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: LuckdateTextStyles.bodySmall.copyWith(
              color: LuckdateColors.textSecondary.withValues(alpha: 0.45),
            ),
            filled: false,
            border: const UnderlineInputBorder(
              borderSide: BorderSide(color: LuckdateColors.lineSoft),
            ),
            enabledBorder: const UnderlineInputBorder(
              borderSide: BorderSide(color: LuckdateColors.lineSoft),
            ),
            focusedBorder: const UnderlineInputBorder(
              borderSide: BorderSide(
                color: LuckdateColors.deepSage,
                width: 1.5,
              ),
            ),
            contentPadding: const EdgeInsets.symmetric(
              vertical: LuckdateSpacing.sm,
            ),
          ),
        ),
      ],
    );
  }
}
