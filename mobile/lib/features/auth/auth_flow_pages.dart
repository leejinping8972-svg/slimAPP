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
      final digits = _phoneController.text.trim().replaceAll(RegExp(r'\D'), '');
      if (digits.length < 8) {
        setState(() => _error = 'Ingresa un número de teléfono válido.');
        return;
      }
    } else if (!AuthChannelToggle.looksLikeEmail(_emailController.text)) {
      setState(
        () => _error = 'Ingresa una dirección de correo electrónico válida.',
      );
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
                      'Crea tu cuenta',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.h1,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Solo necesitas tu teléfono o correo electrónico para empezar.',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.bodySmall,
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    AuthChannelToggle(value: _channel, onChanged: _setChannel),
                    const SizedBox(height: LuckdateSpacing.lg),
                    LdCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isPhone
                                ? 'Número de teléfono'
                                : 'Correo electrónico',
                            style: LuckdateTextStyles.caption,
                          ),
                          TextField(
                            controller: isPhone
                                ? _phoneController
                                : _emailController,
                            keyboardType: isPhone
                                ? TextInputType.phone
                                : TextInputType.emailAddress,
                            autofillHints: isPhone
                                ? const [AutofillHints.telephoneNumber]
                                : const [AutofillHints.email],
                            decoration: InputDecoration(
                              hintText: isPhone
                                  ? '+1 555 0100'
                                  : 'you@email.com',
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
                  LdPrimaryButton(label: 'Crear cuenta', onPressed: _submit),
                  const SizedBox(height: LuckdateSpacing.md),
                  Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Text(
                        '¿Ya tienes una cuenta? ',
                        style: LuckdateTextStyles.bodySmall,
                      ),
                      GestureDetector(
                        onTap: () => context.go('/login'),
                        child: Text(
                          'Iniciar sesión',
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
            Text(
              'Te damos la bienvenida a luckdate',
              style: LuckdateTextStyles.h1,
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Preparamos un regalo para ti.',
              style: LuckdateTextStyles.body,
            ),
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
                    'Cupón para toda la tienda (excepto algunos artículos)',
                    style: LuckdateTextStyles.bodySmall,
                  ),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text('Válido por 30 días', style: LuckdateTextStyles.caption),
                ],
              ),
            ),
            const Spacer(),
            LdPrimaryButton(
              label: 'Continuar para vincular pedido',
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
    final result = ref
        .read(mockOrderServiceProvider)
        .linkOrder(
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
    final result = ref
        .read(appStateProvider.notifier)
        .linkOrder(
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
            Text('Vincula tu pedido', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Busca con el nombre del destinatario y los últimos 4 dígitos del teléfono.',
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
                            'Cupón de bienvenida de \$${coupon.amount.toStringAsFixed(0)}',
                            style: LuckdateTextStyles.body.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            'Válido por 30 días · toda la tienda',
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
                labelText: 'Nombre del destinatario',
                hintText: 'Nombre en el pedido',
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
                labelText: 'Últimos 4 dígitos del teléfono',
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
            LdPrimaryButton(label: 'Buscar', onPressed: _query),
            if (_queried) ...[
              const SizedBox(height: LuckdateSpacing.lg),
              if (_hasOrders) ...[
                Text(
                  'Se encontraron ${_queryResult!.products.length} '
                  '${_queryResult!.products.length == 1 ? 'pedido' : 'pedidos'}',
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
                          _OrderMetaRow(
                            label: 'Núm. de pedido',
                            value: p.orderNo,
                          ),
                          _OrderMetaRow(
                            label: 'Fecha de pedido',
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
                        : 'No se encontraron pedidos vinculados.',
                    style: LuckdateTextStyles.bodySmall,
                  ),
                ),
            ],
            const SizedBox(height: LuckdateSpacing.base),
            LdCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Guía de demostración', style: LuckdateTextStyles.title),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(
                    '• Cualquier nombre + 4 dígitos → 1 a 3 pedidos de demostración',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Teléfono terminado en 0000 → sin pedidos vinculados',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Nombre "meal" → solo Solar Protein 28-Day',
                    style: LuckdateTextStyles.caption,
                  ),
                  Text(
                    '• Omitir → explora primero con Sunny',
                    style: LuckdateTextStyles.caption,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
            LdPrimaryButton(
              label: 'Ver información del producto',
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
                    borderRadius: BorderRadius.circular(LuckdateRadius.control),
                  ),
                ),
                child: Text(
                  'Omitir por ahora',
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
