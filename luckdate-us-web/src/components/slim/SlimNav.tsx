'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import logoImg from '@/assets/slim/logo.png';

interface SlimNavProps {
  onShopNow: () => void;
}

const navLinks = [
  { name: 'Shop', href: '#shop' },
  { name: 'Our Story', href: '#philosophy' },
  { name: 'Science', href: '#science' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'App', href: '#app' },
  { name: 'Blog', href: '/blog' },
];

export default function SlimNav({ onShopNow }: SlimNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const go = (href: string) => {
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`relative transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#FCFBF7]/95 backdrop-blur-md border-[#737A65]/10 shadow-soft'
          : 'bg-[#FCFBF7] border-transparent'
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[64px] lg:h-[72px]">
          <button
            className="lg:hidden p-2 text-[#3D4038]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden lg:flex items-center gap-6 flex-1">
            {navLinks.slice(0, 3).map((link) => (
              <button
                key={link.name}
                onClick={() => go(link.href)}
                className="text-[13px] font-medium text-[#3D4038]/75 hover:text-[#737A65] transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          <Link href="/slim_1" className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Image
              src={logoImg}
              alt="luckdate"
              className="h-7 sm:h-8 w-auto object-contain"
              width={120}
              height={32}
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center justify-end gap-6 flex-1">
            {navLinks.slice(3).map((link) => (
              <button
                key={link.name}
                onClick={() => go(link.href)}
                className="text-[13px] font-medium text-[#3D4038]/75 hover:text-[#737A65] transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="flex items-center gap-3 ml-2 text-[#3D4038]/70">
              <Search className="w-4 h-4" />
              <User className="w-4 h-4" />
              <button onClick={onShopNow} aria-label="Shop" className="hover:text-[#737A65]">
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={onShopNow}
            className="lg:hidden p-2 text-[#3D4038]"
            aria-label="Shop"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-[#FCFBF7] border-t border-[#737A65]/10 transition-all duration-300 z-40 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div className="px-5 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => go(link.href)}
              className="block w-full text-left text-[#3D4038] font-medium py-3 border-b border-[#737A65]/10"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => {
              onShopNow();
              setIsMobileMenuOpen(false);
            }}
            className="w-full mt-4 bg-[#737A65] text-white px-6 py-3.5 rounded-full text-sm font-medium"
          >
            Start Your 28-Day Journey
          </button>
        </div>
      </div>
    </nav>
  );
}
