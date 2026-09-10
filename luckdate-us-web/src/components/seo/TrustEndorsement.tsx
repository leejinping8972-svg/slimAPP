'use client';

import { useTranslation } from 'react-i18next';
import { Award, ShieldCheck } from 'lucide-react';

export default function TrustEndorsement() {
  const { t } = useTranslation();
  const items = t('geoSeo.trust.items', { returnObjects: true }) as string[];

  return (
    <section id="geo-trust" className="py-12 lg:py-16 bg-white border-y border-[#4E554B]/5">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-5 h-5 text-[#9A9188]" />
          <h2 className="text-2xl font-bold text-[#4E554B] font-['Montserrat']">
            {t('geoSeo.trust.title')}
          </h2>
        </div>
        <ul className="grid sm:grid-cols-2 gap-4">
          {Array.isArray(items) &&
            items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl bg-[#F7F5F1] p-4 text-[#6C6763] text-sm leading-relaxed"
              >
                <ShieldCheck className="w-4 h-4 text-[#9A9188] mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
