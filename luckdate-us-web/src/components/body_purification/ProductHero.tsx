'use client';

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gallery1 from "@/assets/body_purification/gallery-1.jpg";
import gallery2 from "@/assets/body_purification/gallery-2.jpg";
import gallery3 from "@/assets/body_purification/gallery-3.jpg";
import gallery4 from "@/assets/body_purification/gallery-4.jpg";
import gallery5 from "@/assets/body_purification/gallery-5.jpg";
import gallery6 from "@/assets/body_purification/gallery-6.jpg";
import { getImageSrc } from "./utils";
import { LazyImg } from './LazyMedia';
import type { GoodsItem } from '@/lib/api/types';
import type { UserCoupon } from '@/lib/coupons/types';
import type { CartItem } from '@/context/CartContext';
import { CouponPicker } from '@/components/body_purification/StickyCart';
import { getBodyPurificationSkuPricing } from '@/components/body_purification/skuPricing';

const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

const benefits = [
  { text: <><strong>Neutralizes</strong> body & breath odors <strong>naturally</strong></> },
  { text: <><strong>Feel fresh</strong> and <strong>clean</strong> in 7–14 days</> },
  { text: <><strong>Clinically</strong> proven & <strong>third-party</strong> tested</> },
  { text: <><strong>Cleanses</strong> the body of <strong>toxins</strong> and promotes fresh underarms, private areas, and breath</> },
  { text: <><strong>Vegan</strong>, 100% <strong>natural</strong> & FDA cleared</> },
];

