import 'package:flutter/material.dart';
import '../../core/widgets/sunny_sunflower.dart';

/// Shared background art for splash.
const kSplashImageAsset = 'assets/images/splash_screen.png';

/// Lifestyle background for welcome / guide page.
const kWelcomeImageAsset = 'assets/images/welcome_bg.png';

class SplashBackdrop extends StatelessWidget {
  const SplashBackdrop({
    super.key,
    this.assetPath = kSplashImageAsset,
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
            builder: (context, _) {
              final t = lightAnimation!.value;
              return IgnorePointer(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      center: Alignment(0.55 + t * 0.2, -0.15 + t * 0.25),
                      radius: 1.2,
                      colors: [
                        const Color(0x55FFE6B8),
                        const Color(0x18FFD88A),
                        Colors.transparent,
                      ],
                      stops: const [0.0, 0.4, 1.0],
                    ),
                  ),
                ),
              );
            },
          ),
        if (animated && liquidAnimation != null)
          AnimatedBuilder(
            animation: liquidAnimation!,
            builder: (context, _) {
              final t = liquidAnimation!.value;
              return Align(
                // Approx shaker bottle area on welcome lifestyle photo
                alignment: const Alignment(0.22, 0.05),
                child: IgnorePointer(
                  child: Opacity(
                    opacity: 0.12 + t * 0.08,
                    child: Container(
                      width: 42,
                      height: 72,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(22),
                        gradient: LinearGradient(
                          begin: Alignment(-0.3, -1 + t * 0.55),
                          end: Alignment(0.35, 1 - t * 0.45),
                          colors: const [
                            Color(0x66FFFFFF),
                            Color(0x28D4A853),
                            Color(0x33FFFFFF),
                            Color(0x188FA86E),
                          ],
                          stops: const [0.0, 0.35, 0.65, 1.0],
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
      ],
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

/// Soft cream scaffolding color (avoid dark flash if image is still loading).
const kSplashScaffoldColor = Color(0xFFEDE4D8);
