'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    getPopupCoupon,
    claimCoupon,
    popupCouponClaimWithEmail,
    getCouponClaimStatus,
    type PopupCouponData,
    GLOBAL_COUPON_API,
    type LandingCouponApiConfig,
} from '@/lib/api/coupon';
import { checkEmailApi } from '@/lib/api/auth';

const PENDING_LOGIN_CHECK_KEY = 'pending_login_check';
const USER_DISMISSED_POPUP_KEY = 'user_dismissed_popup';
const COUPON_SHOWN_KEY = 'shown';
const PENDING_COUPON_TOAST = 'pending_coupon_toast';

export interface UseCouponLogicReturn {
    isCouponModalOpen: boolean;
    isCouponClaimed: boolean;
    claimed: boolean;
    email: string;
    error: string;
    isLoading: boolean;
    showToast: boolean;
    toastMsg: string;
    popupCouponData: PopupCouponData | null;
    discountPercent: number;
    couponRuleText: string;
    openModal: () => void;
    closeModal: () => void;
    setEmail: (email: string) => void;
    handleClaim: () => void;
}

export function useCouponLogic(sourcePath?: string, apiConfig?: LandingCouponApiConfig, options?: { immediate?: boolean }): UseCouponLogicReturn {
    const config = apiConfig || GLOBAL_COUPON_API;
    const prefix = config.storageKeyPrefix;
    const immediate = options?.immediate || false;

    const COUPON_CLAIMED_KEY = `${prefix}_claimed`;
    const COUPON_DISMISSED_KEY = `${prefix}_dismissed`;

    const { user, register: registerAuth, sendVerificationCode, updateUser, loading: authLoading } = useAuth();
    const router = useRouter();

    const [isCouponClaimed, setIsCouponClaimed] = useState(false);
    const [claimedCouponId, setClaimedCouponId] = useState<number | null>(null);
    const [isLegacyClaimed, setIsLegacyClaimed] = useState(false);
    const [isCouponDismissed, setIsCouponDismissed] = useState(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [claimed, setClaimed] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [popupCouponData, setPopupCouponData] = useState<PopupCouponData | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const discountPercent =
        popupCouponData?.coupon_type === 2
            ? Math.round((1 - popupCouponData.discount_rate / 10) * 100)
            : popupCouponData?.coupon_type === 3
              ? Math.round(popupCouponData.no_threshold_amount / 100 * 20)
              : 20;
    const couponRuleText = popupCouponData?.rule_text || `${discountPercent}% OFF`;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedClaimedId = sessionStorage.getItem(COUPON_CLAIMED_KEY);
        const storedDismissed = sessionStorage.getItem(COUPON_DISMISSED_KEY);

        if (storedClaimedId && storedClaimedId !== 'true' && storedClaimedId !== '') {
            const id = parseInt(storedClaimedId, 10);
            if (!isNaN(id)) {
                setClaimedCouponId(id);
                setIsCouponClaimed(true);
            }
        } else if (storedClaimedId === 'true') {
            setIsLegacyClaimed(true);
            setIsCouponClaimed(true);
        }
        if (storedDismissed === 'true') {
            setIsCouponDismissed(true);
        }

        const pendingLoginCheck = sessionStorage.getItem(`${prefix}_${PENDING_LOGIN_CHECK_KEY}`);
        if (pendingLoginCheck === 'true' && user) {
            sessionStorage.removeItem(`${prefix}_${PENDING_LOGIN_CHECK_KEY}`);
            checkAndShowForLoggedInUser();
        }

        const handleOpenCouponModal = () => {
            if (isCouponClaimed) return;
            setClaimed(false);
            setEmail('');
            setError('');
            setIsLoading(false);
            setIsCouponModalOpen(true);
        };
        window.addEventListener('open-coupon-modal', handleOpenCouponModal);

        fetchPopupCouponData();

        return () => {
            window.removeEventListener('open-coupon-modal', handleOpenCouponModal);
        };
    }, []);

    const fetchPopupCouponData = async () => {
        try {
            const res = await config.getPopupCoupon();
            if (res.data?.status && res.data.data) {
                setPopupCouponData(res.data.data);
            }
        } catch (error) {
            console.warn('Failed to fetch popup coupon:', error);
        }
    };

    // 监听用户登录状态变化：用户退出登录时重置所有优惠券状态
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 用户从已登录变为未登录（logout）→ 重置所有状态
        if (!user && (isCouponClaimed || claimed || isCouponModalOpen || isCouponDismissed)) {
            console.log(`[Coupon] 检测到用户退出登录，重置 ${prefix} 优惠券状态`);
            setIsCouponClaimed(false);
            setClaimedCouponId(null);
            setIsLegacyClaimed(false);
            setIsCouponDismissed(false);
            setIsCouponModalOpen(false);
            setShowToast(false);
            setToastMsg('');
            setClaimed(false);
            setEmail('');
            setError('');

            // 清除定时器
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (typeof window === 'undefined' || !popupCouponData) return;

        // 换券检测：后台换了新优惠券 → 重置所有状态让用户重新领取
        if (popupCouponData.coupon_id && claimedCouponId !== null && popupCouponData.coupon_id !== claimedCouponId) {
            console.log(`[Coupon] 后台优惠券已更换: 旧=${claimedCouponId} → 新=${popupCouponData.coupon_id}, 重置领取状态`);
            setIsCouponClaimed(false);
            setClaimed(false);
            setClaimedCouponId(popupCouponData.coupon_id);
            setIsCouponDismissed(false);
            sessionStorage.removeItem(COUPON_CLAIMED_KEY);
            sessionStorage.removeItem(COUPON_DISMISSED_KEY);
            sessionStorage.removeItem(`${prefix}_${USER_DISMISSED_POPUP_KEY}`);
            sessionStorage.removeItem(`${prefix}_${COUPON_SHOWN_KEY}`);
            if (user) {
                setTimeout(() => checkAndShowForLoggedInUser(), 0);
            }
            return;
        }

        // 旧格式修复：sessionStorage 存的是旧版 "true"（无 coupon_id）→ 清除并重新通过 API 检查
        if (isLegacyClaimed) {
            console.log(`[Coupon] 检测到旧格式标记(无coupon_id)，清除并重新验证, 当前券ID=${popupCouponData.coupon_id}`);
            setIsLegacyClaimed(false);
            setIsCouponClaimed(false);
            setIsCouponDismissed(false);
            sessionStorage.removeItem(COUPON_CLAIMED_KEY);
            sessionStorage.removeItem(COUPON_DISMISSED_KEY);
            sessionStorage.removeItem(`${prefix}_${USER_DISMISSED_POPUP_KEY}`);
            sessionStorage.removeItem(`${prefix}_${COUPON_SHOWN_KEY}`);
            if (user) {
                setTimeout(() => checkAndShowForLoggedInUser(), 0);
            }
            return;
        }

        const pendingLoginCheck = sessionStorage.getItem(`${prefix}_${PENDING_LOGIN_CHECK_KEY}`);
        if (pendingLoginCheck === 'true' && user) {
            sessionStorage.removeItem(`${prefix}_${PENDING_LOGIN_CHECK_KEY}`);
            checkAndShowForLoggedInUser();
            return;
        }

        if (user) {
            if (isCouponDismissed) return;

            // immediate 模式：dismissed 不跨会话保持，刷新即重置
            const userDismissedPopup = !immediate && sessionStorage.getItem(`${prefix}_${USER_DISMISSED_POPUP_KEY}`) === 'true';

            if (userDismissedPopup) {
                return;
            }

            if (!isCouponClaimed) {
                sessionStorage.removeItem(`${prefix}_${COUPON_SHOWN_KEY}`);
                checkAndShowForLoggedInUser();
            }
            return;
        }

        // 未登录用户：已领取或当前会话已关闭过则不弹
        if (isCouponClaimed) return;
        if (isCouponDismissed) return;  // 内存 dismissed 始终阻止当前会话（刷新后重置）

        // 5秒后弹窗
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            const currentDismissed = sessionStorage.getItem(COUPON_DISMISSED_KEY);
            const currentClaimed = sessionStorage.getItem(COUPON_CLAIMED_KEY);

            if (!currentClaimed && currentDismissed !== 'true') {
                setIsCouponModalOpen(true);
            }
        }, 15000);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [user, isCouponClaimed, isCouponDismissed, popupCouponData]);

    const checkAndShowForLoggedInUser = async () => {
        try {
            const res = await config.getClaimStatus();
            if (res.data?.status && res.data.data) {
                const { claimed: couponClaimed, coupon_id } = res.data.data;

                if (!couponClaimed) {
                    setIsCouponModalOpen(true);
                    sessionStorage.setItem(`${prefix}_${COUPON_SHOWN_KEY}`, 'true');
                } else {
                    setIsCouponClaimed(true);
                    if (coupon_id) {
                        setClaimedCouponId(coupon_id);
                        sessionStorage.setItem(COUPON_CLAIMED_KEY, String(coupon_id));
                    } else {
                        sessionStorage.setItem(COUPON_CLAIMED_KEY, 'true');
                    }
                }
            }
        } catch (error) {
            console.error('Error checking coupon status:', error);
        }
    };

    const handleEmailSubmit = async () => {
        if (claimed || isLoading) return;

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const checkRes = await checkEmailApi({ email });

            if (checkRes.data?.status && checkRes.data.data?.is_registered) {
                setIsCouponModalOpen(false);
                sessionStorage.setItem(PENDING_COUPON_TOAST, 'This email is already registered. Please sign in to claim your coupon.');
                sessionStorage.setItem(`${prefix}_${PENDING_LOGIN_CHECK_KEY}`, 'true');
                router.push(`/login?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(sourcePath || '')}`);
                return;
            }

            const res = await config.claimWithEmail({ email });

            if (res.data?.status && res.data.data) {
                const result = res.data.data;

                if (result.token) {
                    localStorage.setItem('token', result.token);
                    updateUser({
                        id: result.id,
                        email: result.email,
                        name: result.name || email.split('@')[0],
                        avatar: result.avatar,
                        created_at: result.created_at,
                    });
                }

                const newCouponId = popupCouponData?.coupon_id || result.coupon_id;
                if (newCouponId) {
                    setClaimedCouponId(newCouponId);
                }

                if (result.claimed && result.user_coupon_id > 0) {
                    setClaimed(true);

                    setTimeout(() => {
                        setIsCouponModalOpen(false);
                        sessionStorage.setItem(COUPON_CLAIMED_KEY, String(newCouponId || 'true'));
                        setIsCouponClaimed(true);
                        setIsCouponDismissed(false);
                        window.dispatchEvent(new Event('coupon-claimed'));
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 6000);
                    }, 1200);
                } else {
                    setClaimed(true);

                    setTimeout(() => {
                        setIsCouponModalOpen(false);
                        sessionStorage.setItem(COUPON_CLAIMED_KEY, String(newCouponId || 'true'));
                        setIsCouponClaimed(true);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 6000);
                    }, 1200);
                }
            } else {
                throw new Error(res.data?.error_msg || 'Failed to claim coupon with email');
            }
        } catch (err: any) {
            console.error('popup-coupon-claim failed:', err);

            const errorMsg = err?.response?.data?.error_msg || err?.message;

            if (errorMsg === 'user.email_exists' || errorMsg?.includes('already')) {
                setIsCouponModalOpen(false);
                sessionStorage.setItem(PENDING_COUPON_TOAST, 'This email is already registered. Please sign in to claim your coupon.');
                sessionStorage.setItem(`${prefix}_${PENDING_LOGIN_CHECK_KEY}`, 'true');
                router.push(`/login?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(sourcePath || '')}`);
            } else {
                setError(errorMsg || 'Something went wrong. Please try again.');
                setClaimed(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDirectClaim = async () => {
        if (claimed || isLoading || authLoading) return;

        setIsLoading(true);
        setError('');

        try {
            const claimRes = await config.claimCoupon();

            if (claimRes.data?.status) {
                const newCouponId = popupCouponData?.coupon_id;
                if (newCouponId) {
                    setClaimedCouponId(newCouponId);
                }
                setClaimed(true);

                setTimeout(() => {
                    setIsCouponModalOpen(false);
                    sessionStorage.setItem(COUPON_CLAIMED_KEY, String(newCouponId || 'true'));
                    setIsCouponClaimed(true);
                    window.dispatchEvent(new Event('coupon-claimed'));
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 6000);
                }, 1200);
            } else {
                setError(claimRes.data?.error_msg || 'Failed to claim coupon.');
            }
        } catch (err: any) {
            console.error('Claim failed:', err);
            const errData = err?.response?.data as { error_msg?: string; error_code?: string } | undefined;
            const errMsg = String(errData?.error_msg || '');
            const errCode = String(errData?.error_code || '');
            const alreadyClaimed =
                errMsg === 'coupon.already_claimed' ||
                errCode === 'coupon.already_claimed' ||
                /already\s*claimed|已领取|已領取/i.test(errMsg);

            if (alreadyClaimed) {
                const newCouponId = popupCouponData?.coupon_id;
                if (newCouponId) {
                    setClaimedCouponId(newCouponId);
                }
                setClaimed(true);
                setTimeout(() => {
                    setIsCouponModalOpen(false);
                    sessionStorage.setItem(COUPON_CLAIMED_KEY, String(newCouponId || 'true'));
                    setIsCouponClaimed(true);
                    window.dispatchEvent(new Event('coupon-claimed'));
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 6000);
                }, 600);
            } else {
                setError(errMsg || err?.response?.data?.error_msg || 'Something went wrong.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaim = useCallback(async () => {
        if (user) {
            await handleDirectClaim();
        } else {
            await handleEmailSubmit();
        }
    }, [user, isLoading, claimed, authLoading, email, popupCouponData]);

    const openModal = useCallback(() => {
        setClaimed(false);
        setEmail('');
        setError('');
        setIsLoading(false);
        setIsCouponModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsCouponModalOpen(false);

        if (user && isCouponClaimed) {
            sessionStorage.setItem(COUPON_DISMISSED_KEY, 'true');
            setIsCouponDismissed(true);
        }

        if (user) {
            setIsCouponDismissed(true);
            // immediate 模式：dismissed 不持久化，刷新后重弹
            if (!immediate) {
                sessionStorage.setItem(`${prefix}_${USER_DISMISSED_POPUP_KEY}`, 'true');
            }
        }
    }, [user, isCouponClaimed]);

    return {
        isCouponModalOpen,
        isCouponClaimed,
        claimed,
        email,
        error,
        isLoading,
        showToast,
        toastMsg,
        popupCouponData,
        discountPercent: discountPercent,
        couponRuleText: couponRuleText,
        openModal,
        closeModal,
        setEmail: (val: string) => {
            setEmail(val);
            setError('');
        },
        handleClaim,
    };
}
