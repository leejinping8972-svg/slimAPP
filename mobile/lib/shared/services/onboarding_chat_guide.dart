import '../models/models.dart';
import '../l10n/app_strings.dart';

/// Guides new users through product intro + core questions inside Sunny chat.
class OnboardingChatGuide {
  static const privacyPrompt =
      'Antes de personalizar tu viaje, confirma lo siguiente:\n\n'
      '¿Aceptas nuestra Política de privacidad y Aviso de salud?\n'
      'Responde "Acepto" para continuar.';

  static const planOfferPrompt =
      'Puedo personalizar tu siguiente paso. ¿Qué te gustaría hacer?\n\n'
      '• Obtener un plan — responde unas preguntas para recibir un plan de vitalidad a tu medida\n'
      '• Solo ayuda con productos — consejos sobre los productos que ya tienes\n'
      '• Solo explorar — descubre tu viaje a tu ritmo\n'
      '• Ahora no — podemos platicar cuando quieras';

  static const planOfferActions = [
    'Obtener un plan',
    'Solo ayuda con productos',
    'Solo explorar',
    'Ahora no',
  ];

  static const sunnyCapabilitiesIntro =
      'Esto es lo que puedo hacer por ti:\n'
      '• Ritual diario — Crea hábitos que iluminen cada día\n'
      '• Panel de vitalidad — Registra tus datos y observa tu progreso\n'
      '• Fórmula científica — Fórmulas profesionales y acompañamiento suave\n'
      '• Apoyo de la comunidad — Apóyense y crezcan juntas\n'
      '• Activación de plan — Servicio al cliente puede ayudarte a abrir tu viaje';

  static const sunnyGreetingHelp =
      'Te ayudaré a crear una cuenta, conocer tu ritmo '
      'y acompañarte en un viaje suave de vitalidad.';

  static const healthNeedPrompt =
      'Primero cuéntame qué te importa más ahora:\n\n'
      '• Perder peso — un ritmo suave de vitalidad y hábitos\n'
      '• Salud intestinal — digestión y bienestar diario\n'
      '• Antiedad — energía y cuidado continuo\n'
      '• Más energía — rituales ligeros para sentirte activa\n'
      '• Otra necesidad — cuéntame con tus palabras';

  static const healthNeedActions = [
    'Perder peso',
    'Salud intestinal',
    'Antiedad',
    'Más energía',
    'Otra necesidad',
  ];

  static const messengerHandoffPrompt =
      'Gracias por compartir tu perfil. El siguiente paso es hablar con nuestro '
      'equipo en Messenger: te orientarán con el producto o plan más adecuado '
      'para tu necesidad.\n\n'
      'Toca «Hablar por Messenger» cuando quieras.';

  /// Seed for users who skipped order linking (no product).
  static List<ChatMessage> noProductSeedMessages([UserProfile? profile]) {
    final s = AppStrings.fromCode(profile?.language);
    return [
      ChatMessage(
        id: 'onboard_greet',
        isUser: false,
        text: '${s.noProductGreeting}${s.healthNeedPrompt}',
        timestamp: DateTime.now(),
        actionLabels: s.healthNeedActions,
      ),
    ];
  }

  /// Legacy alias — prefer [noProductSeedMessages] for skip path.
  static List<ChatMessage> seedMessages([UserProfile? profile]) =>
      noProductSeedMessages(profile);

