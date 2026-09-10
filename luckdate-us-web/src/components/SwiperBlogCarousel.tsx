'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { getReadTime } from '@/lib/utils';

interface BlogPost {
  id: number;
  title: string;
  coverImage: string;
  date?: string;
  excerpt?: string;
  content_char_length?: number;
}

interface SwiperBlogCarouselProps {
  posts: BlogPost[];
  title?: string;
  showViewAllLink?: boolean;
  onPostClick?: (post: BlogPost) => void;
}

export const SwiperBlogCarousel = ({
  posts,
  title,
  showViewAllLink = true,
  onPostClick,
}: SwiperBlogCarouselProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 640);
    setIsTablet(width >= 640 && width < 1024);
  }, []);

  const getPerView = useCallback(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  }, [isMobile, isTablet]);

  const calculateCardWidth = useCallback(() => {
    if (!viewportRef.current) return 0;

    const viewportWidth = viewportRef.current.offsetWidth;

    if (isMobile) {
      return viewportWidth * 0.82;
    }

    if (isTablet) {
      return (viewportWidth - 20) / 2;
    }

    return (viewportWidth - 24 * 2) / 3;
  }, [isMobile, isTablet]);

  const getGap = useCallback(() => {
    if (isMobile) return 16;
    if (isTablet) return 20;
    return 24;
  }, [isMobile, isTablet]);

  const getMaxIndex = useCallback(() => {
    return Math.max(0, posts.length - getPerView());
  }, [posts.length, getPerView]);

  const goTo = useCallback(
    (index: number) => {
      const maxIndex = getMaxIndex();
      const newIndex = Math.max(0, Math.min(index, maxIndex));
      setCurrentIndex(newIndex);
    },
    [getMaxIndex]
  );

  const handlePrev = () => {
    goTo(currentIndex - 1);
  };

  const handleNext = () => {
    goTo(currentIndex + 1);
  };

  const handleDotClick = (index: number) => {
    goTo(index);
  };

  const handlePostClick = (post: BlogPost) => {
    if (onPostClick) {
      onPostClick(post);
    } else {
      router.push(`/blog/${post.id}`);
    }
  };

  useEffect(() => {
    checkScreenSize();

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        checkScreenSize();
        setCardWidth(calculateCardWidth());
        setCurrentIndex((prev) => Math.min(prev, getMaxIndex()));
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [checkScreenSize, calculateCardWidth, getMaxIndex]);

  useEffect(() => {
    setCardWidth(calculateCardWidth());
  }, [calculateCardWidth]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, getMaxIndex()]);

  const offset = currentIndex * (cardWidth + getGap());
  const maxIndex = getMaxIndex();

  return (
    <div className="w-full">
      {title && (
        <div className="flex justify-between items-center mb-8 md:mb-12 px-4 sm:px-6 lg:px-12 xl:px-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4E554B] font-['Montserrat']">
            {title}
          </h2>
          {showViewAllLink && (
            <button
              onClick={() => router.push('/blog')}
              className="hidden md:flex items-center gap-2 text-sm text-[#6C6763]/70 hover:text-[#D8CBB8] transition-colors duration-300 font-medium border border-[#D8CBB8] text-[#D8CBB8] hover:bg-[#D8CBB8] hover:text-white rounded-full px-6 py-3"
            >
              {t('latestBlog.viewAll')}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="relative px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="relative">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 z-20
              w-10 h-10 md:w-12 md:h-12 rounded-full
              bg-white shadow-lg border border-[#e5e5e5]
              flex items-center justify-center
              transition-all duration-300
              ${currentIndex === 0
                ? 'opacity-35 cursor-not-allowed pointer-events-none'
                : 'hover:bg-[#D8CBB8] hover:text-white hover:border-[#D8CBB8]'
              }
            `}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div
            ref={viewportRef}
            className="overflow-hidden"
          >
            <div
              ref={trackRef}
              className="flex transition-transform duration-400 ease-out"
              style={{
                transform: `translateX(-${offset}px)`,
                gap: `${getGap()}px`,
              }}
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex-shrink-0 group cursor-pointer transition-all duration-500"
                  style={{
                    width: `${cardWidth}px`,
                  }}
                  onClick={() => handlePostClick(post)}
                >
                  <div className="relative overflow-hidden rounded-3xl mb-4 aspect-square flex items-center justify-center bg-[#F7F5F1]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {(post.date || post.excerpt) && (
                    <div className="flex items-center gap-4 text-sm text-[#6C6763]/60 mb-3">
                      {post.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                      )}
                      {/* {post.excerpt && post.content_char_length && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {getReadTime(post.content_char_length)}
                        </span>
                      )} */}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-[#4E554B] mb-2 group-hover:text-[#D8CBB8] transition-colors font-['Montserrat'] leading-tight line-clamp-3">
                    {post.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 z-20
              w-10 h-10 md:w-12 md:h-12 rounded-full
              bg-white shadow-lg border border-[#e5e5e5]
              flex items-center justify-center
              transition-all duration-300
              ${currentIndex >= maxIndex
                ? 'opacity-35 cursor-not-allowed pointer-events-none'
                : 'hover:bg-[#D8CBB8] hover:text-white hover:border-[#D8CBB8]'
              }
            `}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 mt-6 md:mt-8">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`
                transition-all duration-300 rounded-full border-none cursor-pointer
                ${index === currentIndex
                  ? 'bg-[#D8CBB8] w-7 h-2 md:w-8 md:h-2'
                  : 'bg-[#6C6763]/20 hover:bg-[#6C6763]/40 w-2 h-2'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {showViewAllLink && (
          <div className="mt-8 md:hidden text-center">
            <button
              onClick={() => router.push('/blog')}
              className="w-full flex items-center justify-center gap-2 text-sm text-[#D8CBB8] hover:text-[#C4B5A0] transition-colors duration-300 font-medium py-4 border border-[#D8CBB8] rounded-full"
            >
              {t('latestBlog.viewAll')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwiperBlogCarousel;
