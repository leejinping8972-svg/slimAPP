import type { Metadata } from 'next';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import FAQ from '@/sections/FAQ';

export const metadata: Metadata = {
  title: 'FAQ | luckdate',
  description: 'Frequently asked questions about luckdate nutrition rituals, shipping, and orders.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F1]">
      <Navigation />
      <main className="pt-4">
        <FAQ />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
