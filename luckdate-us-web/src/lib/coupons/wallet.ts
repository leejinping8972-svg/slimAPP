import type { UserCoupon } from './types';

const KEY = (email: string) => `luckdate_user_coupons_${email}`;

/** 默认优惠券数据（用于预览样式） */
export function getDefaultCoupons(): UserCoupon[] {
  const today = new Date();
  const until = new Date(today.getTime() + 30 * 86400000);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return [
    {
      id: 'welcome_001',
      code: 'WELCOME20',
      title: 'New Customer $20 Off',
      type: 'fixed_off',
      amountOff: 20,
      minSpend: 50,
      productScope: 'all',
      productIds: [],
      validFrom: fmt(today),
      validUntil: fmt(until),
      status: 'available',
    },
    {
      id: 'percent_001',
      code: 'SAVE15',
      title: '15% Off Everything',
      type: 'percent_off',
      discountFold: 8.5,
      maxDiscount: 50,
      minSpend: 0,
      productScope: 'all',
      productIds: [],
      validFrom: fmt(today),
      validUntil: fmt(until),
      status: 'available',
    },
    {
      id: 'nothreshold_001',
      code: 'NO5OFF',
      title: '$5 Off No Minimum',
      type: 'no_threshold_fixed',
      faceValue: 5,
      minSpend: 0,
      productScope: 'all',
      productIds: [],
      validFrom: fmt(today),
      validUntil: fmt(until),
      status: 'available',
    },
    {
      id: 'expired_001',
      code: 'EXPIRED50',
      title: 'Expired $50 Off',
      type: 'fixed_off',
      amountOff: 50,
      minSpend: 100,
      productScope: 'all',
      productIds: [],
      validFrom: '2024-01-01',
      validUntil: '2024-01-31',
      status: 'available',
    },
  ];
}

export function loadCouponsFromStorage(email: string): UserCoupon[] {
  if (typeof window === 'undefined') return getDefaultCoupons();
  try {
    const raw = localStorage.getItem(KEY(email));
    if (!raw) return getDefaultCoupons();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultCoupons();
  } catch {
    return getDefaultCoupons();
  }
}

export function saveCouponsToStorage(email: string, coupons: UserCoupon[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY(email), JSON.stringify(coupons));
  } catch {
    /* ignore */
  }
}

export function createWelcomeCoupon(): UserCoupon {
  const today = new Date();
  const until = new Date(today.getTime() + 30 * 86400000);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return {
    id: `welcome_${Date.now()}`,
    code: 'LUCKDATE-AUTO',
    title: 'New customer $20 off',
    type: 'fixed_off',
    amountOff: 20,
    minSpend: 0,
    productScope: 'all',
    productIds: [],
    validFrom: fmt(today),
    validUntil: fmt(until),
    status: 'available',
  };
}

/** Return coupon: mark as invalid if expired, otherwise available */
export function normalizeReturnedCoupon(c: UserCoupon, nowYmd: string): UserCoupon {
  if (nowYmd > c.validUntil) {
    return { ...c, status: 'invalid', usedAt: undefined, orderId: undefined };
  }
  return { ...c, status: 'available', usedAt: undefined, orderId: undefined };
}
