# luckdate（ChatViva Slim）APP 功能交互说明（完整版）

> 本文描述用户可见的功能与交互，不涉及技术实现。  
> 第一部分为**核心流程**（新用户开通与日常使用主线）；第二部分为**全功能交互清单**（各页面与状态细节）。  
> 界面文案为英文；本说明为简体中文。以当前 Demo / H5 可点通路径为准。

---

## 第一部分：核心流程

### 1. 产品目标与闭环

luckdate 以 **Sunny（活力助手）** 为核心，围绕以下闭环组织体验：

1. 新用户进入并完成基础引导  
2. 用户具备产品资格后开启 Slim 方案  
3. 每日在 Ritual / Sunny 中完成记录与反馈  
4. 在 Plan 查看进度并持续执行

**核心原则：用户需要先有产品，才能开始 28 天方案。**

### 2. 主导航

登录后进入主壳，底部包含 5 个入口：

| 入口 | 说明 |
|------|------|
| **Sunny** | 全屏对话与记录（无底栏） |
| **Ritual** | 每日活力与打卡总览 |
| **Plan** | 方案进度与解锁入口 |
| **Mall** | 商品浏览与购买 |
| **Me** | 个人中心、订单与提醒 |

Ritual / Plan / Mall / Me 保留底栏；Sunny 以独立全屏页打开。

### 3. 新用户主路径

```
开屏（约 2 秒）
  → 引导页（品牌视频背景）
  → Start My Journey
  → Sunny 介绍（固定 3 页，非对话）
  → 注册
  → 关联订单（可 Skip）
  → Sunny 新手问答（对话建档）
  → 主壳（Ritual / Plan / Mall / Me）
```

**各环节说明：**

| 环节 | 用户操作 | 结果 |
|------|----------|------|
| 开屏 | 等待约 2 秒 | 同页切换为引导内容 |
| 引导页 | `Start My Journey` | 进入 Sunny 介绍 |
| 引导页 | `Log in` | 进入登录 |
| Sunny 介绍 | 滑动 3 页后继续 | 进入注册；可 Skip intro 跳过 |
| 注册 | `Create account` | 进入关联订单（同时获得 $5 欢迎券） |
| 关联订单 | 绑定成功（Solar Protein） | 进入产品介绍，**立即开通 Day 1** |
| 关联订单 | `Skip for now` | 无产品，进入 Sunny 问答 |
| 产品介绍 | `Continue with Sunny` | 进入 Sunny 新手问答 |
| Sunny 问答 | 完成隐私→年龄→身高→体重→目标→餐次→提醒 | 进入主壳；已开通方案时 Sunny **主动引导 Day 1 打卡** |

### 4. 回访用户路径

```
引导页 → Log in → Sign in → Ritual 主页面
```

演示登录身份视为已完成引导，可直接使用主壳全部功能。

### 5. 方案开通两条链路

#### 链路 A：订单绑定 → 直接 Day 1

适用：用户已在外部渠道购买，可提供订单号。

1. 在 `Link Order` / Me 的 Orders 输入订单信息  
2. 识别为 Solar Protein（代餐方案产品）  
3. **立即开通** 28 天方案，进入 Day 1  

#### 链路 B：APP 内购买 → 确认收货后 Day 1

适用：用户在 Mall 内购买 Solar Protein。

1. 商品详情 `Buy Now` 完成购买  
2. 进入「待确认收货」，方案**暂不开始**  
3. 在 Plan / Me / 计划介绍页点击 `Confirm Receipt`  
4. 确认后正式开通 Day 1  

**要点：购买成功 ≠ 方案立即开始。**

### 6. Plan 页三种核心状态

| 状态 | 用户看到 | 主要操作 |
|------|----------|----------|
| **未开通（无产品）** | 购买与关联订单引导 | Buy Product / Provide Order Number |
| **待确认收货** | Waiting for delivery | Confirm Receipt & Start Plan |
| **已开通（进行中）** | Day x / 28、今日任务、阶段信息 | 查看详情、完成任务 |

