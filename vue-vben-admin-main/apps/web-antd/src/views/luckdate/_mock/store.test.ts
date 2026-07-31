import { describe, expect, it } from 'vitest';

import {
  BIND_STATUS_LABEL,
  PLAN_STATUS_LABEL,
  bindExternalOrderToUser,
  getPlanDashboardStats,
  maskPhone,
  previewExternalOrders,
  queryCheckIns,
  queryPlans,
  queryUsers,
  slimPlanProductIds,
} from './store';

describe('maskPhone', () => {
  it('masks middle digits', () => {
    expect(maskPhone('13812345678')).toBe('138****5678');
  });
});

describe('plan IA mock', () => {
  it('exposes plan status labels', () => {
    expect(Object.keys(PLAN_STATUS_LABEL)).toEqual([
      'active',
      'completed',
      'awaiting',
    ]);
  });

  it('exposes bind status labels', () => {
    expect(Object.keys(BIND_STATUS_LABEL)).toEqual(['bound', 'unbound']);
  });

  it('filters plans by status', () => {
    const { items } = queryPlans({ status: 'active' });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((p) => p.status === 'active')).toBe(true);
  });

  it('returns dashboard stats without commerce fields', () => {
    const stats = getPlanDashboardStats();
    expect(stats).toHaveProperty('active');
    expect(stats).toHaveProperty('checkInsToday');
    expect(stats).toHaveProperty('completionRate');
    expect(stats).not.toHaveProperty('todayOrders');
    expect(stats).not.toHaveProperty('couponIssued');
  });
});

describe('users and check-ins', () => {
  it('filters users by bind status', () => {
    const { items } = queryUsers({ bindStatus: 'bound' });
    expect(items.every((u) => u.bindStatus === 'bound')).toBe(true);
  });

  it('filters check-ins by date', () => {
    const { items } = queryCheckIns({ date: '2026-07-31' });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((c) => c.date === '2026-07-31')).toBe(true);
  });
});

describe('external bind', () => {
  it('only opens plan when product id is in slim_plan_product_ids', () => {
    expect(slimPlanProductIds()).toContain('p1');
    const preview = previewExternalOrders('Maya Ruiz', '5678');
    expect(preview.total).toBe(1);
    const result = bindExternalOrderToUser('u1002', preview.items[0]!.id);
    expect(result.ok).toBe(true);
    // p3 is not in slim_plan_product_ids
    expect(result.planOpened).toBe(false);
  });
});
