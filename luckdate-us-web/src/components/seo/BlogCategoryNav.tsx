'use client';

import { useTranslation } from 'react-i18next';
import {
  BLOG_CATEGORY_IDS,
  BLOG_CATEGORY_LABEL_KEYS,
  type BlogCategoryId,
} from '@/lib/seo/blog-categories';

interface BlogCategoryNavProps {
  active: BlogCategoryId;
  onChange: (category: BlogCategoryId) => void;
}

export default function BlogCategoryNav({ active, onChange }: BlogCategoryNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="flex flex-wrap justify-center gap-2 mb-12" aria-label="Blog categories">
      {BLOG_CATEGORY_IDS.map((id) => {
        const label =
          id === 'all'
            ? t('geoSeo.blog.categories.all')
            : t(BLOG_CATEGORY_LABEL_KEYS[id]);
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#4E554B] text-white'
                : 'bg-white text-[#6C6763] border border-[#4E554B]/10 hover:border-[#D8CBB8]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
