'use client';

import Image from 'next/image';
import strengthScience from '@/assets/shilajit/strength-science.jpg';

const phases = [
  {
    num: "01",
    title: "Hormone & Energy Reboot",
    desc: "Shilajit and Tongkat Ali initiate deep ATP production and balance natural male hormone levels.",
    note: "Many men report increased stamina, confidence, and drive within the first 24–48 hours.*",
  },
  {
    num: "02",
    title: "Stress & Cortisol Control",
    desc: "Ashwagandha helps regulate cortisol pathways that interfere with physical and mental performance.",
    note: "Lower stress is strongly linked to higher libido, improved arousal, and better mood.*",
  },
  {
    num: "03",
    title: "Nitric Oxide + Blood Flow",
    desc: "Maca Root and Tribulus promote stronger circulation and nitric oxide synthesis.",
    note: "Firmer • Fuller • Better sensitivity • Stronger endurance.*",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-8 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <p className="text-center text-primary font-body text-[10px] sm:text-sm font-bold uppercase tracking-widest mb-1.5 sm:mb-3">
          THE SCIENCE
        </p>
        <h2 className="font-display text-lg sm:text-3xl lg:text-5xl font-bold text-center text-foreground mb-5 sm:mb-14">
          How <span className="text-gold-gradient">Luckdate</span> Works (<span className="font-body">3</span>-Phase System)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-12 items-center">
          <div className="flex justify-center order-1 lg:order-1">
            <div className="relative max-w-[160px] sm:max-w-xs lg:max-w-sm rounded-2xl overflow-hidden">
              <Image
                src={strengthScience}
                alt="Luckdate 3-Phase System"
                className="w-full h-full object-cover"
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 320px, 384px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-primary/20 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent" />
            </div>
          </div>
          <div className="space-y-4 sm:space-y-10 order-2 lg:order-2">
            {phases.map((p) => (
              <div key={p.num} className="flex gap-3 sm:gap-5">
                <div className="flex-shrink-0 w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-body text-xs sm:text-lg font-bold text-gold-gradient">{p.num}</span>
                </div>
                <div>
                  <h3 className="font-body text-sm sm:text-xl font-extrabold text-foreground mb-0.5 sm:mb-2 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-[11px] sm:text-base text-foreground/60 font-body mb-0.5 leading-relaxed">{p.desc}</p>
                  <p className="text-[10px] sm:text-sm text-primary/70 font-body italic">{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
