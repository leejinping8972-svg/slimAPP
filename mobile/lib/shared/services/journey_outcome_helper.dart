import '../models/models.dart';

/// Day-28 repurchase guidance branches.
enum ViajeRepurchasePath {
  /// A — progress, but target not reached → repurchase current product.
  continueActual,

  /// B — progress and goal reached → next-stage maintain / protect.
  maintainNext,

  /// C — little or no progress → alternative products.
  tryAlternative,
}

class ViajeRepurchaseOffer {
  const ViajeRepurchaseOffer({
    required this.path,
    required this.title,
    required this.subtitle,
    required this.primaryProductoId,
    required this.primaryLabel,
    this.secondaryProductoIds = const [],
  });

  final ViajeRepurchasePath path;
  final String title;
  final String subtitle;
  final String primaryProductoId;
  final String primaryLabel;
  final List<String> secondaryProductoIds;
}

class ViajeOutcomeHelper {
  /// Uses weight trend (start → end) vs target weight.
  static ViajeRepurchaseOffer resolve({
    required UserProfile profile,
    required ViajeState journey,
  }) {
    final trend = journey.weightTrend;
    final end = trend.isNotEmpty
        ? trend.last
        : (journey.todayRecord.weightValueKg > 0
              ? journey.todayRecord.weightValueKg
              : profile.currentPesoKg);
    final start = trend.isNotEmpty ? trend.first : end + 2;
    final lost = start - end;
    final target = profile.targetPesoKg;
    final reachedMeta = end <= target + 0.5;
    final effective = lost >= 0.5;

    if (effective && reachedGoal) {
      return const ViajeRepurchaseOffer(
        path: ViajeRepurchasePath.maintainNext,
        title: 'Alcanzaste tu meta',
        subtitle:
            'Consolida tu logro con una etapa de mantenimiento y protección: apoyo suave, no otra restricción intensa.',
        primaryProductoId: 'youth_solar',
        primaryLabel: 'Iniciar etapa de mantenimiento',
        secondaryProductoIds: ['aging_solar', 'recovery_night', 'daily_vital'],
      );
    }

    if (effective && !reachedGoal) {
      return const ViajeRepurchaseOffer(
        path: ViajeRepurchasePath.continueActual,
        title: 'Estás avanzando',
        subtitle:
            'Great rhythm — keep going with another Solar Protein cycle to close the gap to your target.',
        primaryProductoId: 'solar_protein',
        primaryLabel: 'Reorder Solar Protein',
        secondaryProductoIds: [],
      );
    }

    return const ViajeRepurchaseOffer(
      path: ViajeRepurchasePath.tryAlternative,
      title: 'Let\'s try a different path',
      subtitle:
          'Los resultados fueron limitados en este ciclo. Explora una fórmula alternativa que pueda adaptarse mejor a tu cuerpo.',
      primaryProductoId: 'active_boost',
      primaryLabel: 'Explorar alternativas',
      secondaryProductoIds: ['sun_femme', 'recovery_night', 'aging_solar'],
    );
  }
}
