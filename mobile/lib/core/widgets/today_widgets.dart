import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../shared/models/models.dart';
import '../../shared/services/sleep_record_helper.dart';
import '../../shared/services/vitality_scorer.dart';
import 'ld_components.dart';

class TopMetricsRow extends StatelessWidget {
  const TopMetricsRow({
    super.key,
    required this.vitality,
    required this.ritualPercent,
  });

  final int vitality;
  final int ritualPercent;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: _MetricRing(
            label: 'Vitalidad',
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
            subtitle: 'Hoy',
            progress: ritualPercent / 100,
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
                color: LuckdateColors.deepSage,
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

class Consistency5DayStrip extends StatelessWidget {
  const Consistency5DayStrip({
    super.key,
    required this.values,
    this.onDayTap,
    this.highlightHoy = true,
  });

  final List<bool> values;
  final void Function(int index, DateTime date)? onDayTap;
  final bool highlightHoy;

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final items = List<bool>.from(values);
    while (items.length < 5) {
      items.insert(0, false);
    }
    final week = items.length > 5 ? items.sublist(items.length - 5) : items;
    const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    return Row(
      children: List.generate(5, (i) {
        final day = now.subtract(Duration(days: 4 - i));
        final completed = week[i];
        final isHoy = i == 4;
        final weekday = weekdays[day.weekday - 1];

        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(left: i == 0 ? 0 : 4),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onDayTap == null ? null : () => onDayTap!(i, day),
                borderRadius: BorderRadius.circular(LuckdateRadius.md),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Column(
                    children: [
                      Text(
                        weekday,
                        style: LuckdateTextStyles.caption.copyWith(
                          fontSize: 10,
                          color: LuckdateColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${day.day}',
                        style: LuckdateTextStyles.caption.copyWith(
                          fontSize: 12,
                          fontWeight: isHoy && highlightHoy
                              ? FontWeight.w700
                              : FontWeight.w500,
                          color: isHoy && highlightHoy
                              ? LuckdateColors.chocolateBrown
                              : LuckdateColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: completed
                              ? LuckdateColors.deepSage
                              : LuckdateColors.lineSoft.withValues(alpha: 0.45),
                          border: Border.all(
                            color: isHoy && highlightHoy
                                ? LuckdateColors.sunGold
                                : completed
                                ? LuckdateColors.deepSage
                                : LuckdateColors.lineSoft,
                            width: isHoy && highlightHoy ? 2 : 1,
                          ),
                        ),
                        child: completed
                            ? const Icon(
                                Icons.check,
                                size: 14,
                                color: Colors.white,
                              )
                            : null,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      }),
    );
  }
}

class ConsistencyCalendarCard extends StatelessWidget {
  const ConsistencyCalendarCard({
    super.key,
    required this.consistency5d,
    required this.consistencyScore,
    required this.journeyDay,
    required this.planType,
    required this.todayRecord,
    required this.weightTrend,
    required this.onDayTap,
  });

  final List<bool> consistency5d;
  final int consistencyScore;
  final int journeyDay;
  final UserPlanType planType;
  final TodayRecord todayRecord;
  final List<double> weightTrend;
  final void Function(int index, DateTime date, TodayRecord record) onDayTap;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text('Constancia', style: LuckdateTextStyles.title),
              ),
              Text(
                '$consistencyScore%',
                style: LuckdateTextStyles.title.copyWith(
                  color: LuckdateColors.deepSage,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Últimos 5 días · Toca un día para ver sus detalles',
            style: LuckdateTextStyles.caption,
          ),
          const SizedBox(height: LuckdateSpacing.md),
          Consistency5DayStrip(
            values: consistency5d,
            onDayTap: (index, date) {
              final record = resolveDayCheckInRecord(
                index: index,
                journeyDay: journeyDay,
                todayRecord: todayRecord,
                weightTrend: weightTrend,
              );
              onDayTap(index, date, record);
            },
          ),
        ],
      ),
    );
  }
}

TodayRecord resolveDayCheckInRecord({
  required int index,
  required int journeyDay,
  required TodayRecord todayRecord,
  required List<double> weightTrend,
}) {
  final targetViajeDay = journeyDay - (4 - index);
  if (targetViajeDay < 1 || targetViajeDay > journeyDay) {
    return const TodayRecord();
  }
  if (targetViajeDay == journeyDay) {
    return todayRecord;
  }

  final weight = weightTrend.length >= targetViajeDay
      ? weightTrend[targetViajeDay - 1]
      : 0.0;
  final moods = ['okay', 'good', 'great'];
  return TodayRecord(
    productTaken: ProductTakenStatus.taken,
    hydrationMl: 1200 + (targetViajeDay * 137) % 800,
    weightRecorded: weight > 0,
    weightValueKg: weight > 0 ? weight : 68 - targetViajeDay * 0.12,
    sleepHours: 6.5 + (targetViajeDay % 3) * 0.5,
    sleepQuality: 'good',
    sleepBedtime: '23:00',
    sleepWakeTime: '06:30',
    moodTag: moods[targetViajeDay % moods.length],
  );
}

bool dayCheckInHasData(TodayRecord record, UserPlanType planType) {
  if (record.productTaken == ProductTakenStatus.taken) return true;
  if (record.hydrationMl > 0) return true;
  if (record.weightRecorded) return true;
  if (record.hasSleepRecord) return true;
  if (record.moodTag.isNotEmpty) return true;
  if (planType == UserPlanType.nonMealReplacement &&
      record.productTaken != ProductTakenStatus.notRecorded) {
    return true;
  }
  return false;
}

class DayCheckInSheet extends StatelessWidget {
  const DayCheckInSheet({
    super.key,
    required this.date,
    required this.journeyDay,
    required this.record,
    required this.planType,
    required this.isHoy,
  });

