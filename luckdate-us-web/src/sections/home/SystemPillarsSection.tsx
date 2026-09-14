'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import systemProductsImage from '@/assets/home/luckdate-system-products.png';
import heroLifestyleImage from '@/assets/home/luckdate-hero-lifestyle.png';
import brandStoryImage from '@/assets/home/luckdate-brand-story.png';
import { SectionEyebrow } from './SectionShell';

interface Pillar {
  num: string;
  name: string;
  role: string;
  desc: string;
}

const PILLAR_IMAGES = [systemProductsImage, heroLifestyleImage, brandStoryImage];

export function SystemPillarsSection() {
  const { t } = useTranslation();
  const pillars = t('homeLayout.method.pillars', { returnObjects: true }) as Pillar[];
  const [active, setActive] = useState(0);
  const safePillars = Array.isArray(pillars) ? pillars : [];
  const current = safePillars[active] ?? safePillars[0];
  const currentImage = PILLAR_IMAGES[active] ?? systemProductsImage;

  if (!current) return null;

  return (
    <section id="wellness-system" className="bg-[var(--brand-cloud-ivory)] py-14 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <SectionEyebrow>{t('homeLayout.method.label')}</SectionEyebrow>
            <h2 className="mt-2 max-w-[18ch] font-['Montserrat'] text-3xl font-bold leading-[1.12] text-[var(--brand-deep-olive)] sm:text-4xl break-words">
              {t('homeLayout.method.title')}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--brand-midnight-taupe)]/85">
              {t('homeLayout.method.subtitle')}
            </p>

            <div
              className="mt-8 flex flex-wrap gap-2"
              role="tablist"
              aria-label={t('homeLayout.method.label')}
            >
              {safePillars.map((pillar, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={pillar.num}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                      isActive
                        ? 'bg-[var(--brand-deep-olive)] text-white'
                        : 'bg-white text-[var(--brand-deep-olive)] ring-1 ring-[var(--brand-moon-beige)]/50 hover:bg-white/80'
                    }`}
                  >
                    {pillar.role}
                  </button>
                );
              })}
            </div>

            <div
              key={current.num}
              role="tabpanel"
              className="mt-8 border-t border-[var(--brand-moon-beige)]/40 pt-6 animate-in fade-in duration-500"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-gold-accent)]">
                {current.num} 路 {current.role}
              </p>
              <h3 className="mt-2 font-['Montserrat'] text-2xl font-bold text-[var(--brand-deep-olive)]">
                {current.name}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--brand-midnight-taupe)]/80">
                {current.desc}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--brand-deep-olive)] sm:aspect-[16/11]">
              <Image
                key={current.num}
                src={currentImage}
                alt={current.name}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(42,64,53,0.75)] to-transparent p-5 sm:p-7">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand-moon-beige)]">
                  {t('homeLayout.method.productCaption')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
