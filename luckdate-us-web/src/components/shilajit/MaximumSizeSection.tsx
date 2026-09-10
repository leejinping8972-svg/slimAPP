'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { ArrowUp, Check } from 'lucide-react';

import masculinityPower from '@/assets/shilajit/masculinity-power.jpg';
import review1 from '@/assets/shilajit/review-1.jpg';
import review2 from '@/assets/shilajit/review-2.jpg';
import review3 from '@/assets/shilajit/review-3.jpg';
import review4 from '@/assets/shilajit/review-4.jpg';
import review5 from '@/assets/shilajit/review-5.jpg';
import review6 from '@/assets/shilajit/review-6.jpg';
import review7 from '@/assets/shilajit/review-7.jpg';
import review8 from '@/assets/shilajit/review-8.jpg';
import review9 from '@/assets/shilajit/review-9.jpg';
import review10 from '@/assets/shilajit/review-10.jpg';
import review11 from '@/assets/shilajit/review-11.jpg';

const testimonials = [
  { label: 'Verified', verifiedImg: review1 },
  { label: 'Verified', verifiedImg: review2 },
  { label: 'Verified', verifiedImg: review3 },
  { label: 'Verified', verifiedImg: review4 },
  { label: 'Verified', verifiedImg: review5 },
  { label: 'Verified', verifiedImg: review6 },
  { label: 'Verified', verifiedImg: review7 },
  { label: 'Verified', verifiedImg: review8 },
  { label: 'Verified', verifiedImg: review9 },
  { label: 'Verified', verifiedImg: review10 },
  { label: 'Verified', verifiedImg: review11 },
];

const stats = [
  { value: "96%", desc: "men noticed improved endurance, confidence, and overall physical performance." },
  { value: "45m", desc: "average increase in sustained activity endurance." },
  { value: "92%", desc: "men reported noticeable increases in daily energy, drive, and confidence." },
];


interface MaximumSizeSectionProps {
  onScrollToTop: () => void;
}

export default function MaximumSizeSection({ onScrollToTop }: MaximumSizeSectionProps) {
  const marqueeItems = useMemo(() => [...testimonials, ...testimonials], []);

  return (
    <section className="py-8 sm:py-20 bg-card">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 mb-6 sm:mb-14">
          <div className="bg-primary rounded-xl p-3 sm:px-6 sm:py-5 text-primary-foreground flex flex-col items-center text-center sm:flex-row sm:text-left sm:justify-center gap-1.5 sm:gap-5">
            <span className="font-body text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight whitespace-nowrap leading-none">4 of 5</span>
            <span className="font-body text-[11px] sm:text-lg font-semibold text-primary-foreground/90 leading-snug">
              reported relief from common male vitality concerns
            </span>
          </div>
          <div className="bg-primary rounded-xl p-3 sm:px-6 sm:py-5 text-primary-foreground flex flex-col items-center text-center sm:flex-row sm:text-left sm:justify-center gap-1.5 sm:gap-5">
            <span className="font-body text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none">93%</span>
            <span className="font-body text-[11px] sm:text-lg font-semibold text-primary-foreground/90 leading-snug">
              boosted endurance & overall performance
            </span>
          </div>
        </div>

        <h2 className="font-display text-lg sm:text-4xl lg:text-5xl font-bold text-center text-foreground mb-1.5 sm:mb-4">
          MAXIMUM SIZE. PURE CONFIDENCE. ZERO RISK.
        </h2>
        <p className="text-center text-foreground/50 font-body text-xs sm:text-base mb-5 sm:mb-12">
          Join 110,000+ men who reclaimed their bedroom authority.
        </p>

        <div className="relative overflow-hidden group">
          <div className="flex w-max animate-marquee gap-2.5 sm:gap-5">
            {marqueeItems.map((t, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-[52vw] max-w-[220px] sm:w-[300px] sm:max-w-none aspect-square rounded-xl overflow-hidden"
              >
                <Image
                  src={t.verifiedImg}
                  alt="Customer transformation"
                  fill
                  className="object-cover scale-110"
                  sizes="(max-width: 640px) 52vw, 300px"
                />
                <span className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 flex items-center gap-1 text-[10px] sm:text-xs font-body font-bold text-primary-foreground bg-gold-gradient px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-12 items-center mt-10 sm:mt-24">
          <div className="relative w-[200px] h-[280px] sm:w-[320px] sm:h-[450px] lg:w-[384px] lg:h-[540px] mx-auto rounded-2xl overflow-hidden">
            <Image src={masculinityPower} alt="Masculine strength and vitality" fill className="object-cover" sizes="(max-width: 640px) 200px, (max-width: 1024px) 320px, 384px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-primary/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent" />
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4">
              DEMAND MORE FROM YOUR <span className="text-gold-gradient">MASCULINITY.</span>
            </h2>
            <p className="text-foreground/50 font-body text-xs sm:text-base mb-4 sm:mb-8">
              The natural breakthrough men are finally trusting to perform.
            </p>
            <div className="space-y-3 sm:space-y-5 mb-4 sm:mb-8">
              {stats.map((s) => (
                <div key={s.value} className="flex items-center gap-3 sm:gap-4 border-b border-border pb-3 sm:pb-4">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <span className="font-body text-xl sm:text-2xl lg:text-3xl font-black text-gold-gradient flex-shrink-0 w-14 sm:w-20 tracking-tight leading-none">
                    {s.value}
                  </span>
                  <p className="text-[11px] sm:text-base text-foreground/60 font-body leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={onScrollToTop}
              className="w-full bg-gold-gradient text-primary-foreground font-body font-bold py-2.5 sm:py-3 px-8 rounded-xl text-sm sm:text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              SHOP LUCKDATE NOW →
            </button>
            <p className="text-[10px] sm:text-xs text-foreground/40 font-body mt-2">
              Results based on a 12-week survey of our regular Luckdate subscribers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
