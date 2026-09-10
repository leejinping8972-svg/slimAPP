import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { buildLandingProductJsonLd } from '@/lib/seo/landing-schemas';

export const metadata: Metadata = {
  title: '10 in 1 Shilajit Gummies | LUCKDATE',
  description:
    'The Ultimate 10-in-1 Wellness Formula. Only the finest ingredients for your health. Non-GMO, gluten-free, vegan friendly.',
  alternates: { canonical: '/disc_shilajit_1' },
  openGraph: {
    type: 'website',
    siteName: 'LUCKDATE',
    title: '10 in 1 Shilajit Gummies | LUCKDATE',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '10 in 1 Shilajit Gummies' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
};

const productJsonLd = buildLandingProductJsonLd({
  path: '/disc_shilajit_1',
  name: '10 in 1 Shilajit Gummies',
  description: 'Discount landing for 10-in-1 Shilajit Gummies wellness formula.',
  image: '/og-image.png',
});

export default function DiscShilajitLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={productJsonLd} />
      {children}
    </>
  );
}
