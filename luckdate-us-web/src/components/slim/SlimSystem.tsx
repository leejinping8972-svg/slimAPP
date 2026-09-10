'use client';

import { QrCode, Sun, ClipboardList } from 'lucide-react';
import SlimReveal from './SlimReveal';

const steps = [
  {
    num: '1',
    icon: QrCode,
    title: 'Connect Your Product',
    desc: 'Scan the QR code on your package to activate your Slim Vitality Journey.',
  },
  {
    num: '2',
    icon: Sun,
    title: 'Meet Sunny',
    desc: 'Sunny gets to know you, your goals, and your lifestyle.',
  },
  {
    num: '3',
    icon: ClipboardList,
    title: 'Begin Your 28-Day Journey',
    desc: 'Get your personalized plan, daily reminders, check-ins, and progress tracking.',
  },
];

export default function SlimSystem() {
  return (
    <section id="system" className="py-14 md:py-20 bg-[#EEF4EF]">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8">
        <SlimReveal className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[2.65rem] font-medium text-[#2C322E] leading-tight mb-3">
            More than a shake.
            <br />
            A daily system.
          </h2>
          <p className="text-sm md:text-[15px] text-[#6C6763] leading-relaxed">
            Science-backed nutrition combined with AI guidance — so consistency becomes the easiest
            part.
          </p>
        </SlimReveal>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <SlimReveal
                key={step.num}
                delay={i * 80}
                className="bg-white rounded-[1.5rem] p-6 md:p-8 text-center border border-[#2A4035]/6"
              >
                <div className="w-12 h-12 rounded-full bg-[#E8F0EA] text-[#2A4035] flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2A4035]/55 mb-2">
                  Step {step.num}
                </p>
                <h3 className="text-lg md:text-xl font-medium text-[#2C322E] mb-2.5">{step.title}</h3>
                <p className="text-sm text-[#6C6763] leading-relaxed">{step.desc}</p>
              </SlimReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
