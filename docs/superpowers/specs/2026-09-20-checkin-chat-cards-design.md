# Design — 聊天打卡确认 / 修改气泡卡片

> 日期：2026-09-20 · 产品：luckdate · 状态：实现中
> 分支：`cursor/checkin-chat-cards-a775`

## 目标

1. **新建打卡**：AI（演示规则引擎）识别基础信息 → 输出结构化数据 → 聊天气泡内可编辑确认卡 → 用户确认后才写入。  
2. **修改打卡**：两阶段意图识别；按类型/时间/数值匹配今日记录；0 / 1 / 多条分支分别追问、自信直改或选卡确认。  
3. 覆盖全量类型：喝水、睡眠、饮食、代餐/产品、体重、运动、心情。  
4. 仅作用于**今日**记录；不扩展多日历史明细存储。

## 决策摘要

| 项 | 决定 |
|----|------|
| 识别实现 | 演示规则引擎（关键词 + 正则），不接外部 LLM |
| 确认交互 | 气泡内嵌可编辑卡片（类型 / 时间 / 数值可改后再确认） |
| 修改范围 | 仅今日；聚合类视为 0/1 条；饮食可多条 |
| 单条自信阈值 | ≥ 0.8 直接改并回复完成；&lt; 0.8 出确认卡或追问 |
| 语言 | 卡片与追问文案跟随 `profile.language`（es-MX / zh） |
| 主入口 | `HomePage` Sunny 聊天（`/home`）；`ChatPage` 同步支持卡片回调 |

## 非目标

- 不接真实 LLM API（协议可后续替换）  
- 不做近 N 天历史流水账改造  
- 不把水/睡眠等聚合类改成 append 明细（本期仍 0/1）  
- 不改管理后台打卡列表结构（仍读现有 `TodayRecord`）

---

## 数据模型

### `CheckInType`

```text
water | sleep | meal | product | weight | exercise | mood
```

### `CheckInDraft`（结构化识别结果 / 卡片绑定数据）

| 字段 | 说明 |
|------|------|
| `type` | `CheckInType` |
| `time` | 可选 `HH:mm`；缺省用「现在」或类型默认 |
| `value` | 数值或标签（ml / hours / kg / minutes / meal name / mood tag） |
| `unit` | 展示用单位 |
| `label` | 人类可读摘要（双语生成） |
| `confidence` | 0–1，规则引擎估算 |
| `mode` | `create` \| `edit` |
| `targetId` | 编辑时指向记录 id（餐次用 `MealLogEntry` 稳定 id；聚合类用 `today:{type}`） |
| `rawFields` | 可编辑字段 map（供卡片表单） |

### `ChatMessage` 扩展

在现有 `text` / `actionLabels` / `suggestions` 上增加：

| 字段 | 说明 |
|------|------|
| `card` | 可选 `ChatCardPayload` |

### `ChatCardPayload`

```text
kind: check_in_confirm | check_in_pick
draft: CheckInDraft?          // confirm 卡
candidates: List<CheckInDraft>? // pick 多选卡
status: pending | confirmed | cancelled | applied
```

确认后将 `status` 置为 `confirmed`/`applied`，避免重复点击再写一次。

### 今日记录如何映射为「条」

| 类型 | 条数语义 | 可改字段 |
|------|----------|----------|
| water | 有 `hydrationMl>0` 则 1 条 | ml |
| sleep | `hasSleepRecord` 则 1 条 | hours、quality、bed/wake |
| weight | `weightRecorded` 则 1 条 | kg |
| exercise | `exerciseMinutes>0` 或 sessions>0 则 1 条 | minutes、kcal |
| mood | `moodTag` 非空则 1 条 | tag |
| product | `productTaken` 则 1 条 | taken + 关联 meal 摘要 |
| meal | `meals` 列表，每条一条 | name、time、kcal/macros |

---

## 流程

### A. 新建打卡（确认卡）

```text
用户输入
  → CheckInIntentParser.parseCreate(input, lang)
  → 缺 type / value（及类型必需字段）→ 追问气泡（无卡）
  → 字段齐全 → 生成 CheckInDraft(mode=create)
  → bot 消息：短文案 + check_in_confirm 卡（可编辑）
  → 用户改字段（可选）→ 点「确认」
  → ApplyCheckIn.apply(draft) → updateTodayRecord
  → 卡片 status=applied；追加一句「已记录…」
  → 点「取消」→ status=cancelled；不写库
```

