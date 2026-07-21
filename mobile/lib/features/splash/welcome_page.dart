import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../shared/providers/app_providers.dart';
import 'splash_backdrop.dart';

/// Launch guide — layout matched to brand mock (left copy, right subject clear).
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

  static const _olive = Color(0xFF5E6550);
  static const _gold = Color(0xFFC4A06E);
  /// Light brown for primary copy / CTAs (replaces white on this screen).
  static const _lightBrown = Color(0xFFD4B896);

  /// Lifestyle photo — keep subject on the right, clear wall on the left.
  static const _bgAlignment = Alignment(0.12, -0.04);

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
    final w = MediaQuery.sizeOf(context).width;
    final h = MediaQuery.sizeOf(context).height;
    // Left copy column — never wider than the clear wall zone.
    final copyWidth = (w * 0.52).clamp(188.0, 220.0);
    const cardWidth = 154.0;
    final topInset = (h * 0.085).clamp(48.0, 72.0);

    return Scaffold(
      backgroundColor: kSplashScaffoldColor,
      body: Stack(
        fit: StackFit.expand,
        children: [
          const SplashBackdrop(
            assetPath: kWelcomeImageAsset,
            alignment: _bgAlignment,
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(28, 12, 28, 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: topInset),
                  SizedBox(
                    width: copyWidth,
                    child: const _WelcomeBrand(),
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: copyWidth,
                    child: Text(
                      'Feel Alive.\nMeet luckdate.',
                      style: const TextStyle(
                        fontFamily: 'Montserrat',
                        fontSize: 29,
                        height: 1.1,
                        fontWeight: FontWeight.w700,
                        color: _lightBrown,
                        letterSpacing: -0.4,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    width: 38,
                    height: 1.5,
                    color: _gold,
                  ),
                  const SizedBox(height: 22),
                  SizedBox(
                    width: cardWidth,
                    child: const _RitualGlassCard(),
                  ),
                  const Spacer(),
                  _BreathingButton(
                    breath: _breathe,
                    child: SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _olive,
                          foregroundColor: _lightBrown,
                          elevation: 0,
                          shadowColor: Colors.transparent,
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                        ),
                        onPressed: _goRegister,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  'Start My Journey',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontFamily: 'Montserrat',
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: _lightBrown,
                                  ),
                                ),
                              ),
                              Icon(
                                Icons.arrow_forward_rounded,
                                size: 18,
                                color: _lightBrown,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  _BreathingButton(
                    breath: _breathe,
                    phase: 0.5,
                    glowColor: _lightBrown,
                    child: SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: _lightBrown,
                          side: BorderSide(
                            color: _lightBrown.withValues(alpha: 0.9),
                            width: 1.2,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                          backgroundColor: _lightBrown.withValues(alpha: 0.12),
                        ),
                        onPressed: _goLogin,
                        child: const Text(
                          'Log in',
                          style: TextStyle(
                            fontFamily: 'Montserrat',
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: _lightBrown,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
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
    this.glowColor = const Color(0xFF5E6550),
    this.phase = 0,
  });

  final Animation<double> breath;
  final Widget child;
  final Color glowColor;
  final double phase;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: breath,
      builder: (context, child) {
        final t = ((breath.value + phase) % 1.0);
        final eased = Curves.easeInOut.transform(t);
        final scale = 1 + eased * 0.015;
        return Transform.scale(scale: scale, child: child);
      },
      child: child,
    );
  }
}

class _WelcomeBrand extends StatelessWidget {
  const _WelcomeBrand();

  static const _taupe = Color(0xFF3A322C);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            BrandAssetImage(kBrandLogoAsset, height: 32),
            SizedBox(width: 10),
            BrandAssetImage(
              kSuperSymbolAsset,
              height: 46,
              width: 46,
              knockoutBackground: false,
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          'YOUR DAILY VITALITY COMPANION',
          style: TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 8.5,
            letterSpacing: 1.5,
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

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.82),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withValues(alpha: 0.72)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x12000000),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          BrandAssetImage(
            kSuperSymbolAsset,
            height: 28,
            width: 28,
            knockoutBackground: false,
          ),
          SizedBox(height: 10),
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
          fontFamily: 'Caveat',
          fontSize: 15,
          height: 1.28,
          color: _taupe.withValues(alpha: 0.9),
          fontWeight: FontWeight.w500,
        ),
        children: [
          const TextSpan(text: 'Every Great Day Starts with '),
          TextSpan(
            text: 'One Small Ritual.',
            style: TextStyle(
              fontFamily: 'Caveat',
              fontSize: 16,
              height: 1.28,
              color: _gold,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
