'use client';

import Image from 'next/image';
import luckdateLogo from '@/assets/shilajit/luckdate-logo.png';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6 sm:py-10 pb-28 sm:pb-32">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center space-y-2.5 sm:space-y-4">
        <Image src={luckdateLogo} alt="Luckdate" className="h-5 sm:h-8 w-auto mx-auto brightness-200" width={120} height={32} />
        <p className="text-[9px] sm:text-sm text-foreground/50 font-body max-w-2xl mx-auto leading-relaxed">
          These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure or prevent any disease.
        </p>
        <p className="text-[9px] sm:text-sm text-foreground/50 font-body">© {new Date().getFullYear()} Luckdate. All rights reserved.</p>
      </div>
    </footer>
  );
}
