'use client';

import Image from 'next/image';
import { ArrowRight, X, Check } from 'lucide-react';
import SlimReveal from './SlimReveal';
import shakeImg from '@/assets/slim/lifestyle-morning.png';

const pains = [
  'Skipping breakfast?',
  'Not enough protein?',
  'Hard to stay consistent?',
  'Want results, not restrictions?',
];

const values = [
  'Balanced daily nutrition',
  'Supports satiety & energy',
  'Easy, delicious, and convenient',
  'Personalized & sustainable',
];

export default function SlimPainValue() {
  return (
    <section id="fit" className="py-14 md:py-20 bg-[#F9F7F2]">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-6 items-center">
          <SlimReveal className="rounded-[1.5rem] bg-[#F3EEE6] p-7 md:p-9 min-h-[280px] flex flex-col justify-center">
            <h2 className="text-2xl md:text-[1.75rem] font-medium text-[#2C322E] leading-snug mb-6">
              You don&apos;t need another extreme plan.
            </h2>
            <ul className="space-y-3.5">
              {pains.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-[#6C6763]">
                  <span className="w-5 h-5 rounded-full bg-[#C4A99A]/35 flex items-center justify-center shrink-0">
                    <X className="w-3 h-3 text-[#8B6F5C]" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </SlimReveal>

          <SlimReveal delay={60} className="hidden md:flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#2A4035] text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
          </SlimReveal>

          <SlimReveal delay={100} className="rounded-[1.5rem] bg-[#E8F0EA] p-7 md:p-9 min-h-[280px] flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-[1.75rem] font-medium text-[#2A4035] leading-snug mb-6">
                You need one simple ritual you can actually keep.
              </h2>
              <ul className="space-y-3.5">
                {values.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-[#2C322E]/85">
                    <span className="w-5 h-5 rounded-full bg-[#2A4035] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -right-2 -bottom-2 w-28 h-28 rounded-2xl overflow-hidden opacity-90 shadow-soft rotate-3 hidden sm:block">
              <Image src={shakeImg} alt="Slim shake" fill className="object-cover" sizes="112px" />
            </div>
          </SlimReveal>
        </div>
      </div>
    </section>
  );
}
