import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Read the LUCKDATE disclaimer covering general information, health disclaimers, product accuracy, testimonials, and limitation of liability.',
  alternates: { canonical: '/disclaimer' },
  openGraph: {
    type: 'website',
    title: 'Disclaimer | LUCKDATE',
    description: 'Read the LUCKDATE disclaimer covering health information and liability.',
    url: '/disclaimer',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LUCKDATE Disclaimer' }],
  },
  twitter: {
    card: 'summary',
    title: 'Disclaimer | LUCKDATE',
    description: 'LUCKDATE disclaimer covering health information and liability.',
  },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
