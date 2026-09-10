'use client';

import { useEffect, useRef, useState } from 'react';
import trusted1 from '@/assets/body_purification/trusted-1.png';
import trusted2 from '@/assets/body_purification/trusted-2.png';
import trusted3 from '@/assets/body_purification/trusted-3.png';
import trusted4 from '@/assets/body_purification/trusted-4.png';
import { LazyImg } from './LazyMedia';

const stats = [
  {
    value: 94,
    text: (
      <>
        Said their body odor <strong className="text-foreground">noticeably decreased</strong> after taking LuckDate consistently for 2+ weeks
      </>
    ),
  },
  {
    value: 91,
    text: (
      <>
        Said they no longer worry about how their <strong className="text-foreground">breath smelled</strong> throughout the day - even without mints
      </>
    ),
  },
  {
    value: 92,
    text: (
      <>
        Would recommend LuckDate <strong className="text-foreground">to a friend</strong> for body odor, breath, or general freshness
      </>
    ),
  },
  {
    value: 89,
    text: (
      <>
        Said LuckDate <strong className="text-foreground">worked better than anything they&apos;ve tried</strong> over deodorants, sprays, and other supplements
      </>
    ),
  },
];

const CountUp = ({ target, active, duration = 1400 }: { target: number; active: boolean; duration?: number }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return <>{n}%</>;
};

const NumbersSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-secondary py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Trust badge */}
        <div className="max-w-xl mx-auto mb-10 sm:mb-14 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex -space-x-2">
              {[trusted1, trusted2, trusted3, trusted4].map((img, index) => (
                <LazyImg
                  key={index}
                  src={img.src}
                  alt=""
                  className="w-7 h-7 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Rated 4.9/5.0 · 14,837+ Reviews
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-primary leading-tight">
            Trusted By <span className="font-body tabular-nums">100,000+</span>
          </h3>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            A daily supplement that eliminates body odor<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>&amp; bad breath from the inside out.
          </p>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-display text-foreground leading-tight text-center">
          The Numbers Don&apos;t Lie
        </h2>
        <p className="mt-3 sm:mt-4 text-sm lg:text-base text-muted-foreground text-center max-w-3xl mx-auto">
          We surveyed thousands of LuckDate customers. Here&apos;s what they told us:
        </p>
        <div ref={ref} className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 max-w-6xl mx-auto">
          {stats.map((s, i) => (
            <div
              key={s.value}
              className={`text-center px-2 transition-all duration-700 ease-out ${
                active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="font-body font-bold text-primary text-5xl sm:text-6xl lg:text-7xl leading-none tabular-nums tracking-tight">
                <CountUp target={s.value} active={active} duration={1200 + i * 150} />
              </div>
              <p className="mt-3 sm:mt-4 text-sm lg:text-base text-muted-foreground leading-relaxed">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NumbersSection;