  /// Greeting (with Sunny intro + product intros) + plan offer CTA.
  static List<ChatMessage> productIntroSeedMessages(UserProfile profile) {
    final name = profile.recipientName.isNotEmpty
        ? profile.recipientName
        : (profile.nickname.isNotEmpty ? profile.nickname : 'amiga');
    final products = profile.linkedProducts;
    final now = DateTime.now();

    final buffer = StringBuffer()
      ..writeln('¡Hola, $name! ☀️ Soy Sunny, tu compañera diaria de vitalidad.')
      ..writeln()
      ..writeln(sunnyCapabilitiesIntro);
    if (products.isNotEmpty) {
      buffer
        ..writeln()
        ..writeln(
          'Encontré ${products.length} '
          '${products.length == 1 ? 'producto vinculado' : 'productos vinculados'} para ti. '
          'Aquí tienes una breve introducción a cada uno.',
        );
      for (final p in products) {
        final journeyLine = p.isMealReplacement
            ? 'Viaje Slim de 28 días desbloqueado'
            : 'Plan diario de cuidado del producto';
        buffer
          ..writeln()
          ..writeln(p.productName)
          ..writeln(journeyLine)
          ..writeln()
          ..writeln('Cómo usarlo:')
          ..writeln(
            '• ${p.blurb.isNotEmpty ? p.blurb : _defaultBlurb(p.isMealReplacement)}',
          );
      }
    }

    final suggestions = products
        .map(
          (p) => ChatSuggestionItem(
            emoji: p.isMealReplacement ? '🌿' : '✨',
            title: p.productName,
            subtitle: p.series.isNotEmpty
                ? p.series
                : (p.isMealReplacement
                      ? 'Viaje Slim de 28 días desbloqueado'
                      : 'Plan diario de cuidado del producto'),
          ),
        )
        .toList();

    return [
      ChatMessage(
        id: 'onboard_greet',
        isUser: false,
        text: buffer.toString().trimRight(),
        timestamp: now,
        suggestions: suggestions.isEmpty ? null : suggestions,
      ),
      ChatMessage(
        id: 'onboard_plan_offer',
        isUser: false,
        text: planOfferPrompt,
        timestamp: now.add(const Duration(milliseconds: 1)),
        actionLabels: planOfferActions,
      ),
    ];
  }

  static String _defaultBlurb(bool isMeal) {
    return isMeal
        ? 'Mezcla una porción con agua o leche como apoyo para tus comidas. '
              'Registra tu batido en el chat de Sunny o en tu viaje cada día.'
        : 'Tómalo según las indicaciones de la etiqueta. '
              'Configura un recordatorio diario para que Sunny pueda acompañarte.';
  }

  static List<ChatSuggestionItem> planCardItems(UserProfile profile) {
    final product = profile.linkedProductName.isNotEmpty
        ? profile.linkedProductName
        : 'Solar Protein 28-Day';
    return [
      ChatSuggestionItem(
        emoji: '🌱',
        title: 'Días 1–7 · Inicio',
        subtitle: 'Crea tu ritual diario con $product',
      ),
      const ChatSuggestionItem(
        emoji: '🌿',
        title: 'Días 8–14 · Adaptación',
        subtitle: 'Registra hidratación, peso y ritmo de comidas',
      ),
      const ChatSuggestionItem(
        emoji: '✨',
        title: 'Días 15–21 · Estabilidad',
        subtitle: 'Optimiza comidas, sueño y movimiento',
      ),
      const ChatSuggestionItem(
        emoji: '🏁',
        title: 'Días 22–28 · Finalización',
        subtitle: 'Celebra tu avance y planea tu próximo capítulo',
      ),
    ];
  }

  static String planBasisExplanation(UserProfile profile) {
    final productLine = profile.linkedProducts.isNotEmpty
        ? 'Productos vinculados: ${profile.linkedProducts.map((p) => p.productName).join(', ')}.'
        : profile.linkedProductName.isNotEmpty
        ? 'Producto vinculado: ${profile.linkedProductName}.'
        : 'Aún no hay ningún producto vinculado; el plan comienza en modo de exploración.';
    return 'Tu viaje Slim de 28 días está listo.\n\n'
        'Cómo se creó este plan:\n'
        '• Rango de edad: ${profile.ageRange}\n'
        '• Perfil corporal: ${profile.heightCm.toStringAsFixed(0)} cm · '
        '${profile.currentWeightKg.toStringAsFixed(1)} → '
        '${profile.targetWeightKg.toStringAsFixed(0)} kg\n'
        '• Comida principal: ${profile.mealSlot}\n'
        '• Recordatorio matutino: ${profile.reminderTime}\n'
        '• $productLine\n\n'
        'Combinamos tu perfil, ciclo de producto y la ciencia de hábitos suaves: '
        'no se trata de perfección, sino de un ritmo con el que puedes crecer.';
  }

