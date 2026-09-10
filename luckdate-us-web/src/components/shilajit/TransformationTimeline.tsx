'use client';

import { Zap, Shield, Rocket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const phases = [
  {
    icon: Zap,
    period: 'Days 1–14',
    title: 'The Initial Surge',
    points: [
      'Energy spikes you can feel',
      'Daily drive and focus return',
      'Bedroom stamina begins to rise',
    ],
  },
  {
    icon: Shield,
    period: 'Weeks 3–4',
    title: 'Power and Control',
    points: [
      'Noticeable muscle pump and strength gains',
      'Bedroom performance sharpens',
      'Drive and motivation intensify',
    ],
  },
  {
    icon: Rocket,
    period: 'Month 3+',
    title: 'Peak Vigor Mastery',
    points: [
      'Lean muscle growth accelerates',
      'Endurance peaks in the gym & bedroom',
      'The primal edge every man craves',
    ],
  },
];

export default function TransformationTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrolled = viewportHeight - rect.top;
      const total = rect.height + viewportHeight * 0.5;
      setProgress(Math.min(Math.max(scrolled / total, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-8 sm:py-20 bg-background" ref={sectionRef}>
      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        <h2 className="font-display text-lg sm:text-3xl lg:text-5xl font-bold text-center text-foreground mb-1.5 sm:mb-4">
          Your Peak Performance <span className="text-gold-gradient">Transformation</span>
        </h2>
        <p className="text-center text-foreground/60 font-body text-[11px] sm:text-base mb-6 sm:mb-16">
          Natural performance optimization happens in phases. Here is what to expect.
        </p>

        <div className="relative pl-12 sm:pl-24">
          <div className="absolute left-[16px] sm:left-[26px] top-6 bottom-6 w-px bg-border/30" />
          <div
            className="absolute left-[16px] sm:left-[26px] top-6 w-px origin-top"
            style={{
              height: `calc((100% - 48px) * ${progress})`,
              background: 'linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.3) 100%)',
              boxShadow: '0 0 8px hsl(var(--primary) / 0.4), 0 0 20px hsl(var(--primary) / 0.15)',
            }}
          />
          {progress > 0.02 && (
            <div
              className="absolute left-[16px] sm:left-[26px] w-px"
              style={{
                top: `calc(24px + (100% - 48px) * ${progress})`,
                transform: 'translate(-3px, -4px)',
              }}
            >
              <div className="w-[7px] h-[7px] rounded-full bg-primary animate-pulse shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
            </div>
          )}

          {phases.map((phase, i) => {
            const phaseThreshold = i / phases.length;
            const isActive = progress > phaseThreshold + 0.05;

            return (
              <div key={i} className={`relative ${i < phases.length - 1 ? 'pb-6 sm:pb-16' : ''}`}>
                <div className="absolute -left-[32px] sm:-left-[50px] top-0 flex items-center gap-2 sm:gap-4">
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all duration-700 ${
                      isActive ? 'bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.4)]' : 'bg-muted'
                    }`}
                  >
                    <phase.icon
                      className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors duration-700 ${
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <span
                    className={`whitespace-nowrap text-[9px] sm:text-sm font-body font-semibold border rounded-full px-2 sm:px-5 py-0.5 sm:py-1.5 transition-all duration-700 ${
                      isActive ? 'text-primary border-primary/50' : 'text-muted-foreground border-border'
                    }`}
                  >
                    {phase.period}
                  </span>
                </div>

                <div className={`pt-10 sm:pt-16 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  <h3 className="font-display text-base sm:text-2xl lg:text-3xl font-bold text-foreground mb-1.5 sm:mb-4">
                    {phase.title}
                  </h3>
                  <div className="space-y-0.5 sm:space-y-1">
                    {phase.points.map((p, j) => (
                      <div key={j} className="flex items-center gap-1.5 sm:gap-2.5">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary flex-shrink-0 shadow-[0_0_6px_hsl(var(--primary)/0.5)]" />
                        <span className="text-[11px] sm:text-base text-foreground/60 font-body leading-relaxed">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
