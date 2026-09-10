'use client';

import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';

export default function GeoFaqSection() {
  const { t } = useTranslation();
  const items = t('geoSeo.geoFaq.items', { returnObjects: true }) as {
    question: string;
    answer: string;
  }[];

  return (
    <section
      id="geo-faq"
      className="py-16 lg:py-20 bg-[#F7F5F1]"
      style={{ scrollMarginTop: '110px' }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-6 h-6 text-[#9A9188]" />
          <h2 className="text-3xl font-bold text-[#4E554B] font-['Montserrat']">
            {t('geoSeo.geoFaq.title')}
          </h2>
        </div>
        <div className="space-y-6">
          {Array.isArray(items) &&
            items.map((item) => (
              <article key={item.question} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#4E554B] mb-3 font-['Montserrat']">
                  {item.question}
                </h3>
                <p className="text-[#6C6763] leading-relaxed">{item.answer}</p>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}
