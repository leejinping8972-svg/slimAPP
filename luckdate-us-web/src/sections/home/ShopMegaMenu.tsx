'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import slim7 from '@/assets/home/products/slim-7day-open-kit.png';
import slim28 from '@/assets/home/products/slim-28day-open-kit.png';
import slimDrink from '@/assets/home/products/slim-7day-hero-drink.png';
import slim28Pack from '@/assets/home/products/slim-28day-hero-pack.png';
import gutPack from '@/assets/home/products/gut-balance-packaging.png';
import featuredPromo from '@/assets/home/products/barrier-slim-7-28-display.png';

export type ShopNavProduct = {
  id: string;
  title: string;
  tagline: string;
  href: string;
  thumb: StaticImageData;
  badge?: string;
};

export const SHOP_NAV_PRODUCTS: ShopNavProduct[] = [
  {
    id: '7day',
    title: 'Slim Vitality 7-Day',
    tagline: 'Start the chocolate ritual.',
    href: '/slim_1#plans',
    thumb: slim7,
  },
  {
    id: '28day',
    title: 'Slim Vitality 28-Day',
    tagline: 'The daily ritual you keep.',
    href: '/slim_1#plans',
    thumb: slim28,
    badge: 'BESTSELLER',
  },
  {
    id: 'drink',
    title: '7-Day Ritual Kit',
    tagline: '16g protein · ready-to-mix.',
    href: '/slim_1',
    thumb: slimDrink,
  },
  {
    id: '28pack',
    title: '28-Day Full Kit',
    tagline: 'A full month of vitality.',
    href: '/slim_1#plans',
    thumb: slim28Pack,
  },
  {
    id: 'gut',
    title: 'Gut Balance',
    tagline: 'Daily inner-reset sachets.',
    href: '/products',
    thumb: gutPack,
  },
];

type ShopMegaMenuProps = {
  open: boolean;
  onNavigate: (href: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

/** ARMRA-style Shop mega panel — product list + featured promo. */
export function ShopMegaMenu({ open, onNavigate, onMouseEnter, onMouseLeave }: ShopMegaMenuProps) {
  return (
    <div
      data-shop-panel
      className={`nav-dropdown-shop fixed inset-x-0 z-[105] origin-top transition-[opacity,visibility] duration-150 ${
        open
          ? 'pointer-events-auto visible opacity-100'
          : 'pointer-events-none invisible opacity-0'
      }`}
      style={{ top: 'var(--nav-dropdown-top, 0px)' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-hidden={!open}
    >
      {/* Invisible bridge into the nav so the cursor never falls through a gap */}
      <div className="pointer-events-auto absolute inset-x-0 -top-3 h-3" aria-hidden />

      <div className="bg-white shadow-[0_18px_40px_rgba(30,38,28,0.12)]">
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[minmax(280px,0.95fr)_1.15fr]">
          {/* Left: product list */}
          <div className="border-b border-[#E8E8E8] px-6 py-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-7 xl:px-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E261C]">
                Shop Products
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/products')}
                className="group inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7A62] transition-colors hover:text-[#1E261C]"
              >
                Shop All
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </div>

            <ul className="space-y-1">
              {SHOP_NAV_PRODUCTS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.href)}
                    className="group flex w-full items-center gap-3 rounded-sm px-2 py-2.5 text-left transition-colors hover:bg-[#F7F5F1]"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-[#F0EDE7]">
                      <Image
                        src={item.thumb}
                        alt=""
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-[#1E261C] group-hover:underline group-hover:underline-offset-4">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="shrink-0 bg-[#6B7A62] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-[#6C6763]">{item.tagline}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: featured promo */}
          <div className="relative min-h-[280px] overflow-hidden bg-[#EDE8E0] lg:min-h-[420px]">
            <Image
              src={featuredPromo}
              alt="Slim Vitality 7-Day and 28-Day ritual kits"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 55vw, 100vw"
              priority={open}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <p className="max-w-md text-xl font-bold leading-tight text-white sm:text-2xl lg:text-[1.75rem]">
                Your ritual starts here.
                <br />
                <span className="font-semibold text-white/90">7-Day &amp; 28-Day Slim Vitality.</span>
              </p>
              <Link
                href="/slim_1#plans"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/slim_1#plans');
                }}
                className="mt-5 inline-flex items-center gap-2 bg-[#D8CBB8] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#1E261C] transition-opacity hover:opacity-90"
              >
                Shop Now
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
