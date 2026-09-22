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

    if (_isModifyIntent(lower)) {
      return _routeModifyCheckIn(input: input, lower: lower, today: today);
    }

    final structuredType = _detectCheckInType(lower);
    if (structuredType != null) {
      final parsed = _parseStructuredCheckIn(
        input: input,
        lower: lower,
        type: structuredType,
      );
      final missing = <String>[
        if (parsed.name.isEmpty)
          '具体的${structuredType == CheckInType.meal ? '食物名称' : '运动项目'}',
        if (parsed.value == null) structuredType.unit,
      ];
      if (missing.isNotEmpty) {
        return SunnyIntentResult(
          reply:
              '我可以帮你记录${structuredType.label}。请补充${missing.join('、')}，例如“鸡胸肉 150 克”或“快走 30 分钟”。',
          intents: ['clarify_check_in'],
        );
      }
      final time = parsed.time ?? _nowTime();
      return SunnyIntentResult(
        reply: '我识别到一条${structuredType.label}记录，请确认下面的信息后再写入今日记录。',
        intents: [
          structuredType == CheckInType.meal
              ? 'confirm_meal_check_in'
              : 'confirm_exercise_check_in',
        ],
        cardData: CheckInCardData(
          kind: ChatCardKind.confirmCheckIn,
          type: structuredType,
          name: parsed.name,
          time: time,
          value: parsed.value!,
        ),
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

  SunnyIntentResult _routeModifyCheckIn({
    required String input,
    required String lower,
    required TodayRecord today,
  }) {
    final type = _detectCheckInType(lower);
    if (type == null) {
      return const SunnyIntentResult(
        reply: '你想修改饮食还是运动记录？也请告诉我记录的大致时间和新的克数或分钟数。',
        intents: ['clarify_modify_check_in'],
      );
    }

    final value = _extractValue(lower, type);
    if (value == null) {
      return SunnyIntentResult(
        reply: '我知道你要修改${type.label}记录了，请告诉我新的${type.unit}。',
        intents: ['clarify_modify_check_in'],
      );
    }

    final time = _extractTimeOrSlot(lower);
    if (time == null) {
      return SunnyIntentResult(
        reply: '为了避免改错，请告诉我是哪一条${type.label}记录，例如“早餐”“12:30”或“晚餐”。',
        intents: ['clarify_modify_check_in'],
      );
    }

    final name = _extractName(input, lower, type);
    final candidates = CheckInEstimator.recordsFor(today, type)
        .where((record) => _matchesRecord(record, time: time, name: name))
        .toList();
    if (candidates.isEmpty) {
      return SunnyIntentResult(
        reply:
            '我没有找到${time == '今天' ? '' : '$time 的'}${type.label}记录。请再确认时间，或直接告诉我具体的记录名称。',
        intents: ['clarify_modify_check_in'],
      );
    }

    if (candidates.length > 1) {
      return SunnyIntentResult(
        reply: '我找到了多条可能的${type.label}记录，请在卡片中选择后再确认修改。',
        intents: ['select_modify_check_in'],
        cardData: CheckInCardData(
          kind: ChatCardKind.modifyCheckIn,
          type: type,
          name: name.isEmpty ? '选择一条记录' : name,
          time: time,
          value: value,
          candidates: candidates,
          selectedRecordId: candidates.first.id,
        ),
      );
    }

    final record = candidates.single;
    final confidence = _confidence(record: record, time: time, name: name);
    if (confidence < 0.85) {
      return SunnyIntentResult(
        reply:
            '我找到了一条${type.label}记录，但还不能完全确定是“${record.name}”。请补充记录名称或更准确的时间。',
        intents: ['clarify_modify_check_in'],
      );
    }

    final updated = CheckInEstimator.replaceCheckIn(
      today,
      record: record,
      newValue: value,
    );
    return SunnyIntentResult(
      reply:
          '已将${record.name}（${record.time}）修改为 $value ${type.unit}，今日记录也同步更新了。',
      intents: ['modify_check_in'],
      todayUpdates: updated,
    );
  }

  _ParsedCheckIn _parseStructuredCheckIn({
    required String input,
    required String lower,
    required CheckInType type,
  }) {
    return _ParsedCheckIn(
      name: _extractName(input, lower, type),
      time: _extractTimeOrSlot(lower),
      value: _extractValue(lower, type),
    );
  }

  CheckInType? _detectCheckInType(String lower) {
    final exercise = _matches(lower, [
      '运动',
      '锻炼',
      '训练',
      '跑步',
      '跑了',
      '快走',
      '散步',
      '瑜伽',
      '骑行',
      '健身',
      'exercise',
      'workout',
      'run',
      'walk',
      'yoga',
      'gym',
    ]);
    final meal = _matches(lower, [
      '饮食',
      '吃了',
      '吃',
      '喝了',
      '喝',
      '早餐',
      '午餐',
      '晚餐',
      '加餐',
      '食物',
      '餐',
      'comí',
      'comida',
      'desayuno',
      'almuerzo',
      'cena',
      'meal',
      'breakfast',
      'lunch',
      'dinner',
      'yogurt',
      'oatmeal',
      'salad',
      'chicken',
      'rice',
      'batido',
    ]);
    if (exercise && !meal) return CheckInType.exercise;
    if (meal && !exercise) return CheckInType.meal;
    if (exercise && lower.contains('分钟')) return CheckInType.exercise;
    if (meal && lower.contains('克')) return CheckInType.meal;
    return exercise
        ? CheckInType.exercise
        : meal
        ? CheckInType.meal
        : null;
  }

  bool _isModifyIntent(String lower) {
    return _matches(lower, [
      '修改',
      '更改',
      '改一下',
      '改成',
      '更新记录',
      '纠正',
      '修改记录',
      'edit',
      'change',
      'update',
      'correct',
    ]);
  }

  String _extractName(String input, String lower, CheckInType type) {
    const knownMeals = [
      '鸡胸肉',
      '燕麦奶',
      '燕麦',
      '酸奶',
      '糙米饭',
      '米饭',
      '沙拉',
      '三文鱼',
      '水果',
      'Solar Protein',
      'yogurt',
      'oatmeal',
      'salad',
      'chicken',
      'rice',
      'batido',
    ];
    const knownExercises = [
      '跑步',
      '快走',
      '散步',
      '瑜伽',
      '骑行',
      '力量训练',
      'yoga',
      'run',
      'walk',
      'cycling',
    ];
    final known = type == CheckInType.meal ? knownMeals : knownExercises;
    for (final candidate in known) {
      if (lower.contains(candidate.toLowerCase())) return candidate;
    }

    final withoutNumbers = input
        .replaceAll(RegExp(r'\b\d{1,2}[:：]\d{2}\b'), '')
        .replaceAll(RegExp(r'\d+\s*(克|g|分钟|min|minutes)?'), '')
        .replaceAll(RegExp(r'[,:：，。！？!?]'), ' ')
        .trim();
    final cleaned = withoutNumbers
        .replaceAll(
          RegExp(
            r'(修改|更改|改一下|改成|更新记录|纠正|修改记录|饮食|运动|早餐|午餐|晚餐|早饭|午饭|晚饭|desayuno|almuerzo|cena|breakfast|lunch|dinner|记录|请|帮我|把|的|为|到|今天|明天|昨天|edit|change|update|correct|record|meal|exercise)',
            caseSensitive: false,
          ),
          ' ',
        )
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();
    return cleaned.length >= 2 ? cleaned : '';
  }

  int? _extractValue(String lower, CheckInType type) {
    final pattern = type == CheckInType.meal
        ? RegExp(r'(\d{1,4})\s*(克|g|grams?)')
        : RegExp(r'(\d{1,3})\s*(分钟|min|mins|minutes)');
    final match = pattern.firstMatch(lower);
    return match == null ? null : int.tryParse(match.group(1)!);
  }

  String? _extractTimeOrSlot(String lower) {
    final exact = RegExp(
      r'(?<!\d)([01]?\d|2[0-3])[:：]([0-5]\d)',
    ).firstMatch(lower);
    if (exact != null) {
      return '${exact.group(1)!.padLeft(2, '0')}:${exact.group(2)}';
    }
    if (_matches(lower, ['早餐', 'breakfast', 'desayuno'])) return '早餐';
    if (_matches(lower, ['午餐', '午饭', 'lunch', 'almuerzo'])) return '午餐';
    if (_matches(lower, ['晚餐', '晚饭', 'dinner', 'cena'])) return '晚餐';
    if (_matches(lower, ['早上', '上午', 'morning'])) return '早餐';
    if (_matches(lower, ['中午', 'noon', 'midday'])) return '午餐';
    if (_matches(lower, ['晚上', '下午', 'evening', 'night'])) return '晚餐';
    return null;
  }

  bool _matchesRecord(
    CheckInRecord record, {
    required String time,
    required String name,
  }) {
    final timeMatch = time.contains(':')
        ? record.time == time
        : _slotForRecordTime(record.time) == time;
    if (!timeMatch) return false;
    if (name.isEmpty || name == '选择一条记录') return true;
    final needle = name.toLowerCase();
    return record.name.toLowerCase().contains(needle) ||
        needle.contains(record.name.toLowerCase());
  }

  String _slotForRecordTime(String time) {
    final hour = int.tryParse(time.split(':').first) ?? 12;
    if (hour < 11) return '早餐';
    if (hour < 16) return '午餐';
    return '晚餐';
  }

  double _confidence({
    required CheckInRecord record,
    required String time,
    required String name,
  }) {
    // A unique meal slot is still actionable confidence; an exact clock time
    // gets a small additional signal in the explanation, not a different path.
    var score = time.contains(':') && record.time == time ? 0.9 : 0.85;
    if (name.isNotEmpty &&
        (record.name.toLowerCase().contains(name.toLowerCase()) ||
            name.toLowerCase().contains(record.name.toLowerCase()))) {
      score += 0.1;
    }
    return score;
  }

  String _nowTime() {
    final n = DateTime.now();
    return '${n.hour.toString().padLeft(2, '0')}:${n.minute.toString().padLeft(2, '0')}';
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

class _ParsedCheckIn {
  const _ParsedCheckIn({
    required this.name,
    required this.time,
    required this.value,
  });

  final String name;
  final String? time;
  final int? value;
}
