'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import { Gift, ChevronRight, Ticket, ChevronDown } from 'lucide-react';
import CountdownBar from "@/components/body_purification/CountdownBar";
import Marquee from "@/components/body_purification/Marquee";
import Navbar from "@/components/body_purification/Navbar";
import ProductHero from "@/components/body_purification/ProductHero";
// import GutBanner from "@/components/body_purification/GutBanner";
import GutHealthBanner from "@/components/body_purification/GutHealthBanner";
import WhySection from "@/components/body_purification/WhySection";
import IngredientsSection from "@/components/body_purification/IngredientsSection";
import TimelineSection from "@/components/body_purification/TimelineSection";
import NumbersSection from "@/components/body_purification/NumbersSection";
import DontWaitSection from "@/components/body_purification/DontWaitSection";
import ReviewsSection from "@/components/body_purification/ReviewsSection";
import FAQSection from "@/components/body_purification/FAQSection";
import Footer from "@/components/body_purification/Footer";
import StickyCart from "@/components/body_purification/StickyCart";
import Reveal from "@/components/body_purification/Reveal";
import CertificatesSection from "@/components/body_purification/CertificatesSection";
import BodyPurificationCouponPopup from '@/components/BodyPurificationCouponPopup';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import UnpaidOrderModal from '@/components/UnpaidOrderModal';
import JsonLd from "@/components/JsonLd";
import { BASE_URL, WEBSITE_ID, ORGANIZATION_ID, buildPublisherSchema, SHIPPING_DETAILS, MERCHANT_RETURN_POLICY } from "@/lib/seo/home-schemas";
import { getUserOrders, type OrderItem, addOrderLanding } from '@/lib/api/order';
import { getGoodsListBodyPurification } from '@/lib/api/goods';
import { getCouponClaimStatus } from '@/lib/api/coupon';
import type { GoodsItem } from '@/lib/api/types';
import type { UserCoupon } from '@/lib/coupons/types';
import type { CartItem } from '@/context/CartContext';
import {
  ORDER_AD_SOURCE,
  ORDER_CREATE_CHANNEL,
  resolveAdSourceByQuerySource,
} from '@/lib/order-tracking';
import { navigateToEmbeddedCheckout } from '@/lib/stripe/embeddedCheckoutNavigate';
import { FB_PIXEL_ID_BODY_PURIFICATION, fbqTrackSingle, getTikTokClickId, getFacebookClickId, getFacebookBrowserId, ttqTrack } from '@/lib/meta-pixel';
import { useAuth } from '@/context/AuthContext';
import { useCoupon } from '@/context/CouponContext';
import { evaluateCouponForCart, pickBestCouponId, previewDiscountForLine } from '@/lib/coupons/engine';
import { useTranslation } from 'react-i18next';
import sku1Image from '@/assets/body_purification/sku-1-bottle.jpg';
import sku3Image from '@/assets/body_purification/sku-3-bottles.jpg';
import sku5Image from '@/assets/body_purification/sku-5-bottles.jpg';

const skuImages = [sku1Image.src, sku3Image.src, sku5Image.src];

const SKU_LABELS = [
  { name: 'One Bottle', serving: '$15.90/bottle', badge: '' },
  { name: 'Buy 2 Get 1 Free', serving: '$13.30/bottle', badge: 'Most Popular' },
  { name: 'Buy 3 Get 2 Free', serving: '$11.98/bottle', badge: 'Best Value' },
];

