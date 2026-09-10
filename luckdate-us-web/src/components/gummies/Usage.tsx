'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Sun, Briefcase, Car, Home, Clock, Check } from 'lucide-react';
import a4Img from '@/assets/gummies/probiotic-gummies-usage.jpg';

const scenarios = [
  {
    title: 'At Home',
    description: 'Start your day with two gummies alongside your morning routine.',
    icon: <Home className="w-6 h-6 text-amber-500" />,
    time: 'Morning',
  },
  {
    title: 'At Work',
    description: 'Keep a bottle at your desk for a midday wellness boost.',
    icon: <Briefcase className="w-6 h-6 text-deep-rose" />,
    time: 'Anytime',
  },
  {
    title: 'On The Go',
    description: 'Portable and convenient—take them wherever life takes you.',
    icon: <Car className="w-6 h-6 text-mint-green" />,
    time: 'Travel',
  },
];

const benefits = [
  'Intimate Moisture',
  'Odor Control',
  'pH Balance',
  'Healthy Flora',
  'Boost Circulation',
];

export default function Usage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="usage" ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 lg:mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-mint-green/30 px-4 py-2 rounded-full mb-6">
            <Clock className="w-4 h-4 text-dark-charcoal" />
            <span className="text-sm font-body font-medium text-dark-charcoal">Daily Routine</span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-dark-charcoal mb-6">
            Women&apos;s Health, Embrace Freedom
          </h2>

          <p className="font-body text-lg text-medium-gray leading-relaxed">
            Simple, enjoyable wellness that fits seamlessly into your daily routine. However you choose
            to bloom, we&apos;ve got you covered.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-soft-xl border border-soft-pink/30">
              <Image
                src={a4Img}
                alt="Use Aura Gummies at Home, Work, or On The Go"
                className="w-full h-auto object-cover"
                width={600}
                height={600}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-mint-green/30 rounded-full blur-2xl -z-10" />
          </div>

          <div className="space-y-6">
            {scenarios.map((scenario, index) => (
              <div
                key={scenario.title}
                className={`bg-light-gray rounded-2xl p-6 hover:bg-mint-green/20 transition-all duration-500 hover:shadow-soft-lg hover:scale-[1.02] ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-soft-pink to-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                    {scenario.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading text-xl md:text-2xl font-semibold text-dark-charcoal">
                        {scenario.title}
                      </h3>
                      <span className="text-xs font-body font-medium text-dark-charcoal bg-white px-3 py-1 rounded-full shadow-sm">
                        {scenario.time}
                      </span>
                    </div>
                    <p className="font-body text-medium-gray leading-relaxed text-sm md:text-base">
                      {scenario.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div
              className={`bg-gradient-to-r from-soft-pink/30 to-white border border-soft-pink rounded-xl p-5 transition-all duration-700 delay-500 mt-4 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Sun className="w-6 h-6 text-deep-rose" />
                </div>
                <div>
                  <p className="font-body text-base font-bold text-dark-charcoal">
                    Recommended: 2 gummies daily
                  </p>
                  <p className="font-body text-sm text-medium-gray mt-0.5">
                    For best results, take consistently at the same time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden bg-dark-charcoal rounded-[2rem] p-10 lg:p-16 transition-all duration-700 delay-600 shadow-2xl ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-deep-rose/20 blur-[100px] pointer-events-none" />

          <div className="relative text-center mb-10">
            <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              All-Day Intimate Comfort
            </h3>
            <p className="font-body text-lg md:text-xl text-[#F5E6E8] max-w-2xl mx-auto font-light">
              Experience moisture-balanced pH and 24/7 odor-free freshness.{' '}
              <strong className="font-semibold text-white">
                Regain your confidence from the inside out.
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            {benefits.map((benefit, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full text-base font-body text-white shadow-lg hover:bg-white/20 transition-colors duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-deep-rose flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
