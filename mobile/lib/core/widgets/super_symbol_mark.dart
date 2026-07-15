import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../app/theme/luckdate_theme.dart';

/// Brand super-symbol drawn in code (sunflower mark).
class SuperSymbolMark extends StatelessWidget {
  const SuperSymbolMark({
    super.key,
    this.size = 28,
    this.color = LuckdateColors.deepSage,
  });

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _SuperSymbolPainter(color: color),
      ),
    );
  }
}

class _SuperSymbolPainter extends CustomPainter {
  _SuperSymbolPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final r = size.shortestSide / 2;

    final petalPaint = Paint()
      ..color = color.withValues(alpha: 0.85)
      ..style = PaintingStyle.stroke
      ..strokeWidth = math.max(0.8, r * 0.045)
      ..strokeCap = StrokeCap.round;

    const petals = 16;
    for (var i = 0; i < petals; i++) {
      final angle = (i / petals) * math.pi * 2 - math.pi / 2;
      final length = r * (i.isEven ? 0.98 : 0.78);
      final inner = r * 0.34;
      final p1 = Offset(
        center.dx + math.cos(angle) * inner,
        center.dy + math.sin(angle) * inner,
      );
      final p2 = Offset(
        center.dx + math.cos(angle) * length,
        center.dy + math.sin(angle) * length,
      );
      canvas.drawLine(p1, p2, petalPaint);
    }

    final discR = r * 0.30;
    canvas.drawCircle(
      center,
      discR,
      Paint()
        ..color = color.withValues(alpha: 0.12)
        ..style = PaintingStyle.fill,
    );
    canvas.drawCircle(
      center,
      discR,
      Paint()
        ..color = color.withValues(alpha: 0.55)
        ..style = PaintingStyle.stroke
        ..strokeWidth = math.max(0.7, r * 0.04),
    );

    final dotPaint = Paint()
      ..color = color.withValues(alpha: 0.7)
      ..style = PaintingStyle.fill;
    const rings = 3;
    for (var ring = 1; ring <= rings; ring++) {
      final rr = discR * (ring / (rings + 0.6));
      final count = 4 + ring * 3;
      for (var i = 0; i < count; i++) {
        final a = (i / count) * math.pi * 2 + ring * 0.2;
        canvas.drawCircle(
          Offset(center.dx + math.cos(a) * rr, center.dy + math.sin(a) * rr),
          math.max(0.6, r * 0.028),
          dotPaint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant _SuperSymbolPainter oldDelegate) =>
      oldDelegate.color != color;
}
