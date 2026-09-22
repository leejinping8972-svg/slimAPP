import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../shared/models/models.dart';
import 'sunny_avatar.dart';

export 'sunny_avatar.dart';

class LdScaffold extends StatelessWidget {
  const LdScaffold({
    super.key,
    required this.body,
    this.title,
    this.actions,
    this.bottomNavigationBar,
    this.floatingActionButton,
    this.showBack = false,
    this.onBack,
  });

  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? bottomNavigationBar;
  final Widget? floatingActionButton;
  final bool showBack;
  final VoidCallback? onBack;

  @override
  Widget build(BuildContext context) {
    final hasAppBar =
        title != null || showBack || (actions != null && actions!.isNotEmpty);
    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      appBar: hasAppBar
          ? AppBar(
              centerTitle: true,
              title: title != null ? Text(title!) : const SizedBox.shrink(),
              actions: actions,
              automaticallyImplyLeading: false,
              leading: showBack
                  ? IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                      onPressed:
                          onBack ??
                          () {
                            if (context.canPop()) {
                              context.pop();
                            } else {
                              context.go('/ritual');
                            }
                          },
                    )
                  : null,
            )
          : null,
      body: SafeArea(child: body),
      bottomNavigationBar: bottomNavigationBar,
      floatingActionButton: floatingActionButton,
    );
  }
}

class LdCard extends StatelessWidget {
  const LdCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(LuckdateSpacing.base),
    this.completed = false,
    this.onTap,
    this.accentColor,
  });

  final Widget child;
  final EdgeInsets padding;
  final bool completed;
  final VoidCallback? onTap;
  final Color? accentColor;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: completed ? LuckdateColors.sageSoft : LuckdateColors.ivoryWhite,
      elevation: 0,
      borderRadius: BorderRadius.circular(LuckdateRadius.xl),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(LuckdateRadius.xl),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(LuckdateRadius.xl),
            border: Border.all(
              color: completed
                  ? LuckdateColors.vitalitySage
                  : LuckdateColors.lineSoft,
              width: completed ? 1 : 0.5,
            ),
            boxShadow: LuckdateShadows.card,
          ),
          child: accentColor == null
              ? child
              : IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Container(
                        width: 4,
                        decoration: BoxDecoration(
                          color: accentColor,
                          borderRadius: const BorderRadius.horizontal(
                            left: Radius.circular(LuckdateRadius.xl),
                          ),
                        ),
                      ),
                      Expanded(child: child),
                    ],
                  ),
                ),
        ),
      ),
    );
  }
}

class LdPrimaryButton extends StatelessWidget {
  const LdPrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.loading = false,
    this.expanded = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool loading;
  final bool expanded;

  @override
  Widget build(BuildContext context) {
    final btn = ElevatedButton(
      onPressed: loading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: LuckdateColors.deepSage,
        foregroundColor: LuckdateColors.ivoryWhite,
        minimumSize: const Size(0, 52),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LuckdateRadius.control),
        ),
        elevation: 0,
      ),
      child: loading
          ? const SizedBox(
              width: 22,
              height: 22,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: LuckdateColors.ivoryWhite,
              ),
            )
          : Text(
              label,
              style: LuckdateTextStyles.body.copyWith(
                fontWeight: FontWeight.w600,
                color: LuckdateColors.ivoryWhite,
              ),
            ),
    );
    return expanded ? SizedBox(width: double.infinity, child: btn) : btn;
  }
}

