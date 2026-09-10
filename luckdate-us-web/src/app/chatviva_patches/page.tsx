'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Zap,
  Brain,
  Moon,
  FlaskConical,
  Award,
  Check,
  Star,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import productImg from '@/assets/microneedle/product.jpg';
import molecularAdvantageImg from '@/assets/microneedle/molecular-advantage.jpg';
import oralVsPatchImg from '@/assets/microneedle/oral-vs-patch.jpg';
import {
  buildMicroneedleSkuOptions,
  formatMicroneedlePrice,
  getSkuPerBoxDisplayPrice,
} from '@/lib/microneedle/skus';
import SkuPicker from '@/components/microneedle/SkuPicker';
import SkuPickerDialog from '@/components/microneedle/SkuPickerDialog';
import MicroneedleCouponPicker from '@/components/microneedle/MicroneedleCouponPicker';
import MicroneedleCouponPopup from '@/components/microneedle/MicroneedleCouponPopup';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import UnpaidOrderModal from '@/components/UnpaidOrderModal';
import { useOrder } from '@/context/OrderContext';
import { getUserOrders, type OrderItem, addOrderLanding } from '@/lib/api/order';
import { getGoodsListChatvivaPatches } from '@/lib/api/goods';
import type { GoodsItem } from '@/lib/api/types';
import type { CartItem } from '@/context/CartContext';
import {
  ORDER_AD_SOURCE,
  ORDER_CREATE_CHANNEL,
  resolveAdSourceByQuerySource,
} from '@/lib/order-tracking';
import { navigateToEmbeddedCheckout } from '@/lib/stripe/embeddedCheckoutNavigate';
import {
  FB_PIXEL_ID_SHILAJIT,
  fbqTrackSingle,
  getTikTokClickId,
  getFacebookClickId,
  getFacebookBrowserId,
  ttqTrack,
} from '@/lib/meta-pixel';
import { useAuth } from '@/context/AuthContext';
import { useCoupon } from '@/context/CouponContext';
import {
  evaluateCouponForCart,
  pickBestCouponId,
  previewDiscountForLine,
} from '@/lib/coupons/engine';

