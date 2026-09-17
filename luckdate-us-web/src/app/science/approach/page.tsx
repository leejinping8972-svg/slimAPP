import type { Metadata } from 'next';
import ApproachPageClient from '@/sections/science/ApproachPageClient';

export const metadata: Metadata = {
  title: 'The Approach — Weight, Gut & Metabolism | luckdate',
  description:
    'Confronting the modern environment: how luckdate approaches weight management, gut management, and metabolism management.',
  alternates: { canonical: '/science/approach' },
};

export default function ApproachPage() {
  return <ApproachPageClient />;
}
