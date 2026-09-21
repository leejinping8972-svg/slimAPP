import '../models/check_in_chat.dart';
import 'check_in_apply.dart';

class CheckInParseResult {
  const CheckInParseResult({
    required this.isModify,
    this.type,
    this.draft,
    this.missing = const [],
    this.confidence = 0,
  });

  final bool isModify;
  final CheckInType? type;
  final CheckInDraft? draft;
  final List<String> missing;
  final double confidence;

  bool get isCheckIn => type != null || isModify;
  bool get slotsComplete => missing.isEmpty && draft != null;
}

/// Demo keyword / regex parser for create & modify check-in intents.
class CheckInIntentParser {
  static CheckInParseResult parse(String input, {String language = 'es-MX'}) {
    final lower = input.toLowerCase().trim();
    final zh = language == 'zh' || language.startsWith('zh');
    final isModify = _isModify(lower);

    final type = _detectType(lower);
    if (type == null && !isModify) {
      return const CheckInParseResult(isModify: false);
    }
    if (type == null && isModify) {
      return CheckInParseResult(
        isModify: true,
        missing: const ['type'],
        confidence: 0.4,
      );
    }

    final missing = <String>[];
    final fields = <String, String>{};
    var value = '';
    var unit = '';
    var time = _extractTime(lower) ?? '';
    var confidence = 0.55;

    switch (type!) {
      case CheckInType.water:
        final ml = _extractMl(lower);
        if (ml != null) {
          value = '$ml';
          unit = 'ml';
          confidence = 0.9;
        } else if (_hasCup(lower)) {
          value = '250';
          unit = 'ml';
          confidence = 0.7;
        } else if (isModify) {
          missing.add('value');
        } else {
          value = '250';
          unit = 'ml';
          confidence = 0.65;
        }
      case CheckInType.sleep:
        final hours = _extractHours(lower);
        if (hours != null) {
          value = hours % 1 == 0 ? '${hours.toInt()}' : '$hours';
          unit = 'h';
          confidence = 0.9;
        } else if (isModify) {
          missing.add('value');
        } else {
          value = '7';
          unit = 'h';
          confidence = 0.65;
        }
        fields['quality'] = _sleepQuality(lower);
      case CheckInType.weight:
        final kg = _extractKg(lower);
        if (kg != null) {
          value = kg % 1 == 0 ? '${kg.toInt()}' : '$kg';
          unit = 'kg';
          confidence = 0.9;
        } else if (isModify) {
          missing.add('value');
        } else {
          value = '';
          unit = 'kg';
          confidence = 0.6;
        }
      case CheckInType.exercise:
        final min = _extractMinutes(lower);
        if (min != null) {
          value = '$min';
          unit = 'min';
          confidence = 0.9;
          fields['kcal'] = '${(min * 7.1).round()}';
        } else if (isModify) {
          missing.add('value');
        } else {
          value = '30';
          unit = 'min';
          confidence = 0.65;
          fields['kcal'] = '213';
        }
        fields['activity'] = _activityName(lower, zh: zh);
      case CheckInType.mood:
        value = _moodTag(lower);
        confidence = value == 'tired' && !_hasMoodWord(lower) ? 0.55 : 0.85;
        if (isModify && !_hasMoodWord(lower)) missing.add('value');
      case CheckInType.product:
        value = 'taken';
        confidence = 0.85;
        time = time.isEmpty ? CheckInApply.nowTime() : time;
      case CheckInType.meal:
        value = _mealName(lower, zh: zh);
        final macros = _mealMacros(lower);
        fields['kcal'] = '${macros.$1}';
        fields['protein'] = '${macros.$2}';
        fields['carbs'] = '${macros.$3}';
        fields['fat'] = '${macros.$4}';
        fields['meal'] = _mealSlot(lower);
        time = time.isEmpty ? CheckInApply.nowTime() : time;
        confidence = _hasMealFoodWord(lower) ? 0.85 : 0.7;
        if (isModify && value.isEmpty) missing.add('value');
        if (value.isEmpty && !isModify) {
          value = zh ? '一餐' : 'Comida';
          confidence = 0.6;
        }
    }

    // Modify without clear new value still needs value for stage-1 completeness
    // except product (boolean taken).
    if (isModify &&
        type != CheckInType.product &&
        value.isEmpty &&
        !missing.contains('value')) {
      missing.add('value');
    }

    final draft = CheckInDraft(
      type: type,
      value: value,
      unit: unit,
      time: time,
      label: _label(type, value, unit, zh: zh),
      confidence: confidence,
      mode: isModify ? CheckInDraftMode.edit : CheckInDraftMode.create,
      rawFields: {
        ...fields,
        if (value.isNotEmpty) 'value': value,
        if (time.isNotEmpty) 'time': time,
      },
    );

    return CheckInParseResult(
      isModify: isModify,
      type: type,
      draft: draft,
      missing: missing,
      confidence: confidence,
    );
  }

