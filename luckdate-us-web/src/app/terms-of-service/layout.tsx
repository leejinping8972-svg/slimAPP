import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the LUCKDATE Terms of Service. Learn about eligibility, account responsibilities, orders, shipping, returns, intellectual property, and more.',
  alternates: { canonical: '/terms-of-service' },
  openGraph: {
    type: 'website',
    title: 'Terms of Service | LUCKDATE',
    description: 'Read the LUCKDATE Terms of Service.',
    url: '/terms-of-service',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LUCKDATE Terms of Service' }],
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | LUCKDATE',
    description: 'Read the LUCKDATE Terms of Service.',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
