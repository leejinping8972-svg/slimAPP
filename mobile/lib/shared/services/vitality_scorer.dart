import 'package:flutter/material.dart';
import '../models/models.dart';

class VitalityScorer {
  static int productScore(ProductTakenStatus status) {
    switch (status) {
      case ProductTakenStatus.taken:
        return 100;
      case ProductTakenStatus.partial:
        return 60;
      case ProductTakenStatus.skippedWithReason:
        return 30;
      case ProductTakenStatus.notRecorded:
        return 0;
    }
  }

  static int hydrationScore(int ml, int targetMl) {
    if (targetMl <= 0) return 0;
    return ((ml / targetMl).clamp(0.0, 1.0) * 100).round();
  }

  static int weightCheckScore(bool recorded, {bool skippedWithReason = false}) {
    if (recorded) return 100;
    if (skippedWithReason) return 50;
    return 0;
  }

  static int moodCheckScore({
    required String moodTag,
    required String energyTag,
    required bool fromChat,
  }) {
    if (moodTag.isEmpty && energyTag.isEmpty) return 0;
    if (moodTag.isNotEmpty && energyTag.isNotEmpty) return 100;
    if (fromChat && moodTag.isNotEmpty) return 80;
    if (moodTag.isNotEmpty) return 70;
    return 70;
  }

  static int sleepScore({
    required double hours,
    required String quality,
    String bedtime = '',
    String wakeTime = '',
  }) {
    final hasBed = bedtime.trim().isNotEmpty;
    final hasWake = wakeTime.trim().isNotEmpty;
    final hasQuality = quality.isNotEmpty;
    final q = quality.toLowerCase();

    // Prefer computed duration from both ends; fall back to stored hours.
    double resolvedHours = hours;
    if (hasBed && hasWake) {
      final computed = _hoursBetweenHm(bedtime, wakeTime);
      if (computed != null) resolvedHours = computed;
    }

    final hasDuration = resolvedHours > 0;
    if (!hasBed && !hasWake && !hasDuration && !hasQuality) return 0;

    int base;
    if (!hasBed && !hasWake && !hasDuration && hasQuality) {
      // Solo estado
      base = 40;
    } else if ((hasBed ^ hasWake) && !hasDuration) {
      // Solo un extremo de tiempo
      base = 50;
    } else if (hasDuration) {
      if (resolvedHours < 6) {
        base = 60;
      } else if (resolvedHours < 7) {
        base = 80;
      } else {
        base = 90;
      }
    } else {
      base = 40;
    }

    var delta = 0;
    if (q == 'good') {
      delta = 10;
    } else if (q == 'poor') {
      delta = -10;
    }

    var score = base + delta;
    if (q == 'poor' && score < 40) score = 40;
    return score.clamp(0, 100);
  }

  static double? _hoursBetweenHm(String bedtime, String wakeTime) {
    final bed = _parseHmMinutes(bedtime);
    final wake = _parseHmMinutes(wakeTime);
    if (bed == null || wake == null) return null;
    var mins = wake - bed;
    if (mins <= 0) mins += 24 * 60;
    return mins / 60.0;
  }

  static int? _parseHmMinutes(String raw) {
    final parts = raw.trim().split(':');
    if (parts.length < 2) return null;
    final h = int.tryParse(parts[0]);
    final m = int.tryParse(parts[1]);
    if (h == null || m == null) return null;
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
  }

  /// Nutrition from Sunny chat + quick meal check-in (intake, meals, product).
  static int nutritionScore(TodayRecord record, int calorieTargetKcal) {
    final hasMealLog = record.meals.isNotEmpty || record.intakeKcal > 0;
    final product = productScore(record.productTaken);
    if (!hasMealLog && product == 0) return 0;

    var logPoints = 0;
    if (product > 0) logPoints += (product * 0.35).round();
    logPoints += (record.meals.length * 18).clamp(0, 45);

    var intakePoints = 0;
    if (calorieTargetKcal > 0 && record.intakeKcal > 0) {
      final ratio = record.intakeKcal / calorieTargetKcal;
      if (ratio >= 0.7 && ratio <= 1.15) {
        intakePoints = 40;
      } else if (ratio >= 0.45 && ratio < 0.7) {
        intakePoints = 28;
      } else if (ratio > 1.15 && ratio <= 1.4) {
        intakePoints = 24;
      } else if (ratio > 0) {
        intakePoints = 16;
      }
    } else if (hasMealLog) {
      intakePoints = 22;
    }

    return (logPoints + intakePoints).clamp(0, 100);
  }

  /// Exercise from Sunny chat movement logs (+ check-in record).
  static int exerciseScore(TodayRecord record, int exerciseTargetKcal) {
    if (record.exerciseKcal <= 0 && record.exerciseMinutes <= 0) return 0;

    if (exerciseTargetKcal > 0 && record.exerciseKcal > 0) {
      return ((record.exerciseKcal / exerciseTargetKcal).clamp(0.0, 1.0) * 100)
          .round();
    }

    final fromMinutes = ((record.exerciseMinutes / 30).clamp(0.0, 1.0) * 100)
        .round();
    final sessionBonus = (record.exerciseSessions * 15).clamp(0, 30);
    return (fromMinutes + sessionBonus).clamp(0, 100);
  }