class LdSecondaryButton extends StatelessWidget {
  const LdSecondaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.selected = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: selected
              ? LuckdateColors.sageSoft
              : LuckdateColors.ivoryWhite,
          foregroundColor: LuckdateColors.chocolateBrown,
          side: BorderSide(
            color: selected ? LuckdateColors.deepSage : LuckdateColors.lineSoft,
            width: selected ? 1.25 : 0.75,
          ),
          minimumSize: const Size(0, 52),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(LuckdateRadius.control),
          ),
        ),
        child: Text(
          label,
          style: LuckdateTextStyles.body.copyWith(fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}

/// Shared panel for in-app purchase users waiting to confirm delivery.
class LdAwaitingReceiptPanel extends StatelessWidget {
  const LdAwaitingReceiptPanel({
    super.key,
    required this.productName,
    required this.onConfirmReceipt,
    this.onViewOverview,
    this.compact = false,
  });

  final String productName;
  final VoidCallback onConfirmReceipt;
  final VoidCallback? onViewOverview;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final label = productName.isEmpty ? 'Solar Protein™' : productName;

    return LdCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const Icon(
                Icons.inventory_2_outlined,
                color: LuckdateColors.deepSage,
              ),
              const SizedBox(width: LuckdateSpacing.sm),
              Expanded(
                child: Text(
                  compact ? 'Esperando recepción' : 'Esperando entrega',
                  style: LuckdateTextStyles.title,
                ),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          Text(
            compact
                ? 'Confirma cuando llegue $label para desbloquear el día 1.'
                : 'Compraste $label. Tu plan de 28 días seguirá en pausa hasta que confirmes la entrega; entonces comenzará el día 1.',
            style: LuckdateTextStyles.bodySmall,
          ),
          const SizedBox(height: LuckdateSpacing.lg),
          LdPrimaryButton(
            label: 'Confirmar recepción e iniciar plan',
            onPressed: onConfirmReceipt,
          ),
          if (onViewOverview != null) ...[
            const SizedBox(height: LuckdateSpacing.sm),
            SizedBox(
              width: double.infinity,
              child: LdSecondaryButton(
                label: 'Ver resumen del plan',
                onPressed: onViewOverview,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class LdProfileAvatar extends StatelessWidget {
  const LdProfileAvatar({
    super.key,
    required this.nickname,
    this.radius = 20,
    this.onTap,
  });

  final String nickname;
  final double radius;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final avatar = CircleAvatar(
      radius: radius,
      backgroundColor: LuckdateColors.solarSand.withValues(alpha: 0.45),
      child: Text(
        nickname.isNotEmpty ? nickname[0].toUpperCase() : 'L',
        style: (radius >= 28 ? LuckdateTextStyles.h2 : LuckdateTextStyles.title)
            .copyWith(fontSize: radius >= 28 ? null : radius * 0.85),
      ),
    );
    if (onTap == null) return avatar;
    return GestureDetector(onTap: onTap, child: avatar);
  }
}

class LdSheetHandle extends StatelessWidget {
  const LdSheetHandle({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 40,
        height: 4,
        margin: const EdgeInsets.only(bottom: LuckdateSpacing.md),
        decoration: BoxDecoration(
          color: LuckdateColors.lineSoft,
          borderRadius: BorderRadius.circular(LuckdateRadius.pill),
        ),
      ),
    );
  }
}

class LdBottomSheetBody extends StatelessWidget {
  const LdBottomSheetBody({super.key, required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;
    return Padding(
      padding: EdgeInsets.fromLTRB(
        LuckdateSpacing.lg,
        LuckdateSpacing.sm,
        LuckdateSpacing.lg,
        LuckdateSpacing.lg + bottomInset,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [const LdSheetHandle(), ...children],
      ),
    );
  }
}

class LdChoiceChip extends StatelessWidget {
  const LdChoiceChip({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
    this.color,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(LuckdateRadius.control),
        child: Ink(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: selected
                ? LuckdateColors.deepSage
                : LuckdateColors.ivoryWhite,
            borderRadius: BorderRadius.circular(LuckdateRadius.control),
            border: Border.all(
              color: selected
                  ? LuckdateColors.deepSage
                  : LuckdateColors.lineSoft,
              width: 0.75,
            ),
          ),
          child: Text(
            label,
            style: LuckdateTextStyles.bodySmall.copyWith(
              color: selected
                  ? LuckdateColors.ivoryWhite
                  : LuckdateColors.textSecondary,
              fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
        ),
      ),
    );
  }
}

class SunnyBubble extends StatelessWidget {
  const SunnyBubble({
    super.key,
    required this.text,
    this.isStreaming = false,
    this.timestamp,
    this.suggestions,
    this.actionLabels,
    this.onActionTap,
    this.card,
    this.cardStatus = ChatCardStatus.pending,
    this.onCardConfirm,
    this.mood,
  });

  final String text;
  final bool isStreaming;
  final DateTime? timestamp;
  final List<ChatSuggestionItem>? suggestions;
  final List<String>? actionLabels;
  final ValueChanged<String>? onActionTap;
  final CheckInCardData? card;
  final ChatCardStatus cardStatus;
  final ValueChanged<CheckInCardData>? onCardConfirm;
  final SunnyMood? mood;

  String _formatTime(DateTime? t) {
    final d = t ?? DateTime.now();
    final h = d.hour.toString().padLeft(2, '0');
    final m = d.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  @override
  Widget build(BuildContext context) {
    final avatarMood =
        mood ?? SunnyMoodX.fromMessage(text, streaming: isStreaming);
    if (card != null) {
      return Align(
        alignment: Alignment.centerLeft,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 360),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CheckInCardBubble(
                key: ValueKey(card),
                data: card!,
                status: cardStatus,
                onConfirm: onCardConfirm,
                intro: text,
              ),
              const SizedBox(height: 6),
              Text(_formatTime(timestamp), style: LuckdateTextStyles.caption),
            ],
          ),
        ),
      );
    }
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        LdSunnyAvatar(size: 32, mood: avatarMood, cycleIdle: false),
        const SizedBox(width: LuckdateSpacing.sm),
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 4, bottom: 4),
                child: Text(
                  'Sunny ${_formatTime(timestamp)}',
                  style: LuckdateTextStyles.caption.copyWith(fontSize: 11),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(LuckdateSpacing.base),
                decoration: BoxDecoration(
                  color: LuckdateColors.ivoryWhite,
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(LuckdateRadius.lg),
                    bottomLeft: Radius.circular(LuckdateRadius.lg),
                    bottomRight: Radius.circular(LuckdateRadius.lg),
                  ),
                  border: Border.all(
                    color: LuckdateColors.lineSoft,
                    width: 0.5,
                  ),
                ),
                child: isStreaming && text.isEmpty
                    ? Text(
                        '●  ●  ●',
                        style: LuckdateTextStyles.body.copyWith(
                          color: LuckdateColors.textSecondary,
                          letterSpacing: 2,
                        ),
                      )
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(text, style: LuckdateTextStyles.body),
                          if (suggestions != null &&
                              suggestions!.isNotEmpty) ...[
                            const SizedBox(height: LuckdateSpacing.md),
                            _SuggestionPanel(items: suggestions!),
                          ],
                          if (actionLabels != null &&
                              actionLabels!.isNotEmpty) ...[
                            const SizedBox(height: LuckdateSpacing.md),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                for (
                                  var i = 0;
                                  i < actionLabels!.length;
                                  i++
                                ) ...[
                                  if (i > 0)
                                    const SizedBox(height: LuckdateSpacing.sm),
                                  SizedBox(
                                    width: double.infinity,
                                    height: 48,
                                    child: OutlinedButton(
                                      onPressed: onActionTap == null
                                          ? null
                                          : () =>
                                                onActionTap!(actionLabels![i]),
                                      style: OutlinedButton.styleFrom(
                                        foregroundColor:
                                            LuckdateColors.chocolateBrown,
                                        backgroundColor:
                                            LuckdateColors.cloudIvory,
                                        side: const BorderSide(
                                          color: LuckdateColors.lineSoft,
                                        ),
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 16,
                                          vertical: 12,
                                        ),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            LuckdateRadius.control,
                                          ),
                                        ),
                                      ),
                                      child: Text(
                                        actionLabels![i],
                                        textAlign: TextAlign.center,
                                        style: LuckdateTextStyles.body.copyWith(
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ],
                          if (card != null) ...[
                            const SizedBox(height: LuckdateSpacing.md),
                            CheckInCardBubble(
                              data: card!,
                              status: cardStatus,
                              onConfirm: onCardConfirm,
                            ),
                          ],
                        ],
                      ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class CheckInCardBubble extends StatefulWidget {
  const CheckInCardBubble({
    super.key,
    required this.data,
    required this.status,
    this.onConfirm,
    this.intro,
  });

  final CheckInCardData data;
  final ChatCardStatus status;
  final ValueChanged<CheckInCardData>? onConfirm;
  final String? intro;

  @override
  State<CheckInCardBubble> createState() => _CheckInCardBubbleState();
}

class _CheckInCardBubbleState extends State<CheckInCardBubble> {
  late final TextEditingController _valueController;
  String? _selectedRecordId;

  int get _editedValue => int.tryParse(_valueController.text.trim()) ?? 0;

  int get _estimatedKcal {
    final selected = widget.data.candidates
        .where((r) => r.id == _selectedRecordId)
        .firstOrNull;
    if (selected?.estimatedKcal != null && selected!.value > 0) {
      return (selected.estimatedKcal! * _editedValue / selected.value).round();
    }
    return (_editedValue * (widget.data.type == CheckInType.meal ? 1.8 : 7.1))
        .round();
  }

  @override
  void initState() {
    super.initState();
    _valueController = TextEditingController(
      text: widget.data.value.toString(),
    );
    _valueController.addListener(_onValueChanged);
    _selectedRecordId = widget.status == ChatCardStatus.confirmed
        ? widget.data.selectedRecordId
        : null;
  }

  @override
  void dispose() {
    _valueController.removeListener(_onValueChanged);
    _valueController.dispose();
    super.dispose();
  }

  void _onValueChanged() => setState(() {});

  String get _title =>
      widget.data.kind == ChatCardKind.confirmCheckIn ? '确认打卡' : '修改打卡记录';

  String get _actionLabel =>
      widget.data.kind == ChatCardKind.confirmCheckIn ? '确认打卡' : '确认修改';

  void _confirm() {
    final value = int.tryParse(_valueController.text.trim());
    final maxValue = widget.data.type == CheckInType.meal ? 3000 : 600;
    if (value == null || value <= 0 || value > maxValue) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('请输入 1–$maxValue ${widget.data.type.unit}')),
      );
      return;
    }
    widget.onConfirm?.call(
      widget.data.copyWith(value: value, selectedRecordId: _selectedRecordId),
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = widget.data;
    final isConfirmed = widget.status == ChatCardStatus.confirmed;
    final isModification = data.kind == ChatCardKind.modifyCheckIn;
    final selected = data.candidates
        .where((r) => r.id == _selectedRecordId)
        .firstOrNull;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.base),
      decoration: BoxDecoration(
        color: LuckdateColors.ivoryWhite,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: LuckdateColors.lineSoft),
      ),
      child: isConfirmed
          ? Row(
              children: [
                const Icon(
                  Icons.check_circle_rounded,
                  color: LuckdateColors.success,
                  size: 22,
                ),
                const SizedBox(width: LuckdateSpacing.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isModification ? '记录已修改' : '打卡已确认',
                        style: LuckdateTextStyles.body.copyWith(
                          color: LuckdateColors.deepSage,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${selected?.name ?? data.name} · ${data.value} ${data.type.unit}',
                        style: LuckdateTextStyles.bodySmall,
                      ),
                      Text(
                        '今天 ${selected?.time ?? data.time}',
                        style: LuckdateTextStyles.caption,
                      ),
                    ],
                  ),
                ),
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (widget.intro?.isNotEmpty ?? false) ...[
                  Text(widget.intro!, style: LuckdateTextStyles.body),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 14),
                    child: Divider(height: 1),
                  ),
                ],
                Row(
                  children: [
                    Icon(
                      data.kind == ChatCardKind.confirmCheckIn
                          ? Icons.fact_check_outlined
                          : Icons.edit_note_rounded,
                      color: LuckdateColors.deepSage,
                      size: 20,
                    ),
                    const SizedBox(width: LuckdateSpacing.sm),
                    Expanded(
                      child: Text(
                        _title,
                        style: LuckdateTextStyles.title.copyWith(fontSize: 15),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 9,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: LuckdateColors.sageSoft,
                        borderRadius: BorderRadius.circular(
                          LuckdateRadius.pill,
                        ),
                      ),
                      child: Text(
                        data.type.label,
                        style: LuckdateTextStyles.caption.copyWith(
                          color: LuckdateColors.deepSage,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: LuckdateSpacing.md),
                if (!isModification)
                  Text(data.name, style: LuckdateTextStyles.title),
                const SizedBox(height: LuckdateSpacing.xs),
                Row(
                  children: [
                    const Icon(
                      Icons.schedule_rounded,
                      size: 15,
                      color: LuckdateColors.textSecondary,
                    ),
                    const SizedBox(width: 4),
                    Flexible(
                      child: Text(
                        '今天 ${data.time}',
                        style: LuckdateTextStyles.bodySmall,
                      ),
                    ),
                  ],
                ),
                if (isModification && data.candidates.isNotEmpty) ...[
                  const SizedBox(height: LuckdateSpacing.md),
                  Text(
                    '找到 ${data.candidates.length} 条可能记录，请选择要修改的记录',
                    style: LuckdateTextStyles.caption,
                  ),
                  const SizedBox(height: LuckdateSpacing.xs),
                  ...data.candidates.map(
                    (candidate) => Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: InkWell(
                        onTap: () =>
                            setState(() => _selectedRecordId = candidate.id),
                        borderRadius: BorderRadius.circular(LuckdateRadius.md),
                        child: Ink(
                          padding: const EdgeInsets.symmetric(
                            horizontal: LuckdateSpacing.sm,
                            vertical: LuckdateSpacing.md,
                          ),
                          decoration: BoxDecoration(
                            color: _selectedRecordId == candidate.id
                                ? LuckdateColors.sageSoft
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(
                              LuckdateRadius.md,
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                _selectedRecordId == candidate.id
                                    ? Icons.radio_button_checked_rounded
                                    : Icons.radio_button_unchecked_rounded,
                                color: LuckdateColors.deepSage,
                                size: 18,
                              ),
                              const SizedBox(width: LuckdateSpacing.sm),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      candidate.name,
                                      style: LuckdateTextStyles.bodySmall,
                                    ),
                                    Text(
                                      candidate.time,
                                      style: LuckdateTextStyles.caption,
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                '${candidate.value} ${data.type.unit}',
                                style: LuckdateTextStyles.caption,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: LuckdateSpacing.md),
                _CheckInAnalysis(
                  type: data.type,
                  value: _editedValue,
                  kcal: _estimatedKcal,
                  originalValue: selected?.value,
                ),
                const SizedBox(height: LuckdateSpacing.md),
                Text(
                  !isModification
                      ? '确认前可以调整${data.type == CheckInType.meal ? '份量' : '时长'}'
                      : selected == null
                      ? '修改后的数值'
                      : '原记录 ${selected.value} ${data.type.unit} → 修改为',
                  style: LuckdateTextStyles.caption,
                ),
                const SizedBox(height: LuckdateSpacing.xs),
                TextField(
                  controller: _valueController,
                  keyboardType: TextInputType.number,
                  enabled: widget.onConfirm != null,
                  decoration: InputDecoration(
                    suffixText: data.type.unit,
                    suffixStyle: LuckdateTextStyles.body.copyWith(
                      color: LuckdateColors.textSecondary,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: LuckdateSpacing.md,
                      vertical: LuckdateSpacing.sm,
                    ),
                  ),
                  style: LuckdateTextStyles.h2,
                ),
                const SizedBox(height: LuckdateSpacing.md),
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton(
                    onPressed:
                        widget.onConfirm == null ||
                            (isModification && selected == null)
                        ? null
                        : _confirm,
                    child: Text(_actionLabel),
                  ),
                ),
              ],
            ),
    );
  }
}

class _CheckInAnalysis extends StatelessWidget {
  const _CheckInAnalysis({
    required this.type,
    required this.value,
    required this.kcal,
    this.originalValue,
  });

  final CheckInType type;
  final int value;
  final int kcal;
  final int? originalValue;

  @override
  Widget build(BuildContext context) {
    final isMeal = type == CheckInType.meal;
    final ratio = originalValue == null || originalValue == 0
        ? null
        : ((value - originalValue!) / originalValue! * 100).round();
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: isMeal ? const Color(0xFFF0FAF2) : const Color(0xFFF1F6FB),
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isMeal ? '食物热量分析' : '运动消耗分析',
            style: LuckdateTextStyles.bodySmall.copyWith(
              fontWeight: FontWeight.w700,
              color: LuckdateColors.textPrimary,
            ),
          ),
          const SizedBox(height: LuckdateSpacing.xs),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '$kcal',
                style: LuckdateTextStyles.h1.copyWith(
                  color: isMeal
                      ? LuckdateColors.success
                      : LuckdateColors.mossDark,
                ),
              ),
              const SizedBox(width: 4),
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(
                  isMeal ? 'kcal 估算摄入' : 'kcal 预计消耗',
                  style: LuckdateTextStyles.caption,
                ),
              ),
            ],
          ),
          Text(
            ratio == null
                ? '根据${isMeal ? '份量' : '运动时长'}实时估算，确认前可修改数值。'
                : '相较原记录 ${ratio >= 0 ? '+' : ''}$ratio%，热量按比例同步计算。',
            style: LuckdateTextStyles.caption,
          ),
        ],
      ),
    );
  }
}

