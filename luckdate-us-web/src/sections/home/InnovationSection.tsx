'use client';

import Image from 'next/image';
import Link from 'next/link';
import innovationImage from '@/assets/home/products/slim-28day-open-kit.png';

export function InnovationSection() {
  return (
    <section className="relative isolate min-h-[min(78vh,720px)] overflow-hidden bg-[#2A3228]">
      <Image
        src={innovationImage}
        alt=""
        fill
        className="object-cover object-center opacity-50"
        sizes="100vw"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#1E261C] via-[#1E261C]/88 to-[#1E261C]/35"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[min(78vh,720px)] items-center">
        <div className="w-full px-4 py-16 sm:px-6 lg:px-12 xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D8CBB8]">
                Slim Vitality · Chocolate
              </p>
              <h2 className="mt-3 font-['Montserrat'] text-3xl font-bold leading-[1.08] text-white sm:text-4xl lg:text-5xl break-words">
                7 days to start.
                <br />
                28 days to ritual.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                Slim Vitality Nutrition Drink Mix delivers 16g protein and essential nutrients in a
                chocolate daily pour — choose the 7-Day starter or the complete 28-Day Vitality Ritual.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/slim_1#plans"
                  className="inline-flex items-center justify-center bg-[#D8CBB8] px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#1E261C] transition-colors hover:bg-[#E5D9C6]"
                >
                  Shop 7-Day
                </Link>
                <Link
                  href="/slim_1#plans"
                  className="inline-flex items-center justify-center border border-white/45 px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
                >
                  Shop 28-Day
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