  static String day1RitualGuide(UserProfile profile) {
    final morning = profile.reminderTime;
    final meal = profile.mealSlot;
    final name = profile.recipientName.isNotEmpty
        ? profile.recipientName
        : (profile.nickname.isNotEmpty ? profile.nickname : 'amiga');
    return 'Muy bien, $name: tu plan está listo.\n\n'
        'Ahora te guiaré en el registro del Día 1. '
        'Completa estos cuatro rituales hoy:\n\n'
        '1. Registro matutino (alrededor de las $morning)\n'
        '2. Tu comida de apoyo de $meal / Solar Protein\n'
        '3. Bebe al menos 2 vasos de agua\n'
        '4. Relájate antes de dormir esta noche\n\n'
        'Comienza con cualquiera de las acciones siguientes: las registraré y te animaré.';
  }

  static List<ChatSuggestionItem> day1RitualItems(UserProfile profile) {
    return [
      const ChatSuggestionItem(
        emoji: '✅',
        title: 'Comenzar el registro del Día 1',
        subtitle: 'Abre Ritual y marca tus primeros logros',
      ),
      const ChatSuggestionItem(
        emoji: '💧',
        title: 'Registrar agua ahora',
        subtitle: 'Cada vaso cuenta: mantén tu racha',
      ),
      ChatSuggestionItem(
        emoji: '🥗',
        title: 'Registrar tu comida de ${profile.mealSlot}',
        subtitle: 'Dime qué comiste y lo registraré',
      ),
      const ChatSuggestionItem(
        emoji: '🌙',
        title: 'Registrar sueño más tarde',
        subtitle: 'Termina el Día 1 con una relajación tranquila',
      ),
    ];
  }

