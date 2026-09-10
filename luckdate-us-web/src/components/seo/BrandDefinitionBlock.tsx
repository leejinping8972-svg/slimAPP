'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

export default function BrandDefinitionBlock() {
  const { t } = useTranslation();
  const modules = t('geoSeo.brandDefinition.modules', { returnObjects: true }) as {
    id: string;
    title: string;
    description: string;
    href: string;
  }[];

  return (
    <section
      id="geo-brand-definition"
      className="py-16 lg:py-20 bg-white"
      style={{ scrollMarginTop: '110px' }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#9A9188] mb-3">
          {t('geoSeo.tagline')}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#4E554B] font-['Montserrat'] mb-6">
          {t('geoSeo.brandDefinition.title')}
        </h2>
        <p className="text-lg text-[#6C6763] leading-relaxed mb-10">
          {t('geoSeo.brandDefinition.summary')}
        </p>
        <h3 className="text-xl font-semibold text-[#4E554B] mb-6 font-['Montserrat']">
          {t('geoSeo.brandDefinition.modulesTitle')}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.isArray(modules) &&
            modules.map((mod) => (
              <Link
                key={mod.id}
                href={mod.href}
                className="group rounded-2xl border border-[#4E554B]/10 bg-[#F7F5F1] p-6 hover:border-[#D8CBB8] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#9A9188]" />
                  <span className="font-semibold text-[#4E554B] group-hover:text-[#9A9188] transition-colors">
                    {mod.title}
                  </span>
                </div>
                <p className="text-sm text-[#6C6763] leading-relaxed">{mod.description}</p>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
