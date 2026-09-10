'use client';

import Image from 'next/image';
import { FlaskConical, Leaf, Orbit, Sun } from 'lucide-react';
import heroImg from '@/assets/slim/slim-hero-kitchen-v3.png';

interface SlimHeroProps {
  onShopNow: () => void;
}

const pillars = [
  { icon: Leaf, label: 'Thoughtful Products' },
  { icon: Sun, label: 'Daily Rituals' },
  { icon: FlaskConical, label: 'Personalized Guidance' },
  { icon: Orbit, label: 'Long-term Vitality' },
];

export default function SlimHero({ onShopNow }: SlimHeroProps) {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-[#FCFBF7] overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-[2fr_3fr] items-center min-h-0 lg:min-h-[580px] lg:max-h-[660px]">
          {/* Left 40% */}
          <div className="flex flex-col justify-center px-5 sm:px-8 lg:pl-10 xl:pl-14 lg:pr-8 py-10 lg:py-12">
            <h1
              className="text-[2.1rem] sm:text-[2.5rem] lg:text-[2.85rem] xl:text-[3rem] font-medium text-[#3D4038] leading-[1.08] tracking-[-0.01em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Feel Alive.
              <br />
              Meet Luckdate.
            </h1>

            <p className="mt-4 text-[14px] sm:text-[15px] text-[#3D4038]/90 leading-relaxed max-w-[380px] font-medium">
              Thoughtful products, daily rituals, and personalized guidance for long-term well-being.
            </p>
            <p className="mt-2.5 text-[13px] sm:text-sm text-[#6C6763] leading-relaxed max-w-[380px]">
              From daily nutrition to healthy aging, Luckdate helps you build a life of energy, balance, and
              consistency.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => scrollTo('#shop')}
                className="bg-[#737A65] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#5F6558] transition-colors"
              >
                Explore Daily Rituals
              </button>
              <button
                onClick={() => scrollTo('#product')}
                className="border border-[#3D4038]/30 bg-white text-[#3D4038] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#3D4038]/5 transition-colors"
              >
                Meet Slim Vitality
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 max-w-[320px]">
              {pillars.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-start gap-1.5">
                  <Icon className="w-[18px] h-[18px] text-[#737A65]" strokeWidth={1.5} />
                  <span className="text-[10px] sm:text-[11px] text-[#6C6763] leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right 60% — wide landscape image */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[580px] xl:h-[620px]">
            <div
              className="absolute inset-0"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%)',
              }}
            >
              <Image
                src={heroImg}
                alt="Woman enjoying her morning Luckdate Slim Vitality ritual with Sunny app"
                fill
                className="object-cover object-[72%_center]"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-[20%]"
              style={{
                background: 'linear-gradient(to right, #FCFBF7 0%, rgba(252, 251, 247, 0.9) 50%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
