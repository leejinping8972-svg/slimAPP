import '../models/models.dart';

/// Guides new users through product intro + core questions inside Sunny chat.
class OnboardingChatGuide {
  static const privacyPrompt =
      'Before we personalize your journey, please confirm:\n\n'
      'Do you agree to our privacy policy and health disclaimer?\n'
      'Reply "I agree" to continue.';

  static const planOfferPrompt =
      'I can personalize your next step. What would you like to do?\n\n'
      '• Get Plan — answer a few questions for a tailored vitality plan\n'
      '• Product help only — tips for the products you already have\n'
      '• Just browsing — explore Mall and Journey at your pace\n'
      '• Not now — hang out with me anytime later';

  static const planOfferActions = [
    'Get Plan',
    'Product help only',
    'Just browsing',
    'Not now',
  ];

  static const sunnyGreetingHelp =
      'I\'ll help you create an account, link your order, '
      'and start a gentle 28-day journey.';

  static const sunnyCapabilitiesIntro =
      'Here\'s what I can help with:\n'
      '• Daily Ritual — Build habits that brighten every day\n'
      '• Vitality Dashboard — Track your data and see your progress\n'
      '• Scientific Formula — Professional formulas, gentle companionship\n'
      '• Community Support — Support each other and grow together\n'
      '• Health Mall — Curated picks for a healthier lifestyle';

  static List<ChatMessage> seedMessages() {
    return [
      ChatMessage(
        id: 'onboard_greet',
        isUser: false,
        text:
            'Hi! ☀️ I\'m Sunny, your daily vitality partner.\n\n'
            '$sunnyGreetingHelp\n\n'
            '$sunnyCapabilitiesIntro\n\n'
            '$privacyPrompt',
        timestamp: DateTime.now(),
      ),
    ];
  }

