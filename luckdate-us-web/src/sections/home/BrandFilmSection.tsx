'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import lightBodyImage from '@/assets/home/products/slim-vitality-flavors.png';
import healthyAgingImage from '@/assets/home/products/gut-balance-hero.png';
import { SectionEyebrow } from './SectionShell';

const VISUAL_IMAGES = [lightBodyImage, healthyAgingImage];

export function BrandFilmSection() {
  const { t } = useTranslation();
  const visuals = t('homeLayout.results.visuals', { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];

  return (
    <section id="daily-results" className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-12 lg:py-20 xl:px-20">
        <div className="max-w-2xl">
          <SectionEyebrow>{t('homeLayout.results.label')}</SectionEyebrow>
          <h2 className="mt-2 font-['Montserrat'] text-3xl font-bold leading-[1.12] text-[#3D4638] sm:text-4xl lg:text-[2.75rem] break-words">
            {t('homeLayout.results.title')}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#6C6763]/90">
            {t('homeLayout.results.subtitle')}
          </p>
        </div>
      </div>

      {Array.isArray(visuals) &&
        visuals.map((visual, i) => {
          const img = VISUAL_IMAGES[i] ?? lightBodyImage;
          const imageFirst = i % 2 === 1;

          return (
            <div key={visual.title} className="grid min-h-[min(64vh,580px)] lg:grid-cols-2">
              <div
                className={`relative min-h-[300px] ${imageFirst ? 'lg:order-1' : 'lg:order-2'} ${
                  i === 0 ? 'bg-[#E8EDE4]' : 'bg-[#F0EDE7]'
                }`}
              >
                <Image
                  src={img}
                  alt={visual.title}
                  fill
                  className="object-contain p-6 sm:p-10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div
                className={`flex flex-col justify-center bg-[#F7F5F1] px-6 py-12 sm:px-10 lg:px-16 xl:px-20 ${
                  imageFirst ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 max-w-[16ch] font-['Montserrat'] text-2xl font-bold leading-tight text-[#3D4638] sm:text-3xl break-words">
                  {visual.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6C6763]/85">{visual.desc}</p>
              </div>
            </div>
          );
        })}

      <div className="mx-auto flex w-full max-w-7xl justify-start px-4 py-10 sm:px-6 lg:px-12 xl:px-20">
        <Link
          href="#featured-solutions"
          className="text-sm font-semibold text-[#3D4638] underline decoration-[#B59461] underline-offset-4 transition-opacity hover:opacity-70"
        >
          {t('homeLayout.brandFilm.cta')}
        </Link>
      </div>
    </section>
  );
}
