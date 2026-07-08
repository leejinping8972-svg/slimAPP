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
              Consistency5DayStrip(values: consistency5d),
              const SizedBox(height: 6),
              Text('Last 5 days', style: LuckdateTextStyles.caption),
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
              Text(value, style: LuckdateTextStyles.title.copyWith(fontSize: 16)),
            ],
          ),
        ),
        const SizedBox(height: 6),
        Text(label, style: LuckdateTextStyles.caption),
        Text(subtitle, style: LuckdateTextStyles.caption, textAlign: TextAlign.center),
      ],
    );
  }
}

class Consistency5DayStrip extends StatelessWidget {
  const Consistency5DayStrip({super.key, required this.values});

  final List<bool> values;

  @override
  Widget build(BuildContext context) {
    final items = values.length >= 5 ? values.sublist(values.length - 5) : values;
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (i) {
        final checked = i < items.length && items[i];
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 3),
          child: Icon(
            checked ? Icons.check_circle : Icons.cancel_outlined,
            size: 18,
            color: checked ? LuckdateColors.deepSage : LuckdateColors.lineSoft,
          ),
        );
      }),
    );
  }
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
                  getDrawingHorizontalLine: (_) => const FlLine(color: LuckdateColors.lineSoft, strokeWidth: 1),
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
                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                ),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: weights.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value)).toList(),
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
