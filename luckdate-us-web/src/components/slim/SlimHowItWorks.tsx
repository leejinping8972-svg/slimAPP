'use client';

import { CalendarCheck, CupSoda, Sun, ArrowRight } from 'lucide-react';
import { Fragment } from 'react';
import SlimReveal from './SlimReveal';

const steps = [
  {
    icon: CupSoda,
    title: 'Choose Your Ritual',
    desc: 'Start with the product that fits your daily needs.',
  },
  {
    icon: Sun,
    title: 'Meet Sunny',
    desc: 'Receive personalized guidance and gentle reminders.',
  },
  {
    icon: CalendarCheck,
    title: 'Build Your Rhythm',
    desc: 'Turn daily actions into progress you can keep.',
  },
];

export default function SlimHowItWorks() {
  return (
    <section id="how-it-works" className="py-12 lg:py-16 bg-[#FCFBF7]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <SlimReveal className="text-center mb-10 lg:mb-14">
          <h2
            className="text-[1.75rem] sm:text-[2rem] lg:text-[2.35rem] font-medium text-[#3D4038]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            How Luckdate Works
          </h2>
        </SlimReveal>

        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 lg:gap-0 max-w-[1040px] mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Fragment key={step.title}>
                <SlimReveal delay={i * 80} className="w-full max-w-[320px] lg:max-w-none lg:flex-1">
                  <div className="h-full min-h-[200px] bg-[#F5F2EC] border border-[#E8E4DC]/80 rounded-2xl px-5 sm:px-7 py-7 sm:py-8 text-center">
                    <div className="w-8 h-8 rounded-full bg-[#737A65] text-white text-sm font-semibold flex items-center justify-center mx-auto mb-5">
                      {i + 1}
                    </div>
                    <Icon className="w-8 h-8 text-[#737A65] mx-auto mb-5" strokeWidth={1.5} />
                    <h3
                      className="text-base sm:text-lg font-semibold text-[#3D4038] mb-2.5"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6C6763] leading-relaxed">{step.desc}</p>
                  </div>
                </SlimReveal>

                {i < steps.length - 1 && (
                  <div className="flex items-center justify-center py-1 lg:py-0 lg:px-3 xl:px-5 shrink-0">
                    <ArrowRight className="w-5 h-5 text-[#3D4038]/55 rotate-90 lg:rotate-0" strokeWidth={1.5} />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
