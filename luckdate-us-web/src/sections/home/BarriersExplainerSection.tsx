'use client';

import { assetPath } from '@/lib/assetPath';

/**
 * ARMRA-inspired “The barriers” block —
 * left looping mucosa video (full-bleed to viewport left), right explainer copy.
 */
export function BarriersExplainerSection() {
  return (
    <section id="the-barriers" className="relative overflow-hidden bg-[#F7F5F1]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_40%,rgba(245,228,170,0.45)_0%,rgba(210,230,200,0.28)_35%,rgba(255,210,230,0.18)_58%,transparent_75%)]"
      />

      <div className="relative grid w-full items-center gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Video: flush to viewport left edge */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8DFD0] lg:aspect-auto lg:min-h-[560px] xl:min-h-[640px]">
          <video
            className="absolute inset-0 h-full w-full object-cover object-left"
            autoPlay
            muted
            loop
            playsInline
            poster={assetPath('/videos/barriers-bright-poster.jpg')}
            aria-label="Soft visualization of the body’s protective barrier"
          >
            <source src={assetPath('/videos/barriers-bright.webm')} type="video/webm" />
            <source src={assetPath('/videos/barriers-bright.mp4')} type="video/mp4" />
          </video>
        </div>

        <div className="relative px-5 py-12 sm:px-10 sm:py-16 lg:max-w-[36rem] lg:px-12 lg:py-20 xl:px-16">
          <h2 className="font-['Montserrat'] text-[2.25rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111] sm:text-5xl lg:text-[3.25rem]">
            The barriers
          </h2>

          <div className="mt-8 space-y-5 text-[15px] font-medium leading-relaxed text-[#1A1A1A] sm:mt-10 sm:text-base">
            <p>
              Modern-day living has a negative impact on our environment and on our bodies. Your
              mucosa is an inside suit of armor — a skin-like barrier of protection that lines your
              mouth, gut, and more.
            </p>
            <p>
              This barrier houses much of your immune system and is your first line of defense
              against everything inhaled and ingested from the outside world.
            </p>
            <p>
              Yet modern exposures like pollution, chemicals, stress, and diet cause these barriers
              to break down — making it harder to keep nutrition in balance day after day.
            </p>
            <p>
              Transform your health starting at its foundation. luckdate nutrition rituals help
              reinforce daily protein and nutrient intake so your body has what it needs to guard
              against everyday wear and restore balance from the inside out. Finish with a lighter
              feel — youthful vitality that comes easily.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
