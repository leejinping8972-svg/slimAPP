import 'package:flutter/material.dart';
import '../../core/widgets/sunny_sunflower.dart';

/// Shared background art for splash + welcome (same asset).
const kSplashImageAsset = 'assets/images/splash_screen.png';

class SplashBackdrop extends StatelessWidget {
  const SplashBackdrop({
    super.key,
    this.animated = false,
    this.lightAnimation,
    this.liquidAnimation,
  });

  final bool animated;
  final Animation<double>? lightAnimation;
  final Animation<double>? liquidAnimation;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(
          kSplashImageAsset,
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
                      center: Alignment(-0.2 + t * 0.55, -0.85 + t * 0.2),
                      radius: 1.15,
                      colors: [
                        const Color(0x66FFE6B8),
                        const Color(0x22FFD88A),
                        Colors.transparent,
                      ],
                      stops: const [0.0, 0.35, 1.0],
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
                alignment: const Alignment(0.08, 0.22),
                child: IgnorePointer(
                  child: Opacity(
                    opacity: 0.14 + t * 0.08,
                    child: Container(
                      width: 56,
                      height: 90,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(28),
                        gradient: LinearGradient(
                          begin: Alignment(-0.4, -1 + t * 0.6),
                          end: Alignment(0.4, 1 - t * 0.5),
                          colors: const [
                            Color(0x55FFFFFF),
                            Color(0x22D4A853),
                            Color(0x33FFFFFF),
                            Color(0x18A7B09A),
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
