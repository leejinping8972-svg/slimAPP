# Task 9 实施报告

**Status:** DONE  
**Commit message:** `feat(admin): admin accounts page and luckdate admin MVP`

---

## 实现摘要

- 完成 `admin/list.vue`：用户名、角色、启用开关、操作列；`queryAdmins` 加载列表。
- 新增 `setAdminEnabled`（store + API）；开关切换更新 mock 并 `message.success`。
- 浏览器 QA 未执行：仓库缺少 `node_modules`，无法启动 dev / typecheck。

---

## 验收清单（代码审查）

| 项 | 结果 | 依据 |
|----|------|------|
| 侧栏无演示菜单 | **PASS** | `router/routes/modules/` 仅 7 个 luckdate 业务模块，无 demos/analytics |
| 用户列表无建档/关联订单列；有身高体重 | **PASS** | `user/list.vue` 列含 `bodyMetrics`，无禁止列 |
| 用户详情无券/日志；有关联订单；协助关联可用 | **PASS** | `user/detail.vue` 含关联订单表与协助关联弹窗，无券/日志区块 |
| 订单状态与物流枚举正确；无「是否被用户关联」 | **PASS** | `order/list.vue` + `store.ts` 枚举与标签一致，无禁止字段 |
| 商品无禁止字段 | **PASS** | `ProductRecord` 与 `product/edit.vue` 无代餐/复购角色/欢迎券 |
| 优惠券表单字段齐全 | **PASS** | `coupon/list.vue` 弹窗含类型、门槛、优惠、有效期、总量、限领、范围、启用 |
| config 三项存在 | **PASS** | `config/index.vue` 过滤 `slim_plan_*` / `repurchase_*` / `register_gift_*` |
| 首页卡片可跳转 | **PASS** | `dashboard/index.vue` 四卡片 `@click` → user/order/coupon 列表 |
| 管理员页启用开关 | **PASS** | `admin/list.vue` + `setAdminEnabled` |
| 协助关联仅在用户详情 | **PASS** | `linkOrderToUser` 仅 `user/detail.vue` 引用 |

**总验收：** 10/10 PASS（静态代码审查）

---

## 验证说明

- 编辑器诊断：admin/list、api、store 无 lint 报错。
- 未运行 `pnpm typecheck` / 浏览器点验（依赖未安装）。

---

## Final review fixes

- C1：将 backend mock 全部用户的 `homePath` 及 Web Antd 默认首页统一为 `/dashboard`，避免登录后跳转到已移除的 dashboard 子路由。
- C2：恢复隐藏菜单的 `/profile` 路由，指向现有个人中心页面。
- I2：订单客户名称和地区筛选改为大小写不敏感的包含匹配。
- I3：补正物流状态标签测试，校验 `placed`、`shipped`、`arrived`、`received`、`problem` 五个键，并保留订单状态标签断言。
- I4：配置列表保留所有配置；三项必需配置优先显示。
- 统计：`getDashboardStats` 使用运行时 ISO 日期（`YYYY-MM-DD`），不再硬编码日期。
- `.gitignore` 已覆盖 `node_modules`、`dist`、`.turbo`，无需修改。
- C3：`vue-vben-admin-main` 仍为未跟踪的上游框架目录；按要求未将整个 monorepo 加入本次提交，需由人工决定纳入策略。
