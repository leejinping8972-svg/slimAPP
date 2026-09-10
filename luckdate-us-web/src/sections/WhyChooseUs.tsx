'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, FlaskConical, ShieldCheck, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import aboutImage from '@/assets/about-image.jpg';

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUs = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Leaf,
      title: t('whyChooseUs.features.cleanIngredients'),
      description: t('whyChooseUs.features.cleanIngredientsDesc'),
      position: 'top-left',
    },
    {
      icon: FlaskConical,
      title: t('whyChooseUs.features.scienceBacked'),
      description: t('whyChooseUs.features.scienceBackedDesc'),
      position: 'top-right',
    },
    {
      icon: ShieldCheck,
      title: t('whyChooseUs.features.thirdParty'),
      description: t('whyChooseUs.features.thirdPartyDesc'),
      position: 'bottom-left',
    },
    {
      icon: Percent,
      title: t('whyChooseUs.features.subscribe'),
      description: t('whyChooseUs.features.subscribeDesc'),
      position: 'bottom-right',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const paths = svgRef.current?.querySelectorAll('path');
      if (paths) {
        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      }

      gsap.to(imageRef.current, {
        scale: 1.02,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const cards = sectionRef.current?.querySelectorAll('.feature-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 lg:py-16 bg-white overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="text-center mb-16 lg:mb-20">
          {/* <span className="inline-block text-[#D8CBB8] text-sm font-medium uppercase tracking-wider mb-4">
            {t('whyChooseUs.badge')}
          </span> */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4E554B] font-['Montserrat']">
            {/* {t('whyChooseUs.title')} */}
            {t('whyChooseUs.badge')}
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            style={{ zIndex: 0 }}
          >
            <path d="M 400 150 L 150 100" stroke="#D8CBB8" strokeWidth="2" fill="none" strokeLinecap="round" className="opacity-30" />
            <path d="M 400 150 L 650 100" stroke="#D8CBB8" strokeWidth="2" fill="none" strokeLinecap="round" className="opacity-30" />
            <path d="M 400 350 L 150 400" stroke="#D8CBB8" strokeWidth="2" fill="none" strokeLinecap="round" className="opacity-30" />
            <path d="M 400 350 L 650 400" stroke="#D8CBB8" strokeWidth="2" fill="none" strokeLinecap="round" className="opacity-30" />
          </svg>

          {/* Mobile: 2 columns grid, Image below; Desktop: 3 columns with image in center */}
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-12 items-center">
            {/* Mobile: First 2 cards in grid; Desktop: Left column */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-8 w-full">
              {features.slice(0, 2).map((feature, index) => (
                <div
                  key={index}
                  className="feature-card group bg-[#F7F5F1] rounded-2xl p-4 lg:p-6 hover:bg-white hover:shadow-xl transition-all duration-500"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#D8CBB8]/10 rounded-xl flex items-center justify-center mb-3 lg:mb-4 group-hover:bg-[#D8CBB8] group-hover:scale-110 transition-all duration-500">
                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#D8CBB8] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-base lg:text-xl font-semibold text-[#4E554B] mb-1 lg:mb-2 font-['Montserrat']">
                    {feature.title}
                  </h3>
                  <p className="text-[#6C6763]/70 text-xs lg:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Image - Mobile: below cards, Desktop: center */}
            <div className="relative flex justify-center py-4 lg:py-0 order-last lg:order-none">
              <div
                ref={imageRef}
                className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl"
              >
                <Image
                  src={aboutImage}
                  alt="LUCKDATE Quality"
                  fill
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#D8CBB8]/20 to-transparent" />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 border-2 border-[#D8CBB8]/10 rounded-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 sm:w-88 sm:h-88 lg:w-[28rem] lg:h-[28rem] border border-[#D8CBB8]/5 rounded-full" />
              </div>
            </div>

            {/* Mobile: Last 2 cards in grid; Desktop: Right column */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-8 w-full">
              {features.slice(2, 4).map((feature, index) => (
                <div
                  key={index}
                  className="feature-card group bg-[#F7F5F1] rounded-2xl p-4 lg:p-6 hover:bg-white hover:shadow-xl transition-all duration-500"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#D8CBB8]/10 rounded-xl flex items-center justify-center mb-3 lg:mb-4 group-hover:bg-[#D8CBB8] group-hover:scale-110 transition-all duration-500">
                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#D8CBB8] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-base lg:text-xl font-semibold text-[#4E554B] mb-1 lg:mb-2 font-['Montserrat']">
                    {feature.title}
                  </h3>
                  <p className="text-[#6C6763]/70 text-xs lg:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
