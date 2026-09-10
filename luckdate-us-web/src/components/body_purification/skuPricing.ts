import { previewDiscountForLine } from '@/lib/coupons/engine';
import type { UserCoupon } from '@/lib/coupons/types';

export function parseUsdString(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

export function formatUsdString(value: number): string {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`;
}

export type BodyPurificationSkuPricingInput = {
  id: string;
  price: string;
  originalPrice: string;
};

export function getBodyPurificationSkuPricing(
  sku: BodyPurificationSkuPricingInput,
  coupon: UserCoupon | null,
  quantity: number,
): { displayPrice: number; displayPriceStr: string; savePercent: number } {
  const unitPrice = parseUsdString(sku.price);
  const original = parseUsdString(sku.originalPrice);
  const productId = Number(sku.id);

  const discount =
    coupon && Number.isFinite(productId)
      ? previewDiscountForLine(productId, unitPrice, quantity, coupon)
      : 0;

  const displayPrice =
    discount > 0 ? Math.max(0, (unitPrice * quantity - discount) / quantity) : unitPrice;

  const savePercent =
    original > 0 ? Math.round(((original - displayPrice) / original) * 100) : 0;

  return {
    displayPrice,
    displayPriceStr: formatUsdString(displayPrice),
    savePercent,
  };
}
