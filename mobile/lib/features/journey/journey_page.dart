import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';

class JourneyPage extends ConsumerWidget {
  const JourneyPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    final journey = state.journey;
    final scores = journey.vitalityScores;
    final milestonesAsync = ref.watch(milestonesProvider);

    return LdScaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          children: [
            Text('30-Day Journey', style: LuckdateTextStyles.h1),
            const SizedBox(height: LuckdateSpacing.xl),
            Center(
              child: LdProgressRing(
                percent: journey.completionPercent.toDouble(),
                centerLabel: '${journey.completionPercent}%',
                subLabel: 'Day ${journey.day} / ${journey.totalDays}',
              ),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(journey.themeEn, style: LuckdateTextStyles.title),
            Text(journey.encouragement, style: LuckdateTextStyles.bodySmall, textAlign: TextAlign.center),
            const SizedBox(height: LuckdateSpacing.xl),
            Row(
              children: [
                Expanded(child: VitalityMetricCard(label: 'Days', value: '${journey.day}', subtitle: 'Current')),
                const SizedBox(width: 8),
                Expanded(child: VitalityMetricCard(label: 'Vitality', value: '${scores.dailyVitality}', subtitle: 'Today')),
                const SizedBox(width: 8),
                Expanded(child: VitalityMetricCard(label: 'Ritual', value: '${scores.ritualCompletion}%', subtitle: 'Done')),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Align(
              alignment: Alignment.centerLeft,
              child: Text('Phase: ${journey.phase}', style: LuckdateTextStyles.h2),
            ),
            const SizedBox(height: LuckdateSpacing.md),
            _phaseCard('Launch', 'Days 1-7', journey.day <= 7),
            _phaseCard('Adaptation', 'Days 8-14', journey.day > 7 && journey.day <= 14),
            _phaseCard('Stability', 'Days 15-21', journey.day > 14 && journey.day <= 21),
            _phaseCard('Completion', 'Days 22-30', journey.day > 21),
            const SizedBox(height: LuckdateSpacing.xl),
            Align(alignment: Alignment.centerLeft, child: Text('Day Map', style: LuckdateTextStyles.h2)),
            const SizedBox(height: LuckdateSpacing.md),
            _dayMap(journey),
            const SizedBox(height: LuckdateSpacing.xl),
            Align(alignment: Alignment.centerLeft, child: Text('Vitality Dashboard', style: LuckdateTextStyles.h2)),
            const SizedBox(height: LuckdateSpacing.md),
            Row(
              children: [
                Expanded(child: VitalityMetricCard(label: 'Hydration', value: '${scores.hydrationScore}%', subtitle: 'Progress')),
                const SizedBox(width: 8),
                Expanded(child: VitalityMetricCard(label: 'Sleep', value: '${scores.sleepScore}', subtitle: 'Recovery')),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            Row(
              children: [
                Expanded(child: VitalityMetricCard(label: 'Mood', value: '${scores.moodCheckScore}', subtitle: 'Feedback')),
                const SizedBox(width: 8),
                Expanded(child: VitalityMetricCard(label: 'Consistency', value: '${scores.consistencyScore}%', subtitle: '7-day')),
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
                        color: LuckdateColors.vitalitySage.withValues(alpha: 0.2),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Align(alignment: Alignment.centerLeft, child: Text('Milestones', style: LuckdateTextStyles.h2)),
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
            if (journey.day >= 30) ...[
              const SizedBox(height: LuckdateSpacing.xl),
              LdPrimaryButton(
                label: 'View Day 30 Report',
                onPressed: () => context.push('/journey/report'),
              ),
            ],
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
              color: active ? LuckdateColors.sunGold : LuckdateColors.textSecondary,
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
      children: List.generate(30, (i) {
        final status = journey.dayStatuses[i];
        final isMilestone = [6, 13, 20, 27, 29].contains(i);
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
              ? Icon(Icons.star, size: 14, color: status == 'open' ? LuckdateColors.textSecondary : LuckdateColors.ivoryWhite)
              : Center(
                  child: Text(
                    '${i + 1}',
                    style: LuckdateTextStyles.caption.copyWith(
                      color: status == 'open' ? LuckdateColors.textSecondary : LuckdateColors.ivoryWhite,
                      fontSize: 9,
                    ),
                  ),
                ),
        );
      }),
    );
  }
}

class Day30ReportPage extends ConsumerWidget {
  const Day30ReportPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return LdScaffold(
      title: 'Day 30 Report',
      showBack: true,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          children: [
            const Icon(Icons.emoji_events_rounded, size: 64, color: LuckdateColors.sunGold),
            const SizedBox(height: LuckdateSpacing.base),
            Text('You grew toward the light', style: LuckdateTextStyles.display, textAlign: TextAlign.center),
            const SizedBox(height: LuckdateSpacing.xl),
            VitalityMetricCard(label: 'Completion', value: '87%', subtitle: 'Ritual completion rate'),
            const SizedBox(height: LuckdateSpacing.sm),
            VitalityMetricCard(label: 'Days active', value: '26', subtitle: 'Days with records'),
            const SizedBox(height: LuckdateSpacing.sm),
            VitalityMetricCard(label: 'Vitality change', value: '+18%', subtitle: 'From Day 1 to Day 30'),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              child: Column(
                children: [
                  const LdSunnyAvatar(size: 56),
                  const SizedBox(height: LuckdateSpacing.md),
                  Text(
                    'Freya, 30 days of gentle steps. You did not chase perfection — you built a rhythm. Ready for your next journey?',
                    style: LuckdateTextStyles.body,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            LdPrimaryButton(
              label: 'Explore Next Journey',
              onPressed: () => context.go('/collection'),
            ),
          ],
        ),
      ),
    );
  }
}
