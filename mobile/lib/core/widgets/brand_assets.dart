import 'package:flutter/material.dart';

/// Lifestyle / brand image assets.
const kSplashImageAsset = 'assets/images/welcome_bg.png';
const kWelcomeImageAsset = 'assets/images/welcome_bg.png';
const kWelcomeVideoAsset = 'assets/videos/welcome_bg.mp4';
/// Public URL path under `web/` (and build output root) for mobile browsers.
const kWelcomeVideoPublicPath = 'welcome_bg.mp4';
const kBrandLogoAsset = 'assets/images/logo.png';
const kSuperSymbolAsset = 'assets/images/super_symbol_gold.png';

/// Soft cream scaffolding color (avoid dark flash if image is still loading).
const kSplashScaffoldColor = Color(0xFFEDE4D8);

/// Makes black backgrounds transparent so gold/taupe PNG art composites cleanly.
class BrandAssetImage extends StatelessWidget {
  const BrandAssetImage(
    this.asset, {
    super.key,
    this.height,
    this.width,
    this.knockoutBackground = true,
  });

  final String asset;
  final double? height;
  final double? width;
  /// When false, render the PNG as-is (better for gold super-symbol art).
  final bool knockoutBackground;

  /// Alpha from luminance — black → transparent, gold/taupe kept.
  static const knockoutBlack = ColorFilter.matrix(<double>[
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0.35, 0.45, 0.20, 0, 0,
  ]);

  @override
  Widget build(BuildContext context) {
    final image = Image.asset(
      asset,
      height: height,
      width: width,
      fit: BoxFit.contain,
      filterQuality: FilterQuality.high,
      errorBuilder: (_, __, ___) => SizedBox(
        height: height,
        width: width,
        child: const Icon(Icons.spa_outlined, color: Color(0xFFC4A06E)),
      ),
    );
    if (!knockoutBackground) return image;
    return ColorFiltered(colorFilter: knockoutBlack, child: image);
  }
}
