'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import FAQ from '@/sections/FAQ';
import Footer from '@/sections/Footer';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import CartDrawer from '@/components/CartDrawer';
import { GlobalCoupon } from '@/components/GlobalCoupon';
import { getFaqList } from '@/lib/api';
import type { Product } from '@/sections/Products';
import type { ArticleDisplay } from '@/lib/api/mappers';
import type { FaqItem, BannerItem } from '@/lib/api/types';
import {
  HomeSiteHeader,
  HomeHero,
  DailyRitualSection,
  FeaturedReviewsSection,
  AsSeenStrip,
  UgcReviewsSection,
  HomeOfferSection,
  BarrierSection,
  DiscoverFavoritesSection,
  NewArrivalsCarousel,
  ClaimsStrip,
  InnovationSection,
  FinalHomeCTA,
} from '@/sections/home';

gsap.registerPlugin(ScrollTrigger);

export interface HomePageProps {
  initialProducts: Product[];
  initialArticles: ArticleDisplay[];
  initialFaqs: FaqItem[];
  initialBanners?: BannerItem[];
}

export function HomePage({ initialFaqs, initialProducts }: HomePageProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);

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
    const fallbackFaq = (): FaqItem[] => {
      const fallback = t('faq.items', { returnObjects: true }) as { question: string; answer: string }[];
      return Array.isArray(fallback)
        ? fallback.map((f, i) => ({ id: i, question: f.question, answer: f.answer }))
        : [];
    };
    const load = async () => {
      try {
        const faqRes = await getFaqList().catch(() => ({ data: { status: false, list: undefined } }));
        if (faqRes?.data?.status && faqRes.data?.list?.data) {
          setFaqs(faqRes.data.list.data);
        } else {
          setFaqs(fallbackFaq());
        }
      } catch {
        setFaqs(fallbackFaq());
      }
    };
    load();
  }, [t]);

  useEffect(() => {
    const ctx = gsap.context(() => ScrollTrigger.refresh(), mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <HomeSiteHeader />
      <div ref={mainRef} className="min-h-screen bg-[#F7F5F1]">
        <main>
          <HomeHero />
          <AsSeenStrip />
          <UgcReviewsSection />
          <HomeOfferSection products={initialProducts} />
          <BarrierSection />
          <DiscoverFavoritesSection />
          <NewArrivalsCarousel />
          <ClaimsStrip />
          <DailyRitualSection />
          <InnovationSection />
          <FeaturedReviewsSection />
          <FinalHomeCTA />
          <FAQ />
          <UnpaidOrderFloat />
        </main>
        <Footer />
        <Suspense fallback={null}>
          <CartDrawer />
          <GlobalCoupon />
        </Suspense>
      </div>
    </>
  );
}
