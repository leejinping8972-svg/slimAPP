'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

type Review = {
  quote: string;
  body: string;
  name: string;
};

const REVIEWS: Review[] = [
  {
    quote: 'More energy, fewer bottles.',
    body: 'I dropped the protein tub, bars, and extra vitamins. One chocolate pour in the morning and I stay full through meetings.',
    name: 'Kathryn R.',
  },
  {
    quote: 'Workouts feel cleaner.',
    body: '16g protein after training without mixing a chalky shake. Recovery is steadier and I actually look forward to the ritual.',
    name: 'James T.',
  },
  {
    quote: 'Evenings finally slowed down.',
    body: 'I swapped late snacks for the chocolate ritual. Sleep feels deeper and I wake up less bloated.',
    name: 'Michelle K.',
  },
  {
    quote: 'Simple enough to keep.',
    body: '7-Day got me started. 28-Day made it a habit. No stack, no guesswork — just pour, shake, drink.',
    name: 'David L.',
  },
  {
    quote: 'Gut feels more settled.',
    body: 'Whey used to sit heavy. This pour is smooth. Less bloating, more regular mornings.',
    name: 'Priya S.',
  },
  {
    quote: 'The one I actually finish.',
    body: 'I have started so many powders. Slim Vitality is the first chocolate mix I finish the box.',
    name: 'Logan P.',
  },
];

function TrustpilotStars({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6 sm:h-7 sm:w-7';
  const icon = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5 sm:h-4 sm:w-4';
  return (
    <div className="flex items-center gap-[3px]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`inline-flex ${box} items-center justify-center bg-[#00B67A]`}
        >
          <Star className={`${icon} fill-white text-white`} strokeWidth={0} />
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col bg-white/80 px-5 py-6 sm:px-6 sm:py-7">
      <TrustpilotStars size="sm" />
      <h3 className="mt-3 font-['Montserrat'] text-lg font-bold italic leading-snug text-[#111111]">
        “{review.quote}”
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#333333]">{review.body}</p>
      <p className="mt-4 text-sm font-semibold text-[#111111]">— {review.name}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777777]">
        Luckdate customer
      </p>
    </article>
  );
}

/** Trustpilot-style review cards on an ARMRA-like pastel carousel. */
export function FeaturedReviewsSection() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pageCount = Math.ceil(REVIEWS.length / perPage);
  const start = page * perPage;
  const visible = REVIEWS.slice(start, start + perPage);

  const prev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const next = () => setPage((p) => (p + 1) % pageCount);

  return (
    <section id="customer-stories" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,rgba(255,210,230,0.5)_0%,transparent_42%),radial-gradient(ellipse_at_82%_8%,rgba(255,236,150,0.65)_0%,transparent_46%),radial-gradient(ellipse_at_72%_88%,rgba(190,235,170,0.5)_0%,transparent_48%),radial-gradient(ellipse_at_12%_90%,rgba(210,220,255,0.38)_0%,transparent_42%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <TrustpilotStars />
            <p className="text-sm font-semibold text-[#111111] sm:text-base">
              4.9 out of 5
              <span className="font-medium text-[#555555]"> (10,000+ reviews)</span>
            </p>
          </div>
          <h2 className="mt-5 font-['Montserrat'] text-[1.85rem] font-bold leading-[1.12] tracking-[-0.03em] text-[#111111] sm:text-4xl lg:text-[2.7rem]">
            Trusted by members who pour it daily
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {visible.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous reviews"
            className="flex h-10 w-10 items-center justify-center text-[#111111] transition-opacity hover:opacity-60"
          >
            <ChevronLeft className="h-7 w-7" strokeWidth={1.25} />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show reviews ${i + 1}`}
                onClick={() => setPage(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === page ? 'bg-[#111111]' : 'bg-[#111111]/25'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next reviews"
            className="flex h-10 w-10 items-center justify-center text-[#111111] transition-opacity hover:opacity-60"
          >
            <ChevronRight className="h-7 w-7" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </section>
  );
}
