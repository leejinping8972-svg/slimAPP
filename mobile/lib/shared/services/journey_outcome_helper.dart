import '../models/models.dart';

/// Day-28 repurchase guidance branches.
enum JourneyRepurchasePath {
  /// A — progress, but target not reached → repurchase current product.
  continueCurrent,

  /// B — progress and goal reached → next-stage maintain / protect.
  maintainNext,

  /// C — little or no progress → alternative products.
  tryAlternative,
}

class JourneyRepurchaseOffer {
  const JourneyRepurchaseOffer({
    required this.path,
    required this.title,
    required this.subtitle,
    required this.primaryProductId,
    required this.primaryLabel,
    this.secondaryProductIds = const [],
  });

  final JourneyRepurchasePath path;
  final String title;
  final String subtitle;
  final String primaryProductId;
  final String primaryLabel;
  final List<String> secondaryProductIds;
}

class JourneyOutcomeHelper {
  /// Uses weight trend (start → end) vs target weight.
  static JourneyRepurchaseOffer resolve({
    required UserProfile profile,
    required JourneyState journey,
  }) {
    final trend = journey.weightTrend;
    final end = trend.isNotEmpty
        ? trend.last
        : (journey.todayRecord.weightValueKg > 0
            ? journey.todayRecord.weightValueKg
            : profile.currentWeightKg);
    final start = trend.isNotEmpty ? trend.first : end + 2;
    final lost = start - end;
    final target = profile.targetWeightKg;
    final reachedGoal = end <= target + 0.5;
    final effective = lost >= 0.5;

    if (effective && reachedGoal) {
      return const JourneyRepurchaseOffer(
        path: JourneyRepurchasePath.maintainNext,
        title: 'You reached your goal',
        subtitle:
            'Lock in the win with a maintain & protect stage — gentle support, not another hard cut.',
        primaryProductId: 'youth_solar',
        primaryLabel: 'Start maintain stage',
        secondaryProductIds: ['aging_solar', 'recovery_night', 'daily_vital'],
      );
    }

    if (effective && !reachedGoal) {
      return const JourneyRepurchaseOffer(
        path: JourneyRepurchasePath.continueCurrent,
        title: 'You are progressing',
        subtitle:
            'Great rhythm — keep going with another Solar Protein cycle to close the gap to your target.',
        primaryProductId: 'solar_protein',
        primaryLabel: 'Reorder Solar Protein',
        secondaryProductIds: [],
      );
    }

    return const JourneyRepurchaseOffer(
      path: JourneyRepurchasePath.tryAlternative,
      title: 'Let\'s try a different path',
      subtitle:
          'Results were limited this cycle. Explore an alternative formula that may fit your body better.',
      primaryProductId: 'active_boost',
      primaryLabel: 'Explore alternatives',
      secondaryProductIds: ['sun_femme', 'recovery_night', 'aging_solar'],
    );
  }
}
