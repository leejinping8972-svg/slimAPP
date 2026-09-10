import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { buildLandingProductJsonLd } from '@/lib/seo/landing-schemas';

export const metadata: Metadata = {
  title: 'Luckdate Slim | Slim Vitality + Sunny AI + 28-Day Ritual',
  description:
    'More than a shake. Luckdate Slim combines daily nutrition, Sunny AI guidance, and a 28-day ritual for a lighter, stronger, more energized you.',
  alternates: { canonical: '/slim_1' },
  openGraph: {
    type: 'website',
    siteName: 'LUCKDATE',
    title: 'Luckdate Slim | Slim Vitality + Sunny AI + 28-Day Ritual',
    description:
      'Daily nutrition. Personalized guidance. A lighter, stronger, more energized you.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Luckdate Slim' }],
  },
};

const productJsonLd = buildLandingProductJsonLd({
  path: '/slim_1',
  name: 'Luckdate Slim Vitality',
  description:
    'Slim Vitality nutrition + Sunny AI companion + 28-day daily ritual for sustainable vitality.',
  image: '/og-image.png',
});

export default function SlimLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={productJsonLd} />
      {children}
    </>
  );
}
