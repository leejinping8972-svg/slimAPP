'use client';

import Link from 'next/link';

/** ARMRA-style social proof banner under hero. */
export function SocialProofBanner() {
  return (
    <section className="bg-[#6B7A62] py-10 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="font-['Montserrat'] text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2.1rem]">
          Daily rituals members actually keep.
        </h2>
        <p className="mt-3 text-sm text-white/80 sm:text-base">
          Slim Vitality fiber kits and Gut Balance probiotic sachets — designed for consistency, not
          another extreme plan.
        </p>
        <Link
          href="#customer-stories"
          className="mt-5 inline-block text-xs font-bold uppercase tracking-[0.16em] text-[#D8CBB8] underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          Read member stories
        </Link>
      </div>
    </section>
  );
}
