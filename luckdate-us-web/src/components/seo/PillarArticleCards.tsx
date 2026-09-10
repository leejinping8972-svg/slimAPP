'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

export default function PillarArticleCards() {
  const { t } = useTranslation();
  const pillars = t('geoSeo.blog.pillars', { returnObjects: true }) as {
    title: string;
    description: string;
    href: string;
  }[];

  if (!Array.isArray(pillars) || pillars.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-[#4E554B] font-['Montserrat'] mb-6 text-center">
        {t('geoSeo.blog.pillarTitle')}
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {pillars.map((pillar) => (
          <Link
            key={pillar.title}
            href={pillar.href}
            className="group bg-white rounded-2xl p-6 border border-[#4E554B]/5 hover:border-[#D8CBB8] transition-all hover:-translate-y-1 shadow-sm"
          >
            <h3 className="font-semibold text-[#4E554B] mb-2 group-hover:text-[#9A9188] transition-colors font-['Montserrat']">
              {pillar.title}
            </h3>
            <p className="text-sm text-[#6C6763] mb-4 leading-relaxed">{pillar.description}</p>
            <span className="inline-flex items-center text-sm font-medium text-[#9A9188]">
              Read more <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
