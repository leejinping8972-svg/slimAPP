import 'package:flutter/material.dart';

import '../../shared/models/check_in_chat.dart';
import '../../shared/l10n/app_strings.dart';

typedef CheckInConfirmCallback = void Function(CheckInDraft draft);
typedef CheckInPickCallback = void Function(CheckInDraft candidate);

/// Visual tokens for check-in confirm cards (reference chat UI — not Luckdate ivory).
class _Ck {
  static const green = Color(0xFF5DC48A);
  static const greenSoft = Color(0xFFE8F8EF);
  static const title = Color(0xFF1A1A1A);
  static const body = Color(0xFF333333);
  static const muted = Color(0xFF999999);
  static const line = Color(0xFFF0F0F0);
  static const panel = Color(0xFFF7F8FA);
  static const white = Color(0xFFFFFFFF);
  static const protein = Color(0xFF6EB6FF);
  static const fat = Color(0xFFFF8A9B);
  static const veg = Color(0xFF7DCF9A);
}

/// Diet / exercise (and other) confirm + pick cards inside Sunny chat bubbles.
class CheckInChatCard extends StatelessWidget {
  const CheckInChatCard({
    super.key,
    required this.payload,
    required this.strings,
    this.onConfirm,
    this.onCancel,
    this.onPick,
  });

  final ChatCardPayload payload;
  final AppStrings strings;
  final CheckInConfirmCallback? onConfirm;
  final VoidCallback? onCancel;
  final CheckInPickCallback? onPick;

  bool get _zh => strings.isZh;

  @override
  Widget build(BuildContext context) {
    if (payload.kind == CheckInCardKind.checkInPick) {
      return _PickCard(
        payload: payload,
        strings: strings,
        onPick: onPick,
      );
    }
    final draft = payload.draft;
    if (draft == null) return const SizedBox.shrink();

    final interactive = payload.status == CheckInCardStatus.pending;
    if (draft.type == CheckInType.meal || draft.type == CheckInType.product) {
      return _MealConfirmCard(
        draft: draft,
        status: payload.status,
        interactive: interactive,
        zh: _zh,
        strings: strings,
        onConfirm: onConfirm,
        onCancel: onCancel,
      );
    }
    if (draft.type == CheckInType.exercise) {
      return _ExerciseConfirmCard(
        draft: draft,
        status: payload.status,
        interactive: interactive,
        zh: _zh,
        strings: strings,
        onConfirm: onConfirm,
        onCancel: onCancel,
      );
    }
    return _SimpleConfirmCard(
      draft: draft,
      status: payload.status,
      interactive: interactive,
      zh: _zh,
      strings: strings,
      onConfirm: onConfirm,
      onCancel: onCancel,
    );
  }
}

class _MealConfirmCard extends StatelessWidget {
  const _MealConfirmCard({
    required this.draft,
    required this.status,
    required this.interactive,
    required this.zh,
    required this.strings,
    this.onConfirm,
    this.onCancel,
  });

  final CheckInDraft draft;
  final CheckInCardStatus status;
  final bool interactive;
  final bool zh;
  final AppStrings strings;
  final CheckInConfirmCallback? onConfirm;
  final VoidCallback? onCancel;

