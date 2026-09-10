'use client';

import { useEffect, useRef, useState } from 'react';
import { LazyVideo } from './LazyMedia';

const weeks = [
  {
    title: "Week 1: The Subtle Shift",
    items: [
      "You may notice your breath feels fresher first",
      "Body odor intensity begins to soften – not gone yet, but different",
      "Bathroom odor starts to decrease",
    ],
  },
  {
    title: "Week 2: The Difference is Real",
    items: [
      "Body odor is noticeably lighter/minimal throughout the day",
      "Breath stays fresher longer, even after coffee and meals",
      "People closest to you start to notice the improvement before you do",
    ],
  },
  {
    title: "Week 3: Confidence Sets In",
    items: [
      "Full-day freshness – body & breath",
      "Problem areas – feet, underarms, private areas – significantly reduced",
      "You stop thinking about how you smell",
    ],
  },
  {
    title: "Week 4+: The New Normal",
    items: [
      "Consistent whole-body and breath freshness, all day",
      "Most customers say they replaced their old deodorant",
      "Results hold steady as long as you stay consistent with daily timing",
    ],
  },
];

const Check = () => (
  <svg className="w-4 h-4 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const TimelineItem = ({ week, index }: { week: typeof weeks[number]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`timeline-item relative ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 140}ms` }}
    >
      <span
        className="timeline-dot absolute -left-6 sm:-left-8 top-2 w-3.5 h-3.5 rounded-full bg-primary border-2 border-primary"
        style={{ transitionDelay: `${index * 140 + 150}ms` }}
        aria-hidden
      />
      <div className="inline-block bg-primary text-primary-foreground font-bold text-sm sm:text-[15px] px-4 py-1.5 rounded-md shadow-sm mb-3">
        {week.title}
      </div>
      <ul className="space-y-2">
        {week.items.map((item, j) => (
          <li key={j} className="flex items-start gap-2.5 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
            <Check />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TimelineSection = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-center mb-6 sm:mb-8 text-foreground">
          What&apos;s Happening Inside Your Body
        </h2>
        <div className="flex flex-col lg:flex-row items-stretch gap-6 sm:gap-10 lg:gap-16">
          <div className="lg:w-1/2 rounded-2xl overflow-hidden shadow-lg aspect-square">
            <LazyVideo
              src="/body_purification/videos/inside-body.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover block"
            />
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative pl-6 sm:pl-8">
              {/* Vertical line */}
              <span className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-primary/40" aria-hidden />
              <div className="space-y-6 sm:space-y-7">
                {weeks.map((week, i) => (
                  <TimelineItem key={i} week={week} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
