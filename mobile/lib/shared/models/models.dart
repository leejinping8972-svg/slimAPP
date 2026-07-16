enum RiskLevel { p0, p1, p2 }

enum ProductTakenStatus { notRecorded, taken, partial, skippedWithReason }

enum DemoDay { day1, day12, day28 }

enum UserPlanType { mealReplacement, nonMealReplacement, noProduct }

enum OrderLinkStatus { notStarted, linked, failed, skipped }

class UserCoupon {
  const UserCoupon({
    required this.amount,
    required this.currency,
    required this.scope,
    required this.expiresAt,
    this.status = 'unused',
  });

  final double amount;
  final String currency;
  final String scope;
  final DateTime expiresAt;
  final String status;
}

class UserProfile {
  const UserProfile({
    this.nickname = 'Freya',
    this.ageRange = '35-50',
    this.heightCm = 165,
    this.currentWeightKg = 68,
    this.targetWeightKg = 62,
    this.weightUnit = 'lb',
    this.heightUnit = 'ft/in',
    this.language = 'en-US',
    this.region = 'US',
    this.reminderTime = '08:00',
    this.reminderTime2 = '20:00',
    this.mealSlot = 'breakfast',
    this.hydrationTargetMl = 2000,
    this.calorieTargetKcal = 1600,
    this.exerciseTargetKcal = 500,
    this.riskLevel = RiskLevel.p2,
    this.onboardingComplete = false,
    this.isLoggedIn = false,
    this.isNewRegistration = false,
    this.couponRewardSeen = false,
    this.linkedOrderNo = '',
    this.linkedProductName = '',
    this.orderLinkStatus = OrderLinkStatus.notStarted,
    this.userPlanType = UserPlanType.noProduct,
    this.hidePurchaseGuideCard = false,
    this.journeyCompleteSeen = false,
    this.sunnyIntroSeen = false,
    this.onboardingStep = '',
    this.welcomeCoupon,
    this.activationCode = '',
    this.membershipPlan = 'Solar Protein 28-Day',
    this.membershipExpires = '2026-09-18',
  });

  final String nickname;
  final String ageRange;
  final double heightCm;
  final double currentWeightKg;
  final double targetWeightKg;
  final String weightUnit;
  final String heightUnit;
  final String language;
  final String region;
  final String reminderTime;
  final String reminderTime2;
  final String mealSlot;
  final int hydrationTargetMl;
  final int calorieTargetKcal;
  final int exerciseTargetKcal;
  final RiskLevel riskLevel;
  final bool onboardingComplete;
  final bool isLoggedIn;
  final bool isNewRegistration;
  final bool couponRewardSeen;
  final String linkedOrderNo;
  final String linkedProductName;
  final OrderLinkStatus orderLinkStatus;
  final UserPlanType userPlanType;
  final bool hidePurchaseGuideCard;
  final bool journeyCompleteSeen;
  final bool sunnyIntroSeen;
  /// Chat onboarding step: privacy → age → height → weight → target → meal → reminder → done
  final String onboardingStep;
  final UserCoupon? welcomeCoupon;
  final String activationCode;
  final String membershipPlan;
  final String membershipExpires;

  UserProfile copyWith({
    String? nickname,
    String? ageRange,
    double? heightCm,
    double? currentWeightKg,
    double? targetWeightKg,
    String? weightUnit,
    String? heightUnit,
    String? language,
    String? region,
    String? reminderTime,
    String? reminderTime2,
    String? mealSlot,
    int? hydrationTargetMl,
    int? calorieTargetKcal,
    int? exerciseTargetKcal,
    RiskLevel? riskLevel,
    bool? onboardingComplete,
    bool? isLoggedIn,
    bool? isNewRegistration,
    bool? couponRewardSeen,
    String? linkedOrderNo,
    String? linkedProductName,
    OrderLinkStatus? orderLinkStatus,
    UserPlanType? userPlanType,
    bool? hidePurchaseGuideCard,
    bool? journeyCompleteSeen,
    bool? sunnyIntroSeen,
    String? onboardingStep,
    UserCoupon? welcomeCoupon,
    String? activationCode,
    String? membershipPlan,
    String? membershipExpires,
  }) {
    return UserProfile(
      nickname: nickname ?? this.nickname,
      ageRange: ageRange ?? this.ageRange,
      heightCm: heightCm ?? this.heightCm,
      currentWeightKg: currentWeightKg ?? this.currentWeightKg,
      targetWeightKg: targetWeightKg ?? this.targetWeightKg,
      weightUnit: weightUnit ?? this.weightUnit,
      heightUnit: heightUnit ?? this.heightUnit,
      language: language ?? this.language,
      region: region ?? this.region,
      reminderTime: reminderTime ?? this.reminderTime,
      reminderTime2: reminderTime2 ?? this.reminderTime2,
      mealSlot: mealSlot ?? this.mealSlot,
      hydrationTargetMl: hydrationTargetMl ?? this.hydrationTargetMl,
      calorieTargetKcal: calorieTargetKcal ?? this.calorieTargetKcal,
      exerciseTargetKcal: exerciseTargetKcal ?? this.exerciseTargetKcal,
      riskLevel: riskLevel ?? this.riskLevel,
      onboardingComplete: onboardingComplete ?? this.onboardingComplete,
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      isNewRegistration: isNewRegistration ?? this.isNewRegistration,
      couponRewardSeen: couponRewardSeen ?? this.couponRewardSeen,
      linkedOrderNo: linkedOrderNo ?? this.linkedOrderNo,
      linkedProductName: linkedProductName ?? this.linkedProductName,
      orderLinkStatus: orderLinkStatus ?? this.orderLinkStatus,
      userPlanType: userPlanType ?? this.userPlanType,
      hidePurchaseGuideCard: hidePurchaseGuideCard ?? this.hidePurchaseGuideCard,
      journeyCompleteSeen: journeyCompleteSeen ?? this.journeyCompleteSeen,
      sunnyIntroSeen: sunnyIntroSeen ?? this.sunnyIntroSeen,
      onboardingStep: onboardingStep ?? this.onboardingStep,
      welcomeCoupon: welcomeCoupon ?? this.welcomeCoupon,
      activationCode: activationCode ?? this.activationCode,
      membershipPlan: membershipPlan ?? this.membershipPlan,
      membershipExpires: membershipExpires ?? this.membershipExpires,
    );
  }
}

