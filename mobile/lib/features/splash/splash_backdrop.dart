import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/widgets/sunny_sunflower.dart';

/// Lifestyle background shared by HTML shell, Flutter splash, and welcome.
const kSplashImageAsset = 'assets/images/welcome_bg.png';
const kWelcomeImageAsset = 'assets/images/welcome_bg.png';
const kBrandLogoAsset = 'assets/images/logo.png';
const kSuperSymbolAsset = 'assets/images/super_symbol_gold.png';

/// Soft cream scaffolding color (avoid dark flash if image is still loading).
const kSplashScaffoldColor = Color(0xFFEDE4D8);

/// Makes black backgrounds transparent so gold/taupe PNG art composites cleanly.
class BrandAssetImage extends StatelessWidget {
  const BrandAssetImage(
    this.asset, {
    super.key,
    this.height,
    this.width,
  });

  final String asset;
  final double? height;
  final double? width;

  /// Alpha from luminance — black → transparent, gold/taupe kept.
  static const _knockoutBlack = ColorFilter.matrix(<double>[
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0.35, 0.45, 0.20, 0, 0,
  ]);

  @override
  Widget build(BuildContext context) {
    return ColorFiltered(
      colorFilter: _knockoutBlack,
      child: Image.asset(
        asset,
        height: height,
        width: width,
        fit: BoxFit.contain,
        filterQuality: FilterQuality.high,
        errorBuilder: (_, __, ___) => SizedBox(
          height: height,
          width: width,
          child: const Icon(Icons.spa_outlined, color: Color(0xFFC4A06E)),
        ),
      ),
    );
  }
}

class SplashBackdrop extends StatelessWidget {
  const SplashBackdrop({
    super.key,
    this.assetPath = kWelcomeImageAsset,
    this.animated = false,
    this.lightAnimation,
    this.liquidAnimation,
  });

  final String assetPath;
  final bool animated;
  final Animation<double>? lightAnimation;
  final Animation<double>? liquidAnimation;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(
          assetPath,
          fit: BoxFit.cover,
          alignment: Alignment.center,
          gaplessPlayback: true,
          filterQuality: FilterQuality.medium,
          errorBuilder: (_, __, ___) => const _WarmFallback(),
        ),
        if (animated && lightAnimation != null)
          AnimatedBuilder(
            animation: lightAnimation!,
            builder: (context, _) => _MorningLightOverlay(t: lightAnimation!.value),
          ),
        if (animated && liquidAnimation != null)
          AnimatedBuilder(
            animation: liquidAnimation!,
            builder: (context, _) =>
                _BottleLiquidOverlay(t: liquidAnimation!.value),
          ),
      ],
    );
  }
}

/// Slow drifting morning light from the archway (right side).
class _MorningLightOverlay extends StatelessWidget {
  const _MorningLightOverlay({required this.t});

  final double t;

  @override
  Widget build(BuildContext context) {
    final drift = Curves.easeInOut.transform(t);
    return IgnorePointer(
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Soft sunlight bloom drifting across the wall.
          Transform.translate(
            offset: Offset(-18 + drift * 36, -10 + drift * 22),
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment(0.72 - drift * 0.18, -0.05 + drift * 0.22),
                  radius: 1.05 + drift * 0.15,
                  colors: [
                    Color.fromRGBO(255, 232, 180, 0.48 + drift * 0.16),
                    Color.fromRGBO(255, 214, 140, 0.22 + drift * 0.10),
                    Colors.transparent,
                  ],
                  stops: const [0.0, 0.38, 1.0],
                ),
              ),
            ),
          ),
          // Soft wall shadow drift (counter to the bloom).
          Transform.translate(
            offset: Offset(12 - drift * 28, 8 + drift * 10),
            child: Opacity(
              opacity: 0.10 + drift * 0.08,
              child: const DecoratedBox(
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    center: Alignment(-0.35, 0.15),
                    radius: 0.95,
                    colors: [
                      Color(0x552A2218),
                      Color(0x00000000),
                    ],
                  ),
                ),
              ),
            ),
          ),
          // Light shaft through arch.
          Opacity(
            opacity: 0.28 + drift * 0.22,
            child: Transform.rotate(
              angle: -0.35 + drift * 0.14,
              alignment: const Alignment(0.85, -0.1),
              child: Align(
                alignment: Alignment(0.9 - drift * 0.14, 0.05),
                child: Container(
                  width: 130,
                  height: 560,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color.fromRGBO(255, 244, 210, 0.62),
                        Color.fromRGBO(255, 220, 150, 0.16),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Extremely subtle shimmer over the shaker bottle liquid.
class _BottleLiquidOverlay extends StatelessWidget {
  const _BottleLiquidOverlay({required this.t});

  final double t;

  @override
  Widget build(BuildContext context) {
    final wave = math.sin(t * math.pi * 2);
    return Align(
      // Tuned for portrait lifestyle shot — bottle in woman't right hand.
      alignment: const Alignment(0.28, 0.02),
      child: IgnorePointer(
        child: SizedBox(
          width: 46,
          height: 78,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Opacity(
                  opacity: 0.16 + wave.abs() * 0.08,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment(-0.6, -0.9 + t),
                        end: Alignment(0.7, 0.8 - t * 0.7),
                        colors: const [
                          Color(0x88FFFFFF),
                          Color(0x33F5E6C8),
                          Color(0x00FFFFFF),
                          Color(0x44E8D5A8),
                          Color(0x33FFFFFF),
                        ],
                        stops: const [0.0, 0.28, 0.45, 0.7, 1.0],
                      ),
                    ),
                  ),
                ),
                // Tiny horizontal “surface” shimmer.
                Positioned(
                  left: 8,
                  right: 8,
                  top: 28 + wave * 3.5,
                  child: Opacity(
                    opacity: 0.22,
                    child: Container(
                      height: 2.5,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(2),
                        color: Colors.white.withValues(alpha: 0.55),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _WarmFallback extends StatelessWidget {
  const _WarmFallback();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFF5EBE0), Color(0xFFE8DFD4), Color(0xFFD4C4B0)],
        ),
      ),
      child: const Center(child: SunnySunflower(size: 72, showStem: false)),
    );
  }
}
