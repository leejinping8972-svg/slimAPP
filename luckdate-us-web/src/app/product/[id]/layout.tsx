import type { Metadata } from 'next';

export const metadata: Metadata = {
  openGraph: {
    type: 'website',
    siteName: 'LUCKDATE',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LUCKDATE Product' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
};

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
