'use client';

import { LazyVideo } from './LazyMedia';

const GutHealthBanner = () => {
  return (
    <section className="py-5 sm:py-7 lg:py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-16">
          {/* Left: Video */}
          <div className="lg:w-1/2 rounded-2xl overflow-hidden shadow-lg">
            <LazyVideo
              className="w-full h-auto block"
              src="/body_purification/videos/hero-loop.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          {/* Right: Text */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-brand-dark mb-3 sm:mb-4 leading-tight">
              Eliminate Bad Breath <span className="font-sans">&amp;</span> Body Odor in Less Than a Week
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Even with excellent oral care, imbalances inside the body — particularly in the gut —
              can cause persistent bad breath. Our plant-based formula supports gut health and
              tackles odor at the source, delivering long-lasting freshness that goes beyond temporary fixes.
            </p>
            <a
              href="#top"
              className="inline-block bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors"
            >
              Transform Your Oral Health
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GutHealthBanner;
