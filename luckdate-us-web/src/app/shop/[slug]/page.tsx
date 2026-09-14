import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import { GlobalCoupon } from '@/components/GlobalCoupon';
import { CATALOG_PRODUCTS, getCatalogProduct } from '@/data/catalogProducts';
import { ShopProductClient } from './ShopProductClient';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATALOG_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) return { title: 'Product Not Found | luckdate' };
  return {
    title: `${product.name} | luckdate`,
    description: product.description,
    alternates: { canonical: `/shop/${slug}` },
  };
}

export default async function ShopProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[#F7F5F1]">
      <Navigation />
      <main className="pt-[4.5rem]">
        <ShopProductClient product={product} />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <CartDrawer />
        <GlobalCoupon />
      </Suspense>
    </div>
  );
}
