# Check-in Chat Cards Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox syntax.

**Goal:** Chat check-ins use editable bubble cards for confirm; modify uses two-phase match on today's records.

**Architecture:** Rule engine builds `CheckInDraft` → `ChatCardPayload` on `ChatMessage`; apply only on confirm (or high-confidence single edit). Intercept create/modify before `SunnyIntentRouter` immediate writes.

**Tech Stack:** Flutter, Riverpod, existing `TodayRecord` / `SunnyBubble`.

## Global Constraints

- Demo rule engine only (no LLM API)
- Today-only records; aggregate types are 0/1; meals are multi
- Confidence ≥ 0.8 for single-record auto-apply on edit
- es-MX / zh via AppStrings
- Branch: `cursor/checkin-chat-cards-a775`

---

### Task 1: Models + list/apply helpers

**Files:**
- Create: `mobile/lib/shared/models/check_in_chat.dart`
- Modify: `mobile/lib/shared/models/models.dart` (`MealLogEntry.id`, `ChatMessage.card`, `SunnyIntentResult.card`)
- Create: `mobile/lib/shared/services/list_today_check_ins.dart`
- Create: `mobile/lib/shared/services/check_in_apply.dart`
- Test: `mobile/test/check_in_apply_test.dart`

- [ ] Add check-in card models + MealLogEntry id
- [ ] List today records by type; apply create/edit drafts
- [ ] Unit tests for water create + meal edit
- [ ] Commit

### Task 2: Parser + chat flow

**Files:**
- Create: `mobile/lib/shared/services/check_in_intent_parser.dart`
- Create: `mobile/lib/shared/services/check_in_chat_flow.dart`
- Modify: `mobile/lib/shared/providers/app_providers.dart`
- Test: `mobile/test/check_in_chat_flow_test.dart`

- [ ] Parse create/modify slots (es/zh keywords)
- [ ] Flow: ask → confirm card; modify 0/1/many branches
- [ ] Wire `sendChatMessage` to prefer flow; no immediate write on create
- [ ] Commit

### Task 3: Card UI + bubble wiring

**Files:**
- Create: `mobile/lib/core/widgets/check_in_chat_cards.dart`
- Modify: `mobile/lib/core/widgets/ld_components.dart` (`SunnyBubble`)
- Modify: `mobile/lib/features/home/home_page.dart`
- Modify: `mobile/lib/features/chat/chat_page.dart` (if present)
- Modify: `mobile/lib/shared/l10n/app_strings.dart`

- [ ] Confirm + pick cards; SunnyBubble renders `message.card`
- [ ] Notifier: confirm / cancel / pick actions
- [ ] Strings es/zh
- [ ] Commit

### Task 4: Verify + ship

- [ ] `flutter test` relevant suites
- [ ] Push branch, PR, merge master for Pages
