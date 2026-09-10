'use client';

import { useTranslation } from 'react-i18next';
import { SectionShell, SectionEyebrow, SectionTitle } from './SectionShell';

interface Benefit {
  title: string;
  desc: string;
}

export function BenefitsSection() {
  const { t } = useTranslation();
  const items = t('homeLayout.benefits.items', { returnObjects: true }) as Benefit[];

  return (
    <SectionShell background="ivory">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <SectionEyebrow>{t('homeLayout.benefits.label')}</SectionEyebrow>
          <SectionTitle>{t('homeLayout.benefits.title')}</SectionTitle>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.isArray(items) &&
            items.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 lg:p-8 border border-[#D8CBB8]/20 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-[#4E554B] mb-2 font-['Montserrat']">{item.title}</h3>
                <p className="text-sm text-[#6C6763]/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
        </div>

        <p className="text-center mt-12 text-lg text-[#9A9188] italic">
          &ldquo;{t('homeLayout.benefits.quote')}&rdquo;
        </p>
      </div>
    </SectionShell>
  );
}
