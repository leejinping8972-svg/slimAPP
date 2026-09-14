'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import certFda from '@/assets/home/certs/fda.png';
import certGmp from '@/assets/home/certs/gmp.png';
import certHalal from '@/assets/home/certs/halal.png';
import certKosher from '@/assets/home/certs/kosher.png';
import certNonGmo from '@/assets/home/certs/non-gmo.png';
import certUsda from '@/assets/home/certs/usda.png';

type Cert = {
  src: StaticImageData;
  label: string;
  alt: string;
};

const CERTS: Cert[] = [
  { src: certUsda, label: 'USDA', alt: 'USDA mark' },
  { src: certFda, label: 'FDA', alt: 'FDA mark' },
  { src: certGmp, label: 'GMP', alt: 'GMP Quality certification' },
  { src: certHalal, label: 'HALAL', alt: 'Halal certification' },
  { src: certKosher, label: 'KOSHER', alt: 'Kosher certification' },
  { src: certNonGmo, label: 'NON-GMO', alt: 'Non-GMO mark' },
];

/**
 * ARMRA-style whey foundation section:
 * left headline + regulatory marks, right copy + CTA.
 */
export function BarrierSection() {
  return (
    <section
      id="whey-protein"
      className="relative overflow-hidden bg-white"
    >
      {/* Soft pastel wash — right side, matching reference layout */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_42%,rgba(245,228,170,0.55)_0%,rgba(210,230,200,0.35)_28%,rgba(232,214,232,0.22)_52%,rgba(255,255,255,0)_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(248,232,180,0.45)_0%,transparent_70%)] blur-2xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24 xl:gap-20">
        {/* Left: headline + cert marks */}
        <div>
          <h2 className="max-w-[14ch] font-['Montserrat'] text-[2.15rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111] sm:text-5xl lg:text-[3.35rem]">
            Concentrated whey protein — WPC80
          </h2>

          <ul className="mt-10 flex flex-wrap items-end gap-x-5 gap-y-6 sm:gap-x-6 lg:mt-12 lg:gap-x-7">
            {CERTS.map((cert) => (
              <li key={cert.label} className="flex w-[4.25rem] flex-col items-center sm:w-[4.75rem]">
                <div className="relative flex h-12 w-full items-center justify-center sm:h-14">
                  <Image
                    src={cert.src}
                    alt={cert.alt}
                    fill
                    className="object-contain"
                    sizes="76px"
                  />
                </div>
                <span className="mt-2 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-[#222222]/80 sm:text-[10px]">
                  {cert.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: body + CTA */}
        <div className="max-w-xl lg:justify-self-end">
          <div className="space-y-5 text-[15px] font-medium leading-relaxed text-[#1A1A1A] sm:text-base">
            <p>
              Whey Protein Concentrate 80% (WPC80) is a high-quality, nutrition-dense protein
              source with all 9 essential amino acids and high bioavailability — supporting
              immunity, muscle recovery, athletic performance, and everyday vitality.
            </p>
            <p>
              Our WPC80 is spray-dried at mid-to-low temperature to preserve native protein form,
              with no lecithin or added fillers. Specs are controlled for protein (dry basis),
              moisture, microbiology, and contaminants — and manufactured to meet USDA and U.S. FDA
              food specification standards. Halal, Kosher, GMP, and Non-GMO aligned.
            </p>
            <p className="text-sm font-medium leading-relaxed text-[#2A2A2A]">
              Source highlights: Saputo Dairy Australia — Pasture Fed, rBST Free, BSE Free. Detailed
              technical specifications available upon request.
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
    </section>
  );
}
