import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/mock_order_service.dart';
import '../splash/splash_page.dart';
import 'auth_pages.dart';

/// Sunny-guided registration — phone or email only (no password / code).
class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();

  AuthChannel _channel = AuthChannel.phone;
  String? _error;

  @override
  void dispose() {
    _phoneController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _setChannel(AuthChannel channel) {
    if (_channel == channel) return;
    setState(() {
      _channel = channel;
      _error = null;
    });
  }

  void _clearError() {
    if (_error != null) setState(() => _error = null);
  }

  void _submit() {
    if (_channel == AuthChannel.phone) {
      final digits =
          _phoneController.text.trim().replaceAll(RegExp(r'\D'), '');
      if (digits.length < 8) {
        setState(() => _error = 'Please enter a valid phone number.');
        return;
      }
    } else if (!AuthChannelToggle.looksLikeEmail(_emailController.text)) {
      setState(() => _error = 'Please enter a valid email address.');
      return;
    }

    ref.read(appStateProvider.notifier).completeRegistration();
    context.go('/link-order');
  }

  @override
  Widget build(BuildContext context) {
    final isPhone = _channel == AuthChannel.phone;

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
                    onPressed: () => context.go('/'),
                    icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                  ),
                  const Spacer(),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.sm,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.lg,
                ),
                child: Column(
                  children: [
                    const LdSunnyAvatar(size: 72),
                    const SizedBox(height: LuckdateSpacing.base),
                    Text(
                      'Create your account',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.h1,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Just your phone or email to get started.',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.bodySmall,
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    AuthChannelToggle(
                      value: _channel,
                      onChanged: _setChannel,
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    LdCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isPhone ? 'Phone number' : 'Email',
                            style: LuckdateTextStyles.caption,
                          ),
                          TextField(
                            controller:
                                isPhone ? _phoneController : _emailController,
                            keyboardType: isPhone
                                ? TextInputType.phone
                                : TextInputType.emailAddress,
                            autofillHints: isPhone
                                ? const [AutofillHints.telephoneNumber]
                                : const [AutofillHints.email],
                            decoration: InputDecoration(
                              hintText:
                                  isPhone ? '+1 555 0100' : 'you@email.com',
                              border: InputBorder.none,
                            ),
                            onChanged: (_) => _clearError(),
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
                  Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
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
            LdPrimaryButton(
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
                          const SizedBox(height: LuckdateSpacing.sm),
                          _OrderMetaRow(label: 'Order No.', value: p.orderNo),
                          _OrderMetaRow(
                            label: 'Ordered at',
                            value: p.orderedAt.isNotEmpty ? p.orderedAt : '—',
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
            const SizedBox(height: LuckdateSpacing.md),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: OutlinedButton(
                onPressed: _skip,
                style: OutlinedButton.styleFrom(
                  foregroundColor: LuckdateColors.deepSage,
                  backgroundColor: LuckdateColors.sageSoft,
                  side: const BorderSide(
                    color: LuckdateColors.deepSage,
                    width: 1.5,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                  ),
                ),
                child: Text(
                  'Skip for now',
                  style: LuckdateTextStyles.body.copyWith(
                    fontWeight: FontWeight.w600,
                    color: LuckdateColors.deepSage,
                  ),
                ),
              ),
            ),
            const SizedBox(height: LuckdateSpacing.lg),
          ],
        ),
      ),
    );
  }
}

class _OrderMetaRow extends StatelessWidget {
  const _OrderMetaRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 88,
            child: Text(label, style: LuckdateTextStyles.caption),
          ),
          Expanded(
            child: Text(
              value,
              style: LuckdateTextStyles.bodySmall.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
