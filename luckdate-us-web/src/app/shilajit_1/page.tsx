'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Gift, ChevronRight, Check } from 'lucide-react';
import { getUserOrders, type OrderItem, addOrderLanding } from '@/lib/api/order';
import { getGoodsListShilajit } from '@/lib/api/goods';
import type { GoodsItem } from '@/lib/api/types';
import { scrollToProduct } from '@/lib/shilajit-constants';
import {
  ORDER_AD_SOURCE,
  ORDER_CREATE_CHANNEL,
  resolveAdSourceByQuerySource,
} from '@/lib/order-tracking';
import { navigateToEmbeddedCheckout } from '@/lib/stripe/embeddedCheckoutNavigate';
import { FB_PIXEL_ID_SHILAJIT, fbqTrackSingle, getTikTokClickId, getFacebookClickId, getFacebookBrowserId, ttqTrack, ttqIdentify } from '@/lib/meta-pixel';
import { useAuth } from '@/context/AuthContext';
import productHero from '@/assets/shilajit/product-hero.jpg';
import product1Bottle from '@/assets/shilajit/product-1bottle.png';
import product3Bottles from '@/assets/shilajit/product-3bottles.png';
import product5Bottles from '@/assets/shilajit/product-5bottles.png';

import ShilajitNavbar from '@/components/shilajit/ShilajitNavbar';
import ProductHero from '@/components/shilajit/ProductHero';
import MarqueeBanner from '@/components/shilajit/MarqueeBanner';
import ScrollReveal from '@/components/shilajit/ScrollReveal';
import MaximumSizeSection from '@/components/shilajit/MaximumSizeSection';
import HowItWorksSection from '@/components/shilajit/HowItWorksSection';
import ComparisonSection from '@/components/shilajit/ComparisonSection';
import TransformationTimeline from '@/components/shilajit/TransformationTimeline';
import IngredientsSection from '@/components/shilajit/IngredientsSection';
import ReviewsSection from '@/components/shilajit/ReviewsSection';
import FAQSection from '@/components/shilajit/FAQSection';
import Footer from '@/components/shilajit/Footer';
import StickyBottomBar from '@/components/shilajit/StickyBottomBar';
import CertificatesSection from '@/components/shilajit/CertificatesSection';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import UnpaidOrderModal from '@/components/UnpaidOrderModal';

const SKU_LABELS = [
  { name: 'One Bottle', serving: '$1 per serving', badge: '' },
  { name: 'Buy 2 Get 1 Free', serving: '$0.67 per serving', badge: 'MOST POPULAR' },
  { name: 'Buy 3 Get 2 Free', serving: '$0.6 per serving', badge: 'BEST VALUE' },
];

