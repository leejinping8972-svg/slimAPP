import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../shared/services/vitality_scorer.dart';
import 'ld_components.dart';

class TopMetricsRow extends StatelessWidget {
  const TopMetricsRow({
    super.key,
    required this.vitality,
    required this.ritualPercent,
    required this.consistency5d,
  });

  final int vitality;
  final int ritualPercent;
  final List<bool> consistency5d;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: _MetricRing(
            label: 'Vitality',
            value: '$vitality',
            subtitle: VitalityScorer.vitalityLabel(vitality),
            progress: vitality / 100,
          ),
        ),
        const SizedBox(width: LuckdateSpacing.sm),
        Expanded(
          child: _MetricRing(
            label: 'Ritual',
            value: '$ritualPercent%',
            subtitle: 'Today',
            progress: ritualPercent / 100,
          ),
        ),
        const SizedBox(width: LuckdateSpacing.sm),
        Expanded(
          child: Column(
            children: [
              Text('Consistency', style: LuckdateTextStyles.caption),
              const SizedBox(height: LuckdateSpacing.sm),
              Consistency7DayStrip(values: consistency5d),
              const SizedBox(height: 6),
              Text('Last 7 days', style: LuckdateTextStyles.caption),
            ],
          ),
        ),
      ],
    );
  }
}

class _MetricRing extends StatelessWidget {
  const _MetricRing({
    required this.label,
    required this.value,
    required this.subtitle,
    required this.progress,
  });

  final String label;
  final String value;
  final String subtitle;
  final double progress;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          width: 72,
          height: 72,
          child: Stack(
            alignment: Alignment.center,
            children: [
              CircularProgressIndicator(
                value: progress.clamp(0, 1),
                strokeWidth: 6,
                backgroundColor: LuckdateColors.lineSoft,
                color: LuckdateColors.sunGold,
              ),
              Text(
                value,
                style: LuckdateTextStyles.title.copyWith(fontSize: 16),
              ),
            ],
          ),
        ),
        const SizedBox(height: 6),
        Text(label, style: LuckdateTextStyles.caption),
        Text(
          subtitle,
          style: LuckdateTextStyles.caption,
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

class Consistency7DayStrip extends StatelessWidget {
  const Consistency7DayStrip({super.key, required this.values});

  final List<bool> values;

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final items = List<bool>.from(values);
    while (items.length < 7) {
      items.insert(0, false);
    }
    final week = items.length > 7 ? items.sublist(items.length - 7) : items;

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(7, (i) {
        final day = now.subtract(Duration(days: 6 - i));
        final completed = week[i];
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 2),
          child: Column(
            children: [
              Text(
                '${day.day}',
                style: LuckdateTextStyles.caption.copyWith(
                  fontSize: 10,
                  color: LuckdateColors.textSecondary,
                ),
              ),
              const SizedBox(height: 4),
              Container(
                width: 18,
                height: 18,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: completed
                      ? LuckdateColors.deepSage
                      : LuckdateColors.lineSoft.withValues(alpha: 0.5),
                  border: Border.all(
                    color: completed
                        ? LuckdateColors.deepSage
                        : LuckdateColors.lineSoft,
                  ),
                ),
                child: completed
                    ? const Icon(Icons.check, size: 11, color: Colors.white)
                    : null,
              ),
            ],
          ),
        );
      }),
    );
  }
}

/// Kept for older call sites.
class Consistency5DayStrip extends StatelessWidget {
  const Consistency5DayStrip({super.key, required this.values});

  final List<bool> values;

  @override
  Widget build(BuildContext context) => Consistency7DayStrip(values: values);
}

class WeightTrendCard extends StatelessWidget {
  const WeightTrendCard({
    super.key,
    required this.weights,
    required this.targetKg,
  });

  final List<double> weights;
  final double targetKg;

  @override
  Widget build(BuildContext context) {
    if (weights.isEmpty) return const SizedBox.shrink();
    final minY = (weights.reduce((a, b) => a < b ? a : b) - 1).floorToDouble();
    final maxY = (weights.reduce((a, b) => a > b ? a : b) + 1).ceilToDouble();

    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Weight trend', style: LuckdateTextStyles.title),
          const SizedBox(height: LuckdateSpacing.sm),
          Text(
            '${weights.last.toStringAsFixed(1)} kg · Target ${targetKg.toStringAsFixed(1)} kg',
            style: LuckdateTextStyles.bodySmall,
          ),
          const SizedBox(height: LuckdateSpacing.md),
          SizedBox(
            height: 140,
            child: LineChart(
              LineChartData(
                minY: minY,
                maxY: maxY,
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: 1,
                  getDrawingHorizontalLine: (_) => const FlLine(
                    color: LuckdateColors.lineSoft,
                    strokeWidth: 1,
                  ),
                ),
                titlesData: FlTitlesData(
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 36,
                      interval: 1,
                      getTitlesWidget: (value, _) => Text(
                        value.toStringAsFixed(0),
                        style: LuckdateTextStyles.caption,
                      ),
                    ),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 24,
                      getTitlesWidget: (value, _) => Text(
                        'D${value.toInt() + 1}',
                        style: LuckdateTextStyles.caption,
                      ),
                    ),
                  ),
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: weights
                        .asMap()
                        .entries
                        .map((e) => FlSpot(e.key.toDouble(), e.value))
                        .toList(),
                    isCurved: true,
                    color: LuckdateColors.deepSage,
                    barWidth: 3,
                    dotData: const FlDotData(show: true),
                    belowBarData: BarAreaData(
                      show: true,
                      color: LuckdateColors.vitalitySage.withValues(alpha: 0.2),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
