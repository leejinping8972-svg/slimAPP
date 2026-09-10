'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getUserOrders } from '@/lib/api/order';
import type { OrderItem } from '@/lib/api/order';

const ORDER_STATUS = {
  WAIT_PAY: 0,
} as const;

interface OrderContextType {
  allOrders: OrderItem[];
  unpaidOrders: OrderItem[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  removeOrderLocally: (orderId: string | number) => void;
  clearRemoved: (orderId: string | number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<string | number>>(new Set());

  const unpaidOrders = allOrders
    .filter((o) => o.status === ORDER_STATUS.WAIT_PAY)
    .filter((o) => !removedIds.has(o.order_id));

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserOrders({ page: 1, pageSize: 50 });
      if (res.data?.status && res.data?.list) {
        setAllOrders(res.data.list.data || []);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => fetchOrders();
    document.addEventListener('visibilitychange', handler);
    window.addEventListener('focus', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
      window.removeEventListener('focus', handler);
    };
  }, [fetchOrders]);

  const removeOrderLocally = useCallback((orderId: string | number) => {
    setRemovedIds((prev) => new Set(prev).add(orderId));
  }, []);

  const clearRemoved = useCallback((orderId: string | number) => {
    setRemovedIds((prev) => {
      const next = new Set(prev);
      next.delete(orderId);
      return next;
    });
  }, []);

  return (
    <OrderContext.Provider value={{ allOrders, unpaidOrders, loading, fetchOrders, removeOrderLocally, clearRemoved }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