### 7. 日常使用（开通后）

1. **Ritual** — 查看活力分、趋势、今日聚焦、打卡入口  
2. **Sunny** — 喝水 / 饮食 / 睡眠 / 运动等自然语言记录  
3. **Plan** — 查看 28 天进度与当日仪式任务  
4. **Me** — 订单、会员、提醒、成就  

### 8. 端到端验收路径

**路径 A（订单绑定）**  
开屏 → 引导 → Sunny 介绍 → 注册 → 关联订单成功 → 产品介绍 → Sunny 问答 → Sunny 引导 Day 1 打卡

**路径 B（内购确认收货）**  
开屏 → 引导 → Sunny 介绍 → 注册 → Skip 订单 → Sunny 问答 → Mall 购买 → 待收货 → Confirm Receipt → Day 1

**路径 C（回访）**  
引导 → 登录 → Ritual → Plan 查看进行中方案

---

## 第二部分：全功能交互说明

### 9. 访问与身份规则

| 身份 / 状态 | 用户体感 |
|-------------|----------|
| **访客** | 仅可访问开屏、引导、Sunny 介绍、登录、注册、关联订单 |
| **新注册用户** | 完成 Sunny 问答前以聊天引导为主；方案是否开通取决于产品资格 |
| **回访用户（演示登录）** | 引导已完成，直接进入 Ritual，含 Day 12 演示数据 |
| **无产品** | 基础追踪；Plan 显示购买引导 |
| **非代餐产品** | 产品每日提醒；无完整 28 天里程碑 |
| **代餐 28 日（已开通）** | 完整 Slim Journey；双提醒；Ritual / Plan 全功能 |
| **待确认收货** | 已购未收货；多处可确认收货后开启 Day 1 |

**访问约束：**

- 访客须先在引导页点击 `Start My Journey` 或 `Log in`，才能进入注册/登录  
- 访客不能直接访问 Ritual、Plan、Mall、Me、Sunny 聊天  
- 须看完 Sunny 介绍后才能进入注册  
- 已登录且引导完成后，再访问开屏/登录/注册会自动跳转到 Ritual 或 Sunny 聊天  

---

### 10. 启动与引导页

#### 10.1 开屏

- 全屏生活方式画面，约 **2 秒**不可点击  
- 结束后**同一页面**切换为引导内容  

#### 10.2 引导页（Guide）

**呈现：**

- 全屏循环视频背景（加载前可短暂显示静态图）  
- 品牌 Logo、超级符号  
- 主标语：Feel Alive. Meet luckdate.  
- 玻璃卡片：Every Great Day Starts with One Small Ritual.  
- 主按钮 `Start My Journey`、次按钮 `Log in`  
- 底部 4 个分页圆点（示意）  

**操作：**

| 操作 | 结果 |
|------|------|
| Start My Journey | 进入 Sunny 介绍 |
| Log in | 进入登录 |

---

### 11. Sunny 固定介绍

**路径：** 注册前必经的 3 页横向滑动介绍（非对话）。

| 页次 | 内容 |
|------|------|
| 1 | Sunny 自我介绍：Daily Rituals、Vitality Dashboard、Scientific Formula、Community、Health Mall |
| 2 | Luckdate Slim 产品体系：七大活力系列 |
| 3 | 28 日旅程说明：注册后关联订单、3–5 个核心问题、个性化计划 |

**操作：**

- 第 2、3 页可返回上一页  
- `Continue` / 最后一页 `Create my account` → 注册  
- `Skip intro`（非最后一页）→ 直接注册  

---

### 12. 登录与注册

#### 12.1 登录

- 展示欢迎头区与邮箱/密码表单（演示环境无真实校验）  
- **Sign in** → 以回访演示身份进入 Ritual  
- 底部可切换注册  

