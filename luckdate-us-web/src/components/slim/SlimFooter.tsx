'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { Sun } from 'lucide-react';
import logoImg from '@/assets/slim/logo.png';

export default function SlimFooter() {
  return (
    <footer className="bg-[#FCFBF7] py-10 border-t border-[#737A65]/10 relative overflow-hidden">
      <Sun className="hidden sm:block absolute right-6 bottom-6 w-24 h-24 text-[#C4B896]/30 pointer-events-none" strokeWidth={0.75} />

      <div className="max-w-[1120px] mx-auto px-5 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <Image
            src={logoImg}
            alt="luckdate"
            className="h-7 w-auto object-contain"
            width={120}
            height={28}
          />
          <div className="flex gap-3">
            {[
              { name: 'Instagram', href: 'https://instagram.com', icon: <Instagram className="w-4 h-4" /> },
              { name: 'Facebook', href: 'https://facebook.com', icon: <Facebook className="w-4 h-4" /> },
              { name: 'Email', href: 'mailto:support@luckdate.com', icon: <Mail className="w-4 h-4" /> },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={s.name}
                className="w-9 h-9 rounded-full border border-[#737A65]/20 flex items-center justify-center text-[#737A65] hover:bg-[#737A65] hover:text-white transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6C6763] pt-6 border-t border-[#737A65]/10">
          <p>© {new Date().getFullYear()} Luckdate. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-[#737A65]">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#737A65]">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-[#737A65]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
