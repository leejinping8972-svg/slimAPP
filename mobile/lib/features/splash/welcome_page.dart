import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../shared/providers/app_providers.dart';
import 'splash_backdrop.dart';

/// Guide UI after splash — static lifestyle background, left-safe copy layout.
class WelcomeGuideView extends ConsumerStatefulWidget {
  const WelcomeGuideView({super.key});

  @override
  ConsumerState<WelcomeGuideView> createState() => _WelcomeGuideViewState();
}

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});

  @override
  Widget build(BuildContext context) => const WelcomeGuideView();
}

class _WelcomeGuideViewState extends ConsumerState<WelcomeGuideView>
    with SingleTickerProviderStateMixin {
  late final AnimationController _breathe;

  static const _taupe = Color(0xFF4F463E);
  static const _olive = Color(0xFF5E6550);
  static const _gold = Color(0xFFC4A06E);

  @override
  void initState() {
    super.initState();
    _breathe = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      precacheImage(const AssetImage(kWelcomeImageAsset), context);
      precacheImage(const AssetImage(kBrandLogoAsset), context);
      precacheImage(const AssetImage(kSuperSymbolAsset), context);
    });
  }

  @override
  void dispose() {
    _breathe.dispose();
    super.dispose();
  }

  void _goRegister() {
    ref.read(appStateProvider.notifier).markLaunchGuideSeen();
    context.go('/sunny/intro');
  }

  void _goLogin() {
    ref.read(appStateProvider.notifier).markLaunchGuideSeen();
    context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final h = size.height;
    // Keep copy in the left clear zone so the subject stays unobstructed.
    final copyMaxWidth = (size.width * 0.58).clamp(200.0, 260.0);

    return Scaffold(
      backgroundColor: kSplashScaffoldColor,
      body: Stack(
        fit: StackFit.expand,
        children: [
          const SplashBackdrop(assetPath: kWelcomeImageAsset),
          // Light top/bottom veil only — avoid darkening the figure.
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x18000000),
                  Color(0x00000000),
                  Color(0x00000000),
                  Color(0x38000000),
                ],
                stops: [0.0, 0.16, 0.62, 1.0],
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    width: copyMaxWidth,
                    child: const _WelcomeBrand(),
                  ),
                  SizedBox(height: h * 0.022),
                  SizedBox(
                    width: copyMaxWidth,
                    child: Text(
                      'Feel Alive.\nMeet luckdate.',
                      style: TextStyle(
                        fontFamily: 'Montserrat',
                        fontSize: 28,
                        height: 1.12,
                        fontWeight: FontWeight.w700,
                        color: _taupe,
                        letterSpacing: -0.3,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    width: 36,
                    height: 1.5,
                    color: _gold.withValues(alpha: 0.95),
                  ),
                  SizedBox(height: h * 0.036),
                  SizedBox(
                    width: copyMaxWidth,
                    child: const _RitualGlassCard(),
                  ),
                  const Spacer(),
                  _BreathingButton(
                    breath: _breathe,
                    child: SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _olive,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shadowColor: Colors.transparent,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                        onPressed: _goRegister,
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
                            const SizedBox(width: 8),
                            const Icon(Icons.arrow_forward_rounded, size: 18),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(4, (i) {
                      final active = i == 0;
                      return Container(
                        width: active ? 7 : 5,
                        height: active ? 7 : 5,
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
                  TextButton(
                    onPressed: _goLogin,
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white.withValues(alpha: 0.88),
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      minimumSize: const Size(0, 32),
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: const Center(
                      child: Text(
                        'Log in',
                        style: TextStyle(
                          fontFamily: 'Montserrat',
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          decoration: TextDecoration.underline,
                          decorationColor: Colors.white70,
                        ),
                      ),
                    ),
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

class _BreathingButton extends StatelessWidget {
  const _BreathingButton({
    required this.breath,
    required this.child,
  });

  final Animation<double> breath;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: breath,
      builder: (context, child) {
        final eased = Curves.easeInOut.transform(breath.value);
        final glow = 0.18 + eased * 0.36;
        final scale = 1 + eased * 0.02;
        return Transform.scale(
          scale: scale,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF5E6550).withValues(alpha: glow),
                  blurRadius: 12 + eased * 14,
                  spreadRadius: 0.5 + eased * 1.5,
                ),
              ],
            ),
            child: child,
          ),
        );
      },
      child: child,
    );
  }
}

class _WelcomeBrand extends StatelessWidget {
  const _WelcomeBrand();

  static const _taupe = Color(0xFF4F463E);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            BrandAssetImage(kBrandLogoAsset, height: 26),
            SizedBox(width: 8),
            BrandAssetImage(kSuperSymbolAsset, height: 26, width: 26),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          'YOUR DAILY VITALITY COMPANION',
          style: TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 9,
            letterSpacing: 1.6,
            fontWeight: FontWeight.w600,
            color: _taupe.withValues(alpha: 0.7),
          ),
        ),
      ],
    );
  }
}

class _RitualGlassCard extends StatelessWidget {
  const _RitualGlassCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 18),
      decoration: BoxDecoration(
        color: const Color(0xE6F7F2EA),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.6)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x18000000),
            blurRadius: 16,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          BrandAssetImage(kSuperSymbolAsset, height: 28, width: 28),
          SizedBox(height: 12),
          _RitualCopy(),
        ],
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
          color: _taupe.withValues(alpha: 0.9),
          fontWeight: FontWeight.w500,
        ),
        children: [
          const TextSpan(text: 'Every Great Day Starts with\n'),
          TextSpan(
            text: 'One Small Ritual.',
            style: TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 14,
              height: 1.4,
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
