'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import heroIndoor from '@/assets/home/hero/hero-indoor-hd.jpg';
import heroProducts from '@/assets/home/hero/hero-products-wide.jpg';

const SLIDES: { src: StaticImageData; alt: string }[] = [
  {
    src: heroProducts,
    alt: 'Slim Vitality 7-Day and 28-Day chocolate kits with luckdate shaker',
  },
  {
    src: heroIndoor,
    alt: 'Slim Vitality chocolate ritual with luckdate shaker and cocoa packaging',
  },
];

/**
 * Hero height = viewport − live header height (ResizeObserver updates the CSS var).
 * Stays fully below the sticky banner on any screen size.
 */
export function HomeHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="home-hero"
      className="relative isolate w-full overflow-hidden bg-[#EDE8E0]"
      style={{
        height: 'calc(100svh - var(--site-header-height, 7rem))',
        minHeight: '22rem',
      }}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.alt}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={i === index ? slide.alt : ''}
            fill
            priority={i === 0}
            quality={95}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      <div
        className="absolute inset-0 bg-gradient-to-r from-[#EDE8E0]/95 via-[#EDE8E0]/55 to-transparent sm:from-[#EDE8E0]/90 sm:via-[#EDE8E0]/35 lg:via-[#EDE8E0]/20"
        aria-hidden
      />

      <div className="relative z-10 flex h-full items-center">
        <div className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-12 xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-xl lg:max-w-[36rem]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62] sm:mb-4">
                Slim Vitality · Chocolate
              </p>
              <h1 className="break-words font-['Montserrat'] text-[clamp(1.85rem,4.5vw,4rem)] font-bold leading-[1.02] tracking-[-0.02em] text-[#1E261C]">
                Your Ritual
                <br className="hidden sm:block" /> of Vitality
              </h1>
              <p className="mt-4 max-w-md text-[clamp(0.9rem,1.6vw,1rem)] leading-relaxed text-[#3D4638]/90 sm:mt-5">
                Slim Vitality Nutrition Drink Mix — 7-Day starter or 28-Day full ritual. 16g protein,
                chocolate flavor, with the luckdate shaker for your daily pour.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
                <Link
                  href="#discover-favorites"
                  className="inline-flex items-center justify-center bg-[#1E261C] px-9 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
                >
                  Shop Luckdate
                </Link>
                <Link
                  href="/shop/nutrition-28-day"
                  className="inline-flex items-center justify-center border border-[#1E261C]/40 px-9 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#1E261C] transition-colors hover:bg-white/50"
                >
                  28-Day Ritual
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-6">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.alt}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 w-7 transition-colors ${
              i === index ? 'bg-[#1E261C]' : 'bg-[#1E261C]/25'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
