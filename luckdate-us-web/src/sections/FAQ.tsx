'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { FaqItem } from '@/lib/api/types';

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    const localeItems = t('faq.items', { returnObjects: true }) as { question: string; answer: string }[];
    if (Array.isArray(localeItems) && localeItems.length > 0) {
      setFaqs(localeItems.map((item, i) => ({ id: i, question: item.question, answer: item.answer })));
    }
  }, [t]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      const items = sectionRef.current?.querySelectorAll('.faq-item');
      if (items && faqs.length > 0) {
        gsap.fromTo(
          items,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
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
  }, [faqs.length]);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-12 lg:py-16 bg-[#F7F5F1] overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4E554B] font-['Montserrat']">
              {t('faq.title')}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="faq-item bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium text-[#4E554B] pr-4">{faq.question}</span>
                  <div
                    className={`w-8 h-8 bg-[#F7F5F1] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openIndex === index ? 'bg-[#D8CBB8] rotate-180' : ''
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-colors duration-300 ${
                        openIndex === index ? 'text-white' : 'text-[#6C6763]'
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 custom-expo ${
                    openIndex === index ? 'max-h-[640px]' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-[#6C6763]/70 leading-relaxed">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>

          <div
            id="contact-support-team"
            style={{ scrollMarginTop: '110px' }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-4 shadow-sm">
              <div className="w-10 h-10 bg-[#D8CBB8]/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#D8CBB8]" />
              </div>
              <div className="text-left">
                <p className="text-sm text-[#6C6763]/60">{t('faq.stillQuestions')}</p>
                <a href="/contact" className="text-[#D8CBB8] font-medium hover:underline">
                  {t('faq.contactSupport')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
