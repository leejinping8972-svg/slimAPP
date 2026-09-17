'use client';

import { Plus, Minus, ShoppingBag, Trash2, Ticket, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCoupon } from '@/context/CouponContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { addOrder, getUserOrders } from '@/lib/api/order';
import { ORDER_CREATE_CHANNEL, resolveAdSourceByQuerySource } from '@/lib/order-tracking';
import type { UserCoupon } from '@/lib/coupons/types';
import { evaluateCouponForCart, computeDiscountAmount, pickBestCouponId } from '@/lib/coupons/engine';
import {
  isStripePublishableKeyConfigured,
  navigateToEmbeddedCheckout,
} from '@/lib/stripe/embeddedCheckoutNavigate';
import UnpaidOrderModal from '@/components/UnpaidOrderModal';

// 购物车优惠券选择器组件
function CartCouponPicker({
  items,
  availableWallet,
  selectedCouponId,
  setSelectedCouponId,
  setDiscountAmount,
}: {
  items: import('@/context/CartContext').CartItem[];
  availableWallet: UserCoupon[];
  selectedCouponId: string | null;
  setSelectedCouponId: (id: string | null) => void;
  setDiscountAmount: (amount: number) => void;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  // 标记用户是否手动选择过优惠券（防止自动选择逻辑覆盖）
  const isManualSelection = useRef(false);
  // 记录上次自动选择的商品ID列表，用于检测实质性变化
  const lastAutoSelectItemsRef = useRef<string>('');
  // 记录上次商品ID列表，用于区分增删商品 vs 数量变化
  const lastIdsRef = useRef<string>('');
  // 使用 ref 保存最新的 items，避免闭包陷阱
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // 点击外部关闭
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // 自动选择最佳优惠券（智能判断是否需要重置）
  useEffect(() => {
    // 生成当前购物车的指纹
    const currentItemsFingerprint = items.map(i => `${i.id}:${i.quantity}`).join(',');
    const currentIdsFingerprint = items.map(i => i.id).sort().join(',');

    // 检测：商品列表变化（增删商品）vs 仅数量变化
    const hasItemListChanged = currentIdsFingerprint !== lastIdsRef.current;
    const hasItemsChanged = currentItemsFingerprint !== lastAutoSelectItemsRef.current;

    if (items.length === 0 || availableWallet.length === 0) {
      setSelectedCouponId(null);
      setDiscountAmount(0);
      isManualSelection.current = false;
      lastAutoSelectItemsRef.current = '';
      lastIdsRef.current = '';
      return;
    }

    // 只有增删商品时才重置手动选择标记；数量变化不重置
    if (hasItemListChanged) {
      isManualSelection.current = false;
      lastIdsRef.current = currentIdsFingerprint;
    }
    lastAutoSelectItemsRef.current = currentItemsFingerprint;

    // 如果用户手动选择过且只是数量变化 → 只校验当前券是否仍有效
    if (isManualSelection.current && !hasItemListChanged && hasItemsChanged) {
      if (selectedCouponId) {
        const cur = availableWallet.find((c) => c.id === selectedCouponId);
        if (cur) {
          const ev = evaluateCouponForCart(cur, items);
          if (!ev.ok) {
            isManualSelection.current = false; // 当前券失效了，允许自动切换
          } else {
            setDiscountAmount(computeDiscountAmount(cur, items));
            return; // 当前券仍有效，保持不变
          }
        } else {
          isManualSelection.current = false; // 当前券已不在钱包中
        }
      }
    }

    // 如果用户手动选择过且购物车没变 → 校验选中券是否仍在可用列表中
    if (isManualSelection.current && !hasItemListChanged && !hasItemsChanged && selectedCouponId) {
      const stillAvailable = availableWallet.some((c) => c.id === selectedCouponId);
      if (!stillAvailable) {
        isManualSelection.current = false;
      } else {
        return;
      }
    }

    const best = pickBestCouponId(items, availableWallet);
    const bestCoupon = best ? availableWallet.find((c) => c.id === best) : null;
    if (bestCoupon) {
      setSelectedCouponId(best);
      setDiscountAmount(computeDiscountAmount(bestCoupon, items));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, availableWallet]);

  // Early return：无可用优惠券时不渲染（必须在所有 hooks 之后）
  if (availableWallet.length === 0) return null;

  const couponReason = (c: UserCoupon) => {
    const ev = evaluateCouponForCart(c, items);
    if (ev.ok) return '';
    switch (ev.reason) {
      case 'expired':
        return t('coupon.reason.expired', { defaultValue: 'Expired' });
      case 'not_yet_valid':
        return t('coupon.reason.notYetValid', { defaultValue: 'Not yet valid' });
      case 'min_spend':
        return t('coupon.reason.minSpend', { min: ev.minSpend?.toFixed?.(2) ?? String(c.minSpend), defaultValue: `Min spend $${c.minSpend}` });
      case 'product_scope':
        return t('coupon.reason.productScope', { defaultValue: 'Not applicable' });
      case 'used':
        return t('coupon.reason.used', { defaultValue: 'Already used' });
      case 'invalid':
        return t('coupon.reason.invalid', { defaultValue: 'Invalid' });
      default:
        return '';
    }
  };

  const selected = availableWallet.find((c) => c.id === selectedCouponId);
  const selEv = selected ? evaluateCouponForCart(selected, items) : null;
  const selSave = selected && selEv?.ok ? computeDiscountAmount(selected, items) : 0;

  const summaryText =
    selected && selEv?.ok
      ? `${selected.title} · -$${selSave.toFixed(2)}`
      : t('cart.couponTitle', { defaultValue: 'Select Coupon' });

  const handleSelect = (c: UserCoupon, ok: boolean) => {
    if (ok) {
      isManualSelection.current = true;  // 标记为手动选择
      setSelectedCouponId(c.id);
      // 使用 ref 获取最新 items，避免闭包中的过期值
      setDiscountAmount(computeDiscountAmount(c, itemsRef.current));
      setIsOpen(false);
    }
  };

  return (
    <div ref={detailsRef} className="relative z-[45] w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 text-xs font-semibold px-3 py-2.5 rounded-xl bg-[#F7F5F1] text-[#4E554B] border border-[#4E554B]/6"
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <Ticket className="h-4 w-4 shrink-0 text-[#D8CBB8]" />
          <span className="truncate">{summaryText}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#333]/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 max-h-[min(40vh,220px)] overflow-y-auto rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
          <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
            {t('cart.couponBestHint', { defaultValue: 'Available Coupons' })}
          </p>
          <div className="space-y-1">
            {availableWallet.map((c) => {
              const ev = evaluateCouponForCart(c, items);
              const ok = ev.ok;
              const reason = couponReason(c);
              const save = ok ? computeDiscountAmount(c, items) : 0;
              return (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-start gap-2 rounded-lg p-2 transition-colors ${
                    ok ? 'hover:bg-[#D8CBB8]/8' : 'cursor-not-allowed opacity-55'
                  } ${selectedCouponId === c.id && ok ? 'bg-[#D8CBB8]/12' : ''}`}
                  onClick={(e) => {
                    // 阻止事件冒泡到 document，避免触发 handleClickOutside
                    if (ok) {
                      e.stopPropagation();
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="cart-coupon"
                    className="mt-1 accent-[#D8CBB8]"
                    checked={selectedCouponId === c.id}
                    disabled={!ok}
                    onChange={() => handleSelect(c, ok)}
                    onClick={(e) => {
                      // 阻止事件冒泡（radio 的 click 事件也会冒泡）
                      if (ok) {
                        e.stopPropagation();
                      }
                    }}
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

const CartDrawerInner = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalItems, totalPrice, selectedCouponId, setSelectedCouponId, discountAmount, setDiscountAmount, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  // 从全局 CouponContext 获取优惠券列表（带缓存）
  const { availableCoupons, fetchCouponsIfNeeded } = useCoupon();

  // 打开购物车时按需加载最新优惠券（带30秒防抖）
  useEffect(() => {
    if (isCartOpen && user) {
      fetchCouponsIfNeeded();
    }
  }, [isCartOpen, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // 直接使用全局的 availableCoupons（已经过滤为可用状态）
  const availableWallet = availableCoupons;

  const getErrorMsg = (result: { status?: boolean; error_msg?: string }): string | undefined => {
    if (!result?.status && result?.error_msg) {
      return result.error_msg;
    }
    return undefined;
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!user) {
      setIsCartOpen(false);
      router.push('/login');
      return;
    }

    if (!isStripePublishableKeyConfigured()) {
      setCheckoutError(t('cart.checkoutNotConfigured', { defaultValue: 'Checkout is not configured.' }));
      return;
    }

    try {
      const unpaidRes = await getUserOrders({ page: 1, pageSize: 50 });
      if (unpaidRes.data?.status && unpaidRes.data?.list) {
        const pending = (unpaidRes.data.list.data || []).filter((o: any) => o.status === 0);
        if (pending.length > 0) {
          setIsCartOpen(false);
          setShowUnpaidModal(true);
          return;
        }
      }
    } catch {}

    await executeCheckout();
  };

  const executeCheckout = async () => {

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null });
    (window as any).dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: "USD",
        value: totalPrice,
        items: items.map((item) => ({
          item_id: String(item.id),
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      }
    });

    try {
      const goodsData = items.map((item) => ({ id: Number(item.id), quantity: item.quantity }));

      // 校验选中优惠券是否仍可用（防止已用/过期的券 ID 被提交）
      const validCouponId = selectedCouponId && availableWallet.some((c) => c.id === selectedCouponId)
        ? selectedCouponId
        : null;

      // 动态构建参数：只有选择了有效优惠券才传 user_coupon_id
      const orderParams: Parameters<typeof addOrder>[0] = {
        goods: goodsData,
        create_channel: ORDER_CREATE_CHANNEL.mall,
        ad_source: resolveAdSourceByQuerySource(searchParams.get('source')),
        ...(validCouponId ? { user_coupon_id: Number(validCouponId) } : {}),
      };
      
      const res = await addOrder(orderParams);
      const result = res.data;
      const data = result?.data;

      if (!result?.status) {
        setCheckoutError(getErrorMsg(result) ?? t('cart.checkoutError', { defaultValue: 'Unable to start checkout.' }));
        return;
      }
      const checkoutUrl = data?.url;
      const clientSecret = data?.client_secret;

      if (checkoutUrl) {
        clearCart();
        window.location.href = checkoutUrl;
        return;
      }
      if (clientSecret) {
        clearCart();
        setIsCartOpen(false);
        navigateToEmbeddedCheckout(router, clientSecret);
        return;
      }
      setCheckoutError(t('cart.checkoutError', { defaultValue: 'Unable to start checkout.' }));
    } catch (error: unknown) {
        // silent
      const apiError = (error as { response?: { data?: { status?: boolean; error_msg?: string } } })?.response?.data;
      setCheckoutError(
        getErrorMsg(apiError ?? {}) ?? t('cart.checkoutError', { defaultValue: 'Unable to start checkout. Please try again.' })
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-white flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-[#4E554B] font-['Montserrat']">
              <ShoppingBag className="w-5 h-5 text-[#D8CBB8]" />
              {t('cart.title', { count: totalItems })}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex-1 flex flex-col overflow-hidden">
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-16 h-16 text-[#6C6763]/20 mb-4" />
                <p className="text-[#6C6763]/60 mb-2">{t('cart.empty')}</p>
                <p className="text-sm text-[#6C6763]/40">{t('cart.emptyDesc')}</p>
                <Button
                  variant="outline"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 border-[#4E554B]/20 text-[#4E554B] px-8 py-2 rounded-full"
                >
                  {t('cart.startShopping')}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-[#F7F5F1] rounded-xl p-4 relative group"
                    >
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-medium text-[#4E554B] text-sm leading-tight mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between mt-auto">
                          <p className="text-[#D8CBB8] font-bold text-lg">
                            ${item.price.toFixed(2)}
                          </p>

                          <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#F7F5F1] transition-colors text-[#6C6763]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#F7F5F1] transition-colors text-[#6C6763]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-2 right-2 text-[#6C6763]/20 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t px-6 border-[#4E554B]/10 pt-6 mt-4 space-y-4">
                  {/* 优惠券选择器 */}
                  <CartCouponPicker
                    items={items}
                    availableWallet={availableWallet}
                    selectedCouponId={selectedCouponId}
                    setSelectedCouponId={setSelectedCouponId}
                    setDiscountAmount={setDiscountAmount}
                  />

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6C6763]/70">{t('cart.subtotal')}</span>
                      <span className="font-medium text-[#4E554B]">${totalPrice.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#6C6763]/70">{t('cart.discount', { defaultValue: 'Discount' })}</span>
                        <span className="font-medium text-[#D8CBB8]">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#6C6763]/70">{t('cart.shipping')}</span>
                      <span className="font-medium text-[#4E554B]">{t('cart.shippingCalculated')}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t border-[#4E554B]/5 pt-2 mt-2">
                      <span className="text-[#4E554B]">{t('cart.total')}</span>
                      <span className="text-[#4E554B]">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pb-4">
                    {checkoutError && (
                      <p className="text-sm text-red-600 text-center">{checkoutError}</p>
                    )}
                    <Button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white py-6 rounded-full font-medium text-lg shadow-lg shadow-[#D8CBB8]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isCheckingOut ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('cart.processing')}
                        </div>
                      ) : (
                        t('cart.checkout')
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full text-[#6C6763]/60 hover:text-[#fff]"
                    >
                      {t('cart.continueShopping')}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <UnpaidOrderModal
        open={showUnpaidModal}
        onClose={() => setShowUnpaidModal(false)}
        onProceed={() => {
          setShowUnpaidModal(false);
          void executeCheckout();
        }}
      />
    </>
  );
};

export default function CartDrawer() {
  return (
    <Suspense fallback={null}>
      <CartDrawerInner />
    </Suspense>
  );
}
