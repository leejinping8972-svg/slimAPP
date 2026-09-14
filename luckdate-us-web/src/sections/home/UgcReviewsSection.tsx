'use client';

import Image from 'next/image';
import ugc1 from '@/assets/home/ugc/ugc-armra-man-kitchen-drink.png';
import ugc2 from '@/assets/home/ugc/ugc-armra-woman-glass-box.png';
import ugc3 from '@/assets/home/ugc/ugc-armra-man-hoodie-box.png';
import ugc4 from '@/assets/home/ugc/ugc-armra-man-outdoor-shaker.png';
import ugc5 from '@/assets/home/ugc/ugc-armra-woman-box-portrait.png';
import ugc6 from '@/assets/home/products/slim-7day-hero-drink.png';

const UGC_ITEMS = [
  { src: ugc1, alt: 'Member with Slim Vitality chocolate drink in kitchen' },
  { src: ugc2, alt: 'Member holding chocolate shake and Slim Vitality box' },
  { src: ugc3, alt: 'Member showing Slim Vitality 7-Day box' },
  { src: ugc4, alt: 'Member drinking from luckdate shaker outdoors' },
  { src: ugc5, alt: 'Member with Slim Vitality box portrait' },
  { src: ugc6, alt: 'Slim Vitality chocolate drink still life' },
];

/** ARMRA-style UGC ribbon — continuous infinite horizontal marquee. */
export function UgcReviewsSection() {
  // Duplicate set so CSS translateX(-50%) loops seamlessly
  const loopItems = [...UGC_ITEMS, ...UGC_ITEMS];

  return (
    <section id="member-moments" className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      {/* Soft aura behind headline (ARMRA-like) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(232,220,180,0.55)_0%,_rgba(210,230,210,0.28)_28%,_rgba(230,200,210,0.18)_48%,_transparent_72%)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="font-['Montserrat'] text-[1.65rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#1E261C] sm:text-3xl lg:text-[2.35rem]">
          10,000+ five-star reviews.
          <br />
          200,000+ customers transformed.
        </h2>
      </div>

      {/* Full-bleed infinite marquee — ~5–6 tall portraits visible on PC */}
      <div className="relative z-10 mt-10 sm:mt-12 lg:mt-14">
        <div className="overflow-hidden">
          <div className="marquee flex w-max gap-1.5 sm:gap-2 lg:gap-2.5">
            {loopItems.map((item, idx) => (
              <div
                key={`${item.alt}-${idx}`}
                className="relative aspect-[3/4] w-[42vw] shrink-0 overflow-hidden bg-[#F0EDE7] sm:w-[220px] md:w-[260px] lg:w-[300px] xl:w-[320px]"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 320px, (min-width: 1024px) 300px, (min-width: 768px) 260px, 42vw"
                  priority={idx < 4}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
