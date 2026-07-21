import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/brand_assets.dart';
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
                          'Membership + Sunny companion',
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
    router.go('/ritual');
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
                      const AuthMarketingHeader(
                        title: 'Welcome',
                        subtitle:
                            'A refined wellness ritual\nstarts with one tap.',
                        tagline: 'Grow Toward the Light',
                      ),
                      Transform.translate(
                        offset: const Offset(0, -28),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: LuckdateSpacing.lg,
                          ),
                          child: AuthFormCard(
                            title: 'Sign In',
                            buttonLabel: 'Sign in',
                            onSubmit: () => _signIn(router, ref),
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

/// Shared cream hero header for Sign In / Sign Up.
class AuthMarketingHeader extends StatelessWidget {
  const AuthMarketingHeader({
    super.key,
    required this.title,
    required this.subtitle,
    required this.tagline,
    this.showBack = false,
    this.onBack,
    this.showSunny = false,
  });

  final String title;
  final String subtitle;
  final String tagline;
  final bool showBack;
  final VoidCallback? onBack;
  final bool showSunny;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFFFBF7), Color(0xFFFFF3EA), Color(0xFFF5EBE0)],
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
              child: showSunny
                  ? const LdSunnyAvatar(size: 120, cycleIdle: false)
                  : const SymbolHero(size: 130, showRing: false),
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(
              LuckdateSpacing.lg,
              showBack ? LuckdateSpacing.sm : LuckdateSpacing.xl,
              LuckdateSpacing.lg,
              52,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (showBack)
                  IconButton(
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    onPressed: onBack,
                    icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                  ),
                if (showBack) const SizedBox(height: LuckdateSpacing.md),
                const AuthBrandLogo(),
                const SizedBox(height: LuckdateSpacing.xl),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: LuckdateTextStyles.display.copyWith(
                              fontSize: 34,
                            ),
                          ),
                          const SizedBox(height: LuckdateSpacing.sm),
                          Text(
                            subtitle,
                            style: LuckdateTextStyles.body.copyWith(
                              color: LuckdateColors.textSecondary,
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: LuckdateSpacing.sm),
                          Text(
                            tagline,
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
                    if (showSunny)
                      const LdSunnyAvatar(size: 72, cycleIdle: true)
                    else
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

class AuthBrandLogo extends StatelessWidget {
  const AuthBrandLogo({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const BrandAssetImage(kBrandLogoAsset, height: 26),
        const SizedBox(height: 4),
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

class AuthFormCard extends StatelessWidget {
  const AuthFormCard({
    super.key,
    required this.title,
    required this.buttonLabel,
    required this.onSubmit,
    this.emailController,
    this.passwordController,
  });

  final String title;
  final String buttonLabel;
  final VoidCallback onSubmit;
  final TextEditingController? emailController;
  final TextEditingController? passwordController;

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
            Text(title, style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.xl),
            AuthUnderlineField(
              label: 'Email',
              hint: 'you@email.com',
              controller: emailController,
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            AuthUnderlineField(
              label: 'Password',
              hint: '••••••••',
              obscure: true,
              controller: passwordController,
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
            LdPrimaryButton(label: buttonLabel, onPressed: onSubmit),
          ],
        ),
      ),
    );
  }
}

class AuthUnderlineField extends StatelessWidget {
  const AuthUnderlineField({
    super.key,
    required this.label,
    required this.hint,
    this.obscure = false,
    this.controller,
  });

  final String label;
  final String hint;
  final bool obscure;
  final TextEditingController? controller;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: LuckdateTextStyles.caption),
        TextField(
          controller: controller,
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
