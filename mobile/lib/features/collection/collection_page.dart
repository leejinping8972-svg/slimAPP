import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

class CollectionPage extends ConsumerStatefulWidget {
  const CollectionPage({super.key, this.rootTab = false});

  final bool rootTab;

  @override
  ConsumerState<CollectionPage> createState() => _CollectionPageState();
}

class _CollectionPageState extends ConsumerState<CollectionPage> {
  String _filter = 'All';

  @override
  Widget build(BuildContext context) {
    final productsAsync = ref.watch(productsProvider);
    final state = ref.watch(appStateProvider);
    final journey = state.journey;
    final profile = state.profile;
    final coupon = profile.welcomeCoupon;
    final showExtension = journey.day >= 28;

    return LdScaffold(
      showBack: !widget.rootTab,
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
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(LuckdateSpacing.lg),
                  decoration: BoxDecoration(
                    gradient: LuckdateGradients.pageHeader,
                    borderRadius: BorderRadius.circular(LuckdateRadius.xl),
                    border: Border.all(color: LuckdateColors.lineSoft),
                    boxShadow: LuckdateShadows.card,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Mall', style: LuckdateTextStyles.h1),
                      const SizedBox(height: LuckdateSpacing.xs),
                      Text(
                        'The House of Vitality — curated for your next chapter.',
                        style: LuckdateTextStyles.bodySmall,
                      ),
                      const SizedBox(height: LuckdateSpacing.md),
                      TextField(
                        readOnly: true,
                        decoration: InputDecoration(
                          hintText: 'Search products...',
                          prefixIcon: const Icon(
                            Icons.search,
                            color: LuckdateColors.textSecondary,
                          ),
                          filled: true,
                          fillColor: LuckdateColors.ivoryWhite,
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: LuckdateSpacing.sm,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: LuckdateSpacing.lg),
                if (coupon != null && coupon.status == 'unused') ...[
                  const SizedBox(height: LuckdateSpacing.lg),
                  LdCard(
                    child: Row(
                      children: [
                        const Icon(
                          Icons.local_offer_outlined,
                          color: LuckdateColors.deepSage,
                        ),
                        const SizedBox(width: LuckdateSpacing.md),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '\$${coupon.amount.toStringAsFixed(0)} coupon applied at checkout',
                                style: LuckdateTextStyles.body.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                'Storewide · valid for 30 days',
                                style: LuckdateTextStyles.caption,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
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
                                  onTap: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Coming soon'),
                                      ),
                                    );
                                  },
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
                if (filtered.isEmpty)
                  const StatePlaceholder(
                    type: 'empty',
                    title: 'No products found',
                    message: 'Try another category to explore more options.',
                  )
                else
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
