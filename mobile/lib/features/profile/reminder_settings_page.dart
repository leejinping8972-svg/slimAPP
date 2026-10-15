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
        'Te recordaremos en los horarios que elegiste usar tu reemplazo de comida y registrar tus alimentos, peso y cómo te sientes.',
      UserPlanType.nonMealReplacement =>
        'Te recordaremos a la hora que elegiste tomar tu producto y registrar cómo te sientes.',
      UserPlanType.noProduct =>
        'Te recordaremos a la hora que elegiste registrar tus alimentos, peso y estado diario.',
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
    ref
        .read(appStateProvider.notifier)
        .updateReminders(
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
      title: 'Recordatorios',
      showBack: true,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(LuckdateSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_copyFor(planType), style: LuckdateTextStyles.bodySmall),
            const SizedBox(height: LuckdateSpacing.xl),
            _ReminderTimeCard(
              label: dualReminder
                  ? 'Recordatorio de la mañana'
                  : 'Recordatorio diario',
              time: _reminderTime,
              onTap: () => _pickTime(second: false),
            ),
            if (dualReminder) ...[
              const SizedBox(height: LuckdateSpacing.sm),
              _ReminderTimeCard(
                label: 'Recordatorio de la noche',
                time: _reminderTime2,
                onTap: () => _pickTime(second: true),
              ),
            ],
            const SizedBox(height: LuckdateSpacing.xl),
            LdPrimaryButton(label: 'Guardar recordatorios', onPressed: _save),
          ],
        ),
      ),
    );
  }
}

class _ReminderTimeCard extends StatelessWidget {
  const _ReminderTimeCard({
    required this.label,
    required this.time,
    required this.onTap,
  });

  final String label;
  final String time;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: '$label, $time. Toca para elegir otra hora.',
      child: LdCard(
        onTap: onTap,
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: LuckdateTextStyles.bodySmall),
                  const SizedBox(height: LuckdateSpacing.xs),
                  Text(time, style: LuckdateTextStyles.h1),
                ],
              ),
            ),
            const Icon(Icons.schedule_rounded, color: LuckdateColors.deepSage),
          ],
        ),
      ),
    );
  }
}
