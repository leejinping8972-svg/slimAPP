import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

class ProductDetailPage extends ConsumerStatefulWidget {
  const ProductDetailPage({super.key, required this.productId});

  final String productId;

  @override
  ConsumerState<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends ConsumerState<ProductDetailPage> {
  int _specIndex = 0;
  bool _favorited = false;
  int _cartCount = 2;
  int _heroPage = 0;

  static const _specs = [
    ('28 sticks', 56.0),
    ('56 sticks', 98.0),
    ('Trial 7 sticks', 16.0),
  ];

  static const _ingredients = [
    ('Whey Protein', 'Complete amino profile'),
    ('Soy Protein', 'Plant-based support'),
    ('Chia Seeds', 'Omega-3 & fiber'),
    ('Dietary Fiber', 'Digestive comfort'),
    ('Multi-vitamins', 'Daily micronutrients'),
  ];

  static const _services = [
    (Icons.verified_outlined, 'Authentic'),
    (Icons.public_outlined, 'Global Ship'),
    (Icons.replay_outlined, '7-Day Return'),
    (Icons.lock_outline, 'Secure Pay'),
  ];

  double get _price => _specs[_specIndex].$2;

  @override
  Widget build(BuildContext context) {
    final productsAsync = ref.watch(productsProvider);
    final profile = ref.watch(appStateProvider).profile;

    return productsAsync.when(
      loading: () => const Scaffold(
        body: Center(child: StatePlaceholder(type: 'loading')),
      ),
      error: (_, __) => const Scaffold(
        body: Center(child: StatePlaceholder(type: 'error')),
      ),
      data: (products) {
        final product = products.firstWhere(
          (p) => p.id == widget.productId,
          orElse: () => products.first,
        );
        final color = Color(
          int.parse(product.colorHex.replaceFirst('#', '0xFF')),
        );
        final isSolarProtein = product.id == 'solar_protein';
        final showPurchaseFlow = profile.userPlanType == UserPlanType.noProduct &&
            !profile.isAwaitingReceipt &&
            isSolarProtein;
        final showReceiptFlow =
            profile.isAwaitingReceipt && isSolarProtein;

        return Scaffold(
          backgroundColor: LuckdateColors.cloudIvory,
          body: SafeArea(
            bottom: false,
            child: Column(
              children: [
                _DetailHeader(
                  cartCount: _cartCount,
                  onBack: () {
                    if (context.canPop()) {
                      context.pop();
                    } else {
                      context.go('/mall');
                    }
                  },
                ),
                Expanded(
                  child: ListView(
                    padding: EdgeInsets.zero,
                    children: [
                      _HeroBanner(
                        product: product,
                        color: color,
                        page: _heroPage,
                        onPage: (i) => setState(() => _heroPage = i),
                      ),
                      Transform.translate(
                        offset: const Offset(0, -18),
                        child: Container(
                          decoration: const BoxDecoration(
                            color: LuckdateColors.cloudIvory,
                            borderRadius: BorderRadius.vertical(
                              top: Radius.circular(24),
                            ),
                          ),
                          padding: const EdgeInsets.fromLTRB(
                            LuckdateSpacing.lg,
                            LuckdateSpacing.lg,
                            LuckdateSpacing.lg,
                            LuckdateSpacing.xl,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _PriceRow(
                                price: _price,
                                favorited: _favorited,
                                onFavorite: () =>
                                    setState(() => _favorited = !_favorited),
                              ),
                              const SizedBox(height: LuckdateSpacing.md),
                              Text(
                                '${product.name} · ${_specs[_specIndex].$1}',
                                style: LuckdateTextStyles.h2.copyWith(
                                  fontSize: 18,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                product.shortDescription.isNotEmpty
                                    ? product.shortDescription
                                    : 'High protein · High satiety · Balanced nutrition',
                                style: LuckdateTextStyles.caption,
                              ),
                              const SizedBox(height: LuckdateSpacing.xl),
                              Text(
                                'Select SKU',
                                style: LuckdateTextStyles.title,
                              ),
                              const SizedBox(height: LuckdateSpacing.sm),
                              _SpecSelector(
                                specs: _specs,
                                selected: _specIndex,
                                onSelect: (i) =>
                                    setState(() => _specIndex = i),
                              ),
                              const SizedBox(height: LuckdateSpacing.lg),
                              const _ServiceBar(items: _services),
                              const SizedBox(height: LuckdateSpacing.xl),
                              Text(
                                'Product Details',
                                style: LuckdateTextStyles.title,
                              ),
                              const SizedBox(height: LuckdateSpacing.sm),
                              Text(
                                product.benefits.isNotEmpty
                                    ? product.benefits
                                    : 'Crafted for gentle satiety and daily vitality. Blend with water or milk for a smooth shake anytime.',
                                style: LuckdateTextStyles.bodySmall,
                              ),
                              const SizedBox(height: LuckdateSpacing.md),
                              _DetailVisual(color: color),
                              if (product.usage.isNotEmpty) ...[
                                const SizedBox(height: LuckdateSpacing.lg),
                                Text('Usage', style: LuckdateTextStyles.title),
                                const SizedBox(height: LuckdateSpacing.sm),
                                Text(
                                  product.usage,
                                  style: LuckdateTextStyles.bodySmall,
                                ),
                              ],
                              const SizedBox(height: LuckdateSpacing.xl),
                              Text(
                                'Ingredient Highlights',
                                style: LuckdateTextStyles.title,
                              ),
                              const SizedBox(height: LuckdateSpacing.md),
                              const _IngredientRow(items: _ingredients),
                              if (product.warnings.isNotEmpty) ...[
                                const SizedBox(height: LuckdateSpacing.xl),
                                Text(
                                  'Warnings',
                                  style: LuckdateTextStyles.title,
                                ),
                                const SizedBox(height: LuckdateSpacing.sm),
                                Text(
                                  product.warnings,
                                  style: LuckdateTextStyles.bodySmall,
                                ),
                              ],
                              const SizedBox(height: 88),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                _BottomBar(
                  cartCount: _cartCount,
                  onAddCart: () {
                    setState(() => _cartCount += 1);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Added to cart')),
                    );
                  },
                  onBuyNow: () {
                    if (showPurchaseFlow) {
                      _handlePurchase();
                      return;
                    }
                    if (showReceiptFlow) {
                      context.push('/plan/intro');
                      return;
                    }
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Order flow — demo placeholder'),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _handlePurchase() async {
    ref.read(appStateProvider.notifier).purchaseSolarProtein();
    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Purchase successful'),
        content: const Text(
          'Purchase successful. Confirm receipt when your package arrives to start your 28-day Slim Journey.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Continue'),
          ),
        ],
      ),
    );
    if (!mounted) return;
    context.push('/plan/intro');
  }
}

class _DetailHeader extends StatelessWidget {
  const _DetailHeader({
    required this.cartCount,
    required this.onBack,
  });

  final int cartCount;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 4, 8, 4),
      child: Row(
        children: [
          IconButton(
            onPressed: onBack,
            icon: const Icon(Icons.arrow_back_ios_new, size: 18),
          ),
          Expanded(
            child: Text(
              'Product Details',
              textAlign: TextAlign.center,
              style: LuckdateTextStyles.title,
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.ios_share_rounded, size: 20),
          ),
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.shopping_bag_outlined, size: 22),
              ),
              if (cartCount > 0)
                Positioned(
                  right: 6,
                  top: 6,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 5,
                      vertical: 1,
                    ),
                    decoration: BoxDecoration(
                      color: LuckdateColors.deepSage,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '$cartCount',
                      style: LuckdateTextStyles.caption.copyWith(
                        color: LuckdateColors.ivoryWhite,
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _HeroBanner extends StatelessWidget {
  const _HeroBanner({
    required this.product,
    required this.color,
    required this.page,
    required this.onPage,
  });

  final Product product;
  final Color color;
  final int page;
  final ValueChanged<int> onPage;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 280,
      child: Stack(
        fit: StackFit.expand,
        children: [
          PageView.builder(
            itemCount: 3,
            onPageChanged: onPage,
            itemBuilder: (_, index) {
              return Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      color.withValues(alpha: 0.35),
                      const Color(0xFF3D4A38),
                      LuckdateColors.mossDark,
                    ],
                  ),
                ),
                padding: const EdgeInsets.fromLTRB(24, 28, 24, 40),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name.toUpperCase(),
                      style: LuckdateTextStyles.h1.copyWith(
                        color: LuckdateColors.ivoryWhite,
                        fontSize: 26,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      product.shortDescription.isNotEmpty
                          ? product.shortDescription
                          : 'Protein Nutritional Meal Replacement',
                      style: LuckdateTextStyles.bodySmall.copyWith(
                        color: LuckdateColors.ivoryWhite.withValues(alpha: 0.9),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          Positioned(
            top: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.35),
                borderRadius: BorderRadius.circular(LuckdateRadius.pill),
              ),
              child: Text(
                '${page + 1}/3',
                style: LuckdateTextStyles.caption.copyWith(
                  color: LuckdateColors.ivoryWhite,
                ),
              ),
            ),
          ),
          Positioned(
            right: 20,
            bottom: 50,
            child: Icon(
              Icons.spa_rounded,
              size: 96,
              color: Colors.white.withValues(alpha: 0.12),
            ),
          ),
        ],
      ),
    );
  }
}

class _PriceRow extends StatelessWidget {
  const _PriceRow({
    required this.price,
    required this.favorited,
    required this.onFavorite,
  });

  final double price;
  final bool favorited;
  final VoidCallback onFavorite;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '\$${price.toStringAsFixed(2)}',
          style: LuckdateTextStyles.h1.copyWith(fontSize: 28),
        ),
        const Spacer(),
        InkWell(
          onTap: onFavorite,
          child: Column(
            children: [
              Icon(
                favorited ? Icons.favorite : Icons.favorite_border,
                color: favorited
                    ? LuckdateColors.errorSoft
                    : LuckdateColors.textSecondary,
                size: 22,
              ),
              Text('Save', style: LuckdateTextStyles.caption),
            ],
          ),
        ),
      ],
    );
  }
}

class _SpecSelector extends StatelessWidget {
  const _SpecSelector({
    required this.specs,
    required this.selected,
    required this.onSelect,
  });

  final List<(String, double)> specs;
  final int selected;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(specs.length, (i) {
        final active = selected == i;
        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(right: i == specs.length - 1 ? 0 : 8),
            child: InkWell(
              onTap: () => onSelect(i),
              borderRadius: BorderRadius.circular(LuckdateRadius.md),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: LuckdateColors.ivoryWhite,
                  borderRadius: BorderRadius.circular(LuckdateRadius.md),
                  border: Border.all(
                    color: active
                        ? LuckdateColors.textPrimary
                        : LuckdateColors.lineSoft,
                    width: active ? 1.5 : 1,
                  ),
                ),
                child: Column(
                  children: [
                    Text(
                      specs[i].$1,
                      style: LuckdateTextStyles.caption.copyWith(
                        fontWeight: FontWeight.w700,
                        color: LuckdateColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '\$${specs[i].$2.toStringAsFixed(2)}',
                      style: LuckdateTextStyles.caption,
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      }),
    );
  }
}

class _ServiceBar extends StatelessWidget {
  const _ServiceBar({required this.items});

  final List<(IconData, String)> items;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: LuckdateColors.ivoryWhite,
        borderRadius: BorderRadius.circular(LuckdateRadius.lg),
        border: Border.all(color: LuckdateColors.lineSoft),
      ),
      child: Row(
        children: items.map((item) {
          return Expanded(
            child: Column(
              children: [
                Icon(item.$1, size: 18, color: LuckdateColors.deepSage),
                const SizedBox(height: 4),
                Text(
                  item.$2,
                  textAlign: TextAlign.center,
                  style: LuckdateTextStyles.caption.copyWith(fontSize: 9),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _DetailVisual extends StatelessWidget {
  const _DetailVisual({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 140,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(LuckdateRadius.lg),
        gradient: LinearGradient(
          colors: [
            color.withValues(alpha: 0.25),
            LuckdateColors.sageSoft,
          ],
        ),
      ),
      child: Row(
        children: [
          const SizedBox(width: 20),
          Icon(Icons.local_cafe_rounded, size: 64, color: color),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Smooth shake texture with balanced macros for your daily ritual.',
              style: LuckdateTextStyles.bodySmall.copyWith(
                color: LuckdateColors.textPrimary,
              ),
            ),
          ),
          const SizedBox(width: 16),
        ],
      ),
    );
  }
}

class _IngredientRow extends StatelessWidget {
  const _IngredientRow({required this.items});

  final List<(String, String)> items;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 108,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (_, i) {
          return SizedBox(
            width: 84,
            child: Column(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: LuckdateColors.sageSoft,
                    border: Border.all(color: LuckdateColors.lineSoft),
                  ),
                  child: const Icon(
                    Icons.spa_outlined,
                    color: LuckdateColors.deepSage,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  items[i].$1,
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: LuckdateTextStyles.caption.copyWith(
                    fontWeight: FontWeight.w700,
                    color: LuckdateColors.textPrimary,
                  ),
                ),
                Text(
                  items[i].$2,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: LuckdateTextStyles.caption.copyWith(fontSize: 9),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _BottomBar extends StatelessWidget {
  const _BottomBar({
    required this.cartCount,
    required this.onAddCart,
    required this.onBuyNow,
  });

  final int cartCount;
  final VoidCallback onAddCart;
  final VoidCallback onBuyNow;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        LuckdateSpacing.md,
        LuckdateSpacing.sm,
        LuckdateSpacing.md,
        LuckdateSpacing.sm + MediaQuery.paddingOf(context).bottom,
      ),
      decoration: const BoxDecoration(
        color: LuckdateColors.ivoryWhite,
        border: Border(top: BorderSide(color: LuckdateColors.lineSoft)),
        boxShadow: [
          BoxShadow(
            color: Color(0x14000000),
            offset: Offset(0, -2),
            blurRadius: 12,
          ),
        ],
      ),
      child: Row(
        children: [
          _bottomIcon(Icons.support_agent_outlined, 'Support'),
          const SizedBox(width: 8),
          Stack(
            clipBehavior: Clip.none,
            children: [
              _bottomIcon(Icons.shopping_bag_outlined, 'Cart'),
              if (cartCount > 0)
                Positioned(
                  right: 0,
                  top: -2,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 5,
                      vertical: 1,
                    ),
                    decoration: BoxDecoration(
                      color: LuckdateColors.deepSage,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '$cartCount',
                      style: LuckdateTextStyles.caption.copyWith(
                        color: LuckdateColors.ivoryWhite,
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 10),
          Expanded(
            child: OutlinedButton(
              onPressed: onAddCart,
              style: OutlinedButton.styleFrom(
                foregroundColor: LuckdateColors.textPrimary,
                side: const BorderSide(color: LuckdateColors.textPrimary),
                minimumSize: const Size(0, 48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                ),
              ),
              child: Text(
                'Add to Cart',
                style: LuckdateTextStyles.caption.copyWith(
                  fontWeight: FontWeight.w700,
                  color: LuckdateColors.textPrimary,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: ElevatedButton(
              onPressed: onBuyNow,
              style: ElevatedButton.styleFrom(
                backgroundColor: LuckdateColors.deepSage,
                foregroundColor: LuckdateColors.ivoryWhite,
                elevation: 0,
                minimumSize: const Size(0, 48),
                padding: const EdgeInsets.symmetric(horizontal: 8),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                ),
              ),
              child: Text(
                'Buy Now',
                style: LuckdateTextStyles.caption.copyWith(
                  color: LuckdateColors.ivoryWhite,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _bottomIcon(IconData icon, String label) {
    return SizedBox(
      width: 44,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20, color: LuckdateColors.textPrimary),
          Text(label, style: LuckdateTextStyles.caption.copyWith(fontSize: 9)),
        ],
      ),
    );
  }
}
