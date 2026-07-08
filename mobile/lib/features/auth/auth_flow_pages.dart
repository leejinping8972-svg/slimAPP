import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/sunny_sunflower.dart';
import '../../shared/providers/app_providers.dart';

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
      backgroundColor: const Color(0xFF121212),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(LuckdateSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: IconButton(
                  onPressed: () => Navigator.of(context).maybePop(),
                  icon: const Icon(
                    Icons.arrow_back_ios_new,
                    color: LuckdateColors.ivoryWhite,
                  ),
                ),
              ),
              const SizedBox(height: LuckdateSpacing.md),
              Center(
                child: Container(
                  padding: const EdgeInsets.all(LuckdateSpacing.lg),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withValues(alpha: 0.04),
                    border: Border.all(
                      color: LuckdateColors.sunGold.withValues(alpha: 0.25),
                    ),
                  ),
                  child: const SunnySunflower(size: 96, showStem: false),
                ),
              ),
              const SizedBox(height: LuckdateSpacing.xl),
              Text(
                'Create your account',
                textAlign: TextAlign.center,
                style: LuckdateTextStyles.h1.copyWith(
                  color: LuckdateColors.ivoryWhite,
                ),
              ),
              const SizedBox(height: LuckdateSpacing.sm),
              Text(
                'Begin your premium ritual with luckdate.',
                textAlign: TextAlign.center,
                style: LuckdateTextStyles.bodySmall.copyWith(
                  color: LuckdateColors.ivoryWhite.withValues(alpha: 0.7),
                ),
              ),
              const SizedBox(height: LuckdateSpacing.xl),
              LdCard(
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A1A1A),
                    borderRadius: BorderRadius.circular(LuckdateRadius.xl),
                    border: Border.all(
                      color: LuckdateColors.sunGold.withValues(alpha: 0.2),
                    ),
                  ),
                  padding: const EdgeInsets.all(LuckdateSpacing.xl),
                  child: Column(
                    children: [
                      TextField(
                        controller: _emailController,
                        style: const TextStyle(
                          color: LuckdateColors.ivoryWhite,
                        ),
                        decoration: _registerInputDecoration(
                          'Email',
                          'you@email.com',
                        ),
                      ),
                      const SizedBox(height: LuckdateSpacing.base),
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        style: const TextStyle(
                          color: LuckdateColors.ivoryWhite,
                        ),
                        decoration: _registerInputDecoration(
                          'Password',
                          '••••••••',
                        ),
                      ),
                      const SizedBox(height: LuckdateSpacing.xl),
                      LdPrimaryButton(
                        label: 'Create account',
                        onPressed: _submit,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  InputDecoration _registerInputDecoration(String label, String hint) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      hintStyle: TextStyle(
        color: LuckdateColors.ivoryWhite.withValues(alpha: 0.35),
      ),
      labelStyle: TextStyle(
        color: LuckdateColors.ivoryWhite.withValues(alpha: 0.75),
      ),
      enabledBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: Color(0x55F5C542)),
      ),
      focusedBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: LuckdateColors.sunGold, width: 1.5),
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
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SunnySunflower(size: 96, showStem: true, useImage: true),
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
              label: 'Continue your journey',
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
  final _orderController = TextEditingController(text: 'ORD-2026-MEAL');
  final _phoneController = TextEditingController(text: '1234');

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
    context.go('/onboarding');
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
              ref.read(appStateProvider.notifier).skipOrderLink();
              context.go('/onboarding');
            },
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LdScaffold(
      showBack: true,
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Link your order', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Tell us your order so we can personalize your plan.',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            TextField(
              controller: _orderController,
              decoration: const InputDecoration(labelText: 'Order number'),
            ),
            const SizedBox(height: LuckdateSpacing.base),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.number,
              maxLength: 4,
              decoration: const InputDecoration(
                labelText: 'Last 4 digits of phone',
              ),
            ),
            const SizedBox(height: LuckdateSpacing.base),
            LdCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Demo orders', style: LuckdateTextStyles.title),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    'Meal replacement: ORD-2026-MEAL + 1234',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    'Non-meal product: ORD-2026-VITA + 5678',
                    style: LuckdateTextStyles.caption,
                  ),
                ],
              ),
            ),
            const Spacer(),
            LdPrimaryButton(label: 'Link order', onPressed: _link),
            const SizedBox(height: LuckdateSpacing.sm),
            LdSecondaryButton(
              label: 'Skip for now',
              onPressed: () {
                ref.read(appStateProvider.notifier).skipOrderLink();
                context.go('/onboarding');
              },
            ),
          ],
        ),
      ),
    );
  }
}
