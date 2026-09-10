'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { addOrderLanding } from '@/lib/api/order';
import { getGoodsListGummies } from '@/lib/api/goods';
import type { GoodsItem } from '@/lib/api/types';

import Navigation from '@/components/gummies/Navigation';
import CountdownBanner from '@/components/gummies/CountdownBanner';
import Hero from '@/components/gummies/Hero';
import PainPoints from '@/components/gummies/PainPoints';
import Testimonials from '@/components/gummies/Testimonials';
import Ingredients from '@/components/gummies/Ingredients';
import Flavors from '@/components/gummies/Flavors';
import Usage from '@/components/gummies/Usage';
import Shipping from '@/components/gummies/Shipping';
import SocialJoin from '@/components/gummies/SocialJoin';
import Newsletter from '@/components/gummies/Newsletter';
import FAQ from '@/components/gummies/FAQ';
import Footer from '@/components/gummies/Footer';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import FloatingBuyButton from '@/components/gummies/FloatingBuyButton';
import ProductSelectModal from '@/components/gummies/ProductSelectModal';
import { ORDER_CREATE_CHANNEL, resolveAdSourceByQuerySource } from '@/lib/order-tracking';
import { navigateToEmbeddedCheckout } from '@/lib/stripe/embeddedCheckoutNavigate';

export default function GummiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<GoodsItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);

  useEffect(() => {
    getGoodsListGummies()
      .then((res) => {
        const list = res.data?.list?.data ?? [];
        setProducts(list);
        setSelectedProductId((prev) => (prev === null && list.length > 0 ? list[0].id : prev));
      })
      .catch(() => {});
  }, []);

  const openProductSelectModal = useCallback(() => {
    setProductSelectModalOpen(true);
  }, []);

  const handleSubmitOrder = useCallback(async () => {
    if (!selectedProductId) return false;
    try {
      const res = await addOrderLanding({
        goods: [{ id: parseInt(selectedProductId, 10), quantity: 1 }],
        source: 'gummies_1',
        create_channel: ORDER_CREATE_CHANNEL.gummies_1,
        ad_source: resolveAdSourceByQuerySource(searchParams.get('source')),
      });
      const result = res.data;
      const data = result?.data;

      if (!result?.status) {
        return false;
      }

      const checkoutUrl = data?.url;
      const clientSecret = data?.client_secret;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return true;
      }
      if (clientSecret) {
        setProductSelectModalOpen(false);
        navigateToEmbeddedCheckout(router, clientSecret);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [selectedProductId, searchParams, router]);

  const handleProductSelectModalClose = useCallback(() => {
    setProductSelectModalOpen(false);
  }, []);

  return (
    <>
      <h1 className="sr-only">Aura Probiotic Gummies | LUCKDATE</h1>
      <div className="min-h-screen bg-white overflow-x-hidden w-full relative gummies-theme">
      <Navigation onShopNow={openProductSelectModal} />
      <CountdownBanner onShopNow={openProductSelectModal} />
      <main className="pt-[72px]">
        <Hero
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
          onOpenProductModal={openProductSelectModal}
        />
        <PainPoints />
        <Testimonials />
        <Ingredients onShopNow={openProductSelectModal} />
        <Flavors onShopNow={openProductSelectModal} />
        <Usage />
        <Shipping />
        <SocialJoin />
        <Newsletter />
        <FAQ />
      </main>
      <UnpaidOrderFloat />
      <Footer />
      <FloatingBuyButton onOpenProductModal={openProductSelectModal} />

      <ProductSelectModal
        isOpen={productSelectModalOpen}
        onClose={handleProductSelectModalClose}
        products={products}
        selectedProductId={selectedProductId}
        onSelectProduct={setSelectedProductId}
        onSubmitOrder={handleSubmitOrder}
      />

    </div>
    </>
  );
}
