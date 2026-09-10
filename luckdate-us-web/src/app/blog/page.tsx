import { Suspense } from 'react';
import Navigation from '@/sections/Navigation';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, BASE_URL, DEFAULT_OG_IMAGE_URL, SITE_NAME, WEBSITE_ID, buildPublisherSchema } from '@/lib/seo/home-schemas';
import { fetchBlogPageArticles } from '@/lib/api/server-fetch';
import { type ArticleDisplay } from '@/lib/api/mappers';
import BlogClient from './BlogClient';
import PillarArticleCards from '@/components/seo/PillarArticleCards';

export const metadata = {
    title: 'Health & Wellness Journal | LUCKDATE – Expert Articles on Longevity',
    description: 'Explore expert articles on NAD+, NMN, anti-aging science, cellular health, nutrition tips and wellness guides. Stay informed with LUCKDATE\'s research-backed insights on living longer and better.',
    keywords: ['health blog', 'longevity science', 'NAD+ benefits', 'NMN supplements', 'anti-aging tips', 'cellular health', 'wellness guide', 'nutrition advice', 'supplement research', 'healthy aging'],
    alternates: { canonical: '/blog' },
    openGraph: {
        type: 'website',
        title: 'Health & Wellness Journal | LUCKDATE – Longevity Science & Supplement Guides',
        description: 'Expert articles on NAD+, NMN, anti-aging science, nutrition and wellness. Research-backed insights for healthy longevity.',
        url: '/blog',
        siteName: SITE_NAME,
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LUCKDATE Health & Wellness Journal' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Health & Wellness Journal | LUCKDATE',
        description: 'Expert articles on longevity science, NAD+ research, and wellness guides.',
        images: ['/og-image.png'],
    },
};

export default async function BlogListPage() {
    const blogData = await fetchBlogPageArticles();
    const { articles, currentPage, totalPages, total } = blogData;

    const blogGraphJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': `${BASE_URL}/blog/#blog`,
        name: `${SITE_NAME} Journal & Guides`,
        description: 'Explore the latest insights on longevity, wellness, and the science behind LUCKDATE supplements.',
        url: `${BASE_URL}/blog`,
        publisher: buildPublisherSchema(),
        isPartOf: { '@id': WEBSITE_ID },
        inLanguage: 'en-US',
        blogPost: articles.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            author: { '@type': 'Person', name: post.author || 'LUCKDATE' },
            datePublished: post.date || '2025-10-24',
            url: `${BASE_URL}/blog/${post.id}`,
            image: absoluteUrl(post.coverImage),
        })),
        primaryImageOfPage: {
            '@type': 'ImageObject',
            url: DEFAULT_OG_IMAGE_URL,
            contentUrl: DEFAULT_OG_IMAGE_URL,
            name: `${SITE_NAME} journal and guides`,
            representativeOfPage: true,
        },
        image: DEFAULT_OG_IMAGE_URL,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
                { '@type': 'ListItem', position: 2, name: 'Journal & Guides', item: `${BASE_URL}/blog` },
            ],
        },
    };

    return (
        <div className="min-h-screen bg-[#F7F5F1] noise-overlay">
            {articles.length > 0 && <JsonLd data={blogGraphJsonLd} />}
            <Navigation />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
                    <div className="text-center mb-20">
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#4E554B] mb-6 font-['Montserrat']">
                            Journal & <span className="text-[#D8CBB8]">Guides</span>
                        </h1>
                        <p className="text-[#6C6763]/70 text-lg max-w-2xl mx-auto">
                            Expert insights on longevity, wellness, and the science behind premium supplements.
                        </p>
                    </div>

                    <PillarArticleCards />

                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#D8CBB8]/20 border-t-[#D8CBB8] rounded-full animate-spin mb-4" />
                            <p className="text-[#6C6763]/60 font-medium">Loading articles...</p>
                        </div>
                    }>
                        <BlogClient initialData={blogData} />
                    </Suspense>
                </div>
            </main>
            <UnpaidOrderFloat />
            <Footer />
            <CartDrawer />
        </div>
    );
}
