import 'package:flutter/material.dart';

import '../../app/theme/luckdate_theme.dart';
import '../../shared/models/check_in_chat.dart';
import '../../shared/l10n/app_strings.dart';

typedef CheckInConfirmCallback = void Function(CheckInDraft draft);
typedef CheckInPickCallback = void Function(CheckInDraft candidate);

/// Editable confirm card + multi-record pick list for Sunny chat bubbles.
class CheckInChatCard extends StatefulWidget {
  const CheckInChatCard({
    super.key,
    required this.payload,
    required this.strings,
    this.onConfirm,
    this.onCancel,
    this.onPick,
  });

  final ChatCardPayload payload;
  final AppStrings strings;
  final CheckInConfirmCallback? onConfirm;
  final VoidCallback? onCancel;
  final CheckInPickCallback? onPick;

  @override
  State<CheckInChatCard> createState() => _CheckInChatCardState();
}

class _CheckInChatCardState extends State<CheckInChatCard> {
  late CheckInType _type;
  late TextEditingController _valueCtrl;
  late TextEditingController _timeCtrl;
  late TextEditingController _extraCtrl;

  @override
  void initState() {
    super.initState();
    final d = widget.payload.draft;
    _type = d?.type ?? CheckInType.water;
    _valueCtrl = TextEditingController(text: d?.value ?? '');
    _timeCtrl = TextEditingController(text: d?.time ?? '');
    _extraCtrl = TextEditingController(
      text: d?.rawFields['kcal'] ?? d?.rawFields['quality'] ?? '',
    );
  }

  @override
  void dispose() {
    _valueCtrl.dispose();
    _timeCtrl.dispose();
    _extraCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = widget.strings;
    final status = widget.payload.status;
    final interactive = status == CheckInCardStatus.pending;

    if (widget.payload.kind == CheckInCardKind.checkInPick) {
      return _pickList(s, interactive);
    }
    return _confirmCard(s, interactive, status);
  }

  Widget _confirmCard(
    AppStrings s,
    bool interactive,
    CheckInCardStatus status,
  ) {
    final draft = widget.payload.draft;
    final title = draft?.mode == CheckInDraftMode.edit
        ? s.checkInCardEditTitle
        : s.checkInCardCreateTitle;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: LuckdateColors.cloudIvory,
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
        border: Border.all(color: LuckdateColors.lineSoft),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: LuckdateTextStyles.title.copyWith(fontSize: 14)),
          const SizedBox(height: LuckdateSpacing.sm),
          if (!interactive) ...[
            Text(
              status == CheckInCardStatus.cancelled
                  ? s.checkInCardCancelled
                  : s.checkInCardApplied,
              style: LuckdateTextStyles.caption,
            ),
            if (draft != null) ...[
              const SizedBox(height: 4),
              Text(draft.label.isNotEmpty ? draft.label : draft.value,
                  style: LuckdateTextStyles.bodySmall),
            ],
          ] else ...[
            Text(s.checkInFieldType, style: LuckdateTextStyles.caption),
            const SizedBox(height: 4),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: CheckInType.values.map((t) {
                final selected = t == _type;
                return ChoiceChip(
                  label: Text(_typeLabel(t, s)),
                  selected: selected,
                  onSelected: (_) => setState(() => _type = t),
                  selectedColor: LuckdateColors.deepSage.withValues(alpha: 0.25),
                  labelStyle: LuckdateTextStyles.caption.copyWith(
                    fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            TextField(
              controller: _valueCtrl,
              enabled: interactive,
              decoration: InputDecoration(
                labelText: s.checkInFieldValue,
                isDense: true,
              ),
            ),
            const SizedBox(height: LuckdateSpacing.sm),
            TextField(
              controller: _timeCtrl,
              enabled: interactive,
              decoration: InputDecoration(
                labelText: s.checkInFieldTime,
                hintText: 'HH:mm',
                isDense: true,
              ),
            ),
            if (_type == CheckInType.exercise ||
                _type == CheckInType.meal ||
                _type == CheckInType.sleep) ...[
              const SizedBox(height: LuckdateSpacing.sm),
              TextField(
                controller: _extraCtrl,
                enabled: interactive,
                decoration: InputDecoration(
                  labelText: _type == CheckInType.sleep
                      ? s.checkInFieldQuality
                      : s.checkInFieldExtra,
                  isDense: true,
                ),
              ),
            ],
            const SizedBox(height: LuckdateSpacing.md),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: widget.onCancel,
                    child: Text(s.checkInCancel),
                  ),
                ),
                const SizedBox(width: LuckdateSpacing.sm),
                Expanded(
                  child: FilledButton(
                    onPressed: () {
                      final base = draft ??
                          CheckInDraft(
                            type: _type,
                            value: _valueCtrl.text.trim(),
                          );
                      final raw = Map<String, String>.from(base.rawFields);
                      if (_type == CheckInType.sleep) {
                        raw['quality'] = _extraCtrl.text.trim().isEmpty
                            ? (raw['quality'] ?? 'okay')
                            : _extraCtrl.text.trim();
                      } else if (_type == CheckInType.exercise ||
                          _type == CheckInType.meal) {
                        if (_extraCtrl.text.trim().isNotEmpty) {
                          raw['kcal'] = _extraCtrl.text.trim();
                        }
                      }
                      raw['value'] = _valueCtrl.text.trim();
                      final next = base.copyWith(
                        type: _type,
                        value: _valueCtrl.text.trim(),
                        time: _timeCtrl.text.trim(),
                        label: _valueCtrl.text.trim().isEmpty
                            ? base.label
                            : '${_valueCtrl.text.trim()}${base.unit.isNotEmpty ? ' ${base.unit}' : ''}',
                        rawFields: raw,
                      );
                      widget.onConfirm?.call(next);
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: LuckdateColors.deepSage,
                    ),
                    child: Text(s.checkInConfirm),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _pickList(AppStrings s, bool interactive) {
    final items = widget.payload.candidates;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: LuckdateColors.cloudIvory,
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
        border: Border.all(color: LuckdateColors.lineSoft),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(s.checkInPickTitle, style: LuckdateTextStyles.title.copyWith(fontSize: 14)),
          const SizedBox(height: LuckdateSpacing.sm),
          if (!interactive)
            Text(s.checkInCardApplied, style: LuckdateTextStyles.caption)
          else
            for (final c in items) ...[
              Material(
                color: LuckdateColors.ivoryWhite,
                borderRadius: BorderRadius.circular(LuckdateRadius.sm),
                child: InkWell(
                  onTap: () => widget.onPick?.call(c),
                  borderRadius: BorderRadius.circular(LuckdateRadius.sm),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(LuckdateSpacing.md),
                    margin: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(LuckdateRadius.sm),
                      border: Border.all(color: LuckdateColors.lineSoft),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          c.label.isNotEmpty ? c.label : c.value,
                          style: LuckdateTextStyles.bodySmall.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if (c.time.isNotEmpty)
                          Text(c.time, style: LuckdateTextStyles.caption),
                      ],
                    ),
                  ),
                ),
              ),
            ],
        ],
      ),
    );
  }

  String _typeLabel(CheckInType t, AppStrings s) {
    return switch (t) {
      CheckInType.water => s.checkInTypeWater,
      CheckInType.sleep => s.checkInTypeSleep,
      CheckInType.meal => s.checkInTypeMeal,
      CheckInType.product => s.checkInTypeProduct,
      CheckInType.weight => s.checkInTypeWeight,
      CheckInType.exercise => s.checkInTypeExercise,
      CheckInType.mood => s.checkInTypeMood,
    };
  }
}
