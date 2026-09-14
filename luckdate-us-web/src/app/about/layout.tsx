import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { buildPublisherSchema, BASE_URL, WEBSITE_ID } from '@/lib/seo/home-schemas';

const pageDescription =
  'Our story: luckdate builds science-backed daily wellness routines, guided by 2004 Nobel Laureate Prof. Aaron Ciechanover as Chief Consulting Scientist.';

export const metadata: Metadata = {
  title: 'Our Story',
  description: pageDescription,
  alternates: { canonical: '/about' },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${BASE_URL}/about/#page`,
  url: `${BASE_URL}/about`,
  name: 'Our Story | luckdate',
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
      { '@type': 'ListItem', position: 2, name: 'Our Story', item: `${BASE_URL}/about` },
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
