import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { buildPublisherSchema, BASE_URL, WEBSITE_ID } from '@/lib/seo/home-schemas';

const pageDescription =
  'Discover LUCKDATE\'s mission to help adults stay young longer through science-backed supplements, app tracking, and nutritionist-guided wellness systems.';

export const metadata: Metadata = {
  title: 'About Us',
  description: pageDescription,
  alternates: { canonical: '/about' },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${BASE_URL}/about/#page`,
  url: `${BASE_URL}/about`,
  name: 'About Us | LUCKDATE',
  description: pageDescription,
  publisher: buildPublisherSchema(),
  isPartOf: { '@id': WEBSITE_ID },
  inLanguage: 'en-US',
  mainContentOfPage: {
    '@type': 'WebPageElement',
    cssSelector: '#about-content',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: `${BASE_URL}/about` },
    ],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={aboutSchema} />
      {children}
    </>
  );
}
