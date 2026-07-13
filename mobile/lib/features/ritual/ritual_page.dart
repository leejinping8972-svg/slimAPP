import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ritual_sheets.dart';
import '../../core/widgets/today_widgets.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/vitality_scorer.dart';

enum _VitalityRange { today, week, month, quarter }

class RitualPage extends ConsumerStatefulWidget {
  const RitualPage({super.key});

  @override
  ConsumerState<RitualPage> createState() => _RitualPageState();
}

class _RitualPageState extends ConsumerState<RitualPage> {
  _VitalityRange _range = _VitalityRange.today;
  int _focusIndex = 0;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStateProvider);
    final journey = state.journey;
    final profile = state.profile;
    final scores = journey.vitalityScores;
    final breakdown = VitalityScorer.breakdown(scores);
    final trend = _trendForRange(journey, _range);
    final yesterdayDelta = _yesterdayDelta(journey);

    return LdScaffold(
      title: 'My Vitality Score',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _RangeSelector(
              selected: _range,
              onChanged: (v) => setState(() => _range = v),
            ),
            const SizedBox(height: LuckdateSpacing.lg),
            LdCard(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  LdProgressRing(
                    percent: scores.dailyVitality.toDouble(),
                    centerLabel: '${scores.dailyVitality}',
                    subLabel: VitalityScorer.vitalityLabel(scores.dailyVitality),
                    size: 120,
                  ),
                  const SizedBox(width: LuckdateSpacing.lg),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'You\'re doing amazing! ☀️',
                          style: LuckdateTextStyles.title,
                        ),
                        const SizedBox(height: LuckdateSpacing.sm),
                        Text(
                          'Keep your daily rituals, build your long-term vitality.',
                          style: LuckdateTextStyles.bodySmall,
                        ),
                        const SizedBox(height: LuckdateSpacing.md),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: LuckdateColors.ivoryWhite,
                            borderRadius:
                                BorderRadius.circular(LuckdateRadius.pill),
                            border: Border.all(color: LuckdateColors.lineSoft),
                          ),
                          child: Text(
                            'Score Insights →',
                            style: LuckdateTextStyles.caption.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(height: LuckdateSpacing.md),
                        Text(
                          yesterdayDelta >= 0
                              ? 'Compared to yesterday ↑ $yesterdayDelta pts'
                              : 'Compared to yesterday ↓ ${yesterdayDelta.abs()} pts',
                          style: LuckdateTextStyles.caption.copyWith(
                            color: yesterdayDelta >= 0
                                ? LuckdateColors.deepSage
                                : LuckdateColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Row(
              children: [
                Text('Score Trend', style: LuckdateTextStyles.h2),
                const Spacer(),
                Text(
                  _rangeLabel(_range),
                  style: LuckdateTextStyles.caption,
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.md),
            SizedBox(
              height: 160,
              child: trend.isEmpty
                  ? const Center(child: Text('No trend data yet'))
                  : LineChart(
                      LineChartData(
                        minY: 0,
                        maxY: 100,
                        gridData: const FlGridData(show: false),
                        titlesData: const FlTitlesData(show: false),
                        borderData: FlBorderData(show: false),
                        lineBarsData: [
                          LineChartBarData(
                            spots: trend
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
                              color: LuckdateColors.vitalitySage
                                  .withValues(alpha: 0.2),
                            ),
                          ),
                        ],
                      ),
                    ),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Row(
              children: [
                Text('Score Breakdown', style: LuckdateTextStyles.h2),
                const Spacer(),
                Text(
                  'Learn More ⓘ',
                  style: LuckdateTextStyles.caption.copyWith(
                    color: LuckdateColors.deepSage,
                  ),
                ),
              ],
            ),
            const SizedBox(height: LuckdateSpacing.md),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: breakdown.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
                childAspectRatio: 0.72,
              ),
              itemBuilder: (context, index) {
                final dim = breakdown[index];
                return _BreakdownTile(dimension: dim);
              },
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Text('Today\'s Focus', style: LuckdateTextStyles.h2),
            const SizedBox(height: LuckdateSpacing.md),
            _FocusCarousel(
              index: _focusIndex,
              onChanged: (i) => setState(() => _focusIndex = i),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            ConsistencyCalendarCard(
              consistency5d: journey.consistency5d,
              consistencyScore: scores.consistencyScore,
              journeyDay: journey.day,
              planType: profile.userPlanType,
              todayRecord: journey.todayRecord,
              weightTrend: journey.weightTrend,
              onDayTap: (index, date, dayRecord) => showDayCheckInSheet(
                context,
                date: date,
                journeyDay: journey.day - (4 - index),
                record: dayRecord,
                planType: profile.userPlanType,
                isToday: index == 4,
              ),
            ),
            if (journey.weightTrend.isNotEmpty) ...[
              const SizedBox(height: LuckdateSpacing.lg),
              WeightTrendCard(
                weights: journey.weightTrend,
                targetKg: profile.targetWeightKg,
              ),
            ],
            const SizedBox(height: LuckdateSpacing.lg),
            LdCard(
              child: Row(
                children: [
                  const Icon(
                    Icons.eco_outlined,
                    color: LuckdateColors.deepSage,
                  ),
                  const SizedBox(width: LuckdateSpacing.md),
                  Expanded(
                    child: Text(
                      'Your body is in balance and your habits are on track. Consistency is your superpower.',
                      style: LuckdateTextStyles.bodySmall,
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text('Share'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<double> _trendForRange(JourneyState journey, _VitalityRange range) {
    final full = journey.vitalityTrend.where((v) => v > 0).toList();
    if (full.isEmpty) return const [];
    return switch (range) {
      _VitalityRange.today => full.length >= 1 ? [full.last] : full,
      _VitalityRange.week => full.length > 7 ? full.sublist(full.length - 7) : full,
      _VitalityRange.month =>
        full.length > 28 ? full.sublist(full.length - 28) : full,
      _VitalityRange.quarter =>
        full.length > 28 ? full.sublist(full.length - 28) : full,
    };
  }

  int _yesterdayDelta(JourneyState journey) {
    final trend = journey.vitalityTrend.where((v) => v > 0).toList();
    if (trend.length < 2) return 0;
    return (trend.last - trend[trend.length - 2]).round();
  }

  String _rangeLabel(_VitalityRange range) => switch (range) {
        _VitalityRange.today => 'Today',
        _VitalityRange.week => '7 Days',
        _VitalityRange.month => '30 Days',
        _VitalityRange.quarter => '90 Days',
      };
}

class _RangeSelector extends StatelessWidget {
  const _RangeSelector({required this.selected, required this.onChanged});

  final _VitalityRange selected;
  final ValueChanged<_VitalityRange> onChanged;

  @override
  Widget build(BuildContext context) {
    const options = [
      (_VitalityRange.today, 'Today'),
      (_VitalityRange.week, '7 Days'),
      (_VitalityRange.month, '30 Days'),
      (_VitalityRange.quarter, '90 Days'),
    ];
    return Row(
      children: options.map((opt) {
        final active = selected == opt.$1;
        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              right: opt.$1 != _VitalityRange.quarter ? 6 : 0,
            ),
            child: Material(
              color: active
                  ? LuckdateColors.deepSage
                  : LuckdateColors.ivoryWhite,
              borderRadius: BorderRadius.circular(LuckdateRadius.pill),
              child: InkWell(
                onTap: () => onChanged(opt.$1),
                borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: Text(
                    opt.$2,
                    textAlign: TextAlign.center,
                    style: LuckdateTextStyles.caption.copyWith(
                      color: active
                          ? LuckdateColors.ivoryWhite
                          : LuckdateColors.textSecondary,
                      fontWeight:
                          active ? FontWeight.w600 : FontWeight.w400,
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _BreakdownTile extends StatelessWidget {
  const _BreakdownTile({required this.dimension});

  final VitalityDimension dimension;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      accentColor:
          dimension.highlighted ? LuckdateColors.sunGold : null,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(dimension.icon, color: LuckdateColors.deepSage, size: 22),
          const SizedBox(height: 6),
          Text(
            dimension.label,
            style: LuckdateTextStyles.caption,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text('${dimension.score}', style: LuckdateTextStyles.title),
          Text(
            VitalityScorer.scoreRating(dimension.score),
            style: LuckdateTextStyles.caption,
          ),
        ],
      ),
    );
  }
}

class _FocusCarousel extends StatelessWidget {
  const _FocusCarousel({required this.index, required this.onChanged});

  final int index;
  final ValueChanged<int> onChanged;

  static const _items = [
    (
      'Energy & Focus',
      'Focus on quality nutrition and gentle movement to stay balanced and alert.',
    ),
    (
      'Hydration Rhythm',
      'Small, steady water breaks keep energy smooth through the afternoon.',
    ),
    (
      'Rest & Recovery',
      'Protect your sleep window — recovery is part of the ritual.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final item = _items[index];
    return Column(
      children: [
        LdCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Today\'s Focus',
                style: LuckdateTextStyles.caption.copyWith(
                  color: LuckdateColors.sunGold,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: LuckdateSpacing.sm),
              Text(item.$1, style: LuckdateTextStyles.h2),
              const SizedBox(height: LuckdateSpacing.sm),
              Text(item.$2, style: LuckdateTextStyles.bodySmall),
              const SizedBox(height: LuckdateSpacing.md),
              LdSecondaryButton(
                label: 'View Focus Plan',
                onPressed: () {},
              ),
            ],
          ),
        ),
        const SizedBox(height: LuckdateSpacing.sm),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_items.length, (i) {
            return GestureDetector(
              onTap: () => onChanged(i),
              child: Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: i == index
                      ? LuckdateColors.deepSage
                      : LuckdateColors.lineSoft,
                ),
              ),
            );
          }),
        ),
      ],
    );
  }
}
