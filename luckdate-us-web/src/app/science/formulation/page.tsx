import type { Metadata } from 'next';
import FormulationPageClient from '@/sections/science/FormulationPageClient';

export const metadata: Metadata = {
  title: 'Formulation — Whey Protein & Probiotics | luckdate',
  description:
    'Explore luckdate formulation science: clean WPC80 whey protein concentrate and targeted probiotics — sourcing, efficacy, process, and purity.',
  alternates: { canonical: '/science/formulation' },
};

export default function FormulationPage() {
  return <FormulationPageClient />;
}
