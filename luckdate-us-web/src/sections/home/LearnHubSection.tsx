'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import type { ArticleDisplay } from '@/lib/api/mappers';
import { SectionShell, SectionEyebrow, SectionTitle, PillButton } from './SectionShell';

interface Category {
  name: string;
  count: number;
}

interface LearnHubSectionProps {
  articles: ArticleDisplay[];
}

export function LearnHubSection({ articles }: LearnHubSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const categories = t('homeLayout.learnHub.categories', { returnObjects: true }) as Category[];

  return (
    <SectionShell background="white" id="learn-hub">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <SectionEyebrow>{t('homeLayout.learnHub.label')}</SectionEyebrow>
            <SectionTitle className="mb-2">{t('homeLayout.learnHub.title')}</SectionTitle>
            <p className="text-[#6C6763]/80 max-w-xl">{t('homeLayout.learnHub.subtitle')}</p>
          </div>
          <PillButton variant="outline" onClick={() => router.push('/blog')}>
            {t('homeLayout.learnHub.cta')}
          </PillButton>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <Link
                key={cat.name}
                href="/blog"
                className="px-4 py-2 rounded-full bg-[#F7F5F1] text-sm text-[#4E554B] hover:bg-[#D8CBB8]/30 transition-colors"
              >
                {cat.name}
                <span className="text-[#9A9188] ml-1">{cat.count}</span>
              </Link>
            ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {articles.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.id}`}
              className="group rounded-2xl bg-[#F7F5F1] overflow-hidden hover:shadow-lg transition-shadow"
            >
              {article.coverImage && (
                <div
                  className="aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${article.coverImage})` }}
                />
              )}
              <div className="p-4 lg:p-5">
                <p className="text-xs uppercase tracking-wider text-[#9A9188] mb-2">
                  {article.category || 'Insight'}
                </p>
                <h3 className="font-bold text-[#4E554B] group-hover:text-[#9A9188] transition-colors font-['Montserrat']">
                  {article.title}
                </h3>
                <p className="text-xs text-[#9A9188] mt-2">{article.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