  static ({SunnyIntentResult result, UserProfile profile}) handle({
    required String input,
    required UserProfile profile,
  }) {
    final lower = input.toLowerCase().trim();
    final step = profile.onboardingStep.isEmpty
        ? (profile.userPlanType == UserPlanType.noProduct
              ? 'health_need'
              : 'privacy')
        : profile.onboardingStep;
    final isNoProduct = profile.userPlanType == UserPlanType.noProduct;
    final s = AppStrings.fromCode(profile.language);

    switch (step) {
      case 'health_need':
        final need = _parseHealthNeed(lower);
        if (need == null) {
          return (
            profile: profile,
            result: SunnyIntentResult(
              reply: s.isZh
                  ? '请选择一项，或用自己的话描述你的主要需求（减重、肠道、抗衰、能量或其他）。'
                  : 'Elige una opción o descríbeme tu necesidad principal '
                      '(peso, intestino, antiedad, energía u otra).',
              intents: const ['onboarding_health_need'],
              actionLabels: s.healthNeedActions,
            ),
          );
        }
        return (
          profile: profile.copyWith(
            healthNeed: need,
            onboardingStep: 'privacy',
          ),
          result: SunnyIntentResult(
            reply:
                (s.isZh
                    ? '好的，已记下：${_healthNeedLabel(need, zh: true)}。\n\n'
                    : 'Perfecto, tomo nota: ${_healthNeedLabel(need)}.\n\n') +
                s.privacyPrompt,
            intents: const ['onboarding_health_need'],
          ),
        );

      case 'plan_offer':
        if (_wantsPlan(lower)) {
          final next = profile.copyWith(onboardingStep: 'privacy');
          return (
            profile: next,
            result: const SunnyIntentResult(
              reply: privacyPrompt,
              intents: ['onboarding_plan_offer'],
            ),
          );
        }
        if (_wantsProductHelp(lower)) {
          final done = profile.copyWith(
            onboardingStep: 'done',
            onboardingComplete: true,
            isNewRegistration: false,
            sunnyIntroSeen: true,
          );
          return (
            profile: done,
            result: const SunnyIntentResult(
              reply:
                  'Perfecto, permaneceré en modo de cuidado de productos.\n\n'
                  'Pregúntame cuando quieras cómo tomar tus productos, '
                  'sobre horarios o recordatorios suaves. '
                  'Cuando quieras un plan personalizado completo, contacta a '
                  'servicio al cliente: ellos pueden ayudarte a activarlo.',
              intents: ['onboarding_product_help'],
              actionLabels: [
                'Ir al viaje',
                'Hablar por Messenger',
              ],
            ),
          );
        }
        if (_wantsBrowse(lower)) {
          final done = profile.copyWith(
            onboardingStep: 'done',
            onboardingComplete: true,
            isNewRegistration: false,
            sunnyIntroSeen: true,
          );
          return (
            profile: done,
            result: const SunnyIntentResult(
              reply:
                  'Me encanta: explora primero y sin presión.\n\n'
                  'Abre tu recorrido para consultar tu resumen de vitalidad. '
                  'Si más adelante quieres un plan activo, habla con nosotros por Messenger.',
              intents: ['onboarding_browse'],
              actionLabels: [
                'Ir al viaje',
                'Hablar por Messenger',
              ],
            ),
          );
        }
        if (_wantsNotNow(lower)) {
          final done = profile.copyWith(
            onboardingStep: 'done',
            onboardingComplete: true,
            isNewRegistration: false,
            sunnyIntroSeen: true,
          );
          return (
            profile: done,
            result: const SunnyIntentResult(
              reply:
                  'No hay problema. Tómate tu tiempo.\n\n'
                  'Cuando quieras consejos o activar un plan, abre el chat de Sunny '
                  'o habla con nosotros por Messenger: aquí estaré.',
              intents: ['onboarding_defer'],
              actionLabels: [
                'Ir al viaje',
                'Hablar por Messenger',
              ],
            ),
          );
        }
        return (
          profile: profile,
          result: const SunnyIntentResult(
            reply:
                'Elige una de las opciones siguientes o cuéntame con tus propias palabras.',
            intents: ['onboarding_plan_offer'],
            actionLabels: planOfferActions,
          ),
        );

      case 'privacy':
        if (_agrees(lower)) {
          final next = profile.copyWith(onboardingStep: 'age');
          return (
            profile: next,
            result: const SunnyIntentResult(
              reply:
                  'Gracias. ¿Qué rango de edad te corresponde mejor?\n\n'
                  '• 18-34\n• 35-50\n• 51-64\n• 65+\n• Menor de 18',
              intents: ['onboarding_privacy'],
            ),
          );
        }
        return (
          profile: profile,
          result: const SunnyIntentResult(
            reply:
                'Responde "Acepto" para continuar. Tus datos se mantienen privados '
                'y solo se usan para guiar tu ritual de vitalidad.',
            intents: ['onboarding_privacy'],
          ),
        );

      case 'age':
        final age = _parseAge(lower);
        if (age == null) {
          return (
            profile: profile,
            result: const SunnyIntentResult(
              reply:
                  'Elige una opción: 18-34, 35-50, 51-64, 65+ o menor de 18.',
              intents: ['onboarding_age'],
            ),
          );
        }
        if (age == 'Under 18') {
          return (
            profile: profile.copyWith(
              ageRange: age,
              riskLevel: RiskLevel.p0,
              onboardingStep: 'age',
            ),
            result: const SunnyIntentResult(
              reply:
                  'Según tu respuesta, es posible que un viaje Slim estándar no sea '
                  'adecuado para ti ahora. Consulta a un profesional de la salud '
                  'y, si es necesario, responde con otro rango de edad.',
              intents: ['onboarding_age'],
              riskLevel: RiskLevel.p0,
              disableActions: true,
            ),
          );
        }
        final risk = age == '65+' ? RiskLevel.p1 : RiskLevel.p2;
        return (
          profile: profile.copyWith(
            ageRange: age,
            riskLevel: risk,
            onboardingStep: 'height',
          ),
          result: SunnyIntentResult(
            reply:
                'Entendido: $age. ¿Cuál es tu estatura en cm?\n'
                '(Por ejemplo: 165)',
            intents: const ['onboarding_age'],
            riskLevel: risk,
          ),
        );

      case 'height':
        final height = _parseHeight(lower);
        if (height == null) {
          return (
            profile: profile,
            result: const SunnyIntentResult(
              reply: 'Comparte tu estatura en cm, por ejemplo: 165.',
              intents: ['onboarding_height'],
            ),
          );
        }
        return (
          profile: profile.copyWith(heightCm: height, onboardingStep: 'weight'),
          result: SunnyIntentResult(
            reply:
                'Anotado: ${height.toStringAsFixed(0)} cm. '
                '¿Cuál es tu peso actual en kg?\n(Por ejemplo: 68)',
            intents: const ['onboarding_height'],
          ),
        );

      case 'weight':
        final weight = _parseWeight(lower);
        if (weight == null) {
          return (
            profile: profile,
            result: const SunnyIntentResult(
              reply: 'Comparte tu peso en kg, por ejemplo: 68.',
              intents: ['onboarding_weight'],
            ),
          );
        }
        final recommended = (weight - 5).clamp(40.0, weight).toDouble();

        // No-product path ends after basic info → Messenger handoff.
        if (isNoProduct) {
          final done = profile.copyWith(
            currentWeightKg: weight,
            targetWeightKg: recommended,
            onboardingStep: 'done',
            onboardingComplete: true,
            isNewRegistration: false,
            sunnyIntroSeen: true,
          );
          final needLabel = _healthNeedLabel(done.healthNeed, zh: s.isZh);
          return (
            profile: done,
            result: SunnyIntentResult(
              reply: s.isZh
                  ? '已记录：${weight.toStringAsFixed(1)} kg。\n\n'
                      '快速摘要：\n'
                      '• 需求：$needLabel\n'
                      '• 年龄：${done.ageRange}\n'
                      '• 身体：${done.heightCm.toStringAsFixed(0)} cm · '
                      '${done.currentWeightKg.toStringAsFixed(1)} kg\n\n'
                      '${s.messengerHandoff}'
                  : 'Registré ${weight.toStringAsFixed(1)} kg.\n\n'
                      'Resumen rápido:\n'
                      '• Necesidad: $needLabel\n'
                      '• Edad: ${done.ageRange}\n'
                      '• Perfil: ${done.heightCm.toStringAsFixed(0)} cm · '
                      '${done.currentWeightKg.toStringAsFixed(1)} kg\n\n'
                      '${s.messengerHandoff}',
              intents: const ['onboarding_complete', 'messenger_handoff'],
              actionLabels: [s.talkMessenger, s.goJourney],
            ),
          );
        }

        return (
          profile: profile.copyWith(
            currentWeightKg: weight,
            targetWeightKg: recommended,
            onboardingStep: 'target',
          ),
          result: SunnyIntentResult(
            reply:
                'Registré ${weight.toStringAsFixed(1)} kg. '
                'Una meta suave podría ser ${recommended.toStringAsFixed(0)} kg.\n\n'
                'Responde con tu peso objetivo en kg o di "usar el recomendado".',
            intents: const ['onboarding_weight'],
          ),
        );

      case 'target':
        double target;
        if (lower.contains('recommend') ||
            lower.contains('use') ||
            lower.contains('recomend') ||
            lower.contains('usar')) {
          target = profile.targetWeightKg;
        } else {
          final parsed = _parseWeight(lower);
          if (parsed == null) {
            return (
              profile: profile,
              result: const SunnyIntentResult(
                reply:
                    'Envía un peso objetivo en kg o responde "usar el recomendado".',
                intents: ['onboarding_target'],
              ),
            );
          }
          target = parsed.clamp(40, profile.currentWeightKg);
        }
        return (
          profile: profile.copyWith(
            targetWeightKg: target,
            onboardingStep: 'meal',
          ),
          result: SunnyIntentResult(
            reply:
                'Meta establecida en ${target.toStringAsFixed(0)} kg.\n\n'
                '¿Con qué comida te gustaría recibir más apoyo?\n'
                '• desayuno\n• comida\n• cena\n• no estoy segura',
            intents: const ['onboarding_target'],
          ),
        );

      case 'meal':
        final meal = _parseMeal(lower);
        if (meal == null) {
          return (
            profile: profile,
            result: const SunnyIntentResult(
              reply: 'Elige desayuno, comida, cena o no estoy segura.',
              intents: ['onboarding_meal'],
            ),
          );
        }
        return (
          profile: profile.copyWith(mealSlot: meal, onboardingStep: 'reminder'),
          result: SunnyIntentResult(
            reply:
                'Perfecto: nos enfocaremos en $meal.\n\n'
                '¿A qué hora te recuerdo tu ritual matutino?\n'
                '(Por ejemplo: 08:00 u 8 a. m.)',
            intents: const ['onboarding_meal'],
          ),
        );

      case 'reminder':
        final time = _parseTime(lower);
        if (time == null) {
          return (
            profile: profile,
            result: const SunnyIntentResult(
              reply: 'Comparte una hora como 08:00 u 8 a. m.',
              intents: ['onboarding_reminder'],
            ),
          );
        }
        final done = profile.copyWith(
          reminderTime: time,
          reminderTime2: '20:00',
          onboardingStep: 'done',
          onboardingComplete: true,
          isNewRegistration: false,
          sunnyIntroSeen: true,
          membershipPlan: profile.hasActiveSlimPlan
              ? 'Solar Protein 28-Day'
              : profile.membershipPlan,
        );
        return (
          profile: done,
          result: SunnyIntentResult(
            reply: planBasisExplanation(done),
            intents: const ['onboarding_complete', 'plan_generated'],
            suggestions: planCardItems(done),
            actionLabels: done.hasActiveSlimPlan
                ? const [
                    'Comenzar el registro del Día 1',
                    'Registrar agua',
                    'Registrar comida',
                    'Ir al viaje',
                  ]
                : const [
                    'Ver mi plan',
                    'Hablar por Messenger',
                  ],
          ),
        );

      default:
        if (profile.userPlanType == UserPlanType.noProduct) {
          return (
            profile: profile.copyWith(onboardingStep: 'health_need'),
            result: SunnyIntentResult(
              reply: s.healthNeedPrompt,
              intents: const ['onboarding_restart'],
              actionLabels: s.healthNeedActions,
            ),
          );
        }
        return (
          profile: profile.copyWith(onboardingStep: 'privacy'),
          result: const SunnyIntentResult(
            reply: privacyPrompt,
            intents: ['onboarding_restart'],
          ),
        );
    }
  }

