'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { BannerItem } from '@/lib/api/types';

export interface HeroSlide {
  id: string | number;
  imagePc: string;
  imageH5: string;
  alt: string;
  jumpPath?: string;
}

const FALLBACK_SLIDES: HeroSlide[] = [];

function mapBannersToSlides(banners: BannerItem[]): HeroSlide[] {
  return banners
    .filter((b) => b.image_pc || b.image_h5)
    .map((b) => ({
      id: b.id,
      imagePc: b.image_pc || b.image_h5,
      imageH5: b.image_h5 || b.image_pc,
      alt: b.name || 'LUCKDATE banner',
      jumpPath: b.jump_path || undefined,
    }));
}

interface HeroProps {
  initialBanners?: BannerItem[];
}

export const Hero = ({ initialBanners = [] }: HeroProps) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(() => {
    const fromApi = mapBannersToSlides(initialBanners);
    return fromApi.length > 0 ? fromApi : FALLBACK_SLIDES;
  }, [initialBanners]);

  const slideCount = slides.length;

  useEffect(() => {
    setCurrentSlide(0);
  }, [slideCount]);

  useEffect(() => {
    const nav = document.getElementById('site-navigation');
    if (!nav) {
      return undefined;
    }
    const syncNavHeight = () => {
      document.documentElement.style.setProperty(
        '--site-nav-height',
        `${nav.offsetHeight}px`,
      );
    };
    syncNavHeight();
    const observer = new ResizeObserver(syncNavHeight);
    observer.observe(nav);
    window.addEventListener('resize', syncNavHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncNavHeight);
    };
  }, []);

  useEffect(() => {
    if (slideCount <= 1) {
      return undefined;
    }
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideCount]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const handleBannerClick = useCallback(
    (jumpPath?: string) => {
      if (!jumpPath) {
        return;
      }
      if (jumpPath.startsWith('http://') || jumpPath.startsWith('https://')) {
        window.open(jumpPath, '_blank', 'noopener,noreferrer');
        return;
      }
      router.push(jumpPath);
    },
    [router],
  );

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-background">
      {/* 为 fixed 导航预留高度，避免轮播顶部被遮挡 */}
      <div className="w-full pt-[var(--site-nav-height,88px)]">
        {/* 移动端：图片按原始比例全宽展示，避免 object-contain 产生左右留白 */}
        <div className="relative w-full md:aspect-[16/9] md:overflow-hidden">
          {slides.map((item, index) => {
            const isActive = index === currentSlide;
            const picture = (
              <picture className="block w-full md:h-full">
                <source media="(max-width: 768px)" srcSet={item.imageH5} />
                <source media="(min-width: 769px)" srcSet={item.imagePc} />
                <img
                  src={item.imagePc}
                  alt={item.alt}
                  className="block w-full h-auto md:h-full md:object-cover"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  draggable={false}
                />
              </picture>
            );

            return (
              <div
                key={item.id}
                className={`w-full transition-opacity duration-700 md:absolute md:inset-0 ${
                  isActive
                    ? 'relative opacity-100 z-[1]'
                    : 'hidden md:block md:opacity-0 md:z-0 md:pointer-events-none'
                }`}
                aria-hidden={!isActive}
              >
                {item.jumpPath && isActive ? (
                  <button
                    type="button"
                    className="block w-full h-full cursor-pointer border-0 p-0 bg-transparent"
                    onClick={() => handleBannerClick(item.jumpPath)}
                    aria-label={item.alt}
                  >
                    {picture}
                  </button>
                ) : (
                  picture
                )}
              </div>
            );
          })}

          {slideCount > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'bg-white w-8 h-2'
                        : 'bg-white/50 hover:bg-white/70 w-2 h-2'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
