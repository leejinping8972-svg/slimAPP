import '../models/models.dart';

/// Personalized daily intake + habit tips from onboarding basics.
/// Returns null when basics are missing — UI should hide the block.
class DailyAdviceHelper {
  static bool hasBasics(UserProfile profile) => profile.onboardingComplete;

  static DailyAdvice? forProfile(UserProfile profile) {
    if (!hasBasics(profile)) return null;

    final kcal = profile.calorieTargetKcal > 0
        ? profile.calorieTargetKcal
        : _estimateKcal(profile);
    final water = profile.hydrationTargetMl > 0
        ? profile.hydrationTargetMl
        : 2000;
    final proteinG = (kcal * 0.28 / 4).round().clamp(60, 140);
    final sleepHours = switch (profile.ageRange) {
      '18-34' => '7–9',
      '35-50' => '7–8',
      '51-64' => '7–8',
      '65+' => '7–8',
      _ => '7–8',
    };

    final tips = <String>[
      if (profile.userPlanType == UserPlanType.mealReplacement)
        'Replace ${profile.mealSlot} with your Solar Protein shake today.'
      else if (profile.userPlanType == UserPlanType.nonMealReplacement)
        'Take your linked product at ${profile.reminderTime}.'
      else
        'Log meals and water — Sunny will refine your plan after you link a product.',
      'Aim for ~$water ml water across the day.',
      'Target sleep window: $sleepHours hours tonight.',
    ];

    return DailyAdvice(
      calorieKcal: kcal,
      proteinG: proteinG,
      waterMl: water,
      tips: tips,
    );
  }

  static int _estimateKcal(UserProfile profile) {
    // Mifflin-style rough resting need × 1.3 activity, capped for slim journey.
    final ageMid = switch (profile.ageRange) {
      '18-34' => 28,
      '35-50' => 42,
      '51-64' => 55,
      '65+' => 68,
      _ => 40,
    };
    final bmr = 10 * profile.currentWeightKg +
        6.25 * profile.heightCm -
        5 * ageMid -
        161;
    return (bmr * 1.3).round().clamp(1200, 2000);
  }
}

class DailyAdvice {
  const DailyAdvice({
    required this.calorieKcal,
    required this.proteinG,
    required this.waterMl,
    required this.tips,
  });

  final int calorieKcal;
  final int proteinG;
  final int waterMl;
  final List<String> tips;
}