  static bool _isModify(String lower) {
    const keys = [
      'modificar',
      'cambiar',
      'corregir',
      'actualizar',
      'editar',
      'change',
      'modify',
      'correct',
      'update',
      'edit',
      '改',
      '修改',
      '纠正',
      '更正',
      '更新',
    ];
    return keys.any(lower.contains);
  }

  static CheckInType? _detectType(String lower) {
    if (_any(lower, [
      'agua',
      'vaso',
      'ml',
      'water',
      'cup',
      'glass',
      '喝水',
      '水分',
      '水杯',
    ])) {
      return CheckInType.water;
    }
    if (_any(lower, [
      'dormí',
      'dormi',
      'sueño',
      'sueno',
      'sleep',
      'slept',
      '睡眠',
      '睡觉',
      '睡了',
    ])) {
      return CheckInType.sleep;
    }
    if (_any(lower, ['peso', 'kg', 'lb', 'weight', '体重', '公斤'])) {
      return CheckInType.weight;
    }
    if (_any(lower, [
      'ejercicio',
      'yoga',
      'corrí',
      'correr',
      'caminé',
      'gimnasio',
      'exercise',
      'workout',
      'ran',
      'walk',
      '运动',
      '瑜伽',
      '跑步',
      '散步',
    ])) {
      return CheckInType.exercise;
    }
    if (_any(lower, [
      'batido',
      'proteína',
      'proteina',
      'solar protein',
      'meal replacement',
      'sustituto',
      '代餐',
      '蛋白粉',
    ])) {
      return CheckInType.product;
    }
    if (_any(lower, [
      'comí',
      'comi',
      'desayuno',
      'comida',
      'almuerzo',
      'cena',
      'ensalada',
      'ate',
      'breakfast',
      'lunch',
      'dinner',
      'salad',
      '吃了',
      '早餐',
      '午餐',
      '晚餐',
      '沙拉',
    ])) {
      return CheckInType.meal;
    }
    if (_any(lower, [
      'cansada',
      'estresada',
      'triste',
      'ánimo',
      'animo',
      'humor',
      'mood',
      'tired',
      'stressed',
      'sad',
      '心情',
      '情绪',
      '累',
      '压力',
    ])) {
      return CheckInType.mood;
    }
    return null;
  }

  static bool _any(String lower, List<String> keys) =>
      keys.any(lower.contains);

  static bool _hasCup(String lower) =>
      _any(lower, ['vaso', 'cup', 'glass', '一杯', '杯水']);

  static bool _hasMoodWord(String lower) => _any(lower, [
        'cansada',
        'estresada',
        'triste',
        'tired',
        'stressed',
        'sad',
        '累',
        '压力',
        '难过',
        '开心',
        'happy',
      ]);

  static bool _hasMealFoodWord(String lower) => _any(lower, [
        'ensalada',
        'salad',
        'yogur',
        'yogurt',
        'salmón',
        'salmon',
        'avena',
        'oatmeal',
        'pollo',
        'chicken',
        '沙拉',
        '鸡肉',
      ]);

  static int? _extractMl(String lower) {
    final m = RegExp(r'(\d{3,4})\s*ml').firstMatch(lower);
    if (m != null) return int.tryParse(m.group(1)!);
    final bare = RegExp(r'(\d{3,4})').firstMatch(lower);
    if (bare != null &&
        (lower.contains('agua') ||
            lower.contains('water') ||
            lower.contains('喝'))) {
      final n = int.tryParse(bare.group(1)!);
      if (n != null && n >= 100) return n;
    }
    return null;
  }

  static double? _extractHours(String lower) {
    final m = RegExp(r'(\d+(?:[.,]\d+)?)\s*h').firstMatch(lower) ??
        RegExp(r'(\d+(?:[.,]\d+)?)\s*horas?').firstMatch(lower) ??
        RegExp(r'(\d+(?:[.,]\d+)?)\s*小时').firstMatch(lower) ??
        RegExp(r'dorm[ií]\s+(\d+(?:[.,]\d+)?)').firstMatch(lower) ??
        RegExp(r'slept\s+(\d+(?:[.,]\d+)?)').firstMatch(lower) ??
        RegExp(r'睡了\s*(\d+(?:[.,]\d+)?)').firstMatch(lower);
    if (m == null) return null;
    return double.tryParse(m.group(1)!.replaceAll(',', '.'));
  }

