import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Track your LUCKDATE order in real-time. Enter your details to see shipping status and estimated delivery date.',
  alternates: { canonical: '/track-order' },
  openGraph: {
    type: 'website',
    title: 'Track Your Order | LUCKDATE',
    description: 'Track your LUCKDATE order in real-time.',
    url: '/track-order',
  },
  robots: { index: false, follow: true },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
