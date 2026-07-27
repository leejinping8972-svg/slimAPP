import { describe, expect, it } from 'vitest';

import { maskPhone, queryOrders, ORDER_STATUS_LABEL } from './store';

describe('maskPhone', () => {
  it('masks middle digits', () => {
    expect(maskPhone('13812345678')).toBe('138****5678');
  });
});

describe('queryOrders', () => {
  it('filters by orderStatus paid', () => {
    const { items } = queryOrders({ orderStatus: 'paid' });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((o) => o.orderStatus === 'paid')).toBe(true);
  });

  it('exposes logistics labels for all five statuses', () => {
    expect(Object.keys(ORDER_STATUS_LABEL)).toEqual([
      'unpaid',
      'paid',
      'cancelled',
    ]);
  });
});
