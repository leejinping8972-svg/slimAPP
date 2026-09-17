'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

type Review = {
  quote: string;
  name: string;
};

const REVIEWS: Review[] = [
  {
    quote:
      'This is hands down the best ritual I have ever kept. Digestion, energy, skin, sleep, and mental clarity — I will never be without it.',
    name: 'Kathleen M.',
  },
  {
    quote:
      'I dropped the protein tub, bars, and extra vitamins. One chocolate pour in the morning and I stay full through meetings.',
    name: 'Kathryn R.',
  },
  {
    quote:
      '16g protein after training without a chalky shake. Recovery feels steadier and I actually look forward to the ritual.',
    name: 'James T.',
  },
  {
    quote:
      'I swapped late snacks for the chocolate pour. Sleep feels deeper and I wake up less bloated.',
    name: 'Michelle K.',
  },
  {
    quote:
      '7-Day got me started. 28-Day made it a habit. No stack, no guesswork — just pour, shake, drink.',
    name: 'David L.',
  },
  {
    quote:
      'Whey used to sit heavy. This pour is smooth. Less bloating, more regular mornings.',
    name: 'Priya S.',
  },
  {
    quote:
      'I have started so many powders. Slim Vitality is the first chocolate mix I finish the box.',
    name: 'Logan P.',
  },
];

/**
 * ARMRA-style single-quote review carousel —
 * one centered testimonial at a time.
 */
export function FeaturedReviewsSection() {
  const [index, setIndex] = useState(0);
  const review = REVIEWS[index];

  const prev = () => setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setIndex((i) => (i + 1) % REVIEWS.length);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % REVIEWS.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="customer-stories" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(255,210,230,0.4)_0%,transparent_45%),radial-gradient(ellipse_at_80%_20%,rgba(255,236,150,0.55)_0%,transparent_48%),radial-gradient(ellipse_at_70%_85%,rgba(190,235,170,0.4)_0%,transparent_50%)]"
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-12">
        <div className="flex justify-center gap-[3px]" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-[#111111] text-[#111111] sm:h-6 sm:w-6" strokeWidth={0} />
          ))}
        </div>

        <blockquote
          key={review.name + index}
          className="mt-8 animate-in fade-in duration-500 sm:mt-10"
        >
          <p className="font-['Montserrat'] text-xl font-bold leading-snug tracking-[-0.02em] text-[#111111] sm:text-2xl lg:text-[1.85rem] lg:leading-[1.35]">
            “{review.quote}”
          </p>
          <footer className="mt-8 sm:mt-10">
            <p className="text-base font-bold text-[#111111]">— {review.name}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#666666]">
              luckdate customer
            </p>
          </footer>
        </blockquote>

        <div className="mt-12 flex items-center justify-between sm:mt-14">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous review"
            className="flex h-10 w-10 items-center justify-center text-[#111111] transition-opacity hover:opacity-55"
          >
            <ChevronLeft className="h-7 w-7" strokeWidth={1.2} />
          </button>

          <div className="flex items-center gap-2.5">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show review ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? 'bg-[#111111]' : 'bg-[#111111]/22'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next review"
            className="flex h-10 w-10 items-center justify-center text-[#111111] transition-opacity hover:opacity-55"
          >
            <ChevronRight className="h-7 w-7" strokeWidth={1.2} />
          </button>
        </div>
      </div>
    </section>
  );
}
