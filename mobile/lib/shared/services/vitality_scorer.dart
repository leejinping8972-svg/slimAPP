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
    if (hours >= 7 && (quality == 'good' || quality == 'okay')) return 100;
    if ((hours >= 6 && hours < 7) || quality == 'okay') return 80;
    if (hours > 0 && hours < 6) return 60;
    if (quality.isNotEmpty) return 70;
    return 0;
  }

  static int ritualCompletion(TodayRecord record, UserPlanType planType) {
    final checks = switch (planType) {
      UserPlanType.mealReplacement => [
        record.productTaken != ProductTakenStatus.notRecorded,
        record.hydrationMl > 0,
        record.weightRecorded,
        record.sleepHours > 0 || record.sleepQuality.isNotEmpty,
      ],
      UserPlanType.nonMealReplacement => [
        record.productTaken != ProductTakenStatus.notRecorded,
        record.hydrationMl > 0,
        record.weightRecorded,
      ],
      UserPlanType.noProduct => [
        record.hydrationMl > 0,
        record.weightRecorded,
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
  }) {
    final pScore = productScore(record.productTaken);
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
    final cScore = (consistency7d * 100).round();

    final daily = (pScore / 100 * 25 +
            hScore / 100 * 25 +
            wScore / 100 * 15 +
            mScore / 100 * 15 +
            sScore / 100 * 10 +
            cScore / 100 * 10)
        .round();

    return VitalityScores(
      dailyVitality: daily,
      ritualCompletion: ritualCompletion(record, planType),
      hydrationScore: hScore,
      productRitualScore: pScore,
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
    return 'Needs focus';
  }

  static List<VitalityDimension> breakdown(VitalityScores scores) {
    return [
      VitalityDimension(
        key: 'nutrition',
        label: 'Nutrition',
        score: scores.productRitualScore,
        icon: Icons.apple_outlined,
      ),
      VitalityDimension(
        key: 'exercise',
        label: 'Movement',
        score: ((scores.ritualCompletion * 0.85) + scores.consistencyScore * 0.15)
            .round()
            .clamp(0, 100),
        icon: Icons.directions_run_outlined,
      ),
      VitalityDimension(
        key: 'body_mind',
        label: 'Body & Mind',
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
        highlighted: true,
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
