'use client';

import { Truck, ShieldCheck, Lock, ThumbsUp } from 'lucide-react';
import StarRating from './StarRating';
import SkuSelector from './SkuSelector';
import type { SkuOption } from '@/lib/shilajit-constants';

interface BottomCTAProps {
  skuOptions: SkuOption[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onShopNow: () => void;
}

export default function BottomCTA({
  skuOptions,
  selectedProductId,
  onSelectProduct,
  onShopNow,
}: BottomCTAProps) {
  const currentSku = skuOptions.find((s) => s.id === selectedProductId) ?? skuOptions[0];

  return (
    <section className="py-8 sm:py-20 bg-card border-t border-border">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 text-center">
        <div className="flex items-center justify-center mb-1.5 sm:mb-4">
          <StarRating size="lg" />
        </div>
        <h2 className="font-display text-lg sm:text-3xl lg:text-5xl font-bold text-foreground mb-1.5 sm:mb-3">
          Ready to Transform?
        </h2>
        <p className="text-foreground/60 font-body text-[11px] sm:text-base mb-4 sm:mb-10 max-w-lg mx-auto leading-relaxed">
          Experience the power of 10 premium ingredients in every gummy. Choose your supply and start your journey today.
        </p>

        <p className="font-body text-[10px] sm:text-sm font-semibold text-foreground/60 uppercase tracking-wide mb-2 sm:mb-3">
          Choose your supply below
        </p>

        <div className="mb-4 sm:mb-6">
          <SkuSelector
            selectedId={selectedProductId ?? ''}
            onSelect={onSelectProduct}
            options={skuOptions}
          />
        </div>

        <button
          onClick={() => onShopNow()}
          disabled={!selectedProductId}
          className="w-full py-3 sm:py-4 bg-gold-gradient text-primary-foreground font-body font-bold text-sm sm:text-lg rounded-xl hover:opacity-90 transition-opacity animate-pulse-gold active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Buy Now — $ {currentSku?.price ?? '0'}
        </button>

        <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
          <div className="flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg bg-secondary/60 border border-border">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
            <span className="font-body text-[11px] sm:text-sm font-semibold text-foreground/70">30 Day Money Back Guarantee</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: Lock, label: 'Secure Checkout' },
              { icon: ThumbsUp, label: '100% Satisfaction' },
              { icon: Truck, label: 'Free Shipping' },
            ].map((g) => (
              <div key={g.label} className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-lg bg-secondary/60 border border-border">
                <g.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="font-body text-[9px] sm:text-sm font-semibold text-foreground/70 text-center leading-tight">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
