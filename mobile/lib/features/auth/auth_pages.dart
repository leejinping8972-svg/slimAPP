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
      title: 'Región e idioma',
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Te damos la bienvenida a luckdate',
              style: LuckdateTextStyles.h1,
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Elige tu región e idioma.',
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
                        Text(
                          'Español (México)',
                          style: LuckdateTextStyles.title,
                        ),
                        Text(
                          'Unidades predeterminadas: kg, cm, ml',
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
            const Spacer(),
            LdPrimaryButton(
              label: 'Continuar',
              onPressed: () {
                ref
                    .read(appStateProvider.notifier)
                    .updateProfile(
                      ref
                          .read(appStateProvider)
                          .profile
                          .copyWith(region: 'MX', language: 'es-MX'),
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
      title: 'Activar',
      showBack: true,
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const LdSunnyAvatar(size: 56),
            const SizedBox(height: LuckdateSpacing.base),
            Text('Activa tu Solar Protein', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Ingresa el código de tu producto para desbloquear tu recorrido Slim de 28 días.',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            TextField(
              controller: _codeController,
              decoration: const InputDecoration(
                labelText: 'Código de activación',
              ),
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
                          'Membresía + acompañamiento de Sunny',
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
              label: 'Activar y continuar',
              onPressed: () => context.go('/link-order'),
            ),
          ],
        ),
      ),
    );
  }
}

enum AuthChannel { phone, email }

enum AuthLoginMode { password, code }

/// Compact phone / email icon switcher shared by Sign in & Sign up.
class AuthChannelToggle extends StatelessWidget {
  const AuthChannelToggle({
    super.key,
    required this.value,
    required this.onChanged,
  });

  final AuthChannel value;
  final ValueChanged<AuthChannel> onChanged;

  static bool looksLikeEmail(String value) {
    return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(value.trim());
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _AuthIconButton(
          icon: Icons.phone_iphone_rounded,
          selected: value == AuthChannel.phone,
          semanticLabel: 'Teléfono',
          onTap: () => onChanged(AuthChannel.phone),
        ),
        const SizedBox(width: LuckdateSpacing.md),
        _AuthIconButton(
          icon: Icons.mail_outline_rounded,
          selected: value == AuthChannel.email,
          semanticLabel: 'Correo electrónico',
          onTap: () => onChanged(AuthChannel.email),
        ),
      ],
    );
  }
}

class _AuthIconButton extends StatelessWidget {
  const _AuthIconButton({
    required this.icon,
    required this.selected,
    required this.semanticLabel,
    required this.onTap,
  });

