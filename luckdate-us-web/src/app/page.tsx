import { fetchHomePageData } from '@/lib/api/server-fetch';
import { HomePage } from '@/components/HomePage';
import JsonLd from '@/components/JsonLd';
import { buildHomePageJsonLd } from '@/lib/seo/home-jsonld';

export default async function Page() {
    const { products, articles, faqs, banners } = await fetchHomePageData();
    const homeJsonLd = buildHomePageJsonLd(products, articles, faqs);

    return (
        <>
            <JsonLd data={homeJsonLd} />
            <h1 className="sr-only">LUCKDATE — Stay Young Longer with Premium Wellness Supplements</h1>
            <HomePage
                initialProducts={products}
                initialArticles={articles}
                initialFaqs={faqs}
                initialBanners={banners}
            />
        </>
    );
}
