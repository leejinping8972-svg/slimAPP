'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import CartDrawer from '@/components/CartDrawer';
import SwiperProductCarousel from '@/components/SwiperProductCarousel';
gsap.registerPlugin(ScrollTrigger);

export interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  marketPrice: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  badge?: string;
  benefits: string[];
  ingredients: string[];
  dosage: string;
}

interface ProductsProps {
  products: Product[];
}

const Products = ({ products }: ProductsProps) => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  const isLoading = products.length === 0;
  const error: string | null = null;

  useEffect(() => {
    if (products.length > 0 && sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [products]);

  const handleProductClick = (product: { id: number; name: string }) => {
    router.push(`/product/${product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: { id: number; name: string; price: number; image: string }) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null });
    (window as any).dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: "USD",
        value: product.price,
        items: [{
          item_id: String(product.id),
          item_name: product.name,
          price: product.price,
          quantity: 1
        }]
      }
    });
  };

  return (
    <>
      <section
        id="products"
        ref={sectionRef}
        className="py-12 lg:py-16 bg-white overflow-hidden"
      >
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex flex-row justify-between mb-12">
            <div>
              {/* <span className="inline-block text-[#D8CBB8] text-sm font-medium uppercase tracking-wider mb-4">
                {t('products.badge')}
              </span> */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4E554B] font-['Montserrat']">
                {t('products.title')}
              </h2>
            </div>
            {/* <p className="text-[#6C6763]/70 max-w-md mt-4 lg:mt-0">
              {t('products.description')}
            </p> */}
            <p
              className="text-[#6C6763]/70 max-w-md flex items-center justify-center cursor-pointer hover:text-[#D8CBB8] transition-colors duration-300"
              onClick={() => router.push('/products')}
            >
              {t('products.allProducts')}
            </p>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#D8CBB8] animate-spin mb-4" />
              <p className="text-[#6C6763]/60 font-medium">{t('products.loading')}</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20 bg-[#F7F5F1] rounded-3xl border-2 border-dashed border-[#D8CBB8]/20">
              <AlertCircle className="w-10 h-10 text-[#D8CBB8] mb-4" />
              <p className="text-[#4E554B] font-medium mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[#D8CBB8] font-semibold hover:underline"
              >
                Try Refreshing
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <SwiperProductCarousel
              products={products}
              title={t('products.title')}
              showAllProductsLink={true}
              onProductClick={handleProductClick}
              onQuickAdd={handleQuickAdd}
            />
          )}
        </div>
      </section>

      <CartDrawer />
    </>
  );
};

export default Products;
