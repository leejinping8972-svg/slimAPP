'use client';

import Image from 'next/image';
import { CircleDot, GripHorizontal, Package, Sun } from 'lucide-react';
import SlimReveal from './SlimReveal';
import productImg from '@/assets/slim/slim-product-feature-v2.png';

const benefits = [
  { icon: GripHorizontal, label: 'Protein-rich daily nutrition' },
  { icon: CircleDot, label: 'Supports satiety' },
  { icon: Package, label: 'Easy single-serve sachets' },
  { icon: Sun, label: 'Pairs with Sunny guidance' },
];

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

interface SlimProductFeatureProps {
  onShopNow: () => void;
}

export default function SlimProductFeature({ onShopNow }: SlimProductFeatureProps) {
  return (
    <section id="product" className="relative py-12 lg:py-16 bg-[#FCFBF7] overflow-hidden">
      <SunflowerWatermark className="pointer-events-none absolute top-6 left-4 lg:left-10 w-24 h-24 lg:w-28 lg:h-28 text-[#D9D2C5]/60" />
      <SunflowerWatermark className="pointer-events-none absolute bottom-6 right-4 lg:right-10 w-28 h-28 lg:w-32 lg:h-32 text-[#D9D2C5]/50" />

      <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid lg:grid-cols-[9fr_11fr] gap-8 lg:gap-10 xl:gap-14 items-center">
          <SlimReveal>
            <div className="relative w-full aspect-[5/4] lg:aspect-[6/5] max-w-[480px] mx-auto lg:mx-0 lg:max-w-none">
              <Image
                src={productImg}
                alt="Luckdate Slim Vitality box, shaker, sachet and scoop"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
            </div>
          </SlimReveal>

          <SlimReveal delay={80}>
            <h2
              className="text-[1.75rem] sm:text-[2rem] lg:text-[2.2rem] font-medium text-[#3D4038] leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Meet Slim Vitality™
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] text-[#3D4038]/85 leading-relaxed max-w-md">
              A daily nutrition ritual designed to support balanced nutrition, satiety, and consistency.
            </p>

            <div className="mt-7 lg:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5 max-w-[480px]">
              {benefits.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon className="w-5 h-5 text-[#737A65]" strokeWidth={1.5} />
                  <span className="text-[11px] sm:text-xs text-[#3D4038]/80 leading-snug text-center">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onShopNow}
              className="mt-7 lg:mt-8 bg-[#737A65] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#5F6558] transition-colors"
            >
              Shop Slim Vitality
            </button>
          </SlimReveal>
        </div>
      </div>
    </section>
  );
}
