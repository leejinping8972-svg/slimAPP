import '../models/models.dart';
import 'check_in_estimator.dart';

class SunnyIntentRouter {
  SunnyIntentResult route({
    required String input,
    required TodayRecord today,
    required int journeyDay,
    required int hydrationTargetMl,
    required String nickname,
  }) {
    final lower = input.toLowerCase();

    if (_matches(lower, [
      'embarazada',
      'embarazo',
      'lactancia',
      'pregnant',
      'pregnancy',
      'breastfeeding',
    ])) {
      return const SunnyIntentResult(
        reply:
            'Gracias por compartirlo. Un viaje Slim estándar no está diseñado para el embarazo ni la lactancia. Habla con un profesional de la salud antes de hacer cambios en tu alimentación.',
        intents: ['health_risk'],
        riskLevel: RiskLevel.p0,
        disableActions: true,
      );
    }

    if (_matches(lower, [
      'quiero morir',
      'hacerme daño',
      'suicidarme',
      'kill myself',
      'want to die',
      'hurt myself',
    ])) {
      return const SunnyIntentResult(
        reply:
            'Escucho el dolor que estás cargando en este momento. Mereces apoyo real más allá de esta app. Comunícate de inmediato con una persona de confianza o una línea local de ayuda en crisis.',
        intents: ['emotional_crisis'],
        riskLevel: RiskLevel.p0,
        disableActions: true,
      );
    }

    if (_matches(lower, [
      'cena con amigos',
      'fiesta',
      'ajustar el plan',
      'dinner party',
      'party',
      'adjust plan',
    ])) {
      return SunnyIntentResult(
        reply:
            'Una cena social no deshace tu viaje. Disfrútala con calma, mantente bien hidratada y mañana seguiremos con ligereza y constancia.',
        intents: ['plan_adjustment'],
        todayUpdates: today,
      );
    }

    if (_matches(lower, [
      'ejercicio',
      'entrenamiento',
      'corrí',
      'correr',
      'yoga',
      'caminé',
      'caminar',
      'gimnasio',
      'exercise',
      'workout',
      'ran',
      'run',
      'walked',
      'walking',
      'gym',
    ])) {
      final updated = CheckInEstimator.applyExerciseFromText(today, lower);
      final addedMin = updated.exerciseMinutes - today.exerciseMinutes;
      final addedKcal = updated.exerciseKcal - today.exerciseKcal;
      return SunnyIntentResult(
        reply:
            '¡Muy bien! Registré aproximadamente $addedMin min de movimiento (~$addedKcal kcal quemadas). Tu Registro diario se actualizará automáticamente.',
        intents: ['record_exercise'],
        todayUpdates: updated,
      );
    }

    if (_matches(lower, [
      'comí',
      'desayuno',
      'comida',
      'almuerzo',
      'cena',
      'colación',
      'ensalada',
      'yogur',
      'salmón',
      'avena',
      'ate',
      'eaten',
      'breakfast',
      'lunch',
      'dinner',
      'snack',
      'salad',
      'yogurt',
      'salmon',
      'oatmeal',
    ])) {
      final updated = CheckInEstimator.applyMealFromText(today, lower);
      final meal = updated.meals.last;
      return SunnyIntentResult(
        reply:
            'Registré “${meal.name}” con ~${meal.kcal} kcal (estimación de IA). Proteína ${meal.protein} g · Carbohidratos ${meal.carbs} g · Grasas ${meal.fat} g. Puedes revisarlo en tu Registro diario.',
        intents: ['record_meal'],
        todayUpdates: updated,
      );
    }

    if (_matches(lower, [
      'dormí',
      'sueño',
      'horas de sueño',
      'slept',
      'sleep',
      'hours of sleep',
    ])) {
      final updated = CheckInEstimator.applySleepFromText(today, lower);
      return SunnyIntentResult(
        reply:
            'Registré tu sueño: ${updated.sleepHours} h (${updated.sleepQuality}). Descansar forma parte de tu ritmo de vitalidad.',
        intents: ['record_sleep'],
        todayUpdates: updated,
      );
    }

    if (_matches(lower, [
      'hambre',
      'no he tomado suficiente agua',
      'poca agua',
      'hungry',
      'haven\'t had enough water',
      'not enough water',
      'a bit hungry',
    ])) {
      return SunnyIntentResult(
        reply:
            'Sentir un poco de hambre es normal mientras tu cuerpo se adapta, $nickname. Llevas ${today.hydrationMl} ml registrados: te faltan aproximadamente ${hydrationTargetMl - today.hydrationMl} ml. Un vaso pequeño después de cenar puede ayudarte a mantener tu ritmo.',
        intents: ['plan_adjustment', 'record_hydration'],
        todayUpdates: today,
      );
    }

    if (_matches(lower, [
      'tomé',
      'batido',
      'proteína',
      'sustituto de comida',
      'drank',
      'shake',
      'protein',
      'meal replacement',
    ])) {
      final updated = CheckInEstimator.applyProductShake(today);
      return SunnyIntentResult(
        reply:
            'Entendido: registré tu Solar Protein (~280 kcal, estimación de IA) para el Día $journeyDay. Tu Registro diario mostrará el consumo.',
        intents: ['record_product', 'record_meal'],
        todayUpdates: updated,
      );
    }

    if (_matches(lower, [
      'agua',
      'ml',
      'vaso',
      'water',
      'cup',
      'glass',
      '1500',
      '2000',
    ])) {
      final amount = _extractMl(lower) ?? 250;
      final newMl = today.hydrationMl + amount;
      return SunnyIntentResult(
        reply:
            'Agregué ${amount} ml. Hoy llevas ${newMl} ml: te faltan ${(hydrationTargetMl - newMl).clamp(0, hydrationTargetMl)} ml para tu meta.',
        intents: ['record_hydration'],
        todayUpdates: today.copyWith(hydrationMl: newMl),
      );
    }

    if (_matches(lower, ['peso', 'kg', 'lb', 'libra', 'weight', 'pound'])) {
      return SunnyIntentResult(
        reply:
            'Tu peso está registrado. Un número puede cambiar; tu tendencia con el tiempo importa más que un solo día.',
        intents: ['record_weight'],
        todayUpdates: today.copyWith(weightRecorded: true),
      );
    }

    if (_matches(lower, [
      'cansada',
      'estresada',
      'triste',
      'abrumada',
      'tired',
      'stressed',
      'sad',
      'overwhelmed',
    ])) {
      return SunnyIntentResult(
        reply:
            'Gracias por contarme cómo te sientes. Mantengamos hoy algo simple: un pequeño ritual es suficiente. Mañana continuamos desde aquí.',
        intents: ['emotional_support'],
        todayUpdates: today.copyWith(moodTag: 'tired'),
      );
    }

    if (_matches(lower, [
      'cuándo',
      'cómo',
      'producto',
      'solar',
      'tomar',
      'when',
      'how',
      'product',
      'drink',
    ])) {
      return const SunnyIntentResult(
        reply:
            'Solar Protein funciona mejor como una comida que normalmente omitirías; muchas personas eligen el desayuno o la comida. La constancia importa más que el horario perfecto.',
        intents: ['product_qa'],
      );
    }

    return SunnyIntentResult(
      reply:
          'Estoy contigo en el Día $journeyDay, $nickname. Registra comidas, agua, ejercicio o sueño en el chat; estimaré las calorías y actualizaré tu Registro diario.',
      intents: ['small_talk'],
      todayUpdates: today,
    );
  }

  bool _matches(String input, List<String> keywords) {
    return keywords.any(input.contains);
  }

  int? _extractMl(String input) {
    final match = RegExp(r'(\d{3,4})\s*(ml)?').firstMatch(input);
    if (match != null) return int.tryParse(match.group(1)!);
    if (input.contains('vaso') ||
        input.contains('cup') ||
        input.contains('glass')) {
      return 250;
    }
    return null;
  }
}
