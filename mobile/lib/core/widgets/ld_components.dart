import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../shared/models/models.dart';
import 'ld_feedback.dart';
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
  late final Map<String, TextEditingController> _candidateControllers;
  String? _selectedRecordId;
  bool _submitting = false;
  bool _playIntro = false;

  int get _editedValue => int.tryParse(_valueController.text.trim()) ?? 0;

  List<CheckInRecord> get _mealItems => widget.data.items;

  int _itemValue(CheckInRecord item) =>
      int.tryParse(_candidateControllers[item.id]?.text.trim() ?? '') ??
      item.value;

  int _itemKcal(CheckInRecord item) {
    final value = _itemValue(item);
    if (item.estimatedKcal != null && item.value > 0) {
      return (item.estimatedKcal! * value / item.value).round();
    }
    return (value * 1.8).round();
  }

  int get _analysisValue => _mealItems.isEmpty
      ? _editedValue
      : _mealItems.fold<int>(0, (total, item) => total + _itemValue(item));

  int get _analysisKcal => _mealItems.isEmpty
      ? _estimatedKcal
      : _mealItems.fold<int>(0, (total, item) => total + _itemKcal(item));

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
    final editableRecords = [...widget.data.candidates, ...widget.data.items];
    _candidateControllers = {
      for (final record in editableRecords)
        record.id: TextEditingController(text: record.value.toString()),
    };
    for (final controller in _candidateControllers.values) {
      controller.addListener(_onValueChanged);
    }
    _selectedRecordId = widget.status == ChatCardStatus.confirmed
        ? widget.data.selectedRecordId
        : null;
  }

  @override
  void dispose() {
    _valueController.removeListener(_onValueChanged);
    _valueController.dispose();
    for (final controller in _candidateControllers.values) {
      controller.removeListener(_onValueChanged);
      controller.dispose();
    }
    super.dispose();
  }

  void _onValueChanged() => setState(() {});

  @override
  void didUpdateWidget(CheckInCardBubble oldWidget) {
    super.didUpdateWidget(oldWidget);
    final confirmed = widget.status == ChatCardStatus.confirmed;
    final wasConfirmed = oldWidget.status == ChatCardStatus.confirmed;
    if (confirmed && !wasConfirmed) {
      _submitting = false;
      _playIntro = !MediaQuery.disableAnimationsOf(context);
    }
  }

  String get _title => widget.data.kind == ChatCardKind.confirmCheckIn
      ? 'Confirmar registro'
      : 'Modificar registro';

  String get _actionLabel => widget.data.kind == ChatCardKind.confirmCheckIn
      ? 'Registrar'
      : 'Confirmar cambio';

  String get _successLabel => widget.data.kind == ChatCardKind.confirmCheckIn
      ? 'Registrado'
      : 'Registro actualizado';

  void _confirm() {
    if (_submitting || widget.onConfirm == null) return;
    if (widget.data.items.isNotEmpty) {
      final maxValue = widget.data.type == CheckInType.meal ? 3000 : 600;
      final updatedItems = <CheckInRecord>[];
      for (final item in widget.data.items) {
        final value = _itemValue(item);
        if (value <= 0 || value > maxValue) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('请输入 1–$maxValue ${widget.data.type.unit}')),
          );
          return;
        }
        updatedItems.add(
          CheckInRecord(
            id: item.id,
            type: item.type,
            name: item.name,
            time: item.time,
            value: value,
            estimatedKcal: item.estimatedKcal,
          ),
        );
      }
      final totalValue = updatedItems.fold<int>(
        0,
        (total, item) => total + item.value,
      );
      _submit(widget.data.copyWith(value: totalValue, items: updatedItems));
      return;
    }

    final selected = widget.data.candidates
        .where((r) => r.id == _selectedRecordId)
        .firstOrNull;
    final value = selected == null
        ? int.tryParse(_valueController.text.trim())
        : int.tryParse(_candidateControllers[selected.id]!.text.trim());
    final maxValue = widget.data.type == CheckInType.meal ? 3000 : 600;
    if (value == null || value <= 0 || value > maxValue) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('请输入 1–$maxValue ${widget.data.type.unit}')),
      );
      return;
    }
    _submit(
      widget.data.copyWith(value: value, selectedRecordId: _selectedRecordId),
    );
  }

  void _submit(CheckInCardData card) {
    setState(() => _submitting = true);
    widget.onConfirm?.call(card);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (widget.status != ChatCardStatus.confirmed && _submitting) {
        setState(() => _submitting = false);
      }
    });
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
          ? Semantics(
              liveRegion: _playIntro,
              label: _successLabel,
              child: Row(
                children: [
                  LdSuccessBadge(animate: _playIntro),
                  const SizedBox(width: LuckdateSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _successLabel,
                          style: LuckdateTextStyles.body.copyWith(
                            color: LuckdateColors.deepSage,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          data.items.isNotEmpty
                              ? '${data.items.length} 项饮食 · ${data.value} ${data.type.unit}'
                              : '${selected?.name ?? data.name} · ${data.value} ${data.type.unit}',
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
              ),
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
                if (data.type == CheckInType.meal)
                  _FoodDetailList(
                    type: data.type,
                    name: data.name,
                    time: data.time,
                    valueController: isModification || _mealItems.isNotEmpty
                        ? null
                        : _valueController,
                    estimatedKcal: isModification || _mealItems.isNotEmpty
                        ? null
                        : _estimatedKcal,
                    candidates: isModification ? data.candidates : _mealItems,
                    candidateControllers: _candidateControllers,
                    selectedRecordId: _selectedRecordId,
                    selectable: isModification,
                    enabled: widget.onConfirm != null,
                    onSelect: (id) => setState(() => _selectedRecordId = id),
                  )
                else ...[
                  Row(
                    children: [
                      Expanded(
                        child: Text(data.name, style: LuckdateTextStyles.title),
                      ),
                      SizedBox(
                        width: 126,
                        child: TextField(
                          controller: _valueController,
                          keyboardType: TextInputType.number,
                          enabled: widget.onConfirm != null,
                          decoration: InputDecoration(
                            suffixText: data.type.unit,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: LuckdateSpacing.sm,
                              vertical: LuckdateSpacing.xs,
                            ),
                          ),
                          style: LuckdateTextStyles.body.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
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
                ],
                if (isModification &&
                    data.type == CheckInType.exercise &&
                    data.candidates.isNotEmpty) ...[
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
                              SizedBox(
                                width: 112,
                                child: TextField(
                                  controller:
                                      _candidateControllers[candidate.id],
                                  keyboardType: TextInputType.number,
                                  enabled: widget.onConfirm != null,
                                  onTap: () => setState(
                                    () => _selectedRecordId = candidate.id,
                                  ),
                                  decoration: InputDecoration(
                                    suffixText: data.type.unit,
                                    isDense: true,
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: LuckdateSpacing.sm,
                                      vertical: LuckdateSpacing.xs,
                                    ),
                                  ),
                                  style: LuckdateTextStyles.bodySmall.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
                if (!isModification) ...[
                  const SizedBox(height: LuckdateSpacing.md),
                  _CheckInAnalysis(
                    type: data.type,
                    value: _analysisValue,
                    kcal: _analysisKcal,
                    originalValue: selected?.value,
                  ),
                  if (data.type == CheckInType.meal) ...[
                    const SizedBox(height: LuckdateSpacing.md),
                    _NutritionEstimate(value: _analysisValue),
                    const SizedBox(height: LuckdateSpacing.md),
                    const _AiSuggestionPanel(),
                  ],
                ],
                const SizedBox(height: LuckdateSpacing.md),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed:
                        _submitting ||
                            widget.onConfirm == null ||
                            (isModification && selected == null)
                        ? null
                        : _confirm,
                    child: _submitting
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: LuckdateColors.ivoryWhite,
                            ),
                          )
                        : Text(_actionLabel),
                  ),
                ),
              ],
            ),
    );
  }
}

