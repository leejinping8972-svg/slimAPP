import 'package:chatviva_slim/shared/models/models.dart';
import 'package:chatviva_slim/shared/providers/app_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('order link with meal replacement starts Day 1 immediately', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    container.read(appStateProvider.notifier).completeRegistration();
    final result = container.read(appStateProvider.notifier).linkOrder(
          recipientName: 'meal',
          phoneLast4: '1234',
        );

    expect(result.success, isTrue);
    final profile = container.read(appStateProvider).profile;
    expect(profile.productSource, ProductAcquisitionSource.orderLinked);
    expect(profile.slimPlanStatus, SlimPlanStatus.active);
    expect(profile.userPlanType, UserPlanType.mealReplacement);
    expect(container.read(appStateProvider).journey.day, 1);
  });

  test('phone ending 0000 returns no linked orders', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    container.read(appStateProvider.notifier).completeRegistration();
    final result = container.read(appStateProvider.notifier).linkOrder(
          recipientName: 'Alex',
          phoneLast4: '0000',
        );

    expect(result.success, isFalse);
    expect(result.products, isEmpty);
    expect(
      container.read(appStateProvider).profile.orderLinkStatus,
      OrderLinkStatus.failed,
    );
  });

  test('any name and phone returns 1 to 3 demo orders', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    container.read(appStateProvider.notifier).completeRegistration();
    final result = container.read(appStateProvider.notifier).linkOrder(
          recipientName: 'Alex',
          phoneLast4: '1234',
        );

    expect(result.success, isTrue);
    expect(result.products.length, inInclusiveRange(1, 3));
  });

  test('in-app purchase waits for receipt confirmation before Day 1', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    container.read(appStateProvider.notifier).completeRegistration();
    container.read(appStateProvider.notifier).purchaseSolarProtein();

    var profile = container.read(appStateProvider).profile;
    expect(profile.productSource, ProductAcquisitionSource.inAppPurchase);
    expect(profile.slimPlanStatus, SlimPlanStatus.awaitingReceipt);
    expect(profile.userPlanType, UserPlanType.noProduct);
    expect(profile.isAwaitingReceipt, isTrue);

    container.read(appStateProvider.notifier).confirmReceipt();

    profile = container.read(appStateProvider).profile;
    expect(profile.slimPlanStatus, SlimPlanStatus.active);
    expect(profile.userPlanType, UserPlanType.mealReplacement);
    expect(profile.hasActiveSlimPlan, isTrue);
    expect(container.read(appStateProvider).journey.day, 1);
  });
}
