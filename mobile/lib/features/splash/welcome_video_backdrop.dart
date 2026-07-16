import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import '../../core/widgets/brand_assets.dart';

/// Full-bleed looping muted video for the launch guide background.
/// Always paints a still frame first; video is best-effort and never blocks UI.
class WelcomeVideoBackdrop extends StatefulWidget {
  const WelcomeVideoBackdrop({super.key});

  @override
  State<WelcomeVideoBackdrop> createState() => _WelcomeVideoBackdropState();
}

class _WelcomeVideoBackdropState extends State<WelcomeVideoBackdrop> {
  VideoPlayerController? _controller;
  bool _ready = false;
  bool _failed = false;

  @override
  void initState() {
    super.initState();
    // Defer video so first frame (still image + copy) always paints.
    WidgetsBinding.instance.addPostFrameCallback((_) => _boot());
  }

  Future<void> _boot() async {
    if (!mounted || _failed) return;
    VideoPlayerController? controller;
    try {
      controller = VideoPlayerController.asset(kWelcomeVideoAsset);
      await controller.initialize().timeout(const Duration(seconds: 12));
      if (!mounted) {
        await controller.dispose();
        return;
      }
      await controller.setLooping(true);
      await controller.setVolume(0);
      // Autoplay can fail on web without a gesture — keep still frame if so.
      try {
        await controller.play();
      } catch (_) {
        /* still show first decoded frame if any */
      }
      if (!mounted) {
        await controller.dispose();
        return;
      }
      if (!controller.value.isInitialized ||
          controller.value.hasError ||
          controller.value.size.isEmpty) {
        await controller.dispose();
        if (mounted) setState(() => _failed = true);
        return;
      }
      setState(() {
        _controller = controller;
        _ready = true;
      });
    } catch (_) {
      try {
        await controller?.dispose();
      } catch (_) {}
      if (mounted) {
        setState(() {
          _failed = true;
          _ready = false;
          _controller = null;
        });
      }
    }
  }

  @override
  void dispose() {
    final c = _controller;
    _controller = null;
    c?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = _controller;
    final showVideo = _ready &&
        !_failed &&
        controller != null &&
        controller.value.isInitialized &&
        !controller.value.hasError &&
        !controller.value.size.isEmpty;

    return Stack(
      fit: StackFit.expand,
      children: [
        const _StillFrame(),
        if (showVideo)
          ColoredBox(
            color: kSplashScaffoldColor,
            child: FittedBox(
              fit: BoxFit.cover,
              clipBehavior: Clip.hardEdge,
              child: SizedBox(
                width: controller.value.size.width,
                height: controller.value.size.height,
                child: VideoPlayer(controller),
              ),
            ),
          ),
      ],
    );
  }
}

class _StillFrame extends StatelessWidget {
  const _StillFrame();

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      kWelcomeImageAsset,
      fit: BoxFit.cover,
      alignment: Alignment.center,
      gaplessPlayback: true,
      filterQuality: FilterQuality.medium,
      errorBuilder: (_, __, ___) => const ColoredBox(
        color: kSplashScaffoldColor,
      ),
    );
  }
}
