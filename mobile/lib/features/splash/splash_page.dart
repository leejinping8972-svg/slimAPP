import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
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
    return LdScaffold(
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _goNext,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedBuilder(
                animation: _controller,
                builder: (context, child) {
                  return Transform.scale(
                    scale: 1.0 + _controller.value * 0.04,
                    child: Container(
                      padding: const EdgeInsets.all(LuckdateSpacing.lg),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: LuckdateColors.solarSand.withValues(
                          alpha: 0.18 + _controller.value * 0.1,
                        ),
                      ),
                      child: const SunnySunflower(size: 110, showStem: true),
                    ),
                  );
                },
              ),
              const SizedBox(height: LuckdateSpacing.xl),
              Text('luckdate', style: LuckdateTextStyles.display),
              const SizedBox(height: LuckdateSpacing.sm),
              Text(
                'Grow Toward the Light',
                style: LuckdateTextStyles.bodySmall,
              ),
              const SizedBox(height: LuckdateSpacing.sm),
              Text(
                'luckdate',
                style: LuckdateTextStyles.caption.copyWith(letterSpacing: 2),
              ),
              const SizedBox(height: LuckdateSpacing.xxl),
              Text(
                'Tap anywhere to continue',
                style: LuckdateTextStyles.caption,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
