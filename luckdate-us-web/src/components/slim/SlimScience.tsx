'use client';

import Image from 'next/image';
import { Droplets, Wheat, CandyOff, Pill } from 'lucide-react';
import SlimReveal from './SlimReveal';
import productImg from '@/assets/slim/system-products.png';

const stats = [
  { icon: Droplets, label: 'Plant + Whey Protein' },
  { icon: Wheat, label: '5g Dietary Fiber' },
  { icon: CandyOff, label: 'Low Sugar (<2g)' },
  { icon: Pill, label: '25+ Vitamins & Minerals' },
];

const seals = [
  'No Artificial Flavors',
  'Non-GMO',
  'Gluten-Free',
  'Lab Tested',
  'GMP Certified',
];

export default function SlimScience() {
  return (
    <section id="science" className="py-14 md:py-20 bg-[#F3EEE6]">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <SlimReveal>
            <h2 className="text-3xl md:text-4xl lg:text-[2.65rem] font-medium text-[#2C322E] leading-tight mb-3">
              Clean Ingredients.
              <br />
              Real Results.
              <br />
              You Can Trust.
            </h2>
            <p className="text-sm text-[#6C6763] leading-relaxed mb-8 max-w-md">
              A clean formula built for everyday women — clear nutrition you can feel, with quality
              standards you can verify.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-7">
              {stats.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white/80 border border-[#2A4035]/8 p-4 flex items-start gap-3"
                >
                  <Icon className="w-5 h-5 text-[#2A4035] shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-[#2C322E] leading-snug">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {seals.map((seal) => (
                <span
                  key={seal}
                  className="inline-flex items-center justify-center w-auto min-w-[4.5rem] px-3 py-2 rounded-full text-[10px] font-medium bg-white text-[#2A4035] border border-[#2A4035]/12 text-center leading-tight"
                >
                  {seal}
                </span>
              ))}
            </div>
          </SlimReveal>

          <SlimReveal delay={100} className="relative">
            <div className="relative aspect-square max-w-md mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#DCE8DF] via-[#E8F0EA] to-[#F3EEE6]">
              <Image
                src={productImg}
                alt="Slim Vitality Chocolate Flavor"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 420px"
              />
            </div>
          </SlimReveal>
        </div>
      </div>
    </section>
  );
}
