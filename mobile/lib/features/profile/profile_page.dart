import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ld_shell.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/vitality_scorer.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key, this.rootTab = false});

  final bool rootTab;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    final profile = state.profile;
    final journey = state.journey;

    final page = SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(LuckdateSpacing.lg),
              decoration: BoxDecoration(
                gradient: LuckdateGradients.pageHeader,
                borderRadius: BorderRadius.circular(LuckdateRadius.xl),
                border: Border.all(color: LuckdateColors.lineSoft),
                boxShadow: LuckdateShadows.card,
              ),
              child: Row(
                children: [
                  LdProfileAvatar(nickname: profile.nickname, radius: 32),
                  const SizedBox(width: LuckdateSpacing.base),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(profile.nickname, style: LuckdateTextStyles.h2),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: LuckdateColors.sageSoft,
                            borderRadius:
                                BorderRadius.circular(LuckdateRadius.pill),
                          ),
                          child: Text(
                            'Miembro Vitalidad',
                            style: LuckdateTextStyles.caption.copyWith(
                              color: LuckdateColors.deepSage,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _profileSubtitle(profile, journey),
                          style: LuckdateTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            LdCard(
              child: Row(
                children: [
                  LdScoreRing(
                    score: journey.vitalityScores.dailyVitality,
                    label: VitalityScorer.vitalityLabel(
                      journey.vitalityScores.dailyVitality,
                    ),
                    size: 96,
                  ),
                  const SizedBox(width: LuckdateSpacing.lg),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Puntuación de vitalidad', style: LuckdateTextStyles.title),
                        const SizedBox(height: 4),
                        Text(
                          'Rituales ${journey.vitalityScores.ritualCompletion}% · Constancia ${journey.vitalityScores.consistencyScore}%',
                          style: LuckdateTextStyles.bodySmall,
                        ),
                        const SizedBox(height: LuckdateSpacing.sm),
                        Text(
                          profile.membershipExpires,
                          style: LuckdateTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            _sectionTitle('Menú rápido'),
            LdCard(
              padding: const EdgeInsets.symmetric(
                vertical: LuckdateSpacing.xs,
                horizontal: LuckdateSpacing.xs,
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      _quickMenuItem(
                        Icons.restaurant_menu_outlined,
                        'Registro',
                        () => context.push('/record'),
                      ),
                      _quickMenuItem(
                        Icons.link_outlined,
                        'Vincular',
                        () => context.push('/link-order'),
                      ),
                      _quickMenuItem(
                        Icons.notifications_outlined,
                        'Recordatorios',
                        () => context.push('/profile/reminders'),
                      ),
                    ],
                  ),
                  const Divider(
                    height: 1,
                    thickness: 1,
                    color: LuckdateColors.lineSoft,
                  ),
                  Row(
                    children: [
                      _quickMenuItem(
                        Icons.event_note_outlined,
                        'Plan',
                        () => context.go('/plan'),
                      ),
                      _quickMenuItem(
                        Icons.local_florist_outlined,
                        'Recorrido',
                        () => context.go('/ritual'),
                      ),
                      _quickMenuItem(
                        Icons.wb_sunny_outlined,
                        'Sunny',
                        () => context.push('/home'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            _sectionTitle('Membresía'),
            _tile(
              Icons.card_membership,
              profile.membershipPlan,
              profile.membershipExpires,
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            if (profile.isAwaitingReceipt) ...[
              _sectionTitle('Entrega pendiente'),
              LdCard(
                accentColor: LuckdateColors.sunGold,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      profile.linkedProductName.isEmpty
                          ? 'Solar Protein™'
                          : profile.linkedProductName,
                      style: LuckdateTextStyles.title,
                    ),
                    const SizedBox(height: LuckdateSpacing.sm),
                    Text(
                      'Confirma la recepción para iniciar tu recorrido Slim de 28 días.',
                      style: LuckdateTextStyles.bodySmall,
                    ),
                    const SizedBox(height: LuckdateSpacing.md),
                    LdPrimaryButton(
                      label: 'Confirmar recepción',
                      onPressed: () {
                        ref.read(appStateProvider.notifier).confirmReceipt();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('¡El plan comenzó: bienvenida al día 1!'),
                          ),
                        );
                        context.go('/plan');
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: LuckdateSpacing.lg),
            ],
            if (profile.userPlanType == UserPlanType.mealReplacement) ...[
              _sectionTitle('Mi recorrido'),
              _tile(
                Icons.explore_outlined,
                'Recorrido Slim de 28 días',
                'Fase: ${journey.phase} · Día ${journey.day}',
              ),
              const SizedBox(height: LuckdateSpacing.lg),
            ],
            _sectionTitle('Ajustes'),
            _settingsTile(
              context,
              Icons.straighten,
              'Unidades',
              '${profile.weightUnit} / ${profile.heightUnit}',
              showChevron: false,
            ),
            _settingsTile(
              context,
              Icons.language,
              'Idioma',
              'Español (México)',
              showChevron: false,
            ),
            _settingsTile(
              context,
              Icons.notifications_outlined,
              'Recordatorios',
              profile.userPlanType == UserPlanType.mealReplacement
                  ? '${profile.reminderTime} / ${profile.reminderTime2}'
                  : profile.reminderTime,
              onTap: () => context.push('/profile/reminders'),
            ),
            _settingsTile(
              context,
              Icons.privacy_tip_outlined,
              'Privacidad y aviso de salud',
              'Ver',
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            _sectionTitle('Pedidos y logros'),
            _settingsTile(
              context,
              Icons.link_outlined,
              'Pedido vinculado',
              profile.linkedOrderNo.isEmpty
                  ? 'Sin pedido vinculado'
                  : profile.linkedOrderNo,
              onTap: () => context.push('/link-order'),
            ),
            _settingsTile(
              context,
              Icons.emoji_events_outlined,
              'Logros',
              '${journey.unlockedMilestones.length} insignias',
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: OutlinedButton.icon(
                onPressed: () => _confirmSignOut(context, ref),
                icon: const Icon(Icons.logout_rounded, size: 20),
                label: Text(
                  'Cerrar sesión',
                  style: LuckdateTextStyles.body.copyWith(
                    fontWeight: FontWeight.w600,
                    color: LuckdateColors.errorSoft,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: LuckdateColors.errorSoft,
                  backgroundColor: LuckdateColors.ivoryWhite,
                  side: const BorderSide(
                    color: LuckdateColors.errorSoft,
                    width: 1.5,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                  ),
                ),
              ),
            ),
            if (kDebugMode) ...[
              const SizedBox(height: LuckdateSpacing.xl),
              _sectionTitle('Controles de demostración'),
              Text(
                'Cambia el día del recorrido para presentaciones',
                style: LuckdateTextStyles.bodySmall,
              ),
              const SizedBox(height: LuckdateSpacing.md),
              Row(
                children: [
                  Expanded(
                    child: _dayBtn(ref, DemoDay.day1, 'Día 1', state.demoDay),
                  ),
                  const SizedBox(width: LuckdateSpacing.sm),
                  Expanded(
                    child: _dayBtn(ref, DemoDay.day12, 'Día 12', state.demoDay),
                  ),
                  const SizedBox(width: LuckdateSpacing.sm),
                  Expanded(
                    child: _dayBtn(ref, DemoDay.day28, 'Día 28', state.demoDay),
                  ),
                ],
              ),
              const SizedBox(height: LuckdateSpacing.md),
              Row(
                children: [
                  Expanded(
                    child: LdSecondaryButton(
                      label: 'Mostrar carga',
                      onPressed: () => ref
                          .read(appStateProvider.notifier)
                          .toggleLoadingDemo(true),
                    ),
                  ),
                  const SizedBox(width: LuckdateSpacing.sm),
                  Expanded(
                    child: LdSecondaryButton(
                      label: 'Mostrar error',
                      onPressed: () => ref
                          .read(appStateProvider.notifier)
                          .toggleErrorDemo(true),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: LuckdateSpacing.xl),
              LdSecondaryButton(
                label: 'Reiniciar bienvenida',
                onPressed: () {
                  ref
                      .read(appStateProvider.notifier)
                      .updateProfile(
                        profile.copyWith(onboardingComplete: false),
                      );
                  context.go('/onboarding');
                },
              ),
            ],
          ],
        ),
    );

    if (rootTab) {
      return Scaffold(
        backgroundColor: LuckdateColors.cloudIvory,
        body: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.sm,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.md,
                ),
                child: Center(
                  child: Text('Yo', style: LuckdateTextStyles.title),
                ),
              ),
              Expanded(child: page),
            ],
          ),
        ),
      );
    }

    return LdScaffold(
      title: 'Yo',
      showBack: true,
      body: page,
    );
  }

  Widget _quickMenuItem(IconData icon, String label, VoidCallback onTap) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(LuckdateRadius.sm),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, color: LuckdateColors.deepSage, size: 20),
              const SizedBox(height: 4),
              Text(
                label,
                style: LuckdateTextStyles.caption.copyWith(fontSize: 11),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: Text(title, style: LuckdateTextStyles.title),
    );
  }

  Widget _tile(IconData icon, String title, String subtitle) {
    return LdCard(
      child: Row(
        children: [
          Icon(icon, color: LuckdateColors.deepSage),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: LuckdateTextStyles.body.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(subtitle, style: LuckdateTextStyles.caption),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _settingsTile(
    BuildContext context,
    IconData icon,
    String title,
    String value, {
    VoidCallback? onTap,
    bool showChevron = true,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: LdCard(
        onTap:
            onTap ??
            () {
              if (title.contains('aviso')) {
                showDialog<void>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Aviso de salud'),
                    content: const Text(
                      'luckdate brinda acompañamiento para el estilo de vida y el uso de productos. No proporciona diagnósticos ni tratamientos médicos. Consulta a un profesional si tienes alguna condición de salud, estás embarazada o tomas medicamentos.',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx),
                        child: const Text('Aceptar'),
                      ),
                    ],
                  ),
                );
              }
            },
        child: Row(
          children: [
            Icon(icon, color: LuckdateColors.deepSage, size: 22),
            const SizedBox(width: LuckdateSpacing.md),
            Expanded(child: Text(title, style: LuckdateTextStyles.body)),
            Text(value, style: LuckdateTextStyles.caption),
            if (showChevron)
              const Icon(
                Icons.chevron_right,
                size: 20,
                color: LuckdateColors.textSecondary,
              ),
          ],
        ),
      ),
    );
  }

  Widget _dayBtn(WidgetRef ref, DemoDay day, String label, DemoDay current) {
    return LdSecondaryButton(
      label: label,
      selected: current == day,
      onPressed: () => ref.read(appStateProvider.notifier).switchDemoDay(day),
    );
  }

  String _profileSubtitle(UserProfile profile, JourneyState journey) {
    if (profile.isAwaitingReceipt) {
      final name = profile.linkedProductName.isEmpty
          ? 'Solar Protein™'
          : profile.linkedProductName;
      return 'Esperando la entrega de $name';
    }
    return switch (profile.userPlanType) {
      UserPlanType.mealReplacement => 'Día ${journey.day} · Recorrido Slim',
      UserPlanType.nonMealReplacement => 'Plan de recordatorios del producto',
      UserPlanType.noProduct => 'Modo de seguimiento básico',
    };
  }

  void _confirmSignOut(BuildContext context, WidgetRef ref) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('¿Cerrar sesión?'),
        content: const Text('Puedes volver a iniciar sesión cuando quieras.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              ref.read(appStateProvider.notifier).clearLoginSession();
              context.go('/login');
            },
            child: Text(
              'Cerrar sesión',
              style: LuckdateTextStyles.body.copyWith(
                color: LuckdateColors.errorSoft,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
