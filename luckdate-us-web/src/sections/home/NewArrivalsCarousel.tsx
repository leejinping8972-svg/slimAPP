'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import slide1 from '@/assets/home/carousel/carousel-slim-7day-box.png';
import slide2 from '@/assets/home/carousel/carousel-slim-28day-box.png';
import slide3 from '@/assets/home/carousel/carousel-slim-7day-open.png';
import slide4 from '@/assets/home/carousel/carousel-slim-28day-open.png';

const SLIDES = [
  {
    image: slide1,
    title: '7-Day Vitality Ritual',
    meta: 'Chocolate · Starter pack',
    href: '/slim_1#plans',
  },
  {
    image: slide2,
    title: '28-Day Vitality Ritual',
    meta: 'Chocolate · Full month',
    href: '/slim_1#plans',
  },
  {
    image: slide3,
    title: '7-Day Open Kit',
    meta: 'Sachets ready for daily pour',
    href: '/slim_1',
  },
  {
    image: slide4,
    title: '28-Day Open Kit',
    meta: 'Your complete chocolate ritual',
    href: '/slim_1',
  },
];

/** New arrivals / product recommendation carousel — 4 Slim tiles. */
export function NewArrivalsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);

  return (
    <section id="new-arrivals" className="bg-[#F7F5F1] py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
              New recommendations
            </p>
            <h2 className="mt-2 font-['Montserrat'] text-2xl font-bold text-[#1E261C] sm:text-3xl">
              Slim Vitality picks
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center border border-[#1E261C]/20 text-[#1E261C] hover:bg-white"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center border border-[#1E261C]/20 text-[#1E261C] hover:bg-white"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile: single focus + peek */}
        <div className="relative overflow-hidden lg:hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {SLIDES.map((slide) => (
              <Link
                key={slide.title}
                href={slide.href}
                className="w-full shrink-0 px-1"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-contain p-6"
                    sizes="100vw"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-['Montserrat'] text-base font-bold text-[#1E261C]">
                    {slide.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#6C6763]">{slide.meta}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: 4 tiles, highlight active */}
        <div className="hidden gap-5 lg:grid lg:grid-cols-4">
          {SLIDES.map((slide, i) => (
            <Link
              key={slide.title}
              href={slide.href}
              className={`group block transition-opacity ${
                i === index ? 'opacity-100' : 'opacity-80 hover:opacity-100'
              }`}
              onMouseEnter={() => setIndex(i)}
            >
              <div className="relative aspect-square overflow-hidden bg-white ring-1 ring-[#D8CBB8]/40">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="25vw"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-['Montserrat'] text-sm font-bold text-[#1E261C]">
                  {slide.title}
                </h3>
                <p className="mt-1 text-xs text-[#6C6763]">{slide.meta}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to ${slide.title}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-6 transition-colors ${
                i === index ? 'bg-[#1E261C]' : 'bg-[#D8CBB8]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