class MealLogEntry {
  const MealLogEntry({
    required this.meal,
    required this.name,
    required this.time,
    required this.kcal,
    this.protein = 0,
    this.carbs = 0,
    this.fat = 0,
    this.source = 'chat',
  });

  final String meal;
  final String name;
  final String time;
  final int kcal;
  final int protein;
  final int carbs;
  final int fat;
  final String source;
}

class TodayRecord {
  const TodayRecord({
    this.productTaken = ProductTakenStatus.notRecorded,
    this.hydrationMl = 0,
    this.weightRecorded = false,
    this.weightValueKg = 0,
    this.moodTag = '',
    this.energyTag = '',
    this.sleepHours = 0,
    this.sleepQuality = '',
    this.ritualCompletionRate = 0,
    this.consistency7d = 0,
    this.intakeKcal = 0,
    this.proteinG = 0,
    this.carbsG = 0,
    this.fatG = 0,
    this.fiberG = 0,
    this.exerciseKcal = 0,
    this.exerciseMinutes = 0,
    this.exerciseSessions = 0,
    this.meals = const [],
  });

  final ProductTakenStatus productTaken;
  final int hydrationMl;
  final bool weightRecorded;
  final double weightValueKg;
  final String moodTag;
  final String energyTag;
  final double sleepHours;
  final String sleepQuality;
  final double ritualCompletionRate;
  final double consistency7d;
  final int intakeKcal;
  final int proteinG;
  final int carbsG;
  final int fatG;
  final int fiberG;
  final int exerciseKcal;
  final int exerciseMinutes;
  final int exerciseSessions;
  final List<MealLogEntry> meals;

  TodayRecord copyWith({
    ProductTakenStatus? productTaken,
    int? hydrationMl,
    bool? weightRecorded,
    double? weightValueKg,
    String? moodTag,
    String? energyTag,
    double? sleepHours,
    String? sleepQuality,
    double? ritualCompletionRate,
    double? consistency7d,
    int? intakeKcal,
    int? proteinG,
    int? carbsG,
    int? fatG,
    int? fiberG,
    int? exerciseKcal,
    int? exerciseMinutes,
    int? exerciseSessions,
    List<MealLogEntry>? meals,
  }) {
    return TodayRecord(
      productTaken: productTaken ?? this.productTaken,
      hydrationMl: hydrationMl ?? this.hydrationMl,
      weightRecorded: weightRecorded ?? this.weightRecorded,
      weightValueKg: weightValueKg ?? this.weightValueKg,
      moodTag: moodTag ?? this.moodTag,
      energyTag: energyTag ?? this.energyTag,
      sleepHours: sleepHours ?? this.sleepHours,
      sleepQuality: sleepQuality ?? this.sleepQuality,
      ritualCompletionRate: ritualCompletionRate ?? this.ritualCompletionRate,
      consistency7d: consistency7d ?? this.consistency7d,
      intakeKcal: intakeKcal ?? this.intakeKcal,
      proteinG: proteinG ?? this.proteinG,
      carbsG: carbsG ?? this.carbsG,
      fatG: fatG ?? this.fatG,
      fiberG: fiberG ?? this.fiberG,
      exerciseKcal: exerciseKcal ?? this.exerciseKcal,
      exerciseMinutes: exerciseMinutes ?? this.exerciseMinutes,
      exerciseSessions: exerciseSessions ?? this.exerciseSessions,
      meals: meals ?? this.meals,
    );
  }
}