function useFluctuatingNumber(min: number, max: number, intervalMs: number) {
  const [isClient, setIsClient] = useState(false);
  const [value, setValue] = useState(() => Math.floor((min + max) / 2));
  
  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setValue((prev) => {
        const delta = Math.random() < 0.5 ? -1 : 1;
        const multiplier = Math.random() < 0.3 ? 2 : 1;
        let next = prev + delta * multiplier;
        if (next < min) next = min + Math.floor(Math.random() * 3);
        if (next > max) next = max - Math.floor(Math.random() * 3);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [min, max, intervalMs]);
  
  return isClient ? value : Math.floor((min + max) / 2);
}

const CheckIcon = () => (
  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const PulsingDot = ({ color }: { color: string }) => (
  <span className="relative flex h-2.5 w-2.5">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
  </span>
);

const StarRating = () => (
  <div className="flex text-brand-gold">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-5 h-5 fill-current text-[#e0af00]" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))}
  </div>
);

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

interface ProductHeroProps {
  skuOptions: SkuOption[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onShopNow: () => void;
  currentSku: SkuOption;
  products: GoodsItem[];
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

const ProductHero = ({
  skuOptions,
  selectedProductId,
  onSelectProduct,
  onShopNow,
  currentSku,
  products,
  couponData,
}: ProductHeroProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [countdown, setCountdown] = useState(30 * 60);
  const autoplayRef = useRef<number | null>(null);

  const viewingNow = useFluctuatingNumber(18, 47, 4000);
  const rawPurchases = useFluctuatingNumber(3, 12, 7000);
  const recentPurchases = Math.min(rawPurchases, Math.floor(viewingNow * 0.35));

  const loading = products.length === 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    autoplayRef.current = window.setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    };
  }, []);

  const goPrev = () => setSelectedImage((p) => (p - 1 + images.length) % images.length);
  const goNext = () => setSelectedImage((p) => (p + 1) % images.length);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const selectedCoupon =
    couponData?.pdpCouponId && couponData.availableWallet && couponData.availableWallet.length > 0
      ? couponData.availableWallet.find((c) => c.id === couponData.pdpCouponId) ?? null
      : null;
  const quantity = couponData?.lineItems?.[0]?.quantity ?? 1;

  const currentPricing = currentSku
    ? getBodyPurificationSkuPricing(currentSku, selectedCoupon, quantity)
    : { displayPrice: 0, displayPriceStr: '$0', savePercent: 0 };

  return (
    <section className="py-4 sm:py-5 lg:py-7">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-7 lg:gap-12">
          {/* Left: Gallery */}
          <div className="lg:w-[55%] flex flex-col gap-3 sm:gap-4">
            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-secondary shadow-md sm:shadow-lg group cursor-zoom-in">
              {images.map((img, i) => (
                <LazyImg
                  key={i}
                  src={getImageSrc(img)}
                  alt={`LuckDate Body Purification ${i + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ease-out group-hover:scale-105 ${
                    selectedImage === i ? 'relative z-0 opacity-100' : 'absolute inset-0 z-0 opacity-0 pointer-events-none'
                  }`}
                />
              ))}
              <button
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/90 hover:bg-background shadow-md flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/90 hover:bg-background shadow-md flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      selectedImage === i ? "w-6 bg-primary" : "w-1.5 bg-background/70"
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-3 sm:flex sm:justify-center sm:flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square w-full sm:w-[72px] sm:h-[72px] rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === i
                      ? "border-primary shadow-md ring-2 ring-primary/20"
                      : "border-border opacity-60 hover:opacity-100 hover:border-primary/30"
                  }`}
                >
                  <LazyImg src={getImageSrc(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-[45%] flex flex-col">
            {/* Title */}
            <h2 className="font-display leading-[1.15] mb-2 sm:mb-3 tracking-tight">
              {/* <span className="block text-2xl sm:text-3xl lg:text-[2.4rem] font-bold text-brand-dark">
                LuckDate
              </span> */}
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mt-1">
                Body Purification Chlorophyll Capsules
              </span>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-medium text-muted-foreground italic mt-1.5 font-body tracking-wide">
                For Body Odor · Detox · Skin
              </span>
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
              <StarRating />
              <span className="text-xs sm:text-sm text-muted-foreground">
                4.9 (4,249 verified reviews)
              </span>
            </div>

            {/* Price */}
            {!loading && currentSku && (
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
                <span className="text-2xl sm:text-3xl font-bold tabular-nums">{currentPricing.displayPriceStr}</span>
                <span className="text-base sm:text-lg text-muted-foreground line-through tabular-nums">{currentSku.originalPrice}</span>
                <span className="bg-primary/10 text-primary text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  💰 Save {currentPricing.savePercent}%
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-border mb-4 sm:mb-5" />

            {/* Benefits */}
            <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-2 sm:gap-2.5 text-[13px] sm:text-sm leading-relaxed">
                  <CheckIcon />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Countdown */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                Limited offer ends in{" "}
                <span className="text-destructive font-bold tabular-nums">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* SKU Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse text-center p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-border">
                    <div className="pt-1.5 sm:pt-2">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-200 rounded mb-1.5 sm:mb-2" />
                      <div className="h-4 bg-gray-200 rounded mb-1" />
                      <div className="h-3 bg-gray-200 rounded mb-1.5 sm:mb-2 w-3/4 mx-auto" />
                      <div className="h-6 bg-gray-200 rounded mb-0.5 w-2/3 mx-auto" />
                      <div className="h-3 bg-gray-200 rounded mt-0.5 w-1/2 mx-auto" />
                    </div>
                  </div>
                ))
              ) : (
                skuOptions.map((sku) => {
                  const skuPricing = getBodyPurificationSkuPricing(sku, selectedCoupon, quantity);

                  return (
                  <button
                    key={sku.id}
                    onClick={() => onSelectProduct(sku.id)}
                    className={`relative text-center p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                      selectedProductId === sku.id
                        ? "border-primary bg-accent/60 shadow-md scale-[1.02]"
                        : "border-border hover:border-primary/40 hover:shadow-sm"
                    }`}
                  >
                    {sku.badge && (
                      <span className={`absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 rounded-full whitespace-nowrap shadow-sm ${
                        sku.badge === "Most Popular"
                          ? "bg-primary text-primary-foreground"
                          : "bg-brand-gold text-primary-foreground"
                      }`}>
                        {sku.badge}
                      </span>
                    )}
                    <div className="pt-1.5 sm:pt-2">
                      <LazyImg src={sku.image} alt={sku.label} className="w-12 h-12 sm:w-16 sm:h-16 mx-auto object-contain mb-1.5 sm:mb-2" />
                      <p className="font-bold text-[12px] sm:text-[13px] leading-tight mb-0.5">{sku.label}</p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">{sku.subtitle}</p>
                      <p className="font-bold text-lg sm:text-xl leading-none tabular-nums">{skuPricing.displayPriceStr}</p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground line-through mt-0.5 tabular-nums">{sku.originalPrice}</p>
                      <p className="text-[11px] sm:text-xs text-primary font-semibold mt-0.5 sm:mt-1">Save {skuPricing.savePercent}%</p>
                    </div>
                  </button>
                  );
                })
              )}
            </div>

            {/* Buy Now with Save badge */}
            <div className="flex flex-col md:flex-row gap-3 relative">
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
                const displayPrice = currentPricing.displayPriceStr;
                const savePctText = `${currentPricing.savePercent}`;

                return (
                  <>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-0.5 sm:py-1 rounded-full whitespace-nowrap shadow-md z-10 tabular-nums">
                      💰 Save {savePctText}% Off
                    </span>
                    <button
                      onClick={onShopNow}
                      disabled={loading || !selectedProductId}
                      className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-bold py-3.5 sm:py-4 rounded-full text-base sm:text-lg transition-all duration-200 uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Buy Now — {loading ? '...' : displayPrice}
                    </button>
                  </>
                );
              })()}
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col items-center gap-1.5 mt-4 mb-3 sm:mb-4">
              <span className="flex items-center gap-2 text-xs sm:text-sm">
                <PulsingDot color="bg-primary" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground tabular-nums">{viewingNow}</strong> people are viewing this right now
                </span>
              </span>
              <span className="flex items-center gap-2 text-xs sm:text-sm">
                <PulsingDot color="bg-destructive" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground tabular-nums">{recentPurchases}</strong> people purchased recently
                </span>
              </span>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-1" />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-muted-foreground py-3 max-w-xs mx-auto">
              <span className="flex items-center gap-1.5">📦 Free Shipping</span>
              <span className="flex items-center gap-1.5">🛡️ 30-Day Guarantee</span>
              <span className="flex items-center gap-1.5">🔒 Secure Checkout</span>
              <span className="flex items-center gap-1.5">✅ 100% Satisfaction</span>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-1" />

            {/* Low Stock */}
            <div className="text-center pt-2 sm:pt-3">
              <p className="text-destructive font-semibold text-sm sm:text-[15px] mb-0.5">
                ⚠️ Warning: Low Stock Notice
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                This supplement <strong>sold out 8 times last year.</strong> We
                encourage you to take advantage of this limited sale and buy now.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
