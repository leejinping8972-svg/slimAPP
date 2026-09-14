import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navigation from '@/sections/Navigation';
// import Footer from '@/sections/Footer';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, BASE_URL, ORGANIZATION_ID, SITE_NAME, WEBSITE_ID, buildPublisherSchema, SHIPPING_DETAILS, MERCHANT_RETURN_POLICY } from '@/lib/seo/home-schemas';
import { getDefaultPriceValidUntil } from '@/lib/seo/metadata';
import { fetchProductServer } from '@/lib/api/server-fetch';
import ProductDetailClient from './ProductDetailClient';
import { Loader2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await fetchProductServer(id);
    if (!product) {
        return { title: 'Product Not Found | LUCKDATE' };
    }

    const plainDescription = (product.fullDescription?.replace(/<[^>]*>/g, '') || product.description || '').trim().slice(0, 160);
    const title = `${product.name} | ${SITE_NAME} – Premium Supplement $${product.price}`;
    const description = plainDescription || `Shop ${product.name} by ${SITE_NAME}. Premium quality supplement with science-backed formula. Free shipping on orders $50+. 30-day money-back guarantee.`;

    return {
        title,
        description,
        keywords: [product.name, 'supplements', SITE_NAME, 'premium supplements', 'health', 'wellness', 'longevity', 'anti-aging', ...product.ingredients],
        alternates: { canonical: `/product/${id}` },
        openGraph: {
            type: 'website',
            title,
            description,
            url: `/product/${id}`,
            siteName: SITE_NAME,
            images: product.image ? [{ url: absoluteUrl(product.image), width: 1200, height: 1200, alt: `${product.name} by ${SITE_NAME}` }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: product.image ? [absoluteUrl(product.image)] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await fetchProductServer(id);

    if (!product) {
        notFound();
    }

    const imgUrl = absoluteUrl(product.image);
    const plainDescription = (product.fullDescription?.replace(/<[^>]*>/g, '') || product.description || '').trim();

    const productGraphJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Product',
                '@id': `${BASE_URL}/product/${product.id}/#product`,
                name: product.name,
                description: plainDescription,
                image: imgUrl,
                url: `${BASE_URL}/product/${product.id}`,
                brand: { '@id': ORGANIZATION_ID },
                manufacturer: { '@id': ORGANIZATION_ID },
                sku: `LUCKDATE-${product.id}`,
                offers: {
                    '@type': 'Offer',
                    price: product.price,
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url: `${BASE_URL}/product/${product.id}`,
                    seller: { '@id': ORGANIZATION_ID },
                    priceValidUntil: getDefaultPriceValidUntil(),
                    shippingDetails: SHIPPING_DETAILS,
                    hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
                },
                ...(product.rating > 0 && product.reviews > 0 ? {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: product.rating,
                        reviewCount: product.reviews,
                        bestRating: 5,
                        worstRating: 1,
                    },
                } : {}),
            },
            {
                '@type': 'WebPage',
                '@id': `${BASE_URL}/product/${product.id}/#webpage`,
                url: `${BASE_URL}/product/${product.id}`,
                name: `${product.name} | ${SITE_NAME}`,
                description: plainDescription,
                isPartOf: { '@id': WEBSITE_ID },
                about: { '@id': `${BASE_URL}/product/${product.id}/#product` },
                primaryImageOfPage: {
                    '@type': 'ImageObject',
                    url: imgUrl,
                    contentUrl: imgUrl,
                    name: `${product.name} by ${SITE_NAME}`,
                    caption: product.description,
                    representativeOfPage: true,
                    creator: { '@id': ORGANIZATION_ID },
                    creditText: SITE_NAME,
                    copyrightHolder: { '@id': ORGANIZATION_ID },
                },
                image: imgUrl,
                publisher: buildPublisherSchema(),
                inLanguage: 'en-US',
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
                    { '@type': 'ListItem', position: 2, name: 'Products', item: `${BASE_URL}/products` },
                    { '@type': 'ListItem', position: 3, name: product.name, item: `${BASE_URL}/product/${product.id}` },
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-[#F7F5F1] noise-overlay">
            <JsonLd data={productGraphJsonLd} />
            <Navigation />

            <main>
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center pt-40">
                        <Loader2 className="w-10 h-10 text-[#D8CBB8] animate-spin mb-4" />
                        <p className="text-[#4E554B] font-medium">Loading product details...</p>
                    </div>
                }>
                    <ProductDetailClient initialProduct={product} />
                </Suspense>
            </main>
            <UnpaidOrderFloat />
            {/* <Footer /> */}
        </div>
    );
}
