import 'package:flutter/material.dart';

/// Non-web stub — native HTML video is web-only.
class WelcomeNativeWebVideo extends StatelessWidget {
  const WelcomeNativeWebVideo({super.key});

  static bool get isSupported => false;

  @override
  Widget build(BuildContext context) => const SizedBox.shrink();
}
