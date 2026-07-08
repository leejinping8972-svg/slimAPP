import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../shared/models/models.dart';
import 'sunny_sunflower.dart';

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
                              context.go('/today');
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
  });

  final Widget child;
  final EdgeInsets padding;
  final bool completed;
  final VoidCallback? onTap;

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
              width: 1,
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x1A000000),
                offset: Offset(0, 6),
                blurRadius: 16,
              ),
            ],
          ),
          child: child,
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
          borderRadius: BorderRadius.circular(LuckdateRadius.pill),
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
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        backgroundColor: selected
            ? LuckdateColors.sageSoft
            : LuckdateColors.ivoryWhite,
        foregroundColor: LuckdateColors.chocolateBrown,
        side: BorderSide(
          color: selected ? LuckdateColors.deepSage : LuckdateColors.lineSoft,
        ),
        minimumSize: const Size(0, 48),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LuckdateRadius.pill),
        ),
      ),
      child: Text(label),
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
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected
              ? (color ?? LuckdateColors.deepSage).withValues(alpha: 0.15)
              : LuckdateColors.ivoryWhite,
          borderRadius: BorderRadius.circular(LuckdateRadius.pill),
          border: Border.all(
            color: selected
                ? (color ?? LuckdateColors.deepSage)
                : LuckdateColors.lineSoft,
          ),
        ),
        child: Text(
          label,
          style: LuckdateTextStyles.bodySmall.copyWith(
            color: selected
                ? LuckdateColors.deepSage
                : LuckdateColors.textSecondary,
            fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ),
    );
  }
}

class LdSunnyAvatar extends StatelessWidget {
  const LdSunnyAvatar({super.key, this.size = 40});

  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: SunnySunflower(size: size, showStem: false),
    );
  }
}

class SunnyBubble extends StatelessWidget {
  const SunnyBubble({super.key, required this.text, this.isStreaming = false});

  final String text;
  final bool isStreaming;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const LdSunnyAvatar(size: 32),
        const SizedBox(width: LuckdateSpacing.sm),
        Flexible(
          child: Container(
            padding: const EdgeInsets.all(LuckdateSpacing.md),
            decoration: BoxDecoration(
              color: LuckdateColors.moonBeige.withValues(alpha: 0.35),
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(LuckdateRadius.lg),
                bottomLeft: Radius.circular(LuckdateRadius.lg),
                bottomRight: Radius.circular(LuckdateRadius.lg),
              ),
            ),
            child: Text(
              isStreaming && text.isEmpty ? '...' : text,
              style: LuckdateTextStyles.body,
            ),
          ),
        ),
      ],
    );
  }
}

class UserBubble extends StatelessWidget {
  const UserBubble({super.key, required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerRight,
      child: Container(
        constraints: BoxConstraints(
          maxWidth: MediaQuery.sizeOf(context).width * 0.78,
        ),
        padding: const EdgeInsets.all(LuckdateSpacing.md),
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
  });

  final double percent;
  final String centerLabel;
  final String subLabel;
  final double size;

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
              color: LuckdateColors.sunGold,
              strokeCap: StrokeCap.round,
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.wb_sunny_rounded,
                color: LuckdateColors.sunGold,
                size: 28,
              ),
              const SizedBox(height: 4),
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
          Icon(
            completed ? Icons.check_circle_rounded : Icons.circle_outlined,
            color: completed
                ? LuckdateColors.deepSage
                : LuckdateColors.lineSoft,
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
            height: 140,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(LuckdateRadius.xl),
              ),
            ),
            child: Center(
              child: Icon(Icons.spa_outlined, size: 48, color: color),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(LuckdateSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (product.isNew)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    margin: const EdgeInsets.only(bottom: 6),
                    decoration: BoxDecoration(
                      color: LuckdateColors.sunGold.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(LuckdateRadius.sm),
                    ),
                    child: const Text('NEW', style: LuckdateTextStyles.caption),
                  ),
                Text(product.name, style: LuckdateTextStyles.title),
                const SizedBox(height: 4),
                Text(
                  product.shortDescription,
                  style: LuckdateTextStyles.bodySmall,
                  maxLines: 2,
                ),
                const SizedBox(height: 8),
                Text(
                  product.priceDisplay,
                  style: LuckdateTextStyles.body.copyWith(
                    fontWeight: FontWeight.w600,
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
                Text('Day $day', style: LuckdateTextStyles.caption),
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
  const StatePlaceholder({super.key, required this.type, this.onRetry});

  final String type;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    final (icon, title, message) = switch (type) {
      'loading' => (
        Icons.hourglass_top_rounded,
        'Loading',
        'Preparing your journey...',
      ),
      'empty' => (
        Icons.inbox_outlined,
        'Nothing here yet',
        'Your records will appear as you grow.',
      ),
      'error' => (
        Icons.cloud_off_outlined,
        'Something went quiet',
        'A small pause — tap to try again.',
      ),
      'network' => (
        Icons.wifi_off_rounded,
        'Weak connection',
        'We saved your last state. Retry when ready.',
      ),
      _ => (Icons.info_outline, 'Notice', ''),
    };
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(LuckdateSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 48, color: LuckdateColors.vitalitySage),
            const SizedBox(height: LuckdateSpacing.base),
            Text(title, style: LuckdateTextStyles.title),
            const SizedBox(height: LuckdateSpacing.sm),
            Text(
              message,
              style: LuckdateTextStyles.bodySmall,
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: LuckdateSpacing.base),
              LdPrimaryButton(
                label: 'Try again',
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
