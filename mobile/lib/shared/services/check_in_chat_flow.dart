import '../models/models.dart';
import 'check_in_apply.dart';
import 'check_in_intent_parser.dart';
import 'list_today_check_ins.dart';

/// Two-phase create / modify check-in flow for Sunny chat (demo engine).
class CheckInChatFlow {
  static const highConfidence = 0.8;

  /// Pending slot-filling for incomplete modify/create turns.
  CheckInParseResult? pending;

  /// Returns null when [input] is not a check-in intent.
  SunnyIntentResult? handle({
    required String input,
    required TodayRecord today,
    required String language,
    CheckInDraft? pickedCandidate,
  }) {
    final zh = language == 'zh' || language.startsWith('zh');

    // User picked a candidate from a pick card → confirm editor.
    if (pickedCandidate != null) {
      final draft = pickedCandidate.copyWith(mode: CheckInDraftMode.edit);
      return SunnyIntentResult(
        reply: zh
            ? '已选中这条记录，请确认或修改后保存。'
            : 'Elegiste este registro. Confirma o edita antes de guardar.',
        intents: const ['check_in_edit_confirm'],
        card: ChatCardPayload(
          kind: CheckInCardKind.checkInConfirm,
          draft: draft,
        ),
      );
    }

    var parsed = CheckInIntentParser.parse(input, language: language);

    // Continue pending slot fill.
    if (pending != null && pending!.isCheckIn) {
      final merged = _mergePending(pending!, parsed, input, language);
      parsed = merged;
      if (merged.slotsComplete) {
        pending = null;
      }
    }

    if (!parsed.isCheckIn) return null;

    if (!parsed.slotsComplete) {
      pending = parsed;
      return SunnyIntentResult(
        reply: _askMissing(parsed, zh: zh),
        intents: [
          parsed.isModify ? 'check_in_modify_ask' : 'check_in_create_ask',
        ],
        actionLabels: _askChips(parsed, zh: zh),
      );
    }

    pending = null;
    final draft = parsed.draft!;

    if (parsed.isModify) {
      return _handleModify(today, draft, zh: zh);
    }
    return _handleCreate(draft, zh: zh);
  }

  SunnyIntentResult _handleCreate(CheckInDraft draft, {required bool zh}) {
    return SunnyIntentResult(
      reply: zh
          ? '我识别到一次打卡，请确认卡片中的信息（可直接修改字段）。'
          : 'Detecté un registro. Confirma la tarjeta (puedes editar los campos).',
      intents: const ['check_in_create_confirm'],
      card: ChatCardPayload(
        kind: CheckInCardKind.checkInConfirm,
        draft: draft.copyWith(mode: CheckInDraftMode.create),
      ),
    );
  }

  SunnyIntentResult _handleModify(
    TodayRecord today,
    CheckInDraft draft, {
    required bool zh,
  }) {
    final records = ListTodayCheckIns.byType(today, draft.type);
    if (records.isEmpty) {
      pending = CheckInParseResult(
        isModify: false,
        type: draft.type,
        draft: CheckInDraft(
          type: draft.type,
          value: draft.value,
          unit: draft.unit,
          time: draft.time,
          mode: CheckInDraftMode.create,
          rawFields: draft.rawFields,
          confidence: draft.confidence,
          label: draft.label,
        ),
        missing: draft.value.isEmpty && draft.type != CheckInType.product
            ? const ['value']
            : const [],
        confidence: draft.confidence,
      );
      return SunnyIntentResult(
        reply: zh
            ? '今天还没有「${_typeName(draft.type, zh: true)}」记录。要新建一条吗？'
            : 'Hoy no hay registros de ${_typeName(draft.type, zh: false)}. ¿Quieres crear uno?',
        intents: const ['check_in_modify_empty'],
        actionLabels: zh
            ? const ['新建打卡', '取消']
            : const ['Crear registro', 'Cancelar'],
      );
    }

    if (records.length == 1) {
      // Single record of this type today → identity is certain; use draft confidence.
      final matched = draft.confidence >= highConfidence
          ? draft.confidence
          : _scoreMatch(records.first, draft);
      final merged = records.first.copyWith(
        value: draft.value.isNotEmpty ? draft.value : records.first.value,
        time: draft.time.isNotEmpty ? draft.time : records.first.time,
        unit: draft.unit.isNotEmpty ? draft.unit : records.first.unit,
        label: draft.label.isNotEmpty ? draft.label : records.first.label,
        confidence: matched,
        mode: CheckInDraftMode.edit,
        targetId: records.first.targetId,
        rawFields: {...records.first.rawFields, ...draft.rawFields},
      );

      if (matched >= highConfidence) {
        final updated = CheckInApply.apply(today, merged);
        return SunnyIntentResult(
          reply: zh
              ? '已更新今日${_typeName(draft.type, zh: true)}：${merged.label}。'
              : 'Actualicé ${_typeName(draft.type, zh: false)} de hoy: ${merged.label}.',
          intents: const ['check_in_modify_applied'],
          todayUpdates: updated,
        );
      }

      return SunnyIntentResult(
        reply: zh
            ? '找到一条记录，但把握还不够高，请确认后再保存。'
            : 'Encontré un registro, pero no estoy segura del todo. Confirma antes de guardar.',
        intents: const ['check_in_edit_confirm'],
        card: ChatCardPayload(
          kind: CheckInCardKind.checkInConfirm,
          draft: merged,
        ),
      );
    }

    // Multiple — pick card (meals).
    final ranked = [...records]..sort(
        (a, b) => _scoreMatch(b, draft).compareTo(_scoreMatch(a, draft)),
      );
    return SunnyIntentResult(
      reply: zh
          ? '找到多条${_typeName(draft.type, zh: true)}记录，请选择要修改的一条：'
          : 'Hay varios registros de ${_typeName(draft.type, zh: false)}. Elige cuál editar:',
      intents: const ['check_in_modify_pick'],
      card: ChatCardPayload(
        kind: CheckInCardKind.checkInPick,
        candidates: ranked
            .map(
              (r) => r.copyWith(
                mode: CheckInDraftMode.edit,
                value: draft.value.isNotEmpty ? draft.value : r.value,
                rawFields: {...r.rawFields, ...draft.rawFields},
              ),
            )
            .toList(),
      ),
    );
  }

