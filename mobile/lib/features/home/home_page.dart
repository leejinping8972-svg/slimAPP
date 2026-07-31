import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../core/widgets/ld_shell.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/services/onboarding_chat_guide.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  bool _canSend = false;

  static const _quickAsks = [
    ('☀️', 'Recorrido diario'),
    ('💧', 'Tomé un vaso de agua'),
    ('🏃', 'Hice 45 minutos de yoga'),
    ('🥗', 'Comí una ensalada de pollo en el almuerzo'),
    ('😴', 'Dormí 7 horas anoche'),
  ];

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      final canSend = _controller.text.trim().isNotEmpty;
      if (canSend != _canSend) setState(() => _canSend = canSend);
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _maybeShowJourneyComplete());
  }

  void _maybeShowJourneyComplete() {
    final state = ref.read(appStateProvider);
    final profile = state.profile;
    final journey = state.journey;
    if (!mounted) return;
    if (profile.userPlanType != UserPlanType.mealReplacement) return;
    if (journey.day < 28 || profile.journeyCompleteSeen) return;

    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Recorrido completado'),
        content: const Text(
          'Avanzaste hacia la luz durante 28 días. Consulta tu reporte final y explora tu próximo recorrido.',
        ),
        actions: [
          TextButton(
            onPressed: () {
              ref.read(appStateProvider.notifier).markJourneyCompleteSeen();
              Navigator.pop(ctx);
            },
            child: const Text('Ahora no'),
          ),
          TextButton(
            onPressed: () {
              ref.read(appStateProvider.notifier).markJourneyCompleteSeen();
              Navigator.pop(ctx);
              context.push('/journey/report');
            },
            child: const Text('Ver reporte'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 240),
          curve: Curves.easeOut,
        );
      }
    });
  }

  bool _hasInlineActions(List<ChatMessage> messages) {
    for (var i = messages.length - 1; i >= 0; i--) {
      final msg = messages[i];
      if (msg.isUser) continue;
      final labels = msg.actionLabels;
      return labels != null && labels.isNotEmpty;
    }
    return false;
  }

  void _onActionTap(String label) {
    if (label == 'Obtener plan' || label == 'Obtenerlo ahora') {
      ref.read(appStateProvider.notifier).sendChatMessage(label);
      return;
    }
    if (label == 'Solo ayuda con productos' ||
        label == 'Solo estoy explorando' ||
        label == 'Ahora no') {
      ref.read(appStateProvider.notifier).sendChatMessage(label);
      return;
    }
    if (label == 'Ver plan detallado' || label == 'Ver mi plan') {
      context.push('/plan');
    } else if (label == 'Explorar tienda' ||
        label == 'Explorar la tienda' ||
        label == 'Vincular pedido') {
      context.push('/link-order');
    } else if (label == 'Establecer meta de sueño' ||
        label == 'Entrar al día 1' ||
        label == 'Iniciar ritual del día 1' ||
        label == 'Iniciar registro del día 1' ||
        label == 'Ir al ritual' ||
        label == 'Ir al recorrido') {
      context.go('/ritual');
    } else if (label == 'Registrar agua') {
      ref.read(appStateProvider.notifier).sendQuickAction('water');
    } else if (label == 'Registrar comida') {
      ref.read(appStateProvider.notifier).sendQuickAction('meal');
    } else if (label == 'Registrar sueño') {
      ref.read(appStateProvider.notifier).sendQuickAction('sleep');
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStateProvider);
    final messages = state.chatMessages;
    final profile = state.profile;

    ref.listen(appStateProvider, (_, __) => _scrollToBottom());

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            _HomeHeader(
              onBack: () {
                if (context.canPop()) {
                  context.pop();
                } else {
                  context.go('/ritual');
                }
              },
            ),
            Expanded(
              child: ListView(
                controller: _scrollController,
                padding: const EdgeInsets.fromLTRB(
                  LuckdateSpacing.lg,
                  LuckdateSpacing.sm,
                  LuckdateSpacing.lg,
                  LuckdateSpacing.md,
                ),
                children: [
                  if (profile.onboardingComplete) ...[
                    _SunnyIntroCard(
                      nickname: profile.nickname,
                      onLearnMore: () => context.push('/sunny/suggestions'),
                    ),
                    const SizedBox(height: LuckdateSpacing.lg),
                  ],
                  ...messages.map((msg) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: LuckdateSpacing.md),
                      child: msg.isUser
                          ? UserBubble(
                              text: msg.text,
                              timestamp: msg.timestamp,
                              nickname: profile.nickname,
                            )
                          : SunnyBubble(
                              text: msg.text,
                              isStreaming: msg.isStreaming,
                              timestamp: msg.timestamp,
                              suggestions: msg.suggestions,
                              actionLabels: msg.actionLabels,
                              onActionTap: _onActionTap,
                            ),
                    );
                  }),
                ],
              ),
            ),
            if (!_hasInlineActions(messages))
              _QuickAskRow(
                items: profile.onboardingComplete
                    ? _quickAsks
                    : OnboardingChatGuide.quickAsksFor(
                        profile.onboardingStep.isEmpty
                            ? 'privacy'
                            : profile.onboardingStep,
                      ),
                onTap: (text) {
                  if (text == 'Recorrido diario' || text == 'Ritual diario') {
                    context.go('/ritual');
                    return;
                  }
                  ref.read(appStateProvider.notifier).sendChatMessage(text);
                },
              ),
            LdChatComposer(
              controller: _controller,
              canSend: _canSend,
              onSend: _send,
              hintText: 'Chatea con Sunny...',
              disclaimer:
                  'Sunny puede equivocarse. Úsalo solo como referencia según tu situación.',
            ),
          ],
        ),
      ),
    );
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    _controller.clear();
    ref.read(appStateProvider.notifier).sendChatMessage(text);
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        LuckdateSpacing.sm,
        LuckdateSpacing.sm,
        LuckdateSpacing.sm,
        LuckdateSpacing.md,
      ),
      decoration: const BoxDecoration(
        color: LuckdateColors.cloudIvory,
        border: Border(
          bottom: BorderSide(color: LuckdateColors.lineSoft, width: 0.5),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: onBack,
            icon: const Icon(Icons.arrow_back_ios_new, size: 18),
            color: LuckdateColors.textPrimary,
          ),
          Expanded(
            child: Column(
              children: [
                Text(
                  'Chat con Sunny AI',
                  style: LuckdateTextStyles.title.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  'Tu compañera de vitalidad',
                  style: LuckdateTextStyles.caption,
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.more_horiz, size: 22),
            color: LuckdateColors.textPrimary,
          ),
        ],
      ),
    );
  }
}