  static bool wantsPlanRequest(String input) => _wantsPlan(input.toLowerCase());

  static String? _parseHealthNeed(String lower) {
    if (lower.contains('perder peso') ||
        lower.contains('bajar de peso') ||
        lower.contains('adelgazar') ||
        lower.contains('weight loss') ||
        lower.contains('减重') ||
        lower.contains('减肥') ||
        lower == 'peso') {
      return 'weight_loss';
    }
    if (lower.contains('intestinal') ||
        lower.contains('intestino') ||
        lower.contains('digest') ||
        lower.contains('gut') ||
        lower.contains('肠道')) {
      return 'gut';
    }
    if (lower.contains('antiedad') ||
        lower.contains('anti-edad') ||
        lower.contains('anti edad') ||
        lower.contains('envejecimiento') ||
        lower.contains('aging') ||
        lower.contains('抗衰')) {
      return 'anti_aging';
    }
    if (lower.contains('más energía') ||
        lower.contains('mas energia') ||
        lower.contains('energía') ||
        lower.contains('energia') ||
        lower.contains('energy') ||
        lower.contains('提升能量') ||
        lower.contains('能量')) {
      return 'energy';
    }
    if (lower.contains('otra necesidad') ||
        lower.contains('otra') ||
        lower.contains('other') ||
        lower.contains('其他')) {
      return 'other';
    }
    if (lower.length >= 4 &&
        !lower.contains('acepto') &&
        !lower.contains('我同意') &&
        !RegExp(r'^\d').hasMatch(lower)) {
      return 'other';
    }
    return null;
  }

