import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact LUCKDATE customer support. Official email: support@luckdate.com for orders, returns, and product inquiries.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    title: 'Contact Us | LUCKDATE',
    description: 'Reach LUCKDATE customer support at support@luckdate.com.',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
