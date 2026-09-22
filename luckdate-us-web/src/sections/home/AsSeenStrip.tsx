'use client';

import { BadgeCheck, Factory, Medal, Smartphone, Sparkles, type LucideIcon } from 'lucide-react';

const ITEMS: {
  label: string;
  hint: string;
  icon: LucideIcon;
  iconClassName?: string;
}[] = [
  {
    label: 'GMP Certified',
    hint: 'Manufacturing standards',
    icon: BadgeCheck,
  },
  {
    label: 'FDA Facility Registered',
    hint: 'Registered production',
    icon: Factory,
  },
  {
    label: 'Daily Ritual System',
    hint: '7-Day & 28-Day kits',
    icon: Sparkles,
  },
  {
    label: 'App-Guided Support',
    hint: 'Sunny AI companion',
    icon: Smartphone,
  },
  {
    label: 'Nobel Laureate',
    hint: 'Prof. Aaron Ciechanover',
    icon: Medal,
    iconClassName: 'text-[#A5792A]',
  },
];

/** Trust strip under hero — larger presence with icons. */
export function AsSeenStrip() {
  return (
    <section className="border-b border-[#D8CBB8]/40 bg-[#F7F5F1] py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6B7A62] sm:mb-10 sm:text-xs">
          Built with
        </p>

        <ul className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-5 lg:gap-6">
          {ITEMS.map((item) => (
            <li key={item.label} className="flex flex-col items-center text-center">
              <span className="relative mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#1E261C]/12 bg-white shadow-[0_8px_24px_rgba(30,38,28,0.06)] sm:h-16 sm:w-16">
                <item.icon
                  className={`h-6 w-6 sm:h-7 sm:w-7 ${item.iconClassName ?? 'text-[#1E261C]'}`}
                  strokeWidth={1.6}
                  aria-hidden
                />
              </span>
              <p className="font-['Montserrat'] text-[0.7rem] font-bold uppercase leading-snug tracking-[0.12em] text-[#1E261C] sm:text-sm lg:text-[0.8rem]">
                {item.label}
              </p>
              <p className="mt-1.5 hidden text-xs text-[#6C6763] sm:block">{item.hint}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