  static String _healthNeedLabel(String need, {bool zh = false}) {
    if (zh) {
      return switch (need) {
        'weight_loss' => '减重',
        'gut' => '肠道健康',
        'anti_aging' => '抗衰',
        'energy' => '提升能量',
        'other' => '其他需求',
        _ => need.isEmpty ? '待定' : need,
      };
    }
    return switch (need) {
      'weight_loss' => 'perder peso',
      'gut' => 'salud intestinal',
      'anti_aging' => 'antiedad',
      'energy' => 'más energía',
      'other' => 'otra necesidad',
      _ => need.isEmpty ? 'por definir' : need,
    };
  }
  static bool _wantsPlan(String lower) {
    return lower.contains('obtener un plan') ||
        lower.contains('quiero un plan') ||
        lower.contains('plan personalizado') ||
        lower.contains('get plan') ||
        lower.contains('get it now') ||
        lower.contains('get now') ||
        lower == 'yes' ||
        lower == 'y' ||
        lower.contains('personalized plan') ||
        (lower.contains('plan') &&
            !lower.contains('product help') &&
            !lower.contains('not now'));
  }

  static bool _wantsProductHelp(String lower) {
    return lower.contains('ayuda con productos') ||
        lower.contains('solo productos') ||
        lower.contains('cuidado de productos') ||
        lower.contains('product help') ||
        lower.contains('only product') ||
        lower.contains('product care') ||
        lower.contains('just help');
  }

