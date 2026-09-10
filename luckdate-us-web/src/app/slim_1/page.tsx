'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { addOrderLanding } from '@/lib/api/order';
import { getGoodsListSlim } from '@/lib/api/goods';
import type { GoodsItem } from '@/lib/api/types';
import { ORDER_CREATE_CHANNEL, resolveAdSourceByQuerySource } from '@/lib/order-tracking';
import { navigateToEmbeddedCheckout } from '@/lib/stripe/embeddedCheckoutNavigate';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';

import SlimPromoBar from '@/components/slim/SlimPromoBar';
import SlimNav from '@/components/slim/SlimNav';
import SlimHero from '@/components/slim/SlimHero';
import SlimPhilosophy from '@/components/slim/SlimPhilosophy';
import SlimProductFeature from '@/components/slim/SlimProductFeature';
import SlimHowItWorks from '@/components/slim/SlimHowItWorks';
import SlimScienceAdvisor from '@/components/slim/SlimScienceAdvisor';
import SlimVitalityGallery from '@/components/slim/SlimVitalityGallery';
import SlimAppSection from '@/components/slim/SlimAppSection';
import SlimShopRituals from '@/components/slim/SlimShopRituals';
import SlimFinalCTA from '@/components/slim/SlimFinalCTA';
import SlimFooter from '@/components/slim/SlimFooter';
import SlimFloatingBuy from '@/components/slim/SlimFloatingBuy';
import SlimProductModal from '@/components/slim/SlimProductModal';

export default function SlimPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFBF7]" />}>
      <SlimPageInner />
    </Suspense>
  );
}

function SlimPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<GoodsItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  useEffect(() => {
    getGoodsListSlim()
      .then((res) => {
        const list = res.data?.list?.data ?? [];
        setProducts(list);
        setSelectedProductId((prev) => {
          if (prev !== null) return prev;
          if (list.length >= 2) return list[1].id;
          return list[0]?.id ?? null;
        });
      })
      .catch(() => {});
  }, []);

  const openProductModal = useCallback(() => {
    setProductModalOpen(true);
  }, []);

  const handleSubmitOrder = useCallback(async () => {
    if (!selectedProductId) return false;
    try {
      const res = await addOrderLanding({
        goods: [{ id: parseInt(selectedProductId, 10), quantity: 1 }],
        source: 'slim_1',
        create_channel: ORDER_CREATE_CHANNEL.slim_1,
        ad_source: resolveAdSourceByQuerySource(searchParams.get('source')),
      });
      const result = res.data;
      const data = result?.data;

      if (!result?.status) return false;

      const checkoutUrl = data?.url;
      const clientSecret = data?.client_secret;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return true;
      }
      if (clientSecret) {
        setProductModalOpen(false);
        navigateToEmbeddedCheckout(router, clientSecret);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [selectedProductId, searchParams, router]);

  return (
    <>
      <h1 className="sr-only">Luckdate — Slim Vitality + Sunny AI + Daily Rituals</h1>
      <div className="min-h-screen overflow-x-hidden w-full relative slim-theme">
        <div className="fixed top-0 left-0 right-0 z-50">
          <SlimPromoBar />
          <SlimNav onShopNow={openProductModal} />
        </div>

        <main className="pt-[104px] bg-[#FCFBF7]">
          <SlimHero onShopNow={openProductModal} />
          <SlimPhilosophy />
          <SlimProductFeature onShopNow={openProductModal} />
          <SlimHowItWorks />
          <SlimScienceAdvisor />
          <SlimVitalityGallery />
          <SlimAppSection />
          <SlimShopRituals
            products={products}
            selectedProductId={selectedProductId}
            onSelectProduct={setSelectedProductId}
            onShopNow={openProductModal}
          />
          <SlimFinalCTA onShopNow={openProductModal} />
        </main>

        <SlimFooter />
        <UnpaidOrderFloat />
        <SlimFloatingBuy onOpenProductModal={openProductModal} />

        <SlimProductModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
          onSubmitOrder={handleSubmitOrder}
        />
      </div>
    </>
  );
}
