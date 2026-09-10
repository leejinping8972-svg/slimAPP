import type { CartItem } from '@/context/CartContext';
import type { CouponEvalResult, UserCoupon } from './types';

function parseYmd(d: string): number {
  const [y, m, day] = d.split('-').map((x) => Number(x));
  return Date.UTC(y, m - 1, day);
}

function todayUtcYmd(): string {
  const n = new Date();
  const y = n.getUTCFullYear();
  const m = String(n.getUTCMonth() + 1).padStart(2, '0');
  const d = String(n.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 获取今天的 UTC 时间戳（秒） */
function nowUtcSec(): number {
  return Math.floor(Date.now() / 1000);
}

function cartSubtotal(items: CartItem[]): number {
  return items.reduce((s, it) => s + it.price * it.quantity, 0);
}

function cartProductIds(items: CartItem[]): Set<number> {
    return new Set(items.map((i) => i.id));
}

/**
 * 计算优惠券可作用的商品金额（区分 3 种商品范围）
 *
 * - 全场券（productScope='all'）：所有商品总价
 * - 指定商品券（productScope='specific'）：仅 productIds 中匹配的商品总价
 * - 整单计算券（productScope='conditional_all'）：
 *     购物车必须包含指定商品才能使用，但折扣按整单总价计算
 */
function eligibleSubtotal(coupon: UserCoupon, items: CartItem[]): number {
    if (coupon.productScope === 'all') return cartSubtotal(items);
    if (coupon.productScope === 'conditional_all') return cartSubtotal(items);
    // specific: 只算匹配商品
    const scopeIds = new Set(coupon.productIds ?? []);
    return items.reduce((s, it) => s + (scopeIds.has(it.id) ? it.price * it.quantity : 0), 0);
}

/**
 * 检查购物车是否满足商品范围要求（3 种范围）
 *
 * - all: 始终通过
 * - specific: 购物车必须包含至少一个匹配商品
 * - conditional_all: 购物车必须包含至少一个匹配商品（门槛/折扣用整单总价）
 */
function isProductScopeOk(coupon: UserCoupon, items: CartItem[]): boolean {
    if (coupon.productScope === 'all') return true;
    const ids = cartProductIds(items);
    return coupon.productIds.some((pid) => ids.has(pid));
}

/**
 * 检查优惠券是否已过期
 *
 * 后端支持两种有效期类型（对齐 OrderLogic::applyCoupon）：
 *   valid_type=1 (FIXED_DATE_RANGE): 固定日期范围 → 使用 validFrom ~ validUntil
 *   valid_type=2 (RELATIVE_DAYS): 相对天数 → 使用 receivedAt + validDays
 *
 * @returns true = 已过期, false = 未过期
 */
function isExpired(coupon: UserCoupon, nowSec: number): boolean {
  // 有固定结束日期时使用固定日期判断（valid_type=1）
  if (coupon.validUntil) {
    const endMs = new Date(coupon.validUntil + 'T23:59:59Z').getTime();
    const endSec = Math.floor(endMs / 1000);
    if (nowSec > endSec) return true;
  }

  // 有相对天数时使用相对天数判断（valid_type=2）
  // 后端逻辑：created_at + valid_days * 86400 < now → 过期
  if (coupon.receivedAt && (coupon.validDays ?? 0) > 0) {
    let receivedSec: number;
    if (typeof coupon.receivedAt === 'number') {
      receivedSec = coupon.receivedAt > 1e12 ? Math.floor(coupon.receivedAt / 1000) : coupon.receivedAt;
    } else {
      receivedSec = Math.floor(new Date(coupon.receivedAt).getTime() / 1000);
    }
    if (receivedSec > 0 && nowSec > receivedSec + (coupon.validDays ?? 0) * 86400) {
      return true;
    }
  }

  return false;
}

/**
 * 检查优惠券是否未到生效时间
 *
 * @returns true = 未生效, false = 已生效
 */
function isNotYetValid(coupon: UserCoupon, nowSec: number): boolean {
  if (!coupon.validUntil && !coupon.validFrom) return false;

  // 只有固定日期范围才有"未到生效时间"的概念
  if (coupon.validFrom) {
    const startMs = new Date(coupon.validFrom + 'T00:00:00Z').getTime();
    const startSec = Math.floor(startMs / 1000);
    if (nowSec < startSec) return true;
  }

  return false;
}

/**
 * Validate if a coupon is usable for the current cart (without calculating discount)
 *
 * 对齐后端 OrderLogic::applyCoupon() 的校验顺序和规则：
 *   1. 状态检查（used/invalid/expired/inactive）
 *   2. 有效期检查（固定日期范围 + 相对天数）
 *   3. 商品范围检查（全场 vs 指定商品）
 *   4. 满减门槛检查（仅 fixed_off 类型，对齐后端仅 THRESHOLD_REDUCE 检查门槛）
 */
export function evaluateCouponForCart(coupon: UserCoupon, items: CartItem[], nowYmd = todayUtcYmd()): CouponEvalResult {
  // 1. 状态检查：已使用、无效、已过期、未激活的券不可用
  if (coupon.status === 'used') return { ok: false, coupon, reason: 'used' };
  if (coupon.status === 'invalid') return { ok: false, coupon, reason: 'invalid' };
  if (coupon.status === 'expired') return { ok: false, coupon, reason: 'expired' };
  if (coupon.status !== 'available') return { ok: false, coupon, reason: 'invalid' };

  // 2. 有效期检查（对齐后端 applyCoupon 的两种有效期类型）
  const nowSec = nowUtcSec();

  // 先检查是否过期
  if (isExpired(coupon, nowSec)) return { ok: false, coupon, reason: 'expired' };

  // 再检查是否未到生效时间（仅固定日期范围）
  if (isNotYetValid(coupon, nowSec)) return { ok: false, coupon, reason: 'not_yet_valid' };

  // 3. 购物车金额检查
  const subtotal = cartSubtotal(items);
  if (subtotal <= 0) return { ok: false, coupon, reason: 'min_spend', minSpend: coupon.minSpend };

  // 4. 商品范围检查（对齐后端 scope_type=2/3 时检查）
  if (!isProductScopeOk(coupon, items)) return { ok: false, coupon, reason: 'product_scope' };

  // 5. 满减门槛检查（⭐ 仅 fixed_off 类型，对齐后端仅 THRESHOLD_REDUCE 检查门槛）
  //    指定商品券只看匹配商品金额是否满足门槛
  const eligible = eligibleSubtotal(coupon, items);
  if (coupon.type === 'fixed_off' && coupon.minSpend > 0) {
    if (eligible + 1e-6 < coupon.minSpend) {
      return { ok: false, coupon, reason: 'min_spend', minSpend: coupon.minSpend };
    }
  }

  return { ok: true, coupon };
}

/** Calculate discount amount (USD), call after evaluate passes */
export function computeDiscountAmount(coupon: UserCoupon, items: CartItem[]): number {
  const eligible = eligibleSubtotal(coupon, items);
  if (eligible <= 0) return 0;

  if (coupon.type === 'fixed_off') {
    const off = Math.max(0, coupon.amountOff ?? 0);
    return Math.min(off, eligible);
  }
  if (coupon.type === 'no_threshold_fixed') {
    const off = Math.max(0, coupon.faceValue ?? 0);
    return Math.min(off, eligible);
  }

  // percent_off: discountFold 就是折数（接口返回几折就是打几折）
  //
  // 统一公式：支付比例 = discountFold / 10
  //
  // 示例：
  //   - discountFold = 0.2  → 0.2折 → 支付2%，省98%
  //   - discountFold = 0.95 → 0.95折 → 支付9.5%，省90.5%
  //   - discountFold = 5.5  → 5.5折 → 支付55%，省45%
  //   - discountFold = 8.5  → 8.5折 → 支付85%，省15%
  //
  const fold = coupon.discountFold ?? 10;
  const ratio = Math.min(1, Math.max(0, fold / 10)); // 统一除以10

  const raw = eligible * (1 - ratio); // 实际折扣金额（仅对匹配商品）
  const cap = coupon.maxDiscount != null ? Math.max(0, coupon.maxDiscount) : Infinity;

  return Math.min(eligible, Math.min(cap, raw));
}

/**
 * 自动选择最优优惠券（节省金额最大的可用券）
 * 对齐需求：单选模式默认选择节省金额最大的优惠券
 */
export function pickBestCouponId(items: CartItem[], coupons: UserCoupon[]): string | null {
  let bestId: string | null = null;
  let bestSave = 0;
  for (const c of coupons) {
    if (c.status !== 'available') continue;
    const ev = evaluateCouponForCart(c, items);
    if (!ev.ok) continue;
    const save = computeDiscountAmount(c, items);
    if (save > bestSave + 1e-6) {
      bestSave = save;
      bestId = c.id;
    }
  }
  return bestId;
}

/** Product detail page: estimate discount with a virtual cart containing only this product at current quantity */
export function previewDiscountForLine(productId: number, unitPrice: number, qty: number, coupon: UserCoupon | null): number {
  if (!coupon || coupon.status !== 'available') return 0;
  const items: CartItem[] = [{ id: productId, name: '', image: '', price: unitPrice, quantity: qty }];
  const ev = evaluateCouponForCart(coupon, items);
  if (!ev.ok) return 0;
  return computeDiscountAmount(coupon, items);
}
