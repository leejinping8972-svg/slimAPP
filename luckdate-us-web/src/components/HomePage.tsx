'use client';

import { useRef, useEffect, Suspense } from 'react';
// Suspense import added below
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/sections/Footer';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import CartDrawer from '@/components/CartDrawer';
import type { Product } from '@/sections/Products';
import type { ArticleDisplay } from '@/lib/api/mappers';
import type { FaqItem, BannerItem } from '@/lib/api/types';
import {
  HomeSiteHeader,
  HomeHero,
  FeaturedReviewsSection,
  AsSeenStrip,
  UgcReviewsSection,
  HomeOfferSection,
  SavingsCompareSection,
  BarrierSection,
  BarriersExplainerSection,
  ProcurementSection,
  DiscoverFavoritesSection,
  ClaimsStrip,
  InnovationSection,
} from '@/sections/home';

gsap.registerPlugin(ScrollTrigger);

export interface HomePageProps {
  initialProducts: Product[];
  initialArticles: ArticleDisplay[];
  initialFaqs: FaqItem[];
  initialBanners?: BannerItem[];
}

export function HomePage({ initialProducts }: HomePageProps) {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let refreshTimer: number | null = null;
    let settleRetryTimer1: number | null = null;
    let settleRetryTimer2: number | null = null;
    let lastRectHeight = 0;
    let stableCount = 0;

    const scrollToAnchor = (anchorId: string) => {
      if (!anchorId) return;
      const el = document.getElementById(anchorId);
      if (!el) return false;

      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const navEl = document.getElementById('site-navigation');
      const navHeightRaw = navEl ? navEl.getBoundingClientRect().height : 110;
      const navHeight = navHeightRaw > 0 ? navHeightRaw : 110;
      const visibleAreaTop = navHeight;
      const visibleAreaHeight = Math.max(0, window.innerHeight - navHeight);
      const desiredCenter = visibleAreaTop + visibleAreaHeight / 2;
      const diff = Math.abs(elementCenter - desiredCenter);

      const tolerancePx = 35;
      if (diff <= tolerancePx) {
        const heightDiff = Math.abs(rect.height - lastRectHeight);
        if (heightDiff <= 1) {
          stableCount += 1;
        } else {
          stableCount = 0;
        }
        lastRectHeight = rect.height;

        if (stableCount >= 4) {
          return true;
        }
      } else {
        stableCount = 0;
        lastRectHeight = rect.height;
      }

      window.scrollTo({
        top: window.scrollY + (elementCenter - desiredCenter),
        behavior: 'auto',
      });

      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
      return false;
    };

    const tryScrollByHash = () => {
      const hash = window.location.hash || '';
      let pendingAnchor = '';
      try {
        pendingAnchor = window.sessionStorage.getItem('home_anchor_target') || '';
      } catch {
        /* ignore */
      }

      const anchorId = pendingAnchor || (hash.startsWith('#') ? hash.slice(1) : '');
      if (!anchorId) return;

      if (pendingAnchor && hash !== `#${pendingAnchor}`) {
        window.history.replaceState(null, '', `/#${pendingAnchor}`);
      }

      lastRectHeight = 0;
      stableCount = 0;

      let attempts = 0;
      const startTs = Date.now();
      const tick = () => {
        attempts += 1;
        if (scrollToAnchor(anchorId)) {
          try {
            window.sessionStorage.removeItem('home_anchor_target');
          } catch {
            /* ignore */
          }
          return;
        }
        if (attempts >= 200 || Date.now() - startTs >= 5000) return;
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    };

    tryScrollByHash();
    settleRetryTimer1 = window.setTimeout(tryScrollByHash, 320);
    settleRetryTimer2 = window.setTimeout(tryScrollByHash, 760);
    window.addEventListener('hashchange', tryScrollByHash);

    return () => {
      window.removeEventListener('hashchange', tryScrollByHash);
      if (refreshTimer) window.clearTimeout(refreshTimer);
      if (settleRetryTimer1) window.clearTimeout(settleRetryTimer1);
      if (settleRetryTimer2) window.clearTimeout(settleRetryTimer2);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => ScrollTrigger.refresh(), mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={mainRef} className="min-h-screen bg-[#F7F5F1]">
        <HomeSiteHeader />
        <main>
          <HomeHero />
          <AsSeenStrip />
          <UgcReviewsSection />
          <HomeOfferSection products={initialProducts} />
          <SavingsCompareSection />
          <BarrierSection />
          <BarriersExplainerSection />
          <FeaturedReviewsSection />
          <DiscoverFavoritesSection />
          <ClaimsStrip />
          <InnovationSection />
          <ProcurementSection />
          <UnpaidOrderFloat />
        </main>
        <Footer />
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      </div>
    </>
  );
}
