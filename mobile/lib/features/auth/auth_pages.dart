import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/sunny_sunflower.dart';
import '../../shared/providers/app_providers.dart';

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
            Text('Welcome to ChatViva Slim', style: LuckdateTextStyles.h1),
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
                        Text('Default units: lb, ft/in, fl oz', style: LuckdateTextStyles.caption),
                      ],
                    ),
                  ),
                  const Icon(Icons.check_circle, color: LuckdateColors.deepSage),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.md),
            LdCard(
              child: Row(
                children: [
                  Icon(Icons.language, color: LuckdateColors.textSecondary.withValues(alpha: 0.5)),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Español (México)', style: LuckdateTextStyles.title.copyWith(color: LuckdateColors.textSecondary)),
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
                ref.read(appStateProvider.notifier).updateProfile(
                      ref.read(appStateProvider).profile.copyWith(region: 'US', language: 'en-US'),
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
              'Enter the code from your product package to unlock your 30-day Slim Journey.',
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
                  const Icon(Icons.card_giftcard, color: LuckdateColors.sunGold),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Solar Protein 30-Day', style: LuckdateTextStyles.title),
                        Text('Membership + Sunny companion', style: LuckdateTextStyles.caption),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            LdPrimaryButton(
              label: 'Activate & Continue',
              onPressed: () {
                ref.read(appStateProvider.notifier).setActivationCode(_codeController.text);
                context.go('/login');
              },
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
    ref.read(appStateProvider.notifier).setLoggedIn();
    router.go('/onboarding');
  }

  void _signUp(GoRouter router) {
    router.go('/onboarding');
  }

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
                        offset: const Offset(0, -32),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: LuckdateSpacing.lg),
                          child: _LoginFormCard(onSignIn: () => _signIn(router, ref)),
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
                            Text('Create account? ', style: LuckdateTextStyles.bodySmall),
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
          colors: [
            Color(0xFF4A5638),
            LuckdateColors.deepSage,
            Color(0xFF6E7D52),
          ],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -30,
            top: 20,
            child: Icon(
              Icons.wb_sunny_outlined,
              size: 180,
              color: Colors.white.withValues(alpha: 0.06),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(
              LuckdateSpacing.lg,
              LuckdateSpacing.xl,
              LuckdateSpacing.lg,
              56,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _BrandLogo(inverse: true),
                const SizedBox(height: LuckdateSpacing.xl),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome',
                            style: LuckdateTextStyles.display.copyWith(
                              color: LuckdateColors.ivoryWhite,
                              fontSize: 36,
                            ),
                          ),
                          const SizedBox(height: LuckdateSpacing.sm),
                          Text(
                            'Sign in to meet Sunny\nand start your journey.',
                            style: LuckdateTextStyles.body.copyWith(
                              color: LuckdateColors.ivoryWhite.withValues(alpha: 0.88),
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: LuckdateSpacing.sm),
                          Text(
                            'Grow Toward the Light',
                            style: LuckdateTextStyles.caption.copyWith(
                              color: LuckdateColors.solarSand,
                              letterSpacing: 1.2,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: LuckdateSpacing.sm),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: const SunnySunflower(size: 88, showStem: true),
                    ),
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
  const _BrandLogo({this.inverse = false});

  final bool inverse;

  @override
  Widget build(BuildContext context) {
    final primary = inverse ? LuckdateColors.ivoryWhite : LuckdateColors.chocolateBrown;
    final secondary = inverse
        ? LuckdateColors.ivoryWhite.withValues(alpha: 0.75)
        : LuckdateColors.textSecondary;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'luckdate',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w300,
            letterSpacing: 3,
            color: primary,
          ),
        ),
        Text(
          'ChatViva Slim',
          style: LuckdateTextStyles.title.copyWith(
            color: primary,
            fontSize: 16,
            letterSpacing: 0.5,
          ),
        ),
        Text(
          'The House of Vitality',
          style: LuckdateTextStyles.caption.copyWith(color: secondary),
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
      shadowColor: Colors.black.withValues(alpha: 0.08),
      borderRadius: BorderRadius.circular(LuckdateRadius.xl),
      child: Container(
        padding: const EdgeInsets.all(LuckdateSpacing.xl),
        decoration: BoxDecoration(
          color: LuckdateColors.ivoryWhite,
          borderRadius: BorderRadius.circular(LuckdateRadius.xl),
          border: Border.all(color: LuckdateColors.lineSoft.withValues(alpha: 0.6)),
          boxShadow: const [
            BoxShadow(
              color: Color(0x14000000),
              offset: Offset(0, 12),
              blurRadius: 32,
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
            const _UnderlineField(label: 'Password', hint: '••••••••', obscure: true),
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
              color: LuckdateColors.textSecondary.withValues(alpha: 0.5),
            ),
            filled: false,
            border: const UnderlineInputBorder(
              borderSide: BorderSide(color: LuckdateColors.lineSoft),
            ),
            enabledBorder: const UnderlineInputBorder(
              borderSide: BorderSide(color: LuckdateColors.lineSoft),
            ),
            focusedBorder: const UnderlineInputBorder(
              borderSide: BorderSide(color: LuckdateColors.deepSage, width: 1.5),
            ),
            contentPadding: const EdgeInsets.symmetric(vertical: LuckdateSpacing.sm),
          ),
        ),
      ],
    );
  }
}
