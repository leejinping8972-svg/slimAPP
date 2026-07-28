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
  String _filter = 'Todo';

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
          final filtered = _filter == 'Todo'
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
                      Text('Tienda', style: LuckdateTextStyles.h1),
                      const SizedBox(height: LuckdateSpacing.xs),
                      Text(
                        'La casa de la vitalidad: seleccionada para tu próximo capítulo.',
                        style: LuckdateTextStyles.bodySmall,
                      ),
                      const SizedBox(height: LuckdateSpacing.md),
                      TextField(
                        readOnly: true,
                        decoration: InputDecoration(
                          hintText: 'Buscar productos...',
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
                const SizedBox(height: LuckdateSpacing.sm),
                if (coupon != null && coupon.status == 'unused') ...[
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
                                'Cupón de \$${coupon.amount.toStringAsFixed(0)} aplicado al pagar',
                                style: LuckdateTextStyles.body.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                'Toda la tienda · válido por 30 días',
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
                          'Tu próximo viaje',
                          style: LuckdateTextStyles.title,
                        ),
                        const SizedBox(height: LuckdateSpacing.sm),
                        Text(
                          '¿Lista para más energía, equilibrio femenino o un sueño más profundo? Elige tu camino.',
                          style: LuckdateTextStyles.bodySmall,
                        ),
                        const SizedBox(height: LuckdateSpacing.md),
                        Wrap(
                          spacing: 8,
                          children:
                              [
                                ('Pedir Solar de nuevo', 'solar_protein'),
                                ('Mantener', 'youth_solar'),
                                ('Energía', 'active_boost'),
                              ].map((d) {
                                return LdChoiceChip(
                                  label: d.$1,
                                  selected: false,
                                  onTap: () => context.push(
                                    '/collection/product/${d.$2}',
                                  ),
                                );
                              }).toList(),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: LuckdateSpacing.md),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children:
                        [
                          'Todo',
                          'Vitalidad Slim',
                          'Vitalidad y belleza',
                          'Envejecimiento saludable',
                          'Vitalidad femenina',
                          'Vitalidad mental',
                          'Vitalidad energética',
                          'Vitalidad diaria',
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
                    title: 'No se encontraron productos',
                    message:
                        'Prueba otra categoría para explorar más opciones.',
                  )
                else
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 0.66,
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
      'Vitalidad Slim' => LuckdateColors.slimVitality,
      'Vitalidad y belleza' => LuckdateColors.beautyVitality,
      'Envejecimiento saludable' => LuckdateColors.healthyAging,
      'Vitalidad femenina' => LuckdateColors.womensVitality,
      'Vitalidad mental' => LuckdateColors.mindVitality,
      'Vitalidad energética' => LuckdateColors.energyVitality,
      'Vitalidad diaria' => LuckdateColors.dailyVitality,
      _ => null,
    };
  }
}
