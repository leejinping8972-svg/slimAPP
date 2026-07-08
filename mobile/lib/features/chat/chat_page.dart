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

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.go('/today'),
        ),
        title: const Text('Chat with Sunny'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(LuckdateSpacing.lg, 0, LuckdateSpacing.lg, LuckdateSpacing.sm),
            child: _TodayMiniCard(record: record),
          ),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: LuckdateSpacing.lg, vertical: LuckdateSpacing.sm),
            color: LuckdateColors.sageSoft,
            child: Text(
              'Sunny provides lifestyle companionship — not medical advice.',
              style: LuckdateTextStyles.caption,
            ),
          ),
          Expanded(
            child: ListView.separated(
              controller: _scrollController,
              padding: const EdgeInsets.all(LuckdateSpacing.lg),
              itemCount: messages.length,
              separatorBuilder: (_, __) => const SizedBox(height: LuckdateSpacing.md),
              itemBuilder: (context, index) {
                final msg = messages[index];
                if (msg.isUser) return UserBubble(text: msg.text);
                return SunnyBubble(text: msg.text, isStreaming: msg.isStreaming);
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
          Padding(
            padding: const EdgeInsets.all(LuckdateSpacing.lg),
            child: TextField(
              controller: _controller,
              decoration: InputDecoration(
                hintText: 'Ask Sunny anything...',
                suffixIcon: IconButton(
                  icon: const Icon(Icons.send_rounded, color: LuckdateColors.deepSage),
                  onPressed: _send,
                ),
              ),
              onSubmitted: (_) => _send(),
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
        onTap: () => ref.read(appStateProvider.notifier).sendQuickAction(action),
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

class _TodayMiniCard extends StatelessWidget {
  const _TodayMiniCard({required this.record});

  final TodayRecord record;

  @override
  Widget build(BuildContext context) {
    return LdCard(
      padding: const EdgeInsets.symmetric(horizontal: LuckdateSpacing.base, vertical: LuckdateSpacing.sm),
      child: Row(
        children: [
          const LdSunnyAvatar(size: 28),
          const SizedBox(width: LuckdateSpacing.sm),
          Expanded(
            child: Text(
              'Today: ${record.hydrationMl} ml water'
              '${record.weightRecorded ? ' · ${record.weightValueKg.toStringAsFixed(1)} kg' : ''}'
              '${record.productTaken == ProductTakenStatus.taken ? ' · product logged' : ''}',
              style: LuckdateTextStyles.caption,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
