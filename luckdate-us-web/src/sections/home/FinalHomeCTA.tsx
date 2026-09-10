'use client';

import Link from 'next/link';

export function FinalHomeCTA() {
  return (
    <section className="bg-[#D8CBB8] py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-['Montserrat'] text-3xl font-bold leading-tight text-[#1E261C] sm:text-4xl lg:text-[2.75rem]">
          Start your Slim Vitality ritual
        </h2>
        <p className="mt-4 text-sm text-[#3D4638]/85 sm:text-base">
          Choose the 7-Day starter or the 28-Day full chocolate ritual — same daily pour, two ways to
          begin.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/slim_1#plans"
            className="inline-flex items-center justify-center bg-[#1E261C] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
          >
            Shop 7-Day
          </Link>
          <Link
            href="/slim_1#plans"
            className="inline-flex items-center justify-center border border-[#1E261C] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-[#1E261C] transition-colors hover:bg-white/40"
          >
            Shop 28-Day
          </Link>
        </div>
        <p className="mt-5 text-xs text-[#3D4638]/60">Free U.S. shipping over $50 · 30-day money-back</p>
      </div>
    </section>
  );
}
