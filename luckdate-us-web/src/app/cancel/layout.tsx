import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Cancelled',
  description: 'Your payment was cancelled. No charges were made. You can try again or continue shopping.',
  robots: { index: false, follow: false },
};

export default function CancelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
