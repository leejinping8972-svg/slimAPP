'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import nutrition28 from '@/assets/home/products/slim-28day-open-kit.png';
import nutrition7 from '@/assets/home/products/slim-7day-open-kit.png';
import fruitVeg from '@/assets/home/products/gut-fruit-veg-flavors.jpg';
import probiotics from '@/assets/home/products/gut-balance-probiotic-box.jpg';

type ProductCard = {
  title: string;
  meta: string;
  href: string;
  image: StaticImageData;
  badge?: string;
};

const FAVORITES: ProductCard[] = [
  {
    title: '28-Day Nutrition Supplement',
    meta: 'Chocolate · Full-month vitality ritual',
    href: '/shop/nutrition-28-day',
    image: nutrition28,
    badge: 'Bestseller',
  },
  {
    title: '7-Day Nutrition Supplement',
    meta: 'Travel size · Start the chocolate ritual',
    href: '/shop/nutrition-7-day',
    image: nutrition7,
    badge: 'Travel',
  },
  {
    title: 'Fruit & Vegetable Powder',
    meta: 'Gut management · Pink Guava & Oats',
    href: '/shop/fruit-vegetable-powder',
    image: fruitVeg,
  },
  {
    title: 'Gut Balance Probiotics',
    meta: 'Gut management · 30 Billion CFU',
    href: '/shop/gut-balance-probiotics',
    image: probiotics,
  },
];

/** Homepage product recommendations — nutrition + gut management. */
export function DiscoverFavoritesSection() {
  return (
    <section id="discover-favorites" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
              Shop recommendations
            </p>
            <h2 className="mt-2 font-['Montserrat'] text-3xl font-bold text-[#1E261C] sm:text-4xl">
              Nutrition & Gut Management
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[#6C6763]/90">
              28-Day and 7-Day nutrition supplements, plus fruit &amp; vegetable powder and probiotics
              for daily gut balance.
            </p>
          </div>
          <Link
            href="/products"
            className="shrink-0 text-xs font-bold uppercase tracking-[0.16em] text-[#1E261C] underline underline-offset-4"
          >
            Shop All
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
