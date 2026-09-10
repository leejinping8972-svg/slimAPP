'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

interface CarouselProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  badge?: string;
}

interface SwiperProductCarouselProps {
  products: CarouselProduct[];
  title?: string;
  showAllProductsLink?: boolean;
  onProductClick?: (product: CarouselProduct) => void;
  onQuickAdd?: (e: React.MouseEvent, product: CarouselProduct) => void;
}

const GAP = {
  mobile: 16,
  tablet: 20,
  desktop: 24,
};

export const SwiperProductCarousel = ({
  products,
  title,
  showAllProductsLink = true,
  onProductClick,
  onQuickAdd,
}: SwiperProductCarouselProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { addToCart } = useCart();

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
    return 4;
  }, [isMobile, isTablet]);

  const calculateCardWidth = useCallback(() => {
    if (!viewportRef.current) return 0;

    const viewportWidth = viewportRef.current.offsetWidth;

    if (isMobile) {
      return viewportWidth * 0.82;
    }

    if (isTablet) {
      return (viewportWidth - GAP.tablet) / 2;
    }

    return (viewportWidth - GAP.desktop * 3) / 4;
  }, [isMobile, isTablet]);

  const getGap = useCallback(() => {
    if (isMobile) return GAP.mobile;
    if (isTablet) return GAP.tablet;
    return GAP.desktop;
  }, [isMobile, isTablet]);

  const getMaxIndex = useCallback(() => {
    return Math.max(0, products.length - getPerView());
  }, [products.length, getPerView]);

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

  const handleProductClick = (product: CarouselProduct) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: CarouselProduct) => {
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(e, product);
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
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

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'fill-[#D8CBB8] text-[#D8CBB8]'
            : 'text-[#6C6763]/20'
        }`}
      />
    ));
  };

  return (
    <div className="w-full">
      <div className="relative">
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
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 group relative bg-[#F7F5F1] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                  style={{
                    width: `${cardWidth}px`,
                  }}
                  onClick={() => handleProductClick(product)}
                >
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10 bg-[#D8CBB8] text-white text-xs font-medium px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}

                  <div className="relative w-full aspect-square overflow-hidden bg-[#F7F5F1] flex items-center justify-center p-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    <div className="absolute inset-0 z-10 bg-[#4E554B]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-[#4E554B]">
                        <Eye className="w-4 h-4" />
                        {t('products.quickView')}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-xs font-medium text-[#4E554B]">
                        {(product.rating || 5).toFixed(1)}
                      </span>
                    </div>

                    <h3 className="text-sm md:text-base font-semibold text-[#4E554B] mb-1 group-hover:text-[#D8CBB8] transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#6C6763]/70 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-base md:text-lg font-bold text-[#4E554B] font-['Montserrat']">
                        ${product.price}
                      </div>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="w-8 h-8 md:w-9 md:h-9 bg-[#4E554B] rounded-full flex items-center justify-center hover:bg-[#D8CBB8] transition-colors duration-300"
                      >
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
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
      </div>
    </div>
  );
};

export default SwiperProductCarousel;
