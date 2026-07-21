import 'package:chatviva_slim/shared/models/models.dart';
import 'package:chatviva_slim/shared/services/onboarding_chat_guide.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('Onboarding chat collects profile through Sunny dialogue', () {
    var profile = const UserProfile(
      isLoggedIn: true,
      onboardingComplete: false,
      onboardingStep: 'privacy',
    );

    void step(String input) {
      final guided = OnboardingChatGuide.handle(input: input, profile: profile);
      profile = guided.profile;
    }

    step('I agree');
    expect(profile.onboardingStep, 'age');

    step('35-50');
    expect(profile.ageRange, '35-50');
    expect(profile.onboardingStep, 'height');

    step('165');
    expect(profile.heightCm, 165);
    expect(profile.onboardingStep, 'weight');

    step('68 kg');
    expect(profile.currentWeightKg, 68);
    expect(profile.onboardingStep, 'target');

    step('use recommended');
    expect(profile.onboardingStep, 'meal');

    step('breakfast');
    expect(profile.mealSlot, 'breakfast');
    expect(profile.onboardingStep, 'reminder');

    step('08:00');
    expect(profile.reminderTime, '08:00');
    expect(profile.onboardingComplete, isTrue);
    expect(profile.onboardingStep, 'done');
  });

  test('Product intro offer starts privacy Q&A on 立即获取', () {
    var profile = const UserProfile(
      isLoggedIn: true,
      onboardingComplete: false,
      onboardingStep: 'plan_offer',
      recipientName: 'Alex',
      linkedProducts: [
        LinkedProductRef(
          orderNo: 'ORD-1',
          productName: 'Solar Protein™ 28-Day',
          isMealReplacement: true,
        ),
      ],
    );

    final guided = OnboardingChatGuide.handle(
      input: '立即获取',
      profile: profile,
    );
    expect(guided.profile.onboardingStep, 'privacy');
    expect(guided.result.reply, contains('privacy policy'));

    final seeds = OnboardingChatGuide.productIntroSeedMessages(profile);
    expect(seeds.first.text, contains('Hi Alex'));
    expect(seeds.where((m) => m.id.startsWith('onboard_product_')), hasLength(1));
    expect(seeds.last.actionLabels, contains('立即获取'));
  });
}
