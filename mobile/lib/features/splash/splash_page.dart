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
  late final AnimationController _controller;
  bool _navigated = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Future<void>.delayed(const Duration(milliseconds: 1500), _goNext);
    });
  }

  void _goNext() {
    if (!mounted || _navigated) return;
    _navigated = true;
    GoRouter.of(context).go('/login');
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0E0E0E),
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _goNext,
        child: Container(
          decoration: const BoxDecoration(
            gradient: RadialGradient(
              center: Alignment(0, -0.15),
              radius: 1.1,
              colors: [Color(0xFF1A1A1A), Color(0xFF0C0C0C)],
            ),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: 1.0 + _controller.value * 0.03,
                      child: Container(
                        padding: const EdgeInsets.all(LuckdateSpacing.lg),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: LuckdateColors.sunGold.withValues(
                              alpha: 0.35,
                            ),
                            width: 1,
                          ),
                          color: Colors.white.withValues(alpha: 0.03),
                          boxShadow: [
                            BoxShadow(
                              color: LuckdateColors.sunGold.withValues(
                                alpha: 0.2,
                              ),
                              blurRadius: 30,
                              spreadRadius: 4,
                            ),
                          ],
                        ),
                        child: const SunnySunflower(size: 118, showStem: false),
                      ),
                    );
                  },
                ),
                const SizedBox(height: LuckdateSpacing.xl),
                Text(
                  'luckdate',
                  style: LuckdateTextStyles.display.copyWith(
                    color: LuckdateColors.ivoryWhite,
                    letterSpacing: 3,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                Text(
                  'Grow Toward the Light',
                  style: LuckdateTextStyles.bodySmall.copyWith(
                    color: LuckdateColors.sunGold.withValues(alpha: 0.9),
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: LuckdateSpacing.xxl),
                Text(
                  'Loading...',
                  style: LuckdateTextStyles.caption.copyWith(
                    color: LuckdateColors.ivoryWhite.withValues(alpha: 0.5),
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