  final IconData icon;
  final bool selected;
  final String semanticLabel;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: semanticLabel,
      selected: selected,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(LuckdateRadius.pill),
          child: Ink(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: selected
                  ? LuckdateColors.deepSage
                  : LuckdateColors.ivoryWhite,
              borderRadius: BorderRadius.circular(LuckdateRadius.pill),
              border: Border.all(
                color: selected
                    ? LuckdateColors.deepSage
                    : LuckdateColors.lineSoft,
              ),
            ),
            child: Icon(
              icon,
              size: 22,
              color: selected
                  ? LuckdateColors.ivoryWhite
                  : LuckdateColors.chocolateBrown,
            ),
          ),
        ),
      ),
    );
  }
}

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _codeController = TextEditingController();

  AuthChannel _channel = AuthChannel.phone;
  AuthLoginMode _mode = AuthLoginMode.password;
  bool _codeSent = false;
  String? _error;

  @override
  void dispose() {
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _codeController.dispose();
    super.dispose();
  }

  void _clearError() {
    if (_error != null) setState(() => _error = null);
  }

  void _setChannel(AuthChannel channel) {
    if (_channel == channel) return;
    setState(() {
      _channel = channel;
      _error = null;
      _codeSent = false;
      _codeController.clear();
    });
  }

  void _setMode(AuthLoginMode mode) {
    if (_mode == mode) return;
    setState(() {
      _mode = mode;
      _error = null;
      _codeSent = false;
      _codeController.clear();
    });
  }

  bool _validateAccount() {
    if (_channel == AuthChannel.phone) {
      final digits = _phoneController.text.trim().replaceAll(RegExp(r'\D'), '');
      if (digits.length < 8) {
        setState(() => _error = 'Ingresa un número de teléfono válido.');
        return false;
      }
    } else if (!AuthChannelToggle.looksLikeEmail(_emailController.text)) {
      setState(
        () => _error = 'Ingresa una dirección de correo electrónico válida.',
      );
      return false;
    }
    return true;
  }

  void _sendCode() {
    if (!_validateAccount()) return;
    setState(() {
      _codeSent = true;
      _error = null;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Código de demostración enviado: ingresa 4 o más dígitos',
        ),
      ),
    );
  }

  void _submit() {
    if (!_validateAccount()) return;

    if (_mode == AuthLoginMode.password) {
      if (_passwordController.text.length < 6) {
        setState(
          () => _error = 'La contraseña debe tener al menos 6 caracteres.',
        );
        return;
      }
    } else {
      if (!_codeSent) {
        setState(() => _error = 'Primero toca Enviar código.');
        return;
      }
      final code = _codeController.text.trim();
      if (code.length < 4 || !RegExp(r'^\d+$').hasMatch(code)) {
        setState(
          () => _error = 'Ingresa el código de verificación (4 o más dígitos).',
        );
        return;
      }
    }

    ref.read(appStateProvider.notifier).loginExistingUser();
    context.go('/ritual');
  }

  @override
  Widget build(BuildContext context) {
    final isPhone = _channel == AuthChannel.phone;
    final usePassword = _mode == AuthLoginMode.password;

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
                    onPressed: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/');
                      }
                    },
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
                      'Qué bueno verte de nuevo',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.h1,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Inicia sesión con contraseña o código de verificación.',
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
                          ),
                          const SizedBox(height: LuckdateSpacing.md),
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  usePassword
                                      ? 'Contraseña'
                                      : 'Código de verificación',
                                  style: LuckdateTextStyles.caption,
                                ),
                              ),
                              if (!usePassword)
                                TextButton(
                                  onPressed: _sendCode,
                                  child: Text(
                                    _codeSent ? 'Reenviar' : 'Enviar código',
                                    style: LuckdateTextStyles.bodySmall
                                        .copyWith(
                                          color: LuckdateColors.deepSage,
                                          fontWeight: FontWeight.w600,
                                        ),
                                  ),
                                ),
                            ],
                          ),
                          TextField(
                            controller: usePassword
                                ? _passwordController
                                : _codeController,
                            obscureText: usePassword,
                            keyboardType: usePassword
                                ? TextInputType.visiblePassword
                                : TextInputType.number,
                            maxLength: usePassword ? null : 6,
                            decoration: InputDecoration(
                              hintText: usePassword
                                  ? 'Al menos 6 caracteres'
                                  : '1234',
                              border: InputBorder.none,
                              counterText: '',
                            ),
                            onChanged: (_) => _clearError(),
                            onSubmitted: (_) => _submit(),
                          ),
                          const SizedBox(height: LuckdateSpacing.sm),
                          Row(
                            children: [
                              GestureDetector(
                                onTap: () => _setMode(AuthLoginMode.password),
                                child: Text(
                                  'Contraseña',
                                  style: LuckdateTextStyles.bodySmall.copyWith(
                                    color: usePassword
                                        ? LuckdateColors.deepSage
                                        : LuckdateColors.textSecondary,
                                    fontWeight: usePassword
                                        ? FontWeight.w700
                                        : FontWeight.w500,
                                  ),
                                ),
                              ),
                              Text(
                                '  ·  ',
                                style: LuckdateTextStyles.bodySmall.copyWith(
                                  color: LuckdateColors.textSecondary,
                                ),
                              ),
                              GestureDetector(
                                onTap: () => _setMode(AuthLoginMode.code),
                                child: Text(
                                  'Código de verificación',
                                  style: LuckdateTextStyles.bodySmall.copyWith(
                                    color: !usePassword
                                        ? LuckdateColors.deepSage
                                        : LuckdateColors.textSecondary,
                                    fontWeight: !usePassword
                                        ? FontWeight.w700
                                        : FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
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
                  LdPrimaryButton(label: 'Iniciar sesión', onPressed: _submit),
                  const SizedBox(height: LuckdateSpacing.md),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '¿No tienes una cuenta? ',
                        style: LuckdateTextStyles.bodySmall,
                      ),
                      GestureDetector(
                        onTap: () => context.go('/register'),
                        child: Text(
                          'Regístrate',
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
        const BrandAssetImage(
          kBrandLogoAsset,
          height: 26,
          knockoutBackground: false,
        ),
        const SizedBox(height: 4),
        Text(
          'La casa de la vitalidad',
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
              label: 'Correo electrónico',
              hint: 'you@email.com',
              controller: emailController,
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            AuthUnderlineField(
              label: 'Contraseña',
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