  static bool _wantsBrowse(String lower) {
    return lower.contains('solo explorar') ||
        lower.contains('explorar') ||
        lower.contains('ver productos') ||
        lower.contains('browsing') ||
        lower.contains('browse') ||
        lower.contains('look around') ||
        lower.contains('explore');
  }

  static bool _wantsNotNow(String lower) {
    return lower.contains('ahora no') ||
        lower.contains('más tarde') ||
        lower.contains('después') ||
        lower.contains('not now') ||
        lower.contains('later') ||
        lower.contains('nothing') ||
        lower.contains('skip') ||
        lower == 'no';
  }

  static bool _agrees(String lower) {
    return lower.contains('acepto') ||
        lower.contains('estoy de acuerdo') ||
        lower.contains('de acuerdo') ||
        lower.contains('我同意') ||
        lower.contains('同意') ||
        lower.contains('agree') ||
        lower == 'yes' ||
        lower == 'y' ||
        lower.contains('ok');
  }

  static String? _parseAge(String lower) {
    if (lower.contains('menor de 18') ||
        lower.contains('menor18') ||
        lower.contains('under 18') ||
        lower.contains('under18') ||
        lower == '<18') {
      return 'Under 18';
    }
    if (lower.contains('65')) return '65+';
    if (lower.contains('51') || lower.contains('51-64')) return '51-64';
    if (lower.contains('35') || lower.contains('35-50')) return '35-50';
    if (lower.contains('18-34') ||
        lower.contains('18 to 34') ||
        RegExp(r'\b1[89]\b|\b2\d\b|\b3[0-4]\b').hasMatch(lower)) {
      return '18-34';
    }
    return null;
  }

  static double? _parseHeight(String lower) {
    final m = RegExp(r'(\d{2,3}(?:\.\d)?)\s*(cm)?').firstMatch(lower);
    if (m != null) {
      final v = double.tryParse(m.group(1)!);
      if (v != null && v >= 140 && v <= 210) return v;
    }
    return null;
  }

  static double? _parseWeight(String lower) {
    final m = RegExp(r'(\d{2,3}(?:\.\d)?)\s*(kg|lbs?)?').firstMatch(lower);
    if (m != null) {
      final v = double.tryParse(m.group(1)!);
      if (v != null && v >= 40 && v <= 200) return v;
    }
    return null;
  }

