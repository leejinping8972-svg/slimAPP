'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import logoImg from '@/assets/gummies/LOGO.png';

interface NavigationProps {
  onShopNow: () => void;
}

export default function Navigation({ onShopNow }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Ingredients', href: '#ingredients' },
    { name: 'Flavors', href: '#flavors' },
    { name: 'How to Use', href: '#usage' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link
            href="/gummies_1"
            className="flex items-center transition-opacity duration-300 hover:opacity-80"
          >
            <Image src={logoImg} alt="Luckdate" className="h-7 sm:h-9 w-auto object-contain" width={100} height={36} />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-dark-charcoal hover:text-deep-rose transition-colors duration-300 font-body text-base font-medium"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <button
              onClick={onShopNow}
              className="bg-deep-rose text-white px-8 py-2.5 rounded-full font-body text-sm font-medium hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Shop Now
            </button>
          </div>

          <button
            className="md:hidden p-2 text-dark-charcoal"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-soft-lg transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="block w-full text-left text-dark-charcoal hover:text-deep-rose transition-colors duration-300 font-body text-base font-medium py-2"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => {
              onShopNow();
              setIsMobileMenuOpen(false);
            }}
            className="w-full bg-deep-rose text-white px-6 py-3 rounded-full font-body text-sm font-medium mt-4"
          >
            Shop Now
          </button>
        </div>
      </div>
    </nav>
  );
}
