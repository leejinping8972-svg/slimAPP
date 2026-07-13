import 'package:flutter/material.dart';
import '../../app/theme/luckdate_theme.dart';

class LdMainBottomNav extends StatelessWidget {
  const LdMainBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;

  static const _items = [
    (Icons.home_outlined, Icons.home_rounded, 'Home'),
    (Icons.wb_sunny_outlined, Icons.wb_sunny_rounded, 'Ritual'),
    (Icons.event_note_outlined, Icons.event_note_rounded, 'Plan'),
    (Icons.storefront_outlined, Icons.storefront_rounded, 'Mall'),
    (Icons.person_outline_rounded, Icons.person_rounded, 'Me'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: LuckdateColors.ivoryWhite,
        border: Border(top: BorderSide(color: LuckdateColors.lineSoft, width: 0.5)),
        boxShadow: [
          BoxShadow(
            color: Color(0x08000000),
            offset: Offset(0, -4),
            blurRadius: 16,
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: List.generate(_items.length, (index) {
              final item = _items[index];
              final selected = currentIndex == index;
              return Expanded(
                child: InkWell(
                  onTap: () => onTap(index),
                  borderRadius: BorderRadius.circular(LuckdateRadius.md),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: selected
                                ? LuckdateColors.navIndicator
                                : Colors.transparent,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            selected ? item.$2 : item.$1,
                            size: 22,
                            color: selected
                                ? LuckdateColors.deepSage
                                : LuckdateColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          item.$3,
                          style: LuckdateTextStyles.tabLabel.copyWith(
                            color: selected
                                ? LuckdateColors.deepSage
                                : LuckdateColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class LdSegmentedControl<T> extends StatelessWidget {
  const LdSegmentedControl({
    super.key,
    required this.options,
    required this.selected,
    required this.onChanged,
    required this.labelBuilder,
  });

  final List<T> options;
  final T selected;
  final ValueChanged<T> onChanged;
  final String Function(T) labelBuilder;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: LuckdateColors.ivoryWhite,
        borderRadius: BorderRadius.circular(LuckdateRadius.pill),
        border: Border.all(color: LuckdateColors.lineSoft),
        boxShadow: LuckdateShadows.soft,
      ),
      child: Row(
        children: options.map((option) {
          final active = option == selected;
          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(option),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: active ? LuckdateColors.deepSage : Colors.transparent,
                  borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                ),
                child: Text(
                  labelBuilder(option),
                  textAlign: TextAlign.center,
                  style: LuckdateTextStyles.caption.copyWith(
                    color: active
                        ? LuckdateColors.ivoryWhite
                        : LuckdateColors.textSecondary,
                    fontWeight: active ? FontWeight.w600 : FontWeight.w500,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class LdChatComposer extends StatelessWidget {
  const LdChatComposer({
    super.key,
    required this.controller,
    required this.canSend,
    required this.onSend,
    this.hintText = 'Ask Sunny anything...',
  });

  final TextEditingController controller;
  final bool canSend;
  final VoidCallback onSend;
  final String hintText;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        LuckdateSpacing.lg,
        LuckdateSpacing.sm,
        LuckdateSpacing.lg,
        LuckdateSpacing.lg + MediaQuery.viewInsetsOf(context).bottom,
      ),
      decoration: const BoxDecoration(
        color: LuckdateColors.ivoryWhite,
        border: Border(top: BorderSide(color: LuckdateColors.lineSoft, width: 0.5)),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                decoration: InputDecoration(
                  hintText: hintText,
                  filled: true,
                  fillColor: LuckdateColors.cloudIvory,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: LuckdateSpacing.lg,
                    vertical: LuckdateSpacing.md,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                    borderSide: BorderSide.none,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                    borderSide: BorderSide.none,
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                    borderSide: const BorderSide(
                      color: LuckdateColors.deepSage,
                      width: 1,
                    ),
                  ),
                ),
                onSubmitted: (_) => onSend(),
              ),
            ),
            const SizedBox(width: LuckdateSpacing.sm),
            Material(
              color: canSend ? LuckdateColors.deepSage : LuckdateColors.lineSoft,
              shape: const CircleBorder(),
              child: InkWell(
                onTap: canSend ? onSend : null,
                customBorder: const CircleBorder(),
                child: const SizedBox(
                  width: 44,
                  height: 44,
                  child: Icon(
                    Icons.send_rounded,
                    color: LuckdateColors.ivoryWhite,
                    size: 20,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class LdScoreRing extends StatelessWidget {
  const LdScoreRing({
    super.key,
    required this.score,
    required this.label,
    this.size = 120,
    this.strokeColor = LuckdateColors.deepSage,
  });

  final int score;
  final String label;
  final double size;
  final Color strokeColor;

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
              value: score / 100,
              strokeWidth: size > 100 ? 10 : 7,
              backgroundColor: LuckdateColors.lineSoft.withValues(alpha: 0.5),
              color: strokeColor,
              strokeCap: StrokeCap.round,
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$score',
                style: LuckdateTextStyles.h1.copyWith(fontSize: size * 0.28),
              ),
              Text(label, style: LuckdateTextStyles.caption),
            ],
          ),
        ],
      ),
    );
  }
}

class LdVitalityBanner extends StatelessWidget {
  const LdVitalityBanner({
    super.key,
    required this.message,
    this.actionLabel,
    this.onAction,
  });

  final String message;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        horizontal: LuckdateSpacing.lg,
        vertical: LuckdateSpacing.md,
      ),
      decoration: BoxDecoration(
        color: LuckdateColors.sageSoft,
        borderRadius: BorderRadius.circular(LuckdateRadius.lg),
        border: Border.all(color: LuckdateColors.vitalitySage.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.eco_outlined, color: LuckdateColors.deepSage, size: 20),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Text(message, style: LuckdateTextStyles.bodySmall),
          ),
          if (actionLabel != null)
            TextButton(
              onPressed: onAction,
              style: TextButton.styleFrom(
                foregroundColor: LuckdateColors.deepSage,
                padding: const EdgeInsets.symmetric(horizontal: 8),
              ),
              child: Text(actionLabel!),
            ),
        ],
      ),
    );
  }
}
