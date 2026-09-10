/**
 * Stripe Embedded Checkout：用 sessionStorage 传递 client_secret，再进入全屏支付页。
 * 避免将 cs_ 写入 URL（Referer、浏览器历史等泄露风险）。
 */

export const STRIPE_EMBEDDED_CHECKOUT_STORAGE_KEY =
  'luckdate_stripe_embedded_client_secret';

export type RouterWithPush = {
  push: (href: string) => void;
};

export function setEmbeddedCheckoutClientSecret(clientSecret: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STRIPE_EMBEDDED_CHECKOUT_STORAGE_KEY, clientSecret);
  } catch {
    // storage 不可用（隐私模式等）时静默失败，由支付页兜底提示
  }
}

export function getEmbeddedCheckoutClientSecret(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.sessionStorage.getItem(STRIPE_EMBEDDED_CHECKOUT_STORAGE_KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

export function clearEmbeddedCheckoutClientSecret(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(STRIPE_EMBEDDED_CHECKOUT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function navigateToEmbeddedCheckout(
  router: RouterWithPush,
  clientSecret: string,
  source?: string,
): void {
  setEmbeddedCheckoutClientSecret(clientSecret);
  const query = source ? `?source=${source}` : '';
  router.push(`/checkout/pay${query}`);
}

export function isStripePublishableKeyConfigured(): boolean {
  return (
    typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'string' &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.length > 0
  );
}
