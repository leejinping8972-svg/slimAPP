import 'dart:js_interop';
import 'dart:ui_web' as ui_web;

import 'package:flutter/material.dart';
import 'package:web/web.dart' as web;

import '../../core/widgets/brand_assets.dart';

/// Native HTML5 video backdrop — more reliable on mobile Safari/Chrome than
/// Flutter's canvas video path. Uses muted + playsInline for autoplay.
class WelcomeNativeWebVideo extends StatefulWidget {
  const WelcomeNativeWebVideo({super.key});

  static bool get isSupported => true;

  @override
  State<WelcomeNativeWebVideo> createState() => _WelcomeNativeWebVideoState();
}

class _WelcomeNativeWebVideoState extends State<WelcomeNativeWebVideo> {
  static const _viewType = 'luckdate-welcome-bg-video';
  static bool _registered = false;

  @override
  void initState() {
    super.initState();
    if (!_registered) {
      _registered = true;
      ui_web.platformViewRegistry.registerViewFactory(_viewType, (int viewId) {
        final video = web.HTMLVideoElement()
          ..id = 'welcome-bg-video-$viewId'
          ..autoplay = true
          ..muted = true
          ..loop = true
          ..preload = 'auto'
          ..controls = false
          ..setAttribute('playsinline', 'true')
          ..setAttribute('webkit-playsinline', 'true')
          ..setAttribute('muted', '')
          ..setAttribute('autoplay', '')
          ..setAttribute('loop', '')
          ..style.setProperty('border', 'none')
          ..style.setProperty('width', '100%')
          ..style.setProperty('height', '100%')
          ..style.setProperty('object-fit', 'cover')
          ..style.setProperty('object-position', 'center')
          ..style.setProperty('pointer-events', 'none');

        final publicUrl = Uri.base.resolve(kWelcomeVideoPublicPath).toString();
        final assetUrl =
            Uri.base.resolve('assets/$kWelcomeVideoAsset').toString();

        var triedAsset = false;
        void tryPlay() {
          video.muted = true;
          video.play().toDart.catchError((_) => null);
        }

        video.src = publicUrl;
        video.addEventListener(
          'error',
          (web.Event _) {
            if (!triedAsset) {
              triedAsset = true;
              video.src = assetUrl;
              video.load();
              tryPlay();
            }
          }.toJS,
        );
        video.addEventListener('canplay', ((web.Event _) => tryPlay()).toJS);
        video.addEventListener('loadeddata', ((web.Event _) => tryPlay()).toJS);
        tryPlay();

        void resume(web.Event _) => tryPlay();
        web.document.addEventListener('touchstart', resume.toJS);
        web.document.addEventListener('click', resume.toJS);

        return video;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return const HtmlElementView(viewType: _viewType);
  }
}
