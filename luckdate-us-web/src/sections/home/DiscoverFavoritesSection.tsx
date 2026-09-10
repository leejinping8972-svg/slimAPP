'use client';

import Image from 'next/image';
import Link from 'next/link';
import slim7 from '@/assets/home/products/slim-7day-open-kit.png';
import slim28 from '@/assets/home/products/slim-28day-open-kit.png';
import slim7Drink from '@/assets/home/products/slim-7day-hero-drink.png';
import slim28Pack from '@/assets/home/products/slim-28day-hero-pack.png';

type ProductCard = {
  title: string;
  meta: string;
  href: string;
  image: typeof slim7;
  badge?: string;
};

const FAVORITES: ProductCard[] = [
  {
    title: 'Slim Vitality™ 7-Day',
    meta: 'Chocolate · 7-Day Vitality Ritual',
    href: '/slim_1#plans',
    image: slim7,
    badge: 'Starter',
  },
  {
    title: 'Slim Vitality™ 28-Day',
    meta: 'Chocolate · 28-Day Vitality Ritual',
    href: '/slim_1#plans',
    image: slim28,
    badge: 'Bestseller',
  },
  {
    title: '7-Day Ritual Kit',
    meta: '16g protein · Ready-to-mix sachets',
    href: '/slim_1',
    image: slim7Drink,
  },
  {
    title: '28-Day Ritual Kit',
    meta: 'Full month · Daily chocolate ritual',
    href: '/slim_1',
    image: slim28Pack,
  },
];

/** Featured Slim series — 7-day & 28-day specs. */
export function DiscoverFavoritesSection() {
  return (
    <section id="discover-favorites" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
              Slim Vitality Series
            </p>
            <h2 className="mt-2 font-['Montserrat'] text-3xl font-bold text-[#1E261C] sm:text-4xl">
              7-Day & 28-Day Rituals
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[#6C6763]/90">
              Chocolate nutrition drink mix — start with 7 days, or commit to the full 28-Day Vitality
              Ritual.
            </p>
          </div>
          <Link
            href="/slim_1"
            className="shrink-0 text-xs font-bold uppercase tracking-[0.16em] text-[#1E261C] underline underline-offset-4"
          >
            Shop Slim
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {FAVORITES.map((product) => (
            <Link key={product.title} href={product.href} className="group flex min-w-0 flex-col">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EDE7]">
                {product.badge && (
                  <span className="absolute left-3 top-3 z-10 bg-[#5C4033] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    {product.badge}
                  </span>
                )}
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04] sm:p-5"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-['Montserrat'] text-sm font-bold text-[#1E261C] sm:text-base">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs text-[#6C6763] sm:text-sm">{product.meta}</p>
                <span className="mt-3 inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7A62]">
                  Shop now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
