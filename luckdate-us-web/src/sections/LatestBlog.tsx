'use client';

import { useTranslation } from 'react-i18next';
import type { ArticleDisplay } from '@/lib/api/mappers';
import SwiperBlogCarousel from '@/components/SwiperBlogCarousel';

interface LatestBlogProps {
  articles: ArticleDisplay[];
}

const LatestBlog = ({ articles: blogPosts }: LatestBlogProps) => {
    const { t } = useTranslation();

    return (
        <section className="py-12 lg:py-16 bg-white">
            <div className="w-full">

                <SwiperBlogCarousel
                    posts={blogPosts}
                    title={t('latestBlog.title')}
                    showViewAllLink={true}
                />

            </div>
        </section>
    );
};

export default LatestBlog;
