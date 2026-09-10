'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import imgCategoryEnergy from '@/assets/category-energy.jpg';
import imgCategoryImmunity from '@/assets/category-immunity.jpg';
import imgCategoryBeauty from '@/assets/category-beauty.jpg';

gsap.registerPlugin(ScrollTrigger);

const STATIC_CATEGORIES = [
  { id: 1, name: 'Energy', description: 'Boost vitality', image: imgCategoryEnergy.src, icon: 'Zap', color: 'from-orange-500/20 to-yellow-500/20', productId: 6 },
  { id: 2, name: 'Immunity', description: 'Strengthen defense', image: imgCategoryImmunity.src, icon: 'Shield', color: 'from-green-500/20 to-emerald-500/20', productId: 12 },
  { id: 3, name: 'Beauty', description: 'Glow from within', image: imgCategoryBeauty.src, icon: 'Sparkles', color: 'from-pink-500/20 to-rose-500/20', productId: 8 },
];

const getIconByName = (name: string) => {
  const IconComponent = (LucideIcons as Record<string, unknown>)[name];
  return (IconComponent ?? LucideIcons.Sparkles) as React.ComponentType<{ className?: string }>;
};

const Categories = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<typeof STATIC_CATEGORIES>([]);
  const router = useRouter();

  useEffect(() => {
    setCategories(STATIC_CATEGORIES);
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.category-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { rotateX: 90, opacity: 0 },
          {
            rotateX: 0,
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
  }, [categories]);

  const handleCardClick = (productId: number) => {
    if (productId) {
      router.push(`/product/${productId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="py-20 lg:py-32 bg-[#F7F5F1] overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block text-[#D8CBB8] text-sm font-medium uppercase tracking-wider mb-4">
            {t('categories.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4E554B] font-['Montserrat']">
            {t('categories.title')}
          </h2>
        </div>

        {categories.length > 0 ? (
          <div
            ref={gridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ perspective: '1000px' }}
          >
            {categories.map((category) => {
              const IconComponent = getIconByName(category.icon);
              return (
                <div
                  key={category.id}
                  onClick={() => handleCardClick(category.productId)}
                  className="category-card group relative h-80 lg:h-96 rounded-3xl overflow-hidden cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4E554B]/80 via-[#4E554B]/20 to-transparent" />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-[#D8CBB8] group-hover:scale-110">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1 font-['Montserrat']">
                      {category.name}
                    </h3>
                    <p className="text-white/70 text-sm mb-4">{category.description}</p>

                    <div className="flex items-center gap-2 text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span className="text-sm font-medium">Explore Product</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="absolute inset-0 pointer-events-none group-hover:shadow-2xl transition-shadow duration-500 rounded-3xl" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#D8CBB8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