class _FoodDetailList extends StatelessWidget {
  const _FoodDetailList({
    required this.type,
    required this.name,
    required this.time,
    required this.valueController,
    required this.estimatedKcal,
    required this.candidates,
    required this.candidateControllers,
    required this.selectedRecordId,
    required this.selectable,
    required this.enabled,
    required this.onSelect,
  });

  final CheckInType type;
  final String name;
  final String time;
  final TextEditingController? valueController;
  final int? estimatedKcal;
  final List<CheckInRecord> candidates;
  final Map<String, TextEditingController> candidateControllers;
  final String? selectedRecordId;
  final bool selectable;
  final bool enabled;
  final ValueChanged<String> onSelect;

  int _valueFor(CheckInRecord record) =>
      int.tryParse(candidateControllers[record.id]?.text.trim() ?? '') ??
      record.value;

  int _kcalFor(CheckInRecord record) {
    final value = _valueFor(record);
    if (record.estimatedKcal != null && record.value > 0) {
      return (record.estimatedKcal! * value / record.value).round();
    }
    return (value * 1.8).round();
  }

  @override
  Widget build(BuildContext context) {
    if (!selectable) {
      final rows = candidates.isEmpty
          ? [
              _buildConfirmationRecord(
                name: name,
                time: time,
                controller: valueController,
              ),
            ]
          : [
              for (final record in candidates)
                _buildConfirmationRecord(
                  name: record.name,
                  time: record.time,
                  controller: candidateControllers[record.id],
                ),
            ];
      return Column(
        children: [
          for (var index = 0; index < rows.length; index++) ...[
            if (index > 0) const SizedBox(height: LuckdateSpacing.sm),
            rows[index],
          ],
        ],
      );
    }

    final isMultiple = candidates.isNotEmpty;
    final totalKcal = isMultiple
        ? candidates.fold<int>(0, (total, record) => total + _kcalFor(record))
        : estimatedKcal ?? 0;
    final count = isMultiple ? candidates.length : 1;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
        border: Border.all(color: LuckdateColors.lineSoft),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                '食材热量明细',
                style: LuckdateTextStyles.body.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
              const Spacer(),
              Text('共识别 $count 种食材', style: LuckdateTextStyles.caption),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.md),
          Row(
            children: [
              const Expanded(child: Text('食材')),
              SizedBox(
                width: isMultiple ? 116 : 126,
                child: const Text('估算重量'),
              ),
              const SizedBox(
                width: 76,
                child: Align(
                  alignment: Alignment.centerRight,
                  child: Text('热量'),
                ),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.xs),
          if (isMultiple)
            ...candidates.map((record) => _buildCandidateRow(record))
          else
            _buildSingleRow(),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: LuckdateSpacing.sm),
            child: Divider(height: 1),
          ),
          Row(
            children: [
              Text('合计', style: LuckdateTextStyles.bodySmall),
              const Spacer(),
              Text(
                '约 $totalKcal kcal',
                style: LuckdateTextStyles.bodySmall.copyWith(
                  color: LuckdateColors.deepSage,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmationRecord({
    required String name,
    required String time,
    required TextEditingController? controller,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: LuckdateColors.ivoryWhite,
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
        border: Border.all(color: LuckdateColors.lineSoft),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(name, style: LuckdateTextStyles.title)),
              SizedBox(
                width: 126,
                child: TextField(
                  controller: controller,
                  keyboardType: TextInputType.number,
                  enabled: enabled,
                  decoration: InputDecoration(
                    suffixText: type.unit,
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: LuckdateSpacing.sm,
                      vertical: LuckdateSpacing.xs,
                    ),
                  ),
                  style: LuckdateTextStyles.body.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.xs),
          Row(
            children: [
              const Icon(
                Icons.schedule_rounded,
                size: 15,
                color: LuckdateColors.textSecondary,
              ),
              const SizedBox(width: 4),
              Text('今天 $time', style: LuckdateTextStyles.bodySmall),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSingleRow() {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: LuckdateTextStyles.body),
              const SizedBox(height: 3),
              Row(
                children: [
                  const Icon(
                    Icons.schedule_rounded,
                    size: 13,
                    color: LuckdateColors.textSecondary,
                  ),
                  const SizedBox(width: 3),
                  Text('今天 $time', style: LuckdateTextStyles.caption),
                ],
              ),
            ],
          ),
        ),
        SizedBox(
          width: 126,
          child: TextField(
            controller: valueController,
            keyboardType: TextInputType.number,
            enabled: enabled,
            decoration: InputDecoration(
              suffixText: type.unit,
              isDense: true,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: LuckdateSpacing.sm,
                vertical: LuckdateSpacing.xs,
              ),
            ),
            style: LuckdateTextStyles.bodySmall.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        const SizedBox(width: LuckdateSpacing.xs),
        SizedBox(
          width: 72,
          child: Align(
            alignment: Alignment.centerRight,
            child: Text(
              '${estimatedKcal ?? 0} kcal',
              style: LuckdateTextStyles.caption,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCandidateRow(CheckInRecord record) {
    final selected = selectable && selectedRecordId == record.id;
    return Padding(
      padding: const EdgeInsets.only(top: 4),
      child: InkWell(
        onTap: selectable ? () => onSelect(record.id) : null,
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
        child: Ink(
          padding: const EdgeInsets.symmetric(
            horizontal: LuckdateSpacing.xs,
            vertical: LuckdateSpacing.sm,
          ),
          decoration: BoxDecoration(
            color: selected ? LuckdateColors.sageSoft : Colors.transparent,
            borderRadius: BorderRadius.circular(LuckdateRadius.md),
          ),
          child: Row(
            children: [
              if (selectable)
                Icon(
                  selected
                      ? Icons.radio_button_checked_rounded
                      : Icons.radio_button_unchecked_rounded,
                  color: LuckdateColors.deepSage,
                  size: 18,
                ),
              if (selectable) const SizedBox(width: LuckdateSpacing.xs),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(record.name, style: LuckdateTextStyles.bodySmall),
                    Text(record.time, style: LuckdateTextStyles.caption),
                  ],
                ),
              ),
              SizedBox(
                width: 112,
                child: TextField(
                  controller: candidateControllers[record.id],
                  keyboardType: TextInputType.number,
                  enabled: enabled,
                  onTap: selectable ? () => onSelect(record.id) : null,
                  decoration: InputDecoration(
                    suffixText: type.unit,
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: LuckdateSpacing.sm,
                      vertical: LuckdateSpacing.xs,
                    ),
                  ),
                  style: LuckdateTextStyles.bodySmall.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: LuckdateSpacing.xs),
              SizedBox(
                width: 72,
                child: Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    '${_kcalFor(record)} kcal',
                    style: LuckdateTextStyles.caption,
                  ),
                ),
              ),
            ],
          ),
        ),
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

class _NutritionEstimate extends StatelessWidget {
  const _NutritionEstimate({required this.value});

  final int value;

  @override
  Widget build(BuildContext context) {
    // Demo coefficients keep the estimate proportional as the portion changes.
    final protein = value.toDouble() * .06;
    final carbs = value.toDouble() * .28;
    final fat = value.toDouble() * .10;
    final total = protein * 4 + carbs * 4 + fat * 9;
    final proteinPct = total == 0 ? 0.0 : protein * 4 / total;
    final carbsPct = total == 0 ? 0.0 : carbs * 4 / total;
    final fatPct = total == 0 ? 0.0 : fat * 9 / total;
    Widget metric(String label, double grams, double pct, Color color) {
      return Expanded(
        child: Row(
          children: [
            Container(
              width: 7,
              height: 7,
              decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            ),
            const SizedBox(width: 5),
            Expanded(
              child: Text(
                '$label ${grams.toStringAsFixed(1)}g',
                style: LuckdateTextStyles.caption,
              ),
            ),
            Text('${(pct * 100).round()}%', style: LuckdateTextStyles.caption),
          ],
        ),
      );
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F9FC),
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                '营养素估算',
                style: LuckdateTextStyles.title.copyWith(fontSize: 15),
              ),
              const SizedBox(width: LuckdateSpacing.sm),
              Text(
                '(本餐)',
                style: LuckdateTextStyles.bodySmall.copyWith(
                  color: LuckdateColors.textSecondary,
                ),
              ),
              const Spacer(),
              Text('营养占比为估算值', style: LuckdateTextStyles.caption),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.md),
          Row(
            children: [
              metric('蛋白质', protein, proteinPct, const Color(0xFF8ADDBA)),
              const SizedBox(width: LuckdateSpacing.md),
              metric('脂肪', fat, fatPct, const Color(0xFFF3B4B8)),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          Row(
            children: [
              metric('碳水', carbs, carbsPct, const Color(0xFF9EDDEA)),
              const SizedBox(width: LuckdateSpacing.md),
              metric(
                '膳食纤维',
                value.toDouble() * .025,
                .08,
                const Color(0xFFC9B2ED),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.md),
          ClipRRect(
            borderRadius: BorderRadius.circular(LuckdateRadius.pill),
            child: Row(
              children: [
                Expanded(
                  flex: (proteinPct * 100).round().clamp(1, 100),
                  child: const SizedBox(
                    height: 8,
                    child: ColoredBox(color: Color(0xFF8ADDBA)),
                  ),
                ),
                Expanded(
                  flex: (fatPct * 100).round().clamp(1, 100),
                  child: const SizedBox(
                    height: 8,
                    child: ColoredBox(color: Color(0xFFF3B4B8)),
                  ),
                ),
                Expanded(
                  flex: (carbsPct * 100).round().clamp(1, 100),
                  child: const SizedBox(
                    height: 8,
                    child: ColoredBox(color: Color(0xFF9EDDEA)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AiSuggestionPanel extends StatelessWidget {
  const _AiSuggestionPanel();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(LuckdateSpacing.md),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F9FC),
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'AI 减脂建议',
            style: LuckdateTextStyles.title.copyWith(fontSize: 15),
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          _tip('建议搭配一份新鲜水果或蔬菜，增加膳食纤维和维生素摄入。'),
          const SizedBox(height: LuckdateSpacing.sm),
          _tip('建议增加绿叶蔬菜，帮助提升膳食纤维摄入。'),
          const SizedBox(height: LuckdateSpacing.md),
          Text(
            '以上热量为 AI 识别估算值，仅供参考，请以实际为准。',
            style: LuckdateTextStyles.caption.copyWith(
              color: LuckdateColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _tip(String text) => Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Padding(
        padding: EdgeInsets.only(top: 6),
        child: Icon(Icons.circle, size: 7, color: Color(0xFF71D5AB)),
      ),
      const SizedBox(width: LuckdateSpacing.sm),
      Expanded(child: Text(text, style: LuckdateTextStyles.bodySmall)),
    ],
  );
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
