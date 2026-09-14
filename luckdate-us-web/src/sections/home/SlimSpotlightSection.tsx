'use client';

import Image from 'next/image';
import Link from 'next/link';
import slimImage from '@/assets/home/products/slim-vitality-flavors.png';
import gutImage from '@/assets/home/products/gut-balance-packaging.png';

const SPOTLIGHTS = [
  {
    id: 'slim-vitality',
    eyebrow: 'Daily Fiber Ritual',
    title: 'Slim Vitality™',
    body: 'Pour. Shake. Enjoy. A daily fiber + plant blend ritual with Pink Guava and Oat & Grains — kits from 7 to 30 days, with optional shaker.',
    primary: { label: 'Explore Slim Vitality', href: '/shop/nutrition-28-day' },
    secondary: { label: 'Choose a Kit', href: '/shop/nutrition-28-day' },
    image: slimImage,
    tone: 'sage' as const,
  },
  {
    id: 'gut-balance',
    eyebrow: '30-Day Inner Reset',
    title: 'Gut Balance',
    body: 'Probiotic + prebiotic formula with 30 Billion CFU — a daily sachet ritual for digestive comfort, microbiome support, and inner balance.',
    primary: { label: 'Shop Gut Balance', href: '/shop/gut-balance-probiotics' },
    secondary: { label: 'Learn the Formula', href: '/blog' },
    image: gutImage,
    tone: 'cream' as const,
  },
];

export function SlimSpotlightSection() {
  return (
    <div id="luckdate-slim">
      {SPOTLIGHTS.map((item) => {
        const isSage = item.tone === 'sage';
        return (
          <section
            key={item.id}
            id={item.id}
            className={`relative isolate min-h-[min(72vh,680px)] overflow-hidden ${
              isSage ? 'bg-[#5F6B57]' : 'bg-[#2F3630]'
            }`}
          >
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover object-center opacity-55"
              sizes="100vw"
              aria-hidden
            />
            <div
              className={`absolute inset-0 ${
                isSage
                  ? 'bg-gradient-to-r from-[#4A5544] via-[#4A5544]/80 to-[#4A5544]/20'
                  : 'bg-gradient-to-r from-[#2A302A] via-[#2A302A]/82 to-[#2A302A]/25'
              }`}
              aria-hidden
            />

            <div className="relative z-10 flex min-h-[min(72vh,680px)] items-end">
              <div className="w-full px-4 pb-14 pt-24 sm:px-6 sm:pb-16 lg:px-12 xl:px-20">
                <div className="mx-auto max-w-7xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D8CBB8] sm:text-xs">
                    {item.eyebrow}
                  </p>
                  <h2 className="max-w-[14ch] font-['Montserrat'] text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl break-words">
                    {item.title}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                    {item.body}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={item.primary.href}
                      className="inline-flex items-center justify-center bg-[var(--brand-moon-beige)] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#2A302A] transition-colors hover:bg-[#E5D9C6]"
                    >
                      {item.primary.label}
                    </Link>
                    <Link
                      href={item.secondary.href}
                      className="inline-flex items-center justify-center border border-white/45 px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/10"
                    >
                      {item.secondary.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