class _SuggestionPanel extends StatelessWidget {
  const _SuggestionPanel({required this.items});

  final List<ChatSuggestionItem> items;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: LuckdateColors.cloudIvory,
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
        border: Border.all(
          color: LuckdateColors.lineSoft.withValues(alpha: 0.7),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '🌱 Mis sugerencias',
            style: LuckdateTextStyles.title.copyWith(fontSize: 14),
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          ...items.map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: LuckdateSpacing.sm),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.emoji, style: const TextStyle(fontSize: 18)),
                  const SizedBox(width: LuckdateSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.title,
                          style: LuckdateTextStyles.bodySmall.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(item.subtitle, style: LuckdateTextStyles.caption),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class UserBubble extends StatelessWidget {
  const UserBubble({
    super.key,
    required this.text,
    this.timestamp,
    this.nickname = 'Yo',
  });

  final String text;
  final DateTime? timestamp;
  final String nickname;

  String _formatTime(DateTime? t) {
    final d = t ?? DateTime.now();
    final h = d.hour.toString().padLeft(2, '0');
    final m = d.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 4, bottom: 4),
                child: Text(
                  'Yo ${_formatTime(timestamp)}',
                  style: LuckdateTextStyles.caption.copyWith(fontSize: 11),
                ),
              ),
              Container(
                constraints: BoxConstraints(
                  maxWidth: MediaQuery.sizeOf(context).width * 0.72,
                ),
                padding: const EdgeInsets.all(LuckdateSpacing.base),
                decoration: BoxDecoration(
                  color: LuckdateColors.deepSage,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(LuckdateRadius.lg),
                    bottomLeft: Radius.circular(LuckdateRadius.lg),
                    bottomRight: Radius.circular(LuckdateRadius.lg),
                  ),
                ),
                child: Text(
                  text,
                  style: LuckdateTextStyles.body.copyWith(
                    color: LuckdateColors.ivoryWhite,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: LuckdateSpacing.sm),
        LdProfileAvatar(nickname: nickname, radius: 16),
      ],
    );
  }
}

