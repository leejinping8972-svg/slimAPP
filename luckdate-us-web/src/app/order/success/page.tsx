'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import gsap from 'gsap';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { t } = useTranslation();
  const orderSn = searchParams.get('order_sn');

  useEffect(() => {
    clearCart();
    gsap.fromTo(
      '.order-success-content',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.2 }
    );
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#F7F5F1] noise-overlay flex flex-col">
      <Navigation />

      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
        <div className="order-success-content text-center max-w-lg mx-auto bg-white p-12 rounded-3xl shadow-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-[#4E554B] mb-4 font-['Montserrat']">
            {t('success.title', { defaultValue: 'Thank you for your order!' })}
          </h2>

          <p className="text-[#6C6763]/70 mb-8 text-lg">
            {t('success.description', {
              defaultValue: 'Your payment was successful. We will process your order shortly.',
            })}
          </p>

          {orderSn && (
            <p className="text-sm text-[#6C6763]/50 mb-4">
              {t('success.orderId', { defaultValue: 'Order No. {{orderId}}', orderId: orderSn })}
            </p>
          )}

          <Button
            onClick={() => router.push('/')}
            className="bg-[#4E554B] text-white px-8 py-6 rounded-full text-lg w-full hover:bg-[#D8CBB8] transition-all"
          >
            {t('success.continueShopping', { defaultValue: 'Continue Shopping' })}
          </Button>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
