'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Truck, Check, ChevronLeft, ChevronRight, ShieldCheck, Lock, ThumbsUp, Leaf, WheatOff, Dna } from 'lucide-react';
import Image from 'next/image';
import StarRating from './StarRating';
import SkuSelector from './SkuSelector';
import SocialProof from './SocialProof';
import { PRODUCT_BENEFITS, HERO_AUTOPLAY_MS, type SkuOption } from '@/lib/shilajit-constants';
import type { UserCoupon } from '@/lib/coupons/types';
import type { CartItem } from '@/context/CartContext';
import { CouponPicker } from './StickyBottomBar';

// Shake animation keyframes
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}
`;

import productHero from '@/assets/shilajit/product-hero.jpg';
import productBlend from '@/assets/shilajit/product-blend.jpg';
import productFacts from '@/assets/shilajit/product-facts.jpg';
import productEnergy from '@/assets/shilajit/product-energy.jpg';
import productPower from '@/assets/shilajit/product-power.jpg';
import productComparison from '@/assets/shilajit/product-comparison.jpg';

const GALLERY_IMAGES = [productHero, productBlend, productFacts, productEnergy, productPower, productComparison];

interface ProductHeroProps {
  skuOptions: SkuOption[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onShopNow: () => void;
  couponData?: {
    hasDiscount: boolean;
    discountedPrice: number;
    discountAmount: number;
    originalPrice: number;
    lineItems?: CartItem[];
    availableWallet?: UserCoupon[];
    pdpCouponId?: string | null;
    setPdpCouponId?: (id: string | null) => void;
    handlePdpManualSelect?: () => void;
  };
}

const ProductHero = ({ skuOptions, selectedProductId, onSelectProduct, onShopNow, couponData }: ProductHeroProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [shake, setShake] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Shake animation every 5 seconds
  useEffect(() => {
    const shakeInterval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 5000);
    return () => clearInterval(shakeInterval);
  }, []);

  const nextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % GALLERY_IMAGES.length);
  }, []);

  const prevImage = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  }, []);

  useEffect(() => {
    if (isHovering) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(nextImage, HERO_AUTOPLAY_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHovering, nextImage]);

  const currentSku = skuOptions.find((s) => s.id === selectedProductId) ?? skuOptions[1];

  return (
    <section id="product-hero" className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-10 lg:py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-10 lg:gap-14 items-start">
        <div className="space-y-2 sm:space-y-4 md:sticky md:top-28 md:self-start lg:top-8">
          <div
            className="aspect-square rounded-xl overflow-hidden bg-secondary cursor-zoom-in group relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {GALLERY_IMAGES.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt="Luckdate Shilajit Gummies"
                fill
                className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                  i === selectedImage ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            ))}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background/90 transition-all active:scale-90"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background/90 transition-all active:scale-90"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative flex-shrink-0 w-11 h-11 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === selectedImage ? 'border-primary' : 'border-border'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
            {[
              { icon: Leaf, label: 'Vegan-Friendly' },
              { icon: WheatOff, label: 'Gluten-Free' },
              { icon: Dna, label: 'Non-GMO' },
            ].map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl bg-secondary/60 border border-primary/20">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <c.icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                </div>
                <span className="font-body text-xs sm:text-sm font-semibold text-foreground/70 text-center leading-tight">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-5">
          <div>
            <p className="text-primary font-body text-xs sm:text-sm font-semibold tracking-wider uppercase">LUCKDATE</p>
            <h2 className="font-display text-lg sm:text-3xl lg:text-5xl font-bold text-foreground mt-0.5">
              10 in 1 Shilajit Gummies
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <StarRating />
            <span className="text-xs sm:text-sm text-foreground/70 font-body">4.9/5 (2,400+ reviews)</span>
          </div>

          <p className="font-display text-sm sm:text-xl font-semibold text-gold-gradient">
            The Ultimate 10-in-1 Wellness Formula
          </p>
          <p className="text-xs sm:text-base text-foreground/80 font-body leading-relaxed">
            According to customer feedback, many users experienced noticeable improvements in as little as 30 days.
          </p>

          <p className="text-xs sm:text-sm font-body font-semibold text-foreground/70 uppercase tracking-wide">
            Per Serving Gummies a Day Helps Support:
          </p>
          <ul className="space-y-1.5 sm:space-y-2">
            {PRODUCT_BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2 text-xs sm:text-base font-body text-foreground/80">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" /> {b}
              </li>
            ))}
          </ul>

          {/* <div className="bg-secondary/50 border border-border rounded-lg p-2.5 sm:p-3 text-center">
            <p className="text-xs sm:text-sm font-body text-foreground/70">
              Pure Himalayan Shilajit produced in limited monthly quantities.{" "}
              <span className="text-destructive font-semibold">Only 13 left</span>
            </p>
          </div> */}

          <p className="font-body text-xs sm:text-sm font-semibold text-foreground/60 text-center uppercase tracking-wide">
            Choose your supply below
          </p>

          <SkuSelector
            selectedId={selectedProductId ?? ''}
            onSelect={onSelectProduct}
            options={skuOptions}
            couponContext={
              couponData?.availableWallet && couponData.availableWallet.length > 0
                ? {
                    selectedCoupon: couponData.pdpCouponId
                      ? couponData.availableWallet.find((c) => c.id === couponData.pdpCouponId) ?? null
                      : null,
                    quantity: 1,
                  }
                : undefined
            }
          />

          <div className="relative pt-4 sm:pt-0">
            <style>{shakeKeyframes}</style>
            <div className="flex flex-col md:flex-row gap-3">
              {couponData && couponData.availableWallet && couponData.availableWallet.length > 0 && couponData.lineItems && couponData.pdpCouponId !== undefined && couponData.setPdpCouponId && (
                <div className="w-full md:w-[240px] h-11 md:h-auto">
                  <CouponPicker
                    lineItems={couponData.lineItems}
                    availableWallet={couponData.availableWallet}
                    pdpCouponId={couponData.pdpCouponId}
                    setPdpCouponId={couponData.setPdpCouponId}
                    onSelect={couponData.handlePdpManualSelect}
                  />
                </div>
              )}
              <div className="flex-1 relative">
            {(() => {
              const displayPrice = couponData?.hasDiscount
                ? `$${couponData.discountedPrice.toFixed(2)}`
                : `$${currentSku?.price ?? '0'}`;
              const saveAmount = couponData?.hasDiscount
                ? couponData.discountAmount.toFixed(2)
                : ((currentSku?.original ?? 0) - (currentSku?.price ?? 0)).toFixed(1);
              const saveText = couponData?.hasDiscount
                ? `${Math.round((couponData.discountAmount / couponData.originalPrice) * 100)}%`
                : currentSku?.save || '0';

              return (
                <>
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 px-3 py-0.5 sm:px-4 sm:py-1 rounded-full bg-primary text-primary-foreground font-body text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-lg sm:-top-3">
                    🎉 Save ${saveAmount} ({saveText} OFF)
                  </span>
                  <button
                    onClick={onShopNow}
                    disabled={!selectedProductId}
                    className="w-full py-3 sm:py-4 bg-gold-gradient text-primary-foreground font-body font-bold text-sm sm:text-lg rounded-xl hover:opacity-90 transition-opacity animate-pulse-gold active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    style={shake ? { animation: 'shake 0.5s ease-in-out, pulse-gold 2s ease-in-out infinite' } : undefined}
                  >
                    Buy Now — {displayPrice}
                  </button>
                </>
              );
            })()}
              </div>
            </div>
          </div>

          <SocialProof />

          <div className="space-y-2 sm:space-y-3 pt-1">
            <div className="flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg bg-secondary/60 border border-border">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="font-body text-xs sm:text-sm font-semibold text-foreground/70">30 Day Money Back Guarantee</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: Lock, label: 'Secure Checkout' },
                { icon: ThumbsUp, label: '100% Satisfaction' },
                { icon: Truck, label: 'Free Shipping' },
              ].map((g) => (
                <div key={g.label} className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-lg bg-secondary/60 border border-border">
                  <g.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="font-body text-[10px] sm:text-sm font-semibold text-foreground/70 text-center leading-tight">{g.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
