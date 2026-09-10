'use client';

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CouponProvider } from '@/context/CouponContext';
import { OrderProvider } from '@/context/OrderContext';
import { TokenInit } from '@/components/TokenInit';
import i18n from '@/i18n';
import { useEffect } from 'react';

function LocaleLock() {
  useEffect(() => {
    i18n.changeLanguage('en');
    document.documentElement.lang = 'en';
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode; initialLocale?: string }) {

  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <CouponProvider>
            <LocaleLock />
            <TokenInit />
            {children}
          </CouponProvider>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
