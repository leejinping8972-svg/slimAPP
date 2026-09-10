'use client';

import { SKU_OPTIONS, type SkuOption } from '@/lib/shilajit-constants';
import { previewDiscountForLine } from '@/lib/coupons/engine';
import type { UserCoupon } from '@/lib/coupons/types';

export interface SkuSelectorCouponContext {
  selectedCoupon: UserCoupon | null;
  quantity?: number;
}

interface SkuSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  options?: SkuOption[];
  couponContext?: SkuSelectorCouponContext;
}

export function formatUsd(value: number): string {
  return value % 1 === 0 ? String(value) : value.toFixed(2);
}

export function getSkuDisplayPricing(
  sku: SkuOption,
  coupon: UserCoupon | null,
  quantity: number,
): { displayPrice: number; saveLabel: string } {
  const productId = Number(sku.id);
  const discount =
    coupon && Number.isFinite(productId)
      ? previewDiscountForLine(productId, sku.price, quantity, coupon)
      : 0;

  const displayPrice =
    discount > 0 ? Math.max(0, (sku.price * quantity - discount) / quantity) : sku.price;

  const savePercent =
    sku.original > 0 ? Math.round(((sku.original - displayPrice) / sku.original) * 100) : 0;

  return {
    displayPrice,
    saveLabel: savePercent > 0 ? `${savePercent}%` : sku.save,
  };
}

export default function SkuSelector({ selectedId, onSelect, options, couponContext }: SkuSelectorProps) {
  const skuList = options ?? SKU_OPTIONS;
  const quantity = couponContext?.quantity ?? 1;
  const selectedCoupon = couponContext?.selectedCoupon ?? null;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
      {skuList.map((sku: SkuOption) => {
        const { displayPrice, saveLabel } = getSkuDisplayPricing(sku, selectedCoupon, quantity);

        return (
        <button
          key={sku.id}
          onClick={() => onSelect(sku.id)}
          className={`relative flex flex-col items-center rounded-xl border-2 transition-all text-center pt-7 sm:pt-8 lg:pt-9 pb-3 sm:pb-4 px-1.5 sm:px-2 lg:px-3 active:scale-[0.98] ${
            selectedId === sku.id
              ? 'border-primary bg-secondary shadow-gold'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          {sku.badge && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-2 sm:px-3 lg:px-4 py-0.5 sm:py-1 rounded-full bg-primary text-primary-foreground font-body text-[9px] sm:text-[10px] lg:text-xs font-bold whitespace-nowrap shadow-md">
              {sku.badge}
            </span>
          )}

          {sku.image && (
            <img
              src={sku.image}
              alt={sku.name}
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-contain mb-1.5 sm:mb-2 lg:mb-3"
            />
          )}

          <span className="font-body text-[10px] sm:text-xs lg:text-sm font-bold text-foreground leading-tight">
            {sku.name}
          </span>

          <span className="text-[8px] sm:text-[10px] lg:text-sm text-foreground/50 font-body mt-0.5 whitespace-nowrap">
            {sku.serving}
          </span>

          <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5 lg:mt-2">
            <span className="text-[9px] sm:text-[10px] lg:text-sm text-foreground/40 line-through font-body">
              ${formatUsd(sku.original)}
            </span>
            <span className="font-body font-bold text-base sm:text-lg lg:text-2xl text-foreground">
              ${formatUsd(displayPrice)}
            </span>
          </div>

          <span className="text-[8px] sm:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5 rounded bg-primary/20 text-primary font-body font-bold mt-1 sm:mt-1.5">
            Save {saveLabel}
          </span>
        </button>
        );
      })}
    </div>
  );
}
