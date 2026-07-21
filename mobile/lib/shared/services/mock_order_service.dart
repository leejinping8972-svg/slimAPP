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
  /// Demo lookup by recipient name + last 4 phone digits.
  /// Any non-empty name + any 4-digit phone returns sample linked orders
  /// (multiple products) so the product-intro chat can show several cards.
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

    final lower = name.toLowerCase();

    // Single meal-journey order when demo keyword is used.
    if (lower == 'meal' ||
        lower == 'solar' ||
        lower.contains('代餐') ||
        lower == 'meal replacement') {
      const product = LinkedProductInfo(
        orderNo: 'ORD-DEMO-MEAL',
        productName: 'Solar Protein™ 28-Day',
        isMealReplacement: true,
        series: 'Slim Vitality',
        blurb:
            'Mix one serving with water or milk as meal support. '
            'Log your shake in Sunny chat or Ritual each day.',
      );
      return OrderLinkResult(
        success: true,
        productName: product.productName,
        isMealReplacement: true,
        recipientName: name,
        products: const [product],
      );
    }

    // Single non-meal product when "other" keyword is used.
    if (lower == 'other' ||
        lower == 'supplement' ||
        lower == '其他' ||
        lower == '其他产品') {
      const product = LinkedProductInfo(
        orderNo: 'ORD-DEMO-OTHER',
        productName: 'Youth Solar™',
        isMealReplacement: false,
        series: 'Beauty Vitality',
        blurb:
            'Take as directed on the label. '
            'Set a daily reminder so Sunny can check in with you.',
      );
      return OrderLinkResult(
        success: true,
        productName: product.productName,
        isMealReplacement: false,
        recipientName: name,
        products: const [product],
      );
    }

    // Default demo: any name + phone → multiple linked orders.
    const products = [
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
    ];

    return OrderLinkResult(
      success: true,
      productName: products.first.productName,
      isMealReplacement: true,
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