class LdProgressRing extends StatelessWidget {
  const LdProgressRing({
    super.key,
    required this.percent,
    required this.centerLabel,
    required this.subLabel,
    this.size = 180,
    this.showSunIcon = true,
    this.ringColor = LuckdateColors.sunGold,
  });

  final double percent;
  final String centerLabel;
  final String subLabel;
  final double size;
  final bool showSunIcon;
  final Color ringColor;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          SizedBox(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              value: percent / 100,
              strokeWidth: 10,
              backgroundColor: LuckdateColors.lineSoft,
              color: ringColor,
              strokeCap: StrokeCap.round,
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (showSunIcon) ...[
                Icon(
                  Icons.wb_sunny_rounded,
                  color: LuckdateColors.sunGold,
                  size: 28,
                ),
                const SizedBox(height: 4),
              ],
              Text(centerLabel, style: LuckdateTextStyles.h2),
              Text(subLabel, style: LuckdateTextStyles.caption),
            ],
          ),
        ],
      ),
    );
  }
}

class VitalityMetricCard extends StatelessWidget {
  const VitalityMetricCard({
    super.key,
    required this.label,
    required this.value,
    required this.subtitle,
  });

  final String label;
  final String value;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: LuckdateTextStyles.caption),
          const SizedBox(height: 4),
          Text(value, style: LuckdateTextStyles.h2.copyWith(fontSize: 28)),
          Text(subtitle, style: LuckdateTextStyles.caption),
        ],
      ),
    );
  }
}

