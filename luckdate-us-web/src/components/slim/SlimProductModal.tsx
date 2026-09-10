'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Star, ShoppingBag } from 'lucide-react';
import type { GoodsItem } from '@/lib/api/types';
import { FALLBACK_PLANS } from './SlimPricing';
import productImg from '@/assets/slim/slim-product-hero.png';

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(/\.00$/, '');
}

interface SlimProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: GoodsItem[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onSubmitOrder: () => void | Promise<boolean>;
}

export default function SlimProductModal({
  isOpen,
  onClose,
  products,
  selectedProductId,
  onSelectProduct,
  onSubmitOrder,
}: SlimProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const options = FALLBACK_PLANS.map((plan, index) => {
    const product = products[index];
    return {
      ...plan,
      productId: product?.id ?? `fallback-${plan.key}`,
      salePrice: product ? formatPrice(product.sale_price) : plan.priceLabel,
      linePrice: product ? formatPrice(product.line_price) : plan.compareLabel,
      canOrder: Boolean(product?.id),
      realId: product?.id ?? null,
    };
  });

  const selected =
    options.find((o) => o.realId === selectedProductId) ||
    options.find((o) => o.canOrder) ||
    options[1];

  const handleSubmit = async () => {
    if (!selected?.realId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const success = await onSubmitOrder();
      if (!success) setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative bg-[#FBFAF7] rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#737A65]/10">
        <button
          onClick={() => !isSubmitting && onClose()}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-[#2C322E]" />
        </button>

        <div className="p-6 bg-[#E8F0EA]">
          <div className="flex items-center gap-4">
            <Image
              src={productImg}
              alt="Luckdate Slim"
              className="w-20 h-20 object-cover rounded-2xl bg-white"
              width={80}
              height={80}
            />
            <div>
              <h3 className="text-lg font-medium text-[#2C322E] mb-0.5">Luckdate Slim</h3>
              <p className="text-xs text-[#6C6763]">Vitality + Sunny + 28-Day Ritual</p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-[#B59461] text-[#B59461]" />
                ))}
                <span className="text-[11px] text-[#6C6763] ml-1">4.9</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6C6763]">
            Choose Your Journey
          </p>
          {options.map((plan) => {
            const isSelected = selected?.productId === plan.productId;
            return (
              <button
                key={plan.key}
                type="button"
                disabled={!plan.canOrder && products.length > 0}
                onClick={() => {
                  if (plan.realId) onSelectProduct(plan.realId);
                }}
                className={`w-full text-left rounded-2xl p-4 border-2 transition-all relative ${
                  isSelected
                    ? 'border-[#737A65] bg-[#E8F0EA]'
                    : 'border-[#737A65]/10 bg-white hover:border-[#737A65]/25'
                } ${!plan.canOrder && products.length === 0 ? 'opacity-90' : ''}`}
              >
                {plan.badge && (
                  <span className="absolute top-0 right-0 bg-[#737A65] text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-xl rounded-tr-xl">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#2C322E]">{plan.name}</p>
                    <p className="text-xs text-[#6C6763] mt-0.5">{plan.tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold text-[#737A65]">${plan.salePrice}</p>
                    <p className="text-xs text-[#6C6763] line-through">${plan.linePrice}</p>
                  </div>
                </div>
              </button>
            );
          })}
          {products.length === 0 && (
            <p className="text-[11px] text-[#6C6763] text-center pt-1">
              Plans shown for preview. Checkout activates when inventory is linked.
            </p>
          )}
        </div>

        <div className="p-5 pt-2 border-t border-[#737A65]/8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selected?.realId}
            className="w-full bg-[#737A65] text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#5F6558] transition-colors disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            {isSubmitting
              ? 'Processing…'
              : selected?.realId
                ? `Checkout · $${selected.salePrice}`
                : 'Select a plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
