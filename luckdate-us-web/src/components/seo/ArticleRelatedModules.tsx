'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function ArticleRelatedModules() {
  const { t } = useTranslation();
  const links = t('geoSeo.blog.relatedModules', { returnObjects: true }) as {
    label: string;
    href: string;
  }[];

  if (!Array.isArray(links) || links.length === 0) return null;

  return (
    <aside className="mt-12 pt-8 border-t border-[#4E554B]/10">
      <h2 className="text-lg font-semibold text-[#4E554B] mb-4 font-['Montserrat']">
        {t('geoSeo.blog.relatedModulesTitle')}
      </h2>
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex px-4 py-2 rounded-full bg-[#F7F5F1] text-sm font-medium text-[#6C6763] hover:bg-[#D8CBB8]/30 hover:text-[#4E554B] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
