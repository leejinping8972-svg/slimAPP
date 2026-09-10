import type { Metadata } from 'next';
import { BASE_URL, DEFAULT_OG_IMAGE_URL, SITE_NAME } from './home-schemas';

export function getDefaultPriceValidUntil(): string {
  const year = new Date().getFullYear() + 1;
  return `${year}-12-31`;
}

export function buildPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImage?: string;
}): Metadata {
  const canonical = options.path.startsWith('/') ? options.path : `/${options.path}`;
  const image = options.ogImage ?? '/og-image.png';

  return {
    title: options.title,
    description: options.description,
    ...(options.keywords ? { keywords: options.keywords } : {}),
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: `${options.title} | ${SITE_NAME}`,
      description: options.description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: options.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${options.title} | ${SITE_NAME}`,
      description: options.description,
      images: [image],
    },
    ...(options.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export const AGENTIC_DISCOVERY_URLS = [
  BASE_URL,
  `${BASE_URL}/about`,
  `${BASE_URL}/products`,
  `${BASE_URL}/blog`,
  `${BASE_URL}/contact`,
  `${BASE_URL}/#geo-brand-definition`,
  `${BASE_URL}/#geo-faq`,
];
