'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import logoImg from '@/assets/logo.png';
import { ShopMegaMenu, SHOP_NAV_PRODUCTS } from '@/sections/home/ShopMegaMenu';

interface NavigationProps {
  embedded?: boolean;
  overHero?: boolean;
}

type NavItem = {
  label: string;
  href: string;
  hasMega?: boolean;
};

const PRIMARY_LINKS: NavItem[] = [
  { label: 'Shop', href: '/products', hasMega: true },
  { label: 'Our Story', href: '/about' },
  { label: 'Science', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

const CLOSE_DELAY_MS = 280;

const Navigation = ({ embedded = false, overHero = false }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const megaForcesSolid = shopOpen;
  const immersive = overHero && !isScrolled && !isMobileMenuOpen && !megaForcesSolid;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openShop = useCallback(() => {
    clearCloseTimer();
    setShopOpen(true);
  }, []);

  const scheduleCloseShop = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setShopOpen(false), CLOSE_DELAY_MS);
  }, []);

  const closeShopNow = useCallback(() => {
    clearCloseTimer();
    setShopOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > window.innerHeight * 0.55);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Position mega panel just under the sticky/fixed header stack
  useEffect(() => {
    const updateTop = () => {
      const stack = document.getElementById('site-header-stack');
      const el = stack ?? navRef.current;
      if (!el) return;
      const bottom = el.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty('--nav-dropdown-top', `${Math.round(bottom)}px`);
    };
    updateTop();
    window.addEventListener('resize', updateTop);
    window.addEventListener('scroll', updateTop, { passive: true });
    return () => {
      window.removeEventListener('resize', updateTop);
      window.removeEventListener('scroll', updateTop);
    };
  }, [shopOpen, isScrolled, isMobileMenuOpen]);

  useEffect(() => {
    if (!shopOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeShopNow();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shopOpen, closeShopNow]);

  useEffect(() => {
    closeShopNow();
    setIsMobileMenuOpen(false);
  }, [pathname, closeShopNow]);

  useEffect(() => () => clearCloseTimer(), []);

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    closeShopNow();

    if (href.startsWith('/')) {
      const [path, hash] = href.split('#');
      if (hash && path === '/' && pathname === '/') {
        window.location.hash = hash;
        return;
      }
      if (hash && path === pathname) {
        window.location.hash = hash;
        return;
      }
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

  const linkColor = immersive
    ? 'text-[#3D4638]/85 hover:text-[#1E261C]'
    : 'text-[#6C6763] hover:text-[#1E261C]';
  const activeLinkColor = immersive ? 'text-[#1E261C]' : 'text-[#1E261C]';
  const iconColor = immersive ? 'text-[#1E261C]' : 'text-[#6C6763]';
  const mobileIconColor = immersive ? 'text-[#1E261C]' : 'text-[#4E554B]';

  const isActive = (href: string) => {
    const path = href.split('#')[0] || '/';
    return pathname === path || (path !== '/' && pathname.startsWith(path));
  };

  return (
    <>
      <nav
        ref={navRef}
        id="site-navigation"
        className={`${embedded ? '' : 'sticky top-0'} left-0 right-0 z-[100] py-3 transition-all duration-300 ${
          immersive
            ? 'bg-transparent border-b border-transparent'
            : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E8E8E8]/80'
        }`}
      >
        <span className="sr-only">luckdate</span>
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="group mr-2 shrink-0"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <Image
                src={logoImg}
                alt="luckdate"
                width={180}
                height={40}
                priority
                className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-8 lg:h-9"
              />
            </Link>

            {/* Desktop primary links */}
            <div className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
              {PRIMARY_LINKS.map((link) => {
                if (link.hasMega) {
                  return (
                    <div
                      key={link.label}
                      data-shop-trigger
                      className="relative -my-3 flex items-stretch"
                      onMouseEnter={openShop}
                      onMouseLeave={scheduleCloseShop}
                    >
                      <button
                        type="button"
                        aria-expanded={shopOpen}
                        aria-haspopup="true"
                        onClick={() => handleNavigation(link.href)}
                        className={`inline-flex min-h-[3.25rem] items-center gap-1.5 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors xl:px-5 xl:text-xs ${
                          shopOpen || isActive(link.href) ? activeLinkColor : linkColor
                        } ${shopOpen ? 'underline decoration-2 underline-offset-8' : ''}`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                            shopOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden
                        />
                      </button>
                    </div>
                  );
                }

                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleNavigation(link.href)}
                    onMouseEnter={closeShopNow}
                    className={`px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors xl:text-xs ${
                      isActive(link.href) ? activeLinkColor : linkColor
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop right: Login + Cart (ARMRA-style) */}
            <div className="hidden shrink-0 items-center gap-5 lg:flex xl:gap-6">
              <button
                type="button"
                onClick={() => router.push(user ? '/profile' : '/login')}
                onMouseEnter={closeShopNow}
                className={`text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors xl:text-xs ${linkColor}`}
              >
                {user ? 'Account' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                onMouseEnter={closeShopNow}
                className={`relative rounded-full p-2 transition-all ${iconColor} ${
                  immersive ? 'hover:bg-white/10' : 'hover:bg-[#D8CBB8]/15'
                }`}
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#6B7A62] text-xs font-medium text-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile */}
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 ${mobileIconColor}`}
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#4E554B] text-[10px] font-medium text-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                type="button"
                className={`p-2 ${mobileIconColor}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop only BELOW header — never cover Shop trigger (avoids hover flicker) */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[104] bg-black/25 transition-opacity duration-200 ${
          shopOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ top: 'var(--nav-dropdown-top, 0px)' }}
        aria-hidden
        onClick={closeShopNow}
      />

      <div className="hidden lg:block">
        <ShopMegaMenu
          open={shopOpen}
          onNavigate={handleNavigation}
          onMouseEnter={openShop}
          onMouseLeave={scheduleCloseShop}
        />
      </div>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-[110] bg-white transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-10 pt-20">
          <button
            type="button"
            className="absolute right-4 top-4 p-2 text-[#1E261C]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mx-auto flex w-full max-w-md flex-col gap-1">
            <button
              type="button"
              onClick={() => setMobileShopOpen((v) => !v)}
              className="flex w-full items-center justify-between border-b border-[#E8E8E8] py-4 text-left text-xl font-semibold text-[#1E261C]"
            >
              Shop
              <ChevronDown
                className={`h-5 w-5 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileShopOpen && (
              <div className="space-y-1 border-b border-[#E8E8E8] pb-4 pt-2">
                {SHOP_NAV_PRODUCTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigation(item.href)}
                    className="flex w-full items-center gap-3 px-1 py-2.5 text-left"
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden bg-[#F0EDE7]">
                      <Image src={item.thumb} alt="" fill className="object-contain p-1" sizes="44px" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-[#1E261C]">{item.title}</span>
                      <span className="block text-xs text-[#6C6763]">{item.tagline}</span>
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleNavigation('/products')}
                  className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6B7A62]"
                >
                  Shop All →
                </button>
              </div>
            )}

            {PRIMARY_LINKS.filter((l) => !l.hasMega).map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavigation(link.href)}
                className="border-b border-[#E8E8E8] py-4 text-left text-xl font-semibold text-[#1E261C]"
              >
                {link.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push(user ? '/profile' : '/login');
              }}
              className="mt-4 flex items-center gap-2 py-3 text-lg font-semibold text-[#1E261C]"
            >
              <User className="h-5 w-5" />
              {user ? 'Account' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
