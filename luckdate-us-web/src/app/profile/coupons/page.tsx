'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { Ticket, Tag, Clock, ShoppingBag, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserCoupons } from '@/lib/api/coupon';
import type { UserCouponData as BackendUserCoupon } from '@/lib/api/coupon';
import type { UserCoupon } from '@/lib/coupons/types';
import Link from 'next/link';

// 后端状态枚举值：
// 1 = INACTIVE (未激活)
// 2 = AVAILABLE (可用)
// 3 = USED (已使用)
// 4 = EXPIRED (已过期)
type CouponTab = 'available' | 'used' | 'expired';

const CACHE_TTL_MS = 5 * 60 * 1000;

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
        amountOff = c.reduce_amount / 100; // 分 → 元
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

    // 有效期处理
    let validFrom = '';
    let validUntil = '';
    if (c.valid_start_at > 0) {
        validFrom = new Date(c.valid_start_at * 1000).toISOString().split('T')[0];
    }
    if (c.valid_end_at > 0) {
        validUntil = new Date(c.valid_end_at * 1000).toISOString().split('T')[0];
    }

    const minSpend = c.threshold_amount / 100; // 分 → 元

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
        productIds: [],
        validFrom,
        validUntil,
        // 相对天数有效期（valid_type=2）：领取时间 + 有效天数
        receivedAt: c.created_at, // Unix 时间戳（秒）
        validDays: c.valid_days || 0, // 有效天数
        status: statusMap[c.status] || 'invalid',
    };
}

function formatCouponRule(c: UserCoupon): string {
    const min = c.minSpend ?? 0;
    if (c.type === 'fixed_off') {
        const amount = c.amountOff ?? 0;
        if (min <= 0) return `$${amount} off`;
        return `$${amount} off on orders over $${min}`;
    }
    if (c.type === 'no_threshold_fixed') {
        return `$${c.faceValue ?? 0} off`;
    }
    const fold = c.discountFold ?? 10;
    const off = Math.round((10 - Math.min(10, Math.max(0, fold))) * 10);
    if (min <= 0) return `${off}% off`;
    return `${off}% off on orders over $${min}`;
}

function getDiscountDisplay(c: UserCoupon): string {
    if (c.type === 'fixed_off') return `$${c.amountOff ?? 0}`;
    if (c.type === 'no_threshold_fixed') return `$${c.faceValue ?? 0}`;
    const fold = c.discountFold ?? 10;
    const off = Math.round((10 - Math.min(10, Math.max(0, fold))) * 10);
    return `${off}%`;
}

function getStatusBadge(c: UserCoupon, tab: CouponTab) {
    const isExpired = tab === 'expired';
    const isUsed = c.status === 'used';

    if (isExpired && c.status === 'invalid') {
        return (
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">
                <AlertCircle className="w-3 h-3" />
                Invalid
            </span>
        );
    }
    if (isUsed) {
        return (
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase">
                <CheckCircle className="w-3 h-3" />
                Used
            </span>
        );
    }
    if (c.status === 'inactive') {
        return (
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                <Clock className="w-3 h-3" />
                Inactive
            </span>
        );
    }

    return null;
}

