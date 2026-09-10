'use client';

import { LazyVideo } from './LazyMedia';

const DontWaitSection = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-16">
          {/* Left: Text */}
          <div className="lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-foreground mb-3 sm:mb-4 leading-tight">
              Don&apos;t Wait Another Day
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Each morning you wake up paranoid about your breath is another day stolen from real
              connection, another conversation cut short, another romantic moment ruined by
              self-doubt. You deserve to feel normal on dates. You deserve to stop pulling away
              from the people you care about.
            </p>
          </div>

          {/* Right: Video */}
          <div className="lg:w-1/2 rounded-2xl overflow-hidden shadow-lg order-1 lg:order-2">
            <LazyVideo
              className="w-full h-auto block"
              src="/body_purification/videos/dont-wait.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DontWaitSection;
