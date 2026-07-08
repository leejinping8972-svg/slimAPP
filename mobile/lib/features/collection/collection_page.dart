import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';

class CollectionPage extends ConsumerStatefulWidget {
  const CollectionPage({super.key});

  @override
  ConsumerState<CollectionPage> createState() => _CollectionPageState();
}

class _CollectionPageState extends ConsumerState<CollectionPage> {
  String _filter = 'All';

  @override
  Widget build(BuildContext context) {
    final productsAsync = ref.watch(productsProvider);
    final journey = ref.watch(appStateProvider).journey;
    final showExtension = journey.day >= 28;

    return LdScaffold(
      body: productsAsync.when(
        data: (products) {
          final filtered = _filter == 'All'
              ? products
              : products.where((p) => p.series == _filter).toList();
          return SingleChildScrollView(
            padding: const EdgeInsets.all(LuckdateSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Product Center', style: LuckdateTextStyles.h1),
                const SizedBox(height: LuckdateSpacing.sm),
                Text(
                  'The House of Vitality — curated for your next chapter.',
                  style: LuckdateTextStyles.bodySmall,
                ),
                if (showExtension) ...[
                  const SizedBox(height: LuckdateSpacing.xl),
                  LdCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Your Next Journey',
                          style: LuckdateTextStyles.title,
                        ),
                        const SizedBox(height: LuckdateSpacing.sm),
                        Text(
                          'Ready for more energy, feminine balance, or deeper sleep? Choose your direction.',
                          style: LuckdateTextStyles.bodySmall,
                        ),
                        const SizedBox(height: LuckdateSpacing.md),
                        Wrap(
                          spacing: 8,
                          children:
                              [
                                'More Energy',
                                'Femme Balance',
                                'Better Sleep',
                              ].map((d) {
                                return LdChoiceChip(
                                  label: d,
                                  selected: false,
                                  onTap: () {},
                                );
                              }).toList(),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: LuckdateSpacing.xl),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children:
                        [
                          'All',
                          'Daily',
                          'Youth',
                          'Femme',
                          'Recovery',
                          'Active',
                        ].map((s) {
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: LdChoiceChip(
                              label: s,
                              selected: _filter == s,
                              color: _seriesColor(s),
                              onTap: () => setState(() => _filter = s),
                            ),
                          );
                        }).toList(),
                  ),
                ),
                const SizedBox(height: LuckdateSpacing.lg),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.72,
                  ),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final product = filtered[index];
                    return ProductCard(
                      product: product,
                      onTap: () =>
                          context.push('/collection/product/${product.id}'),
                    );
                  },
                ),
              ],
            ),
          );
        },
        loading: () => const StatePlaceholder(type: 'loading'),
        error: (_, __) => const StatePlaceholder(type: 'error'),
      ),
    );
  }

  Color? _seriesColor(String series) {
    return switch (series) {
      'Youth' => LuckdateColors.youth,
      'Femme' => LuckdateColors.femme,
      'Recovery' => LuckdateColors.recovery,
      'Active' => LuckdateColors.active,
      'Daily' => LuckdateColors.daily,
      _ => null,
    };
  }
}

class ProductDetailPage extends ConsumerWidget {
  const ProductDetailPage({super.key, required this.productId});

  final String productId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productsProvider);
    return LdScaffold(
      showBack: true,
      body: productsAsync.when(
        data: (products) {
          final product = products.firstWhere(
            (p) => p.id == productId,
            orElse: () => products.first,
          );
          final color = Color(
            int.parse(product.colorHex.replaceFirst('#', '0xFF')),
          );
          return SingleChildScrollView(
            padding: const EdgeInsets.all(LuckdateSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 200,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(LuckdateRadius.xl),
                  ),
                  child: Icon(Icons.spa_outlined, size: 72, color: color),
                ),
                const SizedBox(height: LuckdateSpacing.xl),
                Text(product.name, style: LuckdateTextStyles.h1),
                Text(product.series, style: LuckdateTextStyles.caption),
                const SizedBox(height: LuckdateSpacing.sm),
                Text(product.shortDescription, style: LuckdateTextStyles.body),
                const SizedBox(height: LuckdateSpacing.lg),
                Text(product.priceDisplay, style: LuckdateTextStyles.h2),
                const SizedBox(height: LuckdateSpacing.xl),
                _section('Benefits', product.benefits),
                _section('Usage', product.usage),
                _section('Ingredients', product.ingredients),
                _section('Warnings', product.warnings),
                const SizedBox(height: LuckdateSpacing.xl),
                LdPrimaryButton(
                  label: 'Continue Your Journey',
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Order flow — demo placeholder'),
                      ),
                    );
                  },
                ),
              ],
            ),
          );
        },
        loading: () => const StatePlaceholder(type: 'loading'),
        error: (_, __) => const StatePlaceholder(type: 'error'),
      ),
    );
  }

  Widget _section(String title, String body) {
    if (body.isEmpty) return const SizedBox();
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.lg),
      child: LdCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: LuckdateTextStyles.title),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(body, style: LuckdateTextStyles.bodySmall),
          ],
        ),
      ),
    );
  }
}
