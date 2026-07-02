import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router.dart';
import 'theme/luckdate_theme.dart';

class ChatVivaApp extends ConsumerWidget {
  const ChatVivaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      title: 'ChatViva Slim',
      debugShowCheckedModeBanner: false,
      theme: buildLuckdateTheme(),
      routerConfig: router,
    );
  }
}