  /// Habits = today's ritual check-ins (chat + sheets), blended with 7d streak.
  static int habitsScore(
    TodayRecord record,
    UserPlanType planType,
    double consistency7d,
  ) {
    final checks = <bool>[
      record.weightRecorded,
      record.productTaken != ProductTakenStatus.notRecorded ||
          record.meals.isNotEmpty ||
          record.intakeKcal > 0,
      record.hydrationMl > 0,
      record.sleepHours > 0 ||
          record.sleepQuality.isNotEmpty ||
          record.sleepBedtime.isNotEmpty ||
          record.sleepWakeTime.isNotEmpty,
      record.exerciseKcal > 0 || record.exerciseMinutes > 0,
      record.moodTag.isNotEmpty || record.energyTag.isNotEmpty,
    ];

    final todayRate = checks.where((done) => done).length / checks.length;
    final todayPct = (todayRate * 100).round();
    if (consistency7d <= 0) return todayPct;
    return (todayPct * 0.7 + consistency7d * 100 * 0.3).round().clamp(0, 100);
  }

  static int ritualCompletion(TodayRecord record, UserPlanType planType) {
    final checks = switch (planType) {
      UserPlanType.mealReplacement => [
        record.productTaken != ProductTakenStatus.notRecorded ||
            record.meals.isNotEmpty,
        record.hydrationMl > 0,
        record.weightRecorded,
        record.sleepHours > 0 ||
          record.sleepQuality.isNotEmpty ||
          record.sleepBedtime.isNotEmpty ||
          record.sleepWakeTime.isNotEmpty,
      ],
      UserPlanType.nonMealReplacement => [
        record.productTaken != ProductTakenStatus.notRecorded ||
            record.meals.isNotEmpty,
        record.hydrationMl > 0,
        record.weightRecorded,
      ],
      UserPlanType.noProduct => [
        record.hydrationMl > 0,
        record.weightRecorded || record.meals.isNotEmpty,
      ],
    };
    if (checks.isEmpty) return 0;
    final completed = checks.where((done) => done).length;
    return ((completed / checks.length) * 100).round();
  }

  static VitalityScores calculate({
    required TodayRecord record,
    required int hydrationTargetMl,
    required UserPlanType planType,
    double consistency7d = 0,
    int calorieTargetKcal = 1600,
    int exerciseTargetKcal = 500,
  }) {
    final pScore = productScore(record.productTaken);
    final nScore = nutritionScore(record, calorieTargetKcal);
    final eScore = exerciseScore(record, exerciseTargetKcal);
    final hScore = hydrationScore(record.hydrationMl, hydrationTargetMl);
    final wScore = weightCheckScore(record.weightRecorded);
    final mScore = moodCheckScore(
      moodTag: record.moodTag,
      energyTag: record.energyTag,
      fromChat: record.moodTag.isNotEmpty,
    );
    final sScore = sleepScore(
      hours: record.sleepHours,
      quality: record.sleepQuality,
      bedtime: record.sleepBedtime,
      wakeTime: record.sleepWakeTime,
    );
    final cScore = habitsScore(record, planType, consistency7d);

    // Daily score mirrors Desglose de puntuación (six dimensions from live check-ins).
    final daily = ((nScore + eScore + mScore + sScore + hScore + cScore) / 6)
        .round();

    return VitalityScores(
      dailyVitality: daily,
      ritualCompletion: ritualCompletion(record, planType),
      hydrationScore: hScore,
      productRitualScore: pScore,
      nutritionScore: nScore,
      exerciseScore: eScore,
      weightCheckScore: wScore,
      moodCheckScore: mScore,
      sleepScore: sScore,
      consistencyScore: cScore,
    );
  }

  static String vitalityLabel(int score) {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Bien';
    if (score >= 75) return 'Bien y estable';
    if (score >= 50) return 'Ve con calma';
    if (score >= 1) return 'Cada pequeño paso cuenta';
    return 'Sin presión: puedes retomar cuando quieras';
  }

  static String scoreRating(int score) {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Bien';
    if (score >= 60) return 'Regular';
    if (score > 0) return 'Necesita atención';
    return 'No registrado';
  }

  static List<VitalityDimension> breakdown(VitalityScores scores) {
    return [
      VitalityDimension(
        key: 'nutrition',
        label: 'Nutrición',
        score: scores.nutritionScore,
        icon: Icons.apple_outlined,
      ),
      VitalityDimension(
        key: 'exercise',
        label: 'Ejercicio',
        score: scores.exerciseScore,
        icon: Icons.directions_run_outlined,
      ),
      VitalityDimension(
        key: 'body_mind',
        label: 'Atención plena',
        score: scores.moodCheckScore,
        icon: Icons.spa_outlined,
      ),
      VitalityDimension(
        key: 'sleep',
        label: 'Sueño',
        score: scores.sleepScore,
        icon: Icons.bedtime_outlined,
      ),
      VitalityDimension(
        key: 'hydration',
        label: 'Hidratación',
        score: scores.hydrationScore,
        icon: Icons.water_drop_outlined,
      ),
      VitalityDimension(
        key: 'habits',
        label: 'Hábitos',
        score: scores.consistencyScore,
        icon: Icons.wb_sunny_outlined,
        highlighted:
            scores.consistencyScore > 0 && scores.consistencyScore < 80,
      ),
    ];
  }
}

class VitalityDimension {
  const VitalityDimension({
    required this.key,
    required this.label,
    required this.score,
    required this.icon,
    this.highlighted = false,
  });

  final String key;
  final String label;
  final int score;
  final IconData icon;
  final bool highlighted;
}

