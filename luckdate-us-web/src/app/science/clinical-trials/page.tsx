import type { Metadata } from 'next';
import ClinicalTrialsPageClient from '@/sections/science/ClinicalTrialsPageClient';

export const metadata: Metadata = {
  title: 'Clinically Backed — The Results | luckdate',
  description:
    'Compelling results are felt, and seen. Explore clinical research themes behind luckdate nutrition rituals for gut health, performance, and whole-body vitality.',
  alternates: { canonical: '/science/clinical-trials' },
};

export default function ClinicalTrialsPage() {
  return <ClinicalTrialsPageClient />;
}
