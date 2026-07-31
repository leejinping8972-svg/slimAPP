# 去掉电商并闭环前后台 — Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox syntax.

**Goal:** Remove mall/order/coupon surfaces; keep external order-bind activation; rebuild admin IA with check-ins and plan board.

**Architecture:** Flutter APP drops commerce routes/UI; binding checks config product IDs. Static admin (`luckdate-admin-web`) and vben routes rebuilt to new menus. Docs updated to match.

**Tech Stack:** Flutter (mobile), Vue static admin preview, markdown rules docs.

## Global Constraints

- UI copy for APP remains Mexican Spanish (es-MX)
- Admin UI remains Chinese
- No activation codes
- Day28: report + encouragement only
- No order/product/coupon admin modules

---

### Task 1: APP remove commerce + bind-only activation

**Files:** `mobile/lib/app/router.dart`, `ld_shell.dart`, `collection/**`, `profile_page.dart`, `journey_page.dart`, `app_providers.dart`, related mocks

- [x] Remove mall tab and routes
- [x] Remove purchase/coupon UI paths
- [x] Keep link-order; gate plan on product ID match
- [x] Day28 remove buy CTAs
- [x] Commit

### Task 2: Admin rebuild IA

**Files:** `luckdate-admin-web/*`, optionally `vue-vben-admin-main/apps/web-antd` luckdate modules

- [x] New menus: admins/roles, users/check-ins, plans board+table, system config
- [x] Remove product/order/coupon pages
- [x] Commit

### Task 3: Docs

- [x] Update `规则-管理后台.md`,开通规则,索引,交互说明要点
- [x] Commit

### Task 4: Verify + PR

- [x] Smoke/analyze where feasible
- [x] Push + ManagePullRequest
