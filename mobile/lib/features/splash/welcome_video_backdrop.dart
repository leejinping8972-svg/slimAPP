import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import '../../core/widgets/brand_assets.dart';

/// Full-bleed looping muted video for the launch guide background.
/// Falls back to [kWelcomeImageAsset] while loading or on failure.
class WelcomeVideoBackdrop extends StatefulWidget {
  const WelcomeVideoBackdrop({super.key});

  @override
  State<WelcomeVideoBackdrop> createState() => _WelcomeVideoBackdropState();
}

class _WelcomeVideoBackdropState extends State<WelcomeVideoBackdrop> {
  VideoPlayerController? _controller;
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    _boot();
  }

  Future<void> _boot() async {
    final controller = VideoPlayerController.asset(kWelcomeVideoAsset);
    try {
      await controller.initialize();
      await controller.setLooping(true);
      await controller.setVolume(0);
      await controller.play();
      if (!mounted) {
        await controller.dispose();
        return;
      }
      setState(() {
        _controller = controller;
        _ready = true;
      });
    } catch (_) {
      await controller.dispose();
      if (mounted) setState(() => _ready = false);
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = _controller;
    if (!_ready || controller == null || !controller.value.isInitialized) {
      return const SizedBox.expand(
        child: _StillFrame(),
      );
    }

    final size = controller.value.size;
    return SizedBox.expand(
      child: ColoredBox(
        color: kSplashScaffoldColor,
        child: FittedBox(
          fit: BoxFit.cover,
          clipBehavior: Clip.hardEdge,
          child: SizedBox(
            width: size.width == 0 ? 1080 : size.width,
            height: size.height == 0 ? 1920 : size.height,
            child: VideoPlayer(controller),
          ),
        ),
      ),
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
