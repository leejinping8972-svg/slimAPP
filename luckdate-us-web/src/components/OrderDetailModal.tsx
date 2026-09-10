'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, Truck, Clock } from 'lucide-react';
import type { OrderItem, OrderDetailData } from '@/lib/api/order';
import CancelOrderConfirmModal from '@/components/CancelOrderConfirmModal';
import { STACK_OVERLAY_ATTR } from '@/lib/overlayStack';

const ORDER_STATUS = {
  WAIT_PAY: 0,
} as const;

export function PaymentCountdown({ remainingMs, deadlineMs, showDetail }: { remainingMs: number; deadlineMs: number; showDetail?: boolean }) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(remainingMs);

  useEffect(() => {
    const calculateRemaining = () => Math.max(0, deadlineMs - Date.now());
    setTimeLeft(calculateRemaining());
    const timer = setInterval(() => {
      const r = calculateRemaining();
      if (r <= 0) { clearInterval(timer); setTimeLeft(0); }
      else setTimeLeft(r);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadlineMs]);

  if (timeLeft <= 0) return <span className="text-xs text-gray-400">{t('orders.expired', 'Expired')}</span>;

  const totalSeconds = Math.ceil(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return <span className={`text-xs sm:text-sm font-medium ${showDetail ? 'text-red-500' : 'text-white'}`}>{hours}h {minutes}m {seconds}s</span>;
  if (minutes > 0) return <span className={`text-xs sm:text-sm font-medium ${showDetail ? 'text-red-500' : 'text-white'}`}>{minutes}min {seconds}s</span>;
  return <span className={`text-xs sm:text-sm font-medium ${showDetail ? 'text-red-500' : 'text-white'}`}>{seconds}s</span>;
}

function formatAmount(amountInCents: number) {
  return (amountInCents / 100).toFixed(2);
}

function formatDate(dateValue: string | number) {
  try {
    let date: Date;
    if (typeof dateValue === 'number') {
      date = new Date(dateValue > 1e12 ? dateValue : dateValue * 1000);
    } else {
      date = new Date(dateValue);
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return String(dateValue);
  }
}

function getDisplayTime(order: OrderItem) {
  if (order.createTime) return order.createTime;
  return formatDate(order.created_at);
}

function getStatusColor(statusText: string) {
  const statusLower = statusText.toLowerCase();
  if (statusLower.includes('pending') || statusLower.includes('待') || statusLower.includes('pay')) {
    return 'bg-yellow-50 text-yellow-600 border-yellow-200';
  } else if (statusLower.includes('shipped') || statusLower.includes('发货') || statusLower.includes('process')) {
    return 'bg-blue-50 text-blue-600 border-blue-200';
  } else if (statusLower.includes('delivered') || statusLower.includes('完成') || statusLower.includes('success')) {
    return 'bg-green-50 text-green-600 border-green-200';
  } else if (statusLower.includes('cancelled') || statusLower.includes('取消')) {
    return 'bg-red-50 text-red-600 border-red-200';
  }
  return 'bg-gray-50 text-gray-600 border-gray-200';
}

function formatTimestamp(timestamp: number) {
  if (!timestamp) return '-';
  try {
    const date = new Date(timestamp > 1e12 ? timestamp : timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

interface OrderDetailModalProps {
  order: OrderItem;
  orderDetail: OrderDetailData | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onCancel?: () => void;
  onContinuePay?: () => void;
  paying?: boolean;
}

export default function OrderDetailModal({
  order,
  orderDetail,
  loading,
  error,
  onClose,
  onCancel,
  onContinuePay,
  paying,
}: OrderDetailModalProps) {
  const { t } = useTranslation();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const handleCancelClick = () => {
    if (onCancel) {
      setShowCancelConfirm(true);
    }
  };

  const handleCancelConfirm = async () => {
    setCanceling(true);
    try {
      await onCancel?.();
    } finally {
      setCanceling(false);
      setShowCancelConfirm(false);
    }
  };

  const detail = orderDetail?.order;
  const goods = orderDetail?.order_goods || order.goods;
  const address = orderDetail?.order_address;
  const payments = orderDetail?.order_payments || [];

  let trackInfo: any[] = [];
  if (orderDetail?.track_info && Array.isArray(orderDetail.track_info)) {
    trackInfo = orderDetail.track_info;
  } else {
    const raw = order.track_info;
    if (Array.isArray(raw) && raw.length > 0) {
      trackInfo = raw;
    } else if (typeof raw === 'string' && raw) {
      try { trackInfo = JSON.parse(raw); } catch { trackInfo = []; }
    }
  }
  const hasTracking = trackInfo.length > 0;

  return (
    <div {...{ [STACK_OVERLAY_ATTR]: '' }} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 fade-in duration-200 overflow-hidden modal-gold-border">
        <div className="shrink-0 bg-card border-b border-border p-4 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-card-foreground font-['Montserrat']">
              {t('orders.orderDetails', 'Order Details')}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{order.order_sn}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary hover:bg-muted flex items-center justify-center transition-colors shrink-0">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6 modal-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">{t('orders.loading', 'Loading...')}</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600 text-sm font-medium mb-2">{error}</p>
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm"
              >
                {t('common.tryAgain', 'Try Again')}
              </button>
            </div>
          )}

          {!loading && !error && detail && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{t('orders.status', 'Status')}</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(detail.status_text)}`}>
                    {detail.status_text}
                  </span>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{t('orders.date', 'Date')}</p>
                  <p className="text-sm font-semibold text-card-foreground">{formatTimestamp(detail.created_at)}</p>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t('orders.timeline', 'Timeline')}</h4>
                <div className="space-y-2 text-xs">
                  {detail.created_at > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('orders.created', 'Created')}</span>
                      <span className="font-medium text-card-foreground">{formatTimestamp(detail.created_at)}</span>
                    </div>
                  )}
                  {detail.pay_at > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('orders.paid', 'Paid')}</span>
                      <span className="font-medium text-green-600">{formatTimestamp(detail.pay_at)}</span>
                    </div>
                  )}
                  {detail.shipments_at > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('orders.shipped', 'Shipped')}</span>
                      <span className="font-medium text-blue-600">{formatTimestamp(detail.shipments_at)}</span>
                    </div>
                  )}
                  {detail.received_at > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('orders.received', 'Received')}</span>
                      <span className="font-medium text-primary">{formatTimestamp(detail.received_at)}</span>
                    </div>
                  )}
                  {detail.finish_at > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('orders.completed', 'Completed')}</span>
                      <span className="font-medium text-primary">{formatTimestamp(detail.finish_at)}</span>
                    </div>
                  )}
                  {detail.cancel_at > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('orders.cancelled', 'Cancelled')}</span>
                      <span className="font-medium text-red-600">{formatTimestamp(detail.cancel_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {address && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">{t('orders.shippingAddress', 'Shipping Address')}</h4>
                  <div className="bg-secondary rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-card-foreground">{address.consignee}</span>
                      {address.phone && <span className="text-muted-foreground">({address.country_code}) {address.phone}</span>}
                    </div>
                    {address.email && <p className="text-muted-foreground text-xs">{address.email}</p>}
                    <p className="text-card-foreground/80 leading-relaxed">
                      {[address.address, address.city, address.state, address.country, address.postcode].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">{t('orders.items', 'Items')}</h4>
                <div className="space-y-3">
                  {goods.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-secondary rounded-xl">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-card shrink-0 border border-border">
                        <img src={item.image} alt={`${item.name} ${t('orders.productAltSuffix')}`} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-card-foreground line-clamp-2 leading-snug mb-1">{item.name}</h5>
                        <p className="text-xs text-muted-foreground mb-1">{t('orders.qty', { qty: item.quantity })}</p>
                        {item.sale_price !== undefined && (
                          <p className="text-xs font-medium text-primary">${formatAmount(item.sale_price)} × {item.quantity} = ${formatAmount(item.total_price || item.sale_price * item.quantity)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('orders.subtotal', 'Subtotal')}</span>
                  <span className="font-medium">${formatAmount(detail.goods_amount || detail.order_amount)}</span>
                </div>
                {detail.express_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('orders.shipping', 'Shipping')}</span>
                    <span className="font-medium">${formatAmount(detail.express_amount)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
                  <span>{t('orders.total', 'Total')}</span>
                  <span className="text-primary">${formatAmount(detail.order_amount)}</span>
                </div>
              </div>

              {payments.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">{t('orders.paymentInfo', 'Payment Information')}</h4>
                  <div className="space-y-3">
                    {payments.map((payment: any, i: number) => (
                      <div key={i} className="bg-secondary rounded-xl p-4 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('orders.paymentMethod', 'Payment Method')}</span>
                          <span className="font-medium text-card-foreground">{payment.payment_channel_text || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('orders.amount', 'Amount')}</span>
                          <span className="font-semibold text-primary">${formatAmount(payment.total_fee)}</span>
                        </div>
                        {payment.transaction_id && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('orders.transactionId', 'Transaction ID')}</span>
                            <span className="font-mono text-card-foreground break-all text-right max-w-[60%]">{payment.transaction_id}</span>
                          </div>
                        )}
                        {payment.finished_at > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('orders.paymentTime', 'Payment Time')}</span>
                            <span className="font-medium text-card-foreground">{formatTimestamp(payment.finished_at)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(detail.tracking_no || detail.outbound_order_no || detail.logistics_status_text) && (
                <div className="bg-primary/5 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">{t('orders.logisticsInfo', 'Logistics Information')}</h4>
                  {detail.logistics_status_text && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('orders.logisticsStatus', 'Logistics Status')}</span>
                      <span className="font-medium text-blue-600">{detail.logistics_status_text}</span>
                    </div>
                  )}
                  {detail.tracking_no && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('orders.trackingNumber', 'Tracking Number')}</span>
                      <span className="font-mono font-medium text-card-foreground">{detail.tracking_no}</span>
                    </div>
                  )}
                  {detail.outbound_order_no && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('orders.outboundOrderNo', 'Outbound Order No.')}</span>
                      <span className="font-mono font-medium text-card-foreground">{detail.outbound_order_no}</span>
                    </div>
                  )}
                </div>
              )}

              {hasTracking && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">{t('orders.trackingTimeline', 'Tracking Timeline')}</h4>
                  <div className="relative space-y-0">
                    <div className="absolute left-[15px] top-[24px] bottom-[20px] w-[2px] border-l-2 border-dashed border-border" aria-hidden />
                    {(() => {
                      const [latest, ...history] = trackInfo;
                      return (
                        <>
                          {latest && (
                            <div className="relative flex gap-4 pb-6 last:pb-0">
                              <div className="relative flex-shrink-0 w-[32px] flex justify-center">
                                <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-primary/10 z-10">
                                  <Truck className="w-[14px] h-[14px] text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 bg-gradient-to-r from-primary/8 to-transparent rounded-xl p-4 border border-primary/15 -mt-1">
                                <p className="text-sm font-bold text-card-foreground leading-snug mb-1.5">{latest.description || latest.status || ''}</p>
                                {latest.time && (
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1 font-medium">
                                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {latest.time}
                                    </span>
                                    {latest.location && (
                                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {latest.location}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {history.map((item: any, index: number) => (
                            <div key={index} className="relative flex gap-4 pb-5 last:pb-0 opacity-70 hover:opacity-100 transition-opacity">
                              <div className="relative flex-shrink-0 w-[32px] flex justify-center pt-1.5">
                                <div className="w-[10px] h-[10px] rounded-full bg-card border-2 border-muted-foreground/40 shadow-sm z-10" />
                              </div>
                              <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-xs font-medium text-card-foreground/80 leading-relaxed mb-1 line-clamp-2">{item.description || item.status || ''}</p>
                                {item.time && (
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                                    <span>{item.time}</span>
                                    {item.location && (<><span className="text-muted-foreground/50">·</span><span>{item.location}</span></>)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="shrink-0 bg-card border-t border-border p-4 sm:p-6 flex flex-col sm:flex-row justify-end gap-3">
          {onCancel && (
            <button
              onClick={handleCancelClick}
              className="w-full sm:w-auto px-6 py-2.5 border-2 border-destructive text-destructive rounded-xl text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              {t('orders.cancelOrder')}
            </button>
          )}
          {onContinuePay ? (
            <button
              onClick={onContinuePay}
              disabled={paying}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {paying ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{t('orders.processing')}</>
              ) : (
                <>
                  <span>{t('orders.continuePay', 'Pay Now')}</span>
                  <span className="text-red-400 font-normal text-white">（</span>
                  <PaymentCountdown remainingMs={order.continue_pay_remaining_ms || 0} deadlineMs={order.continue_pay_deadline_ms || 0} />
                  <span className="text-red-400 font-normal text-white">）</span>
                </>
              )}
            </button>
          ) : (
            <button onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 bg-secondary text-card-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors">
              {t('orders.close', 'Close')}
            </button>
          )}
        </div>
      </div>

      <CancelOrderConfirmModal
        order={order}
        open={showCancelConfirm}
        canceling={canceling}
        onConfirm={handleCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}
