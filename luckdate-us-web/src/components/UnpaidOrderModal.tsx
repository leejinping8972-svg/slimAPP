'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { STACK_OVERLAY_ATTR } from '@/lib/overlayStack';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { X, TriangleAlert, CreditCard, Loader2 } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { getOrderDetail, continuePay, cancelOrder, type OrderItem, type OrderDetailData } from '@/lib/api/order';
import OrderDetailModal from '@/components/OrderDetailModal';
import { navigateToEmbeddedCheckout } from '@/lib/stripe/embeddedCheckoutNavigate';

export type UnpaidOrderTheme = 'default' | 'dark' | 'green' | 'microneedle';

interface UnpaidOrderModalProps {
  open: boolean;
  onClose: () => void;
  onProceed?: () => void;
  theme?: UnpaidOrderTheme;
}

const THEME_CONFIGS = {
  default: {
    modalBg: 'bg-white',
    overlayBg: 'bg-black/40',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    priceColor: 'text-[#D8CBB8]',
    btnPrimary: 'bg-[#D8CBB8] hover:bg-[#D8CBB8]/90 text-white',
    btnSecondary: 'border-gray-300 text-gray-700 hover:bg-gray-50',
    itemBg: 'bg-gray-50 hover:bg-gray-100/80',
    itemBorder: 'border-gray-200',
    dividerBorder: 'border-gray-100',
    subtitleColor: 'text-gray-500',
    titleColor: 'text-gray-900',
    itemNameColor: 'text-gray-900',
    closeBtnBg: 'bg-gray-100 hover:bg-gray-200',
    closeIconColor: 'text-gray-600',
    noUnpaidColor: 'text-gray-400',
    modalRing: '',
  },
  dark: {
    modalBg: 'bg-[#1a1a1a]',
    overlayBg: 'bg-black/60',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    priceColor: 'text-amber-400',
    btnPrimary: 'bg-[#d4a843] hover:bg-[#c49833] text-black',
    btnSecondary: 'border-gray-600 text-gray-300 hover:bg-white/5',
    itemBg: 'bg-white/5 hover:bg-white/10',
    itemBorder: 'border-white/10',
    dividerBorder: 'border-white/10',
    subtitleColor: 'text-gray-400',
    titleColor: 'text-white',
    itemNameColor: 'text-white',
    closeBtnBg: 'bg-white/10 hover:bg-white/20',
    closeIconColor: 'text-gray-400',
    noUnpaidColor: 'text-gray-500',
    modalRing: 'ring-1 ring-[#d4a843]/40 shadow-[0_0_30px_-5px_rgba(212,168,67,0.25)]',
  },
  green: {
    modalBg: 'bg-white',
    overlayBg: 'bg-black/40',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    priceColor: 'text-emerald-600',
    btnPrimary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    btnSecondary: 'border-gray-300 text-gray-700 hover:bg-gray-50',
    itemBg: 'bg-emerald-50/50 hover:bg-emerald-50',
    itemBorder: 'border-emerald-100',
    dividerBorder: 'border-gray-100',
    subtitleColor: 'text-gray-500',
    titleColor: 'text-gray-900',
    itemNameColor: 'text-gray-900',
    closeBtnBg: 'bg-gray-100 hover:bg-gray-200',
    closeIconColor: 'text-gray-600',
    noUnpaidColor: 'text-gray-400',
    modalRing: '',
  },
  microneedle: {
    modalBg: 'bg-card',
    overlayBg: 'bg-black/50',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
    priceColor: 'text-primary',
    btnPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    btnSecondary: 'border-border text-foreground hover:bg-secondary',
    itemBg: 'bg-secondary hover:bg-muted/80',
    itemBorder: 'border-border',
    dividerBorder: 'border-border',
    subtitleColor: 'text-muted-foreground',
    titleColor: 'text-foreground',
    itemNameColor: 'text-foreground',
    closeBtnBg: 'bg-secondary hover:bg-muted',
    closeIconColor: 'text-muted-foreground',
    noUnpaidColor: 'text-muted-foreground',
    modalRing: 'ring-1 ring-primary/25',
  },
} as const;