#### 12.2 注册

- 展示 Join us 品牌头区与注册表单  
- **Create account** → 关联订单页（同时发放 $5 欢迎券，30 天有效）  
- 返回 → Sunny 介绍  
- 底部可切换登录  

#### 12.3 注册成功礼券（旁路页）

- 展示 $5 欢迎券 → `Continue to link order` 进入关联订单  
- 当前主路径注册后直接进入关联订单，此页为历史旁路  

---

### 13. 关联订单

**输入：** 订单号、手机后 4 位（部分演示关键词可省略手机校验）

| 用户输入 / 操作 | 结果 |
|-----------------|------|
| 含 meal / solar / 代餐等语义 | 关联 Solar Protein → **代餐方案，立即 Day 1** |
| 含 other / supplement 等 | 关联非代餐产品 → 产品护理提醒型计划 |
| 演示单号 `ORD-2026-MEAL` + 手机 `1234` | 关联代餐 28 天 |
| 演示单号 `ORD-2026-VITA` + 手机 `5678` | 关联非代餐产品 |
| 校验失败 | 弹窗提示；可重试或 Continue 跳过 |
| **Skip for now** | 保持无产品，进入 Sunny 问答 |

绑定成功后 Snackbar 提示产品名称；新用户继续 Sunny 问答，已完成引导的用户返回上一页。

---

### 14. Sunny 新手问答（对话引导）

新用户在关联/跳过订单后进入 **Sunny AI Chat**，以对话完成建档。

#### 14.1 引导步骤

| 步骤 | 内容 | 说明 |
|------|------|------|
| 隐私 | 需回复同意（如 I agree） | 不同意无法继续 |
| 年龄 | 18–34 / 35–50 / 51–64 / 65+ / Under 18 | Under 18 安全拦截 |
| 身高 | cm 数值 | |
| 体重 | kg 数值 | 系统推荐目标体重 |
| 目标体重 | 数字或 use recommended | |
| 餐次 | breakfast / lunch / dinner / not sure | |
| 提醒 | 如 08:00 | 代餐用户另有晚间提醒 |

快捷回复条随当前问题切换。

#### 14.2 问答完成

- Sunny 展示 **28 天计划说明卡**（四阶段：Launch → Adaptation → Stability → Completion）  
- 行动按钮：`Start Day 1 Ritual`、`View My Plan`  
- **若已开通代餐方案**：追加 Day 1 仪式引导消息，含 `Go to Ritual` / `Log Water` / `Log Meal` / `Log Sleep`  

#### 14.3 日常聊天（引导完成后）

**界面元素：**

- 顶栏：Sunny AI Chat、返回、更多菜单（占位）  
- Sunny 介绍卡 + Learn about Sunny  
- 聊天气泡（流式打字效果）  
- 「You might want to ask」快捷语  
- 输入框 + 生活方式免责声明  

**常见记录意图：**

| 用户表达（示意） | 产品结果 |
|------------------|----------|
| 喝水 / hydration | 累计今日饮水 |
| 运动 / 瑜伽等 | 记入活动与消耗估算 |
| 用餐 / 沙拉等 | 记一餐并估算营养 |
| 睡眠 | 记录睡眠信息 |
| 代餐 / 蛋白粉 | 记入产品使用 |
| 体重 | 标记已记录 |
| 情绪、聚餐担心等 | 安慰或调整向回复 |
| 孕哺 / 自伤等高风险 | 安全向回复 |

**聊天内行动按钮：**

- View Detailed Plan / View My Plan → Plan  
- Go to Ritual / Start Day 1 Ritual → Ritual  
- Log Water / Log Meal / Log Sleep → 快捷打卡  

**第 28 天提醒（代餐且未看过报告）：**

- 弹窗：`View report` → 第 28 天报告；`Not now` 关闭  

---

### 15. Ritual（活力仪式主页）

