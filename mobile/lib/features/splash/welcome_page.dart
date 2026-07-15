import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import 'splash_backdrop.dart';

/// Onboarding guide after splash — same art, soft motion + CTAs.
class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage>
    with TickerProviderStateMixin {
  late final AnimationController _light;
  late final AnimationController _liquid;
  late final AnimationController _breathe;

  @override
  void initState() {
    super.initState();
    _light = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat(reverse: true);
    _liquid = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3800),
    )..repeat(reverse: true);
    _breathe = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat(reverse: true);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      precacheImage(const AssetImage(kSplashImageAsset), context);
    });
  }

  @override
  void dispose() {
    _light.dispose();
    _liquid.dispose();
    _breathe.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kSplashScaffoldColor,
      body: Stack(
        fit: StackFit.expand,
        children: [
          SplashBackdrop(
            animated: true,
            lightAnimation: _light,
            liquidAnimation: _liquid,
          ),
          // Soft bottom readabilty for CTAs
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x00000000),
                  Color(0x22000000),
                  Color(0x66000000),
                ],
                stops: [0.45, 0.72, 1],
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 12, 24, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const _WelcomeBrand(),
                  const SizedBox(height: 18),
                  Text(
                    'Feel Alive.\nMeet luckdate.',
                    style: LuckdateTextStyles.display.copyWith(
                      fontSize: 34,
                      height: 1.15,
                      color: LuckdateColors.deepSage,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    width: 36,
                    height: 2,
                    color: LuckdateColors.sunGold.withValues(alpha: 0.85),
                  ),
                  const SizedBox(height: 16),
                  const _RitualGlassCard(),
                  const Spacer(),
                  AnimatedBuilder(
                    animation: _breathe,
                    builder: (context, child) {
                      final glow = 0.22 + _breathe.value * 0.28;
                      final scale = 1 + (_breathe.value * 0.012);
                      return Transform.scale(
                        scale: scale,
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(28),
                            boxShadow: [
                              BoxShadow(
                                color: LuckdateColors.deepSage
                                    .withValues(alpha: glow),
                                blurRadius: 18 + _breathe.value * 10,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                          child: child,
                        ),
                      );
                    },
                    child: SizedBox(
                      height: 54,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: LuckdateColors.deepSage,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        onPressed: () => context.go('/register'),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Start My Journey',
                              style: LuckdateTextStyles.title.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.arrow_forward_rounded, size: 20),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 50,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: BorderSide(
                          color: Colors.white.withValues(alpha: 0.75),
                          width: 1.2,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                        backgroundColor: Colors.white.withValues(alpha: 0.12),
                      ),
                      onPressed: () => context.go('/login'),
                      child: Text(
                        'Log in',
                        style: LuckdateTextStyles.title.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(4, (i) {
                      final active = i == 0;
                      return Container(
                        width: active ? 8 : 6,
                        height: active ? 8 : 6,
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withValues(
                            alpha: active ? 0.95 : 0.35,
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

class _WelcomeBrand extends StatelessWidget {
  const _WelcomeBrand();

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'luckdate',
              style: TextStyle(
                fontFamily: 'Montserrat',
                fontSize: 22,
                fontWeight: FontWeight.w500,
                letterSpacing: 1.2,
                color: LuckdateColors.deepSage,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'YOUR DAILY VITALITY COMPANION',
              style: LuckdateTextStyles.caption.copyWith(
                letterSpacing: 1.4,
                fontSize: 9,
                color: LuckdateColors.chocolateBrown.withValues(alpha: 0.75),
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(width: 8),
        Icon(
          Icons.wb_sunny_outlined,
          size: 22,
          color: LuckdateColors.sunGold.withValues(alpha: 0.9),
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
        constraints: const BoxConstraints(maxWidth: 200),
        child: Container(
          padding: const EdgeInsets.fromLTRB(14, 14, 14, 16),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.42),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.55),
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x14000000),
                blurRadius: 16,
                offset: Offset(0, 6),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(
                Icons.eco_outlined,
                size: 18,
                color: LuckdateColors.deepSage.withValues(alpha: 0.85),
              ),
              const SizedBox(height: 8),
              Text.rich(
                TextSpan(
                  style: LuckdateTextStyles.bodySmall.copyWith(
                    color: LuckdateColors.chocolateBrown,
                    height: 1.35,
                  ),
                  children: [
                    const TextSpan(text: 'Every Great Day Starts with '),
                    TextSpan(
                      text: 'One Small Ritual.',
                      style: LuckdateTextStyles.bodySmall.copyWith(
                        color: LuckdateColors.sunGold,
                        fontStyle: FontStyle.italic,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