  static double? _extractKg(String lower) {
    final m = RegExp(r'(\d+(?:[.,]\d+)?)\s*kg').firstMatch(lower) ??
        RegExp(r'(\d+(?:[.,]\d+)?)\s*公斤').firstMatch(lower);
    if (m == null) return null;
    return double.tryParse(m.group(1)!.replaceAll(',', '.'));
  }

  static int? _extractMinutes(String lower) {
    final m = RegExp(r'(\d+)\s*min').firstMatch(lower) ??
        RegExp(r'(\d+)\s*minutos?').firstMatch(lower) ??
        RegExp(r'(\d+)\s*分钟').firstMatch(lower);
    if (m != null) return int.tryParse(m.group(1)!);
    return null;
  }

  static String? _extractTime(String lower) {
    final m = RegExp(r'\b([01]?\d|2[0-3])[:：]([0-5]\d)\b').firstMatch(lower);
    if (m == null) return null;
    return '${m.group(1)!.padLeft(2, '0')}:${m.group(2)!}';
  }

  static String _sleepQuality(String lower) {
    if (_any(lower, ['poor', 'bad', 'mal', '差'])) return 'poor';
    if (_any(lower, ['great', 'good', 'bien', '好'])) return 'good';
    return 'okay';
  }

  static String _moodTag(String lower) {
    if (_any(lower, ['estresada', 'stressed', '压力'])) return 'stressed';
    if (_any(lower, ['triste', 'sad', '难过'])) return 'sad';
    if (_any(lower, ['happy', 'feliz', '开心'])) return 'happy';
    return 'tired';
  }

  static String _mealSlot(String lower) {
    if (_any(lower, ['desayuno', 'breakfast', '早餐'])) return 'Breakfast';
    if (_any(lower, ['cena', 'dinner', '晚餐'])) return 'Dinner';
    if (_any(lower, ['colación', 'snack', '加餐'])) return 'Snack';
    return 'Lunch';
  }

  static String _mealName(String lower, {required bool zh}) {
    if (lower.contains('ensalada') || lower.contains('salad') || lower.contains('沙拉')) {
      return zh ? '沙拉' : 'Ensalada';
    }
    if (lower.contains('yogur') || lower.contains('yogurt')) {
      return zh ? '酸奶' : 'Yogur';
    }
    if (lower.contains('avena') || lower.contains('oatmeal')) {
      return zh ? '燕麦' : 'Avena';
    }
    if (lower.contains('salmón') || lower.contains('salmon')) {
      return zh ? '三文鱼' : 'Salmón';
    }
    if (lower.contains('pollo') || lower.contains('chicken') || lower.contains('鸡')) {
      return zh ? '鸡肉餐' : 'Pollo';
    }
    return '';
  }

  static String _activityName(String lower, {required bool zh}) {
    if (_any(lower, ['yoga', '瑜伽'])) return zh ? '瑜伽' : 'Yoga';
    if (_any(lower, ['corr', 'run', '跑步'])) return zh ? '跑步' : 'Correr';
    if (_any(lower, ['camin', 'walk', '散步', '步行'])) {
      return zh ? '步行' : 'Caminar';
    }
    if (_any(lower, ['gimnasio', 'gym', '健身'])) return zh ? '健身' : 'Gimnasio';
    return zh ? '运动' : 'Ejercicio';
  }

  static (int, int, int, int) _mealMacros(String lower) {
    if (_any(lower, ['ensalada', 'salad', '沙拉', 'pollo', 'chicken', '鸡'])) {
      return (320, 28, 22, 12);
    }
    if (_any(lower, ['avena', 'oatmeal', 'yogurt', 'yogur', '燕麦', '酸奶'])) {
      return (280, 18, 35, 8);
    }
    if (_any(lower, ['salmón', 'salmon', '三文鱼'])) {
      return (440, 36, 18, 24);
    }
    return (340, 26, 32, 14);
  }

  static String _label(
    CheckInType type,
    String value,
    String unit, {
    required bool zh,
  }) {
    if (value.isEmpty) return type.name;
    return unit.isEmpty ? value : '$value $unit';
  }
}
