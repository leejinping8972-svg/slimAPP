'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { getOrderDetail, cancelOrder, continuePay, type OrderItem, type OrderDetailData } from '@/lib/api/order';
import { setEmbeddedCheckoutClientSecret } from '@/lib/stripe/embeddedCheckoutNavigate';
import OrderDetailModal from '@/components/OrderDetailModal';

export default function UnpaidOrderFloat() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { unpaidOrders, fetchOrders, removeOrderLocally, clearRemoved } = useOrder();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<string | number | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user, fetchOrders]);

  useEffect(() => {
    setVisible(unpaidOrders.length > 0 && !dismissed);
  }, [unpaidOrders.length, dismissed]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.orderId) {
        removeOrderLocally(detail.orderId);
      }
      setTimeout(() => fetchOrders(), 800);
    };
    document.addEventListener('unpaid-order-changed', handler);
    return () => document.removeEventListener('unpaid-order-changed', handler);
  }, [fetchOrders, removeOrderLocally]);

  useEffect(() => {
    if (!selectedOrder) { setOrderDetail(null); setDetailError(null); return; }
    setDetailLoading(true);
    setDetailError(null);
    getOrderDetail(selectedOrder.order_id)
      .then((res) => {
        if (res.data?.status && res.data?.data) setOrderDetail(res.data.data);
        else setDetailError(t('orders.unpaidFloat.loadFailed'));
      })
      .catch(() => setDetailError(t('orders.unpaidFloat.networkError')))
      .finally(() => setDetailLoading(false));
  }, [selectedOrder]);

  const handleContinuePay = async (orderId: string | number) => {
    setPayingOrderId(orderId);
    try {
      const res = await continuePay(orderId);
      if (res.data?.status && res.data?.data) {
        const d = res.data.data;
        if (d.url) window.location.href = d.url;
        else if (d.client_secret) { setEmbeddedCheckoutClientSecret(d.client_secret); window.location.href = '/checkout/pay'; }
      }
    } catch {}
    finally { setPayingOrderId(null); }
  };

  const handleCancel = async (orderId: string | number) => {
    try {
      removeOrderLocally(orderId);
      setSelectedOrder(null);
      await cancelOrder(orderId);
      window.dispatchEvent(new CustomEvent('unpaid-order-changed', { detail: { orderId, action: 'cancelled' } }));
      setTimeout(() => {
        clearRemoved(orderId);
        fetchOrders();
      }, 800);
    } catch {
      clearRemoved(orderId);
      fetchOrders();
    }
  };

  if (!visible || unpaidOrders.length === 0) return null;

  const handleClick = () => {
    if (selectedOrder) return;
    if (unpaidOrders.length === 1) {
      setSelectedOrder(unpaidOrders[0]!);
    } else {
      router.push('/profile/orders?tab=pending_payment');
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    setVisible(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={t('orders.unpaidFloat.ariaLabel', { count: unpaidOrders.length, plural: unpaidOrders.length > 1 ? 's' : '' })}
        className="unpaid-order-float-btn fixed bottom-40 sm:bottom-44 left-3 sm:left-5 z-50 group flex items-center text-primary-foreground font-body font-bold w-11 h-11 sm:w-12 sm:h-12 hover:w-[140px] sm:hover:w-[168px] hover:pl-3 hover:pr-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-background/20 text-primary-foreground shrink-0 mx-auto group-hover:mx-0 transition-[margin] duration-300">
          <Clock className="w-4 h-4" />
          {unpaidOrders.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-5 w-5 bg-destructive text-[8px] font-bold text-white flex items-center justify-center">{unpaidOrders.length}</span>
            </span>
          )}
        </span>
        <span className="text-xs sm:text-sm whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-[120px] group-hover:ml-2 transition-all duration-300 leading-none self-center">
          {t('orders.unpaidFloat.single')}
        </span>
      </button>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          orderDetail={orderDetail}
          loading={detailLoading}
          error={detailError}
          onClose={() => setSelectedOrder(null)}
          onCancel={() => handleCancel(selectedOrder.order_id)}
          onContinuePay={() => handleContinuePay(selectedOrder.order_id)}
          paying={payingOrderId === selectedOrder.order_id}
        />
      )}
    </>
  );
}
