export type UserCouponType = 'fixed_off' | 'percent_off' | 'no_threshold_fixed';

export type UserCouponProductScope = 'all' | 'specific' | 'conditional_all';

export type UserCouponStatus = 'inactive' | 'available' | 'used' | 'expired' | 'invalid';

/** User coupon in wallet (frontend simulation, stored in localStorage) */
export interface UserCoupon {
  id: string;
  code: string;
  title: string;
  type: UserCouponType;
  /** Fixed off: discount amount after meeting threshold (USD) */
  amountOff?: number;
  /** 折扣券：折数，与后台 discount_rate 一致；实付比例 = discountFold/10（如 9.8 即付 98%，约 2% 减免；勿把「减免比例」误填为小于 1 的折数） */
  discountFold?: number;
  /** Max discount for percent off coupons (USD), optional */
  maxDiscount?: number | null;
  /** No threshold: face value (USD) */
  faceValue?: number;
  /** Minimum spend threshold (USD), 0 means no threshold */
  minSpend: number;
  productScope: UserCouponProductScope;
  productIds: number[];
  /** Valid from date (ISO date yyyy-mm-dd), for fixed date range (valid_type=1) */
  validFrom: string;
  /** Valid until date (ISO date yyyy-mm-dd, inclusive), for fixed date range (valid_type=1) */
  validUntil: string;
  /** Coupon receive time (Unix timestamp in seconds or ISO string), for relative days validity (valid_type=2) */
  receivedAt?: number | string;
  /** Valid days after receipt, for relative days validity (valid_type=2). e.g. 7 = valid for 7 days */
  validDays?: number;
  status: UserCouponStatus;
  usedAt?: string;
  orderId?: string;
}

export type CouponInvalidReason =
  | 'expired'
  | 'not_yet_valid'
  | 'min_spend'
  | 'product_scope'
  | 'used'
  | 'invalid';

export interface CouponEvalOk {
  ok: true;
  coupon: UserCoupon;
}

export interface CouponEvalFail {
  ok: false;
  coupon: UserCoupon;
  reason: CouponInvalidReason;
  /** Minimum spend threshold for display */
  minSpend?: number;
}

export type CouponEvalResult = CouponEvalOk | CouponEvalFail;
