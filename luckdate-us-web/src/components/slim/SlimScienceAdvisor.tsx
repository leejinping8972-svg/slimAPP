'use client';

import Image from 'next/image';
import Link from 'next/link';
import SlimReveal from './SlimReveal';
import professorImg from '@/assets/home/professor-ciechanover.jpg';

function SunflowerWatermark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="60" cy="60" r="8" stroke="currentColor" strokeWidth="1.2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="60"
          cy="28"
          rx="5"
          ry="14"
          stroke="currentColor"
          strokeWidth="1.2"
          transform={`rotate(${deg} 60 60)`}
        />
      ))}
    </svg>
  );
}

export default function SlimScienceAdvisor() {
  return (
    <section id="science" className="bg-[#FCFBF7] overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-[2fr_3fr] items-center min-h-0 lg:min-h-[480px] lg:max-h-[560px]">
          {/* Left 40% — real portrait */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[480px] xl:h-[520px]">
            <SlimReveal className="absolute inset-0">
              <div
                className="relative w-full h-full"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to right, black 0%, black 68%, transparent 100%)',
                  maskImage: 'linear-gradient(to right, black 0%, black 68%, transparent 100%)',
                }}
              >
                <Image
                  src={professorImg}
                  alt="Professor Aaron Ciechanover, Nobel Laureate in Chemistry"
                  fill
                  className="object-cover object-[center_15%]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </SlimReveal>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-[30%]"
              style={{
                background:
                  'linear-gradient(to right, transparent 0%, rgba(252, 251, 247, 0.7) 50%, #FCFBF7 100%)',
              }}
            />
          </div>

          {/* Right 60% */}
          <div className="relative flex flex-col justify-center px-5 sm:px-8 lg:px-10 xl:px-14 py-10 lg:py-12">
            <SunflowerWatermark className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-36 h-36 lg:w-48 lg:h-48 text-[#C4B896]/35 translate-x-1/3" />

            <SlimReveal delay={80} className="relative z-10 max-w-lg">
              <h2
                className="text-[1.65rem] sm:text-[1.85rem] lg:text-[2.1rem] xl:text-[2.25rem] font-medium text-[#3D4038] leading-tight mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Scientific Guidance,
                <br />
                Responsibly Shared.
              </h2>

              <p
                className="text-base sm:text-lg font-semibold text-[#3D4038] mb-1.5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Professor Aaron Ciechanover
              </p>
              <p className="text-sm text-[#6C6763] mb-0.5">2004 Nobel Laureate in Chemistry</p>
              <p className="text-sm text-[#6C6763] mb-5">Scientific Advisor to Luckdate</p>

              <p className="text-sm sm:text-[15px] text-[#6C6763] leading-relaxed mb-3">
                He advises Luckdate on scientific principles, long-term health thinking, and responsible
                science communication.
              </p>
              <p className="text-sm sm:text-[15px] text-[#6C6763] leading-relaxed mb-7">
                His advisory role is at the brand and scientific-principles level. He did not formulate Slim
                Vitality or develop the Luckdate App.
              </p>

              <Link
                href="/about"
                className="inline-flex items-center justify-center border border-[#3D4038]/40 text-[#3D4038] px-7 py-3 rounded-lg text-sm font-semibold hover:bg-[#3D4038]/5 transition-colors"
              >
                Explore Our Science
              </Link>
            </SlimReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
