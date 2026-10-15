import 'package:flutter/material.dart';

import '../../app/theme/luckdate_theme.dart';
import '../../shared/services/today_tasks.dart';

/// Check-in mark: idle icon stays put; a fresh success plays once.
///
/// Re-entering an already confirmed card must pass [animate]: false so the
/// burst does not replay.
class LdSuccessBadge extends StatefulWidget {
  const LdSuccessBadge({super.key, required this.animate});

  final bool animate;

  @override
  State<LdSuccessBadge> createState() => _LdSuccessBadgeState();
}

class _LdSuccessBadgeState extends State<LdSuccessBadge>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 640),
    );
    if (widget.animate) {
      _controller.forward();
    } else {
      _controller.value = 1;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 44,
      height: 44,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          final t = _controller.value;
          final scale = widget.animate
              ? Tween<double>(
                  begin: 0.72,
                  end: 1,
                ).transform(Curves.easeOutBack.transform(t.clamp(0, 1)))
              : 1.0;
          return Stack(
            alignment: Alignment.center,
            children: [
              if (widget.animate && t < 1)
                CustomPaint(
                  size: const Size(44, 44),
                  painter: _BurstPainter(progress: t),
                ),
              Transform.scale(
                scale: scale,
                child: const Icon(
                  Icons.check_circle_rounded,
                  color: LuckdateColors.success,
                  size: 28,
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _BurstPainter extends CustomPainter {
  _BurstPainter({required this.progress});

  final double progress;

  static const _count = 6;

  @override
  void paint(Canvas canvas, Size size) {
    final fade = (1 - ((progress - 0.2) / 0.8).clamp(0, 1)).toDouble();
    if (fade <= 0) return;
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint()..style = PaintingStyle.fill;
    for (var i = 0; i < _count; i++) {
      final angle = (i / _count) * 6.28318 - 1.2;
      final radius = 8 + 14 * Curves.easeOut.transform(progress);
      paint.color =
          (i.isEven ? LuckdateColors.vitalitySage : LuckdateColors.sunGold)
              .withValues(alpha: 0.85 * fade);
      canvas.drawCircle(
        center + Offset.fromDirection(angle, radius),
        2.2,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _BurstPainter oldDelegate) =>
      oldDelegate.progress != progress;
}

/// Ring, count, and task rows driven by the same [TodayTaskView] list.
class LdTodayProgress extends StatefulWidget {
  const LdTodayProgress({super.key, required this.tasks, this.onTaskTap});

  final List<TodayTaskView> tasks;
  final ValueChanged<TodayTaskKind>? onTaskTap;

  @override
  State<LdTodayProgress> createState() => _LdTodayProgressState();
}

class _LdTodayProgressState extends State<LdTodayProgress> {
  late double _countBegin;
  late double _countEnd;

  int get _done => widget.tasks.where((task) => task.done).length;

  @override
  void initState() {
    super.initState();
    _countBegin = _countEnd = _done.toDouble();
  }

  @override
  void didUpdateWidget(LdTodayProgress oldWidget) {
    super.didUpdateWidget(oldWidget);
    final next = _done.toDouble();
    if (next != _countEnd) {
      _countBegin = _countEnd;
      _countEnd = next;
    }
  }

  @override
  Widget build(BuildContext context) {
    final total = widget.tasks.length;
    final done = _done;
    final reduce = MediaQuery.disableAnimationsOf(context);
    final motion = reduce ? Duration.zero : const Duration(milliseconds: 320);
    final ratio = total == 0 ? 0.0 : done / total;
    final surface = Color.lerp(
      LuckdateColors.ivoryWhite,
      LuckdateColors.sageSoft,
      ratio,
    )!;

    return Semantics(
      container: true,
      label: total == 0 ? 'Sin tareas para hoy' : '$done de $total hechos hoy',
      child: AnimatedContainer(
        duration: motion,
        curve: Curves.easeOut,
        width: double.infinity,
        padding: const EdgeInsets.all(LuckdateSpacing.base),
        decoration: BoxDecoration(
          color: surface,
          borderRadius: BorderRadius.circular(LuckdateRadius.xl),
          border: Border.all(color: LuckdateColors.lineSoft, width: 0.5),
        ),
        child: total == 0
            ? Text('Sin tareas para hoy', style: LuckdateTextStyles.body)
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      _ProgressRing(
                        from: total == 0 ? 0 : _countBegin / total,
                        to: total == 0 ? 0 : _countEnd / total,
                        duration: motion,
                      ),
                      const SizedBox(width: LuckdateSpacing.base),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Hoy', style: LuckdateTextStyles.caption),
                            TweenAnimationBuilder<double>(
                              tween: Tween(begin: _countBegin, end: _countEnd),
                              duration: motion,
                              curve: Curves.easeOut,
                              builder: (context, value, _) {
                                return Text(
                                  '${value.round()} / $total',
                                  style: LuckdateTextStyles.h1,
                                );
                              },
                            ),
                            Text(
                              'Pequeños rituales del día',
                              style: LuckdateTextStyles.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: LuckdateSpacing.md),
                  for (var i = 0; i < widget.tasks.length; i++)
                    _TaskLine(
                      task: widget.tasks[i],
                      showTop: i > 0,
                      showBottom: i < widget.tasks.length - 1,
                      lineReached: widget.tasks[i].done,
                      next:
                          !widget.tasks[i].done &&
                          widget.tasks.take(i).every((task) => task.done),
                      onTap: widget.onTaskTap == null
                          ? null
                          : () => widget.onTaskTap!(widget.tasks[i].kind),
                    ),
                ],
              ),
      ),
    );
  }
}

class _ProgressRing extends StatelessWidget {
  const _ProgressRing({
    required this.from,
    required this.to,
    required this.duration,
  });

  final double from;
  final double to;
  final Duration duration;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: from, end: to),
      duration: duration,
      curve: Curves.easeOut,
      builder: (context, value, _) {
        return SizedBox(
          width: 64,
          height: 64,
          child: CircularProgressIndicator(
            value: value.clamp(0, 1),
            strokeWidth: 7,
            backgroundColor: LuckdateColors.lineSoft,
            color: LuckdateColors.deepSage,
            strokeCap: StrokeCap.round,
          ),
        );
      },
    );
  }
}

class _TaskLine extends StatelessWidget {
  const _TaskLine({
    required this.task,
    required this.showTop,
    required this.showBottom,
    required this.lineReached,
    required this.next,
    required this.onTap,
  });

  final TodayTaskView task;
  final bool showTop;
  final bool showBottom;
  final bool lineReached;
  final bool next;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.disableAnimationsOf(context);
    final titleStyle = LuckdateTextStyles.body.copyWith(
      fontWeight: FontWeight.w600,
      decoration: task.done ? TextDecoration.lineThrough : null,
      decorationColor: LuckdateColors.textSecondary,
      color: task.done
          ? LuckdateColors.textSecondary
          : LuckdateColors.textPrimary,
    );

    return Semantics(
      button: onTap != null,
      label:
          '${task.title}, ${task.time}, ${task.done ? 'hecho' : 'pendiente'}. ${task.detail}',
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 48),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(
                  width: 22,
                  height: 48,
                  child: CustomPaint(
                    painter: _RailPainter(
                      showTop: showTop,
                      showBottom: showBottom,
                      reached: lineReached,
                      next: next,
                    ),
                  ),
                ),
                const SizedBox(width: LuckdateSpacing.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AnimatedDefaultTextStyle(
                        duration: reduce
                            ? Duration.zero
                            : const Duration(milliseconds: 180),
                        style: titleStyle,
                        child: Text(task.title),
                      ),
                      Text(task.detail, style: LuckdateTextStyles.caption),
                    ],
                  ),
                ),
                Text(task.time, style: LuckdateTextStyles.caption),
                const SizedBox(width: LuckdateSpacing.sm),
                Icon(
                  task.done
                      ? Icons.check_circle_rounded
                      : Icons.circle_outlined,
                  size: 22,
                  color: task.done
                      ? LuckdateColors.deepSage
                      : LuckdateColors.textSecondary,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RailPainter extends CustomPainter {
  _RailPainter({
    required this.showTop,
    required this.showBottom,
    required this.reached,
    required this.next,
  });

  final bool showTop;
  final bool showBottom;
  final bool reached;
  final bool next;

  @override
  void paint(Canvas canvas, Size size) {
    final x = size.width / 2;
    final mid = size.height / 2;
    final paint = Paint()
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;
    if (showTop) {
      paint.color = reached ? LuckdateColors.deepSage : LuckdateColors.lineSoft;
      canvas.drawLine(Offset(x, 0), Offset(x, mid - 7), paint);
    }
    if (showBottom) {
      paint.color = reached ? LuckdateColors.deepSage : LuckdateColors.lineSoft;
      canvas.drawLine(Offset(x, mid + 7), Offset(x, size.height), paint);
    }
    final dot = Paint()
      ..color = reached
          ? LuckdateColors.deepSage
          : (next ? LuckdateColors.sunGold : LuckdateColors.lineSoft);
    canvas.drawCircle(Offset(x, mid), reached || next ? 5 : 3.5, dot);
  }

  @override
  bool shouldRepaint(covariant _RailPainter oldDelegate) =>
      oldDelegate.reached != reached ||
      oldDelegate.next != next ||
      oldDelegate.showTop != showTop ||
      oldDelegate.showBottom != showBottom;
}
