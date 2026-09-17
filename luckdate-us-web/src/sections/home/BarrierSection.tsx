'use client';

import Link from 'next/link';

type BenefitIcon = {
  label: string;
  Icon: () => React.ReactNode;
};

/** Geometric line icons in the ARMRA barrier-row style. */
const BENEFITS: BenefitIcon[] = [
  {
    label: 'Immune Health',
    Icon: () => (
      <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    label: 'Gut Health',
    Icon: () => (
      <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
        <path d="M20 8 L32 30 H8 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Metabolism',
    Icon: () => (
      <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
        <path d="M14 8 L20 16 L26 8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14 32 L20 24 L26 32" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M20 16 V24" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    label: 'Skin Health',
    Icon: () => (
      <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
        <path d="M20 7 L33 20 L20 33 L7 20 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Weight Management',
    Icon: () => (
      <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
        <rect x="8" y="18" width="24" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14 18 V14 H26 V18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="20" cy="23" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    label: 'Fitness Recovery',
    Icon: () => (
      <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
        <path d="M12 20 H28 M20 12 V28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Hair Growth',
    Icon: () => (
      <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
        <path d="M20 9 L31 30 H9 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/**
 * ARMRA-style barrier section — headline + benefit icons, body + CTA.
 */
export function BarrierSection() {
  return (
    <section id="whey-protein" className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_42%,rgba(245,228,170,0.55)_0%,rgba(210,230,200,0.35)_28%,rgba(232,214,232,0.22)_52%,rgba(255,255,255,0)_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(248,232,180,0.45)_0%,transparent_70%)] blur-2xl"
      />

      <div className="relative mx-auto max-w-[90rem] px-4 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-20">
          <h2 className="max-w-[18ch] font-['Montserrat'] text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111] sm:text-4xl lg:text-[3rem]">
            Modern lifestyles break down your immune barrier — and leave nutrition out of balance
          </h2>

          <div className="max-w-xl lg:justify-self-end">
            <div className="space-y-5 text-[15px] font-medium leading-relaxed text-[#1A1A1A] sm:text-base">
              <p>
                Concentrated whey protein WPC80 helps reinforce the nutrition your body needs when
                modern life wears down immune defenses. With all 9 essential amino acids and high
                bioavailability, it supports immunity, muscle recovery, athletic performance, and
                weight management.
              </p>
              <p>
                Strengthen your daily protein foundation, nourish gut rhythm, and give your body a
                cleaner blueprint for balance from the inside out — without fillers or shortcuts.
              </p>
            </div>

            <Link
              href="#start-ritual"
              className="mt-9 inline-flex items-center justify-center border border-[#111111] bg-[#F6E9B8]/70 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#111111] transition-colors hover:bg-[#F3E19A] sm:mt-10"
            >
              Shop whey
            </Link>
          </div>
        </div>

        {/* Benefit icons — always one row across the full section width */}
        <ul className="mt-12 flex flex-nowrap items-start justify-between gap-2 sm:mt-14 sm:gap-4 lg:mt-16 lg:gap-6">
          {BENEFITS.map((item) => (
            <li key={item.label} className="flex min-w-0 flex-1 flex-col items-center">
              <span className="flex h-10 w-10 items-center justify-center text-[#111111] sm:h-11 sm:w-11">
                <item.Icon />
              </span>
              <span className="mt-2.5 text-center text-[8px] font-semibold uppercase leading-tight tracking-[0.08em] text-[#222222]/85 sm:text-[10px] lg:text-[11px]">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
