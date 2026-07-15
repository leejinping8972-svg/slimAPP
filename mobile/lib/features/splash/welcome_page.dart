import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/super_symbol_mark.dart';
import 'splash_backdrop.dart';

/// Guide page after splash — shared lifestyle bg + code-drawn brand UI.
class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage>
    with TickerProviderStateMixin {
  late final AnimationController _light;
  late final AnimationController _liquid;
  late final AnimationController _breathe;

  static const _taupe = Color(0xFF4F463E);
  static const _olive = Color(0xFF5E6550);
  static const _gold = Color(0xFFC4A06E);

  @override
  void initState() {
    super.initState();
    _light = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 11),
    )..repeat(reverse: true);
    _liquid = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 4200),
    )..repeat(reverse: true);
    _breathe = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2300),
    )..repeat(reverse: true);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      precacheImage(const AssetImage(kWelcomeImageAsset), context);
    });
  }

  @override
  void dispose() {
    _light.dispose();
    _liquid.dispose();
    _breathe.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kSplashScaffoldColor,
      body: Stack(
        fit: StackFit.expand,
        children: [
          SplashBackdrop(
            assetPath: kWelcomeImageAsset,
            animated: true,
            lightAnimation: _light,
            liquidAnimation: _liquid,
          ),
          // Soft vignette so bottom CTAs stay readable — keep photo dominant.
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x0A000000),
                  Color(0x00000000),
                  Color(0x3D000000),
                ],
                stops: [0.0, 0.55, 1.0],
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(28, 20, 28, 18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const _WelcomeBrand(),
                  const SizedBox(height: 28),
                  Text(
                    'Feel Alive.\nMeet luckdate.',
                    style: TextStyle(
                      fontFamily: 'Montserrat',
                      fontSize: 36,
                      height: 1.12,
                      fontWeight: FontWeight.w700,
                      color: _taupe,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Container(
                    width: 40,
                    height: 2,
                    color: _gold.withValues(alpha: 0.95),
                  ),
                  const SizedBox(height: 20),
                  const _RitualGlassCard(),
                  const Spacer(),
                  AnimatedBuilder(
                    animation: _breathe,
                    builder: (context, child) {
                      final glow = 0.18 + _breathe.value * 0.32;
                      final scale = 1 + (_breathe.value * 0.014);
                      return Transform.scale(
                        scale: scale,
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(30),
                            boxShadow: [
                              BoxShadow(
                                color: _olive.withValues(alpha: glow),
                                blurRadius: 16 + _breathe.value * 12,
                                spreadRadius: 0.5,
                              ),
                            ],
                          ),
                          child: child,
                        ),
                      );
                    },
                    // Primary: Start My Journey → register
                    child: SizedBox(
                      height: 56,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _olive,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                        onPressed: () => context.go('/register'),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Start My Journey',
                              style: TextStyle(
                                fontFamily: 'Montserrat',
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: Colors.white.withValues(alpha: 0.96),
                              ),
                            ),
                            const SizedBox(width: 10),
                            const Icon(Icons.arrow_forward_rounded, size: 20),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Secondary: Log in → login
                  SizedBox(
                    height: 52,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: BorderSide(
                          color: Colors.white.withValues(alpha: 0.8),
                          width: 1.2,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        backgroundColor: Colors.white.withValues(alpha: 0.14),
                      ),
                      onPressed: () => context.go('/login'),
                      child: const Text(
                        'Log in',
                        style: TextStyle(
                          fontFamily: 'Montserrat',
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(4, (i) {
                      final active = i == 0;
                      return Container(
                        width: active ? 8 : 6,
                        height: active ? 8 : 6,
                        margin: const EdgeInsets.symmetric(horizontal: 3.5),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withValues(
                            alpha: active ? 0.95 : 0.32,
                          ),
                        ),
                      );
                    }),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _WelcomeBrand extends StatelessWidget {
  const _WelcomeBrand();

  static const _taupe = Color(0xFF4F463E);
  static const _gold = Color(0xFFC4A06E);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'luckdate',
              style: TextStyle(
                fontFamily: 'Montserrat',
                fontSize: 26,
                fontWeight: FontWeight.w500,
                letterSpacing: 0.6,
                color: _taupe,
                height: 1,
              ),
            ),
            const SizedBox(width: 8),
            const SuperSymbolMark(size: 28, color: _gold),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          'YOUR DAILY VITALITY COMPANION',
          style: TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 9,
            letterSpacing: 1.8,
            fontWeight: FontWeight.w600,
            color: _taupe.withValues(alpha: 0.72),
          ),
        ),
      ],
    );
  }
}

class _RitualGlassCard extends StatelessWidget {
  const _RitualGlassCard();

  static const _taupe = Color(0xFF4F463E);
  static const _gold = Color(0xFFC4A06E);

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 190),
        child: Container(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 18),
          decoration: BoxDecoration(
            color: const Color(0xE6F7F2EA),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.white.withValues(alpha: 0.65)),
            boxShadow: const [
              BoxShadow(
                color: Color(0x18000000),
                blurRadius: 18,
                offset: Offset(0, 8),
              ),
            ],
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SuperSymbolMark(size: 22, color: _gold),
              SizedBox(height: 12),
              _RitualCopy(),
            ],
          ),
        ),
      ),
    );
  }
}

class _RitualCopy extends StatelessWidget {
  const _RitualCopy();

  static const _taupe = Color(0xFF4F463E);
  static const _gold = Color(0xFFB8925C);

  @override
  Widget build(BuildContext context) {
    return Text.rich(
      TextSpan(
        style: TextStyle(
          fontFamily: 'Montserrat',
          fontSize: 13,
          height: 1.4,
          color: _taupe.withValues(alpha: 0.88),
          fontWeight: FontWeight.w500,
        ),
        children: [
          const TextSpan(text: 'Every Great Day\nStarts with '),
          TextSpan(
            text: 'One Small Ritual.',
            style: TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 14,
              height: 1.35,
              color: _gold,
              fontStyle: FontStyle.italic,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
