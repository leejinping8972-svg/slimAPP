import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navigation from '@/sections/Navigation';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, BASE_URL, ORGANIZATION_ID, SITE_NAME, WEBSITE_ID, buildPublisherSchema } from '@/lib/seo/home-schemas';
import { inferBlogCategory, blogCategoryToArticleSection } from '@/lib/seo/blog-categories';
import { fetchArticleServer } from '@/lib/api/server-fetch';
import ArticleClient from './ArticleClient';

export function generateStaticParams() {
  return []
}

export const dynamicParams = false


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const post = await fetchArticleServer(id);
    if (!post) {
        return { title: 'Article Not Found | LUCKDATE' };
    }

    const title = `${post.title} | LUCKDATE Wellness Journal`;
    const description = post.excerpt || `Read our expert guide on ${post.title}. Discover science-backed insights on longevity, wellness, and premium supplements from LUCKDATE.`;

    return {
        title,
        description,
        keywords: [post.title, SITE_NAME, 'wellness', 'longevity', 'supplements', 'health guide', 'NAD+', 'NMN'],
        alternates: { canonical: `/blog/${id}` },
        openGraph: {
            type: 'article',
            title,
            description,
            url: `/blog/${id}`,
            siteName: SITE_NAME,
            publishedTime: post.date || undefined,
            authors: [post.author || 'LUCKDATE'],
            images: post.coverImage ? [{ url: absoluteUrl(post.coverImage), width: 1200, height: 630, alt: `${post.title} | ${SITE_NAME}` }] : [],
            tags: ['wellness', 'longevity', 'health', 'supplements'],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: post.coverImage ? [absoluteUrl(post.coverImage)] : [],
        },
    };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await fetchArticleServer(id);

    if (!post) {
        notFound();
    }

    const imageUrl = absoluteUrl(post.coverImage);

    const category = inferBlogCategory(post.title);
    const articleSection = blogCategoryToArticleSection(category);

    const articleGraphJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${BASE_URL}/blog/${id}/#article`,
        headline: post.title,
        description: post.excerpt || 'Discover the science behind cellular aging and how modern supplements are revolutionizing longevity.',
        image: imageUrl,
        datePublished: post.date || '2025-10-24',
        dateModified: post.date || '2025-10-24',
        author: { '@type': 'Person', name: post.author || 'LUCKDATE' },
        publisher: buildPublisherSchema(),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/blog/${id}/#webpage`,
            url: `${BASE_URL}/blog/${id}`,
            name: `${post.title} | ${SITE_NAME}`,
            isPartOf: { '@id': WEBSITE_ID },
            primaryImageOfPage: {
                '@type': 'ImageObject',
                url: imageUrl,
                contentUrl: imageUrl,
                name: `${post.title} | ${SITE_NAME}`,
                representativeOfPage: true,
                creator: { '@id': ORGANIZATION_ID },
                creditText: SITE_NAME,
                copyrightHolder: { '@id': ORGANIZATION_ID },
            },
        },
        isPartOf: { '@id': WEBSITE_ID },
        inLanguage: 'en-US',
        articleSection,
        keywords: `${articleSection}, NAD+, longevity, supplements, wellness, LuckDate`,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
                { '@type': 'ListItem', position: 2, name: 'Journal & Guides', item: `${BASE_URL}/blog` },
                { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${id}` },
            ],
        },
    };

    return (
        <div className="min-h-screen bg-[#F7F5F1] noise-overlay">
            <JsonLd data={articleGraphJsonLd} />
            <Navigation />

            <main className="pt-32 pb-20">
                <article className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 max-w-4xl">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-[#6C6763]/60 hover:text-[#D8CBB8] transition-colors mb-12">
                        &larr; Back to Journal
                    </Link>

                    <div className="text-center mb-12">
                        {(post.date || post.author) && (
                        <div className="flex items-center justify-center gap-6 text-sm text-[#6C6763]/40 mb-6">
                            {post.date && (
                                <span className="flex items-center gap-2">
                                    Published: {post.date}
                                </span>
                            )}
                            {post.author && (
                                <span className="flex items-center gap-2">
                                    By {post.author}
                                </span>
                            )}
                        </div>
                        )}
                        <h1 className="text-3xl md:text-5xl font-bold text-[#4E554B] mb-8 leading-tight font-['Montserrat']">
                            {post.title}
                        </h1>
                    </div>

                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#D8CBB8]/20 border-t-[#D8CBB8] rounded-full animate-spin mb-4" />
                            <p className="text-[#6C6763]/60 font-medium">Loading article...</p>
                        </div>
                    }>
                        <ArticleClient post={post} />
                    </Suspense>
                </article>
            </main>
            <UnpaidOrderFloat />
            <Footer />
            <CartDrawer />
        </div>
    );
}
