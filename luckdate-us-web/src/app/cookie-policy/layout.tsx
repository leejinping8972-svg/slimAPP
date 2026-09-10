import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Understand how LUCKDATE uses cookies and similar technologies. Learn about cookie types, third-party cookies, and how to manage your preferences.',
  alternates: { canonical: '/cookie-policy' },
  openGraph: {
    type: 'website',
    title: 'Cookie Policy | LUCKDATE',
    description: 'Understand how LUCKDATE uses cookies and similar technologies.',
    url: '/cookie-policy',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LUCKDATE Cookie Policy' }],
  },
  twitter: {
    card: 'summary',
    title: 'Cookie Policy | LUCKDATE',
    description: 'Understand how LUCKDATE uses cookies and similar technologies.',
  },
};

export default function CookieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
