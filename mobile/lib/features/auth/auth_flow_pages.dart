import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';
import '../splash/splash_page.dart';

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
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.only(left: LuckdateSpacing.sm),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: IconButton(
                    onPressed: () => context.go('/login'),
                    icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                  ),
                ),
              ),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.md,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.xxl,
                ),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Color(0xFFFAF8F2), Color(0xFFF5F0E4)],
                  ),
                ),
                child: Column(
                  children: [
                    const SymbolHero(size: 100),
                    const SizedBox(height: LuckdateSpacing.xl),
                    Text(
                      'Create your account',
                      style: LuckdateTextStyles.h1,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Begin your premium ritual with luckdate.',
                      style: LuckdateTextStyles.bodySmall,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              Transform.translate(
                offset: const Offset(0, -20),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: LuckdateSpacing.lg,
                  ),
                  child: Material(
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
                        children: [
                          TextField(
                            controller: _emailController,
                            decoration: _registerInputDecoration(
                              'Email',
                              'you@email.com',
                            ),
                          ),
                          const SizedBox(height: LuckdateSpacing.base),
                          TextField(
                            controller: _passwordController,
                            obscureText: true,
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
                ),
              ),
              const SizedBox(height: LuckdateSpacing.xl),
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
      hintStyle: LuckdateTextStyles.bodySmall.copyWith(
        color: LuckdateColors.textSecondary.withValues(alpha: 0.45),
      ),
      enabledBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: LuckdateColors.lineSoft),
      ),
      focusedBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: LuckdateColors.deepSage, width: 1.5),
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