  @override
  Widget build(BuildContext context) {
    final kcal = double.tryParse(draft.rawFields['kcal'] ?? draft.value) ?? 320.0;
    final protein = int.tryParse(draft.rawFields['protein'] ?? '') ?? 28;
    final carbs = int.tryParse(draft.rawFields['carbs'] ?? '') ?? 35;
    final fat = int.tryParse(draft.rawFields['fat'] ?? '') ?? 12;
    final items = _mealItems(draft, zh: zh);
    final name = draft.value.isNotEmpty ? draft.value : (zh ? '一餐' : 'Comida');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _AnalysisHeader(
          title: zh ? 'AI热量分析' : 'Análisis de calorías IA',
          highlight: 'AI',
        ),
        const SizedBox(height: 10),
        Text(
          '${kcal.toStringAsFixed(1)} kcal',
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: _Ck.green,
            height: 1.1,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _NutrientChip(
                color: _Ck.protein,
                icon: Icons.egg_alt_outlined,
                label: zh ? '蛋白质' : 'Proteína',
                value: zh ? '适中' : 'Media',
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _NutrientChip(
                color: _Ck.fat,
                icon: Icons.water_drop_outlined,
                label: zh ? '脂肪' : 'Grasa',
                value: zh ? '适中' : 'Media',
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _NutrientChip(
                color: _Ck.veg,
                icon: Icons.eco_outlined,
                label: zh ? '蔬果' : 'Verdura',
                value: zh ? '良好' : 'Bien',
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Text(
          zh ? '食材明细' : 'Detalle de ingredientes',
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: _Ck.title,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(12, 4, 12, 4),
          decoration: BoxDecoration(
            color: _Ck.panel,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              for (var i = 0; i < items.length; i++) ...[
                if (i > 0) const Divider(height: 1, color: _Ck.line),
                _IngredientRow(item: items[i]),
              ],
              const Divider(height: 1, color: _Ck.line),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Row(
                  children: [
                    Text(
                      zh ? '总计' : 'Total',
                      style: const TextStyle(
                        fontFamily: 'Montserrat',
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        color: _Ck.title,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      '${kcal.toStringAsFixed(1)}kcal',
                      style: const TextStyle(
                        fontFamily: 'Montserrat',
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        color: _Ck.green,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        Text(
          zh ? '营养预估' : 'Estimación nutricional',
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: _Ck.title,
          ),
        ),
        const SizedBox(height: 8),
        _MacroGrid(protein: protein, carbs: carbs, fat: fat, zh: zh),
        const SizedBox(height: 10),
        _MacroBar(protein: protein, carbs: carbs, fat: fat),
        const SizedBox(height: 18),
        _ConfirmBlock(
          title: zh ? '请确认打卡' : 'Confirma el registro',
          subtitle: zh
              ? '请核对下面的数据，确认后才会正式记录。'
              : 'Revisa los datos; solo se guarda al confirmar.',
          buttonLabel: zh ? '确认打卡' : 'Confirmar',
          disclaimer: zh ? '〈内容由AI生成仅供参考〉' : '〈Contenido generado por IA〉',
          summary: zh
              ? '$name · ${kcal.toStringAsFixed(0)} kcal'
              : '$name · ${kcal.toStringAsFixed(0)} kcal',
          interactive: interactive,
          status: status,
          strings: strings,
          onConfirm: interactive
              ? () => onConfirm?.call(
                    draft.copyWith(
                      label: '$name · ${kcal.toStringAsFixed(0)} kcal',
                      rawFields: {
                        ...draft.rawFields,
                        'kcal': kcal.toStringAsFixed(0),
                        'protein': '$protein',
                        'carbs': '$carbs',
                        'fat': '$fat',
                        'value': name,
                      },
                    ),
                  )
              : null,
          onCancel: onCancel,
        ),
      ],
    );
  }
}

class _ExerciseConfirmCard extends StatelessWidget {
  const _ExerciseConfirmCard({
    required this.draft,
    required this.status,
    required this.interactive,
    required this.zh,
    required this.strings,
    this.onConfirm,
    this.onCancel,
  });

  final CheckInDraft draft;
  final CheckInCardStatus status;
  final bool interactive;
  final bool zh;
  final AppStrings strings;
  final CheckInConfirmCallback? onConfirm;
  final VoidCallback? onCancel;

  @override
  Widget build(BuildContext context) {
    final minutes = int.tryParse(draft.value) ?? 30;
    final kcal = int.tryParse(draft.rawFields['kcal'] ?? '') ??
        (minutes * 7.1).round();
    final activity = draft.rawFields['activity']?.isNotEmpty == true
        ? draft.rawFields['activity']!
        : (zh ? '运动' : 'Ejercicio');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _AnalysisHeader(
          title: zh ? 'AI运动分析' : 'Análisis de ejercicio IA',
          highlight: 'AI',
        ),
        const SizedBox(height: 10),
        Text(
          '$kcal kcal',
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: _Ck.green,
            height: 1.1,
          ),
        ),
        Text(
          zh ? '预估消耗' : 'Estimación de gasto',
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 12,
            color: _Ck.muted,
          ),
        ),
        const SizedBox(height: 14),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: _Ck.panel,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              _DetailRow(
                icon: Icons.directions_run_rounded,
                iconBg: const Color(0xFFE3F2FD),
                title: zh ? '运动类型' : 'Tipo',
                value: activity,
              ),
              const Divider(height: 20, color: _Ck.line),
              _DetailRow(
                icon: Icons.timer_outlined,
                iconBg: const Color(0xFFFFF3E0),
                title: zh ? '时长' : 'Duración',
                value: zh ? '$minutes 分钟' : '$minutes min',
              ),
              const Divider(height: 20, color: _Ck.line),
              _DetailRow(
                icon: Icons.local_fire_department_outlined,
                iconBg: const Color(0xFFFFEBEE),
                title: zh ? '热量消耗' : 'Calorías',
                value: '$kcal kcal',
                valueColor: _Ck.green,
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        _ConfirmBlock(
          title: zh ? '请确认运动打卡' : 'Confirma el ejercicio',
          subtitle: zh
              ? '请核对下面的数据，确认后才会正式记录。'
              : 'Revisa los datos; solo se guarda al confirmar.',
          buttonLabel: zh ? '确认打卡' : 'Confirmar',
          disclaimer: zh ? '〈内容由AI生成仅供参考〉' : '〈Contenido generado por IA〉',
          summary: zh
              ? '$activity · $minutes 分钟 · $kcal kcal'
              : '$activity · $minutes min · $kcal kcal',
          interactive: interactive,
          status: status,
          strings: strings,
          onConfirm: interactive
              ? () => onConfirm?.call(
                    draft.copyWith(
                      value: '$minutes',
                      label: '$activity · $minutes min · $kcal kcal',
                      rawFields: {
                        ...draft.rawFields,
                        'kcal': '$kcal',
                        'activity': activity,
                        'value': '$minutes',
                      },
                    ),
                  )
              : null,
          onCancel: onCancel,
        ),
      ],
    );
  }
}

class _SimpleConfirmCard extends StatelessWidget {
  const _SimpleConfirmCard({
    required this.draft,
    required this.status,
    required this.interactive,
    required this.zh,
    required this.strings,
    this.onConfirm,
    this.onCancel,
  });

  final CheckInDraft draft;
  final CheckInCardStatus status;
  final bool interactive;
  final bool zh;
  final AppStrings strings;
  final CheckInConfirmCallback? onConfirm;
  final VoidCallback? onCancel;

  @override
  Widget build(BuildContext context) {
    final typeLabel = switch (draft.type) {
      CheckInType.water => zh ? '喝水' : 'Agua',
      CheckInType.sleep => zh ? '睡眠' : 'Sueño',
      CheckInType.weight => zh ? '体重' : 'Peso',
      CheckInType.mood => zh ? '心情' : 'Ánimo',
      _ => draft.type.name,
    };
    final summary = draft.label.isNotEmpty
        ? draft.label
        : '${draft.value}${draft.unit.isNotEmpty ? ' ${draft.unit}' : ''}';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: _Ck.panel,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                typeLabel,
                style: const TextStyle(
                  fontFamily: 'Montserrat',
                  fontSize: 13,
                  color: _Ck.muted,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                summary,
                style: const TextStyle(
                  fontFamily: 'Montserrat',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: _Ck.green,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        _ConfirmBlock(
          title: zh ? '请确认打卡' : 'Confirma el registro',
          subtitle: zh
              ? '请核对下面的数据，确认后才会正式记录。'
              : 'Revisa los datos; solo se guarda al confirmar.',
          buttonLabel: zh ? '确认打卡' : 'Confirmar',
          disclaimer: zh ? '〈内容由AI生成仅供参考〉' : '〈Contenido generado por IA〉',
          summary: summary,
          interactive: interactive,
          status: status,
          strings: strings,
          onConfirm: interactive ? () => onConfirm?.call(draft) : null,
          onCancel: onCancel,
        ),
      ],
    );
  }
}

class _ConfirmBlock extends StatelessWidget {
  const _ConfirmBlock({
    required this.title,
    required this.subtitle,
    required this.buttonLabel,
    required this.disclaimer,
    required this.summary,
    required this.interactive,
    required this.status,
    required this.strings,
    this.onConfirm,
    this.onCancel,
  });

  final String title;
  final String subtitle;
  final String buttonLabel;
  final String disclaimer;
  final String summary;
  final bool interactive;
  final CheckInCardStatus status;
  final AppStrings strings;
  final VoidCallback? onConfirm;
  final VoidCallback? onCancel;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: _Ck.title,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          subtitle,
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 13,
            height: 1.4,
            color: _Ck.body,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          summary,
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 13,
            color: _Ck.muted,
          ),
        ),
        const SizedBox(height: 14),
        if (!interactive)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: _Ck.panel,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text(
              status == CheckInCardStatus.cancelled
                  ? strings.checkInCardCancelled
                  : strings.checkInCardApplied,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontFamily: 'Montserrat',
                fontWeight: FontWeight.w600,
                color: _Ck.muted,
              ),
            ),
          )
        else ...[
          SizedBox(
            width: double.infinity,
            height: 48,
            child: FilledButton(
              onPressed: onConfirm,
              style: FilledButton.styleFrom(
                backgroundColor: _Ck.green,
                foregroundColor: _Ck.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(999),
                ),
                textStyle: const TextStyle(
                  fontFamily: 'Montserrat',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
              child: Text(buttonLabel),
            ),
          ),
          const SizedBox(height: 8),
          Center(
            child: TextButton(
              onPressed: onCancel,
              style: TextButton.styleFrom(
                foregroundColor: _Ck.muted,
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text(
                strings.isZh ? '取消' : 'Cancelar',
                style: const TextStyle(
                  fontFamily: 'Montserrat',
                  fontSize: 13,
                ),
              ),
            ),
          ),
        ],
        const SizedBox(height: 10),
        Text(
          disclaimer,
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 11,
            color: _Ck.muted,
          ),
        ),
      ],
    );
  }
}

