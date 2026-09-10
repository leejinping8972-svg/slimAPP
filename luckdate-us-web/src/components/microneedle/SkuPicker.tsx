'use client';

import type { ReactNode } from 'react';
import { Check, Lock, RotateCcw, Truck } from 'lucide-react';
import {
  formatMicroneedlePrice,
  getSkuPerBoxDisplayPrice,
  type MicroneedleSkuOption,
} from '@/lib/microneedle/skus';

type SkuPickerProps = {
  skuOptions: MicroneedleSkuOption[];
  selected: string;
  onSelect: (id: string) => void;
  compact?: boolean;
  onCheckout: () => void;
  isSubmitting?: boolean;
  checkoutDisabled?: boolean;
  checkoutPrice: number;
  originalCheckoutPrice?: number;
  hasDiscount?: boolean;
  couponPicker?: ReactNode;
};

export default function SkuPicker({
  skuOptions,
  selected,
  onSelect,
  compact,
  onCheckout,
  isSubmitting = false,
  checkoutDisabled = false,
  checkoutPrice,
  originalCheckoutPrice,
  hasDiscount = false,
  couponPicker,
}: SkuPickerProps) {
  const selectedSku = skuOptions.find((sku) => sku.id === selected) ?? skuOptions[1] ?? skuOptions[0];
  const displayOriginal = originalCheckoutPrice ?? selectedSku?.price ?? 0;
  const gridCols = compact
    ? 'grid-cols-1'
    : skuOptions.length <= 1
      ? 'grid-cols-1'
      : skuOptions.length === 2
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-3';

  return (
    <div>
      <div className={`grid gap-3 ${gridCols}`}>
        {skuOptions.map((sku) => (
          <SkuCard
            key={sku.id}
            sku={sku}
            active={sku.id === selected}
            onSelect={() => onSelect(sku.id)}
            perBoxPrice={getSkuPerBoxDisplayPrice(sku, {
              isSelected: sku.id === selected,
              checkoutPrice,
              hasDiscount,
            })}
          />
        ))}
      </div>

      <div className="mt-6">
        {couponPicker}

        <button
          type="button"
          onClick={onCheckout}
          disabled={checkoutDisabled || isSubmitting}
          className="w-full bg-[oklch(0.25_0.015_60)] hover:bg-[oklch(0.18_0.015_60)] disabled:opacity-60 disabled:cursor-not-allowed text-[oklch(0.97_0.02_80)] text-sm font-medium tracking-[0.14em] uppercase py-4 rounded-sm transition-colors"
        >
          {isSubmitting ? (
            'Processing…'
          ) : hasDiscount ? (
            <>
              Secure Checkout —{' '}
              <span className="line-through opacity-70 mr-1">${displayOriginal.toFixed(2)}</span>
              ${checkoutPrice.toFixed(2)}
            </>
          ) : (
            `Secure Checkout — $${checkoutPrice.toFixed(2)}`
          )}
        </button>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Stripe Secured
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Ships within 24h
          </span>
          <span className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            60-day money-back
          </span>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Visa · Mastercard · American Express · Apple Pay · Google Pay
        </p>
      </div>
    </div>
  );
}

function SkuCard({
  sku,
  active,
  onSelect,
  perBoxPrice,
}: {
  sku: MicroneedleSkuOption;
  active: boolean;
  onSelect: () => void;
  perBoxPrice: number;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative text-left bg-card p-5 rounded-sm border-2 transition-all w-full ${
        active
          ? 'border-[oklch(0.52_0.085_55)] shadow-lg'
          : 'border-border hover:border-[oklch(0.72_0.08_70)]'
      }`}
    >
      {sku.badge && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[oklch(0.25_0.015_60)] text-[oklch(0.92_0.04_75)] text-[10px] tracking-[0.18em] uppercase px-3 py-1 rounded-sm whitespace-nowrap">
          {sku.badge}
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-serif text-lg text-foreground">{sku.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{sku.subtitle}</div>
        </div>
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            active ? 'border-[oklch(0.52_0.085_55)] bg-[oklch(0.52_0.085_55)]' : 'border-border'
          }`}
        >
          {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-serif text-2xl text-foreground">${formatMicroneedlePrice(sku.price)}</span>
        {sku.original > sku.price && (
          <span className="text-sm text-muted-foreground line-through">
            ${formatMicroneedlePrice(sku.original)}
          </span>
        )}
      </div>
      <div className="text-xs text-[oklch(0.45_0.08_55)] mt-1">
        ${formatMicroneedlePrice(perBoxPrice)}/box · {sku.shipping}
      </div>
    </button>
  );
}
