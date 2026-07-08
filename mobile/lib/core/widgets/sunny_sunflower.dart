import 'package:flutter/material.dart';
import '../../app/theme/luckdate_theme.dart';

/// Global brand symbol used across the app.
class SunnySunflower extends StatelessWidget {
  const SunnySunflower({
    super.key,
    this.size = 120,
    this.showStem = true,
    this.useImage = false,
  });

  final double size;
  final bool showStem;
  final bool useImage;

  @override
  Widget build(BuildContext context) {
    // Keep legacy props for call-site compatibility during migration.
    final _ = showStem || useImage;
    return Image.asset(
      'assets/images/super_symbol.png',
      width: size,
      height: size,
      fit: BoxFit.contain,
      errorBuilder: (_, __, ___) => _FallbackSymbol(size: size),
    );
  }
}

class _FallbackSymbol extends StatelessWidget {
  const _FallbackSymbol({required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: LuckdateColors.sunGold.withValues(alpha: 0.22),
        border: Border.all(
          color: LuckdateColors.sunGold.withValues(alpha: 0.5),
          width: 1,
        ),
      ),
      alignment: Alignment.center,
      child: Icon(
        Icons.auto_awesome_rounded,
        size: size * 0.45,
        color: LuckdateColors.chocolateBrown,
      ),
    );
  }
}
