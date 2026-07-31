/// Demo/app config mirroring admin `slim_plan_product_ids`.
///
/// When a linked external order includes a product whose [productId] is in
/// this list, the 28-day meal-replacement slim plan is activated.
class AppConfig {
  const AppConfig._();

  /// Product IDs that unlock the 28-day Slim plan (meal replacement).
  static const List<String> slimPlanProductIds = [
    'solar_protein',
    'LD-SLIM-28D',
  ];

  static bool isSlimPlanProduct(String productId) {
    if (productId.isEmpty) return false;
    final id = productId.trim().toLowerCase();
    return slimPlanProductIds.any((e) => e.toLowerCase() == id);
  }
}
