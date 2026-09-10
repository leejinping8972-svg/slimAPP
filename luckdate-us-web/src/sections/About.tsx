'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import aboutImage from '@/assets/about-image.png';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const features = t('about.features', { returnObjects: true }) as string[];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftRef.current) {
        gsap.fromTo(leftRef.current, { x: -60, opacity: 0 }, {
          x: 0, opacity: 1, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        });
      }
      if (rightRef.current) {
        gsap.fromTo(rightRef.current, { x: 60, opacity: 0 }, {
          x: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">

          {/* Left: Image */}
          <div ref={leftRef} className="relative">
            <div className="relative rounded-[1.5rem] overflow-hidden shadow-xl">
              <img src={aboutImage.src} alt="LUCKDATE healthy lifestyle" className="w-full h-auto object-cover aspect-[4/3]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* 5+ badge */}
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-100">
              <div className="text-4xl sm:text-5xl font-bold text-[#D8CBB8] font-['Montserrat'] leading-none">5+</div>
              <div className="text-xs sm:text-sm text-[#6C6763]/60 mt-1">{t('about.experience')}</div>
            </div>

            {/* Decorative blurs */}
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-[#D8CBB8]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-[#D8CBB8]/12 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Right: Content */}
          <div ref={rightRef} className="lg:pl-4">
            {/* Badge */}
            <span className="inline-block text-[#e74c3c] text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 bg-[#e74c3c]/06 rounded-full border border-[#e74c3c]/15">
              标题
            </span>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4E554B] mb-5 font-['Montserrat'] leading-snug">
              Our Commitment to{' '}
              <span className="text-[#D8CBB8]">Your</span>{' '}
              <span className="text-[#D8CBB8]">Health</span>
            </h2>

            {/* Description */}
            <p className="text-[#555] text-[15px] leading-relaxed mb-4">
              在 LUCKDATE，我们将植物智慧与前沿研究相结合，创造出真正有效的补充剂。拒绝虚假宣传，只为您提供纯正、高效的配方，助力您的健康之路。
            </p>
            <p className="text-[#555] text-[15px] leading-relaxed mb-8">
              我们的营养学家、科学家和健康专家团队不懈努力，从世界各地寻找优质原料。每款产品都经过严格测试，确保其安全性、有效性和高品质。
            </p>

            {/* Feature list */}
            <ul className="space-y-3">
              {(Array.isArray(features) ? features : [
                '临床验证成分',
                '纯净度第三方测试',
                '可持续采购实践',
                '无人工添加剂',
              ]).slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-center gap-3.5 bg-[#f9f9f9] hover:bg-[#f0fdf4] rounded-xl px-5 py-3.5 transition-colors duration-300 group">
                  <div className="w-7 h-7 rounded-full bg-[#D8CBB8]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D8CBB8] transition-colors duration-300">
                    <Check className="w-3.5 h-3.5 text-[#D8CBB8] group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                  </div>
                  <span className="text-[15px] text-[#333] font-medium group-hover:text-[#4E554B] transition-colors duration-300">
                    {typeof feature === 'string' ? feature : String(feature)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
