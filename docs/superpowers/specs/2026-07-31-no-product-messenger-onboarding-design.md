# 无产品用户 Sunny 问卷 → Messenger

> 日期：2026-07-31  
> 范围：跳过关联订单（`UserPlanType.noProduct`）的注册后对话

## 目标

无产品用户跳过绑单后，Sunny 问卷改为：

1. **先了解健康需求**（减重 / 肠道 / 抗衰 / 能量 / 其他）  
2. **再采集基础信息**（隐私同意 → 年龄 → 身高 → 体重）  
3. **引导联系 Messenger 客服**（不做 App 内购、不推绑单开通）

已绑定方案产品的路径（`plan_offer` → 完整 slim 问卷 → Day1）**不变**。

## 步骤机（仅 noProduct）

```
health_need → privacy → age → height → weight → done (+ Messenger CTA)
```

跳过：`target` / `meal` / `reminder`（无产品无 28 天方案，不需要）。

## Messenger

- `AppConfig.messengerUrl`（默认 `https://m.me/luckdate`，可改）  
- CTA：`Hablar por Messenger`（兼容旧文案「Contactar servicio al cliente」）  
- Web：`window.open`；失败则弹窗展示链接

## 非目标

- 不改后台  
- 不恢复商城  
- 不强制无产品用户走绑单
