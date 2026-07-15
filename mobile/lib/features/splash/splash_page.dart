import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/widgets/sunny_sunflower.dart';
import 'splash_backdrop.dart';
import 'welcome_page.dart';

/// Launch flow on `/`:
/// 1) Splash image only (2s, not clickable)
/// 2) In-place guide UI (same route — avoids redirect races to /login)
class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  bool _showGuide = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      precacheImage(const AssetImage(kWelcomeImageAsset), context);
      _timer = Timer(const Duration(seconds: 2), () {
        if (!mounted) return;
        setState(() => _showGuide = true);
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Stay on `/` — only flip UI. Buttons navigate to /register or /login.
    if (_showGuide) {
      return const WelcomeGuideView();
    }
    return const Scaffold(
      backgroundColor: kSplashScaffoldColor,
      body: IgnorePointer(
        child: SplashBackdrop(assetPath: kWelcomeImageAsset),
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
