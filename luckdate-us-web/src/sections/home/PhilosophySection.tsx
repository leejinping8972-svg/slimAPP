'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import aboutImage from '@/assets/about-image.jpg';
import { SectionShell, SectionEyebrow, SectionTitle } from './SectionShell';

export function PhilosophySection() {
  const { t } = useTranslation();
  const points = t('homeLayout.philosophy.points', { returnObjects: true }) as string[];

  return (
    <SectionShell background="ivory">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-square max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={aboutImage}
            alt="Why we built LuckDate"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 80vw, 40vw"
          />
        </div>

        <div>
          <SectionEyebrow>{t('homeLayout.philosophy.label')}</SectionEyebrow>
          <SectionTitle className="mb-4">{t('homeLayout.philosophy.title')}</SectionTitle>
          <p className="text-[#6C6763]/80 leading-relaxed mb-8">{t('homeLayout.philosophy.subtitle')}</p>

          <ul className="space-y-3">
            {Array.isArray(points) &&
              points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[#4E554B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8CBB8] shrink-0" />
                  <span className="text-sm font-medium">{point}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
