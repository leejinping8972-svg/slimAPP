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
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Future<void>.delayed(const Duration(milliseconds: 1800), _goNext);
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
      backgroundColor: LuckdateColors.cloudIvory,
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _goNext,
        child: Container(
          width: double.infinity,
          height: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                LuckdateColors.ivoryWhite,
                LuckdateColors.cloudIvory,
                LuckdateColors.solarSand.withValues(alpha: 0.12),
              ],
            ),
          ),
          child: SafeArea(
            child: Column(
              children: [
                const Spacer(flex: 2),
                AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: 1.0 + _controller.value * 0.02,
                      child: child,
                    );
                  },
                  child: _SymbolHero(size: 140),
                ),
                const SizedBox(height: LuckdateSpacing.xxl),
                Text(
                  'luckdate',
                  style: TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.w300,
                    letterSpacing: 6,
                    color: LuckdateColors.chocolateBrown,
                  ),
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                Text(
                  'The House of Vitality',
                  style: LuckdateTextStyles.caption.copyWith(
                    letterSpacing: 1.5,
                    color: LuckdateColors.textSecondary,
                  ),
                ),
                const SizedBox(height: LuckdateSpacing.lg),
                Container(
                  width: 48,
                  height: 1,
                  color: LuckdateColors.sunGold.withValues(alpha: 0.6),
                ),
                const SizedBox(height: LuckdateSpacing.lg),
                Text(
                  'Grow Toward the Light',
                  style: LuckdateTextStyles.bodySmall.copyWith(
                    color: LuckdateColors.chocolateBrown.withValues(
                      alpha: 0.75,
                    ),
                    letterSpacing: 0.6,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const Spacer(flex: 2),
                Text(
                  'Loading...',
                  style: LuckdateTextStyles.caption.copyWith(
                    color: LuckdateColors.textSecondary.withValues(alpha: 0.5),
                  ),
                ),
                const SizedBox(height: LuckdateSpacing.xxl),
              ],
            ),
          ),
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
                  color: LuckdateColors.sunGold.withValues(alpha: 0.25),
                  width: 1,
                ),
              ),
            ),
            Container(
              width: ringSize - 16,
              height: ringSize - 16,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: LuckdateColors.sunGold.withValues(alpha: 0.06),
              ),
            ),
          ],
          SunnySunflower(size: size, showStem: false),
        ],
      ),
    );
  }
}
