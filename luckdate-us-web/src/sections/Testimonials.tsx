'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThumbsUp, MessageCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

// Format large numbers: 2400 -> 2.4k, 12500 -> 12.5k, 1500000 -> 1.5w
const formatCount = (num: number): string => {
  if (num >= 1000000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const Testimonials = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const timeLabels = ['2d', '4h', '1d', '3d', '12h', '5d', '6h', '2d'];
  // Large numbers in k/w format
  const replyCounts = [324, 156, 892, 45, 1203, 67, 428, 215];
  const likeCounts = [12400, 8920, 21500, 5600, 34200, 18900, 9800, 15600];

  const testimonialsData = t('testimonials.items', { returnObjects: true }) as Testimonial[];

  const allTestimonials = Array.isArray(testimonialsData) ? testimonialsData.slice(0, 8).map((item) => ({
    ...item,
    rating: item.rating || 5,
  })) : [];

  const visibleTestimonials = allTestimonials.slice(0, visibleCount);
  const hasMore = visibleCount < allTestimonials.length;

  useEffect(() => {
    setVisibleCount(Math.min(3, allTestimonials.length));
  }, [allTestimonials.length]);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, allTestimonials.length));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.fromTo(sectionRef.current, { opacity: 0 }, {
          opacity: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const SocialCard = ({ testimonial, index }: { testimonial: typeof allTestimonials[0]; index: number }) => {
    const likes = likeCounts[index] || 12400;
    const replies = replyCounts[index] || 324;

    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col h-full">
        {/* Header - No avatar, just name and time */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 flex-shrink-0">
          <div className="font-semibold text-[14px] text-[#4E554B]">{testimonial.name}</div>
          <div className="text-[12px] text-[#999]">{timeLabels[index] || '2d'}</div>
        </div>

        {/* Body */}
        <div className="px-4 py-3.5 flex-1">
          <p className="text-[14px] text-[#333] leading-relaxed whitespace-pre-wrap break-words">
            {testimonial.text}
          </p>
        </div>

        {/* Footer - Fixed at bottom, no click interaction */}
        <div className="flex items-center gap-6 px-4 pb-3 pt-1 flex-shrink-0 mt-auto">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#65676b]">
            <ThumbsUp className="w-4 h-4" strokeWidth={2} />
            <span>{formatCount(likes)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#65676b]">
            <MessageCircle className="w-4 h-4" strokeWidth={2} />
            <span>{formatCount(replies)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="testimonials" ref={sectionRef} className="py-16 lg:py-24 bg-[#F7F5F1] overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {/* <span className="inline-block text-[#D8CBB8] text-sm font-medium uppercase tracking-wider mb-4">
            {t('testimonials.badge')}
          </span> */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4E554B] font-['Montserrat']">
            {t('testimonials.title').split(t('testimonials.science'))[0]}
            <span className="gradient-text">{t('testimonials.science')}</span>
            {t('testimonials.title').split(t('testimonials.science'))[1]}
          </h2>
        </div>

        {/* Grid - 8 review cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {visibleTestimonials.map((testimonial, index) => (
            <SocialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="group flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#D8CBB8] text-[#D8CBB8] rounded-full font-semibold text-sm hover:bg-[#D8CBB8] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {t('testimonials.loadMore', 'View More Reviews')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
