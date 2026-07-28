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
      calorieTargetKcal: 1600,
      exerciseTargetKcal: 500,
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
          phase: 'Inicio',
          themeEn: 'Acción',
          encouragement: 'Comienza hoy: la perfección no es la meta.',
          todayRecord: const TodayRecord(consistency7d: 0),
          consistency7d: 0,
          unlockedMilestones: [],
          sunnyCard: 'Bienvenida al Día 1. Un paso suave es suficiente.',
        );
      case DemoDay.day12:
        return _buildJourney(
          day: 12,
          completionPercent: 43,
          phase: 'Adaptación',
          themeEn: 'Sigue adelante',
          encouragement: 'No tienes que exigirte de más: solo continúa.',
          todayRecord: TodayRecord(
            productTaken: ProductTakenStatus.taken,
            hydrationMl: 1500,
            weightRecorded: true,
            weightValueKg: 66.5,
            moodTag: 'okay',
            sleepHours: 7,
            sleepQuality: 'good',
            consistency7d: 0.71,
            intakeKcal: 1280,
            proteinG: 78,
            carbsG: 110,
            fatG: 38,
            fiberG: 18,
            exerciseKcal: 320,
            exerciseMinutes: 45,
            exerciseSessions: 1,
            meals: const [
              MealLogEntry(
                meal: 'Desayuno',
                name: 'Tazón de yogur con chía y arándanos',
                time: '08:30',
                kcal: 320,
                protein: 18,
                carbs: 35,
                fat: 12,
                source: 'chat',
              ),
              MealLogEntry(
                meal: 'Comida',
                name: 'Ensalada de quinoa con pechuga de pollo',
                time: '12:30',
                kcal: 520,
                protein: 42,
                carbs: 38,
                fat: 16,
                source: 'chat',
              ),
              MealLogEntry(
                meal: 'Cena',
                name: 'Salmón a la plancha con verduras',
                time: '18:30',
                kcal: 440,
                protein: 36,
                carbs: 22,
                fat: 24,
                source: 'quick_checkin',
              ),
            ],
          ),
          consistency7d: 0.71,
          unlockedMilestones: [7],
          sunnyCard:
              'El Día 12 está abierto. Un vaso pequeño de agua puede ayudarte a mantener tu ritmo.',
        );
      case DemoDay.day28:
        return _buildJourney(
          day: 28,
          completionPercent: 100,
          phase: 'Finalización',
          themeEn: 'Graduación',
          encouragement: 'Creciste hacia la luz durante 28 días.',
          todayRecord: TodayRecord(
            productTaken: ProductTakenStatus.taken,
            hydrationMl: 2000,
            weightRecorded: true,
            weightValueKg: 64.2,
            moodTag: 'good',
            sleepHours: 7.5,
            sleepQuality: 'good',
            consistency7d: 0.87,
            intakeKcal: 1420,
            proteinG: 90,
            carbsG: 130,
            fatG: 42,
            fiberG: 22,
            exerciseKcal: 410,
            exerciseMinutes: 55,
            exerciseSessions: 2,
            meals: const [
              MealLogEntry(
                meal: 'Desayuno',
                name: 'Batido Solar Protein',
                time: '08:00',
                kcal: 280,
                protein: 28,
                carbs: 12,
                fat: 8,
                source: 'chat',
              ),
              MealLogEntry(
                meal: 'Comida',
                name: 'Tazón de granos con verduras',
                time: '12:40',
                kcal: 480,
                protein: 30,
                carbs: 50,
                fat: 14,
                source: 'chat',
              ),
              MealLogEntry(
                meal: 'Cena',
                name: 'Cena ligera de verduras',
                time: '18:20',
                kcal: 380,
                protein: 24,
                carbs: 32,
                fat: 12,
                source: 'quick_checkin',
              ),
            ],
          ),
          consistency7d: 0.87,
          unlockedMilestones: [7, 14, 21, 28],
          sunnyCard: 'Día 28: lo lograste. ¿Lista para tu próximo viaje?',
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
            'Últimamente me desvelo y no puedo despertar por la mañana. Tengo poca energía. ¿Cómo debería ajustarme?',
        timestamp: t1,
      ),
      ChatMessage(
        id: 'demo_sunny_1',
        isUser: false,
        text:
            'Desvelarte altera tu ritmo circadiano y afecta tus hormonas, estado de ánimo y metabolismo. Podemos comenzar con tres áreas: ritmo de sueño + manejo de energía + hábitos suaves, para recuperar poco a poco tu ritmo y vitalidad ✨',
        timestamp: t1,
        suggestions: const [
          ChatSuggestionItem(
            emoji: '🌙',
            title: 'Establece una rutina regular',
            subtitle:
                'Intenta dormir antes de las 11:00 p. m. y despertar a la misma hora cada mañana.',
          ),
          ChatSuggestionItem(
            emoji: '☀️',
            title: 'Ritual matutino para despertar',
            subtitle:
                '10 minutos de luz solar + agua tibia + estiramientos suaves para activar tu cuerpo.',
          ),
          ChatSuggestionItem(
            emoji: '🤎',
            title: 'Rutina nocturna de relajación',
            subtitle:
                'Baño de pies / yoga / meditación durante 10 minutos para relajarte.',
          ),
        ],
        actionLabels: const ['Ver plan detallado', 'Definir meta de sueño'],
      ),
      ChatMessage(
        id: 'demo_user_2',
        isUser: true,
        text: '¡Está bien, empezaré a intentarlo esta noche!',
        timestamp: t2,
      ),
      ChatMessage(
        id: 'demo_sunny_2',
        isUser: false,
        text:
            '¡Excelente, Freya! Cada pequeño comienzo lleva a grandes cambios 🌿 Estaré aquí contigo para acompañar tu crecimiento y transformación.',
        timestamp: t2,
      ),
    ];
  }
}