class _PickCard extends StatelessWidget {
  const _PickCard({
    required this.payload,
    required this.strings,
    this.onPick,
  });

  final ChatCardPayload payload;
  final AppStrings strings;
  final CheckInPickCallback? onPick;

  @override
  Widget build(BuildContext context) {
    final zh = strings.isZh;
    final interactive = payload.status == CheckInCardStatus.pending;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          zh ? '请选择要修改的记录' : 'Elige el registro a editar',
          style: const TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: _Ck.title,
          ),
        ),
        const SizedBox(height: 12),
        for (final c in payload.candidates)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Material(
              color: _Ck.panel,
              borderRadius: BorderRadius.circular(16),
              child: InkWell(
                onTap: interactive ? () => onPick?.call(c) : null,
                borderRadius: BorderRadius.circular(16),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: _Ck.greenSoft,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.restaurant_outlined,
                          color: _Ck.green,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              c.label.isNotEmpty ? c.label : c.value,
                              style: const TextStyle(
                                fontFamily: 'Montserrat',
                                fontWeight: FontWeight.w600,
                                fontSize: 14,
                                color: _Ck.title,
                              ),
                            ),
                            if (c.time.isNotEmpty)
                              Text(
                                c.time,
                                style: const TextStyle(
                                  fontFamily: 'Montserrat',
                                  fontSize: 12,
                                  color: _Ck.muted,
                                ),
                              ),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right, color: _Ck.muted),
                    ],
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _AnalysisHeader extends StatelessWidget {
  const _AnalysisHeader({required this.title, required this.highlight});

  final String title;
  final String highlight;

  @override
  Widget build(BuildContext context) {
    final idx = title.indexOf(highlight);
    if (idx < 0) {
      return Text(
        title,
        style: const TextStyle(
          fontFamily: 'Montserrat',
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: _Ck.title,
        ),
      );
    }
    return Text.rich(
      TextSpan(
        style: const TextStyle(
          fontFamily: 'Montserrat',
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: _Ck.title,
        ),
        children: [
          TextSpan(text: title.substring(0, idx)),
          WidgetSpan(
            alignment: PlaceholderAlignment.baseline,
            baseline: TextBaseline.alphabetic,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 1,
                  child: Container(height: 8, color: const Color(0xFFFFE082)),
                ),
                Text(
                  highlight,
                  style: const TextStyle(
                    fontFamily: 'Montserrat',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: _Ck.title,
                  ),
                ),
              ],
            ),
          ),
          TextSpan(text: title.substring(idx + highlight.length)),
        ],
      ),
    );
  }
}

