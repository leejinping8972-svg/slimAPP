import '../models/models.dart';

/// Day-28 outcome copy — encouragement only (no repurchase CTAs).
class JourneyDay28Outcome {
  const JourneyDay28Outcome({
    required this.title,
    required this.subtitle,
  });

  final String title;
  final String subtitle;
}

class JourneyOutcomeHelper {
  /// Uses weight trend (start -> end) vs target weight for encouraging copy.
  static JourneyDay28Outcome resolve({
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
      return const JourneyDay28Outcome(
        title: 'Alcanzaste tu meta',
        subtitle:
            'Qué orgullo. Consolida este logro con hábitos suaves: hidratación, sueño y movimiento ligero. Sunny sigue aquí para acompañarte.',
      );
    }

    if (effective && !reachedGoal) {
      return const JourneyDay28Outcome(
        title: 'Estás avanzando',
        subtitle:
            'Buen ritmo en estos 28 días. Sigue con constancia y celebra cada pequeño paso; el progreso se construye con paciencia.',
      );
    }

    return const JourneyDay28Outcome(
      title: 'Cada ciclo enseña algo',
      subtitle:
          'Este recorrido te dio datos valiosos sobre tu cuerpo y tu ritmo. Descansa, observa y cuando quieras, Sunny te ayuda a empezar de nuevo con calma.',
    );
  }
}
