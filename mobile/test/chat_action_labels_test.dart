import 'package:chatviva_slim/shared/models/models.dart';
import 'package:chatviva_slim/shared/providers/app_providers.dart';
import 'package:chatviva_slim/shared/services/onboarding_chat_guide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('Obtener un plan advances from plan_offer to privacy', () {
    final profile = const UserProfile(
      isLoggedIn: true,
      isNewRegistration: true,
      onboardingStep: 'plan_offer',
      onboardingComplete: false,
    );

    final guided = OnboardingChatGuide.handle(
      input: 'Obtener un plan',
      profile: profile,
    );

    expect(guided.profile.onboardingStep, 'privacy');
    expect(guided.result.reply, contains('Política de privacidad'));
  });

  test('Solo explorar completes onboarding without slim plan', () {
    final guided = OnboardingChatGuide.handle(
      input: 'Solo explorar',
      profile: const UserProfile(
        isLoggedIn: true,
        isNewRegistration: true,
        onboardingStep: 'plan_offer',
      ),
    );

    expect(guided.profile.onboardingComplete, isTrue);
    expect(guided.result.actionLabels, contains('Ir al viaje'));
    expect(
      guided.result.actionLabels,
      contains('Contactar servicio al cliente'),
    );
    expect(guided.result.actionLabels, isNot(contains('Vincular pedido')));
  });

  test('after onboarding, plan request without slim plan points to support',
      () async {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    container.read(appStateProvider.notifier).completeRegistration();
    container.read(appStateProvider.notifier).skipOrderLink();
    container.read(appStateProvider.notifier).completeOnboarding(
          container.read(appStateProvider).profile.copyWith(
                onboardingComplete: true,
                onboardingStep: 'done',
              ),
        );

    await container
        .read(appStateProvider.notifier)
        .sendChatMessage('Obtener un plan');

    // Allow streaming to finish a bit
    await Future<void>.delayed(const Duration(milliseconds: 400));

    final messages = container.read(appStateProvider).chatMessages;
    final lastBot = messages.lastWhere((m) => !m.isUser);
    expect(lastBot.text, contains('servicio al cliente'));
    expect(
      lastBot.actionLabels,
      contains('Contactar servicio al cliente'),
    );
  });

  test('wantsPlanRequest recognizes Obtener un plan label', () {
    expect(OnboardingChatGuide.wantsPlanRequest('Obtener un plan'), isTrue);
    expect(OnboardingChatGuide.wantsPlanRequest('Solo explorar'), isFalse);
  });
}
