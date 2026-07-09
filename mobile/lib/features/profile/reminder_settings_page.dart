import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

class ReminderSettingsPage extends ConsumerStatefulWidget {
  const ReminderSettingsPage({super.key});

  @override
  ConsumerState<ReminderSettingsPage> createState() =>
      _ReminderSettingsPageState();
}

class _ReminderSettingsPageState extends ConsumerState<ReminderSettingsPage> {
  late String _reminderTime;
  late String _reminderTime2;

  @override
  void initState() {
    super.initState();
    final profile = ref.read(appStateProvider).profile;
    _reminderTime = profile.reminderTime;
    _reminderTime2 = profile.reminderTime2;
  }

  String _copyFor(UserPlanType planType) {
    return switch (planType) {
      UserPlanType.mealReplacement =>
        'We will remind you at your chosen times to use your meal replacement and log your food, weight, and how you feel.',
      UserPlanType.nonMealReplacement =>
        'We will remind you at your chosen time to take your product and log how you feel.',
      UserPlanType.noProduct =>
        'We will remind you at your chosen time to log your food, weight, and daily state.',
    };
  }

  Future<void> _pickTime({required bool second}) async {
    final current = second ? _reminderTime2 : _reminderTime;
    final parts = current.split(':');
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay(
        hour: int.parse(parts[0]),
        minute: int.parse(parts[1]),
      ),
    );
    if (picked == null) return;
    final formatted =
        '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
    setState(() {
      if (second) {
        _reminderTime2 = formatted;
      } else {
        _reminderTime = formatted;
      }
    });
  }

  void _save() {
    ref.read(appStateProvider.notifier).updateReminders(
          reminderTime: _reminderTime,
          reminderTime2: _reminderTime2,
        );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final planType = ref.watch(appStateProvider).profile.userPlanType;
    final dualReminder = planType == UserPlanType.mealReplacement;

    return LdScaffold(
      title: 'Reminders',
      showBack: true,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_copyFor(planType), style: LuckdateTextStyles.bodySmall),
            const SizedBox(height: LuckdateSpacing.xl),
            LdCard(
              onTap: () => _pickTime(second: false),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    dualReminder ? 'Morning reminder' : 'Daily reminder',
                    style: LuckdateTextStyles.body,
                  ),
                  Text(_reminderTime, style: LuckdateTextStyles.title),
                ],
              ),
            ),
            if (dualReminder) ...[
              const SizedBox(height: LuckdateSpacing.sm),
              LdCard(
                onTap: () => _pickTime(second: true),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Evening reminder', style: LuckdateTextStyles.body),
                    Text(_reminderTime2, style: LuckdateTextStyles.title),
                  ],
                ),
              ),
            ],
            const SizedBox(height: LuckdateSpacing.xl),
            LdPrimaryButton(label: 'Save reminders', onPressed: _save),
          ],
        ),
      ),
    );
  }
}