class _NutrientChip extends StatelessWidget {
  const _NutrientChip({
    required this.color,
    required this.icon,
    required this.label,
    required this.value,
  });

  final Color color;
  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 10,
              color: color.withValues(alpha: 0.95),
              fontWeight: FontWeight.w600,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: _Ck.title,
            ),
          ),
        ],
      ),
    );
  }
}

class _MealItem {
  const _MealItem({
    required this.name,
    required this.amount,
    required this.kcal,
    required this.icon,
    required this.tint,
  });

  final String name;
  final String amount;
  final String kcal;
  final IconData icon;
  final Color tint;
}

List<_MealItem> _mealItems(CheckInDraft draft, {required bool zh}) {
  final name = draft.value.toLowerCase();
  if (name.contains('salad') || name.contains('ensalada') || name.contains('沙拉')) {
    return [
      _MealItem(
        name: zh ? '鸡胸肉' : 'Pechuga',
        amount: zh ? '约 120g' : '~120g',
        kcal: '180.0kcal',
        icon: Icons.set_meal_outlined,
        tint: const Color(0xFFFFE0B2),
      ),
      _MealItem(
        name: zh ? '混合蔬菜' : 'Verduras',
        amount: zh ? '约 150g' : '~150g',
        kcal: '60.0kcal',
        icon: Icons.eco_outlined,
        tint: const Color(0xFFC8E6C9),
      ),
      _MealItem(
        name: zh ? '橄榄油酱汁' : 'Aderezo',
        amount: zh ? '约 15ml' : '~15ml',
        kcal: '80.0kcal',
        icon: Icons.water_drop_outlined,
        tint: const Color(0xFFFFF9C4),
      ),
    ];
  }
  return [
    _MealItem(
      name: draft.value.isNotEmpty ? draft.value : (zh ? '餐食' : 'Comida'),
      amount: draft.time.isNotEmpty ? draft.time : (zh ? '1 份' : '1 porción'),
      kcal: '${draft.rawFields['kcal'] ?? '320'}kcal',
      icon: Icons.restaurant_outlined,
      tint: const Color(0xFFFFE0B2),
    ),
  ];
}

