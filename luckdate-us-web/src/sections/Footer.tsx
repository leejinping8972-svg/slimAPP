'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import logoWordmark from '@/assets/logo-footer-wordmark.png';

const SHOP_LINKS = [
  { label: '28-Day Nutrition Supplement', href: '/shop/nutrition-28-day' },
  { label: '7-Day Nutrition Supplement', href: '/shop/nutrition-7-day' },
  { label: 'Fruit & Vegetable Powder', href: '/shop/fruit-vegetable-powder' },
  { label: 'Gut Balance Probiotics', href: '/shop/gut-balance-probiotics' },
];

const LEARN_LINKS = [
  { label: 'Our Story', href: '/about' },
  { label: 'Science', href: '/science/formulation' },
  { label: 'Blog', href: '/blog' },
  { label: 'Vitality Check', href: '/shop/nutrition-28-day' },
];

const RESOURCE_LINKS = [
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'Order Inquiry', href: '/order-inquiry' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
];

/** ARMRA-style full footer — columns + newsletter + giant wordmark. */
const Footer = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    window.setTimeout(() => setSubscribed(false), 3000);
  };

  const handleHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/#')) return;

    const hash = href.replace(/^\//, '');

    if (pathname !== '/') {
      e.preventDefault();
      try {
        window.sessionStorage.setItem('home_anchor_target', hash.slice(1));
      } catch {
        /* ignore */
      }
      window.location.href = href;
      return;
    }

    e.preventDefault();
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  const renderLink = (link: { label: string; href: string }) => (
    <a
      href={link.href}
      onClick={
        link.href.startsWith('/#') ? (e) => handleHashLinkClick(e, link.href) : undefined
      }
      className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#1E261C] transition-opacity hover:opacity-55"
    >
      {link.label}
    </a>
  );

  return (
    <footer className="relative text-[#1E261C]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_18%,rgba(240,200,210,0.55)_0%,transparent_48%),radial-gradient(ellipse_at_88%_12%,rgba(190,220,235,0.5)_0%,transparent_44%),radial-gradient(ellipse_at_48%_85%,rgba(210,230,200,0.48)_0%,transparent_52%),radial-gradient(ellipse_at_72%_48%,rgba(235,220,160,0.38)_0%,transparent_46%),linear-gradient(180deg,#F7F5F1_0%,#F0EBE3_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-4 pt-16 sm:px-6 sm:pt-20 lg:px-12 lg:pt-24 xl:px-20">
        {/* 4 columns: Shop / Learn / Resources / Let's Connect */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12">
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-[#1E261C] sm:text-base">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-[#1E261C] sm:text-base">
              Learn
            </h3>
            <ul className="space-y-2.5">
              {LEARN_LINKS.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-[#1E261C] sm:text-base">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-[#1E261C] sm:text-base">
              Let&apos;s Connect
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <label className="block">
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#1E261C]/70">
                  Email*
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full border-0 border-b border-[#1E261C] bg-transparent py-2 text-sm text-[#1E261C] outline-none placeholder:text-[#1E261C]/35 focus:border-[#1E261C]"
                  placeholder=""
                  autoComplete="email"
                />
              </label>
              <button
                type="submit"
                className="bg-[#1E261C] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
              {subscribed && (
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6B7A62]">
                  Thanks for subscribing.
                </p>
              )}
            </form>

            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-[#1E261C] transition-opacity hover:opacity-55"
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright + FDA + legal */}
        <div className="mt-14 flex flex-col items-center text-center sm:mt-16">
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-[#1E261C]/75 sm:text-[11px]">
            © {new Date().getFullYear()} luckdate. All rights reserved.
          </p>

          <div className="mt-5 max-w-2xl border border-[#1E261C]/85 px-4 py-3 sm:px-5 sm:py-3.5">
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-[#1E261C]/80 sm:text-[11px]">
              *{t('footer.fda')}
            </p>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-7">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>{renderLink(link)}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Giant wordmark — transparent PNG, full width */}
      <div className="relative z-10 mt-10 w-full px-3 pb-6 sm:mt-12 sm:px-5 sm:pb-8 lg:mt-14 lg:px-8 lg:pb-10" aria-hidden>
        <Image
          src={logoWordmark}
          alt=""
          width={2044}
          height={424}
          className="mx-auto h-auto w-full max-w-[100%] select-none"
          sizes="100vw"
          quality={100}
          unoptimized
          priority={false}
        />
      </div>
    </footer>
  );
};

export default Footer;
