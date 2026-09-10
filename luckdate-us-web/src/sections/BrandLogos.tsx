'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { Award, Shield, Leaf, Beaker, Heart, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BrandLogos = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  const certifications = [
    { icon: Award, label: t('brandLogos.certifications.fda') },
    { icon: Shield, label: t('brandLogos.certifications.gmp') },
    { icon: Leaf, label: t('brandLogos.certifications.natural') },
    // { icon: Beaker, label: t('brandLogos.certifications.tested') },
    // { icon: Heart, label: t('brandLogos.certifications.vegan') },
    // { icon: Star, label: t('brandLogos.certifications.premium') },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-white overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 mb-8">
        <p className="text-center text-sm text-[#6C6763]/60 uppercase tracking-wider">
          {t('brandLogos.trustedBy')}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 px-4 sm:gap-4 sm:px-6 lg:gap-6 lg:px-12 xl:px-20">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="flex items-center flex-col lg:flex-row lg:items-center md:justify-center justify-center gap-2 sm:gap-3 px-4 py-3 sm:px-8 sm:py-4 bg-[#F7F5F1] rounded-xl hover:bg-[#D8CBB8]/5 transition-colors duration-300 group cursor-pointer"
          >
            <cert.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D8CBB8] transition-transform duration-300 group-hover:scale-110 shrink-0" />
            <span className="text-[#4E554B] font-medium text-sm sm:text-base truncate">{cert.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandLogos;