export default function ChatvivaPatchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isFbPixel =
    resolveAdSourceByQuerySource(searchParams.get('source')) === ORDER_AD_SOURCE.fb;

  const [selected, setSelected] = useState<string>('3box');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showSticky, setShowSticky] = useState(false);
  const [skuDialogOpen, setSkuDialogOpen] = useState(false);
  const [products, setProducts] = useState<GoodsItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);
  const [pdpCouponId, setPdpCouponId] = useState<string | null>(null);

  const isManualSelectionRef = useRef(false);
  const lastQuantityRef = useRef(1);
  const quantity = 1;

  const { availableCoupons, refreshCoupons } = useCoupon();
  const { unpaidOrders } = useOrder();

  useEffect(() => {
    if (user) {
      refreshCoupons();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.classList.add('microneedle-theme');
    return () => {
      document.body.classList.remove('microneedle-theme');
    };
  }, []);

  useEffect(() => {
    getGoodsListChatvivaPatches()
      .then((res) => {
        const list = res.data?.list?.data ?? [];
        setProducts(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const skuOptions = useMemo(() => buildMicroneedleSkuOptions(products), [products]);
  const selectedSku = skuOptions.find((sku) => sku.id === selected) ?? skuOptions[1] ?? skuOptions[0];
  const selectedProduct = useMemo(() => {
    if (!selectedSku?.productId) {
      return undefined;
    }
    return products.find((product) => product.id === selectedSku.productId);
  }, [products, selectedSku]);

  useEffect(() => {
    if (skuOptions.length === 0) {
      return;
    }
    if (!skuOptions.some((sku) => sku.id === selected)) {
      const fallback = skuOptions[Math.min(1, skuOptions.length - 1)] ?? skuOptions[0];
      if (fallback) {
        setSelected(fallback.id);
      }
    }
  }, [skuOptions, selected]);
  const checkoutDisabled = !selectedProduct;
  const originalPrice = selectedProduct ? selectedProduct.sale_price / 100 : (selectedSku?.price ?? 0);

  const lineItems = useMemo((): CartItem[] => {
    if (!selectedProduct) return [];
    return [{
      id: Number(selectedProduct.id),
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: originalPrice,
      quantity,
    }];
  }, [selectedProduct, originalPrice, quantity]);

  const availableWallet = availableCoupons;

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

    if (isManualSelectionRef.current && qtyChanged && pdpCouponId) {
      const cur = availableWallet.find((c) => c.id === pdpCouponId);
      if (cur && evaluateCouponForCart(cur, lineItems).ok) return;
      isManualSelectionRef.current = false;
    }

    if (isManualSelectionRef.current && !qtyChanged && pdpCouponId) {
      if (availableWallet.some((c) => c.id === pdpCouponId)) return;
      isManualSelectionRef.current = false;
    }

    const best = pickBestCouponId(lineItems, availableWallet);
    if (best) setPdpCouponId(best);
  }, [user, lineItems, availableWallet, pdpCouponId]);

  const handlePdpManualSelect = useCallback(() => {
    isManualSelectionRef.current = true;
  }, []);

  const couponPriceInfo = useMemo(() => {
    if (!pdpCouponId || lineItems.length === 0 || availableWallet.length === 0) {
      return { hasDiscount: false, discountedPrice: originalPrice, discountAmount: 0 };
    }
    const selectedCoupon = availableWallet.find((c) => c.id === pdpCouponId);
    if (!selectedCoupon || !evaluateCouponForCart(selectedCoupon, lineItems).ok) {
      return { hasDiscount: false, discountedPrice: originalPrice, discountAmount: 0 };
    }
    const lineDiscount = previewDiscountForLine(
      lineItems[0]!.id,
      lineItems[0]!.price,
      lineItems[0]!.quantity,
      selectedCoupon,
    );
    const discountedTotal = Math.max(0, originalPrice * quantity - lineDiscount);
    return {
      hasDiscount: lineDiscount > 0,
      discountedPrice: quantity > 0 ? discountedTotal / quantity : originalPrice,
      discountAmount: lineDiscount,
    };
  }, [pdpCouponId, lineItems, availableWallet, originalPrice, quantity]);

  const { hasDiscount, discountedPrice } = couponPriceInfo;
  const checkoutPrice = hasDiscount ? discountedPrice : originalPrice;
  const selectedPerBoxPrice = selectedSku
    ? getSkuPerBoxDisplayPrice(selectedSku, {
      isSelected: true,
      checkoutPrice,
      hasDiscount,
    })
    : 0;

  useEffect(() => {
    if (!selectedProduct) return;
    const value = selectedProduct.sale_price / 100;
    if (isFbPixel) {
      fbqTrackSingle(FB_PIXEL_ID_SHILAJIT, 'ViewContent', {
        content_ids: [String(selectedProduct.id)],
        content_type: 'product',
        contents: [{ id: String(selectedProduct.id), quantity: 1, item_price: value }],
        value,
        currency: 'USD',
      });
    }
    const ttclid = getTikTokClickId();
    ttqTrack('ViewContent', {
      contents: [{
        content_id: String(selectedProduct.id),
        content_type: 'product',
        content_name: selectedProduct.name,
      }],
      value,
      currency: 'USD',
    }, ttclid);
  }, [selectedProduct, isFbPixel]);

  const scrollToBuy = () => {
    document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openSkuDialog = () => setSkuDialogOpen(true);

  const couponPickerNode = user ? (
    <MicroneedleCouponPicker
      lineItems={lineItems}
      availableWallet={availableWallet}
      pdpCouponId={pdpCouponId}
      setPdpCouponId={setPdpCouponId}
      onSelect={handlePdpManualSelect}
    />
  ) : null;

  const executeCheckout = useCallback(async () => {
    if (!selectedProduct || isSubmitting) return false;
    setIsSubmitting(true);
    try {
      const adSource = resolveAdSourceByQuerySource(searchParams.get('source'));
      let couponIdForOrder: string | null = null;

      if (lineItems.length > 0 && availableWallet.length > 0) {
        if (pdpCouponId) {
          const selectedCoupon = availableWallet.find((c) => c.id === pdpCouponId);
          if (selectedCoupon && evaluateCouponForCart(selectedCoupon, lineItems).ok) {
            couponIdForOrder = pdpCouponId;
          }
        }
        if (!couponIdForOrder) {
          const bestCouponId = pickBestCouponId(lineItems, availableWallet);
          if (bestCouponId) {
            couponIdForOrder = bestCouponId;
            setPdpCouponId(bestCouponId);
          }
        }
      }

      const orderData: {
        goods: Array<{ id: number; quantity: number }>;
        source: string;
        create_channel: number;
        ad_source: number;
        user_coupon_id?: number;
        ad_extra?: { ttclid?: string; fbc?: string; fbp?: string };
      } = {
        goods: [{ id: parseInt(selectedProduct.id, 10), quantity: 1 }],
        source: 'chatviva_patches',
        create_channel: ORDER_CREATE_CHANNEL.chatviva_patches,
        ad_source: adSource,
        ...(couponIdForOrder ? { user_coupon_id: Number(couponIdForOrder) } : {}),
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
        if (ttclid) orderData.ad_extra = { ttclid };
      }

      const res = await addOrderLanding(orderData);
      const result = res.data;
      const data = result?.data;

      if (!result?.status) return false;

      const value = selectedProduct.sale_price / 100;
      if (isFbPixel) {
        fbqTrackSingle(FB_PIXEL_ID_SHILAJIT, 'InitiateCheckout', {
          content_ids: [String(selectedProduct.id)],
          content_type: 'product',
          contents: [{ id: String(selectedProduct.id), quantity: 1, item_price: value }],
          value,
          currency: 'USD',
          num_items: 1,
        });
      }
      const ttclid = getTikTokClickId();
      ttqTrack('InitiateCheckout', {
        contents: [{
          content_id: String(selectedProduct.id),
          content_type: 'product',
          content_name: selectedProduct.name,
        }],
        value,
        currency: 'USD',
      }, ttclid);

      const checkoutUrl = data?.url;
      const clientSecret = data?.client_secret;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return true;
      }
      if (clientSecret) {
        setSkuDialogOpen(false);
        navigateToEmbeddedCheckout(router, clientSecret, 'chatviva_patches');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedProduct,
    isSubmitting,
    searchParams,
    router,
    isFbPixel,
    lineItems,
    availableWallet,
    pdpCouponId,
  ]);

  const handleSubmitOrder = useCallback(async () => {
    if (!selectedProduct) return false;

    try {
      const orderRes = await getUserOrders({ page: 1, pageSize: 50 });
      if (orderRes.data?.status && orderRes.data?.list) {
        const pending = (orderRes.data.list.data || []).filter((o: OrderItem) => o.status === 0);
        if (pending.length > 0) {
          setShowUnpaidModal(true);
          return false;
        }
      }
    } catch {
      // 检查失败，继续下单
    }

    return executeCheckout();
  }, [selectedProduct, executeCheckout]);

  return (
    <>
      <h1 className="sr-only">CHATVIVA NMN Micro-Point Patches | Executive Vitality System</h1>
      <div className="min-h-screen bg-background text-foreground pb-20 sm:pb-0">
        <div className="bg-[oklch(0.25_0.015_60)] text-[oklch(0.92_0.04_75)] text-[11px] sm:text-xs tracking-[0.18em] uppercase">
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-6 text-center">
            <span className="hidden sm:inline">Clinical-Grade Uthever NMN</span>
            <span className="hidden sm:inline">·</span>
            <span>Free US Shipping Over $59</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden md:inline">60-Day Money-Back Guarantee</span>
          </div>
        </div>

        <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="font-serif text-2xl tracking-[0.25em] text-foreground">CHATVIVA</div>
            <button
              type="button"
              onClick={openSkuDialog}
              className="hidden sm:inline-flex items-center bg-[oklch(0.25_0.015_60)] hover:bg-[oklch(0.20_0.015_60)] text-[oklch(0.97_0.02_80)] text-sm font-medium tracking-wide px-5 py-2.5 rounded-sm transition-colors"
            >
              Shop Now
            </button>
          </div>
        </header>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.97_0.018_75)] via-background to-background" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 lg:pt-16 lg:pb-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[oklch(0.45_0.08_55)] mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Topical NAD+ System</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.05] text-foreground">
                Reclaim the energy<br />you had at 35.
              </h2>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                CHATVIVA NMN Micro-Point Patches deliver clinical-grade NMN, Resveratrol, TMG and Apigenin
                directly through the skin — bypassing the gut so your cells get the full dose. Built for
                executives who can&apos;t afford to feel tired by Wednesday.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm sm:text-base text-foreground">
                {[
                  '600 mg Uthever NMN per patch — bioidentical, third-party tested',
                  'Wear 6–8 hours · 7 patches per box · zero pills, zero stomach upset',
                  'Formulated with TMG to prevent the fatigue rebound common with oral NMN',
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <Check className="w-5 h-5 mt-0.5 text-[oklch(0.52_0.085_55)] shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  type="button"
                  onClick={scrollToBuy}
                  className="group inline-flex w-full sm:w-auto flex-col items-center gap-1.5 bg-[oklch(0.25_0.015_60)] hover:bg-[oklch(0.18_0.015_60)] text-[oklch(0.97_0.02_80)] px-7 py-4 rounded-sm transition-all text-center"
                >
                  <span className="text-sm font-medium tracking-[0.14em] uppercase leading-snug whitespace-nowrap">
                    Start Your Program
                  </span>
                  <span className="flex items-baseline justify-center gap-2 whitespace-nowrap normal-case tracking-normal">
                    <span className="text-[11px] sm:text-xs uppercase tracking-[0.12em] text-[oklch(0.82_0.02_80)]">
                      From
                    </span>
                    {hasDiscount && selectedSku && (
                      <span className="text-sm text-[oklch(0.72_0.02_75)] line-through tabular-nums">
                        ${formatMicroneedlePrice(selectedSku.perBox)}
                      </span>
                    )}
                    <span className="text-base sm:text-lg font-semibold tabular-nums tracking-tight">
                      ${formatMicroneedlePrice(selectedPerBoxPrice)}
                      <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.1em] ml-0.5">
                        /box
                      </span>
                    </span>
                  </span>
                </button>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[oklch(0.72_0.13_75)] text-[oklch(0.72_0.13_75)]" />
                    ))}
                  </div>
                  <span>4.8 · 2,400+ verified reviews</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" />GMP Certified</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4" />Uthever Verified</span>
                <span className="flex items-center gap-1.5"><FlaskConical className="w-4 h-4" />3rd-Party Lab Tested</span>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-6 bg-gradient-radial from-[oklch(0.85_0.06_75)/30] to-transparent rounded-full blur-3xl" />
              <Image
                src={productImg}
                alt="CHATVIVA NMN Micro-Point Patches — 7 single-use body patches"
                className="relative w-full rounded-sm shadow-[0_30px_80px_-30px_rgba(80,60,30,0.35)]"
                priority
              />
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-[oklch(0.96_0.012_75)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] sm:text-xs tracking-[0.25em] uppercase text-muted-foreground">
            <span>As Featured In</span>
            <span className="font-serif tracking-wider text-foreground text-base normal-case">Forbes Health</span>
            <span className="font-serif tracking-wider text-foreground text-base normal-case">Bloomberg Pursuits</span>
            <span className="font-serif tracking-wider text-foreground text-base normal-case">Men&apos;s Health</span>
            <span className="font-serif tracking-wider text-foreground text-base normal-case">Vogue Wellness</span>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_55)] mb-4">The Problem With NMN Capsules</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
              You&apos;re paying for NMN your stomach destroys before it reaches a single cell.
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Oral NMN is degraded by stomach acid and first-pass liver metabolism. Studies suggest
              less than 30% actually reaches your bloodstream. CHATVIVA bypasses digestion entirely —
              micro-points deliver the active matrix transdermally, the way modern hormone and nicotine
              therapies are already delivered.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: '3× Bioavailability',
                body: 'Transdermal delivery + micronized actives + BioPerine® for measurably higher absorption than capsules.',
              },
              {
                icon: Brain,
                title: 'Sharper by Day 7',
                body: 'Users report cleaner focus, faster recovery and steadier afternoon energy within the first week.',
              },
              {
                icon: Moon,
                title: 'Sleep Without the Crash',
                body: 'TMG buffers the methylation drain that causes long-term NMN users to feel exhausted at night.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card border border-border p-7 rounded-sm">
                <Icon className="w-7 h-7 text-[oklch(0.52_0.085_55)]" strokeWidth={1.5} />
                <h3 className="mt-4 font-serif text-2xl text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[oklch(0.96_0.012_75)] border-y border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="text-center">
              <p className="text-[11px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_55)] mb-4">Honest Comparison</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Why executives are switching from capsules.</h2>
            </div>
            <div className="mt-10 grid lg:grid-cols-2 gap-8 items-center">
              <div className="overflow-hidden rounded-sm border border-border bg-card">
                <div className="grid grid-cols-3 text-xs sm:text-sm">
                  <div className="p-4 sm:p-5 bg-[oklch(0.94_0.015_75)] font-medium text-muted-foreground" />
                  <div className="p-4 sm:p-5 bg-[oklch(0.25_0.015_60)] text-[oklch(0.97_0.02_80)] font-serif text-base sm:text-lg text-center">CHATVIVA</div>
                  <div className="p-4 sm:p-5 bg-[oklch(0.94_0.015_75)] text-center text-muted-foreground">Oral NMN Capsules</div>
                  {[
                    ['Delivery method', 'Transdermal micro-points', 'Swallowed, gut-degraded'],
                    ['Bioavailability', '~3× higher', 'Often <30%'],
                    ['Methyl-safe (TMG)', 'Yes — included', 'Rarely included'],
                    ['CD38 blocker (Apigenin)', 'Yes — locks NAD+', 'No'],
                    ['Daily commitment', 'Apply & forget', 'Multiple pills, timing'],
                    ['Stomach upset', 'None', 'Common complaint'],
                  ].map((row, i) => (
                    <div key={i} className="contents">
                      <div className="p-4 sm:p-5 border-t border-border text-foreground font-medium">{row[0]}</div>
                      <div className="p-4 sm:p-5 border-t border-border text-center bg-[oklch(0.98_0.015_75)] text-foreground flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-[oklch(0.52_0.085_55)] shrink-0" />
                        <span>{row[1]}</span>
                      </div>
                      <div className="p-4 sm:p-5 border-t border-border text-center text-muted-foreground">{row[2]}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Image
                  src={oralVsPatchImg}
                  alt="Oral capsules vs CHATVIVA patch: maximize NMN absorption"
                  className="w-full h-auto rounded-sm border border-border shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[oklch(0.96_0.012_75)] border-y border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-[11px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_55)] mb-4">The Full-Cycle NAD+ System</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
                Five clinical actives. One precisely engineered matrix.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Most brands hand you a single ingredient and call it a stack. CHATVIVA refuels, locks
                and ignites your NAD+ cycle in one patch.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-8 items-start">
              <div className="md:sticky md:top-8">
                <Image
                  src={molecularAdvantageImg}
                  alt="Scientific advantage: CHATVIVA NMN compact molecular weight enables enhanced transdermal penetration"
                  className="w-full h-auto rounded-sm border border-border shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-8">
                {[
                  { tag: 'Refuel', dose: '600 mg', name: 'Uthever NMN', desc: 'The clinical-grade NMN trusted in published human trials. Restores NAD+, the fuel your mitochondria burn.' },
                  { tag: 'Ignite', dose: '300 mg', name: 'Micronized Trans-Resveratrol', desc: 'Activates Sirtuins — the longevity proteins NMN exists to feed. Micronized for absorption.' },
                  { tag: 'Lock', dose: '45 mg', name: 'Apigenin', desc: 'Inhibits CD38, the enzyme that quietly drains the NMN you\'ve already paid for.' },
                  { tag: 'Protect', dose: '50 mg', name: 'TMG (Trimethylglycine)', desc: 'Replenishes methyl groups consumed by long-term NMN use — the reason most users eventually crash.' },
                  { tag: 'Accelerate', dose: '5 mg', name: 'BioPerine®', desc: 'Clinically shown to raise nutrient absorption by 30%+ — the reason you feel it sooner.' },
                  { tag: 'Deliver', dose: 'Dermal', name: 'Micro-Point Adhesive Matrix', desc: 'Painless micro-points open a direct channel through the skin barrier. No needles. No pills.' },
                ].map((item) => (
                  <div key={item.name} className="flex gap-5 pb-7 border-b border-border last:border-b-0">
                    <div className="shrink-0 w-20 text-right">
                      <div className="text-[10px] tracking-[0.22em] uppercase text-[oklch(0.45_0.08_55)]">{item.tag}</div>
                      <div className="mt-1 font-serif text-2xl text-foreground">{item.dose}</div>
                    </div>
                    <div className="flex-1 border-l border-border pl-5">
                      <div className="font-medium text-foreground">{item.name}</div>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_55)] mb-4">Six Seconds. Six Hours. Done.</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">A protocol built around your calendar.</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              { n: '01', t: 'Apply', d: 'Clean a discreet area — inner arm, shoulder or hip. Press firmly for 10 seconds to activate the micro-points.' },
              { n: '02', t: 'Wear', d: 'Leave on 6–8 hours. Wear under a dress shirt to a board meeting or through the night while you sleep.' },
              { n: '03', t: 'Remove', d: 'Peel off and discard. No residue, no aftertaste, no afternoon dip — just the steady return of your baseline.' },
            ].map((step) => (
              <div key={step.n} className="relative bg-card border border-border p-7 rounded-sm">
                <div className="font-serif text-5xl text-[oklch(0.85_0.05_75)]">{step.n}</div>
                <h3 className="mt-2 font-serif text-2xl text-foreground">{step.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="buy" className="bg-[oklch(0.96_0.012_75)] border-y border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-[11px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_55)] mb-4">Choose Your Program</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
                Real results show in 21 days. Save more when you commit.
              </h2>
            </div>

            <div className="mt-10 max-w-4xl mx-auto">
              <SkuPicker
                skuOptions={skuOptions}
                selected={selected}
                onSelect={setSelected}
                onCheckout={handleSubmitOrder}
                isSubmitting={isSubmitting}
                checkoutDisabled={checkoutDisabled}
                checkoutPrice={checkoutPrice}
                originalCheckoutPrice={originalPrice}
                hasDiscount={hasDiscount}
                couponPicker={couponPickerNode}
              />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_55)] mb-4">Verified Customer Stories</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
              From people with brighter lives.
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Daniel R.',
                role: 'Managing Partner, NYC',
                age: 48,
                text: 'I travel 14 days a month. By the third week I noticed I was no longer needing the 3pm espresso to finish a deck. That alone paid for it.',
              },
              {
                name: 'Catherine M.',
                role: 'VP of Strategy',
                age: 44,
                text: 'I tried oral NMN for a year and felt nothing. The patches I felt by day five — cleaner mornings, deeper sleep. I keep a box in my office drawer.',
              },
              {
                name: 'Marcus T.',
                role: 'Founder & CEO',
                age: 52,
                text: 'What sold me was the TMG. Every other NMN brand ignores it and you crash. This is the first stack that actually held up over six months.',
              },
            ].map((review) => (
              <figure key={review.name} className="bg-card border border-border p-7 rounded-sm flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[oklch(0.72_0.13_75)] text-[oklch(0.72_0.13_75)]" />
                  ))}
                </div>
                <blockquote className="font-serif text-lg leading-snug text-foreground">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
                <figcaption className="mt-5 pt-5 border-t border-border text-sm">
                  <div className="font-medium text-foreground">{review.name}, {review.age}</div>
                  <div className="text-muted-foreground">{review.role}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[oklch(0.45_0.08_55)]">
                    <Check className="w-3 h-3" /> Verified Buyer
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_55)] mb-4">Questions, Answered</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Everything an informed buyer asks first.</h2>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {[
              {
                q: 'How quickly will I feel a difference?',
                a: 'Most users report noticeably steadier energy and sharper focus within 7–10 days. The full mitochondrial and NAD+ benefits compound through the first 21–30 days, which is why our Executive Routine is our most popular pack.',
              },
              {
                q: 'Is transdermal delivery actually proven?',
                a: 'Yes. The same delivery science is used in FDA-cleared hormone, nicotine and B12 patches. CHATVIVA uses a medical-grade micro-point matrix that opens the stratum corneum painlessly — small enough you won\'t feel it, large enough for NMN molecules to pass.',
              },
              {
                q: 'Will I feel anything on my skin?',
                a: 'A brief warmth on application, nothing more. Patches are dermatologically tested and hypoallergenic. Wear them under clothing through a workday or overnight.',
              },
              {
                q: 'Is it safe to use every day?',
                a: 'Yes. Our formula intentionally includes 50 mg of TMG specifically to keep daily, long-term users safe from methyl depletion — the issue that causes capsule users to plateau or crash after a few months.',
              },
              {
                q: 'How is this billed and shipped?',
                a: 'One-time purchase, no subscription trap. Orders ship from California within 24 hours via tracked carrier. US orders over $59 ship free. Most addresses receive in 3–5 business days.',
              },
              {
                q: 'What if it doesn\'t work for me?',
                a: 'Use the full box. If you don\'t feel a meaningful difference, email service@chatviva.com within 60 days for a full refund — keep the remaining patches. We can offer this because over 92% of customers reorder.',
              },
            ].map((faq, i) => (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <p className="pb-5 -mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={scrollToBuy}
              className="inline-flex items-center justify-center bg-[oklch(0.25_0.015_60)] hover:bg-[oklch(0.18_0.015_60)] text-[oklch(0.97_0.02_80)] text-sm font-medium tracking-[0.14em] uppercase px-8 py-4 rounded-sm transition-colors"
            >
              Choose My Program
            </button>
          </div>
        </section>

        <footer className="bg-[oklch(0.20_0.015_60)] text-[oklch(0.85_0.02_75)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="font-serif text-2xl tracking-[0.25em] text-[oklch(0.97_0.02_80)]">CHATVIVA</div>
                <p className="mt-4 text-sm text-[oklch(0.75_0.02_75)] max-w-md leading-relaxed">
                  Advanced topical vitality systems formulated for the people who can&apos;t afford to slow down.
                  Distributed by CHATVIVA. Manufactured in a GMP-certified facility.
                </p>
              </div>
              <div>
                <div className="text-xs tracking-[0.18em] uppercase text-[oklch(0.65_0.04_75)] mb-3">Support</div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/terms-of-service#shipping-returns" className="hover:text-[oklch(0.97_0.02_80)] transition-colors">
                      Shipping & Returns
                    </Link>
                  </li>
                  <li>
                    <Link href="/order-inquiry" className="hover:text-[oklch(0.97_0.02_80)] transition-colors">
                      Track Your Order
                    </Link>
                  </li>
                  <li>
                    <a href="mailto:service@chatviva.com" className="hover:text-[oklch(0.97_0.02_80)] transition-colors">
                      Contact: service@chatviva.com
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-xs tracking-[0.18em] uppercase text-[oklch(0.65_0.04_75)] mb-3">Legal</div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/privacy-policy" className="hover:text-[oklch(0.97_0.02_80)] transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="hover:text-[oklch(0.97_0.02_80)] transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookie-policy" className="hover:text-[oklch(0.97_0.02_80)] transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/disclaimer" className="hover:text-[oklch(0.97_0.02_80)] transition-colors">
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-[oklch(0.30_0.015_60)] text-[11px] text-[oklch(0.65_0.02_75)] leading-relaxed">
              <p>
                *These statements have not been evaluated by the Food and Drug Administration. This
                product is not intended to diagnose, treat, cure, or prevent any disease. Individual
                results may vary. Consult your physician before beginning any new wellness regimen.
              </p>
              <p className="mt-3">© {new Date().getFullYear()} CHATVIVA. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <div
          className={`fixed bottom-0 inset-x-0 z-40 bg-[oklch(0.20_0.015_60)] border-t border-[oklch(0.30_0.015_60)] transition-transform duration-300 z-50 ${
            showSticky ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.18em] uppercase text-[oklch(0.65_0.04_75)]">{selectedSku?.title ?? ''}</div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-xl text-[oklch(0.97_0.02_80)]">
                  ${checkoutPrice.toFixed(2)}
                </span>
                {(hasDiscount || (selectedSku && selectedSku.original > selectedSku.price)) && (
                  <span className="text-xs line-through text-[oklch(0.60_0.02_75)]">
                    ${(hasDiscount ? originalPrice : selectedSku?.original ?? originalPrice).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={openSkuDialog}
              className="bg-[oklch(0.78_0.10_75)] hover:bg-[oklch(0.72_0.11_70)] text-[oklch(0.20_0.015_60)] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase px-5 sm:px-7 py-3 rounded-sm transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>

        <SkuPickerDialog
          open={skuDialogOpen}
          onOpenChange={(next) => {
            if (!next && showUnpaidModal && unpaidOrders.length > 0) return;
            setSkuDialogOpen(next);
          }}
          skuOptions={skuOptions}
          selected={selected}
          onSelect={setSelected}
          onCheckout={handleSubmitOrder}
          isSubmitting={isSubmitting}
          checkoutDisabled={checkoutDisabled}
          checkoutPrice={checkoutPrice}
          originalCheckoutPrice={originalPrice}
          hasDiscount={hasDiscount}
          couponPicker={couponPickerNode}
        />

        <MicroneedleCouponPopup />
        <UnpaidOrderFloat />
        <UnpaidOrderModal
          open={showUnpaidModal}
          onClose={() => setShowUnpaidModal(false)}
          onProceed={() => {
            setShowUnpaidModal(false);
            void executeCheckout();
          }}
          theme="microneedle"
        />
      </div>
    </>
  );
}
