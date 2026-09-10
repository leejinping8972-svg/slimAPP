'use client';

import Image from 'next/image';
import { Check, ShieldCheck, Truck, CreditCard, RefreshCw } from 'lucide-react';
import type { GoodsItem } from '@/lib/api/types';
import SlimReveal from './SlimReveal';
import productImg from '@/assets/slim/system-products.png';

export const FALLBACK_PLANS = [
  {
    key: 'trial',
    name: '7-Day Trial Pack',
    tagline: '7 Sachets',
    priceLabel: '19.90',
    compareLabel: '29.90',
    badge: '',
    includes: ['7 daily sachets', 'App activation guide', 'Sunny onboarding'],
  },
  {
    key: 'journey',
    name: '28-Day Journey',
    tagline: '28 Sachets',
    priceLabel: '69.90',
    compareLabel: '99.90',
    badge: 'Most Popular',
    includes: ['28 daily sachets', 'Full Sunny AI journey', 'Progress tracking'],
  },
  {
    key: 'complete',
    name: '28-Day Complete Ritual',
    tagline: '28 Sachets + Shaker Cup',
    priceLabel: '79.90',
    compareLabel: '119.90',
    badge: '',
    includes: ['28 daily sachets', 'Branded shaker cup', 'Full Sunny AI journey'],
  },
] as const;

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(/\.00$/, '');
}

interface SlimPricingProps {
  products: GoodsItem[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onShopNow: () => void;
}

const assurances = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: ShieldCheck, label: '30-Day Guarantee' },
  { icon: CreditCard, label: 'Secure Payments' },
  { icon: RefreshCw, label: 'Cancel Anytime' },
];

export default function SlimPricing({
  products,
  selectedProductId,
  onSelectProduct,
  onShopNow,
}: SlimPricingProps) {
  const plans = FALLBACK_PLANS.map((plan, index) => {
    const product = products[index];
    return {
      ...plan,
      productId: product?.id ?? null,
      salePrice: product ? formatPrice(product.sale_price) : plan.priceLabel,
      linePrice: product ? formatPrice(product.line_price) : plan.compareLabel,
      displayName: product?.name || plan.name,
    };
  });

  const handleSelect = (productId: string | null, index: number) => {
    if (productId) onSelectProduct(productId);
    else if (products[index]) onSelectProduct(products[index].id);
    onShopNow();
  };

  return (
    <section id="plans" className="py-14 md:py-20 bg-[#F9F7F2]">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8">
        <SlimReveal className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[2.65rem] font-medium text-[#2C322E] leading-tight mb-2">
            Choose Your Journey.
          </h2>
          <p className="text-sm md:text-[15px] text-[#6C6763]">
            Find the perfect start for you.
          </p>
        </SlimReveal>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 items-stretch">
          {plans.map((plan, index) => {
            const isPopular = plan.badge === 'Most Popular';
            const isSelected = plan.productId != null && plan.productId === selectedProductId;

            return (
              <SlimReveal
                key={plan.key}
                delay={index * 70}
                className={`relative rounded-[1.5rem] bg-white p-5 md:p-6 flex flex-col border transition-all ${
                  isPopular
                    ? 'border-[#2A4035] shadow-soft-lg md:-translate-y-1 ring-1 ring-[#2A4035]'
                    : 'border-[#2A4035]/10'
                } ${isSelected && !isPopular ? 'ring-2 ring-[#2A4035]/40' : ''}`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2A4035] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                )}

                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#EEF4EF] mb-4">
                  <Image
                    src={productImg}
                    alt={plan.displayName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <h3 className="text-lg font-medium text-[#2C322E] mb-0.5">{plan.displayName}</h3>
                <p className="text-xs text-[#6C6763] mb-3">{plan.tagline}</p>

                <div className="mb-4">
                  <span className="text-2xl font-semibold text-[#2A4035]">${plan.salePrice}</span>
                  <span className="ml-1.5 text-xs text-[#6C6763]">USD</span>
                </div>

                <ul className="space-y-2 mb-5 flex-1">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#2C322E]/80">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2A4035]" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelect(plan.productId, index)}
                  className="w-full py-3.5 rounded-full text-sm font-semibold bg-[#2A4035] text-white hover:bg-[#1E2F27] transition-colors"
                >
                  Add to Cart
                </button>
              </SlimReveal>
            );
          })}
        </div>

        <SlimReveal delay={180} className="mt-9 flex flex-wrap justify-center gap-5 sm:gap-8">
          {assurances.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-xs text-[#6C6763]">
              <Icon className="w-3.5 h-3.5 text-[#2A4035]" />
              {label}
            </span>
          ))}
        </SlimReveal>
      </div>
    </section>
  );
}
