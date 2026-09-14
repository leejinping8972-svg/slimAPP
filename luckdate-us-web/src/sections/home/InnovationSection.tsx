'use client';

import Image from 'next/image';
import Link from 'next/link';
import scoopImage from '@/assets/home/whey-innovation-scoop.jpg';
import scienceImage from '@/assets/home/whey-innovation-science.jpg';

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
        <div className="absolute right-[4%] top-[10%] w-[38%] max-w-[420px] overflow-hidden shadow-lg sm:right-[5%] sm:top-[12%] sm:w-[34%]">
          <div className="relative aspect-[16/10]">
            <Image
              src={scienceImage}
              alt=""
              fill
              className="object-cover"
              sizes="34vw"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#F7F4DC] to-[#E8FF6A]/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_auto] lg:items-start lg:gap-10 lg:px-12 lg:py-14 xl:px-20">
          <h2 className="max-w-[12ch] font-['Montserrat'] text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-[#111111] sm:text-4xl lg:text-[2.6rem]">
            An innovation in whey protein
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            <p className="text-sm font-medium leading-relaxed text-[#1A1A1A] sm:text-[15px]">
              Whey Protein Concentrate 80% (WPC80) is a complete, nutrition-dense protein with all 9
              essential amino acids and high bioavailability. It supports immunity, muscle growth,
              athletic performance, and faster recovery — and is also linked with weight management,
              heart health, and a stronger gut.
            </p>
            <p className="text-sm font-medium leading-relaxed text-[#1A1A1A] sm:text-[15px]">
              Our WPC80 is spray-dried at mid-to-low temperature to keep native protein form, with no
              lecithin or fillers. Specs meet USDA and U.S. FDA food standards, with monitoring beyond
              basic national requirements. Halal, Kosher, GMP, and Non-GMO aligned.
            </p>
          </div>

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