export default function ShilajitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isFbPixel =
    resolveAdSourceByQuerySource(searchParams.get('source')) === ORDER_AD_SOURCE.fb;
  const [products, setProducts] = useState<GoodsItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity] = useState(1);

  // 未支付订单弹窗状态
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);

  useEffect(() => {
    getGoodsListShilajit()
      .then((res) => {
        const list = res.data?.list?.data ?? [];
        setProducts(list);
        setSelectedProductId((prev) => (prev === null && list.length > 0 ? list[1].id : prev));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (products.length === 0 || !selectedProductId) return;
    const item = products.find((p) => p.id === selectedProductId);
    if (!item) return;
    const value = item.sale_price / 100;
    
    // Facebook Pixel
    if (isFbPixel) {
      fbqTrackSingle(FB_PIXEL_ID_SHILAJIT, 'ViewContent', {
        content_ids: [String(item.id)],
        content_type: 'product',
        contents: [{ id: String(item.id), quantity: 1, item_price: value }],
        value,
        currency: 'USD',
      });
    }
    
    // TikTok Pixel
    const ttclid = getTikTokClickId();
    ttqTrack('ViewContent', {
      contents: [
        {
          content_id: String(item.id),
          content_type: 'product',
          content_name: item.name
        }
      ],
      value,
      currency: 'USD'
    }, ttclid);
  }, [products, selectedProductId, isFbPixel]);

  const skuImages = [product1Bottle.src, product5Bottles.src, product3Bottles.src];

  const skuOptions = useMemo(() => {
    return products.map((p, i) => {
      const label = SKU_LABELS[i] ?? { name: p.name, serving: '', badge: '' };
      const price = p.sale_price / 100;
      const original = p.line_price / 100;
      const savePercent = original > 0 ? Math.round(((original - price) / original) * 100) : 0;
      return {
        id: p.id,
        name: label.name,
        serving: label.serving,
        price,
        original,
        save: savePercent ? `${savePercent}%` : '',
        badge: label.badge,
        image: skuImages[i] ?? product1Bottle.src,
      };
    });
  }, [products]);

  // 获取当前选中的产品价格
  const currentProduct = products.find((p) => p.id === selectedProductId);
  const originalPrice = currentProduct ? currentProduct.sale_price / 100 : 0;

  // 处理购买
  const handleShopNow = useCallback(async () => {
    if (!selectedProductId) return;

    // 检查是否有未支付订单
    try {
      const orderRes = await getUserOrders({ page: 1, pageSize: 50 });
      if (orderRes.data?.status && orderRes.data?.list) {
        const pending = (orderRes.data.list.data || []).filter((o: OrderItem) => o.status === 0);
        if (pending.length > 0) {
          setShowUnpaidModal(true);
          return;
        }
      }
    } catch {
      // 检查失败，继续下单流程
    }

    await executeCheckout();
  }, [products, selectedProductId]);

  const executeCheckout = useCallback(async () => {
    if (!selectedProductId) return;
    try {
      const adSource = resolveAdSourceByQuerySource(searchParams.get('source'));
      const orderData: {
        goods: Array<{ id: number; quantity: number }>;
        source: string;
        create_channel: number;
        ad_source: number;
        ad_extra?: {
          ttclid?: string;
          fbc?: string;
          fbp?: string;
        };
      } = {
        goods: [{ id: parseInt(selectedProductId, 10), quantity: 1 }],
        source: 'shilajit_1',
        create_channel: ORDER_CREATE_CHANNEL.shilajit_1,
        ad_source: adSource,
      };
      
      // 根据ad_source决定传递哪个参数
      if (adSource === ORDER_AD_SOURCE.fb) {
        const fbc = getFacebookClickId();
        const fbp = getFacebookBrowserId();
        if (fbc || fbp) {
          orderData.ad_extra = {};
          if (fbc) {
            orderData.ad_extra.fbc = fbc;
          }
          if (fbp) {
            orderData.ad_extra.fbp = fbp;
          }
        }
      } else if (adSource === ORDER_AD_SOURCE.tk) {
        const ttclid = getTikTokClickId();
        if (ttclid) {
          orderData.ad_extra = {
            ttclid: ttclid
          };
        }
      }
      
      const res = await addOrderLanding(orderData);
      const result = res.data;
      const data = result?.data;

      if (!result?.status) {
        return;
      }

      const line = products.find((p) => p.id === selectedProductId);
      if (line) {
        const value = line.sale_price / 100;
        
        // Facebook Pixel
        if (isFbPixel) {
          fbqTrackSingle(FB_PIXEL_ID_SHILAJIT, 'InitiateCheckout', {
            content_ids: [String(line.id)],
            content_type: 'product',
            contents: [{ id: String(line.id), quantity: 1, item_price: value }],
            value,
            currency: 'USD',
            num_items: 1,
          });
        }
        
        // TikTok Pixel
        const ttclid = getTikTokClickId();
        ttqTrack('InitiateCheckout', {
          contents: [
            {
              content_id: String(line.id),
              content_type: 'product',
              content_name: line.name
            }
          ],
          value,
          currency: 'USD'
        }, ttclid);
      }

      const checkoutUrl = data?.url;
      const clientSecret = data?.client_secret;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
      if (clientSecret) {
        navigateToEmbeddedCheckout(router, clientSecret, 'shilajit_1');
      }
    } catch (error) {
    }
  }, [products, selectedProductId, searchParams, isFbPixel, router]);

  const handleScrollToTop = useCallback(() => {
    scrollToProduct();
  }, []);

  return (
    <>
      <h1 className="sr-only">10 in 1 Shilajit Gummies | LUCKDATE</h1>
      <div className="min-h-screen shilajit-theme bg-background text-foreground">
      <ShilajitNavbar onShopNow={handleShopNow} />
      <ProductHero
        skuOptions={skuOptions}
        selectedProductId={selectedProductId}
        onSelectProduct={setSelectedProductId}
        onShopNow={handleShopNow}
      />
      <MarqueeBanner />
      <ScrollReveal>
        <MaximumSizeSection onScrollToTop={handleScrollToTop} />
      </ScrollReveal>
      <ScrollReveal>
        <HowItWorksSection />
      </ScrollReveal>
      <ScrollReveal>
        <ComparisonSection />
      </ScrollReveal>
      <ScrollReveal>
        <TransformationTimeline />
      </ScrollReveal>
      <ScrollReveal>
        <IngredientsSection />
      </ScrollReveal>
      <ScrollReveal>
        <CertificatesSection />
      </ScrollReveal>
      <ScrollReveal>
        <ReviewsSection />
      </ScrollReveal>
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>
      <Footer />
      <StickyBottomBar
        skuOptions={skuOptions}
        selectedProductId={selectedProductId}
        onSelectProduct={setSelectedProductId}
        onShopNow={handleShopNow}
      />
      <UnpaidOrderFloat />
      <UnpaidOrderModal
        open={showUnpaidModal}
        onClose={() => setShowUnpaidModal(false)}
        onProceed={() => {
          setShowUnpaidModal(false);
          void executeCheckout();
        }}
        theme="dark"
      />
    </div>
    </>
  );
}
