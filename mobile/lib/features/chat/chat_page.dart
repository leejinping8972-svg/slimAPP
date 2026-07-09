import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

class ChatPage extends ConsumerStatefulWidget {
  const ChatPage({super.key});

  @override
  ConsumerState<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends ConsumerState<ChatPage> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  bool _canSend = false;

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      final canSend = _controller.text.trim().isNotEmpty;
      if (canSend != _canSend) setState(() => _canSend = canSend);
    });
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

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appStateProvider);
    final messages = state.chatMessages;
    final record = state.journey.todayRecord;

    ref.listen(appStateProvider, (_, __) => _scrollToBottom());

    return LdScaffold(
      title: 'Viva',
      showBack: true,
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: LuckdateSpacing.md),
          child: LdProfileAvatar(
            nickname: state.profile.nickname,
            radius: 18,
            onTap: () => context.push('/profile'),
          ),
        ),
      ],
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(
              LuckdateSpacing.lg,
              0,
              LuckdateSpacing.lg,
              LuckdateSpacing.sm,
            ),
            child: _TodayMiniCard(record: record),
          ),
          if (_isEveningMoodWindow())
            Padding(
              padding: const EdgeInsets.fromLTRB(
                LuckdateSpacing.lg,
                0,
                LuckdateSpacing.lg,
                LuckdateSpacing.sm,
              ),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(LuckdateSpacing.md),
                decoration: BoxDecoration(
                  color: LuckdateColors.sunGold.withValues(alpha: 0.18),
                  borderRadius: BorderRadius.circular(LuckdateRadius.lg),
                ),
                child: Text(
                  'Evening check-in: how are you feeling tonight?',
                  style: LuckdateTextStyles.bodySmall,
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: LuckdateSpacing.lg),
            child: Text(
              'Viva provides lifestyle companionship — not medical advice.',
              style: LuckdateTextStyles.caption,
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          Expanded(
            child: ListView.separated(
              controller: _scrollController,
              padding: const EdgeInsets.all(LuckdateSpacing.lg),
              itemCount: messages.length,
              separatorBuilder: (_, __) =>
                  const SizedBox(height: LuckdateSpacing.md),
              itemBuilder: (context, index) {
                final msg = messages[index];
                if (msg.isUser) return UserBubble(text: msg.text);
                return SunnyBubble(
                  text: msg.text,
                  isStreaming: msg.isStreaming,
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: LuckdateSpacing.lg),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _quickBtn('Water', 'water'),
                  _quickBtn('Meal', 'meal'),
                  _quickBtn('Adjust', 'adjust'),
                ],
              ),
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                LuckdateSpacing.lg,
                LuckdateSpacing.sm,
                LuckdateSpacing.lg,
                LuckdateSpacing.lg +
                    MediaQuery.viewInsetsOf(context).bottom,
              ),
              child: TextField(
                controller: _controller,
                decoration: InputDecoration(
                  hintText: 'Ask Viva anything...',
                  suffixIcon: IconButton(
                    icon: Icon(
                      Icons.send_rounded,
                      color: _canSend
                          ? LuckdateColors.deepSage
                          : LuckdateColors.lineSoft,
                    ),
                    onPressed: _canSend ? _send : null,
                  ),
                ),
                onSubmitted: (_) => _send(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _quickBtn(String label, String action) {
    return Padding(
      padding: const EdgeInsets.only(right: LuckdateSpacing.sm),
      child: LdChoiceChip(
        label: label,
        selected: false,
        onTap: () =>
            ref.read(appStateProvider.notifier).sendQuickAction(action),
      ),
    );
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    _controller.clear();
    ref.read(appStateProvider.notifier).sendChatMessage(text);
  }

  bool _isEveningMoodWindow() {
    final hour = DateTime.now().hour;
    return hour >= 20 && hour < 22;
  }
}

class _TodayMiniCard extends ConsumerWidget {
  const _TodayMiniCard({required this.record});

  final TodayRecord record;

  static const _moods = [
    ('great', '😊', 'Great'),
    ('okay', '😐', 'Okay'),
    ('tired', '😴', 'Tired'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return LdCard(
      padding: const EdgeInsets.symmetric(
        horizontal: LuckdateSpacing.base,
        vertical: LuckdateSpacing.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const LdSunnyAvatar(size: 28),
              const SizedBox(width: LuckdateSpacing.sm),
              Expanded(
                child: Text(
                  'Today: ${record.hydrationMl} ml water'
                  '${record.weightRecorded ? ' · ${record.weightValueKg.toStringAsFixed(1)} kg' : ''}'
                  '${record.productTaken == ProductTakenStatus.taken ? ' · product logged' : ''}'
                  '${record.moodTag.isNotEmpty ? ' · mood: ${record.moodTag}' : ''}',
                  style: LuckdateTextStyles.caption,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: LuckdateSpacing.sm),
          Wrap(
            spacing: LuckdateSpacing.sm,
            runSpacing: LuckdateSpacing.sm,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Text('Mood', style: LuckdateTextStyles.caption),
              ..._moods.map((mood) {
                final selected = record.moodTag == mood.$1;
                return Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () =>
                        ref.read(appStateProvider.notifier).logMood(mood.$1),
                    borderRadius: BorderRadius.circular(LuckdateRadius.pill),
                    child: Ink(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: selected
                            ? LuckdateColors.sageSoft
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(
                          LuckdateRadius.pill,
                        ),
                        border: Border.all(
                          color: selected
                              ? LuckdateColors.deepSage
                              : LuckdateColors.lineSoft,
                        ),
                      ),
                      child: Text(
                        '${mood.$2} ${mood.$3}',
                        style: LuckdateTextStyles.caption.copyWith(
                          fontWeight: selected
                              ? FontWeight.w600
                              : FontWeight.w400,
                        ),
                      ),
                    ),
                  ),
                );
              }),
            ],
          ),
        ],
      ),
    );
  }
}
