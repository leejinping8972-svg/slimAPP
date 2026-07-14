import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/models.dart';
import '../services/vitality_scorer.dart';

class MockDataRepository {
  static const journeyDays = 28;

  JourneyState _buildJourney({
    required int day,
    required int completionPercent,
    required String phase,
    required String themeEn,
    required String encouragement,
    required TodayRecord todayRecord,
    required double consistency7d,
    required List<int> unlockedMilestones,
    required String sunnyCard,
  }) {
    final scores = VitalityScorer.calculate(
      record: todayRecord,
      hydrationTargetMl: 2000,
      planType: UserPlanType.mealReplacement,
      consistency7d: consistency7d,
    );
    final trend = List<double>.generate(journeyDays, (i) {
      if (i < day) return 55 + (i * 1.2) + (i % 3 == 0 ? 5 : 0);
      return 0;
    });
    final dayStatuses = List<String>.generate(journeyDays, (i) {
      if (i < day - 1) return 'completed';
      if (i == day - 1) return 'today';
      return 'open';
    });
    final weightTrend = List<double>.generate(day, (i) {
      final start = todayRecord.weightValueKg > 0
          ? todayRecord.weightValueKg + 3.5
          : 68.0;
      final end = todayRecord.weightValueKg > 0
          ? todayRecord.weightValueKg
          : 68.0;
      if (day <= 1) return end;
      return start - (start - end) * (i / (day - 1));
    });
    final consistency5d = List<bool>.generate(5, (i) {
      final dayIndex = day - 5 + i;
      if (dayIndex < 0) return false;
      if (dayIndex >= dayStatuses.length) return false;
      final status = dayStatuses[dayIndex];
      return status == 'completed' || status == 'today';
    });
    return JourneyState(
      day: day,
      totalDays: journeyDays,
      completionPercent: completionPercent,
      phase: phase,
      themeEn: themeEn,
      themeZh: '',
      encouragement: encouragement,
      vitalityTrend: trend,
      weightTrend: weightTrend,
      consistency5d: consistency5d,
      dayStatuses: dayStatuses,
      unlockedMilestones: unlockedMilestones,
      todayRecord: todayRecord,
      vitalityScores: scores,
      sunnyCardMessage: sunnyCard,
    );
  }

  JourneyState journeyForDay(DemoDay demoDay) {
    switch (demoDay) {
      case DemoDay.day1:
        return _buildJourney(
          day: 1,
          completionPercent: 4,
          phase: 'Launch',
          themeEn: 'Action',
          encouragement: 'Start today — perfection is not the goal.',
          todayRecord: const TodayRecord(consistency7d: 0),
          consistency7d: 0,
          unlockedMilestones: [],
          sunnyCard: 'Welcome to Day 1. One gentle step is enough.',
        );
      case DemoDay.day12:
        return _buildJourney(
          day: 12,
          completionPercent: 43,
          phase: 'Adaptation',
          themeEn: 'Keep Going',
          encouragement: 'You do not need to push hard — just continue.',
          todayRecord: const TodayRecord(
            productTaken: ProductTakenStatus.taken,
            hydrationMl: 1500,
            weightRecorded: true,
            weightValueKg: 66.5,
            moodTag: 'okay',
            sleepHours: 7,
            sleepQuality: 'good',
            consistency7d: 0.71,
          ),
          consistency7d: 0.71,
          unlockedMilestones: [7],
          sunnyCard:
              'Day 12 is open. A small glass of water can help your rhythm.',
        );
      case DemoDay.day28:
        return _buildJourney(
          day: 28,
          completionPercent: 100,
          phase: 'Completion',
          themeEn: 'Graduation',
          encouragement: 'You grew toward the light for 28 days.',
          todayRecord: const TodayRecord(
            productTaken: ProductTakenStatus.taken,
            hydrationMl: 2000,
            weightRecorded: true,
            weightValueKg: 64.2,
            moodTag: 'good',
            sleepHours: 7.5,
            sleepQuality: 'good',
            consistency7d: 0.87,
          ),
          consistency7d: 0.87,
          unlockedMilestones: [7, 14, 21, 28],
          sunnyCard: 'Day 28 — you made it. Ready for your next journey?',
        );
    }
  }

  Future<List<Product>> loadProducts() async {
    final raw = await rootBundle.loadString('assets/mock/products.json');
    final list = jsonDecode(raw) as List<dynamic>;
    return list
        .map((e) => Product.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<Milestone>> loadMilestones({required List<int> unlocked}) async {
    final raw = await rootBundle.loadString('assets/mock/milestones.json');
    final list = jsonDecode(raw) as List<dynamic>;
    return list.map((e) {
      final m = Milestone.fromJson(e as Map<String, dynamic>);
      return Milestone(
        day: m.day,
        title: m.title,
        description: m.description,
        unlocked: unlocked.contains(m.day),
      );
    }).toList();
  }

  List<ChatMessage> initialChatMessages(
    int day, {
    UserPlanType planType = UserPlanType.mealReplacement,
    bool hasWelcomeCoupon = false,
    String linkedProductName = '',
  }) {
    // Signature retained for callers; Home chat seeds a design-matched demo thread.
    final _ = (day, planType, hasWelcomeCoupon, linkedProductName);
    final now = DateTime.now();
    final t1 = DateTime(now.year, now.month, now.day, 10, 30);
    final t2 = DateTime(now.year, now.month, now.day, 10, 31);

    return [
      ChatMessage(
        id: 'demo_user_1',
        isUser: true,
        text:
            'I\'ve been staying up late lately and can\'t wake up in the morning. My energy is low. How should I adjust?',
        timestamp: t1,
      ),
      ChatMessage(
        id: 'demo_sunny_1',
        isUser: false,
        text:
            'Staying up late disrupts your circadian rhythm, affecting hormones, mood, and metabolism. We can start with three areas: Sleep Rhythm + Energy Management + Gentle Habits — to gradually regain your pace and vitality ✨',
        timestamp: t1,
        suggestions: const [
          ChatSuggestionItem(
            emoji: '🌙',
            title: 'Establish a Regular Routine',
            subtitle:
                'Aim to sleep by 11:00 PM and wake up at a fixed time every morning.',
          ),
          ChatSuggestionItem(
            emoji: '☀️',
            title: 'Morning Wake-up Ritual',
            subtitle:
                '10 minutes of sunlight + warm water + light stretching to energize your body.',
          ),
          ChatSuggestionItem(
            emoji: '🤎',
            title: 'Evening Relaxation Routine',
            subtitle:
                'Foot soak / Yoga / Meditation for 10 minutes to help you unwind.',
          ),
        ],
        actionLabels: const ['View Detailed Plan', 'Set Sleep Goal'],
      ),
      ChatMessage(
        id: 'demo_user_2',
        isUser: true,
        text: 'OK, I\'ll start trying tonight!',
        timestamp: t2,
      ),
      ChatMessage(
        id: 'demo_sunny_2',
        isUser: false,
        text:
            'Great job, Freya! Every small start leads to significant changes 🌿 I\'ll be here with you, witnessing your growth and transformation!',
        timestamp: t2,
      ),
    ];
  }
}
