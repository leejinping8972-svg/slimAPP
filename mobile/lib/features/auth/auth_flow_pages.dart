import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';
import '../splash/splash_page.dart';

enum _RegisterMethod { phone, email }

enum _RegisterStep { method, contact, verify, password }

/// Sunny-guided registration — same shell as Sunny intro, step-by-step.
class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _contactController = TextEditingController();
  final _codeController = TextEditingController();
  final _passwordController = TextEditingController();

  _RegisterStep _step = _RegisterStep.method;
  _RegisterMethod? _method;
  bool _codeSent = false;
  String? _error;

  @override
  void dispose() {
    _contactController.dispose();
    _codeController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _back() {
    if (_step == _RegisterStep.method) {
      context.go('/sunny/intro');
      return;
    }
    setState(() {
      _error = null;
      switch (_step) {
        case _RegisterStep.method:
          break;
        case _RegisterStep.contact:
          _step = _RegisterStep.method;
          _method = null;
        case _RegisterStep.verify:
          _step = _RegisterStep.contact;
          _codeSent = false;
          _codeController.clear();
        case _RegisterStep.password:
          _step = _method == _RegisterMethod.phone
              ? _RegisterStep.verify
              : _RegisterStep.contact;
      }
    });
  }

  void _chooseMethod(_RegisterMethod method) {
    setState(() {
      _method = method;
      _step = _RegisterStep.contact;
      _error = null;
      _contactController.clear();
    });
  }

  void _continueFromContact() {
    final value = _contactController.text.trim();
    if (_method == _RegisterMethod.phone) {
      final digits = value.replaceAll(RegExp(r'\D'), '');
      if (digits.length < 8) {
        setState(() => _error = 'Please enter a valid phone number.');
        return;
      }
      setState(() {
        _error = null;
        _step = _RegisterStep.verify;
        _codeSent = false;
        _codeController.clear();
      });
      return;
    }
    if (!_looksLikeEmail(value)) {
      setState(() => _error = 'Please enter a valid email address.');
      return;
    }
    setState(() {
      _error = null;
      _step = _RegisterStep.password;
    });
  }

  void _sendCode() {
    final digits =
        _contactController.text.trim().replaceAll(RegExp(r'\D'), '');
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

  void _continueFromVerify() {
    final code = _codeController.text.trim();
    if (!_codeSent) {
      setState(() => _error = 'Tap Send code first.');
      return;
    }
    if (code.length < 4 || !RegExp(r'^\d+$').hasMatch(code)) {
      setState(() => _error = 'Enter the verification code (4+ digits).');
      return;
    }
    setState(() {
      _error = null;
      _step = _RegisterStep.password;
    });
  }

  void _submit() {
    final password = _passwordController.text;
    if (password.length < 6) {
      setState(() => _error = 'Password needs at least 6 characters.');
      return;
    }
    ref.read(appStateProvider.notifier).completeRegistration();
    context.go('/link-order');
  }

  void _primaryAction() {
    switch (_step) {
      case _RegisterStep.method:
        return;
      case _RegisterStep.contact:
        _continueFromContact();
      case _RegisterStep.verify:
        _continueFromVerify();
      case _RegisterStep.password:
        _submit();
    }
  }

  String get _sunnyTitle {
    switch (_step) {
      case _RegisterStep.method:
        return 'Let\'s create your account';
      case _RegisterStep.contact:
        return _method == _RegisterMethod.phone
            ? 'What\'s your phone number?'
            : 'What\'s your email?';
      case _RegisterStep.verify:
        return 'Verify it\'s you';
      case _RegisterStep.password:
        return 'Set a password';
    }
  }

  String get _sunnyBody {
    switch (_step) {
      case _RegisterStep.method:
        return 'I\'ll walk you through it — phone or email, your choice.';
      case _RegisterStep.contact:
        return _method == _RegisterMethod.phone
            ? 'I\'ll send a short code to confirm your number.'
            : 'We\'ll use this to keep your vitality journey safe.';
      case _RegisterStep.verify:
        return 'Enter the code I just sent. Demo: any 4+ digits works.';
      case _RegisterStep.password:
        return 'Almost done — pick something you\'ll remember.';
    }
  }

  String get _primaryLabel {
    switch (_step) {
      case _RegisterStep.method:
        return 'Continue';
      case _RegisterStep.contact:
        return 'Continue';
      case _RegisterStep.verify:
        return 'Verify & continue';
      case _RegisterStep.password:
        return 'Create account';
    }
  }

  bool get _primaryEnabled => _step != _RegisterStep.method;

  static bool _looksLikeEmail(String value) {
    return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(value);
  }

  @override
  Widget build(BuildContext context) {
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
                    onPressed: _back,
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
                  LuckdateSpacing.lg,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.lg,
                ),
                child: Column(
                  children: [
                    const LdSunnyAvatar(size: 110),
                    const SizedBox(height: LuckdateSpacing.lg),
                    Text(
                      _sunnyTitle,
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.h1,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      _sunnyBody,
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.body.copyWith(height: 1.45),
                    ),
                    const SizedBox(height: LuckdateSpacing.xl),
                    _buildStepBody(),
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
                  if (_primaryEnabled)
                    LdPrimaryButton(
                      label: _primaryLabel,
                      onPressed: _primaryAction,
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

  Widget _buildStepBody() {
    switch (_step) {
      case _RegisterStep.method:
        return Column(
          children: [
            _MethodCard(
              emoji: '📱',
              title: 'Phone number',
              subtitle: 'Quick sign-up with SMS code',
              onTap: () => _chooseMethod(_RegisterMethod.phone),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            _MethodCard(
              emoji: '✉️',
              title: 'Email',
              subtitle: 'Classic email + password',
              onTap: () => _chooseMethod(_RegisterMethod.email),
            ),
          ],
        );
      case _RegisterStep.contact:
        final isPhone = _method == _RegisterMethod.phone;
        return LdCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                isPhone ? 'Phone number' : 'Email',
                style: LuckdateTextStyles.caption,
              ),
              TextField(
                controller: _contactController,
                keyboardType: isPhone
                    ? TextInputType.phone
                    : TextInputType.emailAddress,
                autofillHints: [
                  if (isPhone) AutofillHints.telephoneNumber,
                  if (!isPhone) AutofillHints.email,
                ],
                decoration: InputDecoration(
                  hintText: isPhone ? '+1 555 0100' : 'you@email.com',
                  border: InputBorder.none,
                ),
                onChanged: (_) {
                  if (_error != null) setState(() => _error = null);
                },
                onSubmitted: (_) => _continueFromContact(),
              ),
            ],
          ),
        );
      case _RegisterStep.verify:
        return LdCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
                  if (_error != null) setState(() => _error = null);
                },
                onSubmitted: (_) => _continueFromVerify(),
              ),
            ],
          ),
        );
      case _RegisterStep.password:
        return LdCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Password', style: LuckdateTextStyles.caption),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  hintText: 'At least 6 characters',
                  border: InputBorder.none,
                ),
                onChanged: (_) {
                  if (_error != null) setState(() => _error = null);
                },
                onSubmitted: (_) => _submit(),
              ),
            ],
          ),
        );
    }
  }
}

