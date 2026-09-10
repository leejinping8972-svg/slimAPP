import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { buildLandingProductJsonLd } from '@/lib/seo/landing-schemas';

export const metadata: Metadata = {
  title: 'Aura Probiotic Gummies | LUCKDATE',
  description:
    'Premium probiotic gummies with Slippery Elm + Ginkgo Leaf for intimate moisture, pH balance, and all-day confidence.',
  alternates: { canonical: '/gummies_1' },
  openGraph: {
    type: 'website',
    siteName: 'LUCKDATE',
    title: 'Aura Probiotic Gummies | LUCKDATE',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Aura Probiotic Gummies' }],
  },
};

const productJsonLd = buildLandingProductJsonLd({
  path: '/gummies_1',
  name: 'Aura Probiotic Gummies',
  description: 'Premium probiotic gummies for intimate moisture, pH balance, and daily confidence.',
  image: '/og-image.png',
});

export default function GummiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={productJsonLd} />
      {children}
    </>
  );
}