  /// Greeting (with Sunny intro + product intros) + plan offer CTA.
  static List<ChatMessage> productIntroSeedMessages(UserProfile profile) {
    final name = profile.recipientName.isNotEmpty
        ? profile.recipientName
        : (profile.nickname.isNotEmpty ? profile.nickname : 'there');
    final products = profile.linkedProducts;
    final now = DateTime.now();

    final buffer = StringBuffer()
      ..writeln('Hi $name! ☀️ I\'m Sunny, your daily vitality partner.')
      ..writeln()
      ..writeln(sunnyCapabilitiesIntro);
    if (products.isNotEmpty) {
      buffer
        ..writeln()
        ..writeln(
          'I found ${products.length} linked '
          '${products.length == 1 ? 'product' : 'products'} for you — '
          'here is a quick intro for each one.',
        );
      for (final p in products) {
        final journeyLine = p.isMealReplacement
            ? '28-Day Slim Journey unlocked'
            : 'Daily product care plan';
        buffer
          ..writeln()
          ..writeln(p.productName)
          ..writeln(journeyLine)
          ..writeln()
          ..writeln('How to use:')
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
                    ? '28-Day Slim Journey unlocked'
                    : 'Daily product care plan'),
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
        ? 'Mix one serving with water or milk as meal support. '
            'Log your shake in Sunny chat or Journey each day.'
        : 'Take as directed on the label. '
            'Set a daily reminder so Sunny can check in with you.';
  }

  static List<ChatSuggestionItem> planCardItems(UserProfile profile) {
    final product = profile.linkedProductName.isNotEmpty
        ? profile.linkedProductName
        : 'Solar Protein 28-Day';
    return [
      ChatSuggestionItem(
        emoji: '🌱',
        title: 'Days 1–7 · Launch',
        subtitle: 'Build your daily ritual with $product',
      ),
      const ChatSuggestionItem(
        emoji: '🌿',
        title: 'Days 8–14 · Adaptation',
        subtitle: 'Track hydration, weight, and meal rhythm',
      ),
      const ChatSuggestionItem(
        emoji: '✨',
        title: 'Days 15–21 · Stability',
        subtitle: 'Optimize meals, sleep, and movement',
      ),
      const ChatSuggestionItem(
        emoji: '🏁',
        title: 'Days 22–28 · Completion',
        subtitle: 'Celebrate progress and plan your next chapter',
      ),
    ];
  }

  static String planBasisExplanation(UserProfile profile) {
    final productLine = profile.linkedProducts.isNotEmpty
        ? 'Linked products: ${profile.linkedProducts.map((p) => p.productName).join(', ')}.'
        : profile.linkedProductName.isNotEmpty
            ? 'Linked product: ${profile.linkedProductName}.'
            : 'No product linked yet — plan starts in explore mode.';
    return 'Your 28-Day Slim Journey is ready.\n\n'
        'How this plan was shaped:\n'
        '• Age range: ${profile.ageRange}\n'
        '• Body profile: ${profile.heightCm.toStringAsFixed(0)} cm · '
        '${profile.currentWeightKg.toStringAsFixed(1)} → '
        '${profile.targetWeightKg.toStringAsFixed(0)} kg\n'
        '• Meal focus: ${profile.mealSlot}\n'
        '• Morning reminder: ${profile.reminderTime}\n'
        '• $productLine\n\n'
        'We combine your profile, product cycle, and gentle habit science — '
        'not perfection, but a rhythm you can grow with.';
  }

  static String day1RitualGuide(UserProfile profile) {
    final morning = profile.reminderTime;
    final meal = profile.mealSlot;
    final name = profile.recipientName.isNotEmpty
        ? profile.recipientName
        : (profile.nickname.isNotEmpty ? profile.nickname : 'there');
    return 'Nice work, $name — your plan is ready.\n\n'
        'I will walk you through Day 1 check-in now. '
        'Complete these four rituals today:\n\n'
        '1. Morning check-in (around $morning)\n'
        '2. Your $meal support meal / Solar Protein\n'
        '3. Drink at least 2 cups of water\n'
        '4. Sleep wind-down tonight\n\n'
        'Start with any action below — I will log it and cheer you on.';
  }

  static List<ChatSuggestionItem> day1RitualItems(UserProfile profile) {
    return [
      const ChatSuggestionItem(
        emoji: '✅',
        title: 'Start Day 1 check-in',
        subtitle: 'Open Ritual and mark your first wins',
      ),
      const ChatSuggestionItem(
        emoji: '💧',
        title: 'Log water now',
        subtitle: 'One glass counts — keep the streak going',
      ),
      ChatSuggestionItem(
        emoji: '🥗',
        title: 'Log your ${profile.mealSlot} meal',
        subtitle: 'Tell me what you had and I will record it',
      ),
      const ChatSuggestionItem(
        emoji: '🌙',
        title: 'Log sleep later',
        subtitle: 'Close Day 1 with a calm wind-down',
      ),
    ];
  }

  static ({SunnyIntentResult result, UserProfile profile}) handle({
    required String input,
    required UserProfile profile,
  }) {
    final lower = input.toLowerCase().trim();
    final step = profile.onboardingStep.isEmpty
        ? 'privacy'
        : profile.onboardingStep;

    switch (step) {
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
                  'Perfect — I\'ll stay in product-care mode.\n\n'
                  'Ask me anytime about how to take your products, '
                  'timing, or gentle reminders. '
                  'When you want a full personalized plan later, just say "Get Plan".',
              intents: ['onboarding_product_help'],
              actionLabels: ['Go to Journey', 'Browse Mall'],
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
                  'Love that — explore first, pressure later.\n\n'
                  'Browse Mall for curated picks, or open Journey to see your '
                  'vitality snapshot. I\'m here when you\'re ready for a plan.',
              intents: ['onboarding_browse'],
              actionLabels: ['Browse Mall', 'Go to Journey'],
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
                  'No problem at all. Take your time.\n\n'
                  'Whenever you want tips, a plan, or just a check-in, '
                  'open Sunny chat — I\'ll be right here.',
              intents: ['onboarding_defer'],
              actionLabels: ['Go to Journey', 'Browse Mall'],
            ),
          );
        }
        return (
          profile: profile,
          result: const SunnyIntentResult(
            reply:
                'Pick one of the options below, or tell me in your own words.',
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
                  'Thank you. Which age range fits you best?\n\n'
                  '• 18-34\n• 35-50\n• 51-64\n• 65+\n• Under 18',
              intents: ['onboarding_privacy'],
            ),
          );
        }
        return (
          profile: profile,
          result: const SunnyIntentResult(
            reply:
                'Please reply "I agree" to continue. Your data stays private '
                'and is only used to guide your vitality ritual.',
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
                  'Please choose one: 18-34, 35-50, 51-64, 65+, or Under 18.',
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
                  'Based on your answer, a standard Slim Journey may not be '
                  'right for you right now. Please consult a healthcare '
                  'professional, then reply with another age range if needed.',
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
                'Got it — $age. What is your height in cm?\n'
                '(For example: 165)',
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
              reply: 'Please share your height in cm, like 165.',
              intents: ['onboarding_height'],
            ),
          );
        }
        return (
          profile: profile.copyWith(
            heightCm: height,
            onboardingStep: 'weight',
          ),
          result: SunnyIntentResult(
            reply:
                'Noted — ${height.toStringAsFixed(0)} cm. '
                'What is your current weight in kg?\n(For example: 68)',
            intents: const ['onboarding_height'],
          ),
        );

      case 'weight':
        final weight = _parseWeight(lower);
        if (weight == null) {
          return (
            profile: profile,
            result: const SunnyIntentResult(
              reply: 'Please share your weight in kg, like 68.',
              intents: ['onboarding_weight'],
            ),
          );
        }
        final recommended =
            (weight - 5).clamp(40.0, weight).toDouble();
        return (
          profile: profile.copyWith(
            currentWeightKg: weight,
            targetWeightKg: recommended,
            onboardingStep: 'target',
          ),
          result: SunnyIntentResult(
            reply:
                'Logged ${weight.toStringAsFixed(1)} kg. '
                'A gentle target could be ${recommended.toStringAsFixed(0)} kg.\n\n'
                'Reply with your goal weight in kg, or say "use recommended".',
            intents: const ['onboarding_weight'],
          ),
        );

      case 'target':
        double target;
        if (lower.contains('recommend') || lower.contains('use')) {
          target = profile.targetWeightKg;
        } else {
          final parsed = _parseWeight(lower);
          if (parsed == null) {
            return (
              profile: profile,
              result: const SunnyIntentResult(
                reply:
                    'Send a goal weight in kg, or reply "use recommended".',
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
                'Target set to ${target.toStringAsFixed(0)} kg.\n\n'
                'Which meal would you most like support with?\n'
                '• breakfast\n• lunch\n• dinner\n• not sure',
            intents: const ['onboarding_target'],
          ),
        );

      case 'meal':
        final meal = _parseMeal(lower);
        if (meal == null) {
          return (
            profile: profile,
            result: const SunnyIntentResult(
              reply:
                  'Please choose breakfast, lunch, dinner, or not sure.',
              intents: ['onboarding_meal'],
            ),
          );
        }
        return (
          profile: profile.copyWith(
            mealSlot: meal,
            onboardingStep: 'reminder',
          ),
          result: SunnyIntentResult(
            reply:
                'Great — focusing on $meal.\n\n'
                'What time should I remind you for your morning ritual?\n'
                '(For example: 08:00 or 8am)',
            intents: const ['onboarding_meal'],
          ),
        );

      case 'reminder':
        final time = _parseTime(lower);
        if (time == null) {
          return (
            profile: profile,
            result: const SunnyIntentResult(
              reply: 'Please share a time like 08:00 or 8am.',
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
                    'Start Day 1 Check-in',
                    'Log Water',
                    'Log Meal',
                    'Go to Journey',
                  ]
                : const ['View My Plan', 'Browse Mall'],
          ),
        );

      default:
        return (
          profile: profile.copyWith(onboardingStep: 'privacy'),
          result: const SunnyIntentResult(
            reply: privacyPrompt,
            intents: ['onboarding_restart'],
          ),
        );
    }
  }

  static bool _wantsPlan(String lower) {
    return lower.contains('get plan') ||
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
    return lower.contains('product help') ||
        lower.contains('only product') ||
        lower.contains('product care') ||
        lower.contains('just help');
  }

  static bool _wantsBrowse(String lower) {
    return lower.contains('browsing') ||
        lower.contains('browse') ||
        lower.contains('look around') ||
        lower.contains('explore');
  }

  static bool _wantsNotNow(String lower) {
    return lower.contains('not now') ||
        lower.contains('later') ||
        lower.contains('nothing') ||
        lower.contains('skip') ||
        lower == 'no';
  }

  static bool _agrees(String lower) {
    return lower.contains('agree') ||
        lower == 'yes' ||
        lower == 'y' ||
        lower.contains('ok');
  }

  static String? _parseAge(String lower) {
    if (lower.contains('under 18') || lower.contains('under18') || lower == '<18') {
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
    if (lower.contains('breakfast')) return 'breakfast';
    if (lower.contains('lunch')) return 'lunch';
    if (lower.contains('dinner')) return 'dinner';
    if (lower.contains('not sure') || lower.contains('unsure')) {
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
    final ampm = RegExp(r'\b(\d{1,2})\s*(am|pm)\b').firstMatch(lower);
    if (ampm != null) {
      var h = int.parse(ampm.group(1)!);
      final isPm = ampm.group(2) == 'pm';
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

  static List<(String, String)> quickAsksFor(String step) {
    return switch (step) {
      'plan_offer' => [
        ('✨', 'Get Plan'),
        ('🧴', 'Product help only'),
        ('👀', 'Just browsing'),
        ('🌙', 'Not now'),
      ],
      'privacy' => [('✅', 'I agree')],
      'age' => [
        ('🌿', '35-50'),
        ('☀️', '18-34'),
        ('🌙', '51-64'),
      ],
      'height' => [('📏', '165 cm')],
      'weight' => [('⚖️', '68 kg')],
      'target' => [('🎯', 'use recommended'), ('⚖️', '62 kg')],
      'meal' => [
        ('🌅', 'breakfast'),
        ('🥗', 'lunch'),
        ('🌙', 'dinner'),
      ],
      'reminder' => [('⏰', '08:00'), ('☀️', '7am')],
      _ => const [],
    };
  }
}
