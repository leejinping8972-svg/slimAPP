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

  static int sleepScore({required double hours, required String quality}) {
    if (hours <= 0 && quality.isEmpty) return 0;
    if (hours >= 7 && (quality == 'good' || quality == 'okay' || quality == 'logged')) {
      return 100;
    }
    if ((hours >= 6 && hours < 7) || quality == 'okay' || quality == 'logged') {
      return 80;
    }
    if (hours > 0 && hours < 6) return 60;
    if (quality.isNotEmpty) return 70;
    return 0;
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

    final fromMinutes =
        ((record.exerciseMinutes / 30).clamp(0.0, 1.0) * 100).round();
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
      record.sleepHours > 0 || record.sleepQuality.isNotEmpty,
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
        record.sleepHours > 0 || record.sleepQuality.isNotEmpty,
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
    );
    final cScore = habitsScore(record, planType, consistency7d);

    // Daily score mirrors Score Breakdown (six dimensions from live check-ins).
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
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 75) return 'Good and steady';
    if (score >= 50) return 'Keep it gentle';
    if (score >= 1) return 'One small step counts';
    return 'No pressure — restart anytime';
  }

  static String scoreRating(int score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    if (score > 0) return 'Needs focus';
    return 'Not logged';
  }

  static List<VitalityDimension> breakdown(VitalityScores scores) {
    return [
      VitalityDimension(
        key: 'nutrition',
        label: 'Nutrition',
        score: scores.nutritionScore,
        icon: Icons.apple_outlined,
      ),
      VitalityDimension(
        key: 'exercise',
        label: 'Exercise',
        score: scores.exerciseScore,
        icon: Icons.directions_run_outlined,
      ),
      VitalityDimension(
        key: 'body_mind',
        label: 'Mindfulness',
        score: scores.moodCheckScore,
        icon: Icons.spa_outlined,
      ),
      VitalityDimension(
        key: 'sleep',
        label: 'Sleep',
        score: scores.sleepScore,
        icon: Icons.bedtime_outlined,
      ),
      VitalityDimension(
        key: 'hydration',
        label: 'Hydration',
        score: scores.hydrationScore,
        icon: Icons.water_drop_outlined,
      ),
      VitalityDimension(
        key: 'habits',
        label: 'Habits',
        score: scores.consistencyScore,
        icon: Icons.wb_sunny_outlined,
        highlighted: scores.consistencyScore > 0 && scores.consistencyScore < 80,
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
