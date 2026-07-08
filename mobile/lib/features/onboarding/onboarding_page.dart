import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/sunny_sunflower.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/bmi_helper.dart';

class OnboardingPage extends ConsumerStatefulWidget {
  const OnboardingPage({super.key});

  @override
  ConsumerState<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends ConsumerState<OnboardingPage> {
  int _step = 0;
  bool _privacyAccepted = false;
  String _ageRange = '35-50';
  final Set<String> _mealSlots = {'breakfast'};
  String _reminderTime = '08:00';
  String _reminderTime2 = '20:00';
  bool _pregnant = false;
  bool _chronicCondition = false;
  bool _eatingDisorder = false;
  bool _emotionalRisk = false;
  bool _noneOfAbove = false;
  double _currentWeight = 68;
  double _targetWeight = 62;
  double _height = 165;
  bool _targetWeightManual = false;

  List<String> _steps(UserPlanType planType) {
    switch (planType) {
      case UserPlanType.mealReplacement:
        return ['welcome', 'privacy', 'profile', 'risk', 'reminder', 'ready'];
      case UserPlanType.nonMealReplacement:
        return ['welcome', 'privacy', 'profile', 'risk', 'reminder', 'ready'];
      case UserPlanType.noProduct:
        return ['welcome', 'privacy', 'profile', 'meal', 'risk', 'reminder', 'ready'];
    }
  }

  bool get _showTargetWeight {
    final plan = ref.read(appStateProvider).profile.userPlanType;
    return plan != UserPlanType.nonMealReplacement;
  }

  @override
  void initState() {
    super.initState();
    _targetWeight = _computeRecommendedTarget();
  }

  double _computeRecommendedTarget() {
    return BmiHelper.recommendedTargetKg(
      ageRange: _ageRange,
      heightCm: _height,
      currentWeightKg: _currentWeight,
    );
  }

  double get _currentBmi => BmiHelper.bmi(_currentWeight, _height);

  RiskLevel _evaluateRisk() {
    if (_noneOfAbove) return RiskLevel.p2;
    if (_ageRange == 'Under 18' || _pregnant || _eatingDisorder || _emotionalRisk) {
      return RiskLevel.p0;
    }
    if (_chronicCondition || _ageRange == '65+') return RiskLevel.p1;
    return RiskLevel.p2;
  }

  void _back() {
    if (_step > 0) {
      setState(() => _step--);
      return;
    }
    ref.read(appStateProvider.notifier).clearLoginSession();
    context.go('/login');
  }

  void _next() {
    final steps = _steps(ref.read(appStateProvider).profile.userPlanType);
    if (_step < steps.length - 1) {
      setState(() => _step++);
    } else {
      final risk = _evaluateRisk();
      if (risk == RiskLevel.p0) {
        _showP0Dialog();
        return;
      }
      final profile = ref.read(appStateProvider).profile.copyWith(
            nickname: 'Freya',
            ageRange: _ageRange,
            heightCm: _height,
            currentWeightKg: _currentWeight,
            targetWeightKg: _targetWeight,
            mealSlot: _mealSlots.join(', '),
            reminderTime: _reminderTime,
            reminderTime2: _reminderTime2,
            riskLevel: risk,
            onboardingComplete: true,
            isLoggedIn: true,
          );
      ref.read(appStateProvider.notifier).completeOnboarding(profile);
      context.go('/today');
    }
  }

  void _showP0Dialog() {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Safety Notice'),
        content: const Text(
          'Based on your answers, a standard Slim Journey may not be right for you right now. Please consult a healthcare professional before starting any nutrition plan.',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Go back')),
        ],
      ),
    );
  }

  void _onAgeChanged(String age) {
    setState(() {
      _ageRange = age;
      if (!_targetWeightManual) _targetWeight = _computeRecommendedTarget();
    });
  }

  void _onHeightChanged(double value) {
    setState(() {
      _height = value;
      if (!_targetWeightManual) _targetWeight = _computeRecommendedTarget();
    });
  }

  void _onCurrentWeightChanged(double value) {
    setState(() {
      _currentWeight = value;
      if (_targetWeight > value) {
        _targetWeight = value;
      }
      if (!_targetWeightManual) {
        _targetWeight = _computeRecommendedTarget();
      }
    });
  }

  void _onTargetWeightChanged(double value) {
    setState(() {
      _targetWeight = value.clamp(40, _currentWeight);
      _targetWeightManual = true;
    });
  }

  void _resetTargetToRecommended() {
    setState(() {
      _targetWeightManual = false;
      _targetWeight = _computeRecommendedTarget();
    });
  }

  void _toggleMealSlot(String slot) {
    setState(() {
      if (slot == 'not sure') {
        _mealSlots
          ..clear()
          ..add('not sure');
        return;
      }
      _mealSlots.remove('not sure');
      if (_mealSlots.contains(slot)) {
        _mealSlots.remove(slot);
      } else {
        _mealSlots.add(slot);
      }
      if (_mealSlots.isEmpty) _mealSlots.add(slot);
    });
  }

  void _toggleNoneOfAbove() {
    setState(() {
      _noneOfAbove = !_noneOfAbove;
      if (_noneOfAbove) {
        _pregnant = false;
        _chronicCondition = false;
        _eatingDisorder = false;
        _emotionalRisk = false;
      }
    });
  }

  void _toggleRiskFlag(void Function(bool) setter, bool current) {
    setState(() {
      _noneOfAbove = false;
      setter(!current);
    });
  }

  @override
  Widget build(BuildContext context) {
    final planType = ref.watch(appStateProvider).profile.userPlanType;
    final steps = _steps(planType);
    return LdScaffold(
      body: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            IconButton(
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
              icon: const Icon(Icons.arrow_back_ios_new, size: 20, color: LuckdateColors.chocolateBrown),
              onPressed: _back,
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            LinearProgressIndicator(
              value: (_step + 1) / steps.length,
              backgroundColor: LuckdateColors.lineSoft,
              color: LuckdateColors.deepSage,
              borderRadius: BorderRadius.circular(LuckdateRadius.pill),
            ),
            const SizedBox(height: LuckdateSpacing.xl),
            Expanded(child: _buildStep(steps[_step], planType)),
            const SizedBox(height: LuckdateSpacing.base),
            LdPrimaryButton(
              label: _step == steps.length - 1 ? 'Start My Journey' : 'Continue',
              onPressed: _canContinue(steps[_step]) ? _next : null,
            ),
          ],
        ),
      ),
    );
  }

  bool _canContinue(String stepKey) {
    if (stepKey == 'privacy' && !_privacyAccepted) return false;
    if (stepKey == 'meal' && _mealSlots.isEmpty) return false;
    if (stepKey == 'risk' && !_riskStepComplete()) return false;
    return true;
  }

  bool _riskStepComplete() {
    return _noneOfAbove ||
        _pregnant ||
        _chronicCondition ||
        _eatingDisorder ||
        _emotionalRisk;
  }

  Widget _buildStep(String stepKey, UserPlanType planType) {
    switch (stepKey) {
      case 'welcome':
        return _welcomeStep(planType);
      case 'privacy':
        return _privacyStep(planType);
      case 'profile':
        return _profileStep();
      case 'meal':
        return _mealStep();
      case 'risk':
        return _riskStep();
      case 'reminder':
        return _reminderStep(planType);
      case 'ready':
        return _journeyReadyStep(planType);
      default:
        return const SizedBox();
    }
  }

  Widget _welcomeStep(UserPlanType planType) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: SunnySunflower(size: 160, showStem: true, useImage: true),
          ),
          const SizedBox(height: LuckdateSpacing.xl),
          Text('Hi, I am Sunny', style: LuckdateTextStyles.h1),
          const SizedBox(height: LuckdateSpacing.md),
          Text(
            planType == UserPlanType.mealReplacement
                ? 'I will walk with you through 28 days — not to push you, but to help you grow toward the light, one gentle step at a time.'
                : planType == UserPlanType.nonMealReplacement
                    ? 'I will remind you to use your product and help you track how you feel each day.'
                    : 'You can keep logging and chatting with me while we find the right plan for you.',
            style: LuckdateTextStyles.body,
          ),
        ],
      ),
    );
  }

  Widget _privacyStep(UserPlanType planType) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Your privacy matters', style: LuckdateTextStyles.h2),
        const SizedBox(height: LuckdateSpacing.md),
        Text(
          planType == UserPlanType.mealReplacement
              ? 'We use your profile, daily records, and product usage to personalize your 28-day plan. ChatViva Slim provides lifestyle companionship — not medical diagnosis.'
              : 'We use your profile and daily records to personalize reminders and support. ChatViva Slim provides lifestyle companionship — not medical diagnosis.',
          style: LuckdateTextStyles.bodySmall,
        ),
        const SizedBox(height: LuckdateSpacing.xl),
        LdCard(
          onTap: () => setState(() => _privacyAccepted = !_privacyAccepted),
          child: Row(
            children: [
              Icon(
                _privacyAccepted ? Icons.check_box : Icons.check_box_outline_blank,
                color: LuckdateColors.deepSage,
              ),
              const SizedBox(width: LuckdateSpacing.md),
              const Expanded(
                child: Text('I agree to the Privacy Policy, Terms, and Health Disclaimer'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _profileStep() {
    final recommended = _computeRecommendedTarget();
    final recommendedBmi = BmiHelper.bmi(recommended, _height);

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Tell me about you', style: LuckdateTextStyles.h2),
          const SizedBox(height: LuckdateSpacing.md),
          Text('Age range', style: LuckdateTextStyles.bodySmall),
          const SizedBox(height: LuckdateSpacing.sm),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: ['18-34', '35-50', '51-64', '65+', 'Under 18'].map((a) {
              return LdChoiceChip(
                label: a,
                selected: _ageRange == a,
                onTap: () => _onAgeChanged(a),
              );
            }).toList(),
          ),
          const SizedBox(height: LuckdateSpacing.lg),
          Text('Height (cm): ${_height.toStringAsFixed(0)}', style: LuckdateTextStyles.bodySmall),
          Slider(
            value: _height,
            min: 140,
            max: 200,
            divisions: 60,
            activeColor: LuckdateColors.deepSage,
            onChanged: _onHeightChanged,
          ),
          Text(
            'Current weight (kg): ${_currentWeight.toStringAsFixed(1)} · BMI ${_currentBmi.toStringAsFixed(1)}',
            style: LuckdateTextStyles.bodySmall,
          ),
          Slider(
            value: _currentWeight,
            min: 45,
            max: 120,
            divisions: 75,
            activeColor: LuckdateColors.deepSage,
            onChanged: _onCurrentWeightChanged,
          ),
          if (_showTargetWeight) ...[
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Target weight (kg): ${_targetWeight.toStringAsFixed(1)}',
                        style: LuckdateTextStyles.bodySmall,
                      ),
                      Text(
                        'Suggested ${_recommendedLabel(recommended, recommendedBmi)}',
                        style: LuckdateTextStyles.caption.copyWith(color: LuckdateColors.deepSage),
                      ),
                    ],
                  ),
                ),
                if (_targetWeightManual)
                  TextButton(
                    onPressed: _resetTargetToRecommended,
                    child: const Text('Reset'),
                  ),
              ],
            ),
            Slider(
              value: _targetWeight.clamp(40, _currentWeight),
              min: 40,
              max: _currentWeight,
              divisions: ((_currentWeight - 40) * 2).round().clamp(1, 160),
              activeColor: LuckdateColors.deepSage,
              onChanged: _onTargetWeightChanged,
            ),
          ],
        ],
      ),
    );
  }

  String _recommendedLabel(double weight, double bmi) {
    return '${weight.toStringAsFixed(1)} kg (BMI ${bmi.toStringAsFixed(1)})';
  }

  Widget _mealStep() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Your product rhythm', style: LuckdateTextStyles.h2),
          const SizedBox(height: LuckdateSpacing.md),
          Text(
            'One pack per day — which meal(s) would you like Solar Protein to replace?',
            style: LuckdateTextStyles.bodySmall,
          ),
          const SizedBox(height: LuckdateSpacing.lg),
          ...['breakfast', 'lunch', 'dinner', 'not sure'].map((slot) {
            final label = slot == 'not sure' ? 'Not sure' : slot[0].toUpperCase() + slot.substring(1);
            final selected = _mealSlots.contains(slot);
            return Padding(
              padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
              child: LdCard(
                onTap: () => _toggleMealSlot(slot),
                child: Row(
                  children: [
                    Icon(
                      selected ? Icons.check_box : Icons.check_box_outline_blank,
                      color: LuckdateColors.deepSage,
                    ),
                    const SizedBox(width: LuckdateSpacing.md),
                    Text(label, style: LuckdateTextStyles.body),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _riskStep() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('A few safety questions', style: LuckdateTextStyles.h2),
          const SizedBox(height: LuckdateSpacing.sm),
          Text(
            'Select all that apply, or choose "None of the above" if none fit.',
            style: LuckdateTextStyles.bodySmall,
          ),
          const SizedBox(height: LuckdateSpacing.lg),
          _riskTile(
            'Pregnant, planning pregnancy, or breastfeeding',
            _pregnant,
            (v) => _toggleRiskFlag((b) => _pregnant = b, _pregnant),
          ),
          _riskTile(
            'Diabetes, heart, kidney, or other chronic condition',
            _chronicCondition,
            (v) => _toggleRiskFlag((b) => _chronicCondition = b, _chronicCondition),
          ),
          _riskTile(
            'Extreme dieting, fasting, or purging recently',
            _eatingDisorder,
            (v) => _toggleRiskFlag((b) => _eatingDisorder = b, _eatingDisorder),
          ),
          _riskTile(
            'Strong distress about weight or food',
            _emotionalRisk,
            (v) => _toggleRiskFlag((b) => _emotionalRisk = b, _emotionalRisk),
            subtitle:
                'Feeling intense anxiety, obsession, or emotional pain about your weight or eating habits.',
          ),
          _riskTile(
            'None of the above',
            _noneOfAbove,
            (_) => _toggleNoneOfAbove(),
          ),
        ],
      ),
    );
  }

  Widget _riskTile(
    String label,
    bool value,
    ValueChanged<bool> onChanged, {
    String? subtitle,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
      child: LdCard(
        onTap: () => onChanged(!value),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Icon(
                value ? Icons.check_box : Icons.check_box_outline_blank,
                color: LuckdateColors.deepSage,
              ),
            ),
            const SizedBox(width: LuckdateSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: LuckdateTextStyles.bodySmall),
                  if (subtitle != null) ...[
                    const SizedBox(height: 4),
                    Text(subtitle, style: LuckdateTextStyles.caption),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickReminderTime({required bool second}) async {
    final parts = (second ? _reminderTime2 : _reminderTime).split(':');
    final initial = TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
    final picked = await showTimePicker(context: context, initialTime: initial);
    if (picked == null) return;
    final formatted = '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
    setState(() {
      if (second) {
        _reminderTime2 = formatted;
      } else {
        _reminderTime = formatted;
      }
    });
  }

  Widget _reminderStep(UserPlanType planType) {
    final copy = switch (planType) {
      UserPlanType.mealReplacement =>
        'We will remind you to use your meal replacement and log your daily rhythm.',
      UserPlanType.nonMealReplacement => 'We will remind you to take your product and log how you feel.',
      UserPlanType.noProduct => 'We will remind you to log your food, weight, and daily state.',
    };
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Daily reminder', style: LuckdateTextStyles.h2),
        const SizedBox(height: LuckdateSpacing.md),
        Text(copy, style: LuckdateTextStyles.bodySmall),
        const SizedBox(height: LuckdateSpacing.lg),
        LdCard(
          onTap: () => _pickReminderTime(second: false),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(planType == UserPlanType.mealReplacement ? 'Morning reminder' : 'Daily reminder',
                  style: LuckdateTextStyles.body),
              Text(_reminderTime, style: LuckdateTextStyles.title),
            ],
          ),
        ),
        if (planType == UserPlanType.mealReplacement) ...[
          const SizedBox(height: LuckdateSpacing.sm),
          LdCard(
            onTap: () => _pickReminderTime(second: true),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Evening reminder', style: LuckdateTextStyles.body),
                Text(_reminderTime2, style: LuckdateTextStyles.title),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _journeyReadyStep(UserPlanType planType) {
    final risk = _evaluateRisk();
    final linkedProduct = ref.read(appStateProvider).profile.linkedProductName;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const LdSunnyAvatar(size: 72),
        const SizedBox(height: LuckdateSpacing.xl),
        Text(planType == UserPlanType.noProduct ? 'You are all set' : 'Your journey is ready', style: LuckdateTextStyles.h1),
        const SizedBox(height: LuckdateSpacing.md),
        Text(
          planType == UserPlanType.mealReplacement
              ? 'Slim Journey · 28 Days'
              : planType == UserPlanType.nonMealReplacement
                  ? 'Product Reminder Plan'
                  : 'Basic tracking mode',
          style: LuckdateTextStyles.title,
        ),
        const SizedBox(height: LuckdateSpacing.sm),
        Text(
          planType == UserPlanType.mealReplacement
              ? (risk == RiskLevel.p1
                  ? 'We will keep your plan gentle and steady. Please confirm any health concerns with a professional.'
                  : 'Day 1 starts with one small step — not perfection.')
              : planType == UserPlanType.nonMealReplacement
                  ? 'We will remind you to use your product each day. You can still log weight and chat with Sunny.'
                  : 'You can log, chat, and explore products. Link an order anytime from Profile.',
          style: LuckdateTextStyles.body,
        ),
        const SizedBox(height: LuckdateSpacing.xl),
        LdCard(
          child: Column(
            children: [
              if (linkedProduct.isNotEmpty) _summaryRow('Product', linkedProduct),
              if (planType != UserPlanType.noProduct) _summaryRow('Meal slot', _mealSlots.join(', ')),
              if (_showTargetWeight) _summaryRow('Target weight', '${_targetWeight.toStringAsFixed(1)} kg'),
              _summaryRow('Reminder', planType == UserPlanType.mealReplacement ? '$_reminderTime · $_reminderTime2' : _reminderTime),
              if (planType == UserPlanType.mealReplacement) _summaryRow('Hydration goal', '2000 ml'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _summaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: LuckdateTextStyles.bodySmall),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: LuckdateTextStyles.body.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}
