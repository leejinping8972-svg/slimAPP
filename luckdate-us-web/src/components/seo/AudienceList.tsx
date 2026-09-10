'use client';

import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

export default function AudienceList() {
  const { t } = useTranslation();
  const items = t('geoSeo.audience.items', { returnObjects: true }) as string[];

  return (
    <section id="geo-audience" className="py-12 lg:py-16 bg-[#F7F5F1]">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-5 h-5 text-[#9A9188]" />
          <h2 className="text-2xl font-bold text-[#4E554B] font-['Montserrat']">
            {t('geoSeo.audience.title')}
          </h2>
        </div>
        <ul className="space-y-3">
          {Array.isArray(items) &&
            items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[#6C6763]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8CBB8] mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
