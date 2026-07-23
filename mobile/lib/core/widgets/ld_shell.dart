import 'package:flutter/material.dart';
import '../../app/theme/luckdate_theme.dart';

class LdMainBottomNav extends StatelessWidget {
  const LdMainBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  /// Visual tab index: 0 Sunny, 1 Journey, 2 Mall, 3 Me.
  final int currentIndex;
  final ValueChanged<int> onTap;

  static const _items = [
    (Icons.wb_sunny_outlined, Icons.wb_sunny_rounded, 'Sunny'),
    (Icons.local_florist_outlined, Icons.local_florist_rounded, 'Journey'),
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
                          curve: Curves.easeOut,
                          width: 44,
                          height: 32,
                          decoration: BoxDecoration(
                            color: selected
                                ? LuckdateColors.navIndicator
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(
                              LuckdateRadius.md,
                            ),
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
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        color: LuckdateColors.ivoryWhite,
        borderRadius: BorderRadius.circular(LuckdateRadius.control),
        border: Border.all(color: LuckdateColors.lineSoft, width: 0.5),
      ),
      child: Row(
        children: options.map((option) {
          final active = option == selected;
          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(option),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeOut,
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: active ? LuckdateColors.deepSage : Colors.transparent,
                  borderRadius: BorderRadius.circular(LuckdateRadius.md),
                ),
                child: Text(
                  labelBuilder(option),
                  textAlign: TextAlign.center,
                  style: LuckdateTextStyles.caption.copyWith(
                    color: active
                        ? LuckdateColors.ivoryWhite
                        : LuckdateColors.textSecondary,
                    fontWeight: active ? FontWeight.w700 : FontWeight.w500,
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
    this.hintText = 'Chat with Sunny...',
    this.showMic = true,
    this.disclaimer,
  });

  final TextEditingController controller;
  final bool canSend;
  final VoidCallback onSend;
  final String hintText;
  final bool showMic;
  final String? disclaimer;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        LuckdateSpacing.lg,
        LuckdateSpacing.sm,
        LuckdateSpacing.lg,
        LuckdateSpacing.md + MediaQuery.viewInsetsOf(context).bottom,
      ),
      decoration: const BoxDecoration(
        color: LuckdateColors.cloudIvory,
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: LuckdateColors.ivoryWhite,
                      borderRadius:
                          BorderRadius.circular(LuckdateRadius.control),
                      border: Border.all(
                        color: LuckdateColors.lineSoft,
                        width: 0.5,
                      ),
                    ),
                    child: Row(
                      children: [
                        if (showMic)
                          const Padding(
                            padding: EdgeInsets.only(left: 12),
                            child: Icon(
                              Icons.mic_none_rounded,
                              size: 22,
                              color: LuckdateColors.textSecondary,
                            ),
                          ),
                        Expanded(
                          child: TextField(
                            controller: controller,
                            decoration: InputDecoration(
                              hintText: hintText,
                              hintStyle: LuckdateTextStyles.bodySmall.copyWith(
                                color: LuckdateColors.textSecondary,
                              ),
                              filled: false,
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: LuckdateSpacing.md,
                                vertical: LuckdateSpacing.md,
                              ),
                              border: InputBorder.none,
                              enabledBorder: InputBorder.none,
                              focusedBorder: InputBorder.none,
                            ),
                            onSubmitted: (_) => onSend(),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: LuckdateSpacing.sm),
                Material(
                  color: canSend
                      ? LuckdateColors.deepSage
                      : LuckdateColors.lineSoft,
                  borderRadius: BorderRadius.circular(LuckdateRadius.control),
                  child: InkWell(
                    onTap: canSend ? onSend : null,
                    borderRadius: BorderRadius.circular(LuckdateRadius.control),
                    child: const SizedBox(
                      width: 48,
                      height: 48,
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
            if (disclaimer != null) ...[
              const SizedBox(height: LuckdateSpacing.sm),
              Text(
                disclaimer!,
                style: LuckdateTextStyles.caption.copyWith(fontSize: 10),
                textAlign: TextAlign.center,
              ),
            ],
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
            OutlinedButton.icon(
              onPressed: onAction,
              icon: const Icon(Icons.ios_share_rounded, size: 14),
              label: Text(
                actionLabel!,
                style: LuckdateTextStyles.caption.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              style: OutlinedButton.styleFrom(
                foregroundColor: LuckdateColors.textPrimary,
                backgroundColor: LuckdateColors.ivoryWhite,
                side: const BorderSide(color: LuckdateColors.lineSoft),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