**用途：** 综合活力分、维度拆解、趋势、今日聚焦与打卡入口。

#### 15.1 时间范围

顶部分段：**Today** / **28 Days** / **56 Days** / **84 Days**

#### 15.2 模块与操作

| 模块 | 内容 | 操作 |
|------|------|------|
| 综合活力分 | 总分环、标签、较昨日升降 | — |
| Score Insights | 洞察入口 | → Sunny 建议卡 |
| 六维评分 | Nutrition / Exercise / Mindfulness / Sleep / Hydration / Habits | Habits 可点 → Sunny 聊天 |
| Score Trend | 折线趋势图 | 切换时间范围 |
| Today's Focus | 轮播主题 | View Focus Plan → 建议卡 |
| Check-in Record | 打卡入口 | → 打卡记录页 |
| 近几日一致性日历 | 近期完成态 | 点某日 → 当日详情 sheet |
| 体重趋势 | 有数据时展示 | — |
| Share | 分享条 | 占位 |

左上角返回 → Sunny 聊天。

---

### 16. Plan（计划）

三个页签：**In Progress** / **Plan Library** / **My Plans**

#### 16.1 In Progress

**A. 待确认收货**

- 文案：Waiting for delivery  
- `Confirm Receipt & Start Plan` → 开通 Day 1  
- `View Plan Overview` → 计划介绍页  

**B. 代餐 28 日（进行中）**

- Hero：计划名称、Day x / 28、里程碑节点  
- Plan Details → 第 28 天报告  
- **今日任务（可点开打卡 sheet）：**  
  - Weight Check-in  
  - Nutritional Meal  
  - Drink Water  
  - Sleep Wind-down  
- **阶段叙事：** Kickstart → Adaptation → Improvement → Consolidation  
- Plan Tools（饮食指南 / 训练视频 / 冥想音频等）为展示型入口  

**C. 无产品**

- 引导购买 Solar Protein  
- `Buy Product` → 商品详情  
- `Provide Order Number` → 关联订单  
- `Browse Mall` / `Dismiss`  

**D. 非代餐产品关怀**

- Product Care：提醒时间、今日是否服用  
- 可引导升级至完整 Slim Journey（进入商城）  

#### 16.2 Plan Library

- Kickstart 等计划卡 → 商品详情  
- Browse Mall → 商城  

#### 16.3 My Plans

- 有进行中代餐计划：显示卡片 → 切回 In Progress  
- 无计划：空状态说明  

---

### 17. Mall（商城）

#### 17.1 列表

- 头图与搜索框（只读示意）  
- 未使用欢迎券时显示提示横幅  
- **系列筛选：** All、Slim / Beauty / Healthy Aging / Women's / Mind / Energy / Daily Vitality  
- 双列商品卡 → 商品详情  

演示商品含：Solar Protein、Youth Solar、Longevity Solar、Sun Femme、Recovery Night、Active Boost、Daily Vital 等。

旅程 Day ≥ 28 时可出现「下一程方向」芯片（More Energy / Femme Balance / Better Sleep）→ 点击提示 Coming soon。

#### 17.2 商品详情

- 轮播英雄区、价格/会员价、收藏  
- 规格（28/56/试装）、口味选择  
- 服务条、成分、用法、警示  
- 底部：Add to Cart、Buy Now  

**Buy Now 行为：**

| 用户状态 | 结果 |
|----------|------|
| 无产品 + Solar Protein | 模拟购买成功 → 计划介绍页（待确认收货） |
| 待确认收货 + Solar Protein | → 计划介绍页 |
| 其他 | 演示占位提示 |

Add to Cart → 本地数量 +1 + Snackbar。

---

### 18. 计划介绍页（Plan Intro）

- 展示 28 天四阶段与每日要做事项  
- **待确认收货：** `Confirm Receipt & Start Plan` → Ritual  
- **其他：** `Go to Ritual`  

---

### 19. Sunny 建议卡

