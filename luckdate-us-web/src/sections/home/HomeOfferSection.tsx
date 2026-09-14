'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/sections/Products';
import displayImage from '@/assets/home/products/barrier-slim-7-28-display.png';
import thumb7 from '@/assets/home/products/slim-7day-open-kit.png';
import thumb28 from '@/assets/home/products/slim-28day-open-kit.png';

type OfferKey = '7day' | '28day';

const OFFERS: Record<
  OfferKey,
  {
    name: string;
    meta: string;
    sale: number;
    compare: number;
    thumb: typeof thumb7;
    match: RegExp;
  }
> = {
  '7day': {
    name: 'Slim Vitality™ 7-Day',
    meta: '7-Day Supply · Chocolate Ritual',
    sale: 19.9,
    compare: 29.9,
    thumb: thumb7,
    match: /7[\s-]?day/i,
  },
  '28day': {
    name: 'Slim Vitality™ 28-Day',
    meta: '28-Day Supply · Vitality Ritual',
    sale: 69.9,
    compare: 99.9,
    thumb: thumb28,
    match: /28[\s-]?day/i,
  },
};

const BENEFITS = [
  'Free U.S. shipping over $50',
  '30-day money-back guarantee',
  '16g protein · daily chocolate pour',
  'Easy reorder anytime',
];

function formatMoney(n: number) {
  return n.toFixed(2).replace(/\.00$/, '');
}

function savingsPercent(sale: number, compare: number) {
  if (compare <= sale) return 0;
  return Math.round(((compare - sale) / compare) * 100);
}

type HomeOfferSectionProps = {
  products?: Product[];
};

/** ARMRA-style third-screen purchase block — left product art, right checkout CTA. */
export function HomeOfferSection({ products = [] }: HomeOfferSectionProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [selected, setSelected] = useState<OfferKey>('28day');

  const resolved = useMemo(() => {
    const base = OFFERS[selected];
    const api = products.find((p) => base.match.test(p.name));
    return {
      ...base,
      id: api?.id,
      name: api?.name || base.name,
      sale: api?.price ?? base.sale,
      compare: api?.marketPrice && api.marketPrice > 0 ? api.marketPrice : base.compare,
      image: api?.image || base.thumb.src,
    };
  }, [products, selected]);

  const off = savingsPercent(resolved.sale, resolved.compare);

  const handleAdd = () => {
    if (resolved.id != null) {
      addToCart({
        id: resolved.id,
        name: resolved.name,
        price: resolved.sale,
        image: resolved.image,
      });
      setIsCartOpen(true);
      return;
    }
    router.push(selected === '28day' ? '/shop/nutrition-28-day' : '/shop/nutrition-7-day');
  };

  return (
    <section
      id="start-ritual"
      className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
    >
      {/* Soft multi-tone aura (ARMRA-like) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(240,210,190,0.55)_0%,transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(200,220,230,0.45)_0%,transparent_45%),radial-gradient(ellipse_at_60%_80%,rgba(210,230,200,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_40%_70%,rgba(235,220,160,0.35)_0%,transparent_45%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[#F7F5F1]/55" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:px-10 xl:gap-14 xl:px-16">
        {/* Left: product still life — fill the column, less empty padding */}
        <div className="relative mx-auto w-full lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8E0]/50 sm:aspect-square lg:aspect-[5/6] xl:min-h-[560px] xl:aspect-auto">
            <Image
              src={displayImage}
              alt="Slim Vitality 7-Day and 28-Day chocolate ritual kits"
              fill
              className="scale-[1.12] object-cover object-center sm:scale-[1.08] lg:scale-110"
              sizes="(min-width: 1024px) 55vw, 100vw"
              priority
            />
          </div>
        </div>

        {/* Right: purchase column */}
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1E261C]">
            Your ritual starts here
          </p>
          <h2 className="mt-3 font-['Montserrat'] text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[#1E261C] sm:text-4xl lg:text-[2.5rem]">
            {off > 0 ? `${off}% off your ritual kit` : 'Start your Slim Vitality ritual'}
          </h2>

          {/* Product picker row */}
          <div className="mt-8 space-y-3">
            {(Object.keys(OFFERS) as OfferKey[]).map((key) => {
              const offer = OFFERS[key];
              const api = products.find((p) => offer.match.test(p.name));
              const sale = api?.price ?? offer.sale;
              const compare =
                api?.marketPrice && api.marketPrice > 0 ? api.marketPrice : offer.compare;
              const active = selected === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  className={`flex w-full items-center gap-3 border bg-white/70 px-3 py-3 text-left transition-colors sm:gap-4 sm:px-4 ${
                    active
                      ? 'border-[#1E261C] ring-1 ring-[#1E261C]'
                      : 'border-[#1E261C]/12 hover:border-[#1E261C]/35'
                  }`}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-[#F0EDE7] sm:h-16 sm:w-16">
                    <Image
                      src={offer.thumb}
                      alt=""
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#1E261C] sm:text-[15px]">
                      {api?.name || offer.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6C6763]">{offer.meta}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-[#1E261C] sm:text-base">
                      ${formatMoney(sale)}
                    </p>
                    {compare > sale && (
                      <p className="text-xs text-[#6C6763] line-through">${formatMoney(compare)}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-6 w-full bg-[#1E261C] py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
          >
            {selected === '28day' ? 'Shop 28-Day Ritual' : 'Shop 7-Day Ritual'}
          </button>

          <p className="mt-3 bg-[#E8DFB8]/55 px-3 py-2 text-center text-xs text-[#1E261C]">
            Claim your welcome coupon at checkout for extra savings
          </p>

          <div className="mt-8 border-t border-[#1E261C]/12 pt-6">
            <ul className="space-y-3">
              {BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#1E261C]/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E261C] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
