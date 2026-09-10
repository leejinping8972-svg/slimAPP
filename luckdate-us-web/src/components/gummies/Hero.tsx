'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Flame, Star, Clock, Check } from 'lucide-react';
import a1Img from '@/assets/gummies/probiotic-gummies-hero.jpg';
import type { GoodsItem } from '@/lib/api/types';

interface HeroProps {
  products: GoodsItem[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onOpenProductModal: () => void;
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(1).replace(/\.0$/, '');
}

export default function Hero({
  products,
  selectedProductId,
  onSelectProduct,
  onOpenProductModal,
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [stockCount, setStockCount] = useState(100);

  useEffect(() => {
    setStockCount(Math.floor(Math.random() * 50) + 80);
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const [time, setTime] = useState({ h: 7, m: 0, s: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollY = window.scrollY;
        const parallaxValue = scrollY * 0.15;
        imageRef.current.style.transform = `translateY(${parallaxValue}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const STORAGE_KEY = 'luckdate_gummies_countdown_end';
    const SEVEN_HOURS_MS = 7 * 60 * 60 * 1000;

    function getTimeLeft() {
      if (typeof window === 'undefined') return { h: 7, m: 0, s: 0 };
      const now = Date.now();
      let end = 0;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) end = parseInt(stored, 10);
      } catch {
        /* ignore */
      }
      if (!end || now >= end) {
        const newEnd = now + SEVEN_HOURS_MS;
        try {
          localStorage.setItem(STORAGE_KEY, String(newEnd));
        } catch {
          /* ignore */
        }
        end = newEnd;
      }
      const remaining = Math.max(0, end - now);
      if (remaining <= 0) {
        try {
          localStorage.setItem(STORAGE_KEY, String(now + SEVEN_HOURS_MS));
        } catch {
          /* ignore */
        }
        return { h: 7, m: 0, s: 0 };
      }
      const h = Math.floor(remaining / (60 * 60 * 1000));
      const m = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const s = Math.floor((remaining % (60 * 1000)) / 1000);
      return { h, m, s };
    }

    const tick = () => setTime(getTimeLeft());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const productButtons = products.slice(0, 2);

  return (
    <section ref={heroRef} className="relative min-h-screen bg-light-gray overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-soft-pink/20 rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-mint-green/10 rounded-[100%] blur-[100px] pointer-events-none" />

      <div className="bg-gradient-to-r from-deep-rose to-[#d4a0a4] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm font-body">
          <Flame className="w-4 h-4 animate-pulse" />
          <span className="font-semibold">Flash Sale: UP TO 50% OFF</span>
          <span className="hidden sm:inline text-white/60">|</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
            </span>
          </div>
          <span className="hidden sm:inline text-white/60">|</span>
          <span className="hidden sm:inline text-yellow-200 font-medium">Only {stockCount} left</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 pb-16 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-250px)]">
          <div
            ref={imageRef}
            className="order-1 lg:order-2 relative opacity-0 animate-fade-in flex items-center justify-center"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-mint-green/40 to-soft-pink/40 rounded-[3rem] transform rotate-3 scale-95" />
              <div className="relative rounded-t-[3rem] rounded-b-[1rem] overflow-hidden shadow-soft-xl border border-dark-charcoal/5 bg-white">
                <Image
                  src={a1Img}
                  alt="Aura Probiotic Gummies — Women's Intimate Health"
                  className="w-full h-auto object-cover"
                  width={400}
                  height={400}
                />
              </div>
              <div
                className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-soft-lg p-3 animate-float"
                style={{ animationDelay: '1.5s' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFA41C] text-[#FFA41C]" />
                    ))}
                  </div>
                  <span className="font-body text-xs font-bold text-dark-charcoal">4.9</span>
                  <span className="font-body text-xs text-medium-gray">(2,847)</span>
                </div>
              </div>
              <div
                className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-soft-lg p-3 animate-float"
                style={{ animationDelay: '1s' }}
              >
                <div className="text-center">
                  <p className="font-heading text-xl font-semibold text-deep-rose">60</p>
                  <p className="font-body text-[10px] text-medium-gray">Gummies</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-1 space-y-6">
            <div
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-soft opacity-0 animate-fade-in-up border border-dark-charcoal/5"
              style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
            >
              <span className="text-sm font-body font-medium text-dark-charcoal">⭐ 92% Repurchase Rate</span>
            </div>

            <h2
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-dark-charcoal leading-[1.1] tracking-tight opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              Feel Fresh.
              <br />
              <span className="italic text-deep-rose font-light">Feel Free.</span>
            </h2>

            <p
              className="text-base md:text-lg text-medium-gray font-body leading-relaxed max-w-md opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
            >
              Premium probiotic gummies with Slippery Elm + Ginkgo Leaf for intimate moisture, pH balance, and
              all-day confidence.
            </p>

            <div
              className="space-y-3 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
            >
              {productButtons.map((product, index) => {
                const salePrice = formatPrice(product.sale_price);
                const linePrice = formatPrice(product.line_price);
                const saveAmount = (product.line_price - product.sale_price) / 100;
                const isSelected = selectedProductId === product.id;
                const showBestValue = index === 0 && productButtons.length >= 2;
                const labels = [
                  { title: 'Buy 2 Get 1 FREE', desc: '3 Bottles · 180 Gummies' },
                  { title: 'One Bottle', desc: '60 Gummies' },
                ];
                const label = labels[index] ?? { title: product.name, desc: product.description ?? '' };

                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product.id);
                      onOpenProductModal();
                    }}
                    className={`w-full text-left rounded-2xl p-4 border-2 transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? 'border-deep-rose bg-soft-pink/40 shadow-soft-lg'
                        : 'border-dark-charcoal/10 bg-white hover:border-deep-rose/40'
                    }`}
                  >
                    {showBestValue && (
                      <div className="absolute top-0 right-0 bg-deep-rose text-white text-[10px] font-body font-bold px-3 py-1 rounded-bl-xl">
                        🔥 BEST VALUE
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body text-sm font-bold text-dark-charcoal">
                          {label.title}
                        </p>
                        <p className="font-body text-xs text-medium-gray mt-0.5">
                          {label.desc}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading text-xl font-bold text-deep-rose">
                          ${salePrice}
                        </p>
                        <p className="font-body text-xs text-medium-gray line-through">
                          ${linePrice}
                        </p>
                        {saveAmount > 0 && (
                          <p className="font-body text-[10px] font-bold text-green-600">
                            Save ${saveAmount.toFixed(1).replace(/\.0$/, '')}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
            >
              <button
                onClick={onOpenProductModal}
                className="group relative w-full bg-deep-rose text-white px-6 py-5 rounded-full font-body font-medium overflow-hidden transition-all duration-500 hover:shadow-soft-xl hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-full" />
                <ShoppingCart className="w-5 h-5 relative z-10" />
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-lg">Buy Now</span>
                  {selectedProduct && (
                    <>
                      <span className="line-through opacity-60 text-sm">
                        ${formatPrice(selectedProduct.line_price)}
                      </span>
                      <span className="font-bold text-2xl">
                        ${formatPrice(selectedProduct.sale_price)}
                      </span>
                    </>
                  )}
                </span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-3 sm:hidden">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="font-body text-xs text-medium-gray">
                  <span className="font-bold text-red-500">{stockCount}</span> people viewing now · Limited
                  stock
                </span>
              </div>
            </div>

            <div
              className="flex flex-wrap items-center gap-3 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
            >
              {['Free Shipping', '30-Day Guarantee', 'Natural'].map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 text-xs font-body text-medium-gray">
                  <Check className="w-3.5 h-3.5 text-mint-green stroke-[3]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
