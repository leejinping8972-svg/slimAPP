import 'package:chatviva_slim/shared/models/models.dart';
import 'package:chatviva_slim/shared/services/onboarding_chat_guide.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('Onboarding chat collects profile through Sunny dialogue', () {
    var profile = const UserProfile(
      isLoggedIn: true,
      onboardingComplete: false,
      onboardingStep: 'privacy',
      // Linked-product slim path (not no-product).
      userPlanType: UserPlanType.mealReplacement,
      slimPlanStatus: SlimPlanStatus.active,
    );

    void step(String input) {
      final guided = OnboardingChatGuide.handle(input: input, profile: profile);
      profile = guided.profile;
    }

    step('Acepto');
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

    step('usar el recomendado');
    expect(profile.onboardingStep, 'meal');

    step('desayuno');
    expect(profile.mealSlot, 'breakfast');
    expect(profile.onboardingStep, 'reminder');

    step('08:00');
    expect(profile.reminderTime, '08:00');
    expect(profile.onboardingComplete, isTrue);
    expect(profile.onboardingStep, 'done');
  });

  test('No-product skip flow: health need → basics → Messenger', () {
    var profile = const UserProfile(
      isLoggedIn: true,
      onboardingComplete: false,
      onboardingStep: 'health_need',
      userPlanType: UserPlanType.noProduct,
      orderLinkStatus: OrderLinkStatus.skipped,
    );

    var guided = OnboardingChatGuide.handle(
      input: 'Perder peso',
      profile: profile,
    );
    profile = guided.profile;
    expect(profile.healthNeed, 'weight_loss');
    expect(profile.onboardingStep, 'privacy');

    guided = OnboardingChatGuide.handle(input: 'Acepto', profile: profile);
    profile = guided.profile;
    expect(profile.onboardingStep, 'age');

    guided = OnboardingChatGuide.handle(input: '35-50', profile: profile);
    profile = guided.profile;
    expect(profile.onboardingStep, 'height');

    guided = OnboardingChatGuide.handle(input: '165', profile: profile);
    profile = guided.profile;
    expect(profile.onboardingStep, 'weight');

    guided = OnboardingChatGuide.handle(input: '68 kg', profile: profile);
    profile = guided.profile;
    expect(profile.onboardingComplete, isTrue);
    expect(profile.onboardingStep, 'done');
    expect(guided.result.intents, contains('messenger_handoff'));
    expect(guided.result.actionLabels, contains('Hablar por Messenger'));
    expect(guided.result.reply, contains('Messenger'));
  });

  test('noProductSeedMessages start at health need', () {
    final seeds = OnboardingChatGuide.noProductSeedMessages();
    expect(seeds.first.actionLabels, contains('Perder peso'));
    expect(seeds.first.text, contains('Messenger'));
  });

  test('Product intro offer starts privacy Q&A on Obtener un plan', () {
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
      input: 'Obtener un plan',
      profile: profile,
    );
    expect(guided.profile.onboardingStep, 'privacy');
    expect(guided.result.reply, contains('Política de privacidad'));

    final seeds = OnboardingChatGuide.productIntroSeedMessages(profile);
    expect(seeds.first.text, contains('¡Hola, Alex!'));
    expect(
      seeds.first.text,
      contains(OnboardingChatGuide.sunnyCapabilitiesIntro),
    );
    expect(seeds.first.text, contains('Solar Protein'));
    expect(seeds.where((m) => m.id.startsWith('onboard_product_')), isEmpty);
    expect(seeds.last.actionLabels, contains('Obtener un plan'));
    expect(seeds.last.actionLabels, contains('Solo ayuda con productos'));
  });

  test(
    'Solo ayuda con productos completa el registro sin preguntas del plan',
    () {
      var profile = const UserProfile(
        isLoggedIn: true,
        onboardingComplete: false,
        onboardingStep: 'plan_offer',
      );

      final guided = OnboardingChatGuide.handle(
        input: 'Solo ayuda con productos',
        profile: profile,
      );
      expect(guided.profile.onboardingComplete, isTrue);
      expect(guided.result.reply, contains('cuidado de productos'));
    },
  );
}
