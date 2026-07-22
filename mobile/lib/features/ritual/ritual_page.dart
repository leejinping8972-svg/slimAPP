import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ld_shell.dart';
import '../../core/widgets/ritual_sheets.dart';
import '../../core/widgets/today_widgets.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/vitality_scorer.dart';

enum _VitalityRange { today, days28, days56, days84 }

class RitualPage extends ConsumerStatefulWidget {
  const RitualPage({super.key});

  @override
  ConsumerState<RitualPage> createState() => _RitualPageState();
}

class _RitualPageState extends ConsumerState<RitualPage> {
  _VitalityRange _range = _VitalityRange.today;
  _VitalityRange _trendRange = _VitalityRange.days28;
  int _focusIndex = 0;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStateProvider);
    final journey = state.journey;
    final profile = state.profile;
    final scores = journey.vitalityScores;
    final breakdown = VitalityScorer.breakdown(scores);
    final trend = _trendForRange(journey, _trendRange);
    final yesterdayDelta = _yesterdayDelta(journey);

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            _RitualHeader(
              onShare: () {},
              onChat: () => context.push('/home'),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.sm,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.xl,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _JourneyPlanCard(
                      profile: profile,
                      journey: journey,
                      onOpenPlan: () => context.push('/plan'),
                      onBrowseMall: () => context.go('/mall'),
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    LdSegmentedControl<_VitalityRange>(
                      options: const [
                        _VitalityRange.today,
                        _VitalityRange.days28,
                        _VitalityRange.days56,
                        _VitalityRange.days84,
                      ],
                      selected: _range,
                      onChanged: (v) => setState(() {
                        _range = v;
                        if (v != _VitalityRange.today) _trendRange = v;
                      }),
                      labelBuilder: _rangeLabel,
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    _ScoreOverviewCard(
                      score: scores.dailyVitality,
                      label: VitalityScorer.vitalityLabel(scores.dailyVitality),
                      yesterdayDelta: yesterdayDelta,
                      onInsights: () => context.push('/sunny/suggestions'),
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    _TrendCard(
                      range: _trendRange,
                      trend: trend,
                      onRangeTap: () => _cycleTrendRange(),
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    _BreakdownCard(
                      dimensions: breakdown,
                      onHabitsTap: () => context.push('/home'),
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    _FocusCarousel(
                      index: _focusIndex,
                      onChanged: (i) => setState(() => _focusIndex = i),
                      onViewPlan: () => context.push('/sunny/suggestions'),
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                    LdCard(
                      onTap: () => context.push('/record'),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: LuckdateColors.sageSoft,
                              borderRadius:
                                  BorderRadius.circular(LuckdateRadius.md),
                            ),
                            child: const Icon(
                              Icons.restaurant_menu_outlined,
                              color: LuckdateColors.deepSage,
                            ),
                          ),
                          const SizedBox(width: LuckdateSpacing.md),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Check-in Record',
                                  style: LuckdateTextStyles.title,
                                ),
                                Text(
                                  'Track meals, water, and daily nutrition.',
                                  style: LuckdateTextStyles.bodySmall,
                                ),
                              ],
                            ),
                          ),
                          const Icon(
                            Icons.chevron_right_rounded,
                            color: LuckdateColors.textSecondary,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
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
                    LdVitalityBanner(
                      message:
                          'Your body is in balance and your habits are on track. Consistency is your superpower.',
                      actionLabel: 'Share',
                      onAction: () {},
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _cycleTrendRange() {
    const order = [
      _VitalityRange.days28,
      _VitalityRange.days56,
      _VitalityRange.days84,
      _VitalityRange.today,
    ];
    final i = order.indexOf(_trendRange);
    setState(() => _trendRange = order[(i + 1) % order.length]);
  }

  List<double> _trendForRange(JourneyState journey, _VitalityRange range) {
    final full = journey.vitalityTrend.where((v) => v > 0).toList();
    if (full.isEmpty) return const [];
    return switch (range) {
      _VitalityRange.today => full.length >= 1 ? [full.last] : full,
      _VitalityRange.days28 =>
        full.length > 28 ? full.sublist(full.length - 28) : full,
      _VitalityRange.days56 =>
        full.length > 56 ? full.sublist(full.length - 56) : full,
      _VitalityRange.days84 =>
        full.length > 84 ? full.sublist(full.length - 84) : full,
    };
  }

  int _yesterdayDelta(JourneyState journey) {
    final trend = journey.vitalityTrend.where((v) => v > 0).toList();
    if (trend.length < 2) return 0;
    return (trend.last - trend[trend.length - 2]).round();
  }

  String _rangeLabel(_VitalityRange range) => switch (range) {
        _VitalityRange.today => 'Today',
        _VitalityRange.days28 => '28 Days',
        _VitalityRange.days56 => '56 Days',
        _VitalityRange.days84 => '84 Days',
      };
}

class _JourneyPlanCard extends StatelessWidget {
  const _JourneyPlanCard({
    required this.profile,
    required this.journey,
    required this.onOpenPlan,
    required this.onBrowseMall,
  });

  final UserProfile profile;
  final JourneyState journey;
  final VoidCallback onOpenPlan;
  final VoidCallback onBrowseMall;

  @override
  Widget build(BuildContext context) {
    if (profile.isAwaitingReceipt) {
      return LdCard(
        onTap: onOpenPlan,
        child: Row(
          children: [
            const Icon(Icons.inventory_2_outlined, color: LuckdateColors.deepSage),
            const SizedBox(width: LuckdateSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Waiting for receipt', style: LuckdateTextStyles.title),
                  Text(
                    'Confirm when your package arrives to start Day 1.',
                    style: LuckdateTextStyles.caption,
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      );
    }

    return switch (profile.userPlanType) {
      UserPlanType.mealReplacement => LdCard(
          onTap: onOpenPlan,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text('Your Plan', style: LuckdateTextStyles.title),
                  const Spacer(),
                  Text(
                    'Open →',
                    style: LuckdateTextStyles.caption.copyWith(
                      color: LuckdateColors.deepSage,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: LuckdateSpacing.sm),
              Text(
                '28-Day Slim Journey · Day ${journey.day}/${journey.totalDays}',
                style: LuckdateTextStyles.body.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: LuckdateSpacing.sm),
              ClipRRect(
                borderRadius: BorderRadius.circular(999),
                child: LinearProgressIndicator(
                  value: (journey.completionPercent / 100).clamp(0.0, 1.0),
                  minHeight: 8,
                  backgroundColor: LuckdateColors.lineSoft,
                  color: LuckdateColors.deepSage,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                '${journey.completionPercent}% complete',
                style: LuckdateTextStyles.caption,
              ),
            ],
          ),
        ),
      UserPlanType.nonMealReplacement => LdCard(
          onTap: onOpenPlan,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text('Product Care Plan', style: LuckdateTextStyles.title),
                  const Spacer(),
                  Text(
                    'Open →',
                    style: LuckdateTextStyles.caption.copyWith(
                      color: LuckdateColors.deepSage,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: LuckdateSpacing.sm),
              Text(
                profile.linkedProductName.isEmpty
                    ? 'Your linked product'
                    : profile.linkedProductName,
                style: LuckdateTextStyles.body.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Reminder: ${profile.reminderTime} & ${profile.reminderTime2}',
                style: LuckdateTextStyles.caption,
              ),
              const SizedBox(height: 4),
              Text(
                journey.todayRecord.productTaken == ProductTakenStatus.taken
                    ? 'Taken today ✓'
                    : 'Not logged yet today',
                style: LuckdateTextStyles.caption.copyWith(
                  color: LuckdateColors.deepSage,
                ),
              ),
            ],
          ),
        ),
      UserPlanType.noProduct => LdCard(
          onTap: onBrowseMall,
          child: Row(
            children: [
              const Icon(Icons.spa_outlined, color: LuckdateColors.deepSage),
              const SizedBox(width: LuckdateSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Start a plan', style: LuckdateTextStyles.title),
                    Text(
                      'Browse Mall or link an order to unlock your Journey plan.',
                      style: LuckdateTextStyles.caption,
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
    };
  }
}

class _RitualHeader extends StatelessWidget {
  const _RitualHeader({required this.onShare, required this.onChat});

  final VoidCallback onShare;
  final VoidCallback onChat;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        LuckdateSpacing.sm,
        LuckdateSpacing.sm,
        LuckdateSpacing.sm,
        LuckdateSpacing.md,
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: onChat,
            icon: const Icon(Icons.arrow_back_ios_new, size: 18),
            color: LuckdateColors.textPrimary,
            tooltip: 'Chat with Sunny',
          ),
          Expanded(
            child: Text(
              'My Vitality Score',
              textAlign: TextAlign.center,
              style: LuckdateTextStyles.title,
            ),
          ),
          IconButton(
            onPressed: onShare,
            icon: const Icon(Icons.ios_share_rounded, size: 20),
            color: LuckdateColors.textPrimary,
          ),
        ],
      ),
    );
  }
}

class _ScoreOverviewCard extends StatelessWidget {
  const _ScoreOverviewCard({
    required this.score,
    required this.label,
    required this.yesterdayDelta,
    required this.onInsights,
  });

  final int score;
  final String label;
  final int yesterdayDelta;
  final VoidCallback onInsights;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          LdScoreRing(
            score: score,
            label: label,
            size: 118,
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
                OutlinedButton(
                  onPressed: onInsights,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: LuckdateColors.textPrimary,
                    backgroundColor: LuckdateColors.ivoryWhite,
                    side: const BorderSide(color: LuckdateColors.lineSoft),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: Text(
                    'Score Insights >',
                    style: LuckdateTextStyles.caption.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: LuckdateSpacing.md),
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    yesterdayDelta >= 0
                        ? 'Compared to yesterday ↑ $yesterdayDelta pts'
                        : 'Compared to yesterday ↓ ${yesterdayDelta.abs()} pts',
                    style: LuckdateTextStyles.caption.copyWith(
                      color: yesterdayDelta >= 0
                          ? LuckdateColors.deepSage
                          : LuckdateColors.textSecondary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _TrendCard extends StatelessWidget {
  const _TrendCard({
    required this.range,
    required this.trend,
    required this.onRangeTap,
  });

  final _VitalityRange range;
  final List<double> trend;
  final VoidCallback onRangeTap;

  String get _rangeLabel => switch (range) {
        _VitalityRange.today => 'Today',
        _VitalityRange.days28 => '28 Days',
        _VitalityRange.days56 => '56 Days',
        _VitalityRange.days84 => '84 Days',
      };

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final labels = List.generate(
      trend.length,
      (i) {
        final d = now.subtract(Duration(days: trend.length - 1 - i));
        return DateFormat('M/d').format(d);
      },
    );

    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('Score Trend', style: LuckdateTextStyles.title),
              const Spacer(),
              InkWell(
                onTap: onRangeTap,
                borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(_rangeLabel, style: LuckdateTextStyles.caption),
                      const SizedBox(width: 2),
                      const Icon(
                        Icons.keyboard_arrow_down_rounded,
                        size: 18,
                        color: LuckdateColors.textSecondary,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.md),
          SizedBox(
            height: 180,
            child: trend.isEmpty
                ? Center(
                    child: Text(
                      'No trend data yet',
                      style: LuckdateTextStyles.bodySmall,
                    ),
                  )
                : LineChart(
                    LineChartData(
                      minY: 0,
                      maxY: 100,
                      gridData: FlGridData(
                        show: true,
                        drawVerticalLine: false,
                        horizontalInterval: 25,
                        getDrawingHorizontalLine: (_) => FlLine(
                          color: LuckdateColors.lineSoft.withValues(alpha: 0.7),
                          strokeWidth: 1,
                        ),
                      ),
                      titlesData: FlTitlesData(
                        topTitles: const AxisTitles(
                          sideTitles: SideTitles(showTitles: false),
                        ),
                        rightTitles: const AxisTitles(
                          sideTitles: SideTitles(showTitles: false),
                        ),
                        leftTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            reservedSize: 28,
                            interval: 25,
                            getTitlesWidget: (value, _) => Text(
                              value.toInt().toString(),
                              style: LuckdateTextStyles.caption.copyWith(
                                fontSize: 10,
                              ),
                            ),
                          ),
                        ),
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            reservedSize: 22,
                            interval: 1,
                            getTitlesWidget: (value, _) {
                              final i = value.toInt();
                              if (i < 0 || i >= labels.length) {
                                return const SizedBox.shrink();
                              }
                              final step = labels.length > 7
                                  ? (labels.length / 5).ceil()
                                  : 1;
                              if (i % step != 0 && i != labels.length - 1) {
                                return const SizedBox.shrink();
                              }
                              return Padding(
                                padding: const EdgeInsets.only(top: 4),
                                child: Text(
                                  labels[i],
                                  style: LuckdateTextStyles.caption.copyWith(
                                    fontSize: 10,
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                      borderData: FlBorderData(show: false),
                      lineTouchData: LineTouchData(
                        touchTooltipData: LineTouchTooltipData(
                          getTooltipItems: (spots) => spots
                              .map(
                                (s) => LineTooltipItem(
                                  s.y.toStringAsFixed(0),
                                  LuckdateTextStyles.caption.copyWith(
                                    color: LuckdateColors.ivoryWhite,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              )
                              .toList(),
                        ),
                      ),
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
                          dotData: FlDotData(
                            show: true,
                            getDotPainter: (_, __, ___, ____) =>
                                FlDotCirclePainter(
                              radius: 3.5,
                              color: LuckdateColors.deepSage,
                              strokeWidth: 2,
                              strokeColor: LuckdateColors.ivoryWhite,
                            ),
                          ),
                          belowBarData: BarAreaData(
                            show: true,
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                LuckdateColors.vitalitySage
                                    .withValues(alpha: 0.35),
                                LuckdateColors.vitalitySage
                                    .withValues(alpha: 0.02),
                              ],
                            ),
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

class _BreakdownCard extends StatelessWidget {
  const _BreakdownCard({
    required this.dimensions,
    required this.onHabitsTap,
  });

  final List<VitalityDimension> dimensions;
  final VoidCallback onHabitsTap;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('Score Breakdown', style: LuckdateTextStyles.title),
              const Spacer(),
              Text(
                'Learn More ⓘ',
                style: LuckdateTextStyles.caption.copyWith(
                  color: LuckdateColors.deepSage,
                ),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.lg),
          LayoutBuilder(
            builder: (context, constraints) {
              final itemWidth = (constraints.maxWidth - 10) / 3;
              return Wrap(
                spacing: 5,
                runSpacing: LuckdateSpacing.md,
                children: dimensions.map((dim) {
                  return SizedBox(
                    width: itemWidth,
                    child: _BreakdownRing(
                      dimension: dim,
                      onTap: dim.key == 'habits' ? onHabitsTap : null,
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _BreakdownRing extends StatelessWidget {
  const _BreakdownRing({required this.dimension, this.onTap});

  final VitalityDimension dimension;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final color = dimension.highlighted
        ? LuckdateColors.sunGold
        : LuckdateColors.deepSage;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(LuckdateRadius.md),
      child: Column(
        children: [
          Icon(dimension.icon, color: color, size: 20),
          const SizedBox(height: 4),
          Text(
            dimension.label,
            style: LuckdateTextStyles.caption,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: 56,
            height: 56,
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 56,
                  height: 56,
                  child: CircularProgressIndicator(
                    value: dimension.score / 100,
                    strokeWidth: 5,
                    backgroundColor:
                        LuckdateColors.lineSoft.withValues(alpha: 0.55),
                    color: color,
                    strokeCap: StrokeCap.round,
                  ),
                ),
                Text(
                  '${dimension.score}',
                  style: LuckdateTextStyles.title.copyWith(fontSize: 14),
                ),
              ],
            ),
          ),
          const SizedBox(height: 4),
          Text(
            VitalityScorer.scoreRating(dimension.score),
            style: LuckdateTextStyles.caption.copyWith(
              color: color,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _FocusCarousel extends StatelessWidget {
  const _FocusCarousel({
    required this.index,
    required this.onChanged,
    required this.onViewPlan,
  });

  final int index;
  final ValueChanged<int> onChanged;
  final VoidCallback onViewPlan;

  static const _items = [
    (
      'Energy & Focus',
      'Focus on high-quality nutrition and effective exercise to stay balanced and improve concentration.',
      Icons.self_improvement_rounded,
    ),
    (
      'Hydration Rhythm',
      'Small, steady water breaks keep energy smooth through the afternoon.',
      Icons.water_drop_outlined,
    ),
    (
      'Rest & Recovery',
      'Protect your sleep window — recovery is part of the ritual.',
      Icons.bedtime_outlined,
    ),
    (
      'Daily Ritual',
      'Log today\'s rituals with Sunny and keep your vitality streak on track.',
      Icons.wb_sunny_outlined,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final item = _items[index];
    return Column(
      children: [
        LdCard(
          padding: EdgeInsets.zero,
          child: SizedBox(
            height: 148,
            child: Row(
              children: [
                Container(
                  width: 112,
                  decoration: BoxDecoration(
                    color: LuckdateColors.sageSoft,
                    borderRadius: const BorderRadius.horizontal(
                      left: Radius.circular(LuckdateRadius.xl),
                    ),
                  ),
                  child: Icon(
                    item.$3,
                    size: 48,
                    color: LuckdateColors.deepSage.withValues(alpha: 0.75),
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Today\'s Focus',
                          style: LuckdateTextStyles.caption.copyWith(
                            color: LuckdateColors.sunGold,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(item.$1, style: LuckdateTextStyles.title),
                        const SizedBox(height: 4),
                        Expanded(
                          child: Text(
                            item.$2,
                            style: LuckdateTextStyles.caption,
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: onViewPlan,
                            style: TextButton.styleFrom(
                              foregroundColor: LuckdateColors.deepSage,
                              padding: EdgeInsets.zero,
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            child: Text(
                              'View Focus Plan >',
                              style: LuckdateTextStyles.caption.copyWith(
                                fontWeight: FontWeight.w700,
                                color: LuckdateColors.deepSage,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: LuckdateSpacing.sm),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_items.length, (i) {
            return GestureDetector(
              onTap: () => onChanged(i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                width: i == index ? 16 : 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 3),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(LuckdateRadius.pill),
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
