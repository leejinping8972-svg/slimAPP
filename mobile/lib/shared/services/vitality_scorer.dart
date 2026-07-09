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
    if (score >= 90) return 'Great rhythm';
    if (score >= 75) return 'Good and steady';
    if (score >= 50) return 'Keep it gentle';
    if (score >= 1) return 'One small step counts';
    return 'No pressure — restart anytime';
  }
}
