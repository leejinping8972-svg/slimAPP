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
  }) {
    final greeting = switch (planType) {
      UserPlanType.mealReplacement =>
        day == 1
            ? 'Hi Freya, I am Viva — your growth companion for the next 28 days. How are you feeling today?'
            : 'Good to see you on Day $day, Freya. How is your rhythm today?',
      UserPlanType.nonMealReplacement =>
        'Hi Freya, I will remind you to use your product each day and help you track how you feel.',
      UserPlanType.noProduct =>
        'You do not have a dedicated plan yet, but you can keep chatting with me. Tell me your goals and I will recommend the right products.',
    };
    return [
      ChatMessage(
        id: 'welcome',
        isUser: false,
        text: greeting,
        timestamp: DateTime.now(),
      ),
    ];
  }
}