  static String? _parseMeal(String lower) {
    if (lower.contains('desayuno') || lower.contains('breakfast')) {
      return 'breakfast';
    }
    if (lower.contains('comida') ||
        lower.contains('almuerzo') ||
        lower.contains('lunch')) {
      return 'lunch';
    }
    if (lower.contains('cena') || lower.contains('dinner')) return 'dinner';
    if (lower.contains('no estoy segura') ||
        lower.contains('no estoy seguro') ||
        lower.contains('not sure') ||
        lower.contains('unsure')) {
      return 'not sure';
    }
    return null;
  }

  static String? _parseTime(String lower) {
    final colon = RegExp(r'\b([01]?\d|2[0-3]):([0-5]\d)\b').firstMatch(lower);
    if (colon != null) {
      final h = int.parse(colon.group(1)!).toString().padLeft(2, '0');
      return '$h:${colon.group(2)}';
    }
    final ampm = RegExp(
      r'\b(\d{1,2})\s*(am|pm|a\.?\s*m\.?|p\.?\s*m\.?)\b',
    ).firstMatch(lower);
    if (ampm != null) {
      var h = int.parse(ampm.group(1)!);
      final isPm = ampm.group(2)!.replaceAll(RegExp(r'[\s.]'), '') == 'pm';
      if (isPm && h < 12) h += 12;
      if (!isPm && h == 12) h = 0;
      return '${h.toString().padLeft(2, '0')}:00';
    }
    final hourOnly = RegExp(r'\b([01]?\d|2[0-3])\b').firstMatch(lower);
    if (hourOnly != null) {
      final h = int.parse(hourOnly.group(1)!);
      if (h >= 5 && h <= 12) return '${h.toString().padLeft(2, '0')}:00';
    }
    return null;
  }

  static List<(String, String)> quickAsksFor(
    String step, {
    String language = 'es-MX',
  }) {
    final zh = language == 'zh' || language.startsWith('zh');
    if (zh) {
      return switch (step) {
        'health_need' => [
          ('⚖️', '减重'),
          ('🌿', '肠道健康'),
          ('✨', '抗衰'),
          ('☀️', '提升能量'),
          ('💬', '其他需求'),
        ],
        'plan_offer' => [
          ('✨', 'Obtener un plan'),
          ('🧴', 'Solo ayuda con productos'),
          ('👀', 'Solo explorar'),
          ('🌙', 'Ahora no'),
        ],
        'privacy' => [('✅', '我同意')],
        'age' => [('🌿', '35-50'), ('☀️', '18-34'), ('🌙', '51-64')],
        'height' => [('📏', '165 cm')],
        'weight' => [('⚖️', '68 kg')],
        'target' => [('🎯', '使用推荐值'), ('⚖️', '62 kg')],
        'meal' => [('🌅', '早餐'), ('🥗', '午餐'), ('🌙', '晚餐')],
        'reminder' => [('⏰', '08:00'), ('☀️', '早上 7 点')],
        _ => const [],
      };
    }
    return switch (step) {
      'health_need' => [
        ('⚖️', 'Perder peso'),
        ('🌿', 'Salud intestinal'),
        ('✨', 'Antiedad'),
        ('☀️', 'Más energía'),
        ('💬', 'Otra necesidad'),
      ],
      'plan_offer' => [
        ('✨', 'Obtener un plan'),
        ('🧴', 'Solo ayuda con productos'),
        ('👀', 'Solo explorar'),
        ('🌙', 'Ahora no'),
      ],
      'privacy' => [('✅', 'Acepto')],
      'age' => [('🌿', '35-50'), ('☀️', '18-34'), ('🌙', '51-64')],
      'height' => [('📏', '165 cm')],
      'weight' => [('⚖️', '68 kg')],
      'target' => [('🎯', 'usar el recomendado'), ('⚖️', '62 kg')],
      'meal' => [('🌅', 'desayuno'), ('🥗', 'comida'), ('🌙', 'cena')],
      'reminder' => [('⏰', '08:00'), ('☀️', '7 a. m.')],
      _ => const [],
    };
  }
}
