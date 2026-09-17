'use client';

import { useLayoutEffect } from 'react';
import { PromoStrip } from '@/sections/home/PromoStrip';
import Navigation from '@/sections/Navigation';

/**
 * Homepage header — always visible, sits in document flow above the hero.
 * ResizeObserver keeps --site-header-height in sync when the viewport stretches.
 */
export function HomeSiteHeader() {
  useLayoutEffect(() => {
    const el = document.getElementById('site-header-stack');
    if (!el) return;

    const updateMetrics = () => {
      const rect = el.getBoundingClientRect();
      const height = Math.ceil(rect.height);
      document.documentElement.style.setProperty('--site-header-height', `${height}px`);
      document.documentElement.style.setProperty(
        '--nav-dropdown-top',
        `${Math.round(rect.bottom)}px`,
      );
    };

    updateMetrics();
    const ro = new ResizeObserver(updateMetrics);
    ro.observe(el);
    window.addEventListener('resize', updateMetrics);
    window.addEventListener('scroll', updateMetrics, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateMetrics);
      window.removeEventListener('scroll', updateMetrics);
    };
  }, []);

  return (
    <div
      id="site-header-stack"
      className="sticky top-0 z-[100] w-full shrink-0 bg-white shadow-sm"
    >
      <PromoStrip visible />
      <Navigation embedded />
    </div>
  );
}