export default function UnpaidOrderModal({ open, onClose, onProceed, theme = 'default' }: UnpaidOrderModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { unpaidOrders, fetchOrders, removeOrderLocally, clearRemoved } = useOrder();
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  const tc = THEME_CONFIGS[theme];

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setSelectedOrder(null);
      return;
    }
    setLoading(true);
    fetchOrders().finally(() => setLoading(false));
  }, [open, fetchOrders]);

  useEffect(() => {
    if (!open || loading || selectedOrder) return;
    if (unpaidOrders.length === 0) {
      onClose();
    }
  }, [open, loading, selectedOrder, unpaidOrders.length, onClose]);

  useEffect(() => {
    if (!selectedOrder) { setOrderDetail(null); setDetailError(null); return; }
    setDetailLoading(true);
    setDetailError(null);
    getOrderDetail(selectedOrder.order_id)
      .then((res) => {
        if (res.data?.status && res.data?.data) setOrderDetail(res.data.data);
        else setDetailError(t('orders.unpaidOrderModal.loadFailed'));
      })
      .catch(() => setDetailError(t('orders.unpaidOrderModal.networkError')))
      .finally(() => setDetailLoading(false));
  }, [selectedOrder, t]);

  const handleViewDetails = () => {
    if (unpaidOrders.length === 1) {
      setSelectedOrder(unpaidOrders[0]!);
    } else {
      router.push('/profile/orders?tab=pending_payment');
      onClose();
    }
  };

  const handleGoPay = () => {
    onProceed?.();
  };

  const formatAmount = (cents: number) => (cents / 100).toFixed(2);

  const orderCount = unpaidOrders.length;
  const showPrompt = open && !selectedOrder && orderCount > 0;
  const titleText = orderCount === 1
    ? t('orders.unpaidOrderModal.titleSingle', { defaultValue: 'You have an unpaid order' })
    : t('orders.unpaidOrderModal.titlePlural', { count: orderCount, defaultValue: `You have ${orderCount} unpaid orders` });

  const promptModal = showPrompt ? (
      <div
        {...{ [STACK_OVERLAY_ATTR]: '' }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-auto"
      >
        <div
          className={`absolute inset-0 z-0 ${tc.overlayBg} backdrop-blur-sm cursor-pointer`}
          onClick={onClose}
          aria-hidden
        />
        <div
          className={`relative z-10 ${tc.modalBg} rounded-2xl shadow-2xl max-w-[420px] w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 fade-in duration-200 overflow-hidden ${tc.modalRing || ''}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button type="button" onClick={onClose} className={`absolute top-4 right-4 w-8 h-8 rounded-full ${tc.closeBtnBg} flex items-center justify-center transition-colors z-10`}>
            <X className={`w-4 h-4 ${tc.closeIconColor}`} />
          </button>

          <div className="p-6 sm:p-8 flex flex-col items-center text-center shrink-0">
            <div className={`w-12 h-12 rounded-full ${tc.iconBg} flex items-center justify-center mb-4`}>
              <TriangleAlert className={`w-6 h-6 ${tc.iconColor}`} />
            </div>

            <h3 className={`text-lg font-bold ${tc.titleColor} mb-5`}>
              {titleText}
            </h3>
          </div>

          {loading ? (
            <div className="flex-1 min-h-[120px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : unpaidOrders.length > 0 ? (
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-6 pb-2 space-y-2">
              {unpaidOrders.map((order) => (
                <div key={String(order.order_id)} className={`${tc.itemBg} rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors ${tc.itemBg.includes('hover:') ? tc.itemBg : ''}`} onClick={() => { setSelectedOrder(order); }}>
                  <div className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border ${tc.itemBorder} flex-shrink-0 ${theme === 'dark' ? 'bg-white/5' : theme === 'microneedle' ? 'bg-card' : 'bg-white'}`}>
                    {order.goods[0]?.image ? (
                      <img src={order.goods[0].image} alt={`${order.goods[0].name} ${t('orders.productAltSuffix')}`} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : theme === 'microneedle' ? 'bg-secondary' : 'bg-gray-100'}`}>
                        <TriangleAlert className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : theme === 'microneedle' ? 'text-muted-foreground' : 'text-gray-300'}`} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-semibold ${tc.itemNameColor} line-clamp-2 leading-snug`}>
                      {order.goods[0]?.name || order.order_sn}
                    </p>
                    <p className={`text-base font-bold ${tc.priceColor} mt-0.5`}>
                      ${formatAmount(order.order_amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center px-6 pb-6">
              <p className={`text-sm ${tc.noUnpaidColor}`}>{t('orders.unpaidOrderModal.noUnpaid')}</p>
            </div>
          )}

          {!loading && unpaidOrders.length > 0 && (
          <div className={`shrink-0 px-6 pt-4 pb-6 sm:pb-8 space-y-3 border-t ${tc.dividerBorder}`}>
            <p className={`text-sm ${tc.subtitleColor} text-center`}>
              {t('orders.unpaidOrderModal.subtitle')}
            </p>

            <div className="w-full flex gap-3">
              <button
                onClick={handleViewDetails}
                className={`flex-1 px-4 py-2.5 border rounded-xl font-medium text-sm transition-colors ${tc.btnSecondary}`}
              >
                {t('orders.unpaidOrderModal.viewDetails')}
              </button>
              <button
                onClick={handleGoPay}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 ${tc.btnPrimary}`}
              >
                <CreditCard className="w-4 h-4" />
                {t('orders.unpaidOrderModal.goPay')}
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
  ) : null;

  return (
    <>
      {portalReady && promptModal ? createPortal(promptModal, document.body) : null}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          orderDetail={orderDetail}
          loading={detailLoading}
          error={detailError}
          onClose={() => setSelectedOrder(null)}
          onContinuePay={async () => {
            if (!selectedOrder || paying) return;
            setPaying(true);
            try {
              const res = await continuePay(selectedOrder.order_id);
              const result = res.data;
              if (result?.status && result?.data) {
                const { url, client_secret } = result.data;
                window.dispatchEvent(new CustomEvent('unpaid-order-changed', { detail: { orderId: selectedOrder.order_id, action: 'paid' } }));
                if (url) {
                  window.location.href = url;
                } else if (client_secret) {
                  setSelectedOrder(null);
                  onClose();
                  navigateToEmbeddedCheckout(router, client_secret);
                }
              }
            } catch (error) {
              console.error('Continue pay failed:', error);
            } finally {
              setPaying(false);
            }
          }}
          onCancel={async () => {
            if (!selectedOrder) return;
            try {
              removeOrderLocally(selectedOrder.order_id);
              await cancelOrder(selectedOrder.order_id);
              window.dispatchEvent(new CustomEvent('unpaid-order-changed', { detail: { orderId: selectedOrder.order_id, action: 'cancelled' } }));
              setSelectedOrder(null);
              onClose();
            } catch (error) {
              console.error('Cancel order failed:', error);
              clearRemoved(selectedOrder.order_id);
            }
          }}
          paying={paying}
        />
      )}
    </>
  );
}
