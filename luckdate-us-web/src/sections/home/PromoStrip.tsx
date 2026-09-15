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

type PromoStripProps = {
  /** When false, collapse the bar (first viewport). */
  visible?: boolean;
};

/** Top announcement bar — rotating copy + Slim product thumbs. */
export function PromoStrip({ visible = true }: PromoStripProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [visible]);

  return (
    <div
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
        visible ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <div className="relative overflow-hidden px-3 py-2 sm:px-4 sm:py-2.5">
        {/* Pastel wash — matches reviews / claims sections */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#FFD6E8_0%,#FFE9A8_28%,#D8F0C8_58%,#D6E4FF_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.35)_0%,transparent_55%),radial-gradient(ellipse_at_80%_50%,rgba(255,255,255,0.25)_0%,transparent_50%)]"
        />
        <div className="relative mx-auto flex max-w-5xl items-center justify-center gap-3 sm:gap-5">
          <div className="relative hidden h-9 w-9 shrink-0 overflow-hidden bg-white/55 sm:block sm:h-10 sm:w-10">
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
          <div className="relative hidden h-9 w-9 shrink-0 overflow-hidden bg-white/55 sm:block sm:h-10 sm:w-10">
            <Image
              src={thumb28}
              alt="Slim Vitality 28-Day"
              fill
              className="object-contain p-0.5"
              sizes="40px"
            />
          </div>
          <div className="relative h-8 w-8 shrink-0 overflow-hidden bg-white/55 sm:hidden">
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
    </div>
  );
}
