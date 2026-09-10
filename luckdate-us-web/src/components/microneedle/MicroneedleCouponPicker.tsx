'use client';

import { useState, useEffect, useRef } from 'react';
import { Ticket, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { UserCoupon } from '@/lib/coupons/types';
import type { CartItem } from '@/context/CartContext';
import { evaluateCouponForCart, previewDiscountForLine } from '@/lib/coupons/engine';

type MicroneedleCouponPickerProps = {
  lineItems: CartItem[];
  availableWallet: UserCoupon[];
  pdpCouponId: string | null;
  setPdpCouponId: (id: string | null) => void;
  onSelect?: () => void;
};

export default function MicroneedleCouponPicker({
  lineItems,
  availableWallet,
  pdpCouponId,
  setPdpCouponId,
  onSelect,
}: MicroneedleCouponPickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (availableWallet.length === 0) return null;

  const couponReason = (c: UserCoupon) => {
    const ev = evaluateCouponForCart(c, lineItems);
    if (ev.ok) return '';
    switch (ev.reason) {
      case 'expired':
        return t('coupon.reason.expired', { defaultValue: 'Expired' });
      case 'not_yet_valid':
        return t('coupon.reason.notYetValid', { defaultValue: 'Not yet valid' });
      case 'min_spend':
        return t('coupon.reason.minSpend', {
          min: ev.minSpend?.toFixed?.(2) ?? String(c.minSpend),
          defaultValue: `Min spend $${c.minSpend}`,
        });
      case 'product_scope':
        return t('coupon.reason.productScope', { defaultValue: 'Not applicable to this product' });
      case 'used':
        return t('coupon.reason.used', { defaultValue: 'Already used' });
      case 'invalid':
        return t('coupon.reason.invalid', { defaultValue: 'Invalid' });
      default:
        return '';
    }
  };

  const selected = availableWallet.find((c) => c.id === pdpCouponId);
  const selEv = selected ? evaluateCouponForCart(selected, lineItems) : null;
  const selSave =
    selected && selEv?.ok && lineItems[0]
      ? previewDiscountForLine(lineItems[0].id, lineItems[0].price, lineItems[0].quantity, selected)
      : 0;

  const summaryText =
    selected && selEv?.ok
      ? `${selected.title} · -$${selSave.toFixed(2)}`
      : t('cart.couponTitle', { defaultValue: 'Select Coupon' });

  const handleSelect = (c: UserCoupon, ok: boolean) => {
    if (ok) {
      setPdpCouponId(c.id);
      setIsOpen(false);
      onSelect?.();
    }
  };

  return (
    <div ref={detailsRef} className="relative z-[45] w-full mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm border border-[oklch(0.90_0.018_75)] bg-[oklch(0.98_0.015_75)] px-4 py-3 text-sm font-medium text-[oklch(0.20_0.015_60)]"
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <Ticket className="h-4 w-4 shrink-0 text-[oklch(0.52_0.085_55)]" />
          <span className="truncate">{summaryText}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[oklch(0.48_0.02_65)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 max-h-[min(40vh,220px)] overflow-y-auto rounded-sm border border-[oklch(0.90_0.018_75)] bg-white p-2 shadow-lg">
          <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wide text-[oklch(0.48_0.02_65)]">
            {t('cart.couponBestHint', { defaultValue: 'Best coupon' })}
          </p>
          <div className="space-y-1">
            {availableWallet.map((c) => {
              const ev = evaluateCouponForCart(c, lineItems);
              const ok = ev.ok;
              const reason = couponReason(c);
              const save =
                ok && lineItems[0]
                  ? previewDiscountForLine(lineItems[0].id, lineItems[0].price, lineItems[0].quantity, c)
                  : 0;
              return (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-start gap-2 rounded-sm p-2 transition-colors ${
                    ok ? 'hover:bg-[oklch(0.96_0.012_75)]' : 'cursor-not-allowed opacity-55'
                  } ${pdpCouponId === c.id && ok ? 'bg-[oklch(0.96_0.012_75)]' : ''}`}
                >
                  <input
                    type="radio"
                    name="microneedle-pdp-coupon"
                    className="mt-1 accent-[oklch(0.52_0.085_55)]"
                    checked={pdpCouponId === c.id}
                    disabled={!ok}
                    onChange={() => handleSelect(c, ok)}
                  />
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-xs font-bold text-[oklch(0.20_0.015_60)]">{c.title}</span>
                    <span className="font-mono text-[10px] text-[oklch(0.48_0.02_65)]">{c.code}</span>
                    {ok && save > 0 && (
                      <span className="mt-0.5 block text-[11px] font-semibold text-[oklch(0.52_0.085_55)]">
                        -${save.toFixed(2)}
                      </span>
                    )}
                    {!ok && reason && (
                      <span className="mt-0.5 block text-[10px] text-red-600/90">{reason}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