function StickyCouponPicker({
    variant,
    lineItems,
    availableWallet,
    pdpCouponId,
    setPdpCouponId,
    onSelect,
}: {
    variant: 'mobile' | 'desktop';
    lineItems: CartItem[];
    availableWallet: UserCoupon[];
    pdpCouponId: string | null;
    setPdpCouponId: (id: string | null) => void;
    onSelect?: () => void;
}) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const detailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    if (availableWallet.length === 0) return null;

    const couponReason = (c: UserCoupon) => {
        const ev = evaluateCouponForCart(c, lineItems);
        if (ev.ok) return '';
        switch (ev.reason) {
            case 'expired':
                return t('coupon.reason.expired', { defaultValue: 'Expired' });
            case 'not_yet_valid':
                return t('coupon.reason.notYetValid', { defaultValue: 'Not yet valid' });
            case 'min_spend':
                return t('coupon.reason.minSpend', { min: ev.minSpend?.toFixed?.(2) ?? String(c.minSpend), defaultValue: `Min spend $${c.minSpend}` });
            case 'product_scope':
                return t('coupon.reason.productScope', { defaultValue: 'Not applicable to this product' });
            case 'used':
                return t('coupon.reason.used', { defaultValue: 'Already used' });
            case 'invalid':
                return t('coupon.reason.invalid', { defaultValue: 'Invalid' });
            default:
                return '';
        }
    };

    const selected = availableWallet.find((c) => c.id === pdpCouponId);
    const selEv = selected ? evaluateCouponForCart(selected, lineItems) : null;
    const selSave =
        selected && selEv?.ok
            ? previewDiscountForLine(lineItems[0]!.id, lineItems[0]!.price, lineItems[0]!.quantity, selected)
            : 0;

    const summaryText =
        selected && selEv?.ok
            ? `${selected.title} · -$${selSave.toFixed(2)}`
            : t('cart.couponTitle', { defaultValue: 'Select Coupon' });

    const summaryBase =
        variant === 'mobile'
            ? 'text-xs font-semibold px-3 py-2.5 rounded-xl bg-[#F7F5F1] text-[#4E554B] border border-[#4E554B]/6'
            : 'text-sm font-semibold px-4 py-2.5 rounded-xl bg-[#F7F5F1] text-[#4E554B] border border-[#4E554B]/6 min-w-[200px]';

    const handleSelect = (c: UserCoupon, ok: boolean) => {
        if (ok) {
            setPdpCouponId(c.id);
            setIsOpen(false);
            onSelect?.();
        }
    };

    return (
        <div ref={detailsRef} className="relative z-[45] w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`${summaryBase} flex w-full cursor-pointer items-center justify-between gap-2`}
            >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                    <Ticket className="h-4 w-4 shrink-0 text-[#D8CBB8]" />
                    <span className="truncate">{summaryText}</span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-[#333]/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div
                    className={`absolute bottom-full left-0 right-0 mb-2 max-h-[min(40vh,220px)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-2 shadow-lg ${
                        variant === 'desktop' ? 'min-w-[280px]' : ''
                    }`}
                >
                    <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                        {t('cart.couponBestHint', { defaultValue: 'Best coupon' })}
                    </p>
                    <div className="space-y-1">
                        {availableWallet.map((c) => {
                            const ev = evaluateCouponForCart(c, lineItems);
                            const ok = ev.ok;
                            const reason = couponReason(c);
                            const save = ok ? previewDiscountForLine(lineItems[0]!.id, lineItems[0]!.price, lineItems[0]!.quantity, c) : 0;
                            return (
                                <label
                                    key={c.id}
                                    className={`flex cursor-pointer items-start gap-2 rounded-lg p-2 transition-colors ${
                                        ok ? 'hover:bg-[#D8CBB8]/8' : 'cursor-not-allowed opacity-55'
                                    } ${pdpCouponId === c.id && ok ? 'bg-[#D8CBB8]/12' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`pdp-coupon-${variant}`}
                                        className="mt-1 accent-[#D8CBB8]"
                                        checked={pdpCouponId === c.id}
                                        disabled={!ok}
                                        onChange={() => handleSelect(c, ok)}
                                    />
                                    <span className="min-w-0 flex-1 text-left">
                                        <span className="block text-xs font-bold text-[#4E554B]">{c.title}</span>
                                        <span className="font-mono text-[10px] text-gray-500">{c.code}</span>
                                        {ok && save > 0 && (
                                            <span className="mt-0.5 block text-[11px] font-semibold text-[#D8CBB8]">-${save.toFixed(2)}</span>
                                        )}
                                        {!ok && reason && <span className="mt-0.5 block text-[10px] text-red-600/90">{reason}</span>}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

const bodyPurificationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      '@id': `${BASE_URL}/body_purification/#product`,
      name: 'LuckDate Body Purification Chlorophyll Capsules',
      description: 'Neutralize body & breath odor naturally with LuckDate chlorophyll capsules. 100% natural, vegan, and FDA cleared supplement for internal deodorant support.',
      image: [
        `${BASE_URL}/assets/body_purification/gallery-1.png`,
        `${BASE_URL}/assets/body_purification/gallery-2.png`,
        `${BASE_URL}/assets/body_purification/gallery-3.png`,
      ],
      url: `${BASE_URL}/body_purification/`,
      brand: { '@type': 'Brand', name: 'LuckDate' },
      sku: 'LUCKDATE-BODY-PURIFICATION',
      category: 'Health & Wellness > Supplements > Internal Deodorant',
      material: 'Vegan, Plant-based',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: 15.90,
        highPrice: 59.90,
        offerCount: 3,
        url: `${BASE_URL}/body_purification/`,
        seller: { '@id': ORGANIZATION_ID },
        availability: 'https://schema.org/LimitedAvailability',
        eligibleRegion: {
          '@type': 'GeoCircle',
          geoMidpoint: { '@type': 'GeoCoordinates', latitude: 37.0902, longitude: -95.7129 },
          geoRadius: '10000000',
        },
        shippingDetails: SHIPPING_DETAILS,
        hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 4.9,
        reviewCount: 14837,
        bestRating: 5,
        worstRating: 1,
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Key Ingredient', value: 'Sodium Copper Chlorophyllin' },
        { '@type': 'PropertyValue', name: 'Form', value: 'Capsules' },
        { '@type': 'PropertyValue', name: 'Supply Duration', value: '30-150 days' },
        { '@type': 'PropertyValue', name: 'Guarantee', value: '30-day money-back guarantee' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does LuckDate work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "LuckDate works from the inside out. Our blend of chlorophyll, parsley leaf, and peppermint neutralizes odor-causing compounds in your gut before they spread to your breath, sweat, and skin — so odor is eliminated at the source rather than simply masked.",
          },
        },
        {
          '@type': 'Question',
          name: 'Will it work for my specific type of body odor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. Because LuckDate addresses the root cause inside your body, it works for all odor types — including underarms, feet, breath, and intimate areas.",
          },
        },
        {
          '@type': 'Question',
          name: 'How quickly will I see results?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Most users notice fresher breath and reduced body odor within a few days to a week of daily use. Full benefits typically deepen over two to four weeks of consistent use.",
          },
        },
        {
          '@type': 'Question',
          name: 'How do I take LuckDate, and when is the best time?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Take 1–2 capsules once a day with water. Many customers prefer taking it in the evening as part of their nightly routine for optimal morning freshness.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is it safe to take daily, and are there any side effects?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. LuckDate is made with 100% natural, vegan-friendly ingredients and is free from parabens, aluminum, and harsh chemicals. Some people may experience mild digestive adjustments when first starting — if you have a sensitive stomach, take it with food.",
          },
        },
        {
          '@type': 'Question',
          name: 'What is your return policy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "We offer a 30-day money-back guarantee. If you're not satisfied with your results, contact us for a full refund — no questions asked.",
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Body Purification', item: `${BASE_URL}/body_purification/` },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/body_purification/#webpage`,
      url: `${BASE_URL}/body_purification/`,
      name: 'LuckDate Body Purification – Natural Internal Deodorant Supplement',
      description: 'Eliminate bad breath and body odor naturally with LuckDate chlorophyll capsules. Clinically proven formula with 30-day money-back guarantee.',
      datePublished: '2026-01-01',
      dateModified: '2026-04-21',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': `${BASE_URL}/body_purification/#product` },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${BASE_URL}/assets/body_purification/product-main.png` },
      publisher: buildPublisherSchema(),
    },
    {
      '@type': 'ItemList',
      name: 'Customer Reviews',
      itemListElement: Array.from({ length: 10 }, (_, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Review',
          author: { '@type': 'Person', name: `Verified Customer ${i + 1}` },
          reviewBody: 'LuckDate has transformed my confidence. Fresh breath and no more body odor concerns!',
          reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5, worstRating: 1 },
          datePublished: '2026-04-21',
        },
      })),
    },
  ],
};

