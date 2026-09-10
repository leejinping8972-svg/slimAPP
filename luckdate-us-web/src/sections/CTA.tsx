'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Percent } from 'lucide-react';
import ctaBackground from '@/assets/cta-background.jpg';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(badgeRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });

      const rings = buttonRef.current?.querySelectorAll('.pulse-ring');
      if (rings) {
        gsap.to(rings, {
          scale: 1.5,
          opacity: 0,
          duration: 2,
          stagger: 0.5,
          repeat: -1,
          ease: 'power2.out',
        });
      }

      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToProducts = () => {
    const element = document.querySelector('#products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-12 lg:py-16 overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src={ctaBackground.src}
          alt="Healthy lifestyle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#4E554B]/70" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div
              ref={badgeRef}
              className="relative w-20 h-20 lg:w-24 lg:h-24"
              style={{ transformOrigin: 'center center' }}
            >
              <div className="w-full h-full bg-[#D8CBB8] rounded-full flex flex-col items-center justify-center shadow-lg">
                <Percent className="w-5 h-5 lg:w-6 lg:h-6 text-white mb-0.5" />
                <div className="flex items-baseline text-white">
                  <span className="text-xl lg:text-2xl font-bold font-['Montserrat']">20</span>
                  <span className="text-xs lg:text-sm ml-0.5">{t('cta.discountBadge.off')}</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 font-['Montserrat'] leading-tight">
            {t('cta.title', { discount: '20' })}
            <span className="text-[#D8CBB8]">{t('cta.titleHighlight')}</span>
          </h2>

          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>

          <div ref={buttonRef} className="relative inline-block">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="pulse-ring absolute w-full h-full bg-[#D8CBB8]/30 rounded-full" />
              <div className="pulse-ring absolute w-full h-full bg-[#D8CBB8]/20 rounded-full" />
            </div>
            
            <Button
              onClick={scrollToProducts}
              className="relative bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white px-10 py-7 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              {t('cta.button')}
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span>{t('cta.badges.freeShipping')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span>{t('cta.badges.guarantee')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span>{t('cta.badges.cancel')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
