import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../shared/providers/app_providers.dart';
import 'splash_backdrop.dart';
import 'welcome_video_backdrop.dart';

/// Guide UI (logo / copy / CTAs) used after splash on `/`, and at `/welcome`.
class WelcomeGuideView extends ConsumerStatefulWidget {
  const WelcomeGuideView({super.key});

  @override
  ConsumerState<WelcomeGuideView> createState() => _WelcomeGuideViewState();
}

/// Deep-link alias — same guide UI.
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
    return Scaffold(
      backgroundColor: kSplashScaffoldColor,
      body: Stack(
        fit: StackFit.expand,
        children: [
          const WelcomeVideoBackdrop(),
          // Soft vignette: keep center subject clear, darken only edges.
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x22000000),
                  Color(0x00000000),
                  Color(0x00000000),
                  Color(0x4D000000),
                ],
                stops: [0.0, 0.22, 0.55, 1.0],
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 14, 24, 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Compact top band — stays above the subject.
                  const _WelcomeBrand(),
                  const SizedBox(height: 12),
                  Text(
                    'Feel Alive.\nMeet luckdate.',
                    style: TextStyle(
                      fontFamily: 'Montserrat',
                      fontSize: 26,
                      height: 1.15,
                      fontWeight: FontWeight.w700,
                      color: _taupe,
                      letterSpacing: -0.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 28,
                    height: 1.5,
                    color: _gold.withValues(alpha: 0.95),
                  ),
                  // Open middle — leave the video subject unobstructed.
                  const Spacer(),
                  // Ritual card sits above CTAs, away from the figure.
                  const _RitualGlassCard(),
                  const SizedBox(height: 14),
                  _BreathingButton(
                    breath: _breathe,
                    child: SizedBox(
                      height: 50,
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
                                fontSize: 15,
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
                  const SizedBox(height: 10),
                  _BreathingButton(
                    breath: _breathe,
                    phase: 0.5,
                    glowColor: Colors.white,
                    child: SizedBox(
                      height: 46,
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.white,
                          side: BorderSide(
                            color: Colors.white.withValues(alpha: 0.85),
                            width: 1.2,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          backgroundColor: Colors.white.withValues(alpha: 0.14),
                        ),
                        onPressed: _goLogin,
                        child: const Text(
                          'Log in',
                          style: TextStyle(
                            fontFamily: 'Montserrat',
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(4, (i) {
                      final active = i == 0;
                      return Container(
                        width: active ? 7 : 5,
                        height: active ? 7 : 5,
                        margin: const EdgeInsets.symmetric(horizontal: 3),
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
        final glow = 0.22 + eased * 0.42;
        final scale = 1 + eased * 0.028;
        return Transform.scale(
          scale: scale,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: glowColor.withValues(alpha: glow),
                  blurRadius: 14 + eased * 18,
                  spreadRadius: 1 + eased * 2,
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
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const BrandAssetImage(kBrandLogoAsset, height: 24),
            const SizedBox(width: 6),
            const BrandAssetImage(kSuperSymbolAsset, height: 24, width: 24),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          'YOUR DAILY VITALITY COMPANION',
          style: TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 8,
            letterSpacing: 1.4,
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
    return Align(
      alignment: Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 220),
        child: Container(
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 11),
          decoration: BoxDecoration(
            color: const Color(0xD9F7F2EA),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.white.withValues(alpha: 0.55)),
            boxShadow: const [
              BoxShadow(
                color: Color(0x14000000),
                blurRadius: 12,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: const Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BrandAssetImage(kSuperSymbolAsset, height: 18, width: 18),
              SizedBox(width: 8),
              Expanded(child: _RitualCopy()),
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
          fontSize: 11,
          height: 1.35,
          color: _taupe.withValues(alpha: 0.88),
          fontWeight: FontWeight.w500,
        ),
        children: [
          const TextSpan(text: 'Every Great Day Starts with '),
          TextSpan(
            text: 'One Small Ritual.',
            style: TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 11.5,
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