  final DateTime date;
  final int? journeyDay;
  final TodayRecord record;
  final UserPlanType planType;
  final bool isHoy;

  @override
  Widget build(BuildContext context) {
    final hasData = dayCheckInHasData(record, planType);
    final monthNames = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    final dateLabel = '${monthNames[date.month - 1]} ${date.day}, ${date.year}';
    final ritualPercent = VitalityScorer.ritualCompletion(record, planType);

    return LdBottomSheetBody(
      children: [
        Text(
          isHoy ? 'Registro de hoy' : 'Registro diario',
          style: LuckdateTextStyles.h2,
        ),
        const SizedBox(height: LuckdateSpacing.xs),
        Text(dateLabel, style: LuckdateTextStyles.bodySmall),
        if (journeyDay != null && journeyDay! > 0) ...[
          const SizedBox(height: 4),
          Text(
            'Día $journeyDay del viaje',
            style: LuckdateTextStyles.caption.copyWith(
              color: LuckdateColors.deepSage,
            ),
          ),
        ],
        const SizedBox(height: LuckdateSpacing.lg),
        if (!hasData)
          const StatePlaceholder(
            type: 'empty',
            title: 'Aún no hay registro',
            message: 'No se registraron rituales este día.',
          )
        else ...[
          _CheckInRow(
            icon: Icons.local_drink_outlined,
            label: planType == UserPlanType.mealReplacement
                ? 'Solar Protein'
                : 'Producto',
            value: record.productTaken == ProductTakenStatus.taken
                ? 'Completado'
                : 'No registrado',
            done: record.productTaken == ProductTakenStatus.taken,
          ),
          _CheckInRow(
            icon: Icons.water_drop_outlined,
            label: 'Hidratación',
            value: record.hydrationMl > 0
                ? '${record.hydrationMl} ml'
                : 'No registrado',
            done: record.hydrationMl > 0,
          ),
          _CheckInRow(
            icon: Icons.monitor_weight_outlined,
            label: 'Peso',
            value: record.weightRecorded
                ? '${record.weightValueKg.toStringAsFixed(1)} kg'
                : 'No registrado',
            done: record.weightRecorded,
          ),
          if (planType == UserPlanType.mealReplacement) ...[
            _CheckInRow(
              icon: Icons.bedtime_outlined,
              label: 'Sueño',
              value: record.hasSleepRecord
                  ? SleepRecordHelper.summary(record)
                  : 'No registrado',
              done: record.hasSleepRecord,
            ),
            _CheckInRow(
              icon: Icons.mood_outlined,
              label: 'Ánimo',
              value: record.moodTag.isNotEmpty
                  ? record.moodTag[0].toUpperCase() +
                        record.moodTag.substring(1)
                  : 'No registrado',
              done: record.moodTag.isNotEmpty,
            ),
          ],
          const SizedBox(height: LuckdateSpacing.md),
          LdCard(
            child: Row(
              children: [
                const Icon(Icons.bolt_outlined, color: LuckdateColors.deepSage),
                const SizedBox(width: LuckdateSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Completitud de rituales',
                        style: LuckdateTextStyles.title,
                      ),
                      Text(
                        '$ritualPercent% de los rituales de hoy',
                        style: LuckdateTextStyles.caption,
                      ),
                    ],
                  ),
                ),
                Text('$ritualPercent%', style: LuckdateTextStyles.h2),
              ],
            ),
          ),
        ],
        const SizedBox(height: LuckdateSpacing.lg),
        LdSecondaryButton(
          label: 'Cerrar',
          onPressed: () => Navigator.pop(context),
        ),
      ],
    );
  }
}

class _CheckInRow extends StatelessWidget {
  const _CheckInRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.done,
  });

  final IconData icon;
  final String label;
  final String value;
  final bool done;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: LdCard(
        completed: done,
        child: Row(
          children: [
            Icon(
              icon,
              color: done
                  ? LuckdateColors.deepSage
                  : LuckdateColors.textSecondary,
            ),
            const SizedBox(width: LuckdateSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: LuckdateTextStyles.title),
                  Text(value, style: LuckdateTextStyles.caption),
                ],
              ),
            ),
            Icon(
              done ? Icons.check_circle : Icons.radio_button_unchecked,
              color: done ? LuckdateColors.deepSage : LuckdateColors.lineSoft,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}

class PesoTrendCard extends StatelessWidget {
  const PesoTrendCard({
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
          Text('Tendencia de peso', style: LuckdateTextStyles.title),
          const SizedBox(height: LuckdateSpacing.sm),
          Text(
            '${weights.last.toStringAsFixed(1)} kg · Meta ${targetKg.toStringAsFixed(1)} kg',
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
                lineTouchData: LineTouchData(
                  touchTooltipData: LineTouchTooltipData(
                    getTooltipItems: (touchedSpots) {
                      return touchedSpots.map((spot) {
                        return LineTooltipItem(
                          '${spot.y.toStringAsFixed(1)} kg',
                          LuckdateTextStyles.caption.copyWith(
                            color: LuckdateColors.ivoryWhite,
                            fontWeight: FontWeight.w600,
                          ),
                        );
                      }).toList();
                    },
                  ),
                ),
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

