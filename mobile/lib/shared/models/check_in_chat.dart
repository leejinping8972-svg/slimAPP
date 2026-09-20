/// Structured check-in drafts and chat card payloads (demo rule engine).
library;

enum CheckInType {
  water,
  sleep,
  meal,
  product,
  weight,
  exercise,
  mood,
}

enum CheckInCardKind { checkInConfirm, checkInPick }

enum CheckInCardStatus { pending, confirmed, cancelled, applied }

enum CheckInDraftMode { create, edit }

class CheckInDraft {
  const CheckInDraft({
    required this.type,
    required this.value,
    this.time = '',
    this.unit = '',
    this.label = '',
    this.confidence = 0.7,
    this.mode = CheckInDraftMode.create,
    this.targetId = '',
    this.rawFields = const {},
  });

  final CheckInType type;
  final String value;
  final String time;
  final String unit;
  final String label;
  final double confidence;
  final CheckInDraftMode mode;
  final String targetId;
  final Map<String, String> rawFields;

  CheckInDraft copyWith({
    CheckInType? type,
    String? value,
    String? time,
    String? unit,
    String? label,
    double? confidence,
    CheckInDraftMode? mode,
    String? targetId,
    Map<String, String>? rawFields,
  }) {
    return CheckInDraft(
      type: type ?? this.type,
      value: value ?? this.value,
      time: time ?? this.time,
      unit: unit ?? this.unit,
      label: label ?? this.label,
      confidence: confidence ?? this.confidence,
      mode: mode ?? this.mode,
      targetId: targetId ?? this.targetId,
      rawFields: rawFields ?? this.rawFields,
    );
  }
}

class ChatCardPayload {
  const ChatCardPayload({
    required this.kind,
    this.draft,
    this.candidates = const [],
    this.status = CheckInCardStatus.pending,
  });

  final CheckInCardKind kind;
  final CheckInDraft? draft;
  final List<CheckInDraft> candidates;
  final CheckInCardStatus status;

  ChatCardPayload copyWith({
    CheckInCardKind? kind,
    CheckInDraft? draft,
    List<CheckInDraft>? candidates,
    CheckInCardStatus? status,
  }) {
    return ChatCardPayload(
      kind: kind ?? this.kind,
      draft: draft ?? this.draft,
      candidates: candidates ?? this.candidates,
      status: status ?? this.status,
    );
  }

  bool get isInteractive => status == CheckInCardStatus.pending;
}
