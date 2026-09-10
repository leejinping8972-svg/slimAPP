'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Gift, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    claimCoupon,
    popupCouponClaimWithEmail,
    getPopupCoupon,
    getCouponClaimStatus,
    type PopupCouponData,
} from '@/lib/api/coupon';
import { checkEmailApi } from '@/lib/api/auth';

export function GlobalCoupon() {
    const { user, register: registerAuth, sendVerificationCode, updateUser, loading: authLoading } = useAuth();
    const router = useRouter();

    const { isCartOpen } = useCart();

    // 全局优惠券状态（所有商品共享）
    const [isCouponClaimed, setIsCouponClaimed] = useState(false);
    const [claimedCouponId, setClaimedCouponId] = useState<number | null>(null);
    const [isLegacyClaimed, setIsLegacyClaimed] = useState(false);
    const [isCouponDismissed, setIsCouponDismissed] = useState(false);

    // States
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [showStickyOnPC, setShowStickyOnPC] = useState(false);

    // Form states
    const [claimed, setClaimed] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 从后端获取的弹窗优惠券信息
    const [popupCouponData, setPopupCouponData] = useState<PopupCouponData | null>(null);
    // 是否已完成领券状态检查（用于控制浮动按钮的显示时机）
    const [hasCheckedClaimStatus, setHasCheckedClaimStatus] = useState(false);

    // 优惠券折扣比例（默认20%，如果后端有数据则使用后端的）
    // 统一公式：discount_rate 就是折数，百分比 OFF = (1 - 折数/10) × 100
    const DISCOUNT_PERCENT =
        popupCouponData?.coupon_type === 2
            ? Math.round((1 - popupCouponData.discount_rate / 10) * 100)
            : popupCouponData?.coupon_type === 3
              ? Math.round(popupCouponData.no_threshold_amount / 100 * 20)
              : 20;
    const COUPON_RULE_TEXT = popupCouponData?.rule_text || `${DISCOUNT_PERCENT}% OFF`;
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Storage keys - 全局统一
    // 未登录用户：每次刷新5秒后弹出（无冷却机制）
    const COUPON_CLAIMED_KEY = 'global_coupon_claimed';
    const COUPON_DISMISSED_KEY = 'global_coupon_dismissed';
    // 已登录用户使用 sessionStorage（浏览器关闭后失效，下次访问可再弹）
    const COUPON_USER_CLAIMED_KEY = 'user_coupon_claimed';
    const COUPON_USER_DISMISSED_KEY = 'user_coupon_dismissed';
    // 已登录用户弹窗标记（sessionStorage，页面刷新后失效）
    const COUPON_SHOWN_KEY = 'global_coupon_shown';
    // 老用户待登录检查标记（用于老用户识别后跳转登录的场景）
    const PENDING_LOGIN_CHECK_KEY = 'global_coupon_pending_login_check';
    // 已登录用户关闭弹窗标记（用于在商品详情页显示领券入口）
    const USER_DISMISSED_POPUP_KEY = 'global_coupon_user_dismissed_popup';
    // 已登录用户关闭弹窗时对应的优惠券ID（用于判断 dismissed 状态是否属于当前优惠券）
    const DISMISSED_COUPON_ID_KEY = 'global_coupon_dismissed_coupon_id';

    // 初始化：检查全局优惠券状态（使用 sessionStorage）
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedClaimed = sessionStorage.getItem(COUPON_CLAIMED_KEY);
        const storedDismissed = sessionStorage.getItem(COUPON_DISMISSED_KEY);

        if (storedClaimed && storedClaimed !== 'true' && storedClaimed !== '') {
            const id = parseInt(storedClaimed, 10);
            if (!isNaN(id)) {
                setClaimedCouponId(id);
                setIsCouponClaimed(true);
            }
        } else if (storedClaimed === 'true') {
            setIsLegacyClaimed(true);
            setIsCouponClaimed(true);
        }
        if (storedDismissed === 'true') {
            setIsCouponDismissed(true);
        }

        // 检查是否有待登录检查的标记（老用户跳转登录后回来）
        const pendingLoginCheck = sessionStorage.getItem(PENDING_LOGIN_CHECK_KEY);
        if (pendingLoginCheck === 'true' && user) {
            sessionStorage.removeItem(PENDING_LOGIN_CHECK_KEY);
            checkAndShowForLoggedInUser();
        }

        // 监听外部触发的"打开优惠券弹窗"事件（商品详情页等）
        const handleOpenCouponModal = () => {
            if (isCouponClaimed) return;
            setClaimed(false);
            setEmail('');
            setError('');
            setIsLoading(false);
            setIsCouponModalOpen(true);
        };
        window.addEventListener('open-coupon-modal', handleOpenCouponModal);

        // 从后端获取弹窗优惠券信息
        fetchPopupCouponData();

        return () => {
            window.removeEventListener('open-coupon-modal', handleOpenCouponModal);
        };
    }, []);

    // 获取后端弹窗优惠券信息
    const fetchPopupCouponData = async () => {
        try {
            const res = await getPopupCoupon();
            if (res.data?.status && res.data.data) {
                setPopupCouponData(res.data.data);
            }
        } catch (error) {
            // silent
        }
    };

    // 自动弹出弹窗逻辑 - 核心业务逻辑
    useEffect(() => {
        if (typeof window === 'undefined' || !popupCouponData) return;

        // 防重入：已登录用户本轮已检查过领券状态，不再重复请求
        if (user && hasCheckedClaimStatus) {
            console.log('[GlobalCoupon] 已登录用户本轮已检查过，跳过重复请求');
            return;
        }

        // 换券检测：后台换了新优惠券 → 重置所有状态让用户重新领取
        if (popupCouponData.coupon_id && claimedCouponId !== null && popupCouponData.coupon_id !== claimedCouponId) {
            console.log(`[GlobalCoupon] 后台优惠券已更换: 旧=${claimedCouponId} → 新=${popupCouponData.coupon_id}, 重置领取状态`);
            setIsCouponClaimed(false);
            setClaimed(false);
            setClaimedCouponId(popupCouponData.coupon_id);
            setIsCouponDismissed(false);
            setHasCheckedClaimStatus(false);  // 换券后允许重新检查
            sessionStorage.removeItem(COUPON_CLAIMED_KEY);
            sessionStorage.removeItem(COUPON_DISMISSED_KEY);
            sessionStorage.removeItem(USER_DISMISSED_POPUP_KEY);
            sessionStorage.removeItem(DISMISSED_COUPON_ID_KEY);
            sessionStorage.removeItem(COUPON_SHOWN_KEY);
            if (user) {
                setTimeout(() => checkAndShowForLoggedInUser(), 0);
            }
            return;
        }

        // 旧格式修复：sessionStorage 存的是旧版 "true"（无 coupon_id）→ 清除并重新通过 API 检查
        if (isLegacyClaimed) {
            console.log(`[GlobalCoupon] 检测到旧格式标记(无coupon_id)，清除并重新验证, 当前券ID=${popupCouponData.coupon_id}`);
            setIsLegacyClaimed(false);
            setIsCouponClaimed(false);
            setIsCouponDismissed(false);
            setHasCheckedClaimStatus(false);  // 允许重新检查
            sessionStorage.removeItem(COUPON_CLAIMED_KEY);
            sessionStorage.removeItem(COUPON_DISMISSED_KEY);
            sessionStorage.removeItem(USER_DISMISSED_POPUP_KEY);
            sessionStorage.removeItem(DISMISSED_COUPON_ID_KEY);
            sessionStorage.removeItem(COUPON_SHOWN_KEY);
            if (user) {
                setTimeout(() => checkAndShowForLoggedInUser(), 0);
            }
            return;
        }

        // ✅ 场景1：老用户刚完成登录（优先级最高）
        const pendingLoginCheck = sessionStorage.getItem(PENDING_LOGIN_CHECK_KEY);
        if (pendingLoginCheck === 'true' && user) {
            sessionStorage.removeItem(PENDING_LOGIN_CHECK_KEY);
            checkAndShowForLoggedInUser();
            return;
        }

        // ✅ 场景2：已登录用户需要独立检查（不受"是否弹过窗"限制）
        if (user) {
            // ✅ 关键判断：已登录用户是否主动关闭过弹窗
            const userDismissedPopup = sessionStorage.getItem(USER_DISMISSED_POPUP_KEY) === 'true';

            if (userDismissedPopup) {
                // 检查 dismissed 状态是否属于当前优惠券
                const dismissedCouponId = sessionStorage.getItem(DISMISSED_COUPON_ID_KEY);
                const currentCouponId = popupCouponData?.coupon_id;

                // 只有确认是同一张券时才跳过，否则（换了券或无法确认）都重新检查
                if (dismissedCouponId && currentCouponId && String(currentCouponId) === dismissedCouponId) {
                    // 同一张券，用户已关闭 → 不再自动弹出
                    console.log('已登录用户已关闭过当前优惠券弹窗，等待手动触发');
                    return;
                }

                // 优惠券已更换或 dismissed coupon ID 未知 → 旧的 dismissed 状态无效，清除并重新检查
                console.log(`[GlobalCoupon] 优惠券可能已更换(dismissed=${dismissedCouponId}, current=${currentCouponId})，清除旧的关闭标记，重新检查领券状态`);
                sessionStorage.removeItem(USER_DISMISSED_POPUP_KEY);
                sessionStorage.removeItem(DISMISSED_COUPON_ID_KEY);
                // 继续往下执行 checkAndShowForLoggedInUser
            }

            // 未关闭过 → 正常检查领券状态并可能弹窗
            if (!isCouponClaimed) {
                // 清除旧的 shown 标记（避免干扰）
                sessionStorage.removeItem(COUPON_SHOWN_KEY);

                // 不等5秒，立即检查（用户体验更好）
                checkAndShowForLoggedInUser();
            }
            return; // 已登录用户处理完毕，不执行后面的未登录逻辑
        }

        // ✅ 场景3：以下都是未登录用户的逻辑

        // 已领券或已关闭弹窗，不再弹出
        if (isCouponClaimed || isCouponDismissed) return;

        // 未登录用户：每次刷新页面5秒后弹出（无冷却机制）

        // 清除之前的定时器
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // 5秒后弹出
        timerRef.current = setTimeout(() => {
            const currentDismissed = sessionStorage.getItem(COUPON_DISMISSED_KEY);
            const currentClaimed = sessionStorage.getItem(COUPON_CLAIMED_KEY);

            if (currentClaimed !== 'true' && currentDismissed !== 'true') {
                // 未登录用户：直接弹出输入邮箱的弹窗
                setIsCouponModalOpen(true);
            }
        }, 15000);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [user, isCouponClaimed, isCouponDismissed, popupCouponData, hasCheckedClaimStatus]);

    // 已登录用户：检查领取状态并决定是否弹窗
    const checkAndShowForLoggedInUser = async () => {
        if (hasCheckedClaimStatus) return;
        setHasCheckedClaimStatus(true);

        try {
            const res = await getCouponClaimStatus();
            if (res.data?.status && res.data.data) {
                const { claimed, coupon_id } = res.data.data;

                if (!claimed) {
                    // 未领券 → 弹出领取弹窗
                    setIsCouponModalOpen(true);
                    sessionStorage.setItem(COUPON_SHOWN_KEY, 'true');
                } else {
                    // 已领券 → 标记为已领券，不弹窗
                    setIsCouponClaimed(true);
                    if (coupon_id) {
                        setClaimedCouponId(coupon_id);
                        sessionStorage.setItem(COUPON_CLAIMED_KEY, String(coupon_id));
                    } else {
                        sessionStorage.setItem(COUPON_CLAIMED_KEY, 'true');
                    }
                }
            } else {
                // 接口失败时默认不弹窗（避免打扰用户）
            }
        } catch (error) {
            // silent
        } finally {
            // 无论成功失败，都标记为已检查完成
            setHasCheckedClaimStatus(true);
        }
    };

    // 滚动监听：控制PC端浮动按钮显示
    useEffect(() => {
        const handleScroll = () => {
            setShowStickyOnPC(true);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 判断是否应该显示浮动优惠券入口
    const shouldShowFloatingButton = () => {
        if (isCouponClaimed) return false;
        if (isCartOpen) return false;
        return true;
    };

    // 核心：处理未登录用户的邮箱提交（使用一站式接口）
    const handleEmailSubmit = async () => {
        if (claimed || isLoading) return;

        // 校验邮箱格式
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // ✅ 第一步：先检查邮箱是否已注册
            const checkRes = await checkEmailApi({ email });

            if (checkRes.data?.status && checkRes.data.data?.is_registered) {
                setIsCouponModalOpen(false);
                sessionStorage.setItem('pending_coupon_toast', 'This email is already registered. Please sign in to claim your coupon.');
                sessionStorage.setItem(PENDING_LOGIN_CHECK_KEY, 'true');
                router.push(`/login?email=${encodeURIComponent(email)}&from=coupon`);
                return;
            }

            // ✅ 第二步：未注册用户 → 调用一站式接口自动注册/登录 + 领券优惠券
            const res = await popupCouponClaimWithEmail({ email });

            if (res.data?.status && res.data.data) {
                const result = res.data.data;

                // 1. 保存 JWT Token（后端已自动设置，前端也需要更新 AuthContext）
                if (result.token) {
                    // 保存 token 到 localStorage
                    localStorage.setItem('token', result.token);

                    // ✅ 关键：调用 AuthContext.updateUser() 更新 React 状态！
                    // 这会让整个应用感知到用户已登录
                    updateUser({
                        id: result.id,
                        email: result.email,
                        name: result.name || email.split('@')[0],
                        avatar: result.avatar,
                        created_at: result.created_at,
                    });
                }

                // 2. 判断是否领取成功
                if (result.claimed && result.user_coupon_id > 0) {
                    // 领取成功 → 显示成功动画
                    // console.log('🎉 优惠券领取成功:', result.coupon_name);
                    const newCouponId = popupCouponData?.coupon_id || result.coupon_id;
                    if (newCouponId) setClaimedCouponId(newCouponId);
                    setClaimed(true);

                    setTimeout(() => {
                        setIsCouponModalOpen(false);

                        // 保存全局优惠券状态到 sessionStorage
                        sessionStorage.setItem(COUPON_CLAIMED_KEY, String(newCouponId || 'true'));
                        setIsCouponClaimed(true);
                        setIsCouponDismissed(false);

                        // 触发自定义事件，通知其他组件优惠券状态已更新
                        window.dispatchEvent(new Event('coupon-claimed'));

                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 6000);
                    }, 1200);
                } else {
                    // 已领取过（claimed=false, user_coupon_id=0）
                    // 仍然算"操作成功"（用户已注册+登录），只是券已领过
                    // console.log('⚠️ 用户已注册但该券已领取过');
                    const newCouponId2 = popupCouponData?.coupon_id;
                    if (newCouponId2) setClaimedCouponId(newCouponId2);
                    setClaimed(true); // 也显示成功状态

                    setTimeout(() => {
                        setIsCouponModalOpen(false);
                        sessionStorage.setItem(COUPON_CLAIMED_KEY, String(newCouponId2 || 'true')); // 标记为已处理
                        setIsCouponClaimed(true);

                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 6000);
                    }, 1200);
                }
            } else {
                // 接口返回失败
                throw new Error(res.data?.error_msg || 'Failed to claim coupon with email');
            }
        } catch (err: any) {
            // silent
            
            // 区分错误类型
            const errorMsg = err?.response?.data?.error_msg || err?.message;
            
            if (errorMsg === 'user.email_exists' || errorMsg?.includes('already')) {
                setIsCouponModalOpen(false);
                sessionStorage.setItem('pending_coupon_toast', 'This email is already registered. Please sign in to claim your coupon.');
                sessionStorage.setItem(PENDING_LOGIN_CHECK_KEY, 'true');
                router.push(`/login?email=${encodeURIComponent(email)}&from=coupon`);
            } else {
                // 其他错误
                setError(errorMsg || 'Something went wrong. Please try again.');
                setClaimed(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 处理已登录用户的直接领取
    const handleDirectClaim = async () => {
        if (claimed || isLoading || authLoading) return;

        setIsLoading(true);
        setError('');

        try {
            const claimRes = await claimCoupon();

            if (claimRes.data?.status) {
                // console.log('✅ 已登录用户领券成功:', claimRes.data.data);
                const newCouponId3 = popupCouponData?.coupon_id;
                if (newCouponId3) setClaimedCouponId(newCouponId3);
                setClaimed(true);

                setTimeout(() => {
                    setIsCouponModalOpen(false);

                    sessionStorage.setItem(COUPON_CLAIMED_KEY, String(newCouponId3 || 'true'));
                    setIsCouponClaimed(true);

                    window.dispatchEvent(new Event('coupon-claimed'));

                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 6000);
                }, 1200);
            } else {
                setError(claimRes.data?.error_msg || 'Failed to claim coupon.');
            }
        } catch (err: any) {
            // silent
            const errData = err?.response?.data as { error_msg?: string; error_code?: string } | undefined;
            const errMsg = String(errData?.error_msg || '');
            const errCode = String(errData?.error_code || '');
            const alreadyClaimed =
                errMsg === 'coupon.already_claimed' ||
                errCode === 'coupon.already_claimed' ||
                /already\s*claimed|已领取|已領取/i.test(errMsg);

            if (alreadyClaimed) {
                const newCouponId4 = popupCouponData?.coupon_id;
                if (newCouponId4) setClaimedCouponId(newCouponId4);
                setClaimed(true);
                setTimeout(() => {
                    setIsCouponModalOpen(false);
                    sessionStorage.setItem(COUPON_CLAIMED_KEY, String(newCouponId4 || 'true'));
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

    // 统一的处理函数（根据登录状态分发）
    const handleClaim = async () => {
        if (user) {
            // 已登录用户：直接领取
            await handleDirectClaim();
        } else {
            // 未登录用户：先校验邮箱
            await handleEmailSubmit();
        }
    };

    const handleCloseModal = () => {
        setIsCouponModalOpen(false);

        // ✅ 新逻辑：
        // - 未登录用户或未领券用户关闭 → 不设置 global_coupon_dismissed，下次刷新5s后仍会弹出
        // - 只有已登录且已领取过优惠券的用户关闭时才设置 dismissed
        if (user && isCouponClaimed) {
            sessionStorage.setItem(COUPON_DISMISSED_KEY, 'true');
            setIsCouponDismissed(true);
        }

        if (user) {
            sessionStorage.setItem(USER_DISMISSED_POPUP_KEY, 'true');
            // 记录关闭弹窗时对应的优惠券ID，用于后续判断 dismissed 状态是否仍有效
            if (popupCouponData?.coupon_id) {
                sessionStorage.setItem(DISMISSED_COUPON_ID_KEY, String(popupCouponData.coupon_id));
            }
        }
    };

    // 点击浮动入口按钮
    const handleFloatingButtonClick = () => {
        setClaimed(false);
        setEmail('');
        setError('');
        setIsLoading(false);
        setIsCouponModalOpen(true);
    };

    return (
        <>
            {/* 优惠券领取弹窗 */}
            {isCouponModalOpen && !isCartOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full relative shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#F7F5F1] transition-colors z-20"
                        >
                            <X className="w-6 h-6 text-[#6C6763]" />
                        </button>

                        {!claimed ? (
                            <div className="text-center relative">
                                <div className="w-24 h-24 bg-[#D8CBB8]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Gift className="w-12 h-12 text-[#D8CBB8]" />
                                </div>

                                <h2 className="text-3xl font-bold text-[#4E554B] mb-3 font-['Montserrat']">
                                    Special Gift!
                                </h2>
                                <p className="text-[#6C6763]/60 mb-8 text-lg">
                                    Claim your exclusive new customer discount.
                                </p>

                                <div className="bg-[#D8CBB8]/5 border-2 border-dashed border-[#D8CBB8]/30 rounded-3xl p-8 mb-6 group cursor-pointer hover:bg-[#D8CBB8]/10 transition-colors">
                                    <span className="block text-5xl font-black text-[#D8CBB8] font-['Montserrat'] mb-2 tracking-tight">
                                        {COUPON_RULE_TEXT}
                                    </span>
                                    {popupCouponData && (
                                        <span className="text-xs font-bold text-[#6C6763]/40 tracking-[0.2em] uppercase">
                                            CODE: LUCKDATE-AUTO
                                        </span>
                                    )}
                                </div>

                                {/* 未登录用户需要输入邮箱 */}
                                {!user && (
                                    <>
                                        <div className="mb-6">
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setError('');
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleClaim();
                                                    }
                                                }}
                                                disabled={isLoading}
                                                className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#D8CBB8]/50 disabled:opacity-50 disabled:cursor-not-allowed`}
                                            />
                                            {error && (
                                                <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* 已登录用户提示 */}
                                {user && (
                                    <p className="mb-6 text-sm text-[#6C6763]/70">
                                        Click to claim your exclusive discount!
                                    </p>
                                )}

                                <Button
                                    onClick={handleClaim}
                                    disabled={(!user && !email) || isLoading || (Boolean(user) && authLoading)}
                                    className="w-full h-14 bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white rounded-full text-xl font-bold shadow-xl shadow-[#D8CBB8]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading || (Boolean(user) && authLoading) ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : user ? (
                                        'Claim Now'
                                    ) : (
                                        'Claim & Register'
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center relative py-4 animate-in zoom-in-95 fade-in duration-300">
                                <div className="w-28 h-28 bg-[#D8CBB8] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#D8CBB8]/30 animate-in zoom-in-50 duration-500">
                                    <Check className="w-14 h-14 text-white" strokeWidth={3} />
                                </div>

                                <h2 className="text-3xl font-bold text-[#4E554B] mb-3 font-['Montserrat']">
                                    Coupon Claimed!
                                </h2>
                                <p className="text-[#6C6763]/60 text-lg mb-6">
                                    You got{' '}
                                    <span className="font-bold text-[#D8CBB8]">{COUPON_RULE_TEXT}</span>{' '}
                                    on all products.
                                </p>

                                <div className="bg-[#D8CBB8]/5 border-2 border-dashed border-[#D8CBB8]/30 rounded-3xl p-6">
                                    <span className="block text-4xl font-black text-[#D8CBB8] font-['Montserrat'] tracking-tight">
                                        {COUPON_RULE_TEXT}
                                    </span>
                                    <span className="text-xs font-bold text-[#D8CBB8]/60 tracking-[0.2em] uppercase mt-1 block">
                                        Applied Automatically
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 浮动优惠券入口按钮 */}
            {shouldShowFloatingButton() && (
                <div
                    className={[
                        'fixed md:bottom-[92px] bottom-[28px] left-4 z-40',
                        showStickyOnPC ? 'lg:opacity-100 lg:pointer-events-auto' : 'lg:opacity-0 lg:pointer-events-none',
                        'animate-in fade-in slide-in-from-bottom-8 duration-500',
                    ].join(' ')}
                >
                    <button
                        onClick={handleFloatingButtonClick}
                        className={[
                            'relative overflow-hidden rounded-full',
                            'px-4 py-3 sm:px-5',
                            'bg-white/95 backdrop-blur-md border border-[#D8CBB8]/25',
                            'shadow-[0_10px_30px_rgba(0,0,0,0.10)] hover:shadow-[0_12px_34px_rgba(0,0,0,0.14)]',
                            'transition-all duration-300',
                            'flex items-center gap-3',
                            'animate-bounce [animation-duration:1.6s]',
                        ].join(' ')}
                        aria-label="Claim coupon"
                    >
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#D8CBB8]/10 via-transparent to-[#D8CBB8]/10" />

                        <span className="relative w-10 h-10 rounded-full bg-[#D8CBB8]/12 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-[#D8CBB8]" />
                        </span>

                        <span className="relative flex flex-col items-start leading-tight">
                            <span className="text-[11px] font-semibold text-[#4E554B]/70 tracking-wide uppercase">
                                Coupon
                            </span>
                            <span className="text-sm sm:text-base font-extrabold text-[#4E554B] whitespace-nowrap">
                                {popupCouponData ? 'Special Offer' : `Save ${DISCOUNT_PERCENT}%`}
                            </span>
                        </span>

                        <span className="relative ml-1 inline-flex items-center rounded-full bg-[#D8CBB8] text-white text-xs font-bold px-3 py-1 shadow-[0_8px_16px_rgba(92,184,92,0.25)]">
                            Claim
                        </span>
                    </button>
                </div>
            )}

            {/* 领取成功 Toast */}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#4E554B] text-white px-8 py-4 rounded-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
                    {toastMsg ? (
                        <span className="font-medium">{toastMsg}</span>
                    ) : (
                        <>
                            <div className="w-6 h-6 bg-[#D8CBB8] rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#D8CBB8]/20">
                                <Check className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Coupon Claimed Successfully!</span>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