class VitalityScores {
  const VitalityScores({
    this.dailyVitality = 0,
    this.ritualCompletion = 0,
    this.hydrationScore = 0,
    this.productRitualScore = 0,
    this.nutritionScore = 0,
    this.exerciseScore = 0,
    this.weightCheckScore = 0,
    this.moodCheckScore = 0,
    this.sleepScore = 0,
    this.consistencyScore = 0,
  });

  final int dailyVitality;
  final int ritualCompletion;
  final int hydrationScore;
  final int productRitualScore;
  final int nutritionScore;
  final int exerciseScore;
  final int weightCheckScore;
  final int moodCheckScore;
  final int sleepScore;
  final int consistencyScore;
}

class JourneyState {
  const JourneyState({
    required this.day,
    required this.totalDays,
    required this.completionPercent,
    required this.phase,
    required this.themeEn,
    required this.themeZh,
    required this.encouragement,
    required this.vitalityTrend,
    required this.weightTrend,
    required this.consistency5d,
    required this.dayStatuses,
    required this.unlockedMilestones,
    required this.todayRecord,
    required this.vitalityScores,
    this.sunnyCardMessage = '',
  });

  final int day;
  final int totalDays;
  final int completionPercent;
  final String phase;
  final String themeEn;
  final String themeZh;
  final String encouragement;
  final List<double> vitalityTrend;
  final List<double> weightTrend;
  final List<bool> consistency5d;
  final List<String> dayStatuses;
  final List<int> unlockedMilestones;
  final TodayRecord todayRecord;
  final VitalityScores vitalityScores;
  final String sunnyCardMessage;
}

class ChatSuggestionItem {
  const ChatSuggestionItem({
    required this.emoji,
    required this.title,
    required this.subtitle,
  });

  final String emoji;
  final String title;
  final String subtitle;
}

class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.isUser,
    required this.text,
    this.timestamp,
    this.isStreaming = false,
    this.suggestions,
    this.actionLabels,
  });

  final String id;
  final bool isUser;
  final String text;
  final DateTime? timestamp;
  final bool isStreaming;
  final List<ChatSuggestionItem>? suggestions;
  final List<String>? actionLabels;

  ChatMessage copyWith({
    String? text,
    bool? isStreaming,
    List<ChatSuggestionItem>? suggestions,
    List<String>? actionLabels,
  }) {
    return ChatMessage(
      id: id,
      isUser: isUser,
      text: text ?? this.text,
      timestamp: timestamp,
      isStreaming: isStreaming ?? this.isStreaming,
      suggestions: suggestions ?? this.suggestions,
      actionLabels: actionLabels ?? this.actionLabels,
    );
  }
}

class Product {
  const Product({
    required this.id,
    required this.name,
    required this.series,
    required this.shortDescription,
    required this.priceDisplay,
    required this.colorHex,
    this.tag = '',
    this.ingredients = '',
    this.usage = '',
    this.warnings = '',
    this.benefits = '',
    this.isNew = false,
  });

  final String id;
  final String name;
  final String series;
  final String shortDescription;
  final String priceDisplay;
  final String colorHex;
  final String tag;
  final String ingredients;
  final String usage;
  final String warnings;
  final String benefits;
  final bool isNew;

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      name: json['name'] as String,
      series: json['series'] as String,
      shortDescription: json['shortDescription'] as String,
      priceDisplay: json['priceDisplay'] as String,
      colorHex: json['colorHex'] as String? ?? '#5E6B45',
      tag: json['tag'] as String? ?? '',
      ingredients: json['ingredients'] as String? ?? '',
      usage: json['usage'] as String? ?? '',
      warnings: json['warnings'] as String? ?? '',
      benefits: json['benefits'] as String? ?? '',
      isNew: json['isNew'] as bool? ?? false,
    );
  }
}

class Milestone {
  const Milestone({
    required this.day,
    required this.title,
    required this.description,
    required this.unlocked,
  });

  final int day;
  final String title;
  final String description;
  final bool unlocked;

  factory Milestone.fromJson(Map<String, dynamic> json) {
    return Milestone(
      day: json['day'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      unlocked: json['unlocked'] as bool? ?? false,
    );
  }
}

class SunnyIntentResult {
  const SunnyIntentResult({
    required this.reply,
    required this.intents,
    this.riskLevel = RiskLevel.p2,
    this.disableActions = false,
    this.todayUpdates,
    this.suggestions,
    this.actionLabels,
  });

  final String reply;
  final List<String> intents;
  final RiskLevel riskLevel;
  final bool disableActions;
  final TodayRecord? todayUpdates;
  final List<ChatSuggestionItem>? suggestions;
  final List<String>? actionLabels;
}