**入口：** Ritual 洞察、Focus Plan、聊天行动、打卡 Tip 等。

**页面结构：**

- 日期 + Journey Day  
- 当日主题横幅  
- Focus Enhancement Plan：若干建议任务 + Complete  
- Today's Tip、每日金句  
- 「是否有帮助」五档反馈（仅本地选中）  

Complete → 多数返回 Ritual。主题为固定演示内容。

---

### 20. 打卡记录（Check-in Record）

- 日期前后切换（**仅今天有完整活数据**，历史日为空态）  
- 摄入总览、运动、睡眠、餐列表、饮水杯数、营养分析  
- 可调整卡路里 / 运动目标  
- `Log via Sunny Chat` → Sunny 聊天  
- Tip → 建议卡  

---

### 21. Me（个人中心）

| 区域 | 内容与操作 |
|------|------------|
| 头部 | 昵称、Vitality Member、计划状态副标题 |
| 活力摘要 | 日分、Ritual%/Consistency%、会员到期 |
| Quick Menu | Check-in Record、Orders、Coupons、Reminders、Mall、Plan |
| 待收货 | 有内购待确认时显示 Confirm Receipt 卡片 |
| Membership / Journey | 计划名称；代餐时显示阶段与 Day |
| Settings | Units / Language（展示）、Reminders、Privacy |
| Orders & Achievements | 关联订单号、徽章、券剩余天数 |
| Mall 入口 | Additional Nutrition → 商城 |

#### 21.1 提醒设置

- 代餐用户：早 / 晚两个提醒时间  
- 其他：单一 Daily reminder  
- 选择时间后 Save  

---

### 22. 第 28 天报告

**入口：** Plan 详情、聊天 Day 28 弹窗等。

**内容：** 完成度、活跃天数、活力变化、Sunny 寄语。

**操作：** Explore Next Journey → 商城；Not now → 返回。

---

### 23. 旧版表单引导（旁路）

多步表单：欢迎 → 隐私 → 画像 → 餐次 → 提醒 → Ready。

当前新用户主路径已改为 Sunny 对话引导；此页主要通过 Debug「Restart Onboarding」触达，正常完成引导后访问会被重定向。

---

### 24. 演示与占位说明

便于评审区分「已实现」与「仅占位」：

#### 24.1 演示 / Mock 行为

| 项目 | 说明 |
|------|------|
| 登录 / 注册 | 无真实账号后端；任意邮箱密码可登录 |
| 演示登录身份 | 已关联代餐订单，Day 12 旅程数据 |
| 欢迎券 | 注册自动发放 $5 / 30 天 |
| 订单关联 | 关键词或固定演示单号 |
| Sunny 聊天 | 规则引擎 + 流式打字；营养为 AI 估算 |
| 商品购买 | Solar Protein 模拟成功，进入待收货流程 |
| 历史打卡日 | 仅今天有完整数据 |

#### 24.2 占位 / 无响应交互

| 位置 | 表现 |
|------|------|
| Sunny 聊天右上角「更多」 | 无反应 |
| Ritual / 建议卡 / 商品详情「分享」 | 无反应 |
| Plan 顶栏日历、Plan Tools 卡片 | 无深层页 |
| 商城搜索框 | 只读 |
| Next Journey 芯片 | Coming soon 提示 |
| 商品详情客服、购物车图标 | 无反应 |
| Profile Quick Menu「Coupons」 | 无反应 |
| Units / Language | 不可编辑 |
| 建议卡反馈表情 | 仅本地高亮 |

---

## 第三部分：文档维护

- 本文档跟随**当前可点通交互**更新；产品文案或路径调整时，以实际 App / H5 验收为准同步修订。  
- 《核心流程版》侧重开通主线与验收路径；本文档为全量功能交互参考。  
- 不描述接口、状态存储、组件命名等实现细节。

---

*文档更新日期：2026-07-16*