export type SkuOption = {
  id: string;
  label: string;
  subtitle: string;
  price: string;
  perUnit: string;
  originalPrice: string;
  badge: string | null;
  image: string;
};

export default function BodyPurificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isFbPixel =
    resolveAdSourceByQuerySource(searchParams.get('source')) === ORDER_AD_SOURCE.fb;
  const [products, setProducts] = useState<GoodsItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity] = useState(1);

  // 全局优惠券状态（所有商品共享）
  const [isCouponClaimed, setIsCouponClaimed] = useState(false);

  // PDP 优惠券选择器状态
  const [pdpCouponId, setPdpCouponId] = useState<string | null>(null);

  // 未支付订单弹窗状态
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);

  // 统一的手动选择标记（子组件 mobile/desktop 共享，避免双实例覆盖问题）
  const isManualSelectionRef = useRef(false);
  const lastQuantityRef = useRef(quantity);

  // 从全局 CouponContext 获取优惠券列表（带缓存）
  const { availableCoupons, isLoading: couponsLoading, refreshCoupons } = useCoupon();

  // 进入页面时强制刷新优惠券（落地页：保证数据新鲜，已使用的券立即消失）
  useEffect(() => {
      if (user) {
          refreshCoupons();
      }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // 从支付页返回时也强制刷新（覆盖 router.back / bfcache / 外部支付返回）
  const refreshClaimStatus = useCallback(async () => {
      if (!user) { setShowCouponClaimEntry(false); return; }
      try {
          const res = await getCouponClaimStatus();
          if (res.data?.status && res.data?.data) {
              setShowCouponClaimEntry(!res.data.data.claimed);
          }
      } catch { setShowCouponClaimEntry(false); }
  }, [user]);

  useEffect(() => {
      if (!user) return;
      let refreshTimer: ReturnType<typeof setTimeout>;
      const forceRefresh = () => {
          clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => { refreshCoupons(); refreshClaimStatus(); }, 300);
      };
      document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') forceRefresh();
      });
      window.addEventListener('pageshow', (e) => {
          if (e.persisted) forceRefresh();
      });
      window.addEventListener('focus', forceRefresh);
      return () => {
          clearTimeout(refreshTimer);
          document.removeEventListener('visibilitychange', forceRefresh);
          window.removeEventListener('pageshow', forceRefresh);
          window.removeEventListener('focus', forceRefresh);
      };
  }, [user, refreshCoupons, refreshClaimStatus]);

  // 是否显示"领取优惠券"入口（已登录用户关闭弹窗后或未领券时）
  const [showCouponClaimEntry, setShowCouponClaimEntry] = useState(false);
  // 获取产品数据
  useEffect(() => {
    getGoodsListBodyPurification()
      .then((res) => {
        const list = res.data?.list?.data ?? [];
        setProducts(list);
        setSelectedProductId((prev) => (prev === null && list.length > 0 ? String(list[1]?.id ?? list[0].id) : prev));
      })
      .catch(() => {});
  }, []);

  // ViewContent 事件追踪
  useEffect(() => {
    if (products.length === 0 || !selectedProductId) return;
    const item = products.find((p) => String(p.id) === selectedProductId);
    if (!item) return;
    const value = item.sale_price / 100;

    if (isFbPixel) {
      fbqTrackSingle(FB_PIXEL_ID_BODY_PURIFICATION, 'ViewContent', {
        content_ids: [String(item.id)],
        content_type: 'product',
        contents: [{ id: String(item.id), quantity: 1, item_price: value }],
        value,
        currency: 'USD',
      });
    }

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

  // 构建 SKU 选项
  const skuOptions: SkuOption[] = products.map((p, i) => {
    const label = SKU_LABELS[i] ?? { name: p.name, serving: '', badge: '' };
    const price = p.sale_price / 100;
    const original = p.line_price / 100;
    return {
      id: String(p.id),
      label: label.name,
      subtitle: label.serving || `${Math.round(price * 30)}-day supply`,
      price: `$${price.toFixed(2)}`,
      perUnit: `$${(price / (i + 1)).toFixed(2)}/bottle`,
      originalPrice: `$${original.toFixed(2)}`,
      badge: label.badge || null,
      image: skuImages[i] || skuImages[0],
    };
  });

  const currentSku = skuOptions.find((s) => s.id === selectedProductId) ?? skuOptions[0];

  // 获取当前选中的产品价格
  const currentProduct = products.find((p) => String(p.id) === selectedProductId);
  const originalPrice = currentProduct ? currentProduct.sale_price / 100 : 0;

  // 构建购物车行项目（用于优惠券计算）
  const lineItems = useMemo((): CartItem[] => {
    if (!currentProduct) return [];
    return [{ id: Number(currentProduct.id), name: currentProduct.name, image: '', price: originalPrice, quantity }];
  }, [currentProduct, quantity, originalPrice]);

  // 直接使用全局的 availableCoupons（已经过滤为可用状态）
  const availableWallet = availableCoupons;

  // 检查是否可以显示"领取优惠券"入口
  useEffect(() => {
      const checkCouponClaimEntry = async () => {
          if (!user) {
              setShowCouponClaimEntry(false);
              return;
          }
          try {
              const claimStatusRes = await getCouponClaimStatus();
              if (claimStatusRes.data?.status && claimStatusRes.data.data) {
                  const { claimed } = claimStatusRes.data.data;
                  setShowCouponClaimEntry(!claimed);
              }
          } catch (error) {
              console.error('Failed to check coupon claim status:', error);
              setShowCouponClaimEntry(false);
          }
      };

      checkCouponClaimEntry();
  }, [user]);

  // 自动选择最佳优惠券（统一管理，子组件通过 onSelect 回调通知手动选择）
  useEffect(() => {
      if (!user || lineItems.length === 0) {
          setPdpCouponId(null);
          isManualSelectionRef.current = false;
          return;
      }
      if (availableWallet.length === 0) return;

      const currentQty = lineItems[0]?.quantity ?? 0;
      const qtyChanged = currentQty !== lastQuantityRef.current;
      lastQuantityRef.current = currentQty;

      // 用户手动选择过且仅数量变化 → 只校验当前券是否仍有效
      if (isManualSelectionRef.current && qtyChanged && pdpCouponId) {
          const cur = availableWallet.find((c) => c.id === pdpCouponId);
          if (cur) {
              const ev = evaluateCouponForCart(cur, lineItems);
              if (ev.ok) return;
              isManualSelectionRef.current = false;
          }
      }

      // 手动选择过且数量没变 → 校验选中券是否仍在可用列表中（可能已被使用/过期）
      if (isManualSelectionRef.current && !qtyChanged && pdpCouponId) {
          const stillAvailable = availableWallet.some((c) => c.id === pdpCouponId);
          if (!stillAvailable) {
              isManualSelectionRef.current = false;
          } else {
              return;
          }
      }

      const best = pickBestCouponId(lineItems, availableWallet);
      if (best) {
          setPdpCouponId(best);
      }
  }, [user, lineItems, availableWallet, pdpCouponId]);

  // 用户手动选择优惠券时的回调（由 StickyCouponPicker 的 onSelect 触发）
  const handlePdpManualSelect = useCallback(() => {
      isManualSelectionRef.current = true;
  }, []);

  // 基于选中优惠券动态计算价格（替代硬编码的20%折扣）
  const couponPriceInfo = useMemo(() => {
      if (!pdpCouponId || lineItems.length === 0 || availableWallet.length === 0) {
          return { hasDiscount: false, discountedPrice: originalPrice, discountAmount: 0, couponName: '', discountText: '' };
      }

      const selected = availableWallet.find((c) => c.id === pdpCouponId);
      if (!selected) {
          return { hasDiscount: false, discountedPrice: originalPrice, discountAmount: 0, couponName: '', discountText: '' };
      }

      const ev = evaluateCouponForCart(selected, lineItems);
      if (!ev.ok) {
          return { hasDiscount: false, discountedPrice: originalPrice, discountAmount: 0, couponName: '', discountText: '' };
      }

      // 计算当前商品行的实际折扣金额（总折扣）
      const lineDiscount = previewDiscountForLine(lineItems[0]!.id, lineItems[0]!.price, lineItems[0]!.quantity, selected);

      // 用总价计算再折算单价，避免「单价 - 总折扣」导致负数
      const totalOriginal = originalPrice * quantity;
      const discountedTotal = Math.max(0, totalOriginal - lineDiscount);
      const discountedPrice = quantity > 0 ? discountedTotal / quantity : originalPrice;
      const discountAmount = lineDiscount;

      // 生成优惠券描述文本
      let discountText = '';
      if (selected.type === 'fixed_off' && selected.amountOff) {
          discountText = `$${selected.amountOff.toFixed(2)} OFF`;
      } else if (selected.type === 'percent_off' && selected.discountFold) {
          // 统一公式：discountFold 就是折数，百分比 OFF = (1 - 折数/10) × 100
          const percent = Math.round((1 - selected.discountFold / 10) * 100);
          discountText = `${percent}% OFF`;
          if (selected.maxDiscount) {
              discountText += ` (-$${Math.min(selected.maxDiscount, discountAmount).toFixed(2)})`;
          }
      } else if (selected.type === 'no_threshold_fixed' && selected.faceValue) {
          discountText = `$${selected.faceValue.toFixed(2)} OFF`;
      }

      return {
          hasDiscount: true,
          discountedPrice,
          discountAmount,
          couponName: selected.title || selected.code || '',
          discountText,
      };
  }, [pdpCouponId, lineItems, availableWallet, originalPrice, quantity]);

  const { hasDiscount, discountedPrice, discountAmount, couponName, discountText } = couponPriceInfo;

  // 检查全局优惠券状态（使用 sessionStorage）
  useEffect(() => {
      if (typeof window === 'undefined') return;

      const checkCouponStatus = () => {
          const storedClaimed = sessionStorage.getItem('global_coupon_claimed');
          setIsCouponClaimed(storedClaimed === 'true');
          // 领取成功后，隐藏"领取优惠券"入口
          if (storedClaimed === 'true') {
              setShowCouponClaimEntry(false);
          }
      };

      // 初始检查
      checkCouponStatus();

      // 监听优惠券领取事件
      window.addEventListener('coupon-claimed', checkCouponStatus);

      // 监听 storage 变化（同一窗口内 sessionStorage 变化不会触发，但保险起见）
      window.addEventListener('storage', checkCouponStatus);

      return () => {
          window.removeEventListener('coupon-claimed', checkCouponStatus);
          window.removeEventListener('storage', checkCouponStatus);
      };
  }, []);

  // 处理购买
  const handleShopNow = useCallback(async () => {
    if (!selectedProductId) return;

    const item = products.find((p) => String(p.id) === selectedProductId);
    if (!item) return;

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

    await executeCheckout(item);
  }, [products, selectedProductId]);

  const executeCheckout = useCallback(async (item: GoodsItem) => {
    const value = item.sale_price / 100;

    // 发送 SubscribedButtonClick 事件
    // if (isFbPixel) {
    //   fbqTrackSingle(FB_PIXEL_ID_BODY_PURIFICATION, 'SubscribedButtonClick', {
    //     content_name: 'Buy Now',
    //     content_ids: [String(item.id)],
    //     content_type: 'product',
    //     value,
    //     currency: 'USD',
    //   });
    // }

    const ttclid = getTikTokClickId();
    // ttqTrack('ClickButton', {
    //   content_id: String(item.id),
    //   content_type: 'product',
    //   content_name: item.name,
    //   value,
    //   currency: 'USD'
    // }, ttclid);

    try {
      const adSource = resolveAdSourceByQuerySource(searchParams.get('source'));
      const orderData: {
        goods: Array<{ id: number; quantity: number }>;
        source: string;
        create_channel: number;
        ad_source: number;
        user_coupon_id?: number;
        ad_extra?: {
          ttclid?: string;
          fbc?: string;
          fbp?: string;
        };
      } = {
        goods: [{ id: Number(item.id), quantity: 1 }],
        source: 'body-purification',
        create_channel: ORDER_CREATE_CHANNEL.body_purification,
        ad_source: adSource,
        ...(pdpCouponId && availableCoupons.some((c) => c.id === pdpCouponId)
          ? { user_coupon_id: Number(pdpCouponId) }
          : {}),
      };

      if (adSource === ORDER_AD_SOURCE.fb) {
        const fbc = getFacebookClickId();
        const fbp = getFacebookBrowserId();
        if (fbc || fbp) {
          orderData.ad_extra = {};
          if (fbc) orderData.ad_extra.fbc = fbc;
          if (fbp) orderData.ad_extra.fbp = fbp;
        }
      } else if (adSource === ORDER_AD_SOURCE.tk) {
        const ttclid = getTikTokClickId();
        if (ttclid) {
          orderData.ad_extra = { ttclid };
        }
      }

      const res = await addOrderLanding(orderData);
      const result = res.data;
      const data = result?.data;

      if (!result?.status) {
        return;
      }

      // 发送 InitiateCheckout 事件
      if (isFbPixel) {
        fbqTrackSingle(FB_PIXEL_ID_BODY_PURIFICATION, 'InitiateCheckout', {
          content_ids: [String(item.id)],
          content_type: 'product',
          contents: [{ id: String(item.id), quantity: 1, item_price: value }],
          value,
          currency: 'USD',
          num_items: 1,
        });
      }

      ttqTrack('InitiateCheckout', {
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

      const checkoutUrl = data?.url;
      const clientSecret = data?.client_secret;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
      if (clientSecret) {
        navigateToEmbeddedCheckout(router, clientSecret);
      }
    } catch (error) {
    }
  }, [products, selectedProductId, searchParams, isFbPixel, router, pdpCouponId]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Script
        src="/main-app.js"
        strategy="afterInteractive"
        onReady={() => {
          window.dispatchEvent(new CustomEvent('app:ready'));
        }}
        onError={() => {
          window.dispatchEvent(new CustomEvent('app:ready'));
        }}
      />
      <h1 className="sr-only">LuckDate Body Purification - Internal Deodorant Supplement | LUCKDATE</h1>
      <div id="top" className="min-h-screen bg-background">
      <JsonLd data={bodyPurificationJsonLd} />
      <div className="sticky top-0 z-50">
        <CountdownBar />
        <Marquee />
        <Navbar onShopNow={handleShopNow} />
      </div>
      <ProductHero
        skuOptions={skuOptions}
        selectedProductId={selectedProductId}
        onSelectProduct={setSelectedProductId}
        onShopNow={handleShopNow}
        currentSku={currentSku}
        products={products}
        couponData={{
          hasDiscount,
          discountedPrice,
          discountAmount,
          originalPrice,
          lineItems,
          availableWallet,
          pdpCouponId,
          setPdpCouponId,
          handlePdpManualSelect,
        }}
      />
      {/* <Reveal><GutBanner /></Reveal> */}
      <Reveal><NumbersSection /></Reveal>
      <Reveal><GutHealthBanner /></Reveal>
      <Reveal><DontWaitSection /></Reveal>
      <Reveal><TimelineSection /></Reveal>
      <Reveal><WhySection /></Reveal>
      <Reveal><IngredientsSection /></Reveal>
      <Reveal><CertificatesSection /></Reveal>
      <Reveal><ReviewsSection /></Reveal>
      <Reveal><FAQSection /></Reveal>
      <Footer />
      <StickyCart
        skuOptions={skuOptions}
        selectedProductId={selectedProductId}
        onSelectProduct={setSelectedProductId}
        onShopNow={handleShopNow}
        currentSku={currentSku}
        products={products}
        couponData={{
          lineItems,
          availableWallet,
          pdpCouponId,
          setPdpCouponId,
          showCouponClaimEntry: false,
          handlePdpManualSelect,
          hasDiscount,
          discountedPrice,
          discountAmount,
          originalPrice,
        }}
      />
      <BodyPurificationCouponPopup />
      <UnpaidOrderFloat />
      <UnpaidOrderModal
        open={showUnpaidModal}
        onClose={() => setShowUnpaidModal(false)}
        onProceed={() => {
          setShowUnpaidModal(false);
          const product = products.find((p) => String(p.id) === selectedProductId);
          if (product) void executeCheckout(product);
        }}
        theme="green"
      />
    </div>
    </>
  );
}
