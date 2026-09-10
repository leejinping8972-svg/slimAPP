'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Heart } from 'lucide-react';

const quickLinks = [
  { name: 'Shop', href: '/gummies_1' },
  { name: 'Ingredients', href: '/gummies_1#ingredients' },
  { name: 'About', href: '/products' },
  { name: 'Blog', href: '/blog' },
];

const supportLinks = [
  { name: 'FAQ', href: '/gummies_1#faq' },
  { name: 'Shipping', href: '/gummies_1#shipping' },
  { name: 'Returns', href: '/privacy-policy' },
  { name: 'Contact', href: 'mailto:support@luckdate.com' },
];

const socialLinks = [
  { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com' },
  {
    name: 'Pinterest',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
    href: 'https://pinterest.com',
  },
  { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, href: 'https://facebook.com' },
];

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-dark-charcoal text-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="lg:col-span-1">
            <Link
              href="/gummies_1"
              className="font-heading text-3xl font-semibold text-white hover:text-mint-green transition-colors duration-300 inline-block mb-4"
            >
              Bloom
            </Link>
            <p className="font-body text-sm text-gray-400 leading-relaxed mb-6">
              Natural wellness for the modern woman. Science-backed ingredients, delicious flavors, made
              with love.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-mint-green hover:text-dark-charcoal transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-gray-300 hover:text-mint-green transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-gray-300 hover:text-mint-green transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:support@luckdate.com"
                className="font-body text-sm text-gray-300 hover:text-mint-green transition-colors"
              >
                support@luckdate.com
              </a>
              <p className="font-body text-sm text-gray-400">Mon-Fri, 9am-6pm EST</p>
            </div>
          </div>
        </div>

        <div
          className={`pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <p className="font-body text-xs text-gray-400">
            © 2026 Bloom Wellness. All rights reserved.
          </p>
          <div className="flex items-center gap-1 font-body text-xs text-gray-400">
            Made with <Heart className="w-3 h-3 text-deep-rose fill-deep-rose" /> for women&apos;s wellness
          </div>
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="font-body text-xs text-gray-400 hover:text-mint-green transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="font-body text-xs text-gray-400 hover:text-mint-green transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