class _MethodCard extends StatelessWidget {
  const _MethodCard({
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final String emoji;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(LuckdateRadius.lg),
        child: Ink(
          decoration: BoxDecoration(
            color: LuckdateColors.ivoryWhite,
            borderRadius: BorderRadius.circular(LuckdateRadius.lg),
            border: Border.all(color: LuckdateColors.lineSoft),
            boxShadow: LuckdateShadows.soft,
          ),
          padding: const EdgeInsets.all(LuckdateSpacing.base),
          child: Row(
            children: [
              Text(emoji, style: const TextStyle(fontSize: 28)),
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
                    const SizedBox(height: 2),
                    Text(subtitle, style: LuckdateTextStyles.caption),
                  ],
                ),
              ),
              const Icon(
                Icons.arrow_forward_ios_rounded,
                size: 16,
                color: LuckdateColors.textSecondary,
              ),
            ],
          ),
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

  void _fetchProductInfo() {
    final result = ref.read(appStateProvider.notifier).linkOrder(
          recipientName: _nameController.text,
          phoneLast4: _phoneController.text,
        );
    if (!result.success) {
      _showFailureDialog(result.message);
      return;
    }
    if (!mounted) return;
    final count = result.products.length;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          count == 1
              ? 'Found: ${result.productName}'
              : 'Found $count linked products',
        ),
      ),
    );
    final onboarded = ref.read(appStateProvider).profile.onboardingComplete;
    if (onboarded) {
      context.go('/home');
    } else {
      _goToProductIntroChat();
    }
  }

  void _continueAfterFailure() {
    final onboarded = ref.read(appStateProvider).profile.onboardingComplete;
    ref.read(appStateProvider.notifier).skipOrderLink();
    if (onboarded) {
      context.pop();
    } else {
      _goToSunnyQuestions();
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
              'Enter the recipient name and phone digits to unlock your products. '
              'You can skip and explore first.',
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
                hintText: 'Any name works for demo',
              ),
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
            ),
            const SizedBox(height: LuckdateSpacing.base),
            LdCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Demo guide', style: LuckdateTextStyles.title),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    '• Any name + 4 digits → multiple sample products',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Name "meal" → Solar Protein 28-Day only',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Name "other" → Youth Solar only',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Skip → No plan yet; explore with Sunny',
                    style: LuckdateTextStyles.caption,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
            LdPrimaryButton(
              label: '获取产品说明',
              onPressed: _fetchProductInfo,
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
