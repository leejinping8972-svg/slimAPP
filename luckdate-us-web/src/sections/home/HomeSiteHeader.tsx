'use client';

import { useEffect, useState } from 'react';
import { PromoStrip } from '@/sections/home/PromoStrip';
import Navigation from '@/sections/Navigation';

/**
 * Homepage header overlays the hero (ARMRA-style).
 * Promo bar stays hidden on the first viewport, then slides in on scroll.
 */
export function HomeSiteHeader() {
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Reveal after leaving the top of the first screen
      setShowPromo(window.scrollY > window.innerHeight * 0.35);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] w-full">
      <div id="site-header-stack" className="pointer-events-auto">
        <PromoStrip visible={showPromo} />
        <Navigation embedded overHero />
      </div>
    </div>
  );
}
