import 'dart:math';

import '../models/models.dart';

class LinkedProductInfo {
  const LinkedProductInfo({
    required this.orderNo,
    required this.productName,
    required this.isMealReplacement,
    this.series = '',
    this.blurb = '',
  });

  final String orderNo;
  final String productName;
  final bool isMealReplacement;
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
      isMealReplacement: true,
      series: 'Slim Vitality',
      blurb:
          'Mix one serving with water or milk as meal support. '
          'Pair with hydration, sleep, and gentle movement for your 28-day journey.',
    ),
    LinkedProductInfo(
      orderNo: 'ORD-2026-YOUTH',
      productName: 'Youth Solar™',
      isMealReplacement: false,
      series: 'Beauty Vitality',
      blurb:
          'Take as directed on the label. '
          'Log each serving in Sunny chat to build your streak.',
    ),
    LinkedProductInfo(
      orderNo: 'ORD-2026-VITA',
      productName: 'Vitality Collagen Boost',
      isMealReplacement: false,
      series: 'Healthy Aging',
      blurb:
          'Enjoy daily as part of your vitality ritual. '
          'Sunny will remind you and track consistency.',
    ),
    LinkedProductInfo(
      orderNo: 'ORD-2026-ENERGY',
      productName: 'Daily Energy Solar',
      isMealReplacement: false,
      series: 'Energy Vitality',
      blurb:
          'Take in the morning with water. '
          'Sunny can nudge you when it is time for your next serving.',
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
        message: 'Please enter the recipient name on your order.',
      );
    }

    if (phone.length != 4 || !RegExp(r'^\d{4}$').hasMatch(phone)) {
      return const OrderLinkResult(
        success: false,
        message: 'Please enter the last 4 digits of your phone number.',
      );
    }

    if (phone == '0000') {
      return OrderLinkResult(
        success: false,
        recipientName: name,
        message: 'No linked orders found for this name and phone ending.',
      );
    }

    final lower = name.toLowerCase();
    if (lower == 'meal' || lower == 'solar') {
      final product = _catalog[0];
      return OrderLinkResult(
        success: true,
        productName: product.productName,
        isMealReplacement: true,
        recipientName: name,
        products: [product],
      );
    }

    final rng = Random(Object.hash(lower, phone));
    final count = 1 + rng.nextInt(3); // 1–3
    final pool = List<LinkedProductInfo>.of(_catalog)..shuffle(rng);
    final products = pool.take(count).toList();

    return OrderLinkResult(
      success: true,
      productName: products.first.productName,
      isMealReplacement: products.any((p) => p.isMealReplacement),
      recipientName: name,
      products: products,
    );
  }

  UserPlanType planTypeFor(OrderLinkResult result) {
    if (!result.success || result.products.isEmpty) {
      return UserPlanType.noProduct;
    }
    final hasMeal = result.products.any((p) => p.isMealReplacement);
    return hasMeal
        ? UserPlanType.mealReplacement
        : UserPlanType.nonMealReplacement;
  }
}