**写入时机**：仅确认后；**禁止**识别后立即 `updateTodayRecord`（替换现有 create 路径的即时写入）。

### B. 修改打卡（两阶段）

**阶段 1 — 意图与槽位**

```text
识别 modify 意图（改、修改、纠正、cambiar、corregir…）
  + 抽 type / time / value
若任一关键槽位不清 → 追问（可带建议芯片）
槽位齐全 → 进入阶段 2
```

**阶段 2 — 匹配今日记录并二次「识别」**

```text
records = ListTodayCheckIns.byType(type)  // 可选 time 窗过滤
再跑 MatchCheckInRecord(records, draft) 打分排序
```

| 匹配结果 | 行为 |
|----------|------|
| 0 条 | 追问：今日无该类型记录；可建议「新建」 |
| 1 条且 confidence ≥ 0.8 | 直接 `apply` 修改 + 完成回复（无卡或仅结果文案） |
| 1 条且 confidence &lt; 0.8 | 出 `check_in_confirm`（预填旧值+新值），请用户确认 |
| ≥ 2 条 | 出 `check_in_pick` 候选卡列表 → 用户点选 → 再出 `check_in_confirm` 编辑新值 → 确认写入 |

饮食多条是主路径；聚合类通常走 0/1。

### C. 与现有路由衔接

- `SunnyIntentRouter`：打卡 create/modify 从「立即写入」改为走 `CheckInChatFlow`。  
- 非打卡意图（onboarding、客服、逛计划等）不变。  
- `sendQuickAction('water'|'meal'|'sleep'|…)` 也改为生成确认卡，而不是直接写。

---

## UI

### `CheckInConfirmCard`（气泡内）

- 标题：新建 / 修改 + 类型图标  
- 可编辑行：类型（下拉或芯片）、时间、数值（及类型相关附属字段）  
- 主按钮「确认」；次按钮「取消」  
- `status != pending` 时变为只读摘要（已确认 / 已取消）

### `CheckInPickCard`

- 列表：每条显示时间 + 摘要 + 数值  
- 点选一条 → 触发下一轮 confirm 卡消息

### 渲染位置

- `SunnyBubble`：若 `message.card != null`，在正文下渲染对应卡片。  
- `HomePage._onActionTap` / 新 `onCardAction` 回调写入 notifier。

视觉：延续 luckdate 象牙底 + 鼠尾草绿描边，**非**独立大卡片堆叠 Hero；作为气泡附属交互容器。

---

## 规则引擎要点

文件建议：

- `check_in_intent_parser.dart` — create/modify 槽位抽取与自信度  
- `check_in_chat_flow.dart` — 两阶段状态机  
- `check_in_apply.dart` — draft → `TodayRecord` 增量  
- `list_today_check_ins.dart` — 类型 → 伪记录列表  

自信度启发式（示例）：

- 明确数字 + 明确类型关键词 → 0.9  
- 仅类型、数值用默认（如 1 杯=250ml）→ 0.7  
- 模糊「改一下睡眠」无新值 → 不进入阶段 2，先追问  

---

## 国际化

`AppStrings` 增加卡片标题、确认/取消、追问模板、完成回复；es-MX / zh 同步。

---

## 测试

1. create：解析水/睡眠等 → 消息带 pending 卡；确认后 `hydrationMl` 等变化；取消不写。  
2. modify 0 条：追问。  
3. modify 1 条高自信：直接更新。  
4. modify 1 条低自信：出确认卡。  
5. modify 多条 meal：pick → confirm → 更新对应 `MealLogEntry`。  
6. 双语文案冒烟。  
7. 回归：onboarding / Messenger / 无方案路径不受影响。

---

## 实现顺序

1. 模型扩展 + apply/list helpers  
2. 解析器与 chat flow（替换即时写入）  
3. 卡片 UI + SunnyBubble / HomePage 接线  
4. 文案 + 单测  
5. 合入 master 部署 H5  

## 风险

| 风险 | 缓解 |
|------|------|
| 用户习惯「一说就记上」变慢 | 确认卡默认值已填好，一键确认；quick-ask 同样出卡 |
| 聚合类无法「改其中一次喝水」 | 本期明确只改当日总量；文案说明 |
| ChatPage 未接 action | 同步接 `card` 回调，避免双入口不一致 |