class _IngredientRow extends StatelessWidget {
  const _IngredientRow({required this.item});

  final _MealItem item;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: item.tint,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(item.icon, size: 20, color: _Ck.body),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  style: const TextStyle(
                    fontFamily: 'Montserrat',
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: _Ck.title,
                  ),
                ),
                Text(
                  item.amount,
                  style: const TextStyle(
                    fontFamily: 'Montserrat',
                    fontSize: 12,
                    color: _Ck.muted,
                  ),
                ),
              ],
            ),
          ),
          Text(
            item.kcal,
            style: const TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: _Ck.body,
            ),
          ),
        ],
      ),
    );
  }
}

class _MacroGrid extends StatelessWidget {
  const _MacroGrid({
    required this.protein,
    required this.carbs,
    required this.fat,
    required this.zh,
  });

  final int protein;
  final int carbs;
  final int fat;
  final bool zh;

  @override
  Widget build(BuildContext context) {
    Widget cell(String label, String value) {
      return Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: _Ck.panel,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontFamily: 'Montserrat',
                fontSize: 11,
                color: _Ck.muted,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(
                fontFamily: 'Montserrat',
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: _Ck.title,
              ),
            ),
          ],
        ),
      );
    }

    return Row(
      children: [
        Expanded(child: cell(zh ? '蛋白质' : 'Proteína', '${protein}g')),
        const SizedBox(width: 8),
        Expanded(child: cell(zh ? '碳水' : 'Carbos', '${carbs}g')),
        const SizedBox(width: 8),
        Expanded(child: cell(zh ? '脂肪' : 'Grasa', '${fat}g')),
      ],
    );
  }
}

class _MacroBar extends StatelessWidget {
  const _MacroBar({
    required this.protein,
    required this.carbs,
    required this.fat,
  });

  final int protein;
  final int carbs;
  final int fat;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(999),
      child: SizedBox(
        height: 8,
        child: Row(
          children: [
            Expanded(
              flex: protein <= 0 ? 1 : protein,
              child: Container(color: _Ck.protein),
            ),
            Expanded(
              flex: fat <= 0 ? 1 : fat,
              child: Container(color: _Ck.fat),
            ),
            Expanded(
              flex: carbs <= 0 ? 1 : carbs,
              child: Container(color: _Ck.veg),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({
    required this.icon,
    required this.iconBg,
    required this.title,
    required this.value,
    this.valueColor = _Ck.title,
  });

  final IconData icon;
  final Color iconBg;
  final String title;
  final String value;
  final Color valueColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: iconBg,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: _Ck.body, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 13,
              color: _Ck.muted,
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: valueColor,
          ),
        ),
      ],
    );
  }
}
