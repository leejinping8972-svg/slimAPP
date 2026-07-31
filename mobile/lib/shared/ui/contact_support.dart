import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:web/web.dart' as web;

import '../../app/theme/luckdate_theme.dart';
import '../config/app_config.dart';

/// Shared CTA: open Messenger CS (preferred) with dialog fallback.
class ContactSupport {
  /// Primary button label shown in chat / plan empty states.
  static const label = 'Hablar por Messenger';

  /// Chinese label (must stay in sync with [AppStrings.talkMessenger]).
  static const labelZh = '通过 Messenger 咨询';

  /// Legacy label still accepted by chat action handlers.
  static const legacyLabel = 'Contactar servicio al cliente';

  static const email = 'soporte@luckdate.com';

  static String get messengerUrl => AppConfig.messengerUrl;

  static const shortMessage =
      'Cuéntanos tu necesidad en Messenger: nuestro equipo te orientará '
      'con el producto o plan adecuado.';

  static const shortMessageZh =
      '在 Messenger 告诉我们你的需求：团队会为你推荐合适的产品或方案。';

  static String get detailMessage =>
      '$shortMessage\n\n'
      'Messenger: $messengerUrl\n'
      'Correo: $email';

  static String get detailMessageZh =>
      '$shortMessageZh\n\n'
      'Messenger：$messengerUrl\n'
      '邮箱：$email';

  static bool matchesLabel(String value) =>
      value == ContactSupport.label ||
      value == ContactSupport.labelZh ||
      value == ContactSupport.legacyLabel;

  /// Tries to open Messenger; always shows a short dialog with the link.
  static void show(BuildContext context, {bool zh = false}) {
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
        title: Text(
          zh ? labelZh : label,
          style: LuckdateTextStyles.title,
        ),
        content: Text(
          opened
              ? (zh
                  ? '若未打开 Messenger，请复制此链接：\n$messengerUrl'
                  : 'Si no se abrió Messenger, copia este enlace:\n$messengerUrl')
              : (zh ? detailMessageZh : detailMessage),
          style: LuckdateTextStyles.body,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(zh ? '知道了' : 'Entendido'),
          ),
        ],
      ),
    );
  }
}
