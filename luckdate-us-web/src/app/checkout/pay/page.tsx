'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { ArrowLeft } from 'lucide-react';
import logoImg from '@/assets/logo.png';
import checkoutPayBadge from '@/assets/shilajit/checkout-pay.png';
import {
  clearEmbeddedCheckoutClientSecret,
  getEmbeddedCheckoutClientSecret,
  isStripePublishableKeyConfigured,
} from '@/lib/stripe/embeddedCheckoutNavigate';

const stripePromise =
  typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'string' &&
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.length > 0
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

export default function CheckoutPayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const isFromShilajit = searchParams.get('source') === 'shilajit_1';
  const [clientSecret, setClientSecret] = useState<string | null | undefined>(undefined);
  const [missingReason, setMissingReason] = useState<'none' | 'no_key' | 'no_session'>('none');
  const cancelFallbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (cancelFallbackTimerRef.current !== null) {
        window.clearTimeout(cancelFallbackTimerRef.current);
        cancelFallbackTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isStripePublishableKeyConfigured()) {
      setMissingReason('no_key');
      setClientSecret(null);
      return;
    }
    const secret = getEmbeddedCheckoutClientSecret();
    if (!secret) {
      setMissingReason('no_session');
      setClientSecret(null);
      return;
    }
    setMissingReason('none');
    setClientSecret(secret);
  }, []);

  const embeddedOptions = useMemo(() => {
    if (!clientSecret) return null;
    return { clientSecret };
  }, [clientSecret]);

  const handleCancel = () => {
    clearEmbeddedCheckoutClientSecret();
    if (cancelFallbackTimerRef.current !== null) {
      window.clearTimeout(cancelFallbackTimerRef.current);
      cancelFallbackTimerRef.current = null;
    }

    const canGoBack =
      typeof window !== 'undefined' &&
      typeof window.history !== 'undefined' &&
      window.history.length > 1;

    if (canGoBack) {
      router.back();
      cancelFallbackTimerRef.current = window.setTimeout(() => {
        cancelFallbackTimerRef.current = null;
        if (typeof window === 'undefined') return;
        const path = window.location.pathname.replace(/\/$/, '') || '/';
        if (path === '/checkout/pay') {
          router.replace('/');
        }
      }, 400);
      return;
    }

    router.replace('/');
  };

  if (missingReason === 'no_key') {
    return (
      <div className="min-h-screen bg-[#F7F5F1] flex flex-col items-center justify-center px-6">
        <p className="text-center text-[#4E554B] mb-6 max-w-md">
          {t('cart.checkoutNotConfigured', { defaultValue: 'Checkout is not configured.' })}
        </p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-[#D8CBB8] font-medium underline"
        >
          {t('product.backToHome', { defaultValue: 'Back to Home' })}
        </button>
      </div>
    );
  }

  if (missingReason === 'no_session') {
    return (
      <div className="min-h-screen bg-[#F7F5F1] flex flex-col items-center justify-center px-6">
        <p className="text-center text-[#4E554B] mb-6 max-w-md">
          {t('cart.payPageMissingSession', {
            defaultValue:
              'No active checkout session. Please start checkout again from your cart or product page.',
          })}
        </p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-[#D8CBB8] font-medium underline"
        >
          {t('product.backToHome', { defaultValue: 'Back to Home' })}
        </button>
      </div>
    );
  }

  if (clientSecret === undefined) {
    return (
      <div className="min-h-screen bg-[#F7F5F1] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D8CBB8]/30 border-t-[#D8CBB8] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-shrink-0 border-b border-[#4E554B]/10">
        {!isFromShilajit && (
          <div className="flex justify-center px-4 pt-5 pb-4 sm:pt-6 sm:pb-5">
          <Image
            src={logoImg}
            alt="LUCKDATE"
            width={200}
            height={48}
            priority
            className="h-8 w-auto max-w-[min(220px,70vw)] sm:h-10 object-contain object-center"
          />
        </div>
        )}
        {isFromShilajit && (
        <div className="flex flex-col items-center justify-center py-3">
          <Image unoptimized src={checkoutPayBadge} alt="100,000+ Happy Customers - 30-Day Guarantee, Fast Tracked Shipping, Secure Checkout" className="w-full max-w-[400px] h-auto" />
        </div>
        )}
        <header className="relative flex items-center justify-center px-4 sm:px-6 pb-3 pt-0 min-h-[44px]">
          <button
            type="button"
            onClick={handleCancel}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#6C6763]/80 hover:text-[#4E554B] hover:bg-[#F7F5F1] transition-colors"
            aria-label={t('cart.payPageCancel', { defaultValue: 'Cancel and return home' })}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('cart.payPageCancel', { defaultValue: 'Cancel' })}
          </button>
          <h2 className="font-['Montserrat'] text-lg sm:text-xl text-[#4E554B] text-center pointer-events-none">
            {t('cart.checkoutTitle', { defaultValue: 'Checkout' })}
          </h2>
        </header>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {stripePromise && embeddedOptions && (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={embeddedOptions}>
            <EmbeddedCheckout className="min-h-full [&_iframe]:min-h-[800px]" />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  );
}
