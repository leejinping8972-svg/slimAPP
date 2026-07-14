import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';
import '../splash/splash_page.dart';
import 'auth_pages.dart';

class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() {
    ref.read(appStateProvider.notifier).completeRegistration();
    context.go('/register-success');
  }

  @override
  Widget build(BuildContext context) {
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
                      AuthMarketingHeader(
                        title: 'Join us',
                        subtitle:
                            'Begin your premium ritual\nwith luckdate today.',
                        tagline: 'Grow Toward the Light',
                        showBack: true,
                        onBack: () => context.go('/login'),
                      ),
                      Transform.translate(
                        offset: const Offset(0, -28),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: LuckdateSpacing.lg,
                          ),
                          child: AuthFormCard(
                            title: 'Create Account',
                            buttonLabel: 'Create account',
                            onSubmit: _submit,
                            emailController: _emailController,
                            passwordController: _passwordController,
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
                              'Already have an account? ',
                              style: LuckdateTextStyles.bodySmall,
                            ),
                            GestureDetector(
                              onTap: () => context.go('/login'),
                              child: Text(
                                'Sign in',
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

class RegisterSuccessPage extends ConsumerWidget {
  const RegisterSuccessPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final coupon = ref.watch(appStateProvider).profile.welcomeCoupon;

    return LdScaffold(
      showBack: true,
      onBack: () {
        ref.read(appStateProvider.notifier).clearLoginSession();
        context.go('/login');
      },
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(child: SymbolHero(size: 96)),
            const SizedBox(height: LuckdateSpacing.xl),
            Text('Welcome to luckdate', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text('We prepared a gift for you.', style: LuckdateTextStyles.body),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '\$${coupon?.amount.toStringAsFixed(0) ?? '5'}',
                    style: LuckdateTextStyles.display,
                  ),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    'Storewide coupon (some items excluded)',
                    style: LuckdateTextStyles.bodySmall,
                  ),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text('Valid for 30 days', style: LuckdateTextStyles.caption),
                ],
              ),
            ),
            const Spacer(),
            LdPrimaryButton(
              label: 'Continue to link order',
              onPressed: () {
                ref.read(appStateProvider.notifier).acknowledgeCouponReward();
                context.go('/link-order');
              },
            ),
          ],
        ),
      ),
    );
  }
}

class OrderLinkPage extends ConsumerStatefulWidget {
  const OrderLinkPage({super.key});

  @override
  ConsumerState<OrderLinkPage> createState() => _OrderLinkPageState();
}

class _OrderLinkPageState extends ConsumerState<OrderLinkPage> {
  final _orderController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void dispose() {
    _orderController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _link() {
    final result = ref
        .read(appStateProvider.notifier)
        .linkOrder(
          orderNo: _orderController.text,
          phoneLast4: _phoneController.text,
        );
    if (!result.success) {
      _showFailureDialog(result.message);
      return;
    }
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Linked: ${result.productName}'),
      ),
    );
    final onboarded = ref.read(appStateProvider).profile.onboardingComplete;
    if (onboarded) {
      context.pop();
    } else {
      context.go('/onboarding');
    }
  }

  void _continueAfterFailure() {
    final onboarded = ref.read(appStateProvider).profile.onboardingComplete;
    ref.read(appStateProvider.notifier).skipOrderLink();
    if (onboarded) {
      context.pop();
    } else {
      context.go('/onboarding');
    }
  }

  void _showFailureDialog(String message) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Order not found'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Try again'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              _continueAfterFailure();
            },
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  }

  void _skip() {
    ref.read(appStateProvider.notifier).skipOrderLink();
    final onboarded = ref.read(appStateProvider).profile.onboardingComplete;
    if (onboarded) {
      context.pop();
    } else {
      context.go('/onboarding');
    }
  }

  @override
  Widget build(BuildContext context) {
    final coupon = ref.watch(appStateProvider).profile.welcomeCoupon;

    return LdScaffold(
      showBack: true,
      onBack: () => context.go('/login'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Link your order', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Link your order to unlock the right plan. You can skip and explore first.',
              style: LuckdateTextStyles.bodySmall,
            ),
            if (coupon != null) ...[
              const SizedBox(height: LuckdateSpacing.lg),
              LdCard(
                child: Row(
                  children: [
                    const Icon(
                      Icons.local_offer_outlined,
                      color: LuckdateColors.deepSage,
                    ),
                    const SizedBox(width: LuckdateSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '\$${coupon.amount.toStringAsFixed(0)} welcome coupon',
                            style: LuckdateTextStyles.body.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            'Valid for 30 days · storewide',
                            style: LuckdateTextStyles.caption,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: LuckdateSpacing.xl),
            TextField(
              controller: _orderController,
              decoration: const InputDecoration(
                labelText: 'Order number',
                hintText: 'meal or other',
              ),
            ),
            const SizedBox(height: LuckdateSpacing.base),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.number,
              maxLength: 4,
              decoration: const InputDecoration(
                labelText: 'Last 4 digits of phone (optional for demo)',
                hintText: '1234',
              ),
            ),
            const SizedBox(height: LuckdateSpacing.base),
            LdCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Demo guide', style: LuckdateTextStyles.title),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    '• Enter meal → Solar Protein 28-Day Slim Journey',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Enter other → Other product, daily reminder only',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Skip → No plan yet; purchase Solar Protein on Ritual',
                    style: LuckdateTextStyles.caption,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
            LdPrimaryButton(label: 'Link order', onPressed: _link),
            const SizedBox(height: LuckdateSpacing.sm),
            LdSecondaryButton(
              label: 'Skip for now',
              onPressed: _skip,
            ),
            const SizedBox(height: LuckdateSpacing.lg),
          ],
        ),
      ),
    );
  }
}
