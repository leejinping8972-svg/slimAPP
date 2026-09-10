'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingBuyButtonProps {
  onOpenProductModal: () => void;
}

export default function FloatingBuyButton({ onOpenProductModal }: FloatingBuyButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      id="floating-buy-btn"
      onClick={onOpenProductModal}
      className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 bg-deep-rose text-white px-6 py-3.5 lg:px-8 lg:py-4 rounded-full font-body font-medium shadow-soft-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex items-center gap-2 lg:gap-3 max-w-[calc(100vw-3rem)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
      <span className="text-sm lg:text-base whitespace-nowrap">Buy Now</span>
    </button>
  );
}
