'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import scoopImage from '@/assets/home/whey-innovation-scoop.jpg';

const ADVANTAGES: { lead: string; rest: string }[] = [
  {
    lead: 'No lecithin or other fillers/additives',
    rest: ' — clean, pure milky flavor.',
  },
  {
    lead: 'Single cheese-whey source, single factory',
    rest: ' — high batch-to-batch stability.',
  },
  {
    lead: 'Agglomeration process',
    rest: ' for excellent powder flow and water solubility.',
  },
  {
    lead: 'Strict control',
    rest: ' of microbes, contaminant limits, and risk indicators.',
  },
];

export function InnovationSection() {
  return (
    <section id="whey-innovation" className="bg-white">
      <div className="relative aspect-[16/9] min-h-[280px] w-full overflow-hidden sm:min-h-[380px] lg:min-h-[520px]">
        <Image
          src={scoopImage}
          alt="Concentrated whey protein WPC80 powder in a scoop"
          fill
          className="object-cover object-[center_45%]"
          sizes="100vw"
        />
      </div>

      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#F7F4DC] to-[#E8FF6A]/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)_auto] lg:items-start lg:gap-10 lg:px-12 lg:py-14 xl:px-20">
          <h2 className="max-w-[12ch] font-['Montserrat'] text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-[#111111] sm:text-4xl lg:text-[2.6rem]">
            An innovation in whey protein
          </h2>

          <ul className="grid gap-5 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-6">
            {ADVANTAGES.map((item) => (
              <li key={item.lead} className="flex gap-3 text-sm leading-relaxed text-[#1A1A1A] sm:text-[15px]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E261C] text-white">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                </span>
                <p>
                  <span className="font-bold">{item.lead}</span>
                  {item.rest}
                </p>
              </li>
            ))}
          </ul>

          <Link
            href="#start-ritual"
            className="inline-flex h-fit w-fit items-center justify-center bg-[#111111] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 lg:mt-1"
          >
            Shop whey
          </Link>
        </div>
      </div>
    </section>
  );
}
