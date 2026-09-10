'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import SlimReveal from './SlimReveal';
import shakerBg from '@/assets/slim/slim-shaker-bg.png';

const features = [
  'Daily reminders for your Slim ritual',
  'Track progress with Sunny AI',
  'Personalized plans & check-ins',
  'Scan your pack to activate your journey',
];

export default function SlimAppSection() {
  const scrollToApp = () => {
    window.open('https://apps.apple.com', '_blank');
  };

  return (
    <section id="app" className="py-12 lg:py-16 bg-[#F3F0EA] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr_0.8fr] gap-8 lg:gap-6 xl:gap-10 items-center">
          <SlimReveal className="flex justify-center lg:justify-end">
            <div className="relative w-[200px] sm:w-[220px]">
              <div className="rounded-[2rem] border-[5px] border-[#737A65]/15 bg-white p-4 shadow-soft-xl aspect-[9/17] flex flex-col">
                <p className="text-[10px] uppercase tracking-wider text-[#6C6763] mb-3">Today</p>
                {['Morning Shake', 'Hydration', 'Move 20 min', 'Evening check-in'].map((item, i) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 rounded-xl bg-[#F3F0EA] px-3 py-2.5 mb-2 text-xs text-[#3D4038]"
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] ${
                        i < 2 ? 'bg-[#737A65] border-[#737A65] text-white' : 'border-[#737A65]/30'
                      }`}
                    >
                      {i < 2 ? '✓' : ''}
                    </span>
                    {item}
                  </div>
                ))}
                <div className="mt-auto rounded-xl bg-[#737A65] text-white p-3 text-center">
                  <p className="text-[10px] opacity-70">Sunny says</p>
                  <p className="text-xs font-medium">Great rhythm today ☀</p>
                </div>
              </div>
            </div>
          </SlimReveal>

          <SlimReveal delay={80}>
            <h2
              className="text-[1.75rem] sm:text-[2rem] lg:text-[2.2rem] font-medium text-[#3D4038] mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Luckdate App + Sunny
            </h2>
            <p className="text-sm text-[#6C6763] leading-relaxed mb-5 max-w-md">
              Your companion for simple daily rituals — personalized guidance, reminders, and progress
              tracking that help habits stick.
            </p>
            <ul className="space-y-2.5 mb-6">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#3D4038]/85">
                  <Check className="w-4 h-4 text-[#737A65] shrink-0 mt-0.5" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={scrollToApp}
              className="bg-[#737A65] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#5F6558] transition-colors"
            >
              See the App
            </button>
          </SlimReveal>

          <SlimReveal delay={120} className="hidden lg:block relative h-[320px] xl:h-[360px]">
            <Image
              src={shakerBg}
              alt="Luckdate shaker bottle"
              fill
              className="object-contain object-right"
              sizes="280px"
            />
          </SlimReveal>
        </div>
      </div>
    </section>
  );
}
