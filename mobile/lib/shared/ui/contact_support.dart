import 'package:flutter/material.dart';

import '../../app/theme/luckdate_theme.dart';

/// Shared CTA after mall removal: users without a plan contact support
/// (admin can assist with external order binding).
class ContactSupport {
  static const label = 'Contactar servicio al cliente';

  static const email = 'soporte@luckdate.com';

  static const shortMessage =
      'Si aún no tienes un plan activo, contacta a nuestro equipo de soporte. '
      'Ellos pueden ayudarte a activar tu viaje según tu pedido externo.';

  static const detailMessage =
      '$shortMessage\n\n'
      'Correo: $email';

  static void show(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: LuckdateColors.cloudIvory,
        title: Text(label, style: LuckdateTextStyles.title),
        content: Text(detailMessage, style: LuckdateTextStyles.body),
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
