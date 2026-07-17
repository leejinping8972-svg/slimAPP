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

  static const _taupe = Color(0xFF4F463E);
  static const _olive = Color(0xFF5E6550);
  static const _gold = Color(0xFFC4A06E);

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

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    // Left copy column — never wider than the clear wall zone.
    final copyWidth = (w * 0.52).clamp(188.0, 220.0);
    const cardWidth = 154.0;

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
                  SizedBox(
                    width: copyWidth,
                    child: const _WelcomeBrand(),
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: copyWidth,
                    child: Text(
                      'Feel Alive.\nMeet luckdate.',
                      style: TextStyle(
                        fontFamily: 'Montserrat',
                        fontSize: 29,
                        height: 1.1,
                        fontWeight: FontWeight.w700,
                        color: _taupe,
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
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shadowColor: Colors.transparent,
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                        ),
                        onPressed: _goRegister,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Text(
                              'Start My Journey',
                              style: TextStyle(
                                fontFamily: 'Montserrat',
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: Colors.white.withValues(alpha: 0.98),
                              ),
                            ),
                            Positioned(
                              right: 0,
                              child: Icon(
                                Icons.arrow_forward_rounded,
                                size: 18,
                                color: Colors.white.withValues(alpha: 0.95),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  const _PageDots(),
                  const SizedBox(height: 6),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PageDots extends StatelessWidget {
  const _PageDots();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(4, (i) {
        final active = i == 0;
        return Container(
          width: active ? 7 : 5,
          height: active ? 7 : 5,
          margin: const EdgeInsets.symmetric(horizontal: 3.5),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white.withValues(alpha: active ? 0.95 : 0.32),
          ),
        );
      }),
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
        final scale = 1 + eased * 0.015;
        return Transform.scale(scale: scale, child: child);
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
            BrandAssetImage(kBrandLogoAsset, height: 24),
            SizedBox(width: 6),
            BrandAssetImage(kSuperSymbolAsset, height: 24, width: 24),
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
            color: _taupe.withValues(alpha: 0.68),
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
          BrandAssetImage(kSuperSymbolAsset, height: 22, width: 22),
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
          fontFamily: 'Montserrat',
          fontSize: 11,
          height: 1.38,
          color: _taupe.withValues(alpha: 0.88),
          fontWeight: FontWeight.w500,
        ),
        children: [
          const TextSpan(text: 'Every Great Day Starts with '),
          TextSpan(
            text: 'One Small Ritual.',
            style: TextStyle(
              fontFamily: 'Montserrat',
              fontStyle: FontStyle.italic,
              fontSize: 12,
              height: 1.38,
              color: _gold,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