class RitualCard extends StatelessWidget {
  const RitualCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.completed,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final bool completed;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      completed: completed,
      onTap: onTap,
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: completed
                  ? LuckdateColors.deepSage.withValues(alpha: 0.15)
                  : LuckdateColors.cloudIvory,
              borderRadius: BorderRadius.circular(LuckdateRadius.md),
            ),
            child: Icon(icon, color: LuckdateColors.deepSage),
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: LuckdateTextStyles.title),
                Text(subtitle, style: LuckdateTextStyles.bodySmall),
              ],
            ),
          ),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 220),
            child: Icon(
              completed ? Icons.check_circle_rounded : Icons.circle_outlined,
              key: ValueKey(completed),
              color: completed
                  ? LuckdateColors.deepSage
                  : LuckdateColors.lineSoft,
            ),
          ),
        ],
      ),
    );
  }
}

class ProductCard extends StatelessWidget {
  const ProductCard({super.key, required this.product, required this.onTap});

  final Product product;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = Color(int.parse(product.colorHex.replaceFirst('#', '0xFF')));
    return LdCard(
      onTap: onTap,
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 110,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(LuckdateRadius.xl),
              ),
            ),
            child: Center(
              child: Icon(Icons.spa_outlined, size: 44, color: color),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(LuckdateSpacing.sm),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (product.isNew)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      margin: const EdgeInsets.only(bottom: 4),
                      decoration: BoxDecoration(
                        color: LuckdateColors.sunGold.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(LuckdateRadius.sm),
                      ),
                      child: const Text(
                        'NEW',
                        style: LuckdateTextStyles.caption,
                      ),
                    ),
                  Text(
                    product.name,
                    style: LuckdateTextStyles.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Expanded(
                    child: Text(
                      product.shortDescription,
                      style: LuckdateTextStyles.bodySmall,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Text(
                    product.priceDisplay,
                    style: LuckdateTextStyles.body.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class BadgeCard extends StatelessWidget {
  const BadgeCard({
    super.key,
    required this.title,
    required this.description,
    required this.unlocked,
    required this.day,
  });

  final String title;
  final String description;
  final bool unlocked;
  final int day;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      completed: unlocked,
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: unlocked
                  ? LuckdateColors.sunGold.withValues(alpha: 0.3)
                  : LuckdateColors.lineSoft,
              shape: BoxShape.circle,
            ),
            child: Icon(
              unlocked ? Icons.star_rounded : Icons.star_border_rounded,
              color: unlocked
                  ? LuckdateColors.sunGold
                  : LuckdateColors.textSecondary,
            ),
          ),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Día $day', style: LuckdateTextStyles.caption),
                Text(title, style: LuckdateTextStyles.title),
                Text(description, style: LuckdateTextStyles.bodySmall),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class StatePlaceholder extends StatelessWidget {
  const StatePlaceholder({
    super.key,
    required this.type,
    this.onRetry,
    this.title,
    this.message,
  });

  final String type;
  final VoidCallback? onRetry;
  final String? title;
  final String? message;

  @override
  Widget build(BuildContext context) {
    final (icon, defaultTitle, defaultMessage) = switch (type) {
      'loading' => (
        Icons.hourglass_top_rounded,
        'Cargando',
        'Preparando tu recorrido...',
      ),
      'empty' => (
        Icons.inbox_outlined,
        'Aún no hay nada aquí',
        'Tus registros aparecerán conforme avances.',
      ),
      'error' => (
        Icons.cloud_off_outlined,
        'Algo dejó de responder',
        'Hubo una pausa; toca para intentarlo de nuevo.',
      ),
      'network' => (
        Icons.wifi_off_rounded,
        'Conexión débil',
        'Guardamos tu último estado. Inténtalo de nuevo cuando estés lista.',
      ),
      _ => (Icons.info_outline, 'Aviso', ''),
    };
    final displayTitle = title ?? defaultTitle;
    final displayMessage = message ?? defaultMessage;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (type == 'loading')
              const SizedBox(
                width: 40,
                height: 40,
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  color: LuckdateColors.deepSage,
                ),
              )
            else
              Icon(icon, size: 48, color: LuckdateColors.vitalitySage),
            const SizedBox(height: LuckdateSpacing.base),
            Text(displayTitle, style: LuckdateTextStyles.title),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              displayMessage,
              style: LuckdateTextStyles.bodySmall,
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: LuckdateSpacing.base),
              LdPrimaryButton(
                label: 'Intentar de nuevo',
                onPressed: onRetry,
                expanded: false,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
