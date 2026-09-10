'use client';

import { useTranslation } from 'react-i18next';
import { AlertTriangle, Ticket, X, Loader2 } from 'lucide-react';
import type { OrderItem } from '@/lib/api/order';
import { STACK_OVERLAY_ATTR } from '@/lib/overlayStack';

function formatAmount(amountInCents: number) {
  return (amountInCents / 100).toFixed(2);
}

interface CancelOrderConfirmModalProps {
  order: OrderItem;
  open: boolean;
  canceling: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CancelOrderConfirmModal({
  order,
  open,
  canceling,
  onConfirm,
  onClose,
}: CancelOrderConfirmModalProps) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div {...{ [STACK_OVERLAY_ATTR]: '' }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 fade-in duration-200 modal-gold-border">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-primary" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-center text-card-foreground mb-2">
          {t('orders.confirm.title')}
        </h3>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {t('orders.confirm.message')}
          </p>

          <div className="bg-secondary rounded-xl p-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t('orders.confirm.orderLabel')}:</span>
              <span className="font-medium text-card-foreground">{order.order_sn}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t('orders.confirm.amountLabel')}:</span>
              <span className="font-bold text-primary">${formatAmount(order.order_amount)}</span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 flex items-start gap-2">
            <Ticket className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="text-xs text-card-foreground/80 leading-relaxed">
              <p className="font-semibold mb-0.5 text-card-foreground">{t('orders.confirm.couponPolicyTitle')}</p>
              <ul className="space-y-0.5 ml-3 list-disc">
                <li>{t('orders.confirm.couponPolicy1')}</li>
                <li>{t('orders.confirm.couponPolicy2')}</li>
                <li>{t('orders.confirm.couponPolicy3')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={canceling}
            className="flex-1 px-4 py-2.5 border border-border text-card-foreground rounded-xl font-medium text-sm hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {t('orders.confirm.keepOrder')}
          </button>
          <button
            onClick={onConfirm}
            disabled={canceling}
            className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-medium text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {canceling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('orders.cancelling')}
              </>
            ) : (
              t('orders.confirm.yesCancel')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
