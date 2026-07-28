import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

/// Shown after a successful order link — introduce the product before Sunny Q&A.
class ProductIntroPage extends ConsumerWidget {
  const ProductIntroPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(appStateProvider).profile;
    final productName = profile.linkedProductName.isNotEmpty
        ? profile.linkedProductName
        : 'Solar Protein™';
    final isMeal =
        profile.userPlanType == UserPlanType.mealReplacement ||
        profile.hasActiveSlimPlan;

    return LdScaffold(
      showBack: true,
      onBack: () => context.go('/link-order'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(child: LdSunnyAvatar(size: 88)),
            const SizedBox(height: LuckdateSpacing.lg),
            Text('Conoce tu producto', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              isMeal
                  ? 'Tu pedido está vinculado. Así es como $productName impulsa tu viaje Slim de 28 días.'
                  : 'Tu pedido está vinculado. Así es como $productName se integra a tu ritual diario de vitalidad.',
              style: LuckdateTextStyles.bodySmall,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              accentColor: LuckdateColors.sunGold,
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: LuckdateColors.sageSoft,
                      borderRadius: BorderRadius.circular(LuckdateRadius.md),
                    ),
                    child: const Icon(
                      Icons.eco_rounded,
                      color: LuckdateColors.deepSage,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(productName, style: LuckdateTextStyles.title),
                        const SizedBox(height: 4),
                        Text(
                          isMeal
                              ? 'Viaje Slim de 28 días desbloqueado'
                              : 'Plan diario de cuidado del producto',
                          style: LuckdateTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            Text('Cómo usarlo', style: LuckdateTextStyles.title),
            const SizedBox(height: LuckdateSpacing.sm),
            ..._bullets(
              isMeal
                  ? const [
                      'Mezcla una porción con agua o leche como apoyo para tus comidas.',
                      'Registra tu batido en el chat de Sunny o en Ritual cada día.',
                      'Acompáñalo con hidratación, sueño y movimiento suave.',
                      'Mantén la constancia: el Día 1 comienza después de unas preguntas breves.',
                    ]
                  : const [
                      'Tómalo según las indicaciones de la etiqueta.',
                      'Configura un recordatorio diario para que Sunny pueda acompañarte.',
                      'Registra cada porción en el chat de Sunny para mantener tu racha.',
                      'Cambia a Solar Protein cuando quieras para disfrutar el plan completo de 28 días.',
                    ],
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            Text('Qué sigue', style: LuckdateTextStyles.title),
            const SizedBox(height: LuckdateSpacing.sm),
            ..._bullets(
              isMeal
                  ? const [
                      'Sunny te hará algunas preguntas clave para personalizar tu plan.',
                      'Después te guiará en tu registro del Día 1.',
                      'Tu panel de Ritual registra tu vitalidad mientras avanzas.',
                    ]
                  : const [
                      'Sunny te hará algunas preguntas clave para crear tu perfil.',
                      'Puedes explorar la tienda cuando quieras para desbloquear el viaje Slim completo.',
                    ],
            ),
            const SizedBox(height: LuckdateSpacing.xxl),
            LdPrimaryButton(
              label: 'Continuar con Sunny',
              onPressed: () {
                final onboarded = ref
                    .read(appStateProvider)
                    .profile
                    .onboardingComplete;
                if (onboarded) {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/ritual');
                  }
                } else {
                  final hasProducts = ref
                      .read(appStateProvider)
                      .profile
                      .linkedProducts
                      .isNotEmpty;
                  if (hasProducts) {
                    ref.read(appStateProvider.notifier).beginProductIntroChat();
                  } else {
                    ref.read(appStateProvider.notifier).beginOnboardingChat();
                  }
                  context.go('/home');
                }
              },
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Center(
              child: TextButton(
                onPressed: () {
                  final onboarded = ref
                      .read(appStateProvider)
                      .profile
                      .onboardingComplete;
                  if (onboarded) {
                    context.go('/ritual');
                  } else {
                    ref.read(appStateProvider.notifier).beginOnboardingChat();
                    context.go('/home');
                  }
                },
                child: const Text('Omitir por ahora'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _bullets(List<String> items) {
    return items
        .map(
          (t) => Padding(
            padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('•  ', style: TextStyle(height: 1.4)),
                Expanded(child: Text(t, style: LuckdateTextStyles.bodySmall)),
              ],
            ),
          ),
        )
        .toList();
  }
}
