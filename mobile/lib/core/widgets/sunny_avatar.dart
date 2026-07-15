import 'dart:async';
import 'package:flutter/material.dart';

/// Brand IP expression pack for Sunny (A6-1).
enum SunnyMood {
  smile,
  wink,
  happy,
  shy,
  like,
  giggle,
  heart,
  cute,
  tongue,
  cry,
  surprise,
  angry,
}

extension SunnyMoodX on SunnyMood {
  String get asset => 'assets/images/sunny_ip/$name.png';

  /// Friendly rotation used when avatar is idle / talking casually.
  static const List<SunnyMood> idleCycle = [
    SunnyMood.smile,
    SunnyMood.wink,
    SunnyMood.happy,
    SunnyMood.shy,
    SunnyMood.cute,
    SunnyMood.giggle,
    SunnyMood.like,
    SunnyMood.heart,
    SunnyMood.tongue,
  ];

  /// Pick a mood from message tone for chat bubbles.
  static SunnyMood fromMessage(String text, {bool streaming = false}) {
    if (streaming) return SunnyMood.wink;
    final t = text.toLowerCase();
    if (t.contains('cry') ||
        t.contains('sorry') ||
        t.contains('sad') ||
        t.contains('miss')) {
      return SunnyMood.cry;
    }
    if (t.contains('wow') ||
        t.contains('surpris') ||
        t.contains('amazing') ||
        t.contains('!')) {
      return SunnyMood.surprise;
    }
    if (t.contains('love') ||
        t.contains('heart') ||
        t.contains('proud') ||
        t.contains('great job')) {
      return SunnyMood.heart;
    }
    if (t.contains('cute') || t.contains('adorable')) return SunnyMood.cute;
    if (t.contains('laugh') || t.contains('haha') || t.contains('fun')) {
      return SunnyMood.giggle;
    }
    if (t.contains('like') || t.contains('enjoy')) return SunnyMood.like;
    if (t.contains('angry') || t.contains('wait')) return SunnyMood.angry;
    if (t.contains('happy') || t.contains('yay') || t.contains('cheer')) {
      return SunnyMood.happy;
    }
    if (t.contains('shy') || t.contains('blush')) return SunnyMood.shy;
    if (t.contains('?')) return SunnyMood.surprise;
    return SunnyMood.smile;
  }
}

/// Dynamic Sunny IP avatar — soft breathe + expression crossfade.
class LdSunnyAvatar extends StatefulWidget {
  const LdSunnyAvatar({
    super.key,
    this.size = 40,
    this.mood,
    this.animate = true,
    this.cycleIdle = true,
    this.cycleInterval = const Duration(seconds: 3),
  });

  final double size;

  /// Fixed mood; when null and [cycleIdle] is true, rotates friendly moods.
  final SunnyMood? mood;
  final bool animate;
  final bool cycleIdle;
  final Duration cycleInterval;

  @override
  State<LdSunnyAvatar> createState() => _LdSunnyAvatarState();
}

class _LdSunnyAvatarState extends State<LdSunnyAvatar>
    with TickerProviderStateMixin {
  late final AnimationController _breathe;
  late final AnimationController _fade;
  Timer? _cycle;

  int _idleIndex = 0;
  SunnyMood _current = SunnyMood.smile;
  SunnyMood _previous = SunnyMood.smile;

  @override
  void initState() {
    super.initState();
    _current = widget.mood ?? SunnyMood.smile;
    _previous = _current;
    _breathe = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    );
    _fade = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 420),
      value: 1,
    );
    if (widget.animate) {
      _breathe.repeat(reverse: true);
    }
    _maybeStartCycle();
  }

  @override
  void didUpdateWidget(covariant LdSunnyAvatar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.mood != oldWidget.mood && widget.mood != null) {
      _swapTo(widget.mood!);
      _stopCycle();
    } else if (widget.mood == null && oldWidget.mood != null) {
      _maybeStartCycle();
    }
    if (widget.animate != oldWidget.animate) {
      if (widget.animate) {
        _breathe.repeat(reverse: true);
      } else {
        _breathe.stop();
        _breathe.value = 0.5;
      }
    }
    if (widget.cycleIdle != oldWidget.cycleIdle) {
      if (widget.cycleIdle && widget.mood == null) {
        _maybeStartCycle();
      } else {
        _stopCycle();
      }
    }
  }

  void _maybeStartCycle() {
    _stopCycle();
    if (!widget.cycleIdle || widget.mood != null || !widget.animate) return;
    _cycle = Timer.periodic(widget.cycleInterval, (_) {
      if (!mounted) return;
      _idleIndex = (_idleIndex + 1) % SunnyMoodX.idleCycle.length;
      _swapTo(SunnyMoodX.idleCycle[_idleIndex]);
    });
  }

  void _stopCycle() {
    _cycle?.cancel();
    _cycle = null;
  }

  void _swapTo(SunnyMood next) {
    if (next == _current) return;
    setState(() {
      _previous = _current;
      _current = next;
    });
    _fade.forward(from: 0);
  }

  @override
  void dispose() {
    _stopCycle();
    _breathe.dispose();
    _fade.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([_breathe, _fade]),
      builder: (context, _) {
        final breath = Curves.easeInOut.transform(_breathe.value);
        final scale = widget.animate ? (1 + breath * 0.045) : 1.0;
        final t = Curves.easeOutCubic.transform(_fade.value);
        return SizedBox(
          width: widget.size,
          height: widget.size,
          child: Transform.scale(
            scale: scale,
            child: Stack(
              fit: StackFit.expand,
              children: [
                if (t < 1)
                  Opacity(
                    opacity: 1 - t,
                    child: Image.asset(
                      _previous.asset,
                      fit: BoxFit.contain,
                      filterQuality: FilterQuality.high,
                      errorBuilder: (_, __, ___) => _Fallback(size: widget.size),
                    ),
                  ),
                Opacity(
                  opacity: t,
                  child: Image.asset(
                    _current.asset,
                    fit: BoxFit.contain,
                    filterQuality: FilterQuality.high,
                    errorBuilder: (_, __, ___) => _Fallback(size: widget.size),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _Fallback extends StatelessWidget {
  const _Fallback({required this.size});
  final double size;

  @override
  Widget build(BuildContext context) {
    return Icon(
      Icons.wb_sunny_rounded,
      size: size * 0.72,
      color: const Color(0xFFF5C542),
    );
  }
}
