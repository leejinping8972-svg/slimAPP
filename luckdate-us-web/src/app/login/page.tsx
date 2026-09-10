'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import {
  SHILAJIT_COUPON_API,
  BODY_PURIFICATION_COUPON_API,
  CHATVIVA_PATCHES_COUPON_API,
} from '@/lib/api/coupon';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { login, register: registerAuth, sendVerificationCode, loading } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [pendingCouponToast, setPendingCouponToast] = useState<string | null>(null);

  // 验证码倒计时
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // 清理倒计时
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // 从URL参数回填邮箱（从优惠券弹窗跳转过来时）
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const fromParam = params.get('from');
    const redirectParam = params.get('redirect');

    if (emailParam && /^\S+@\S+\.\S+$/.test(emailParam)) {
      setEmail(emailParam);
      if (fromParam === 'coupon') {
        // from coupon popup
      }
    }

    if (redirectParam && redirectParam !== '') {
      setRedirectPath(decodeURIComponent(redirectParam));
    }

    const pendingToast = sessionStorage.getItem('pending_coupon_toast');
    if (pendingToast) {
      setPendingCouponToast(pendingToast);
      sessionStorage.removeItem('pending_coupon_toast');
    }
  }, []);

  useEffect(() => {
    if (pendingCouponToast) {
      const timer = setTimeout(() => setPendingCouponToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [pendingCouponToast]);

  /** 开始倒计时 */
  const startCountdown = () => {
    setCountdown(60);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /** 发送验证码 */
  const handleSendCode = async () => {
    setError('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // 防抖：倒计时期间不能重复发送
    if (countdown > 0) return;

    setIsSendingCode(true);

    try {
      const result = await sendVerificationCode(email, mode);
      if (result.success) {
        setCodeSent(true);
        setError('');
        startCountdown(); // 开始 60 秒倒计时
      } else {
        setError(result.message || 'Failed to send verification code.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification code.');
    } finally {
      setIsSendingCode(false);
    }
  };

  /** 提交表单 - 登录或注册 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!code || code.length < 4) {
      setError('Please enter a valid verification code.');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (mode === 'register') {
        result = await registerAuth(email, code);
      } else {
        result = await login(email, code);
      }

      if (result.success) {
        // 如果来源是落地页，登录成功后自动领取对应优惠券
        if (
          redirectPath
          && (redirectPath === '/shilajit_1'
            || redirectPath === '/body_purification'
            || redirectPath === '/chatviva_patches')
        ) {
          const apiConfig = redirectPath === '/shilajit_1'
            ? SHILAJIT_COUPON_API
            : redirectPath === '/body_purification'
              ? BODY_PURIFICATION_COUPON_API
              : CHATVIVA_PATCHES_COUPON_API;
          try {
            const claimRes = await apiConfig.claimCoupon();
            console.log(`[Login] 自动领取${redirectPath}优惠券:`, claimRes.data?.data);
            // 领取成功后标记 sessionStorage，让落地页知道已领过
            if (claimRes.data?.data?.coupon_id) {
              sessionStorage.setItem(`${apiConfig.storageKeyPrefix}_claimed`, String(claimRes.data.data.coupon_id));
            }
          } catch (claimErr: any) {
            console.warn(`[Login] 自动领取${redirectPath}优惠券失败（可能已领过）:`, claimErr?.response?.data?.error_msg || claimErr?.message);
          }
        }

        setShowLoginToast(true);
        setTimeout(() => setShowLoginToast(false), 3000);
        router.push(redirectPath || '/profile');
      } else {
        setError(result.message || `${mode === 'register' ? 'Registration' : 'Login'} failed. Please try again.`);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /** 切换模式时重置状态 */
  const handleSwitchMode = (newMode: AuthMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setCode('');
    setCodeSent(false);
    setError('');
    // 重置倒计时
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F1] flex flex-col">
      <Navigation />

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-32 pb-20">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-['Montserrat'] mb-2">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-500">
              {mode === 'login'
                ? 'Enter your credentials to access your account.'
                : 'Fill in the details to create your account.'
              }
            </p>
          </div>

          {/* Tab 切换：登录 / 注册 */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white text-[#4E554B] shadow-sm'
                    : 'text-gray-500 hover:text-[#333]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('register')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white text-[#4E554B] shadow-sm'
                    : 'text-gray-500 hover:text-[#333]'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#D8CBB8]/50 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setError(''); }}
                    placeholder="Enter code"
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200'} text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#D8CBB8]/50 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || isSendingCode || !email || !/^\S+@\S+\.\S+$/.test(email)}
                    className={`px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-colors min-w-[100px] ${
                      countdown > 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSendingCode
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : codeSent
                            ? 'bg-[#D8CBB8]/10 text-[#D8CBB8] hover:bg-[#D8CBB8]/20'
                            : 'bg-[#D8CBB8]/10 text-[#D8CBB8] hover:bg-[#D8CBB8]/20'
                    } ${!email || !/^\S+@\S+\.\S+$/.test(email) ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {countdown > 0
                      ? `${countdown}s`
                      : isSendingCode
                        ? 'Sending...'
                        : codeSent
                          ? 'Resend'
                          : 'Get Code'}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {codeSent && !error && countdown === 0 && <p className="text-[#D8CBB8] text-sm mt-2">Verification code sent!</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || loading || !code || code.length < 4}
                className="w-full h-12 bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white rounded-xl font-bold text-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? (mode === 'register' ? 'Creating Account...' : 'Signing In...')
                  : mode === 'register'
                    ? 'Create Account'
                    : 'Sign In'}
              </Button>
            </form>
        </div>
      </main>

      <Footer />
      <CartDrawer />

      {showLoginToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#4E554B] text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">{t('auth.loginSuccess', 'Logged in successfully!')}</span>
        </div>
      )}

      {pendingCouponToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#4E554B] text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="font-medium text-sm">{pendingCouponToast}</span>
        </div>
      )}
    </div>
  );
}
