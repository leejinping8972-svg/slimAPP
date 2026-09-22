import 'package:flutter/material.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/models/models.dart';

/// Standalone preview: flutter run -t lib/features/chat/check_in_cards_demo.dart
void main() => runApp(
  MaterialApp(
    debugShowCheckedModeBanner: false,
    theme: buildLuckdateTheme(),
    home: const CheckInCardsDemoPage(),
  ),
);

/// Local-only demonstration. It does not change the user's check-in records.
class CheckInCardsDemoPage extends StatefulWidget {
  const CheckInCardsDemoPage({super.key});

  @override
  State<CheckInCardsDemoPage> createState() => _CheckInCardsDemoPageState();
}

class _CheckInCardsDemoPageState extends State<CheckInCardsDemoPage> {
  int _scenario = 0;
  int _revision = 0;
  CheckInCardData? _confirmed;
  final _scrollController = ScrollController();

  static const _labels = ['饮食打卡', '运动打卡', '修改饮食', '修改运动', '多条饮食', '多条运动'];
  static const _requests = [
    '今天 12:30 吃了鸡胸肉，150 克。',
    '今天 18:00 快走了 30 分钟。',
    '把今天早餐的记录改成 250 克。',
    '把今天晚上的运动改成 40 分钟。',
    '我今天有多条饮食记录，帮我选择要修改的那一条。',
    '我今天有多条运动记录，帮我选择要修改的那一条。',
  ];

  CheckInCardData get _card {
    final meal = _scenario.isEven;
    final type = meal ? CheckInType.meal : CheckInType.exercise;
    final modify = _scenario >= 2;
    return CheckInCardData(
      kind: modify ? ChatCardKind.modifyCheckIn : ChatCardKind.confirmCheckIn,
      type: type,
      name: meal ? '鸡胸肉' : '快走',
      time: modify ? (meal ? '早餐' : '晚上') : (meal ? '12:30' : '18:00'),
      value: modify ? (meal ? 250 : 40) : (meal ? 150 : 30),
      candidates: !modify
          ? const []
          : [
              CheckInRecord(
                id: 'first',
                type: type,
                name: meal ? '原味酸奶' : '快走',
                time: meal ? '08:00' : '18:00',
                value: meal ? 180 : 30,
                estimatedKcal: meal ? 200 : 213,
              ),
              CheckInRecord(
                id: 'second',
                type: type,
                name: meal ? '燕麦粥' : '瑜伽',
                time: meal ? '08:30' : '20:00',
                value: meal ? 200 : 20,
                estimatedKcal: meal ? 300 : 142,
              ),
              if (_scenario >= 4)
                CheckInRecord(
                  id: 'third',
                  type: type,
                  name: meal ? '水果沙拉' : '力量训练',
                  time: meal ? '13:20' : '21:00',
                  value: meal ? 120 : 45,
                  estimatedKcal: meal ? 160 : 320,
                ),
            ],
    );
  }

  void _reset(int scenario) {
    setState(() {
      _scenario = scenario;
      _revision++;
      _confirmed = null;
    });
    if (_scrollController.hasClients) _scrollController.jumpTo(0);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final card = _confirmed ?? _card;
    final modify = card.kind == ChatCardKind.modifyCheckIn;
    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      appBar: AppBar(
        title: const Text('Sunny'),
        centerTitle: false,
        actions: [
          IconButton(
            tooltip: '重新演示',
            onPressed: () => _reset(_scenario),
            icon: const Icon(Icons.refresh_rounded),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 4, 20, 12),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text('卡片交互演示 · 示例数据', style: LuckdateTextStyles.caption),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: List.generate(
                  _labels.length,
                  (i) => ChoiceChip(
                    label: SizedBox(
                      width: 62,
                      child: Text(
                        _labels[i],
                        textAlign: TextAlign.center,
                        style: LuckdateTextStyles.bodySmall,
                      ),
                    ),
                    showCheckmark: false,
                    selectedColor: LuckdateColors.sageSoft,
                    backgroundColor: LuckdateColors.ivoryWhite,
                    side: BorderSide(
                      color: _scenario == i
                          ? LuckdateColors.deepSage
                          : LuckdateColors.lineSoft,
                    ),
                    selected: _scenario == i,
                    onSelected: (_) => _reset(i),
                  ),
                ),
              ),
            ),
            Expanded(
              child: ListView(
                controller: _scrollController,
                padding: const EdgeInsets.all(20),
                children: [
                  Align(
                    alignment: Alignment.centerRight,
                    child: Container(
                      constraints: const BoxConstraints(maxWidth: 290),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: LuckdateColors.deepSage,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        _requests[_scenario],
                        style: LuckdateTextStyles.body.copyWith(
                          color: LuckdateColors.ivoryWhite,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Align(
                    alignment: Alignment.centerRight,
                    child: Text('刚刚  ✓', style: LuckdateTextStyles.caption),
                  ),
                  const SizedBox(height: 24),
                  SunnyBubble(
                    key: ValueKey('$_scenario-$_revision'),
                    text: modify
                        ? '找到了 ${card.candidates.length} 条记录，请选择要修改的那一条。'
                        : '帮你整理好了，确认一下就可以记录。',
                    card: card,
                    cardStatus: _confirmed == null
                        ? ChatCardStatus.pending
                        : ChatCardStatus.confirmed,
                    onCardConfirm: (data) => setState(() => _confirmed = data),
                  ),
                  if (_confirmed != null) ...[
                    const SizedBox(height: 20),
                    Text(
                      modify ? '已完成修改。可以切换上方场景继续体验。' : '已完成打卡。可以切换上方场景继续体验。',
                      style: LuckdateTextStyles.bodySmall,
                    ),
                  ],
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
              child: SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () => _reset((_scenario + 1) % _labels.length),
                  icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                  label: Text('体验${_labels[(_scenario + 1) % _labels.length]}'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
