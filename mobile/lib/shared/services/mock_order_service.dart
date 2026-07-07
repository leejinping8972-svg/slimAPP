import '../models/models.dart';

class OrderLinkResult {
  const OrderLinkResult({
    required this.success,
    this.productName = '',
    this.isMealReplacement = false,
    this.message = '',
  });

  final bool success;
  final String productName;
  final bool isMealReplacement;
  final String message;
}

class MockOrderService {
  OrderLinkResult linkOrder({
    required String orderNo,
    required String phoneLast4,
  }) {
    final normalizedOrder = orderNo.trim().toUpperCase();
    final phone = phoneLast4.trim();

    if (phone.length != 4 || !RegExp(r'^\d{4}$').hasMatch(phone)) {
      return const OrderLinkResult(
        success: false,
        message: 'Please enter the last 4 digits of your phone number.',
      );
    }

    if (normalizedOrder == 'ORD-2026-MEAL' && phone == '1234') {
      return const OrderLinkResult(
        success: true,
        productName: 'Solar Protein 28-Day',
        isMealReplacement: true,
      );
    }

    if (normalizedOrder == 'ORD-2026-VITA' && phone == '5678') {
      return const OrderLinkResult(
        success: true,
        productName: 'Vitality Collagen Boost',
        isMealReplacement: false,
      );
    }

    return const OrderLinkResult(
      success: false,
      message:
          'We could not find your order. Please contact support. You can still continue and we will recommend a basic plan.',
    );
  }

  UserPlanType planTypeFor(OrderLinkResult result) {
    if (!result.success) return UserPlanType.noProduct;
    return result.isMealReplacement ? UserPlanType.mealReplacement : UserPlanType.nonMealReplacement;
  }
}