class _SunnyIntroCard extends StatelessWidget {
  const _SunnyIntroCard({
    required this.nickname,
    required this.onLearnMore,
  });

  final String nickname;
  final VoidCallback onLearnMore;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(LuckdateSpacing.base),
      decoration: BoxDecoration(
        color: const Color(0xFFF9F6F1),
        borderRadius: BorderRadius.circular(LuckdateRadius.xl),
        border: Border.all(color: LuckdateColors.lineSoft.withValues(alpha: 0.7)),
        boxShadow: LuckdateShadows.soft,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const LdSunnyAvatar(size: 44),
          const SizedBox(width: LuckdateSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  crossAxisAlignment: WrapCrossAlignment.center,
                  spacing: LuckdateSpacing.sm,
                  children: [
                    Text(
                      'Sunny ☀️',
                      style: LuckdateTextStyles.title.copyWith(fontSize: 15),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: LuckdateColors.ivoryWhite,
                        borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                        border: Border.all(color: LuckdateColors.lineSoft),
                      ),
                      child: Text(
                        'Compañera de IA',
                        style: LuckdateTextStyles.caption.copyWith(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Hola, $nickname. Soy Sunny. ¿Sobre qué te gustaría platicar hoy?',
                  style: LuckdateTextStyles.bodySmall,
                ),
                const SizedBox(height: LuckdateSpacing.sm),
                Align(
                  alignment: Alignment.centerRight,
                  child: OutlinedButton(
                    onPressed: onLearnMore,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: LuckdateColors.chocolateBrown,
                      side: const BorderSide(color: LuckdateColors.lineSoft),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 8,
                      ),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(LuckdateRadius.pill),
                      ),
                    ),
                    child: Text(
                      'Conoce a Sunny >',
                      style: LuckdateTextStyles.caption.copyWith(
                        fontWeight: FontWeight.w600,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickAskRow extends StatelessWidget {
  const _QuickAskRow({required this.items, required this.onTap});

  final List<(String, String)> items;
  final ValueChanged<String> onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        LuckdateSpacing.lg,
        0,
        LuckdateSpacing.lg,
        LuckdateSpacing.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Quizá quieras preguntar', style: LuckdateTextStyles.caption),
          const SizedBox(height: LuckdateSpacing.sm),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: items.map((item) {
                return Padding(
                  padding: const EdgeInsets.only(right: LuckdateSpacing.sm),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => onTap(item.$2),
                      borderRadius:
                          BorderRadius.circular(LuckdateRadius.pill),
                      child: Ink(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: LuckdateColors.ivoryWhite,
                          borderRadius:
                              BorderRadius.circular(LuckdateRadius.pill),
                          border: Border.all(color: LuckdateColors.lineSoft),
                        ),
                        child: Text(
                          '${item.$1} ${item.$2}',
                          style: LuckdateTextStyles.caption.copyWith(
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