  double _scoreMatch(CheckInDraft record, CheckInDraft query) {
    var score = 0.55;
    if (query.time.isNotEmpty && record.time == query.time) score += 0.35;
    if (query.value.isNotEmpty &&
        record.value.toLowerCase() == query.value.toLowerCase()) {
      score += 0.25;
    } else if (query.value.isNotEmpty &&
        record.label.toLowerCase().contains(query.value.toLowerCase())) {
      score += 0.15;
    }
    if (query.time.isEmpty && query.value.isNotEmpty) score += 0.1;
    return score.clamp(0.0, 1.0);
  }

  CheckInParseResult _mergePending(
    CheckInParseResult pending,
    CheckInParseResult next,
    String input,
    String language,
  ) {
    final type = next.type ?? pending.type;
    if (type == null) return pending;
    // Re-parse with combined context hint.
    final combined = '${type.name} $input';
    final re = CheckInIntentParser.parse(combined, language: language);
    return CheckInParseResult(
      isModify: pending.isModify || re.isModify,
      type: type,
      draft: (re.draft ?? pending.draft)?.copyWith(
        type: type,
        mode: pending.isModify ? CheckInDraftMode.edit : CheckInDraftMode.create,
      ),
      missing: re.missing,
      confidence: re.confidence,
    );
  }

  String _askMissing(CheckInParseResult parsed, {required bool zh}) {
    if (parsed.missing.contains('type')) {
      return zh
          ? '你想修改哪种打卡？喝水、睡眠、饮食、体重、运动、心情或代餐。'
          : '¿Qué tipo de registro quieres modificar? Agua, sueño, comida, peso, ejercicio, ánimo o batido.';
    }
    if (parsed.isModify) {
      return zh
          ? '请告诉我新的数值（以及时间，如果有）。'
          : 'Dime el nuevo valor (y la hora, si aplica).';
    }
    return zh
        ? '还差一点信息，请补充数值或时间。'
        : 'Me falta un dato: comparte el valor o la hora.';
  }

  List<String> _askChips(CheckInParseResult parsed, {required bool zh}) {
    if (parsed.missing.contains('type')) {
      return zh
          ? const ['喝水', '睡眠', '饮食', '体重']
          : const ['Agua', 'Sueño', 'Comida', 'Peso'];
    }
    if (parsed.type == CheckInType.water) {
      return zh ? const ['250 ml', '500 ml'] : const ['250 ml', '500 ml'];
    }
    if (parsed.type == CheckInType.sleep) {
      return const ['7 h', '8 h', '6 h'];
    }
    return const [];
  }

  static String _typeName(CheckInType type, {required bool zh}) {
    if (zh) {
      return switch (type) {
        CheckInType.water => '喝水',
        CheckInType.sleep => '睡眠',
        CheckInType.meal => '饮食',
        CheckInType.product => '代餐',
        CheckInType.weight => '体重',
        CheckInType.exercise => '运动',
        CheckInType.mood => '心情',
      };
    }
    return switch (type) {
      CheckInType.water => 'agua',
      CheckInType.sleep => 'sueño',
      CheckInType.meal => 'comida',
      CheckInType.product => 'batido',
      CheckInType.weight => 'peso',
      CheckInType.exercise => 'ejercicio',
      CheckInType.mood => 'ánimo',
    };
  }
}
