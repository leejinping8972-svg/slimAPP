import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/sunny_sunflower.dart';
import 'splash_backdrop.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage>
    with SingleTickerProviderStateMixin {
  bool _navigated = false;
  Timer? _timer;
  late final AnimationController _pulse;

  @override
  void initState() {
    super.initState();
    _pulse = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    )..repeat(reverse: true);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      precacheImage(const AssetImage(kWelcomeImageAsset), context);
      _timer = Timer(const Duration(seconds: 2), _goNext);
    });
  }

  void _goNext() {
    if (!mounted || _navigated) return;
    _navigated = true;
    GoRouter.of(context).go('/welcome');
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kSplashScaffoldColor,
      body: IgnorePointer(
        child: Stack(
          fit: StackFit.expand,
          children: [
            const SplashBackdrop(assetPath: kWelcomeImageAsset),
            Align(
              alignment: Alignment.bottomCenter,
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 48),
                  child: FadeTransition(
                    opacity: Tween<double>(begin: 0.45, end: 1).animate(
                      CurvedAnimation(parent: _pulse, curve: Curves.easeInOut),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: 28,
                          height: 28,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.4,
                            color: LuckdateColors.deepSage.withValues(alpha: 0.9),
                            backgroundColor:
                                Colors.white.withValues(alpha: 0.35),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          'Loading…',
                          style: LuckdateTextStyles.caption.copyWith(
                            color: LuckdateColors.chocolateBrown
                                .withValues(alpha: 0.85),
                            letterSpacing: 1.2,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Shared super-symbol presentation for splash & auth hero areas.
class SymbolHero extends StatelessWidget {
  const SymbolHero({super.key, this.size = 120, this.showRing = true});

  final double size;
  final bool showRing;

  @override
  Widget build(BuildContext context) =>
      _SymbolHero(size: size, showRing: showRing);
}

class _SymbolHero extends StatelessWidget {
  const _SymbolHero({required this.size, this.showRing = true});

  final double size;
  final bool showRing;

  @override
  Widget build(BuildContext context) {
    final ringSize = size + 40;
    return SizedBox(
      width: ringSize,
      height: ringSize,
      child: Stack(
        alignment: Alignment.center,
        children: [
          if (showRing) ...[
            Container(
              width: ringSize,
              height: ringSize,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: const Color(0xFFF5C542).withValues(alpha: 0.25),
                  width: 1,
                ),
              ),
            ),
            Container(
              width: ringSize - 16,
              height: ringSize - 16,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFFF5C542).withValues(alpha: 0.06),
              ),
            ),
          ],
          SunnySunflower(size: size, showStem: false),
        ],
      ),
    );
  }
}
