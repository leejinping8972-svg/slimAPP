import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:web/web.dart' as web;

import '../../app/theme/luckdate_theme.dart';
import '../config/app_config.dart';

/// Shared CTA: open Messenger CS (preferred) with dialog fallback.
class ContactSupport {
  /// Primary button label shown in chat / plan empty states.
  static const label = 'Hablar por Messenger';

  /// Legacy label still accepted by chat action handlers.
  static const legacyLabel = 'Contactar servicio al cliente';

  static const email = 'soporte@luckdate.com';

  static String get messengerUrl => AppConfig.messengerUrl;

  static const shortMessage =
      'Cuéntanos tu necesidad en Messenger: nuestro equipo te orientará '
      'con el producto o plan adecuado.';

  static String get detailMessage =>
      '$shortMessage\n\n'
      'Messenger: $messengerUrl\n'
      'Correo: $email';

  static bool matchesLabel(String label) =>
      label == ContactSupport.label || label == legacyLabel;

  /// Tries to open Messenger; always shows a short dialog with the link.
  static void show(BuildContext context) {
    var opened = false;
    if (kIsWeb) {
      try {
        web.window.open(messengerUrl, '_blank');
        opened = true;
      } catch (_) {
        opened = false;
      }
    }

    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: LuckdateColors.cloudIvory,
        title: Text(label, style: LuckdateTextStyles.title),
        content: Text(
          opened
              ? 'Si no se abrió Messenger, copia este enlace:\n$messengerUrl'
              : detailMessage,
          style: LuckdateTextStyles.body,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Entendido'),
          ),
        ],
      ),
    );
  }
}
