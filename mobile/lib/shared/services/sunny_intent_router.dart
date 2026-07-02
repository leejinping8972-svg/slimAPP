import '../models/models.dart';

class SunnyIntentRouter {
  SunnyIntentResult route({
    required String input,
    required TodayRecord today,
    required int journeyDay,
    required int hydrationTargetMl,
    required String nickname,
  }) {
    final lower = input.toLowerCase();

    if (_matches(lower, ['pregnant', 'pregnancy', 'breastfeeding', '备孕', '怀孕'])) {
      return const SunnyIntentResult(
        reply:
            'Thank you for sharing that. A standard Slim Journey is not designed for pregnancy or breastfeeding. Please speak with a healthcare professional before making any nutrition changes.',
        intents: ['health_risk'],
        riskLevel: RiskLevel.p0,
        disableActions: true,
      );
    }

    if (_matches(lower, ['kill myself', 'want to die', 'hurt myself', '不想活'])) {
      return const SunnyIntentResult(
        reply:
            'I hear how much pain you are carrying right now. You deserve real support beyond this app. Please reach out to a trusted person or local crisis line right away.',
        intents: ['emotional_crisis'],
        riskLevel: RiskLevel.p0,
        disableActions: true,
      );
    }

    if (_matches(lower, ['hungry', 'haven\'t had enough water', 'not enough water', 'a bit hungry'])) {
      return SunnyIntentResult(
        reply:
            'Feeling a little hungry is normal while your body adjusts, $nickname. You have ${today.hydrationMl}ml logged — about ${hydrationTargetMl - today.hydrationMl}ml to go. A small glass after dinner can help your rhythm.',
        intents: ['plan_adjustment', 'record_hydration'],
        todayUpdates: today,
      );
    }

    if (_matches(lower, ['drank', 'shake', 'protein', 'meal replacement', '代餐'])) {
      return SunnyIntentResult(
        reply:
            'Got it — I logged your Solar Protein for today. That is one gentle step toward your Day $journeyDay rhythm.',
        intents: ['record_product'],
        todayUpdates: today.copyWith(productTaken: ProductTakenStatus.taken),
      );
    }

    if (_matches(lower, ['water', 'ml', 'cup', 'glass', '1500', '2000', '饮水'])) {
      final amount = _extractMl(lower) ?? 250;
      final newMl = today.hydrationMl + amount;
      return SunnyIntentResult(
        reply:
            'I added ${amount}ml for you. You are at ${newMl}ml today — ${(hydrationTargetMl - newMl).clamp(0, hydrationTargetMl)}ml from your goal.',
        intents: ['record_hydration'],
        todayUpdates: today.copyWith(hydrationMl: newMl),
      );
    }

    if (_matches(lower, ['weight', 'kg', 'lb', 'pound', '体重'])) {
      return SunnyIntentResult(
        reply:
            'Your weight is logged. One number can move — your trend over time matters more than any single day.',
        intents: ['record_weight'],
        todayUpdates: today.copyWith(weightRecorded: true),
      );
    }

    if (_matches(lower, ['tired', 'stressed', 'sad', 'overwhelmed', '累', '压力'])) {
      return SunnyIntentResult(
        reply:
            'Thank you for telling me how you feel. Let us keep today simple — one small ritual is enough. Tomorrow we continue from here.',
        intents: ['emotional_support'],
        todayUpdates: today.copyWith(moodTag: 'tired'),
      );
    }

    if (_matches(lower, ['dinner', 'party', '聚餐', 'adjust', 'plan'])) {
      return SunnyIntentResult(
        reply:
            'A social dinner does not undo your journey. Enjoy it gently, hydrate well, and we will keep tomorrow light and steady.',
        intents: ['plan_adjustment'],
        todayUpdates: today,
      );
    }

    if (_matches(lower, ['when', 'how', 'product', 'solar', 'drink'])) {
      return const SunnyIntentResult(
        reply:
            'Solar Protein works best as a meal you would normally skip — many people choose breakfast or lunch. Consistency matters more than perfect timing.',
        intents: ['product_qa'],
      );
    }

    return SunnyIntentResult(
      reply:
          'I am here with you on Day $journeyDay, $nickname. One gentle step today is enough — would you like to log water, your shake, or how you feel?',
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
    if (input.contains('cup') || input.contains('glass')) return 250;
    return null;
  }
}
