'use client';

import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Star, Check, ShoppingCart, Minus, Plus, ArrowLeft, Gift, ChevronLeft, ChevronRight, Ticket, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCoupon } from '@/context/CouponContext';
import { Button } from '@/components/ui/button';
import CartDrawer from '@/components/CartDrawer';
import { GlobalCoupon } from '@/components/GlobalCoupon';
import { type Product } from '@/sections/Products';
import { addOrder, getUserOrders } from '@/lib/api/order';
import { ORDER_CREATE_CHANNEL } from '@/lib/order-tracking';
import { getCouponClaimStatus } from '@/lib/api/coupon';
import {
  isStripePublishableKeyConfigured,
  navigateToEmbeddedCheckout,
} from '@/lib/stripe/embeddedCheckoutNavigate';
import UnpaidOrderModal from '@/components/UnpaidOrderModal';
import type { UserCoupon } from '@/lib/coupons/types';
import type { CartItem } from '@/context/CartContext';
import { evaluateCouponForCart, pickBestCouponId, previewDiscountForLine } from '@/lib/coupons/engine';

function prepareVideoHtml(html: string): string {
    return html.replace(/<video\b([^>]*)>/gi, (_match, attrs: string) => {
        const styleMatch = attrs.match(/\sstyle=(["'])([\s\S]*?)\1/i);
        const existingStyle = styleMatch?.[2] ?? '';
        const next = attrs
            .replace(/\s*autoplay(=(["'])?(true|false)?\2)?/gi, '')
            .replace(/\s*muted(=(["'])?(true|false)?\2)?/gi, '')
            .replace(/\s*style=(["'])([\s\S]*?)\1/gi, '');
        const centerStyle = 'display:block;margin-left:auto;margin-right:auto';
        const style = existingStyle ? `${existingStyle.replace(/;?\s*$/, '')}; ${centerStyle}` : centerStyle;
        return `<video${next} style="${style}" muted playsinline>`;
    });
}

const ProductRichContent = memo(function ProductRichContent({ html }: { html: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;

        const videos = Array.from(root.querySelectorAll('video'));
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const video = entry.target as HTMLVideoElement;
                    if (entry.isIntersecting) {
                        void video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                }
            },
            { threshold: 0.25 },
        );

        for (const video of videos) {
            video.muted = true;
            video.playsInline = true;
            observer.observe(video);
        }

        return () => observer.disconnect();
    }, [html]);

    return (
        <div
            ref={ref}
            className="text-[#6C6763]/70 text-base sm:text-lg leading-relaxed prose prose-neutral max-w-full w-full overflow-x-hidden md:px-4 sm:px-6 lg:px-0"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
});

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

export default function ProductDetailClient({ initialProduct }: { initialProduct: Product }) {
    const router = useRouter();
    const { t } = useTranslation();
    const { addToCart, setIsCartOpen, totalItems } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState<Product>(initialProduct);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [scrolledPast, setScrolledPast] = useState(false);

    // 结算相关状态
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [showUnpaidModal, setShowUnpaidModal] = useState(false);

    // 全局优惠券状态（所有商品共享）
    const [isCouponClaimed, setIsCouponClaimed] = useState(false);

    // PDP 优惠券选择器状态
    const [pdpCouponId, setPdpCouponId] = useState<string | null>(null);

    // 统一的手动选择标记（子组件 mobile/desktop 共享，避免双实例覆盖问题）
    const isManualSelectionRef = useRef(false);
    const lastQuantityRef = useRef(quantity);

    // 从全局 CouponContext 获取优惠券列表（带缓存）
    const { availableCoupons, isLoading: couponsLoading, refreshCoupons } = useCoupon();

    // 进入商品详情页时强制刷新优惠券（保证数据新鲜，已使用的券立即消失）
    useEffect(() => {
        if (user) {
            refreshCoupons();
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // 从支付页返回时强制刷新（覆盖 router.back / bfcache / 外部支付返回）
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

    const lineItems = useMemo((): CartItem[] => {
        return [{ id: product.id, name: product.name, image: product.image, price: product.price, quantity }];
    }, [product, quantity]);

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

    const processedFullDescription = useMemo(
        () => prepareVideoHtml(product.fullDescription ?? ''),
        [product.fullDescription],
    );

    // 基于选中优惠券动态计算价格（替代硬编码的20%折扣）
    const originalPrice = product.price;

    // 计算选中优惠券的实际折扣
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
    }, [pdpCouponId, lineItems, availableWallet, originalPrice]);

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

    useEffect(() => {
        const handleScroll = () => {
            const next = window.scrollY > 200;
            setScrolledPast((prev) => (prev === next ? prev : next));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 检查用户是否登录，未登录则跳转到登录页
    const checkLoginAndRedirect = () => {
        if (!user) {
            router.push('/login');
            return false;
        }
        return true;
    };

    // 打开优惠券领取弹窗（通过事件通知 GlobalCoupon）
    const handleOpenCouponModal = () => {
        window.dispatchEvent(new Event('open-coupon-modal'));
    };

    const handleAddToCart = () => {
        // 添加购物车时始终使用原价
        addToCart({
            id: product.id,
            name: product.name,
            price: originalPrice,
            image: product.image,
        }, quantity);

        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ ecommerce: null });
        (window as any).dataLayer.push({
            event: "add_to_cart",
            ecommerce: {
                currency: "USD",
                value: originalPrice * quantity,
                items: [{
                    item_id: String(product.id),
                    item_name: product.name,
                    price: originalPrice,
                    quantity: quantity
                }]
            }
        });
    };

    // 直接购买（Buy Now）- 参考购物车结算逻辑
    const handleBuyNow = async () => {
        if (!checkLoginAndRedirect()) return;

        if (!isStripePublishableKeyConfigured()) {
            setCheckoutError('Checkout is not configured.');
            return;
        }

        try {
            const unpaidRes = await getUserOrders({ page: 1, pageSize: 50 });
            if (unpaidRes.data?.status && unpaidRes.data?.list) {
                const pending = (unpaidRes.data.list.data || []).filter((o: any) => o.status === 0);
                if (pending.length > 0) {
                    setShowUnpaidModal(true);
                    return;
                }
            }
        } catch {}

        await executeBuyNow();
    };

    const executeBuyNow = async () => {

        // 使用实际支付价格
        const finalPrice = isCouponClaimed ? discountedPrice : originalPrice;

        // 推送 begin_checkout 事件
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ ecommerce: null });
        (window as any).dataLayer.push({
            event: "begin_checkout",
            ecommerce: {
                currency: "USD",
                value: finalPrice * quantity,
                items: [{
                    item_id: String(product.id),
                    item_name: product.name,
                    price: finalPrice,
                    quantity: quantity
                }]
            }
        });

        try {
            // 校验选中优惠券是否仍可用（防止已用/过期的券 ID 被提交）
            const validCouponId = pdpCouponId && availableCoupons.some((c) => c.id === pdpCouponId)
                ? pdpCouponId
                : null;

            // 动态构建参数：只有选择了有效优惠券才传 user_coupon_id
            const orderParams: Parameters<typeof addOrder>[0] = {
                goods: [{ id: Number(product.id), quantity: quantity }],
                create_channel: ORDER_CREATE_CHANNEL.mall,
                ...(validCouponId ? { user_coupon_id: Number(validCouponId) } : {}),
            };
            
            const res = await addOrder(orderParams);
            const result = res.data;
            const data = result?.data;

            if (!result?.status) {
                setCheckoutError(result?.error_msg || 'Unable to start checkout.');
                setIsCheckingOut(false);
                return;
            }

            const checkoutUrl = data?.url;
            const clientSecret = data?.client_secret;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
                return;
            }
            if (clientSecret) {
                navigateToEmbeddedCheckout(router, clientSecret);
                return;
            }
            setCheckoutError('Unable to start checkout.');
        } catch (error: unknown) {
            const apiError = (error as { response?: { data?: { status?: boolean; error_msg?: string } } })?.response?.data;
            setCheckoutError(apiError?.error_msg || 'Unable to start checkout. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <>
            <main className="pt-24 lg:pt-32 pb-20">
                <div className="container mx-auto px-0 sm:px-6 lg:px-12 xl:px-20">
                    <button
                        onClick={() => router.back()}
                        className="flex px-4 items-center gap-2 text-[#6C6763]/60 hover:text-[#D8CBB8] transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('product.backToProducts')}
                    </button>

                    <div className="md:bg-white md:rounded-3xl md:overflow-hidden md:shadow-sm max-w-full">
                        <div className="grid md:grid-cols-2 gap-0 min-w-0">
                            <div className="relative min-w-0 max-w-full overflow-hidden bg-gradient-to-b from-[#F7F5F1] to-white p-4 sm:p-8 lg:p-16 flex flex-col items-start justify-center min-h-[200px] sm:min-h-[320px] md:min-h-[400px]">
                                {product.badge && (
                                    <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-[#D8CBB8] text-white text-xs font-medium px-3 py-1 rounded-full">
                                        {product.badge}
                                    </div>
                                )}
                                {product.images && product.images.length > 0 ? (
                                    <>
                                        <div className="relative w-full flex items-center justify-center min-h-[200px] sm:min-h-[260px] md:min-h-[320px]">
                                            <img
                                                src={product.images[selectedImage] || product.image}
                                                alt={`${product.name} - premium supplement by LUCKDATE`}
                                                className="max-w-full max-h-[260px] sm:max-h-[320px] md:max-h-[400px] object-contain"
                                            />
                                            {product.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() => setSelectedImage((prev) => (prev - 1 + product.images!.length) % product.images!.length)}
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#333]/60 hover:text-[#333] hover:bg-white/90 transition-all shadow-sm"
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedImage((prev) => (prev + 1) % product.images!.length)}
                                                        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#333]/60 hover:text-[#333] hover:bg-white/90 transition-all shadow-sm"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        {product.images.length > 1 && (
                                            <div className="flex gap-2 mt-4 overflow-x-auto w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-center">
                                                {product.images.map((img, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedImage(i)}
                                                        className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                                            i === selectedImage ? 'border-[#D8CBB8]' : 'border-[#e0e0e0]'
                                                        }`}
                                                    >
                                                        <img src={img} alt={`${product.name} image ${i + 1}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <img
                                        src={product.image}
                                        alt={`${product.name} - main product image by LUCKDATE`}
                                        className="w-full max-w-full h-auto max-h-[min(55vh,360px)] sm:max-h-[420px] lg:max-h-[500px] object-contain"
                                    />
                                )}
                            </div>

                            <div className="p-4 sm:p-8 lg:p-16 min-w-0 max-w-full overflow-hidden">
                                <div className="flex justify-center items-center gap-2 mb-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                    ? 'fill-[#D8CBB8] text-[#D8CBB8]'
                                                    : 'text-[#6C6763]/20'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-[#6C6763]/60">{product.rating}</span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4E554B] mb-4 font-['Montserrat'] break-words">
                                    {product.name}
                                </h1>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-8 border-t border-[#4E554B]/10 w-full max-w-full">
                                    <div className="flex flex-col w-full sm:w-auto flex-shrink-0">
                                        {/* 根据是否选中优惠券显示价格 */}
                                        {!hasDiscount ? (
                                            // 未选优惠券：只显示原价
                                            <div className="text-4xl font-bold text-[#4E554B] font-['Montserrat']">
                                                ${originalPrice.toFixed(2)}
                                            </div>
                                        ) : (
                                            // 已选优惠券：显示原价划线和折扣价
                                            <>
                                                <span className="text-lg text-[#6C6763]/40 line-through font-medium">
                                                    ${originalPrice.toFixed(2)}
                                                </span>
                                                <div className="text-4xl font-bold text-[#D8CBB8] font-['Montserrat']">
                                                    ${discountedPrice.toFixed(2)}
                                                </div>
                                                <span className="inline-flex items-center gap-1 text-sm text-[#D8CBB8] font-semibold mt-1">
                                                    <Gift className="w-3.5 h-3.5" />
                                                    {discountText || `-$${discountAmount.toFixed(2)}`}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-wrap gap-4 w-full min-w-0">
                                        <div className="flex items-center gap-4 bg-[#F7F5F1] rounded-full px-6 h-14 flex-shrink-0 min-w-[120px]">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#D8CBB8] hover:text-white transition-colors shadow-sm"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="font-medium w-8 text-center text-lg">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#D8CBB8] hover:text-white transition-colors shadow-sm"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <Button
                                            onClick={handleAddToCart}
                                            className="flex-1 min-w-[140px] sm:min-w-[160px] md:min-w-[200px] h-14 bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white rounded-full font-medium text-lg px-4 transition-transform hover:scale-105 whitespace-nowrap overflow-hidden sm:flex-1"
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2 shrink-0" />
                                            <span className="truncate">Add to Cart</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {product.description?.trim() ? (
                            <>
                                <h2 className="text-xl px-4 text-[#000] mb-4 font-['Montserrat']">
                                    Product Description
                                </h2>
                                <h2 className="text-xl px-4 text-[#959494] mb-8 font-['Montserrat']">
                                    {product.description}
                                </h2>
                            </>
                        ) : null}

                        <ProductRichContent html={processedFullDescription} />
                    </div>
                </div>
            </main>

            {/* Mobile Sticky Bottom Nav */}
            <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[40] bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-3 transition-all duration-300`}>
                {/* 已登录用户未领券时，Select Coupon 区域显示为 Claim Coupon 入口 */}
                {showCouponClaimEntry && availableWallet.length === 0 ? (
                    <button
                        onClick={handleOpenCouponModal}
                        className="w-full h-11 bg-gradient-to-r from-[#D8CBB8]/10 to-[#D8CBB8]/5 border border-[#D8CBB8]/30 rounded-xl text-[#D8CBB8] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#D8CBB8]/15 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                        <Gift className="w-4 h-4" />
                        Claim Your Exclusive Coupon
                        <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                ) : (
                 <StickyCouponPicker
                     variant="mobile"
                     lineItems={lineItems}
                     availableWallet={availableWallet}
                     pdpCouponId={pdpCouponId}
                     setPdpCouponId={setPdpCouponId}
                     onSelect={handlePdpManualSelect}
                 />
                )}
                 <div className="flex items-center gap-2 w-full">
                     <button
                         onClick={() => setIsCartOpen(true)}
                         className="relative flex items-center justify-center w-12 h-12 bg-[#F7F5F1] rounded-full hover:bg-gray-200 transition-colors shrink-0"
                     >
                         <ShoppingCart className="w-5 h-5 text-[#333]" />
                         {totalItems > 0 && (
                             <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D8CBB8] text-white text-xs font-medium rounded-full flex items-center justify-center">
                                 {totalItems}
                             </span>
                         )}
                     </button>
                     <Button
                         onClick={handleAddToCart}
                         className="flex-1 min-w-0 h-12 bg-[#f6faf6] text-[#D8CBB8] hover:bg-[#e8f5e9] rounded-full font-bold text-sm tracking-wide transition-colors"
                     >
                         Add to Cart
                     </Button>
                     <div className="relative flex-1">
                        {discountAmount > 0 && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border-2 border-[#D8CBB8] text-[#D8CBB8] rounded-full px-3 py-1 shadow-lg flex items-center justify-center gap-1.5 text-[10px] font-bold whitespace-nowrap animate-in fade-in zoom-in duration-300">
                                <Check className="w-3 h-3 text-[#D8CBB8]" strokeWidth={3} />
                                Saved ${discountAmount.toFixed(2)}
                             </div>
                         )}
                         <Button
                             onClick={handleBuyNow}
                             className="w-full h-12 bg-[#D8CBB8] text-white hover:bg-[#C4B5A0] rounded-full font-bold text-sm tracking-wide shadow-lg shadow-[#D8CBB8]/20 transition-all hover:scale-105"
                         >
                             Buy Now
                         </Button>
                     </div>
                 </div>
             </div>

             {/* PC Sticky Bottom Bar */}
             <div className={`hidden lg:flex fixed bottom-0 left-0 right-0 z-[40] bg-white/80 backdrop-blur-md border-t border-gray-100 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] items-center transition-all duration-500 transform ${scrolledPast ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
                 <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
                     <div className="flex min-w-0 flex-1 items-center gap-4">
                         <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-[#F7F5F1] rounded-lg shrink-0" />
                         <div className="flex min-w-0 flex-col">
                             <span className="font-bold text-[#4E554B] line-clamp-1 max-w-[280px] xl:max-w-[360px]">{product.name}</span>
                             <div className="flex items-center gap-2">
                               <span className="text-[#D8CBB8] font-bold">
                                   ${discountedPrice.toFixed(2)}
                               </span>
                               {discountAmount > 0 && (
                                    <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                                )}
                            </div>
                         </div>
                     </div>
                     <div className="flex shrink-0 items-center justify-end gap-3 xl:gap-5">
                         <div className="hidden md:block w-[min(100%,240px)] xl:w-64">
                            {/* 已登录用户未领券时，Select Coupon 显示为 Claim Coupon 入口 */}
                            {showCouponClaimEntry && availableWallet.length === 0 ? (
                                <button
                                    onClick={handleOpenCouponModal}
                                    className="w-full h-12 bg-gradient-to-r from-[#D8CBB8]/10 to-[#D8CBB8]/5 border border-[#D8CBB8]/30 rounded-xl text-[#D8CBB8] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#D8CBB8]/15 transition-colors animate-in fade-in duration-300"
                                >
                                    <Gift className="w-4 h-4" />
                                    <span>Claim Your Coupon</span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
                                </button>
                            ) : (
                             <StickyCouponPicker
                                 variant="desktop"
                                 lineItems={lineItems}
                                 availableWallet={availableWallet}
                                 pdpCouponId={pdpCouponId}
                                 setPdpCouponId={setPdpCouponId}
                                 onSelect={handlePdpManualSelect}
                             />
                            )}
                         </div>
                         <div className="flex items-center gap-4 bg-[#F7F5F1] rounded-full px-4 h-12 shrink-0">
                             <button
                                 type="button"
                                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                 className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#D8CBB8] hover:text-white transition-colors shadow-sm"
                             >
                                 <Minus className="w-3 h-3" />
                             </button>
                             <span className="font-medium w-6 text-center">{quantity}</span>
                             <button
                                 type="button"
                                 onClick={() => setQuantity(quantity + 1)}
                                 className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#D8CBB8] hover:text-white transition-colors shadow-sm"
                             >
                                 <Plus className="w-3 h-3" />
                             </button>
                         </div>
                         <Button
                             type="button"
                             onClick={handleAddToCart}
                             className="h-12 bg-[#D8CBB8]/10 text-[#D8CBB8] hover:bg-[#D8CBB8]/20 px-6 xl:px-8 rounded-full font-bold transition-all shrink-0"
                         >
                             Add to Cart
                         </Button>
                         <div className="relative shrink-0">
                           {discountAmount > 0 && (
                               <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border-2 border-[#D8CBB8] text-[#D8CBB8] rounded-full px-4 py-1.5 shadow-lg flex items-center justify-center gap-2 text-sm font-bold whitespace-nowrap animate-in fade-in zoom-in duration-300">
                                   <Check className="w-4 h-4 text-[#D8CBB8]" strokeWidth={3} />
                                   Saved ${discountAmount.toFixed(2)}
                                </div>
                            )}
                            <Button
                                type="button"
                                onClick={handleBuyNow}
                                className="h-12 bg-[#D8CBB8] text-white hover:bg-[#C4B5A0] px-8 xl:px-10 rounded-full font-bold shadow-lg shadow-[#D8CBB8]/20 transition-all hover:scale-105"
                            >
                                Buy Now
                            </Button>
                        </div>
                     </div>
                 </div>
             </div>

            <CartDrawer />
            <GlobalCoupon />
            <UnpaidOrderModal
              open={showUnpaidModal}
              onClose={() => setShowUnpaidModal(false)}
              onProceed={() => {
                setShowUnpaidModal(false);
                void executeBuyNow();
              }}
            />
        </>
    );
}