function CouponCard({ coupon, tab }: { coupon: UserCoupon; tab: CouponTab }) {
    const isExpired = tab === 'expired';
    const isUsed = coupon.status === 'used';

    return (
        <div className={`group relative overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-md ${
            isExpired ? 'border-gray-200 opacity-70' : 'border-gray-100'
        }`}>
            <div className="flex sm:flex-row flex-col">
                {/* 左侧金额区域 */}
                <div className={`sm:w-[120px] w-full flex-shrink-0 flex flex-row sm:flex-col items-center justify-center p-3 sm:p-4 ${
                    isExpired
                        ? 'bg-gray-100 text-gray-500'
                        : isUsed
                            ? 'bg-gray-50 text-gray-400'
                            : 'bg-gradient-to-b from-[#D8CBB8]/10 to-[#D8CBB8]/5 text-[#D8CBB8]'
                }`}>
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-0 sm:mb-1 mr-2 sm:mr-0">Discount</span>
                    <span className={`text-2xl sm:text-3xl font-bold font-['Montserrat'] ${isExpired || isUsed ? '' : ''}`}>
                        {getDiscountDisplay(coupon)}
                    </span>
                </div>

                {/* 右侧详情区域 */}
                <div className="flex-1 p-3 sm:p-4 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                            <h4 className={`font-bold text-sm sm:text-base leading-tight line-clamp-1 ${isExpired ? 'text-gray-600' : 'text-[#4E554B]'}`}>
                                {coupon.title}
                            </h4>
                            <p className="font-mono text-xs text-gray-400 mt-0.5">{coupon.code}</p>
                        </div>

                        {getStatusBadge(coupon, tab)}
                    </div>

                    <div className="space-y-1.5 mt-2 sm:mt-3">
                        <div className="flex items-center gap-2 text-xs">
                            <ShoppingBag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className={isExpired ? 'text-gray-500' : 'text-gray-700'}>{formatCouponRule(coupon)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className={isExpired ? 'text-gray-500' : 'text-gray-700'}>
                                {coupon.validFrom || '-'} — {coupon.validUntil || '-'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfileCouponsPage() {
    const { user } = useAuth();

    // 状态管理
    const [activeTab, setActiveTab] = useState<CouponTab>('available');
    const [allCoupons, setAllCoupons] = useState<UserCoupon[]>([]); // 当前tab的优惠券列表
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCoupons, setTotalCoupons] = useState(0);

    // 各状态数量统计（用于Tab显示）
    const [statusCounts, setStatusCounts] = useState<{ available: number; used: number; expired: number }>({
        available: 0,
        used: 0,
        expired: 0,
    });

    // 缓存数据结构
    interface CouponCache {
        data: UserCoupon[];
        total: number;
        currentPage: number;
        totalPages: number;
        timestamp: number; // 缓存时间戳
    }

    // 各Tab的缓存存储
    const [couponCache, setCouponCache] = useState<Record<CouponTab | 'counts', CouponCache>>({} as Record<CouponTab | 'counts', CouponCache>);

    // 检查缓存是否有效
    const isCacheValid = useCallback((cacheKey: CouponTab | 'counts'): boolean => {
        const cache = couponCache[cacheKey];
        if (!cache) return false;
        return Date.now() - cache.timestamp < CACHE_TTL_MS;
    }, [couponCache]);

    // 后端状态码映射到前端Tab（允许 undefined 表示不传 status 参数）
    const STATUS_MAP: Record<CouponTab | 'all', number | undefined> = {
        all: undefined,       // 不传status参数，获取所有
        available: 2,       // AVAILABLE
        used: 3,            // USED
        expired: 4,         // EXPIRED
    };

    // 获取各状态优惠券数量统计（带缓存）
    const fetchStatusCounts = useCallback(async (forceRefresh = false) => {
        if (!user) return;

        // 检查缓存
        if (!forceRefresh && isCacheValid('counts')) {
            const cache = couponCache['counts'];
            setStatusCounts({
                available: cache.total || 0,
                used: cache.total || 0,
                expired: cache.total || 0,
            });
            return;
        }

        try {
            // 并行请求所有状态的计数（使用 pageSize=1 只需要 total 字段）
            const [availableRes, usedRes, expiredRes] = await Promise.all([
                getUserCoupons({ status: 2, page: 1, pageSize: 1 }),
                getUserCoupons({ status: 3, page: 1, pageSize: 1 }),
                getUserCoupons({ status: 4, page: 1, pageSize: 1 }),
            ]);

            const counts = {
                available: availableRes.data?.list?.total || 0,
                used: usedRes.data?.list?.total || 0,
                expired: expiredRes.data?.list?.total || 0,
            };
            setStatusCounts(counts);

            // 更新缓存
            setCouponCache(prev => ({
                ...prev,
                counts: { data: [], total: counts.available + counts.used + counts.expired, currentPage: 1, totalPages: 1, timestamp: Date.now() }
            }));
        } catch (error) {
        }
    }, [user, isCacheValid, couponCache]);

    // 从后端获取优惠券列表（带缓存+无感刷新）
    const fetchCoupons = useCallback(async (status?: number, page: number = 1, silentRefresh = false) => {
        if (!user) {
            setAllCoupons([]);
            return;
        }

        // 确定当前tab的cache key
        const cacheKey: CouponTab = status === 2 ? 'available' : status === 3 ? 'used' : 'expired';

        // 检查缓存（非强制刷新时）
        if (!silentRefresh && isCacheValid(cacheKey)) {
            const cache = couponCache[cacheKey];
            if (cache) {
                setAllCoupons(cache.data);
                setCurrentPage(cache.currentPage);
                setTotalPages(cache.totalPages);
                setTotalCoupons(cache.total);
                return; // 使用缓存，不显示loading
            }
        }

        // 需要请求时才显示loading（无感刷新时不显示）
        if (!silentRefresh) setLoading(true);

        try {
            const params: { status?: number; page?: number; pageSize?: number } = { page, pageSize: 20 };
            if (status !== undefined) {
                params.status = status;
            }

            const res = await getUserCoupons(params);

            if (res.data?.status && res.data?.list) {
                const listData = res.data.list;
                const couponList = (Array.isArray(listData.data) ? listData.data : []) as BackendUserCoupon[];
                const converted = couponList
                    .map(convertBackendCouponToUserCoupon)
                    .filter((coupon) => {
                        if (status === 2) return coupon.status === 'available';
                        if (status === 3) return coupon.status === 'used';
                        if (status === 4) return coupon.status === 'expired' || coupon.status === 'invalid';
                        return true;
                    });

                const total = listData.total || converted.length;

                setAllCoupons(converted);
                setCurrentPage(listData.current_page || 1);
                setTotalPages(listData.total_pages || 1);
                setTotalCoupons(total);
                setStatusCounts(prev => ({ ...prev, [cacheKey]: total }));

                // 更新缓存
                setCouponCache(prev => ({
                    ...prev,
                    [cacheKey]: {
                        data: converted,
                        total,
                        currentPage: listData.current_page || 1,
                        totalPages: listData.total_pages || 1,
                        timestamp: Date.now(),
                    }
                }));
            } else {
                setAllCoupons([]);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalCoupons(0);
            }
        } catch (error) {
            setAllCoupons([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalCoupons(0);
        } finally {
            if (!silentRefresh) setLoading(false);
        }
    }, [user, isCacheValid, couponCache]);

    // 初始化加载：先从缓存恢复，再后台刷新
    useEffect(() => {
        if (!user) {
            setAllCoupons([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalCoupons(0);
            setStatusCounts({ available: 0, used: 0, expired: 0 });
            return;
        }

        const status = STATUS_MAP[activeTab];
        const cacheKey: CouponTab = activeTab;

        if (isCacheValid(cacheKey)) {
            const cache = couponCache[cacheKey];
            if (cache) {
                setAllCoupons(cache.data);
                setCurrentPage(cache.currentPage);
                setTotalPages(cache.totalPages);
                setTotalCoupons(cache.total);
            }
        } else {
            setAllCoupons([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalCoupons(0);
        }

        fetchStatusCounts(true);
        fetchCoupons(status, 1, true);
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // Tab切换时：有缓存先显示缓存，否则清空旧页签数据并重新加载
    useEffect(() => {
        if (!user) return;

        const status = STATUS_MAP[activeTab];
        const cacheKey: CouponTab = activeTab;

        if (isCacheValid(cacheKey)) {
            const cache = couponCache[cacheKey];
            if (cache) {
                setAllCoupons(cache.data);
                setCurrentPage(cache.currentPage);
                setTotalPages(cache.totalPages);
                setTotalCoupons(cache.total);
                fetchCoupons(status, 1, true);
                return;
            }
        }

        setAllCoupons([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalCoupons(0);
        fetchCoupons(status, 1);
    }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

    // 使用预加载的统计数据
    const counts = statusCounts;

    // 当前激活的列表
    const activeList = useMemo(() => {
        switch (activeTab) {
            case 'available':
                return allCoupons.filter((c) => c.status === 'available');
            case 'used':
                return allCoupons.filter((c) => c.status === 'used');
            case 'expired':
                return allCoupons.filter((c) => c.status === 'expired' || c.status === 'invalid');
            default:
                return allCoupons;
        }
    }, [allCoupons, activeTab]);

    // Tab配置
    const tabs: { key: CouponTab; label: string; count: number }[] = [
        { key: 'available', label: 'Available', count: counts.available },
        { key: 'used', label: 'Used', count: counts.used },
        { key: 'expired', label: 'Expired', count: counts.expired },
    ];

    // 分页控制
    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            fetchCoupons(STATUS_MAP[activeTab], newPage);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            fetchCoupons(STATUS_MAP[activeTab], newPage);
        }
    };

    return (
        <div className="min-h-screen pb-6">
            {/* 标题 */}
            <div className="mb-4 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-[#4E554B] flex items-center gap-2 sm:gap-3">
                    <Ticket className="w-5 sm:w-6 h-5 sm:h-6 text-[#D8CBB8]" />
                    My Coupons
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 ml-7 sm:ml-9">Manage your discount coupons</p>
                {totalCoupons > 0 && (
                    <span className="ml-auto text-xs text-gray-400">
                        Total: {totalCoupons} coupon{totalCoupons !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Tab 切换 */}
            <div className="flex flex-wrap items-center gap-1 mb-4 sm:mb-8 p-1 bg-gray-100 rounded-xl w-full">
                {tabs.map(({ key, label, count }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => {
                            setActiveTab(key);
                            setCurrentPage(1); // 重置分页
                        }}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                            activeTab === key
                                ? 'bg-white text-[#4E554B] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span className="flex items-center justify-center gap-1 sm:gap-1.5">
                            {label}
                            <span className={`text-[10px] sm:text-xs ${activeTab === key ? 'text-[#D8CBB8]' : 'text-gray-400'}`}>
                                ({count})
                            </span>
                        </span>
                    </button>
                ))}
            </div>

            {/* 内容区域 */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : activeList.length === 0 ? (
                <div className="bg-gray-50/80 border border-dashed border-gray-200 rounded-2xl py-12 sm:py-20 text-center">
                    <Tag className="w-8 sm:w-12 h-8 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <p className="font-medium text-gray-600 mb-1 text-sm sm:text-base">No coupons yet</p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-4">Your coupons will appear here</p>
                    {!user && (
                        <>
                            <p className="text-xs text-gray-500 mb-2">Please sign in to view your coupons</p>
                            <Link
                                href="/login"
                                className="inline-block px-4 py-2 bg-[#D8CBB8] text-white text-sm font-semibold rounded-lg hover:bg-[#C4B5A0] transition-colors"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {activeList.map((c) => (
                            <CouponCard key={c.id} coupon={c} tab={activeTab} />
                        ))}
                    </div>

                    {/* 分页器 */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <span className="text-sm text-gray-600 font-medium min-w-[60px] text-center">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
