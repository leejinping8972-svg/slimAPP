'use client';

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Ticket } from "lucide-react";
import { getImageSrc } from "./utils";
import { LazyImg } from './LazyMedia';
import type { GoodsItem } from '@/lib/api/types';
import type { UserCoupon } from '@/lib/coupons/types';
import type { CartItem } from '@/context/CartContext';
import { evaluateCouponForCart, previewDiscountForLine } from '@/lib/coupons/engine';
import { getBodyPurificationSkuPricing } from '@/components/body_purification/skuPricing';
import { useTranslation } from 'react-i18next';

// Shake animation keyframes
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}
`;

export type SkuOption = {
  id: string;
  label: string;
  subtitle: string;
  price: string;
  perUnit: string;
  originalPrice: string;
  badge: string | null;
  image: string;
};

interface StickyCartProps {
  skuOptions: SkuOption[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onShopNow: () => void;
  currentSku: SkuOption;
  products: GoodsItem[];
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
        className="text-sm font-semibold px-3 py-2 rounded-lg bg-[#F7F5F1] text-[#4E554B] border border-[#4E554B]/6 flex w-full h-full cursor-pointer items-center justify-between gap-2"
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <Ticket className="h-4 w-4 shrink-0 text-[#D8CBB8]" />
          <span className="truncate">{summaryText}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#333]/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 max-h-[min(40vh,220px)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-2 shadow-lg min-w-[280px]">
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
                    className="mt-1 accent-[#D8CBB8]"
                    checked={pdpCouponId === c.id}
                    disabled={!ok}
                    onChange={() => handleSelect(c, ok)}
                  />
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-xs font-bold text-[#4E554B]">{c.title}</span>
                    <span className="font-mono text-[10px] text-gray-500">{c.code}</span>
                    {ok && save > 0 && (
                      <span className="mt-0.5 block text-[11px] font-semibold text-[#D8CBB8]">-${save.toFixed(2)}</span>
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

const StickyCart = ({
  skuOptions,
  selectedProductId,
  onSelectProduct,
  onShopNow,
  currentSku,
  products,
  couponData,
}: StickyCartProps) => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  const loading = products.length === 0;

  const selectedCoupon =
    couponData?.pdpCouponId && couponData.availableWallet.length > 0
      ? couponData.availableWallet.find((c) => c.id === couponData.pdpCouponId) ?? null
      : null;
  const quantity = couponData?.lineItems[0]?.quantity ?? 1;

  const currentPricing = currentSku
    ? getBodyPurificationSkuPricing(currentSku, selectedCoupon, quantity)
    : { displayPrice: 0, displayPriceStr: '$0', savePercent: 0 };

  const displayPrice = currentPricing.displayPriceStr;
  const saveText = `Save ${currentPricing.savePercent}%`;

  // Shake animation every 5 seconds
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  if (!visible || loading) return null;

  return (
    <>
      <style>{shakeKeyframes}</style>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
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
          {/* SKU Selector (compact, click to expand) */}
          <div className="relative flex-shrink-0" ref={popRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="h-full flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg border-2 border-border hover:border-primary/50 bg-card transition-colors"
              aria-expanded={open}
            >
              <LazyImg
                src={currentSku?.image ?? ''}
                alt={currentSku?.label ?? ''}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
              />
              <div className="flex flex-col items-start leading-tight text-left">
                <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
                  {currentSku?.label}
                </span>
                <span className="text-[11px] sm:text-xs text-brand-gold font-semibold tabular-nums">
                  {saveText}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {/* Popover with SKU options */}
            {open && (
              <div className="absolute bottom-full left-0 mb-2 w-[280px] bg-popover border-2 border-border rounded-xl shadow-2xl p-2 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {skuOptions.map((sku) => {
                  const active = selectedProductId === sku.id;
                  const skuPricing = getBodyPurificationSkuPricing(sku, selectedCoupon, quantity);

                  return (
                    <button
                      key={sku.id}
                      onClick={() => {
                        onSelectProduct(sku.id);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                        active ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        active ? "border-primary" : "border-muted-foreground/40"
                      }`}>
                        {active && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <LazyImg src={sku.image} alt={sku.label} className="w-10 h-10 object-contain flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold leading-tight">{sku.label}</p>
                        <p className="text-[11px] tabular-nums">
                          <span className="font-semibold">{skuPricing.displayPriceStr}</span>{" "}
                          <span className="text-muted-foreground line-through">{sku.originalPrice}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-brand-gold tabular-nums whitespace-nowrap">
                        Save {skuPricing.savePercent}%
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 优惠券选择器 + Buy Now 按钮 (左右排列) */}
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
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md z-10 tabular-nums">
                💰 {saveText}
              </span>
              <button
                onClick={onShopNow}
                disabled={!selectedProductId}
                className={`w-full h-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-bold px-4 rounded-lg text-sm sm:text-base transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] tabular-nums ${shake ? 'shake-animation' : ''}`}
                style={shake ? { animation: 'shake 0.5s ease-in-out' } : undefined}
              >
                Buy Now — {displayPrice}
              </button>
            </div>
          </div>
        </div>

        {/* Trust row — single line on all screens */}
        <div className="mt-2 text-center text-[9px] sm:text-xs text-muted-foreground leading-snug whitespace-nowrap overflow-hidden">
          <span className="inline-flex items-center justify-center gap-x-1 sm:gap-x-1.5">
            <span><span className="text-brand-gold">🛡️</span> 30-Day Guarantee</span>
            <span className="opacity-60">·</span>
            <span>Free Shipping</span>
            <span className="opacity-60">·</span>
            <span>Secure Checkout</span>
            <span className="opacity-60">·</span>
            <span>100% Satisfaction</span>
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

export default StickyCart;