import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Inquiry',
  description: 'Look up your LUCKDATE orders by recipient name and phone number. View order status, tracking details, and order history.',
  alternates: { canonical: '/order-inquiry' },
  openGraph: {
    type: 'website',
    title: 'Order Inquiry | LUCKDATE',
    description: 'Look up your LUCKDATE orders and view order status.',
    url: '/order-inquiry',
  },
  robots: { index: false, follow: true },
};

export default function OrderInquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
