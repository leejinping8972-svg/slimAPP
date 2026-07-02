import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../app/theme/luckdate_theme.dart';

/// Sunny™ sunflower mascot — matches Luckdate brand reference.
class SunnySunflower extends StatelessWidget {
  const SunnySunflower({
    super.key,
    this.size = 120,
    this.showStem = true,
    this.useImage = false,
  });

  final double size;
  final bool showStem;
  final bool useImage;

  @override
  Widget build(BuildContext context) {
    if (useImage) {
      return Image.asset(
        'assets/images/sunny_sunflower.png',
        width: size,
        height: size,
        fit: BoxFit.contain,
        errorBuilder: (_, __, ___) => _Painted(size: size, showStem: showStem),
      );
    }
    return _Painted(size: size, showStem: showStem);
  }
}

class _Painted extends StatelessWidget {
  const _Painted({required this.size, required this.showStem});

  final double size;
  final bool showStem;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, showStem ? size * 1.15 : size),
      painter: _SunnyPainter(showStem: showStem),
    );
  }
}

class _SunnyPainter extends CustomPainter {
  _SunnyPainter({required this.showStem});

  final bool showStem;

  @override
  void paint(Canvas canvas, Size size) {
    final headSize = showStem ? size.width : size.width;
    final cx = size.width / 2;
    final cy = headSize * 0.42;
    final petalR = headSize * 0.38;
    final centerR = headSize * 0.22;

    // Petals
    const petalCount = 14;
    for (var i = 0; i < petalCount; i++) {
      final angle = (2 * math.pi / petalCount) * i - math.pi / 2;
      final px = cx + math.cos(angle) * petalR * 0.55;
      final py = cy + math.sin(angle) * petalR * 0.55;
      canvas.save();
      canvas.translate(px, py);
      canvas.rotate(angle + math.pi / 2);
      final petal = RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset.zero, width: headSize * 0.18, height: headSize * 0.34),
        Radius.circular(headSize * 0.09),
      );
      canvas.drawRRect(petal, Paint()..color = const Color(0xFFF4C542));
      canvas.restore();
    }

    // Face
    canvas.drawCircle(Offset(cx, cy), centerR, Paint()..color = Colors.white);

    // Smiling closed eyes
    final eyePaint = Paint()
      ..color = LuckdateColors.chocolateBrown
      ..style = PaintingStyle.stroke
      ..strokeWidth = headSize * 0.028
      ..strokeCap = StrokeCap.round;
    final eyeY = cy - centerR * 0.08;
    final eyeDx = centerR * 0.38;
    canvas.drawArc(
      Rect.fromCenter(center: Offset(cx - eyeDx, eyeY), width: centerR * 0.5, height: centerR * 0.28),
      0.1,
      math.pi - 0.2,
      false,
      eyePaint,
    );
    canvas.drawArc(
      Rect.fromCenter(center: Offset(cx + eyeDx, eyeY), width: centerR * 0.5, height: centerR * 0.28),
      0.1,
      math.pi - 0.2,
      false,
      eyePaint,
    );

    if (showStem) {
      final stemTop = cy + centerR * 0.85;
      final stemPaint = Paint()
        ..color = const Color(0xFF6E7D5B)
        ..strokeWidth = headSize * 0.045
        ..strokeCap = StrokeCap.round;
      canvas.drawLine(Offset(cx, stemTop), Offset(cx, size.height * 0.92), stemPaint);

      // Leaves
      final leafPaint = Paint()..color = const Color(0xFF8FA06E);
      _drawLeaf(canvas, Offset(cx - headSize * 0.08, stemTop + headSize * 0.18), -0.6, headSize * 0.22, leafPaint);
      _drawLeaf(canvas, Offset(cx + headSize * 0.08, stemTop + headSize * 0.28), 0.6, headSize * 0.22, leafPaint);
    }
  }

  void _drawLeaf(Canvas canvas, Offset origin, double angle, double len, Paint paint) {
    canvas.save();
    canvas.translate(origin.dx, origin.dy);
    canvas.rotate(angle);
    final path = Path()
      ..moveTo(0, 0)
      ..quadraticBezierTo(len * 0.5, -len * 0.35, len, 0)
      ..quadraticBezierTo(len * 0.5, len * 0.35, 0, 0);
    canvas.drawPath(path, paint);
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
