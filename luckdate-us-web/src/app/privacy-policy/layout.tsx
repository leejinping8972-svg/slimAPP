import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how LUCKDATE collects, uses, and protects your personal information. Your privacy and data security are our priority.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    type: 'website',
    title: 'Privacy Policy | LUCKDATE',
    description: 'Learn how LUCKDATE collects, uses, and protects your personal information.',
    url: '/privacy-policy',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LUCKDATE Privacy Policy' }],
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | LUCKDATE',
    description: 'Learn how LUCKDATE protects your personal information.',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
