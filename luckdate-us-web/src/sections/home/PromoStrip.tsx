'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import thumb7 from '@/assets/home/products/slim-7day-open-kit.png';
import thumb28 from '@/assets/home/products/slim-28day-open-kit.png';

const MESSAGES = [
  'Free U.S. Shipping Over $50',
  '28-Day Vitality Ritual',
  'Third-Party Tested · Details You Can Inspect',
];

/** Top announcement bar — rotating copy + Slim product thumbs. */
export function PromoStrip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-[#D8CBB8] px-3 py-2 sm:px-4 sm:py-2.5">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 sm:gap-5">
        <div className="relative hidden h-9 w-9 shrink-0 overflow-hidden bg-[#C9B8A0]/50 sm:block sm:h-10 sm:w-10">
          <Image
            src={thumb7}
            alt="Slim Vitality 7-Day"
            fill
            className="object-contain p-0.5"
            sizes="40px"
          />
        </div>
        <p
          key={MESSAGES[index]}
          className="min-w-0 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#1E261C] animate-in fade-in duration-500 sm:text-xs"
        >
          {MESSAGES[index]}
        </p>
        <div className="relative hidden h-9 w-9 shrink-0 overflow-hidden bg-[#C9B8A0]/50 sm:block sm:h-10 sm:w-10">
          <Image
            src={thumb28}
            alt="Slim Vitality 28-Day"
            fill
            className="object-contain p-0.5"
            sizes="40px"
          />
        </div>
        {/* Mobile: single product thumb beside text */}
        <div className="relative h-8 w-8 shrink-0 overflow-hidden bg-[#C9B8A0]/50 sm:hidden">
          <Image
            src={thumb28}
            alt="Slim Vitality"
            fill
            className="object-contain p-0.5"
            sizes="32px"
          />
        </div>
      </div>
    </div>
  );
}
