import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/super_symbol_mark.dart';
import 'splash_backdrop.dart';

/// Guide page: lifestyle photo + code-drawn logo / copy / super-symbol.
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
      precacheImage(const AssetImage(kWelcomeImageAsset), context);
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
            assetPath: kWelcomeImageAsset,
            animated: true,
            lightAnimation: _light,
            liquidAnimation: _liquid,
          ),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x14000000),
                  Color(0x00000000),
                  Color(0x55000000),
                ],
                stops: [0.0, 0.42, 1],
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const _WelcomeBrand(),
                  const SizedBox(height: 22),
                  Text(
                    'Feel Alive.\nMeet luckdate.',
                    style: LuckdateTextStyles.display.copyWith(
                      fontSize: 34,
                      height: 1.15,
                      color: LuckdateColors.deepSage,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    width: 36,
                    height: 2,
                    color: LuckdateColors.sunGold.withValues(alpha: 0.9),
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'luckdate',
              style: TextStyle(
                fontFamily: 'Montserrat',
                fontSize: 24,
                fontWeight: FontWeight.w500,
                letterSpacing: 1.4,
                color: LuckdateColors.deepSage,
                height: 1,
              ),
            ),
            const SizedBox(width: 8),
            const SuperSymbolMark(size: 26, color: LuckdateColors.deepSage),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          'YOUR DAILY VITALITY COMPANION',
          style: LuckdateTextStyles.caption.copyWith(
            letterSpacing: 1.6,
            fontSize: 9,
            color: LuckdateColors.chocolateBrown.withValues(alpha: 0.78),
            fontWeight: FontWeight.w600,
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
    return Align(
      alignment: Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 210),
        child: Container(
          padding: const EdgeInsets.fromLTRB(14, 14, 14, 16),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.48),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.6),
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x14000000),
                blurRadius: 16,
                offset: Offset(0, 6),
              ),
            ],
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SuperSymbolMark(size: 20, color: LuckdateColors.deepSage),
              SizedBox(height: 10),
              _RitualCopy(),
            ],
          ),
        ),
      ),
    );
  }
}

class _RitualCopy extends StatelessWidget {
  const _RitualCopy();

  @override
  Widget build(BuildContext context) {
    return Text.rich(
      TextSpan(
        style: LuckdateTextStyles.bodySmall.copyWith(
          color: LuckdateColors.chocolateBrown,
          height: 1.4,
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
    );
  }
}
