import '../models/models.dart';

/// Guides new users through core questions inside Sunny chat (after fixed opening).
class OnboardingChatGuide {
  static const privacyPrompt =
      'Before we personalize your journey, please confirm:\n\n'
      'Do you agree to our privacy policy and health disclaimer?\n'
      'Reply "I agree" to continue.';

  static List<ChatMessage> seedMessages() {
    return [
      ChatMessage(
        id: 'onboard_privacy',
        isUser: false,
        text: privacyPrompt,
        timestamp: DateTime.now(),
      ),
    ];
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
    final productLine = profile.linkedProductName.isNotEmpty
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

  static ({SunnyIntentResult result, UserProfile profile}) handle({
    required String input,
    required UserProfile profile,
  }) {
    final lower = input.toLowerCase().trim();
    final step = profile.onboardingStep.isEmpty
        ? 'privacy'
        : profile.onboardingStep;

    switch (step) {
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
          membershipPlan: profile.userPlanType == UserPlanType.mealReplacement
              ? 'Solar Protein 28-Day'
              : profile.membershipPlan,
        );
        return (
          profile: done,
          result: SunnyIntentResult(
            reply: planBasisExplanation(done),
            intents: const ['onboarding_complete', 'plan_generated'],
            suggestions: planCardItems(done),
            actionLabels: const ['Enter Day 1', 'View My Plan'],
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

  static bool _agrees(String lower) {
    return lower.contains('agree') ||
        lower == 'yes' ||
        lower == 'y' ||
        lower.contains('ok') ||
        lower.contains('确认') ||
        lower.contains('同意');
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
    if (lower.contains('breakfast') || lower.contains('早餐')) return 'breakfast';
    if (lower.contains('lunch') || lower.contains('午餐')) return 'lunch';
    if (lower.contains('dinner') || lower.contains('晚餐')) return 'dinner';
    if (lower.contains('not sure') || lower.contains('unsure') || lower.contains('不确定')) {
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
