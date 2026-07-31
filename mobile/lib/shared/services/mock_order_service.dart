import 'dart:math';

import '../config/app_config.dart';
import '../models/models.dart';

class LinkedProductInfo {
  const LinkedProductInfo({
    required this.orderNo,
    required this.productName,
    required this.productId,
    required this.isMealReplacement,
    this.sku = '',
    this.orderedAt = '',
    this.series = '',
    this.blurb = '',
  });

  final String orderNo;
  final String productName;
  final String productId;
  final bool isMealReplacement;
  final String sku;
  final String orderedAt;
  final String series;
  final String blurb;
}

class OrderLinkResult {
  const OrderLinkResult({
    required this.success,
    this.productName = '',
    this.isMealReplacement = false,
    this.message = '',
    this.products = const [],
    this.recipientName = '',
  });

  final bool success;
  final String productName;
  final bool isMealReplacement;
  final String message;
  final List<LinkedProductInfo> products;
  final String recipientName;
}

class MockOrderService {
  static const _catalog = [
    LinkedProductInfo(
      orderNo: 'ORD-2026-MEAL',
      productName: 'Solar Protein™ 28-Day',
      productId: 'solar_protein',
      isMealReplacement: true,
      sku: 'LD-SLIM-28D',
      orderedAt: '2026-06-12 14:28',
      series: 'Vitalidad Slim',
      blurb:
          'Mezcla una porción con agua o leche como apoyo para tus comidas. '
          'Acompáñala con hidratación, sueño y movimiento suave durante tu viaje de 28 días.',
    ),
    LinkedProductInfo(
      orderNo: 'ORD-2026-YOUTH',
      productName: 'Youth Solar™',
      productId: 'youth_solar',
      isMealReplacement: false,
      sku: 'LD-BEAU-YTH',
      orderedAt: '2026-06-18 09:12',
      series: 'Vitalidad y belleza',
      blurb:
          'Tómalo según las indicaciones de la etiqueta. '
          'Registra cada porción en el chat de Sunny para mantener tu racha.',
    ),
    LinkedProductInfo(
      orderNo: 'ORD-2026-VITA',
      productName: 'Vitality Collagen Boost',
      productId: 'active_boost',
      isMealReplacement: false,
      sku: 'LD-AGE-COL',
      orderedAt: '2026-06-22 16:45',
      series: 'Envejecimiento saludable',
      blurb:
          'Disfrútalo diariamente como parte de tu ritual de vitalidad. '
          'Sunny te lo recordará y llevará el control de tu constancia.',
    ),
    LinkedProductInfo(
      orderNo: 'ORD-2026-ENERGY',
      productName: 'Daily Energy Solar',
      productId: 'daily_vital',
      isMealReplacement: false,
      sku: 'LD-NRG-DAY',
      orderedAt: '2026-07-01 11:03',
      series: 'Vitalidad energética',
      blurb:
          'Tómalo por la mañana con agua. '
          'Sunny puede avisarte cuando sea momento de tu siguiente porción.',
    ),
  ];

  /// Demo lookup by recipient name + last 4 phone digits.
  ///
  /// - `0000` → no linked orders
  /// - otherwise → seeded random 1–3 demo orders (stable for same inputs)
  /// - name `meal` → always Solar Protein only (Day 1 demo)
  OrderLinkResult linkOrder({
    required String recipientName,
    required String phoneLast4,
  }) {
    final name = recipientName.trim();
    final phone = phoneLast4.trim();

    if (name.isEmpty) {
      return const OrderLinkResult(
        success: false,
        message: 'Ingresa el nombre del destinatario que aparece en tu pedido.',
      );
    }

    if (phone.length != 4 || !RegExp(r'^\d{4}$').hasMatch(phone)) {
      return const OrderLinkResult(
        success: false,
        message: 'Ingresa los últimos 4 dígitos de tu número de teléfono.',
      );
    }

    if (phone == '0000') {
      return OrderLinkResult(
        success: false,
        recipientName: name,
        message:
            'No se encontraron pedidos vinculados para este nombre y terminación de teléfono.',
      );
    }

    final lower = name.toLowerCase();
    if (lower == 'meal' || lower == 'solar') {
      final product = _catalog[0];
      return OrderLinkResult(
        success: true,
        productName: product.productName,
        isMealReplacement: AppConfig.isSlimPlanProduct(product.productId),
        recipientName: name,
        products: [product],
      );
    }

    final rng = Random(Object.hash(lower, phone));
    final count = 1 + rng.nextInt(3); // 1–3
    final pool = List<LinkedProductInfo>.of(_catalog)..shuffle(rng);
    final products = pool.take(count).toList();
    final hasSlim = products.any(
      (p) => AppConfig.isSlimPlanProduct(p.productId),
    );

    return OrderLinkResult(
      success: true,
      productName: products.first.productName,
      isMealReplacement: hasSlim,
      recipientName: name,
      products: products,
    );
  }

  /// Opens the 28-day slim plan only when a linked product ID is in
  /// [AppConfig.slimPlanProductIds].
  UserPlanType planTypeFor(OrderLinkResult result) {
    if (!result.success || result.products.isEmpty) {
      return UserPlanType.noProduct;
    }
    final hasSlim = result.products.any(
      (p) => AppConfig.isSlimPlanProduct(p.productId),
    );
    if (hasSlim) return UserPlanType.mealReplacement;
    return UserPlanType.nonMealReplacement;
  }
}
