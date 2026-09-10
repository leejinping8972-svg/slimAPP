'use client';

import { useState } from 'react';
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Instagram,
//   Facebook,
//   Twitter,
//   Youtube,
// } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Heart } from 'lucide-react';
import Image from 'next/image';
import logoImg from '@/assets/logo-white.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/#')) return;

    const hash = href.replace(/^\//, ''); // "/#faq" -> "#faq"

    if (pathname !== '/') {
      e.preventDefault();
      try {
        window.sessionStorage.setItem('home_anchor_target', hash.slice(1));
      } catch { }
      // 跨页面时使用浏览器原生跳转，避免 SPA 路由时机导致锚点不一致
      window.location.href = href;
      return;
    }

    e.preventDefault();

    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      // hash 相同不会触发 hashchange，手动分发用于再次定位
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  const footerLinks = {
    company: [
      { label: t('nav.about'), href: '/#about' },
      { label: t('footer.companyList.ourStory'), href: '/#about' },
      { label: t('nav.insight'), href: '/blog' },
    ],
    support: [
      { label: t('footer.supportList.contactUs'), href: '/contact' },
      { label: t('nav.faq'), href: '/#faq' },
      { label: t('footer.supportList.trackOrder'), href: '/track-order' },
    ],
    legal: [
      { label: t('footer.legalList.privacyPolicy'), href: '/privacy-policy' },
      { label: t('footer.legalList.termsOfService'), href: '/terms-of-service' },
      { label: t('footer.legalList.cookiePolicy'), href: '/cookie-policy' },
      { label: t('footer.legalList.disclaimer'), href: '/disclaimer' },
    ],
  };

  const socialLinks: { icon: LucideIcon; href: string; label: string }[] = [
    // { icon: Instagram, href: '#', label: 'Instagram' },
    // { icon: Facebook, href: '#', label: 'Facebook' },
    // { icon: Twitter, href: '#', label: 'Twitter' },
    // { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-[#4E554B] text-white">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-16 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Image
                src={logoImg}
                alt="luckdate"
                width={180}
                height={40}
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>

            <p className="text-white/60 mb-6 max-w-sm">
              {t('footer.desc')}
            </p>

            <div className="mb-8">
              <h4 className="font-semibold mb-4">{t('footer.newsletter.title')}</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full px-4"
                />
                <Button
                  type="submit"
                  className="bg-[#D8CBB8] hover:bg-[#C4B5A0] rounded-full px-4"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
              {subscribed && (
                <p className="text-green-400 text-sm mt-2">{t('footer.newsletter.thanks')}</p>
              )}
            </div>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D8CBB8] transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.sections.company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={
                      link.href.startsWith('/#')
                        ? (e) => handleHashLinkClick(e, link.href)
                        : undefined
                    }
                    className="text-white/60 hover:text-[#D8CBB8] transition-colors duration-300 text-sm relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#D8CBB8] transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.sections.support')}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={
                      link.href.startsWith('/#')
                        ? (e) => handleHashLinkClick(e, link.href)
                        : undefined
                    }
                    className="text-white/60 hover:text-[#D8CBB8] transition-colors duration-300 text-sm relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#D8CBB8] transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.sections.legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-[#D8CBB8] transition-colors duration-300 text-sm relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#D8CBB8] transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Mail className="w-4 h-4" />
            <span>support@luckdate.com</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Phone className="w-4 h-4" />
            <span>1-800-LUCKDATE</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Los Angeles, CA</span>
          </div>
        </div> */}
      </div>

      <div className="border-t border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-white/50 text-sm font-medium tracking-wide">
                {t('geoSeo.tagline')}
              </p>
              <p className="text-white/40 text-sm">
                © 2026 LUCKDATE. {t('footer.copyright')}
              </p>
            </div>
            <p className="text-white/40 text-sm flex items-center gap-1">
              {t('footer.madeWith').split('made with')[0]}
              {t('footer.madeWith').includes('Made with') ? 'Made with ' : ''}
              <Heart className="w-4 h-4 text-[#D8CBB8] fill-[#D8CBB8]" />
              {t('footer.madeWith').split('for your wellness')[1]}
              {t('footer.madeWith').includes('for your wellness') ? ' for your wellness' : ''}
              
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 py-4">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <p className="text-white/40 text-xs text-center">
            {t('footer.fda')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
