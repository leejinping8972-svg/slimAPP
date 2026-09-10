'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserCoupons } from '@/lib/api/coupon';
import type { UserCouponData as BackendUserCoupon } from '@/lib/api/coupon';
import type { UserCoupon } from '@/lib/coupons/types';

/**
 * 将后端优惠券数据转换为前端 UserCoupon 格式
 */
function convertBackendCouponToUserCoupon(c: BackendUserCoupon): UserCoupon {
    const statusMap: Record<number, UserCoupon['status']> = {
        1: 'inactive',
        2: 'available',
        3: 'used',
        4: 'expired',
        0: 'invalid',
    };

    const couponType = c.coupon_type;

    let type: UserCoupon['type'];
    let amountOff: number | undefined;
    let discountFold: number | undefined;
    let maxDiscount: number | null = null;
    let faceValue: number | undefined;

    if (couponType === 1) {
        type = 'fixed_off';
        amountOff = c.reduce_amount / 100;
    } else if (couponType === 2) {
        type = 'percent_off';
        discountFold = c.discount_rate;
        maxDiscount = c.discount_max_amount > 0 ? c.discount_max_amount / 100 : null;
    } else {
        type = 'no_threshold_fixed';
        faceValue = c.no_threshold_amount / 100;
    }

    const scopeType = c.scope_type;
    let productScope: UserCoupon['productScope'] = 'all';
    if (scopeType === 2 || scopeType === 3) {
        productScope = 'specific';
    }

    let validFrom = '';
    let validUntil = '';
    if (c.valid_start_at > 0) {
        validFrom = new Date(c.valid_start_at * 1000).toISOString().split('T')[0];
    }
    if (c.valid_end_at > 0) {
        validUntil = new Date(c.valid_end_at * 1000).toISOString().split('T')[0];
    }

    const minSpend = c.threshold_amount / 100;

    return {
        id: String(c.id),
        code: `LUCKDATE-${c.coupon_id}`,
        title: c.name,
        type,
        amountOff,
        discountFold,
        maxDiscount,
        faceValue,
        minSpend,
        productScope,
        productIds: Array.isArray(c.scope_goods_ids) ? c.scope_goods_ids.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0) : [],
        validFrom,
        validUntil,
        status: statusMap[c.status] || 'invalid',
        receivedAt: c.created_at,
        validDays: c.valid_days,
    };
}

