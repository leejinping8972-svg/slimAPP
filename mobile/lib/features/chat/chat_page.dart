import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
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
    final messages = ref.watch(appStateProvider).chatMessages;

    ref.listen(appStateProvider, (_, __) => _scrollToBottom());

    return LdScaffold(
      title: 'Chat with Sunny',
      body: Column(
        children: [
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
                  _quickBtn('Mood', 'mood'),
                  _quickBtn('Adjust', 'adjust'),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(LuckdateSpacing.lg),
            child: Row(
              children: [
                Expanded(
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
