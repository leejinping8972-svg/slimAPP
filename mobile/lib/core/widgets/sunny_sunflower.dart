import 'package:flutter/material.dart';
import 'brand_assets.dart';

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
    return BrandAssetImage(
      kSuperSymbolAsset,
      width: size,
      height: size,
    );
  }
}
