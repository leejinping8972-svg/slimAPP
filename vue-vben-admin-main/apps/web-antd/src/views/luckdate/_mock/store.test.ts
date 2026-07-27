import { describe, expect, it } from 'vitest';

import {
  LOGISTICS_STATUS_LABEL,
  maskPhone,
  ORDER_STATUS_LABEL,
  queryOrders,
} from './store';

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

  it('exposes order labels for all three statuses', () => {
    expect(Object.keys(ORDER_STATUS_LABEL)).toEqual([
      'unpaid',
      'paid',
      'cancelled',
    ]);
  });

  it('exposes logistics labels for all five statuses', () => {
    expect(Object.keys(LOGISTICS_STATUS_LABEL)).toEqual([
      'placed',
      'shipped',
      'arrived',
      'received',
      'problem',
    ]);
  });
});
