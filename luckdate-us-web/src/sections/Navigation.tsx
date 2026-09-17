'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, ShieldCheck, Clock, CheckCircle, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import logoImg from '@/assets/logo.png';

interface NavigationProps {
  /** Inside sticky header wrapper (homepage with promo strip) */
  embedded?: boolean;
}

const Navigation = ({ embedded = false }: NavigationProps) => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.products'), href: '/products' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.insight'), href: '/blog' },
    { label: t('nav.orderInquiry'), href: '/order-inquiry' },
  ];

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);

    if (href.startsWith('/')) {
      router.push(href);
      return;
    }

    if (href.startsWith('#')) {
      if (pathname !== '/') {
        try {
          window.sessionStorage.setItem('home_anchor_target', href.slice(1));
        } catch {
          /* ignore */
        }
        router.push(`/${href}`);
        return;
      }

      if (window.location.hash !== href) {
        window.location.hash = href;
      } else {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    }
  };

  return (
    <>
      <nav
        id="site-navigation"
        className={`${embedded ? "" : "sticky top-0"} left-0 right-0 z-[100] bg-white shadow-sm border-b border-[#E8E8E8]/80 py-3 transition-all duration-300`}
      >
        <span className="sr-only">LUCKDATE</span>
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="flex flex-row items-center gap-2 lg:gap-4 group mr-4 shrink-0"
              onClick={(e) => {
                e.preventDefault();
                if (pathname !== '/') {
                  router.push('/');
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <Image
                src={logoImg}
                alt="LuckDate"
                width={168}
                height={40}
                className="h-7 sm:h-8 lg:h-9 w-auto object-contain rounded-sm transition-transform duration-300 group-hover:scale-105"
              />

              <div className="hidden xl:flex items-center gap-3 lg:ml-4 lg:border-l lg:pl-4 border-gray-200 text-[11px] text-gray-500 font-medium">
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> FAST Shipping</span>
                <span className="flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> 30-Day Guarantee</span>
                <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Secure Checkout</span>
              </div>
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavigation(link.href)}
                    className={`text-sm font-medium transition-all duration-300 hover:text-[#9A9188] relative group ${
                      isActive ? 'text-[#4E554B]' : 'text-[#6C6763]'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#9A9188] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-6">
              {user ? (
                <button
                  onClick={() => router.push('/profile')}
                  className="relative p-2 rounded-full transition-all duration-300 hover:bg-[#D8CBB8]/10 text-[#6C6763]"
                  title="Personal Center"
                >
                  <User className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="text-sm font-medium text-[#6C6763] hover:text-[#9A9188] transition-colors"
                >
                  Login / Register
                </button>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 rounded-full transition-all duration-300 hover:bg-[#D8CBB8]/10 ${
                  isScrolled ? 'text-[#6C6763]' : 'text-[#6C6763]'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4E554B] text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-[#4E554B]">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4E554B] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                className="p-2 text-[#4E554B]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[110] bg-white transition-all duration-500 custom-expo lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <button
                key={link.label}
                onClick={() => handleNavigation(link.href)}
                className={`text-2xl font-semibold transition-colors duration-300 ${
                  isActive ? 'text-[#4E554B]' : 'text-[#4E554B] hover:text-[#9A9188]'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.label}
              </button>
            );
          })}
          {user ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push('/profile');
              }}
              className="text-2xl font-semibold text-[#4E554B] hover:text-[#9A9188] transition-colors duration-300"
            >
              Personal Center
            </button>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push('/login');
              }}
              className="text-2xl font-semibold text-[#4E554B] hover:text-[#9A9188] transition-colors duration-300"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
