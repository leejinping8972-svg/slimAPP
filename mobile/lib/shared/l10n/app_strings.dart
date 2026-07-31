import 'app_locale.dart';

/// Demo bilingual copy (es-MX / zh). Expand keys as screens are localized.
class AppStrings {
  const AppStrings(this.lang);

  final AppLang lang;

  factory AppStrings.fromCode(String? code) =>
      AppStrings(AppLangX.fromCode(code));

  bool get isZh => lang == AppLang.zh;

  String _t(String es, String zh) => isZh ? zh : es;

  // —— Tabs / shell ——
  String get tabSunny => 'Sunny';
  String get tabJourney => _t('Recorrido', '旅程');
  String get tabMe => _t('Yo', '我的');

  // —— Welcome ——
  String get welcomeTagline =>
      _t('TU ACOMPAÑANTE DIARIO DE VITALIDAD', '你的每日活力伙伴');
  String get welcomeHeadline =>
      _t('Siéntete viva.\nConoce luckdate.', '感受活力。\n认识 luckdate。');
  String get welcomeQuote => _t(
        'Todo gran día comienza con un pequeño ritual.',
        '每一个美好的日子，都从一小段仪式开始。',
      );
  String get welcomeStart => _t('Comenzar mi viaje', '开始我的旅程');
  String get welcomeLogin => _t('Iniciar sesión', '登录');

  // —— Auth ——
  String get loginTitle => _t('Iniciar sesión', '登录');
  String get registerTitle => _t('Crear cuenta', '注册账号');
  String get emailOrPhone => _t('Correo o teléfono', '邮箱或手机号');
  String get password => _t('Contraseña', '密码');
  String get continueLabel => _t('Continuar', '继续');
  String get skipForNow => _t('Omitir por ahora', '稍后再说');
  String get linkOrderTitle => _t('Vincular pedido', '关联订单');
  String get linkOrderHint => _t(
        'Nombre del destinatario + últimos 4 dígitos del teléfono',
        '收件人姓名 + 手机号后四位',
      );

  // —— Profile ——
  String get settings => _t('Ajustes', '设置');
  String get units => _t('Unidades', '单位');
  String get language => _t('Idioma', '语言');
  String get reminders => _t('Recordatorios', '提醒');
  String get privacy => _t('Privacidad y aviso de salud', '隐私与健康声明');
  String get viewLabel => _t('Ver', '查看');
  String get ordersAchievements => _t('Pedidos y logros', '订单与成就');
  String get linkedOrder => _t('Pedido vinculado', '已关联订单');
  String get noLinkedOrder => _t('Sin pedido vinculado', '暂无关联订单');
  String get achievements => _t('Logros', '成就');
  String get badgesCount => _t('insignias', '枚徽章');
  String get signOut => _t('Cerrar sesión', '退出登录');
  String get myJourney => _t('Mi recorrido', '我的旅程');
  String get languagePageTitle => _t('Idioma', '语言');
  String get languagePageSubtitle => _t(
        'Elige el idioma de la interfaz.',
        '选择界面显示语言。',
      );
  String get languageApplied => _t(
        'Idioma actualizado',
        '语言已更新',
      );

  // —— Plan / ritual empty ——
  String get planTitle => _t('Plan de 28 días', '28 天方案');
  String get noPlanTitle => _t('Aún no tienes un plan activo', '你还没有进行中的方案');
  String get noPlanBody => _t(
        'Si aún no tienes un plan activo, contacta a nuestro equipo de soporte.',
        '若还没有进行中的方案，请联系我们的客服团队。',
      );
  String get talkMessenger => _t('Hablar por Messenger', '通过 Messenger 咨询');
  String get productCarePlan =>
      _t('Plan de cuidado del producto', '产品护理方案');
  String get wantSlimJourney =>
      _t('¿Quieres el viaje Slim de 28 días?', '想开启 28 天 Slim 旅程吗？');
  String get contactCsForSlim => _t(
        'Contacta a servicio al cliente para activarlo. Ya no hay compra dentro de la app.',
        '请联系客服开通。App 内已不再售卖商品。',
      );

  // —— Sunny / chat ——
  String get chatWithSunny => _t('Chat con Sunny AI', '与 Sunny AI 对话');
  String get sunnySubtitle =>
      _t('Tu compañera de vitalidad', '你的活力伙伴');
  String get chatHint => _t('Chatea con Sunny...', '和 Sunny 聊聊…');
  String get chatDisclaimer => _t(
        'Sunny puede equivocarse. Úsalo solo como referencia según tu situación.',
        'Sunny 可能出错，请结合自身情况仅作参考。',
      );

  // —— No-product onboarding ——
  String get healthNeedPrompt => _t(
        'Primero cuéntame qué te importa más ahora:\n\n'
        '• Perder peso — un ritmo suave de vitalidad y hábitos\n'
        '• Salud intestinal — digestión y bienestar diario\n'
        '• Antiedad — energía y cuidado continuo\n'
        '• Más energía — rituales ligeros para sentirte activa\n'
        '• Otra necesidad — cuéntame con tus palabras',
        '先告诉我你现在最关心什么：\n\n'
        '• 减重 — 温和的活力习惯节奏\n'
        '• 肠道健康 — 消化与日常舒适\n'
        '• 抗衰 — 持续的能量与养护\n'
        '• 提升能量 — 轻量仪式感\n'
        '• 其他需求 — 用你的话告诉我',
      );

  List<String> get healthNeedActions => isZh
      ? const ['减重', '肠道健康', '抗衰', '提升能量', '其他需求']
      : const [
          'Perder peso',
          'Salud intestinal',
          'Antiedad',
          'Más energía',
          'Otra necesidad',
        ];

  String get noProductGreeting => _t(
        '¡Hola! ☀️ Soy Sunny, tu compañera diaria de vitalidad.\n\n'
        'Como aún no vinculaste un pedido, primero quiero entender tu necesidad '
        'y luego unos datos básicos. Al final te conecto con nuestro equipo en Messenger.\n\n',
        '你好！☀️ 我是 Sunny，你的每日活力伙伴。\n\n'
        '你还没有关联订单，我想先了解你的需求，再收集一些基础信息，'
        '最后帮你联系我们的 Messenger 客服。\n\n',
      );

  String get messengerHandoff => _t(
        'Gracias por compartir tu perfil. El siguiente paso es hablar con nuestro '
        'equipo en Messenger: te orientarán con el producto o plan más adecuado '
        'para tu necesidad.\n\n'
        'Toca «Hablar por Messenger» cuando quieras.',
        '感谢你分享资料。下一步请通过 Messenger 联系我们的团队，'
        '他们会根据你的需求推荐合适的产品或方案。\n\n'
        '需要时请点击「通过 Messenger 咨询」。',
      );

  String get acceptPrivacy => _t('Acepto', '我同意');
  String get privacyPrompt => _t(
        'Antes de personalizar tu viaje, confirma lo siguiente:\n\n'
        '¿Aceptas nuestra Política de privacidad y Aviso de salud?\n'
        'Responde "Acepto" para continuar.',
        '在个性化你的旅程之前，请确认：\n\n'
        '你是否同意我们的《隐私政策》与《健康声明》？\n'
        '回复「我同意」以继续。',
      );

  String get goJourney => _t('Ir al viaje', '前往旅程');
  String get vitalityScore => _t('Mi puntuación de vitalidad', '我的生命力评分');
  String get somethingWrong =>
      _t('Algo salió mal. Recarga la página.', '出了点问题，请刷新页面。');
}