interface CouponContextType {
    /** 所有用户优惠券（包含各种状态） */
    coupons: UserCoupon[];
    /** 仅可用的优惠券（filtered） */
    availableCoupons: UserCoupon[];
    /** 是否正在加载 */
    isLoading: boolean;
    /**
     * 按需加载优惠券（带30秒短缓存防抖）
     * 适用于：进入商品详情页、打开购物车等场景
     */
    fetchCouponsIfNeeded: () => Promise<void>;
    /**
     * 强制刷新优惠券列表（忽略缓存）
     * 适用于：领取新券后、支付返回后等需要最新数据的场景
     */
    refreshCoupons: () => Promise<void>;
    /** 从缓存中删除指定优惠券（已使用后调用） */
    removeCoupon: (id: string) => void;
    /** 清空所有优惠券（登出时调用） */
    clearCoupons: () => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

// 短时间防抖缓存：30秒内不重复请求（防止快速切换页面时多次请求）
const SHORT_CACHE_MS = 30 * 1000;
// 长时间缓存：5分钟（用于已加载数据的展示）
const LONG_CACHE_EXPIRY_MS = 5 * 60 * 1000;

export function CouponProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [coupons, setCoupons] = useState<UserCoupon[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 缓存控制
    const lastFetchTime = useRef<number>(0);
    const fetchPromise = useRef<Promise<void> | null>(null);

    // 从后端获取优惠券列表（内部核心方法）
    const fetchCouponsInternal = useCallback(async (forceRefresh = false) => {
        if (!user) {
            setCoupons([]);
            return;
        }

        // 检查缓存是否有效（非强制刷新时）
        const now = Date.now();
        if (!forceRefresh && now - lastFetchTime.current < LONG_CACHE_EXPIRY_MS && coupons.length > 0) {
            return; // 使用长缓存
        }

        // 防止重复请求（如果已有进行中的请求，复用它）
        if (fetchPromise.current && !forceRefresh) {
            await fetchPromise.current;
            return;
        }

        setIsLoading(true);

        const promise = (async () => {
            try {
                const res = await getUserCoupons({ status: 2 });
                const couponList = (res.data?.list?.data || res.data?.data || []) as BackendUserCoupon[];

                if (Array.isArray(couponList)) {
                    const converted = couponList.map(convertBackendCouponToUserCoupon);
                    setCoupons(converted);
                    lastFetchTime.current = Date.now();
                } else {
                    setCoupons([]);
                }
            } catch (error) {
                setCoupons([]);
            } finally {
                setIsLoading(false);
                fetchPromise.current = null;
            }
        })();

        fetchPromise.current = promise;
        await promise;
    }, [user]); // ✅ 只依赖 user，不依赖 coupons.length

    /**
     * 按需加载优惠券（带30秒短缓存防抖）
     * 适用于：进入商品详情页、打开购物车等场景
     * 特点：30秒内多次调用只会触发一次实际请求
     */
    const fetchCouponsIfNeeded = useCallback(async () => {
        if (!user) return;

        const now = Date.now();
        // 短时间防抖：30秒内不重复请求
        if (now - lastFetchTime.current < SHORT_CACHE_MS && coupons.length > 0) {
            return;
        }

        await fetchCouponsInternal(false);
    }, [user, coupons.length, fetchCouponsInternal]);

    /**
     * 强制刷新优惠券列表（忽略所有缓存）
     * 适用于：领取新券后、支付返回后等需要最新数据的场景
     */
    const refreshCoupons = useCallback(async () => {
        await fetchCouponsInternal(true);
    }, [fetchCouponsInternal]);

    // 删除指定优惠券（本地状态更新）
    const removeCoupon = useCallback((id: string) => {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
    }, []);

    // 清空所有优惠券
    const clearCoupons = useCallback(() => {
        setCoupons([]);
        lastFetchTime.current = 0;
        fetchPromise.current = null;
    }, []);

    // 过滤出可用的优惠券
    const availableCoupons = coupons.filter((c) => c.status === 'available');

    // 监听 GlobalCoupon 的 coupon-claimed 事件，自动刷新（领券后需要最新数据）
    useEffect(() => {
        const handleCouponClaimed = () => {
            refreshCoupons();
        };

        window.addEventListener('coupon-claimed', handleCouponClaimed);
        return () => window.removeEventListener('coupon-claimed', handleCouponClaimed);
    }, [refreshCoupons]);

    // 监听订单变更事件（取消→返还优惠券 / 支付→优惠券标记已用）
    useEffect(() => {
        const handleOrderChanged = () => {
            console.log('[CouponContext] 检测到订单变更，强制刷新优惠券列表');
            refreshCoupons();
        };

        window.addEventListener('unpaid-order-changed', handleOrderChanged);
        return () => window.removeEventListener('unpaid-order-changed', handleOrderChanged);
    }, [refreshCoupons]);

    // 页面从支付页返回时自动刷新优惠券（支付成功→优惠券状态变已用 / 取消→无变化但需同步）
    useEffect(() => {
        if (!user) return;
        const handler = () => refreshCoupons();
        document.addEventListener('visibilitychange', handler);
        window.addEventListener('focus', handler);
        return () => {
            document.removeEventListener('visibilitychange', handler);
            window.removeEventListener('focus', handler);
        };
    }, [user, refreshCoupons]);

    return (
        <CouponContext.Provider
            value={{
                coupons,
                availableCoupons,
                isLoading,
                fetchCouponsIfNeeded,
                refreshCoupons,
                removeCoupon,
                clearCoupons,
            }}
        >
            {children}
        </CouponContext.Provider>
    );
}

export function useCoupon() {
    const context = useContext(CouponContext);
    if (!context) {
        throw new Error('useCoupon must be used within a CouponProvider');
    }
    return context;
}
