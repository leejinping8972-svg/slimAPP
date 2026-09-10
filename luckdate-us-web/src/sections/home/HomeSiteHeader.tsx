'use client';

import { PromoStrip } from '@/sections/home/PromoStrip';
import Navigation from '@/sections/Navigation';

/**
 * Homepage header overlays the hero (ARMRA-style).
 * Fixed so the first screen is full-bleed under a transparent nav.
 */
export function HomeSiteHeader() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] w-full">
      <div id="site-header-stack" className="pointer-events-auto">
        <PromoStrip />
        <Navigation embedded overHero />
      </div>
    </div>
  );
}
