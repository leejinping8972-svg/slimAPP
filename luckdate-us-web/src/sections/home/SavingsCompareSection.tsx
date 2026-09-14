'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import compareImage from '@/assets/home/products/slim-28day-open-kit.png';

/** Typical U.S. retail for a split supplement stack Slim Vitality is meant to replace. */
const STACK = [
  { label: 'Daily protein powder', price: 49.99 },
  { label: 'Meal-replacement shakes', price: 59.99 },
  { label: 'Multivitamin complex', price: 24.99 },
  { label: 'Weight-management supplements', price: 49.99 },
  { label: 'Fitness recovery', price: 44.99 },
  { label: 'Energy / skipped-breakfast bars', price: 34.99 },
  { label: 'Gut & fiber support', price: 29.99 },
  { label: 'Collagen / beauty', price: 39.99 },
];

const LUCKDATE_MONTHLY = 69.9;

function money(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * ARMRA-style “replaces your supplement stack” comparison under the purchase block.
 */
export function SavingsCompareSection() {
  const traditionalMonthly = STACK.reduce((sum, item) => sum + item.price, 0);
  const traditionalYearly = traditionalMonthly * 12;
  const luckdateYearly = LUCKDATE_MONTHLY * 12;
  const saveYearly = traditionalYearly - luckdateYearly;

  return (
    <section id="savings" className="bg-[#F7F5F1] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-10 xl:px-16">
        <div className="relative min-h-[280px] overflow-hidden bg-[#EDE8E0] sm:min-h-[380px] lg:min-h-full">
          <Image
            src={compareImage}
            alt="Slim Vitality 28-Day ritual kit — one daily pour instead of a supplement stack"
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div>
          <h2 className="max-w-[16ch] font-['Montserrat'] text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111] sm:text-4xl lg:text-[2.65rem]">
            Slim Vitality replaces your supplement stack
          </h2>

          <div className="mt-6 bg-[#1E261C] px-5 py-5 text-white sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              Save up to
            </p>
            <p className="mt-1 font-['Montserrat'] text-3xl font-bold leading-none tracking-[-0.03em] text-[#E8FF6A] sm:text-4xl">
              ${money(saveYearly)} / year
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
              when switching to the 28-Day ritual
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm font-bold text-[#111111]">Monthly breakdown</p>
            <ul className="mt-3 divide-y divide-[#111111]/10 border-y border-[#111111]/10">
              {STACK.map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                  <span className="flex min-w-0 items-center gap-2 text-[#222222]">
                    <Check className="h-4 w-4 shrink-0 text-[#1E261C]" strokeWidth={2.5} />
                    {item.label}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-[#111111]">
                    ${money(item.price)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between bg-[#EDE8E0] px-4 py-3 text-sm font-bold text-[#111111]">
                <span>Your traditional routine</span>
                <span className="tabular-nums">${money(traditionalMonthly)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E8FF6A] px-4 py-3 text-sm font-bold text-[#111111]">
                <span>Whole-body ritual with Slim Vitality</span>
                <span className="tabular-nums">${money(LUCKDATE_MONTHLY)}</span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-[#111111] sm:text-base">
            One daily chocolate pour. Protein, vitamins, and vitality — not eight bottles.
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href="#start-ritual"
              className="inline-flex bg-[#1E261C] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
            >
              Start saving
            </Link>
          </div>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-[#6C6763]">
            Comparison uses typical U.S. retail prices for separate supplements. Slim Vitality 28-Day
            is ${money(LUCKDATE_MONTHLY)} per kit. Individual routines and results vary.
          </p>
        </div>
      </div>
    </section>
  );
}
