import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/mock_order_service.dart';
import '../splash/splash_page.dart';

enum _RegisterMethod { phone, email }

/// Sunny-guided registration — all fields on one page.
class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _codeController = TextEditingController();
  final _passwordController = TextEditingController();

  _RegisterMethod _method = _RegisterMethod.phone;
  bool _codeSent = false;
  String? _error;

  @override
  void dispose() {
    _phoneController.dispose();
    _emailController.dispose();
    _codeController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _setMethod(_RegisterMethod method) {
    if (_method == method) return;
    setState(() {
      _method = method;
      _error = null;
      _codeSent = false;
      _codeController.clear();
    });
  }

  void _sendCode() {
    final digits = _phoneController.text.trim().replaceAll(RegExp(r'\D'), '');
    if (digits.length < 8) {
      setState(() => _error = 'Please enter a valid phone number.');
      return;
    }
    setState(() {
      _codeSent = true;
      _error = null;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Demo code sent — enter any 4+ digits')),
    );
  }

  static bool _looksLikeEmail(String value) {
    return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(value);
  }

  void _submit() {
    if (_method == _RegisterMethod.phone) {
      final digits =
          _phoneController.text.trim().replaceAll(RegExp(r'\D'), '');
      if (digits.length < 8) {
        setState(() => _error = 'Please enter a valid phone number.');
        return;
      }
      if (!_codeSent) {
        setState(() => _error = 'Tap Send code first.');
        return;
      }
      final code = _codeController.text.trim();
      if (code.length < 4 || !RegExp(r'^\d+$').hasMatch(code)) {
        setState(() => _error = 'Enter the verification code (4+ digits).');
        return;
      }
    } else {
      final email = _emailController.text.trim();
      if (!_looksLikeEmail(email)) {
        setState(() => _error = 'Please enter a valid email address.');
        return;
      }
    }

    final password = _passwordController.text;
    if (password.length < 6) {
      setState(() => _error = 'Password needs at least 6 characters.');
      return;
    }

    ref.read(appStateProvider.notifier).completeRegistration();
    context.go('/link-order');
  }

  @override
  Widget build(BuildContext context) {
    final isPhone = _method == _RegisterMethod.phone;

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 4, 16, 0),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => context.go('/sunny/intro'),
                    icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                  ),
                  Expanded(
                    child: Text(
                      'Join with Sunny',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.title,
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.md,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.lg,
                ),
                child: Column(
                  children: [
                    const LdSunnyAvatar(size: 96),
                    const SizedBox(height: LuckdateSpacing.base),
                    Text(
                      'Create your account',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.h1,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Phone or email — one quick form.',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.bodySmall,
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    Row(
                      children: [
                        Expanded(
                          child: LdChoiceChip(
                            label: 'Phone',
                            selected: isPhone,
                            onTap: () => _setMethod(_RegisterMethod.phone),
                          ),
                        ),
                        const SizedBox(width: LuckdateSpacing.sm),
                        Expanded(
                          child: LdChoiceChip(
                            label: 'Email',
                            selected: !isPhone,
                            onTap: () => _setMethod(_RegisterMethod.email),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    LdCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (isPhone) ...[
                            Text('Phone number', style: LuckdateTextStyles.caption),
                            TextField(
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
                              autofillHints: const [
                                AutofillHints.telephoneNumber,
                              ],
                              decoration: const InputDecoration(
                                hintText: '+1 555 0100',
                                border: InputBorder.none,
                              ),
                              onChanged: (_) {
                                if (_error != null) {
                                  setState(() => _error = null);
                                }
                              },
                            ),
                            const SizedBox(height: LuckdateSpacing.md),
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    'Verification code',
                                    style: LuckdateTextStyles.caption,
                                  ),
                                ),
                                TextButton(
                                  onPressed: _sendCode,
                                  child: Text(
                                    _codeSent ? 'Resend' : 'Send code',
                                    style: LuckdateTextStyles.bodySmall.copyWith(
                                      color: LuckdateColors.deepSage,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            TextField(
                              controller: _codeController,
                              keyboardType: TextInputType.number,
                              maxLength: 6,
                              decoration: const InputDecoration(
                                hintText: '1234',
                                border: InputBorder.none,
                                counterText: '',
                              ),
                              onChanged: (_) {
                                if (_error != null) {
                                  setState(() => _error = null);
                                }
                              },
                            ),
                          ] else ...[
                            Text('Email', style: LuckdateTextStyles.caption),
                            TextField(
                              controller: _emailController,
                              keyboardType: TextInputType.emailAddress,
                              autofillHints: const [AutofillHints.email],
                              decoration: const InputDecoration(
                                hintText: 'you@email.com',
                                border: InputBorder.none,
                              ),
                              onChanged: (_) {
                                if (_error != null) {
                                  setState(() => _error = null);
                                }
                              },
                            ),
                          ],
                          const SizedBox(height: LuckdateSpacing.md),
                          Text('Password', style: LuckdateTextStyles.caption),
                          TextField(
                            controller: _passwordController,
                            obscureText: true,
                            decoration: const InputDecoration(
                              hintText: 'At least 6 characters',
                              border: InputBorder.none,
                            ),
                            onChanged: (_) {
                              if (_error != null) {
                                setState(() => _error = null);
                              }
                            },
                            onSubmitted: (_) => _submit(),
                          ),
                        ],
                      ),
                    ),
                    if (_error != null) ...[
                      const SizedBox(height: LuckdateSpacing.md),
                      Text(
                        _error!,
                        textAlign: TextAlign.center,
                        style: LuckdateTextStyles.caption.copyWith(
                          color: LuckdateColors.errorSoft,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(
                LuckdateSpacing.lg,
                LuckdateSpacing.sm,
                LuckdateSpacing.lg,
                LuckdateSpacing.lg,
              ),
              child: Column(
                children: [
                  LdPrimaryButton(
                    label: 'Create account',
                    onPressed: _submit,
                  ),
                  const SizedBox(height: LuckdateSpacing.md),
                  Row(
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
                ],
              ),
            ),
          ],
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
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();

  OrderLinkResult? _queryResult;
  bool _queried = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _goToSunnyQuestions() {
    ref.read(appStateProvider.notifier).beginOnboardingChat();
    context.go('/home');
  }

  void _goToProductIntroChat() {
    ref.read(appStateProvider.notifier).beginProductIntroChat();
    context.go('/home');
  }

  void _query() {
    final result = ref.read(mockOrderServiceProvider).linkOrder(
          recipientName: _nameController.text,
          phoneLast4: _phoneController.text,
        );
    setState(() {
      _queryResult = result;
      _queried = true;
    });
  }

  bool get _hasOrders =>
      _queryResult != null &&
      _queryResult!.success &&
      _queryResult!.products.isNotEmpty;

  void _getProductInfo() {
    if (!_hasOrders) return;
    final result = ref.read(appStateProvider.notifier).linkOrder(
          recipientName: _nameController.text,
          phoneLast4: _phoneController.text,
        );
    if (!result.success) {
      setState(() {
        _queryResult = result;
        _queried = true;
      });
      return;
    }
    if (!mounted) return;
    final onboarded = ref.read(appStateProvider).profile.onboardingComplete;
    if (onboarded) {
      context.go('/home');
    } else {
      _goToProductIntroChat();
    }
  }

  void _skip() {
    ref.read(appStateProvider.notifier).skipOrderLink();
    final onboarded = ref.read(appStateProvider).profile.onboardingComplete;
    if (onboarded) {
      context.pop();
    } else {
      _goToSunnyQuestions();
    }
  }

  @override
  Widget build(BuildContext context) {
    final coupon = ref.watch(appStateProvider).profile.welcomeCoupon;

    return LdScaffold(
      showBack: true,
      onBack: () => context.go('/register'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(child: LdSunnyAvatar(size: 88)),
            const SizedBox(height: LuckdateSpacing.lg),
            Text('Link your order', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Search with recipient name and the last 4 phone digits.',
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
              controller: _nameController,
              textCapitalization: TextCapitalization.words,
              decoration: const InputDecoration(
                labelText: 'Recipient name',
                hintText: 'Name on the order',
              ),
              onChanged: (_) {
                if (_queried) {
                  setState(() {
                    _queried = false;
                    _queryResult = null;
                  });
                }
              },
            ),
            const SizedBox(height: LuckdateSpacing.base),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.number,
              maxLength: 4,
              decoration: const InputDecoration(
                labelText: 'Last 4 digits of phone',
                hintText: '1234',
              ),
              onChanged: (_) {
                if (_queried) {
                  setState(() {
                    _queried = false;
                    _queryResult = null;
                  });
                }
              },
            ),
            const SizedBox(height: LuckdateSpacing.base),
            LdSecondaryButton(
              label: 'Query',
              onPressed: _query,
            ),
            if (_queried) ...[
              const SizedBox(height: LuckdateSpacing.lg),
              if (_hasOrders) ...[
                Text(
                  'Found ${_queryResult!.products.length} '
                  '${_queryResult!.products.length == 1 ? 'order' : 'orders'}',
                  style: LuckdateTextStyles.title,
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                ..._queryResult!.products.map((p) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
                    child: LdCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            p.productName,
                            style: LuckdateTextStyles.body.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${p.orderNo} · ${p.series.isNotEmpty ? p.series : 'Vitality'}',
                            style: LuckdateTextStyles.caption,
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              ] else
                LdCard(
                  child: Text(
                    _queryResult?.message.isNotEmpty == true
                        ? _queryResult!.message
                        : 'No linked orders found.',
                    style: LuckdateTextStyles.bodySmall,
                  ),
                ),
            ],
            const SizedBox(height: LuckdateSpacing.base),
            LdCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Demo guide', style: LuckdateTextStyles.title),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    '• Any name + 4 digits → 1–3 demo orders',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Phone ending 0000 → no linked orders',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Name "meal" → Solar Protein 28-Day only',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Skip → explore with Sunny first',
                    style: LuckdateTextStyles.caption,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
            LdPrimaryButton(
              label: 'Get product info',
              onPressed: _hasOrders ? _getProductInfo : null,
            ),
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
