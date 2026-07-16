import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import '../../core/widgets/brand_assets.dart';
import 'welcome_video_web_stub.dart'
    if (dart.library.html) 'welcome_video_web.dart';

/// Full-bleed looping muted video for the launch guide background.
/// Still frame always paints first; video is best-effort and never blocks UI.
class WelcomeVideoBackdrop extends StatefulWidget {
  const WelcomeVideoBackdrop({super.key});

  @override
  State<WelcomeVideoBackdrop> createState() => _WelcomeVideoBackdropState();
}

class _WelcomeVideoBackdropState extends State<WelcomeVideoBackdrop>
    with WidgetsBindingObserver {
  VideoPlayerController? _controller;
  bool _ready = false;
  bool _failed = false;
  bool _useNativeWebVideo = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    WidgetsBinding.instance.addPostFrameCallback((_) => _boot());
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    final c = _controller;
    _controller = null;
    c?.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _ensurePlaying();
    }
  }

  Future<void> _boot() async {
    if (!mounted || _failed) return;

    // Mobile browsers (esp. iOS Safari) are more reliable with a native
    // HTML <video playsinline muted autoplay> than video_player's canvas path.
    if (kIsWeb && WelcomeNativeWebVideo.isSupported) {
      setState(() => _useNativeWebVideo = true);
      return;
    }

    VideoPlayerController? controller;
    try {
      controller = VideoPlayerController.asset(kWelcomeVideoAsset);
      await controller.setVolume(0);
      await controller.initialize().timeout(const Duration(seconds: 20));
      if (!mounted) {
        await controller.dispose();
        return;
      }
      await controller.setLooping(true);
      await controller.setVolume(0);
      try {
        await controller.play();
      } catch (_) {}
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
      Future<void>.delayed(const Duration(milliseconds: 400), _ensurePlaying);
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

  Future<void> _ensurePlaying() async {
    final c = _controller;
    if (c == null || !c.value.isInitialized) return;
    try {
      await c.setVolume(0);
      if (!c.value.isPlaying) await c.play();
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final controller = _controller;
    final showVideo = !_useNativeWebVideo &&
        _ready &&
        !_failed &&
        controller != null &&
        controller.value.isInitialized &&
        !controller.value.hasError &&
        !controller.value.size.isEmpty;

    return Stack(
      fit: StackFit.expand,
      children: [
        const _StillFrame(),
        if (_useNativeWebVideo) const WelcomeNativeWebVideo(),
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
