'use client';

import Image from 'next/image';
import Link from 'next/link';
import barrierImage from '@/assets/home/products/barrier-slim-7-28-display.png';

/**
 * ARMRA-style foundation / barriers section —
 * right visual shows Slim Vitality 7-Day & 28-Day chocolate kits.
 */
export function BarrierSection() {
  const barriers = [
    {
      title: 'Skipped breakfasts',
      desc: 'Busy mornings skip protein and rhythm — leaving energy and satiety inconsistent.',
    },
    {
      title: 'Hard-to-keep plans',
      desc: 'Most wellness fails from complexity. A one-minute chocolate pour is easier to keep.',
    },
    {
      title: 'No clear ritual',
      desc: 'Without a daily system, results fade. 7-Day starts the habit; 28-Day makes it stick.',
    },
  ];

  return (
    <section className="bg-[#F7F5F1]">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-14 sm:px-8 lg:px-16 xl:px-20 lg:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
            The foundation
          </p>
          <h2 className="mt-3 max-w-[16ch] font-['Montserrat'] text-3xl font-bold leading-[1.1] text-[#1E261C] sm:text-4xl lg:text-[2.75rem] break-words">
            Modern living breaks down your daily balance
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#4E554B]/90 sm:text-base">
            Luckdate rebuilds the foundation with Slim Vitality — a chocolate nutrition drink mix in
            7-Day and 28-Day rituals you can actually keep.
          </p>

          <div className="mt-10 space-y-6 border-t border-[#D8CBB8]/50 pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9A9188]">
              The barriers
            </p>
            {barriers.map((item) => (
              <div key={item.title}>
                <h3 className="font-['Montserrat'] text-lg font-bold text-[#1E261C]">{item.title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[#6C6763]/90">{item.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="#discover-favorites"
            className="mt-10 inline-flex w-fit items-center justify-center bg-[#6B7A62] px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#5A6852]"
          >
            Start your ritual
          </Link>
        </div>

        <div className="relative min-h-[380px] bg-[#E8EDE4] lg:min-h-full">
          <Image
            src={barrierImage}
            alt="Slim Vitality 7-Day and 28-Day chocolate ritual kits"
            fill
            className="object-contain p-6 sm:p-10"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
