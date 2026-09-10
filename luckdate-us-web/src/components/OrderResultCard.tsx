'use client';

import { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Truck, CheckCircle2, Clock, XCircle, Calendar, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TrackCheckpoint {
  status: string;
  time: string;
  location?: string;
  description?: string;
}

interface OrderGoodsItem {
  goods_id: string | number;
  goods_sn: string;
  name: string;
  image: string;
  quantity: number;
  sale_price?: number;
  total_price?: number;
}

export interface OrderResultCardData {
  // 核心字段（匿名查单 + 个人中心共用）
  order_sn?: string;
  orderNo?: string;
  createTime: string;
  status: string; // 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  tracking_number?: string;
  track_info: TrackCheckpoint[];

  // 个人中心扩展字段
  order_id?: string | number;
  status_int?: number;
  status_text?: string;
  order_amount?: number;
  goods_amount?: number;
  express_amount?: number;
  goods?: OrderGoodsItem[];
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pending: { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  processing: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: Package },
  shipped: { color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', icon: Truck },
  delivered: { color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle2 },
  cancelled: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: XCircle },
};

export default function OrderResultCard({
  order,
  expanded,
  onToggle,
  showCancel,
  onCancel,
  canceling,
  showTrackButton,
  onTrack,
}: {
  order: OrderResultCardData;
  expanded: boolean;
  onToggle: () => void;
  showCancel?: boolean;
  onCancel?: () => void;
  canceling?: boolean;
  showTrackButton?: boolean;
  onTrack?: () => void;
}) {
  const { t } = useTranslation();
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const handleCopy = async (text: string, type: 'order' | 'tracking') => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'order') {
        setCopiedOrder(true);
        setTimeout(() => setCopiedOrder(false), 2000);
      } else {
        setCopiedTracking(true);
        setTimeout(() => setCopiedTracking(false), 2000);
      }
    } catch {
      // ignore clipboard errors
    }
  };

  const currentStatusLabel = (() => {
    switch (order.status) {
      case 'pending': return t('orderInquiry.status.pending');
      case 'processing': return t('orderInquiry.status.processing');
      case 'shipped': return t('orderInquiry.status.shipped');
      case 'delivered': return t('orderInquiry.status.delivered');
      case 'cancelled': return t('orderInquiry.status.cancelled');
      default: return t('orderInquiry.status.processing');
    }
  })();

  const checkpoints = order.track_info || [];
  const [latest, ...history] = checkpoints;
  const orderSn = order.order_sn ?? order.orderNo ?? '';

  // 金额格式化（分转元）
  const formatAmount = (amountInCents: number) => (amountInCents / 100).toFixed(2);

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/80 backdrop-blur-xl shadow-xl shadow-[#D8CBB8]/10 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Card header */}
      <div
        className="p-6 md:p-7 flex flex-col gap-4 cursor-pointer transition-all duration-300"
        onClick={onToggle}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg md:text-xl font-black text-[#4E554B] font-['Montserrat']">
              {t('orderInquiry.orderNumberLabel')} #{orderSn}
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(orderSn, 'order');
              }}
              className="inline-flex items-center justify-center rounded-full border border-[#4E554B]/10 bg-white/70 px-2.5 py-1 text-xs font-medium text-[#6C6763]/70 hover:border-[#D8CBB8]/60 hover:text-[#D8CBB8] transition-colors"
            >
              {copiedOrder ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" />
                  {t('orderInquiry.copied')}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  {t('orderInquiry.copy')}
                </>
              )}
            </button>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="inline-flex items-center gap-2 text-sm text-[#6C6763]/70">
              <Calendar className="w-4 h-4 text-[#6C6763]/50" />
              <span>{order.createTime}</span>
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color} ${config.bg} border`}>
              {currentStatusLabel}
            </span>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-[#6C6763]/40" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#6C6763]/40" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-6 md:px-8 pb-6 md:pb-7 border-t border-white/60 pt-4 md:pt-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Status + Tracking number */}
          <div className="mb-5 md:mb-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-white/70 shadow-inner px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#D8CBB8]/10 flex items-center justify-center flex-shrink-0">
                <StatusIcon className="w-5 h-5 text-[#D8CBB8]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#6C6763]/50 mb-1">
                  {t('orderInquiry.currentStatus')}
                </p>
                <p className="text-base md:text-lg font-black text-[#4E554B]">
                  {currentStatusLabel}
                </p>
                {latest && latest.description && (
                  <p className="mt-1 text-xs md:text-sm text-[#6C6763]/70 line-clamp-2">
                    {latest.description}
                  </p>
                )}
              </div>
            </div>
            {order.tracking_number && (
              <div className="md:ml-auto">
                <p className="text-xs font-black uppercase tracking-wide text-[#6C6763]/50 mb-1">
                  {t('orderInquiry.trackingNumberLabel')}
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-[#4E554B]/10 px-3 py-1.5 shadow-sm">
                  <span className="font-mono text-xs md:text-sm text-[#4E554B]">
                    {order.tracking_number}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(order.tracking_number || '', 'tracking');
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-[#D8CBB8] text-white px-2 py-1 text-[10px] md:text-xs hover:bg-[#C4B5A0] transition-colors"
                  >
                    {copiedTracking ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Goods list (personal center) */}
          {order.goods && order.goods.length > 0 && (
            <div className="mb-5 md:mb-6">
              <p className="text-xs font-black uppercase tracking-wide text-[#6C6763]/50 mb-3">
                {t('orders.goodsList', 'Order Items')}
              </p>
              <div className="space-y-2">
                {order.goods.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm bg-white/60 rounded-xl px-4 py-2">
                    <span className="text-gray-800 font-medium">{item.name}</span>
                    <span className="text-gray-500">
                      {item.total_price != null
                        ? `$${formatAmount(item.total_price)}`
                        : item.sale_price != null
                          ? `$${formatAmount(item.sale_price)} x ${item.quantity}`
                          : `${t('orders.qty', { qty: item.quantity })}`}
                    </span>
                  </div>
                ))}
              </div>
              {order.order_amount != null && (
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200/60">
                  <span className="text-sm font-bold text-[#4E554B]">{t('orders.total', 'Total')}</span>
                  <span className="text-lg font-black text-[#D8CBB8]">${formatAmount(order.order_amount)}</span>
                </div>
              )}
            </div>
          )}

          {/* Action buttons (personal center) */}
          {(showCancel || showTrackButton) && (
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              {showCancel && onCancel && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                  }}
                  disabled={canceling}
                  className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {canceling ? t('orders.cancelling') : t('orders.cancelOrder')}
                </button>
              )}
              {showTrackButton && onTrack && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrack();
                  }}
                  className="px-4 py-2 bg-[#D8CBB8]/10 text-[#D8CBB8] rounded-lg text-sm font-medium hover:bg-[#D8CBB8]/20 transition-colors"
                >
                  {t('orders.trackOrder')}
                </button>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="relative mt-5 md:mt-6">
            <div className="relative pl-6 md:pl-7 space-y-4">
              <div className="absolute left-2.5 md:left-3 top-1 bottom-8 border-l border-dashed border-[#d0d5dd]" aria-hidden />

              {latest && (
                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-4 md:-left-4.5 mt-1 w-7 h-7 rounded-full bg-[#D8CBB8] flex items-center justify-center shadow-md shadow-[#D8CBB8]/40">
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-black text-[#4E554B]">
                      {latest.description || latest.status || currentStatusLabel}
                    </p>
                    {latest.time && (
                      <p className="mt-0.5 text-xs text-[#6C6763]/60">
                        {latest.time}
                        {latest.location ? ` · ${latest.location}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {history.map((item, index) => (
                <div key={`${orderSn}-history-${index}`} className="relative flex items-start gap-3 opacity-60">
                  <div className="absolute -left-3.5 mt-2 w-2.5 h-2.5 rounded-full bg-[#d0d5dd]" />
                  <div className="ml-2">
                    <p className="text-xs font-semibold text-[#111827]">
                      {item.description || item.status}
                    </p>
                    {item.time && (
                      <p className="mt-0.5 text-[11px] text-[#6b7280]">
                        {item.time}
                        {item.location ? ` · ${item.location}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onToggle}
              className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-full bg-white border border-[#e5e7eb] px-4 py-1.5 text-xs font-medium text-[#4b5563] hover:border-[#D8CBB8]/70 hover:text-[#D8CBB8] shadow-sm transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
              <span>{t('orderInquiry.collapse')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
