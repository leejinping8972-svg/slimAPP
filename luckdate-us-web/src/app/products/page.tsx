import { Suspense } from 'react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, BASE_URL, DEFAULT_OG_IMAGE_URL, ORGANIZATION_ID, SITE_NAME, WEBSITE_ID, buildPublisherSchema, SHIPPING_DETAILS, MERCHANT_RETURN_POLICY } from '@/lib/seo/home-schemas';
import { fetchProductsPage } from '@/lib/api/server-fetch';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import ProductsClient from './ProductsClient';

export const metadata = {
    title: 'Shop All Premium Supplements | LUCKDATE',
    description: 'Browse our complete collection of premium supplements — NAD+, NMN, collagen peptides, probiotics, Shilajit gummies & more. Science-backed formulas for longevity, anti-aging and daily wellness. Free shipping on orders $50+.',
    keywords: ['premium supplements', 'NAD+ supplements', 'NMN anti-aging', 'collagen peptides', 'probiotics', 'Shilajit gummies', 'omega-3 fish oil', 'men\'s health supplements', 'women\'s wellness vitamins', 'LUCKDATE supplements'],
    alternates: { canonical: '/products' },
    openGraph: {
        type: 'website',
        title: 'Shop All Premium Supplements | LUCKDATE – NAD+, NMN, Collagen & More',
        description: 'Browse our complete collection of premium, science-backed supplements for longevity, energy, beauty and daily wellness. Shop now with free shipping.',
        url: '/products',
        siteName: SITE_NAME,
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LUCKDATE Premium Supplements Collection' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shop All Premium Supplements | LUCKDATE',
        description: 'Premium science-backed supplements for longevity and wellness. NAD+, collagen, probiotics & more.',
        images: ['/og-image.png'],
    },
};

export default async function AllProductsPage() {
    const productsData = await fetchProductsPage();
    const { products, total } = productsData;

    const productsGraphJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${BASE_URL}/products/#page`,
                url: `${BASE_URL}/products`,
                name: `${SITE_NAME} Premium Supplements Collection`,
                description: 'Browse our complete collection of premium supplements for longevity and wellness.',
                publisher: buildPublisherSchema(),
                isPartOf: { '@id': WEBSITE_ID },
                primaryImageOfPage: {
                    '@type': 'ImageObject',
                    url: DEFAULT_OG_IMAGE_URL,
                    contentUrl: DEFAULT_OG_IMAGE_URL,
                    name: `${SITE_NAME} premium supplements collection`,
                    representativeOfPage: true,
                },
                image: DEFAULT_OG_IMAGE_URL,
                mainEntity: { '@id': `${BASE_URL}/products/#item-list` },
                breadcrumb: { '@id': `${BASE_URL}/products/#breadcrumb` },
                inLanguage: 'en-US',
            },
            {
                '@type': 'ItemList',
                '@id': `${BASE_URL}/products/#item-list`,
                numberOfItems: total,
                itemListElement: products.map((product, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                        '@type': 'Product',
                        '@id': `${BASE_URL}/product/${product.id}/#product`,
                        name: product.name,
                        description: product.description,
                        image: absoluteUrl(product.image),
                        url: `${BASE_URL}/product/${product.id}`,
                        brand: { '@id': ORGANIZATION_ID },
                        offers: {
                            '@type': 'Offer',
                            price: product.price,
                            priceCurrency: 'USD',
                            availability: 'https://schema.org/InStock',
                            seller: { '@id': ORGANIZATION_ID },
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
                })),
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${BASE_URL}/products/#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
                    { '@type': 'ListItem', position: 2, name: 'Products', item: `${BASE_URL}/products` },
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-[#F7F5F1] noise-overlay">
            <JsonLd data={productsGraphJsonLd} />
            <Navigation />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
                    <div className="text-center mb-12">
                        <span className="text-[#D8CBB8] font-medium tracking-wider text-sm uppercase mb-3 block">
                            Shop All
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#4E554B] mb-6 font-['Montserrat']">
                            Complete <span className="text-[#D8CBB8]">Collection</span>
                        </h1>
                        <p className="text-[#6C6763]/70 text-lg max-w-2xl mx-auto">
                            Browse our full range of premium supplements designed to elevate your health and longevity.
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#D8CBB8]/20 border-t-[#D8CBB8] rounded-full animate-spin mb-4" />
                            <p className="text-[#6C6763]/60 font-medium">Loading collection...</p>
                        </div>
                    }>
                        <ProductsClient initialData={productsData} />
                    </Suspense>
                </div>
            </main>
            <UnpaidOrderFloat />

            <Footer />
        </div>
    );
}
