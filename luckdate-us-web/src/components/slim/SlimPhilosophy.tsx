'use client';

import { Coffee, Leaf, Sun } from 'lucide-react';
import SlimReveal from './SlimReveal';

const cards = [
  {
    icon: Leaf,
    title: 'Clean Formulas',
    desc: 'Thoughtfully selected ingredients for everyday nutrition you can trust.',
  },
  {
    icon: Coffee,
    title: 'Simple Rituals',
    desc: 'One easy daily habit that fits into busy mornings and real schedules.',
  },
  {
    icon: Sun,
    title: 'Guided Progress',
    desc: 'Sunny AI helps you stay consistent with reminders and gentle check-ins.',
  },
];

export default function SlimPhilosophy() {
  return (
    <section id="philosophy" className="py-12 lg:py-16 bg-[#FCFBF7] border-t border-[#737A65]/8">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid lg:grid-cols-[7fr_13fr] gap-8 lg:gap-10 xl:gap-14 items-start">
          <SlimReveal className="lg:pt-2">
            <h2
              className="text-[1.65rem] sm:text-[1.85rem] lg:text-[2rem] xl:text-[2.15rem] font-medium text-[#3D4038] leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Wellness should fit real life.
            </h2>
            <p className="text-sm text-[#6C6763] leading-relaxed max-w-[300px]">
              Luckdate is built for women who want sustainable vitality — not another extreme plan. We combine
              clean nutrition, simple rituals, and AI guidance so healthy habits actually stick.
            </p>
          </SlimReveal>

          <div className="grid sm:grid-cols-3 gap-4 lg:gap-5">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <SlimReveal key={card.title} delay={i * 70}>
                  <div className="bg-[#F3F0EA] rounded-2xl px-5 py-6 lg:px-6 lg:py-7 h-full min-h-[168px] lg:min-h-[190px] border border-[#737A65]/8 flex flex-col">
                    <Icon className="w-5 h-5 text-[#737A65] mb-4" strokeWidth={1.5} />
                    <h3
                      className="text-[15px] font-semibold text-[#3D4038] mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#6C6763] leading-relaxed">{card.desc}</p>
                  </div>
                </SlimReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
