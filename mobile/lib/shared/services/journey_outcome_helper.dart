import '../models/models.dart';

/// Day-28 repurchase guidance branches.
enum JourneyRepurchasePath {
  /// A: progress, but target not reached -> repurchase current product.
  continueActual,

  /// B: progress and goal reached -> next-stage maintain/protect.
  maintainNext,

  /// C: little or no progress -> alternative products.
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
  /// Uses weight trend (start -> end) vs target weight.
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
        title: 'Alcanzaste tu meta',
        subtitle:
            'Consolida tu logro con una etapa de mantenimiento y protecci贸n: apoyo suave, no otra restricci贸n intensa.',
        primaryProductId: 'youth_solar',
        primaryLabel: 'Iniciar etapa de mantenimiento',
        secondaryProductIds: ['aging_solar', 'recovery_night', 'daily_vital'],
      );
    }

    if (effective && !reachedGoal) {
      return const JourneyRepurchaseOffer(
        path: JourneyRepurchasePath.continueActual,
        title: 'Est谩s avanzando',
        subtitle:
            'Buen ritmo; sigue con otro ciclo de Solar Protein para acercarte a tu meta.',
        primaryProductId: 'solar_protein',
        primaryLabel: 'Volver a pedir Solar Protein',
        secondaryProductIds: [],
      );
    }

    return const JourneyRepurchaseOffer(
      path: JourneyRepurchasePath.tryAlternative,
      title: 'Probemos otro camino',
      subtitle:
          'Los resultados fueron limitados en este ciclo. Explora una f贸rmula alternativa que pueda adaptarse mejor a tu cuerpo.',
      primaryProductId: 'active_boost',
      primaryLabel: 'Explorar alternativas',
      secondaryProductIds: ['sun_femme', 'recovery_night', 'aging_solar'],
    );
  }
}


