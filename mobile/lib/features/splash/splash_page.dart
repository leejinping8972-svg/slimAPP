import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/sunny_sunflower.dart';

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
      _timer = Timer(const Duration(seconds: 2), _goNext);
    });
  }

  void _goNext() {
    if (!mounted || _navigated) return;
    _navigated = true;
    GoRouter.of(context).go('/register');
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
      backgroundColor: const Color(0xFF3D3428),
      body: AbsorbPointer(
        absorbing: true,
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(
              'assets/images/splash_screen.png',
              fit: BoxFit.cover,
              alignment: Alignment.center,
              gaplessPlayback: true,
              errorBuilder: (_, __, ___) => const _SplashFallback(),
            ),
            const DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0x33000000),
                    Color(0x00000000),
                    Color(0x99000000),
                  ],
                  stops: [0, 0.4, 1],
                ),
              ),
            ),
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
                            color: LuckdateColors.sunGold.withValues(alpha: 0.95),
                            backgroundColor:
                                Colors.white.withValues(alpha: 0.18),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          'Loading…',
                          style: LuckdateTextStyles.caption.copyWith(
                            color: Colors.white.withValues(alpha: 0.85),
                            letterSpacing: 1.2,
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

class _SplashFallback extends StatelessWidget {
  const _SplashFallback();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF5C5042), Color(0xFF3D3428), Color(0xFF2A2418)],
        ),
      ),
      child: SafeArea(
        child: Column(
          children: [
            const Spacer(flex: 3),
            const SunnySunflower(size: 72, showStem: false),
            const SizedBox(height: LuckdateSpacing.xxl),
            Text(
              'Feel Alive.',
              style: LuckdateTextStyles.display.copyWith(
                color: LuckdateColors.ivoryWhite,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              'Meet luckdate.',
              style: LuckdateTextStyles.h1.copyWith(
                color: LuckdateColors.ivoryWhite,
                fontWeight: FontWeight.w400,
              ),
              textAlign: TextAlign.center,
            ),
            const Spacer(flex: 2),
            Text(
              'luckdate',
              style: LuckdateTextStyles.brand.copyWith(
                color: LuckdateColors.sunGold,
                letterSpacing: 5,
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
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
