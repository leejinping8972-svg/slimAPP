'use client';

import { Sun } from 'lucide-react';

interface SlimFinalCTAProps {
  onShopNow: () => void;
}

export default function SlimFinalCTA({ onShopNow }: SlimFinalCTAProps) {
  return (
    <section id="cta" className="bg-[#737A65] text-white py-16 lg:py-20 relative overflow-hidden">
      <Sun className="absolute right-8 bottom-8 w-32 h-32 text-white/10 pointer-events-none" strokeWidth={0.75} />
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8 text-center relative z-10">
        <h2
          className="text-3xl sm:text-4xl lg:text-[2.75rem] font-medium leading-tight mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          One small ritual.
          <br />
          One brighter day.
        </h2>
        <p className="text-sm text-white/70 mb-8">Start with what you can keep.</p>
        <button
          onClick={onShopNow}
          className="bg-white text-[#737A65] px-10 py-3.5 rounded-full text-sm font-semibold hover:bg-[#FCFBF7] transition-colors"
        >
          Start Your Journey
        </button>
      </div>
    </section>
  );
}
