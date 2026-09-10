'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, ShieldCheck, Ticket } from 'lucide-react';
import type { SkuOption } from '@/lib/shilajit-constants';
import type { UserCoupon } from '@/lib/coupons/types';
import type { CartItem } from '@/context/CartContext';
import { evaluateCouponForCart, previewDiscountForLine } from '@/lib/coupons/engine';
import { useTranslation } from 'react-i18next';
import { formatUsd, getSkuDisplayPricing } from './SkuSelector';

// Shake animation keyframes
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}
`;

interface StickyBottomBarProps {
  skuOptions: SkuOption[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onShopNow: () => void;
  couponData?: {
    lineItems: CartItem[];
    availableWallet: UserCoupon[];
    pdpCouponId: string | null;
    setPdpCouponId: (id: string | null) => void;
    showCouponClaimEntry: boolean;
    handleOpenCouponModal?: () => void;
    handlePdpManualSelect: () => void;
    hasDiscount: boolean;
    discountedPrice: number;
    discountAmount: number;
    originalPrice: number;
  };
}

export function CouponPicker({
  lineItems,
  availableWallet,
  pdpCouponId,
  setPdpCouponId,
  onSelect,
}: {
  lineItems: CartItem[];
  availableWallet: UserCoupon[];
  pdpCouponId: string | null;
  setPdpCouponId: (id: string | null) => void;
  onSelect?: () => void;
}) {
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
        return t('coupon.reason.minSpend', { min: ev.minSpend?.toFixed?.(2) ?? String(c.minSpend), defaultValue: `Min spend $${c.minSpend}` });
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
    selected && selEv?.ok
      ? previewDiscountForLine(lineItems[0]!.id, lineItems[0]!.price, lineItems[0]!.quantity, selected)
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
    <div ref={detailsRef} className="relative z-[45] w-full h-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-semibold px-3 py-2 rounded-lg bg-secondary text-[#fff] border border-[#4E554B]/6 flex w-full h-full cursor-pointer items-center justify-between gap-2"
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <Ticket className="h-4 w-4 shrink-0 text-[#D8CBB8]" />
          <span className="truncate">{summaryText}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#fff]/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 max-h-[min(40vh,220px)] overflow-y-auto rounded-xl p-2 min-w-[280px] bg-[#000000cc] backdrop-blur-xl border-t border-primary/30 shadow-[0_-4px_30px_-10px_hsl(43_72%_55%/0.2)]">
          <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
            {t('cart.couponBestHint', { defaultValue: 'Best coupon' })}
          </p>
          <div className="space-y-1">
            {availableWallet.map((c) => {
              const ev = evaluateCouponForCart(c, lineItems);
              const ok = ev.ok;
              const reason = couponReason(c);
              const save = ok ? previewDiscountForLine(lineItems[0]!.id, lineItems[0]!.price, lineItems[0]!.quantity, c) : 0;
              return (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-start gap-2 rounded-lg p-2 transition-colors ${
                    ok ? 'hover:bg-[#D8CBB8]/8' : 'cursor-not-allowed opacity-55'
                  } ${pdpCouponId === c.id && ok ? 'bg-[#D8CBB8]/12' : ''}`}
                >
                  <input
                    type="radio"
                    name="sticky-coupon"
                    className="mt-1 accent-[#f4cf71]"
                    checked={pdpCouponId === c.id}
                    disabled={!ok}
                    onChange={() => handleSelect(c, ok)}
                  />
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-xs font-bold text-[#fff]">{c.title}</span>
                    <span className="font-mono text-[10px] text-gray-200">{c.code}</span>
                    {ok && save > 0 && (
                      <span className="mt-0.5 block text-[11px] font-semibold text-gold-gradient">-${save.toFixed(2)}</span>
                    )}
                    {!ok && reason && <span className="mt-0.5 block text-[10px] text-red-600/90">{reason}</span>}
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

export default function StickyBottomBar({
  skuOptions,
  selectedProductId,
  onSelectProduct,
  onShopNow,
  couponData,
}: StickyBottomBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shake, setShake] = useState(false);
  const currentSku = skuOptions.find((s) => s.id === selectedProductId) ?? skuOptions[1];

  const selectedCoupon =
    couponData?.pdpCouponId && couponData.availableWallet.length > 0
      ? couponData.availableWallet.find((c) => c.id === couponData.pdpCouponId) ?? null
      : null;
  const quantity = couponData?.lineItems[0]?.quantity ?? 1;

  const currentPricing = currentSku
    ? getSkuDisplayPricing(currentSku, selectedCoupon, quantity)
    : { displayPrice: 0, saveLabel: '' };

  const displayPrice = `$${formatUsd(currentPricing.displayPrice)}`;
  const saveText = currentPricing.saveLabel ? `Save ${currentPricing.saveLabel}` : '';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Shake animation every 5 seconds when visible
  useEffect(() => {
    if (!visible) return;
    const shakeInterval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 5000);
    return () => clearInterval(shakeInterval);
  }, [visible]);

  const handleSelectProduct = (skuId: string) => {
    onSelectProduct(skuId);
    setExpanded(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      {expanded && (
        <div className="bg-card/98 backdrop-blur-xl border-t border-border px-3 sm:px-4 pt-3 pb-2 max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {skuOptions.map((sku: SkuOption) => {
              const { displayPrice: skuDisplayPrice } = getSkuDisplayPricing(sku, selectedCoupon, quantity);

              return (
              <button
                key={sku.id}
                onClick={() => handleSelectProduct(sku.id)}
                className={`relative flex flex-col items-center rounded-lg border transition-all text-center pt-6 pb-2 px-1.5 active:scale-[0.98] ${
                  selectedProductId === sku.id
                    ? 'border-primary bg-secondary shadow-gold'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                {sku.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-body text-[9px] sm:text-xs font-bold whitespace-nowrap">
                    {sku.badge}
                  </span>
                )}
                <img
                  src={sku.image}
                  alt={sku.name}
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain mb-1"
                />
                <span className="font-body text-[10px] sm:text-xs font-bold text-foreground leading-tight">
                  {sku.name}
                </span>
                <span className="font-body font-bold text-sm sm:text-base text-foreground mt-0.5">
                  ${formatUsd(skuDisplayPrice)}
                </span>
                <span className="text-[9px] sm:text-xs text-foreground/40 line-through font-body">
                  ${formatUsd(sku.original)}
                </span>
              </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-card/98 backdrop-blur-xl border-t border-primary/30 shadow-[0_-4px_30px_-10px_hsl(43_72%_55%/0.2)]">
        <style>{shakeKeyframes}</style>
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          {/* 移动端：优惠券选择器展示在按钮上方 */}
          {couponData && couponData.availableWallet.length > 0 && (
            <div className="md:hidden mb-2">
              <CouponPicker
                lineItems={couponData.lineItems}
                availableWallet={couponData.availableWallet}
                pdpCouponId={couponData.pdpCouponId}
                setPdpCouponId={couponData.setPdpCouponId}
                onSelect={couponData.handlePdpManualSelect}
              />
            </div>
          )}

          {/* 统一高度的容器 */}
          <div className="flex items-stretch gap-2 sm:gap-3 h-11 sm:h-12">
          <button
            onClick={() => setExpanded(!expanded)}
            className="h-full flex items-center gap-2 bg-secondary rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 border border-border hover:border-primary/50 transition-colors flex-shrink-0"
          >
            <img src={currentSku?.image} alt="" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            <div className="text-left">
              <p className="font-body text-[10px] sm:text-sm font-bold text-foreground leading-tight">
                {currentSku?.name}
              </p>
              <p className="font-body text-[9px] sm:text-xs text-primary font-bold">{saveText}</p>
            </div>
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/50" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/50" />
            )}
          </button>

          <div className="flex-1 flex items-center gap-2 sm:gap-3 h-full">
            {/* 优惠券选择器 — 桌面端内联显示 */}
            {couponData && couponData.availableWallet.length > 0 && (
              <div className="hidden md:block flex-shrink-0 w-[200px] xl:w-[240px] h-full">
                <CouponPicker
                  lineItems={couponData.lineItems}
                  availableWallet={couponData.availableWallet}
                  pdpCouponId={couponData.pdpCouponId}
                  setPdpCouponId={couponData.setPdpCouponId}
                  onSelect={couponData.handlePdpManualSelect}
                />
              </div>
            )}

            {/* Buy Now button with dynamic price */}
            <div className="relative flex-1 h-full">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground font-body text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-lg z-50">
                🎉 {saveText}
              </span>
              <button
                onClick={() => onShopNow()}
                disabled={!selectedProductId}
                className="w-full h-full bg-gold-gradient text-primary-foreground font-body font-bold text-sm sm:text-lg rounded-xl hover:opacity-90 transition-opacity animate-pulse-gold active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                style={shake ? { animation: 'shake 0.5s ease-in-out, pulse-gold 2s ease-in-out infinite' } : undefined}
              >
                Buy Now — {displayPrice}
              </button>
            </div>
          </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-2 sm:pb-2.5 whitespace-nowrap overflow-hidden px-2">
          <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-primary/60 flex-shrink-0" />
          <span className="font-body text-[8px] sm:text-xs text-foreground/40 font-semibold truncate">
            30-Day Money Back Guarantee · Free Shipping · Secure Checkout · 100% Satisfaction
          </span>
        </div>
      </div>
    </div>
  );
}