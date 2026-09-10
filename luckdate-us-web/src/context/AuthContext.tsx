'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLoginStatus, loginApi, registerApi, sendCode, logoutApi } from '@/lib/api/auth';
import type { LoginStatusData } from '@/lib/api/auth';
import { getInit } from '@/lib/api/token';
import type { UserCoupon } from '@/lib/coupons/types';
import { createWelcomeCoupon, loadCouponsFromStorage, normalizeReturnedCoupon, saveCouponsToStorage, getDefaultCoupons } from '@/lib/coupons/wallet';

const TOKEN_KEY = 'token';

export interface User {
  id?: string;
  email: string;
  name?: string;
  avatar?: string;
  password?: string;
  created_at?: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface AuthContextType {
  user: User | null;
  addresses: Address[];
  loading: boolean;
  login: (email: string, code: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, code?: string) => Promise<{ success: boolean; message?: string }>;
  sendVerificationCode: (email: string, type: 'login' | 'register') => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  addAddress: (address: Address) => void;
  isFirstTimeUser: (email: string) => boolean;
  isCouponClaimed: boolean;
  setIsCouponClaimed: (claimed: boolean) => void;
  /** Current user coupon wallet (simulation) */
  userCoupons: UserCoupon[];
  refreshUserCoupons: () => void;
  issueWelcomeCouponToWallet: () => void;
  issueWelcomeCouponForEmail: (email: string) => void;
  markCouponUsed: (couponId: string, orderId: string) => void;
  returnCouponToWallet: (couponId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** 刷新 token 并重试 */
async function refreshAndRetry<T>(
  fn: () => Promise<{ data: T }>
): Promise<{ data: T }> {
  const initRes = await getInit();
  const token = initRes.data?.token;
  if (!token) throw new Error('No token in init response');
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
  return fn();
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isCouponClaimed, setIsCouponClaimedState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);

  const persistCoupons = useCallback((email: string, list: UserCoupon[]) => {
    saveCouponsToStorage(email, list);
    setUserCoupons(list);
  }, []);

  const refreshUserCoupons = useCallback(() => {
    if (!user?.email) {
      // 未登录时显示默认优惠券（用于预览样式）
      setUserCoupons(getDefaultCoupons());
      return;
    }
    setUserCoupons(loadCouponsFromStorage(user.email));
  }, [user?.email]);

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth_user');
      if (storedAuth) {
        try {
          const u = JSON.parse(storedAuth) as User;
          setUser(u);
          setUserCoupons(loadCouponsFromStorage(u.email));
        } catch (e) {
          // silent
          // 未登录时显示默认优惠券
          setUserCoupons(getDefaultCoupons());
        }
      } else {
        // 未登录时显示默认优惠券（用于预览样式）
        setUserCoupons(getDefaultCoupons());
      }

      const storedCoupon = localStorage.getItem('global_coupon_claimed');
      if (storedCoupon === 'true') {
        setIsCouponClaimedState(true);
      }
    }
  }, []);

  /** Migrate: if marked as claimed but wallet is empty, add welcome coupon */
  useEffect(() => {
    if (typeof window === 'undefined' || !user?.email) return;
    if (!isCouponClaimed) return;
    const existing = loadCouponsFromStorage(user.email);
    if (existing.some((c) => c.code === 'LUCKDATE-AUTO')) return;
    const next = [...existing, createWelcomeCoupon()];
    saveCouponsToStorage(user.email, next);
    setUserCoupons(next);
  }, [user?.email, isCouponClaimed]);

  const issueWelcomeCouponToWallet = useCallback(() => {
    if (!user?.email) return;
    const existing = loadCouponsFromStorage(user.email);
    if (existing.some((c) => c.code === 'LUCKDATE-AUTO')) {
      setUserCoupons(existing);
      return;
    }
    persistCoupons(user.email, [...existing, createWelcomeCoupon()]);
  }, [persistCoupons, user?.email]);

  const issueWelcomeCouponForEmail = useCallback(
    (email: string) => {
      if (!email) return;
      const existing = loadCouponsFromStorage(email);
      if (existing.some((c) => c.code === 'LUCKDATE-AUTO')) {
        if (user?.email === email) setUserCoupons(existing);
        return;
      }
      const next = [...existing, createWelcomeCoupon()];
      saveCouponsToStorage(email, next);
      if (user?.email === email) setUserCoupons(next);
    },
    [user?.email],
  );

  const markCouponUsed = useCallback(
    (couponId: string, orderId: string) => {
      if (!user?.email) return;
      const list = loadCouponsFromStorage(user.email);
      const next = list.map((c) =>
        c.id === couponId
          ? { ...c, status: 'used' as const, usedAt: new Date().toISOString(), orderId }
          : c,
      );
      persistCoupons(user.email, next);
    },
    [persistCoupons, user?.email],
  );

  const returnCouponToWallet = useCallback(
    (couponId: string) => {
      if (!user?.email) return;
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const nowYmd = `${y}-${m}-${d}`;
      const list = loadCouponsFromStorage(user.email);
      const next = list.map((c) => (c.id === couponId ? normalizeReturnedCoupon(c, nowYmd) : c));
      persistCoupons(user.email, next);
    },
    [persistCoupons, user?.email],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 检查本地存储的优惠券状态
    const storedCoupon = localStorage.getItem('global_coupon_claimed');
    if (storedCoupon === 'true') {
      setIsCouponClaimedState(true);
    }

    // 调用 api/login-status 检查登录状态
    checkLoginStatus();
  }, []);

  /** 检查登录状态，如果失败则重新请求 api/init
   *  api/login-status 返回结构：
   *  {
   *    "status": true,
   *    "data": {
   *      "is_login": true,
   *      "id": "4",
   *      "email": "...",
   *      "name": "...",
   *      "avatar": "",
   *      "created_at": ...
   *    }
   *  }
   */
  const applyLoginStatusPayload = useCallback((payload: LoginStatusData | undefined) => {
    if (!payload) {
      return;
    }

    const loginFlag: unknown = payload.is_login;
    const isLogin =
      loginFlag === true ||
      loginFlag === 1 ||
      loginFlag === '1';

    if (isLogin && payload.email) {
      const userInfo: User = {
        email: payload.email,
        name: payload.name,
        avatar: payload.avatar,
      };
      setUser(userInfo);
      localStorage.setItem('auth_user', JSON.stringify(userInfo));
      setUserCoupons(loadCouponsFromStorage(userInfo.email));
      return;
    }

    // JWT 失效或仅为游客 token：必须清除本地「伪登录」，否则领券等接口走已登录分支但服务端未登录
    setUser(null);
    localStorage.removeItem('auth_user');
    setUserCoupons(getDefaultCoupons());
  }, []);

  const checkLoginStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLoginStatus();
      if (res.data?.status && res.data?.data) {
        applyLoginStatusPayload(res.data.data);
      }
    } catch (error) {
      try {
        await refreshAndRetry(getLoginStatus).then((res) => {
          if (res.data?.status && res.data?.data) {
            applyLoginStatusPayload(res.data.data);
          }
        });
      } catch (retryError) {
        // silent
      }
    } finally {
      setLoading(false);
    }
  }, [applyLoginStatusPayload]);

  const setIsCouponClaimed = (claimed: boolean) => {
    setIsCouponClaimedState(claimed);
    if (typeof window !== 'undefined') {
      if (claimed) {
        localStorage.setItem('global_coupon_claimed', 'true');
      } else {
        localStorage.removeItem('global_coupon_claimed');
      }
    }
  };

  /**
   * 用户登录 - POST api/login（需要验证码）
   * 注意：实际返回和文档不一致，使用 status 判断成功
   * {
   *   "status": true,
   *   "data": { "id": "5", "email": "...", "name": "...", ... }
   * }
   * 成功后调 login-status 确认状态并保存用户信息
   */
  const login = async (email: string, code: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await loginApi({ email, code });
      // 实际 login 接口用 status 判断成功
      if (res.data?.status && res.data?.data) {
        // 登录成功后调用 login-status 获取用户信息
        const loginStatusRes = await getLoginStatus();
        if (loginStatusRes.data?.status && loginStatusRes.data?.data?.is_login === true) {
          const userData = loginStatusRes.data.data;
          const userInfo: User = {
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
          };
          setUser(userInfo);
          localStorage.setItem('auth_user', JSON.stringify(userInfo));
          return { success: true };
        }
        // 如果 login-status 失败，用 login 返回的 data
        const userData = res.data.data;
        const fallbackUser: User = {
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
        };
        setUser(fallbackUser);
        localStorage.setItem('auth_user', JSON.stringify(fallbackUser));
        return { success: true };
      }
      return { success: false, message: res.data?.error_msg || 'Invalid email or verification code.' };
    } catch (error: any) {
      return { success: false, message: error?.message || 'Login failed. Please try again.' };
    }
  };

  /**
   * 用户注册 - POST /api/register（验证码可选）
   * 注册成功后自动登录，再调 login-status 确认状态
   */
  const register = async (email: string, code?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // 构建请求体：只在有验证码时才传递code字段，避免undefined导致validation.present错误
      const requestBody: { email: string; code?: string; name?: string } = {
        email,
        name: email.split('@')[0],
      };

      // 仅在明确提供验证码时才添加（首次注册免验证码时不传）
      if (code !== undefined && code !== null && code !== '') {
        requestBody.code = code;
      }

      const res = await registerApi(requestBody);
      // register 接口用 status 判断成功
      if (res.data?.status) {
        // 注册成功后调用 login-status 获取用户信息
        const loginStatusRes = await getLoginStatus();
        if (loginStatusRes.data?.status && loginStatusRes.data?.data?.is_login === true) {
          const userData = loginStatusRes.data.data;
          const userInfo: User = {
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
          };
          setUser(userInfo);
          localStorage.setItem('auth_user', JSON.stringify(userInfo));
          return { success: true };
        }
        // 如果 login-status 失败，用注册返回的数据构造用户信息
        const userData = res.data?.data;
        const fallbackUser: User = userData
          ? { email: userData.email, name: userData.name, avatar: userData.avatar }
          : { email, name: email.split('@')[0] };
        setUser(fallbackUser);
        localStorage.setItem('auth_user', JSON.stringify(fallbackUser));
        return { success: true };
      }
      return { success: false, message: res.data?.error_msg || 'Registration failed.' };
    } catch (error: any) {
      return { success: false, message: error?.message || 'Registration failed. Please try again.' };
    }
  };

  /**
   * 发送验证码 - POST api/send-code
   * @param type 'login' | 'register'
   */
  const sendVerificationCode = async (email: string, type: 'login' | 'register'): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await sendCode({ email, type });
      // send-code 接口用 status 判断成功
      if (res.data?.status) {
        return { success: true };
      }
      return { success: false, message: res.data?.error_msg || 'Failed to send verification code.' };
    } catch (error: any) {
      return { success: false, message: error?.message || 'Failed to send verification code.' };
    }
  };

  /**
   * 退出登录 - POST api/logout
   * 清除所有用户相关的存储数据
   */
  const logout = async (): Promise<void> => {
    try {
      await logoutApi();
    } catch (error) {
      // silent
    } finally {
      setUser(null);
      setIsCouponClaimedState(false);
      if (typeof window !== 'undefined') {
        // 清除用户信息
        localStorage.removeItem('auth_user');
        // 清除 token
        localStorage.removeItem(TOKEN_KEY);
        // 清除购物车数据
        localStorage.removeItem('cart');
        
        // 清除 GlobalCoupon 相关的 sessionStorage 数据
        sessionStorage.removeItem('global_coupon_claimed');
        sessionStorage.removeItem('global_coupon_dismissed');
        sessionStorage.removeItem('global_coupon_shown');
        sessionStorage.removeItem('global_coupon_pending_login_check');
        sessionStorage.removeItem('global_coupon_user_dismissed_popup');
        sessionStorage.removeItem('global_coupon_dismissed_coupon_id');
        sessionStorage.removeItem('pending_coupon_toast');
        
        // 清除 body_purification 优惠券相关数据（storageKeyPrefix: 'bp_coupon'）
        sessionStorage.removeItem('bp_coupon_shown');
        sessionStorage.removeItem('bp_coupon_claimed');
        sessionStorage.removeItem('bp_coupon_dismissed');
        sessionStorage.removeItem('bp_coupon_user_dismissed_popup');
        sessionStorage.removeItem('bp_coupon_pending_login_check');
        
        // 清除 shilajit 优惠券相关数据（storageKeyPrefix: 'shilajit_coupon'）
        sessionStorage.removeItem('shilajit_coupon_claimed');
        sessionStorage.removeItem('shilajit_coupon_dismissed');
        sessionStorage.removeItem('shilajit_coupon_shown');
        sessionStorage.removeItem('shilajit_coupon_user_dismissed_popup');
        sessionStorage.removeItem('shilajit_coupon_pending_login_check');
        
        // 清除 gummies 优惠券 Modal 状态
        sessionStorage.removeItem('gummies_coupon_modal_seen');
        
        // 清除 Stripe embedded checkout 数据
        sessionStorage.removeItem('stripe_embedded_checkout_client_secret');
        
        // 清除首页锚点目标
        sessionStorage.removeItem('home_anchor_target');
      }
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (typeof window === 'undefined') return;

    let updatedUser: User;

    if (user) {
      // 已有用户数据 → 合并更新
      updatedUser = { ...user, ...data };
    } else {
      // user 为 null（未登录）→ 创建新用户对象（如从 popup-coupon-claim 返回）
      updatedUser = data as User;
    }

    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  const addAddress = (address: Address) => {
    if (!user) return;
    setAddresses((prev) => [...prev, address]);
  };

  /** 本地检查是否为首次用户（兼容性保留） */
  const isFirstTimeUser = (email: string) => {
    if (typeof window === 'undefined') return true;
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    return !users.some((u: User) => u.email === email);
  };

  return (
    <AuthContext.Provider value={{
      user,
      addresses,
      loading,
      login,
      register,
      sendVerificationCode,
      logout,
      updateUser,
      addAddress,
      isFirstTimeUser,
      isCouponClaimed,
      setIsCouponClaimed,
      userCoupons,
      refreshUserCoupons,
      issueWelcomeCouponToWallet,
      issueWelcomeCouponForEmail,
      markCouponUsed,
      returnCouponToWallet,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
