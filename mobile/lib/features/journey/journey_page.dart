import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/journey_outcome_helper.dart';

class ViajePage extends ConsumerWidget {
  const ViajePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    final profile = state.profile;

    if (profile.isAwaitingReceipt) {
      return LdScaffold(
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(LuckdateSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(child: Text('Viaje', style: LuckdateTextStyles.h1)),
                  _ProfileEntryAvatar(nickname: profile.nickname),
                ],
              ),
              const SizedBox(height: LuckdateSpacing.md),
              Text(
                'Tu plan est谩 listo: confirma la entrega para iniciar el d铆a 1.',
                style: LuckdateTextStyles.body,
              ),
              const SizedBox(height: LuckdateSpacing.xl),
              LdAwaitingReceiptPanel(
                productName: profile.linkedProductName,
                onConfirmReceipt: () {
                  ref.read(appStateProvider.notifier).confirmReceipt();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        '隆Plan iniciado! Te damos la bienvenida al d铆a 1.',
                      ),
                    ),
                  );
                  context.go('/plan');
                },
                onViewOverview: () => context.push('/plan/intro'),
              ),
            ],
          ),
        ),
      );
    }

    if (profile.userPlanType != UserPlanType.mealReplacement) {
      return LdScaffold(
        body: Padding(
          padding: const EdgeInsets.all(LuckdateSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(child: Text('Viaje', style: LuckdateTextStyles.h1)),
                  _ProfileEntryAvatar(nickname: profile.nickname),
                ],
              ),
              const SizedBox(height: LuckdateSpacing.md),
              Text(
                profile.userPlanType == UserPlanType.noProduct
                    ? 'A煤n no tienes un plan de 28 d铆as. Explora productos en la tienda o sigue registrando en Ritual.'
                    : 'Tu plan de recordatorios del producto est谩 activo. Hay un recorrido Slim completo de 28 d铆as disponible con productos de reemplazo de comida.',
                style: LuckdateTextStyles.body,
              ),
              const SizedBox(height: LuckdateSpacing.xl),
              LdPrimaryButton(
                label: 'Explorar productos',
                onPressed: () => context.go('/mall'),
              ),
            ],
          ),
        ),
      );
    }

    final journey = state.journey;
    final scores = journey.vitalityScores;
    final milestonesAsync = ref.watch(milestonesProvider);

    return LdScaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Recorrido de 28 d铆as',
                    style: LuckdateTextStyles.h1,
                  ),
                ),
                _ProfileEntryAvatar(nickname: profile.nickname),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Center(
              child: LdProgressRing(
                percent: journey.completionPercent.toDouble(),
                centerLabel: '${journey.completionPercent}%',
                subLabel: 'D铆a ${journey.day} / ${journey.totalDays}',
              ),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(journey.themeEn, style: LuckdateTextStyles.title),
            Text(
              journey.encouragement,
              style: LuckdateTextStyles.bodySmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Row(
              children: [
                Expanded(
                  child: VitalityMetricCard(
                    label: 'D铆as',
                    value: '${journey.day}',
                    subtitle: 'Actual',
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: VitalityMetricCard(
                    label: 'Vitalidad',
                    value: '${scores.dailyVitality}',
                    subtitle: 'Hoy',
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: VitalityMetricCard(
                    label: 'Ritual',
                    value: '${scores.ritualCompletion}%',
                    subtitle: 'Listo',
                  ),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Fase: ${journey.phase}',
                style: LuckdateTextStyles.h2,
              ),
            ),
            const SizedBox(height: LuckdateSpacing.md),
            _phaseCard('Inicio', 'Dias 1-7', journey.day <= 7),
            _phaseCard(
              'Adaptaci贸n',
              'Dias 8-14',
              journey.day > 7 && journey.day <= 14,
            ),
            _phaseCard(
              'Estabilidad',
              'Dias 15-21',
              journey.day > 14 && journey.day <= 21,
            ),
            _phaseCard('Finalizacion', 'Dias 22-28', journey.day > 21),
            const SizedBox(height: LuckdateSpacing.xl),
            Align(
              alignment: Alignment.centerLeft,
              child: Text('Mapa de d铆as', style: LuckdateTextStyles.h2),
            ),
            const SizedBox(height: LuckdateSpacing.md),
            _dayMap(journey),
            const SizedBox(height: LuckdateSpacing.sm),
            Row(
              children: [
                _legendDot(LuckdateColors.deepSage, 'Completado'),
                const SizedBox(width: LuckdateSpacing.md),
                _legendDot(LuckdateColors.sunGold, 'Hoy'),
                const SizedBox(width: LuckdateSpacing.md),
                _legendDot(
                  LuckdateColors.lineSoft.withValues(alpha: 0.8),
                  'Pr贸ximamente',
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Align(
              alignment: Alignment.centerLeft,
              child: Text('Panel de vitalidad', style: LuckdateTextStyles.h2),
            ),
            const SizedBox(height: LuckdateSpacing.md),
            Row(
              children: [
                Expanded(
                  child: VitalityMetricCard(
                    label: 'Hidrataci贸n',
                    value: '${scores.hydrationScore}%',
                    subtitle: 'Progreso',
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: VitalityMetricCard(
                    label: 'Sue帽o',
                    value: '${scores.sleepScore}',
                    subtitle: 'Recuperaci贸n',
                  ),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Row(
              children: [
                Expanded(
                  child: VitalityMetricCard(
                    label: '脕nimo',
                    value: '${scores.moodCheckScore}',
                    subtitle: 'Comentarios nocturnos',
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: VitalityMetricCard(
                    label: 'Constancia',
                    value: '${scores.consistencyScore}%',
                    subtitle: '5 d铆as',
                  ),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            SizedBox(
              height: 160,
              child: LineChart(
                LineChartData(
                  gridData: const FlGridData(show: false),
                  titlesData: const FlTitlesData(show: false),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    LineChartBarData(
                      spots: journey.vitalityTrend
                          .asMap()
                          .entries
                          .where((e) => e.value > 0)
                          .map((e) => FlSpot(e.key.toDouble(), e.value))
                          .toList(),
                      isCurved: true,
                      color: LuckdateColors.deepSage,
                      barWidth: 3,
                      dotData: const FlDotData(show: false),
                      belowBarData: BarAreaData(
                        show: true,
                        color: LuckdateColors.vitalitySage.withValues(
                          alpha: 0.2,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Align(
              alignment: Alignment.centerLeft,
              child: Text('Hitos', style: LuckdateTextStyles.h2),
            ),
            const SizedBox(height: LuckdateSpacing.md),
            milestonesAsync.when(
              data: (list) => Column(
                children: list.map((m) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
                    child: BadgeCard(
                      day: m.day,
                      title: m.title,
                      description: m.description,
                      unlocked: m.unlocked,
                    ),
                  );
                }).toList(),
              ),
              loading: () => const StatePlaceholder(type: 'loading'),
              error: (_, __) => const StatePlaceholder(type: 'error'),
            ),
            if (journey.day >= 28) ...[
              const SizedBox(height: LuckdateSpacing.xl),
              LdPrimaryButton(
                label: 'Ver informe del d铆a 28',
                onPressed: () => context.push('/journey/report'),
              ),
            ],
            const SizedBox(height: LuckdateSpacing.lg),
            LdCard(
              onTap: () => context.go('/mall'),
              child: Row(
                children: [
                  const Icon(
                    Icons.local_mall_outlined,
                    color: LuckdateColors.deepSage,
                    size: 28,
                  ),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Recomendaciones de productos',
                          style: LuckdateTextStyles.title,
                        ),
                        Text(
                          'Nutrition picks tailored to your rhythm鈥攌eep building momentum.',
                          style: LuckdateTextStyles.bodySmall,
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.chevron_right,
                    color: LuckdateColors.textSecondary,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _phaseCard(String name, String range, bool active) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: LdCard(
        completed: active,
        child: Row(
          children: [
            Icon(
              active ? Icons.wb_sunny_rounded : Icons.wb_sunny_outlined,
              color: active
                  ? LuckdateColors.sunGold
                  : LuckdateColors.textSecondary,
            ),
            const SizedBox(width: LuckdateSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: LuckdateTextStyles.title),
                  Text(range, style: LuckdateTextStyles.caption),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _dayMap(dynamic journey) {
    return Wrap(
      spacing: 6,
      runSpacing: 6,
      children: List.generate(28, (i) {
        final status = journey.dayStatuses[i];
        final isMilestone = [0, 13, 20, 27].contains(i);
        Color color;
        if (status == 'completed') {
          color = LuckdateColors.deepSage;
        } else if (status == 'today') {
          color = LuckdateColors.sunGold;
        } else {
          color = LuckdateColors.lineSoft;
        }
        return Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: color.withValues(alpha: status == 'open' ? 0.4 : 1),
            shape: BoxShape.circle,
          ),
          child: isMilestone
              ? Icon(
                  Icons.star,
                  size: 14,
                  color: status == 'open'
                      ? LuckdateColors.textSecondary
                      : LuckdateColors.ivoryWhite,
                )
              : Center(
                  child: Text(
                    '${i + 1}',
                    style: LuckdateTextStyles.caption.copyWith(
                      color: status == 'open'
                          ? LuckdateColors.textSecondary
                          : LuckdateColors.ivoryWhite,
                      fontSize: 9,
                    ),
                  ),
                ),
        );
      }),
    );
  }
}

class Day28ReportPage extends ConsumerWidget {
  const Day28ReportPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    final journey = state.journey;
    final profile = state.profile;
    final offer = JourneyOutcomeHelper.resolve(
      profile: profile,
      journey: journey,
    );
    final startVitality = journey.vitalityTrend.isNotEmpty
        ? journey.vitalityTrend.first
        : 0.0;
    final endVitality =
        journey.day > 0 && journey.vitalityTrend.length >= journey.day
        ? journey.vitalityTrend[journey.day - 1]
        : journey.vitalityScores.dailyVitality.toDouble();
    final vitalityChange = (endVitality - startVitality).round();
    final activeDays = journey.dayStatuses
        .where((status) => status == 'completed' || status == 'today')
        .length;

    return LdScaffold(
      title: 'Informe del d铆a 28',
      showBack: true,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          children: [
            const Icon(
              Icons.emoji_events_rounded,
              size: 64,
              color: LuckdateColors.sunGold,
            ),
            const SizedBox(height: LuckdateSpacing.base),
            Text(
              'Creciste hacia la luz',
              style: LuckdateTextStyles.display,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            VitalityMetricCard(
              label: 'Completitud',
              value: '${journey.completionPercent}%',
              subtitle: 'Tasa de finalizaci贸n de rituales',
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            VitalityMetricCard(
              label: 'D铆as activos',
              value: '$activeDays',
              subtitle: 'D铆as con registros',
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            VitalityMetricCard(
              label: 'Cambio de vitalidad',
              value: '${vitalityChange >= 0 ? '+' : ''}$vitalityChange',
              subtitle: 'Del d铆a 1 al d铆a ${journey.day}',
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              child: Column(
                children: [
                  const LdSunnyAvatar(size: 56),
                  const SizedBox(height: LuckdateSpacing.md),
                  Text(
                    '${profile.nickname}, 28 dias de pasos suaves. No buscaste la perfeccion; construiste un ritmo.',
                    style: LuckdateTextStyles.body,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Tu pr贸ximo viaje', style: LuckdateTextStyles.title),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(offer.title, style: LuckdateTextStyles.h2),
                  const SizedBox(height: LuckdateSpacing.sm),
                  Text(offer.subtitle, style: LuckdateTextStyles.bodySmall),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdPrimaryButton(
              label: offer.primaryLabel,
              onPressed: () => context.push(
                '/collection/product/${offer.primaryProductId}',
              ),
            ),
            if (offer.secondaryProductIds.isNotEmpty) ...[
              const SizedBox(height: LuckdateSpacing.sm),
              LdSecondaryButton(
                label: 'Explorar m谩s opciones',
                onPressed: () => context.go('/mall'),
              ),
            ],
            const SizedBox(height: LuckdateSpacing.sm),
            LdSecondaryButton(
              label: 'Ahora no',
              onPressed: () => context.pop(),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileEntryAvatar extends StatelessWidget {
  const _ProfileEntryAvatar({required this.nickname});

  final String nickname;

  @override
  Widget build(BuildContext context) {
    return LdProfileAvatar(
      nickname: nickname,
      radius: 18,
      onTap: () => context.push('/profile'),
    );
  }
}

Widget _legendDot(Color color, String label) {
  return Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Container(
        width: 10,
        height: 10,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      ),
      const SizedBox(width: 4),
      Text(label, style: LuckdateTextStyles.caption),
    ],
  );
}

