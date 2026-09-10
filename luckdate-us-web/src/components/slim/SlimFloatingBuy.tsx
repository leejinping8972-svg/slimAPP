'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface SlimFloatingBuyProps {
  onOpenProductModal: () => void;
}

export default function SlimFloatingBuy({ onOpenProductModal }: SlimFloatingBuyProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 480);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={onOpenProductModal}
      className={`fixed bottom-5 right-5 lg:bottom-8 lg:right-8 z-50 bg-[#737A65] text-white px-5 py-3.5 lg:px-7 lg:py-4 rounded-full font-medium shadow-soft-xl hover:bg-[#5F6558] hover:-translate-y-1 transition-all duration-500 flex items-center gap-2 max-w-[calc(100vw-2.5rem)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <ShoppingBag className="w-4 h-4 shrink-0" />
      <span className="text-sm whitespace-nowrap">Start Journey</span>
    </button>
  );
}
