'use client';

import { useTranslation } from 'react-i18next';
import {
  GlassWater,
  RefreshCw,
  Smile,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { SectionEyebrow } from './SectionShell';

interface Step {
  num: string;
  title: string;
  desc: string;
}

const STEP_ICONS: LucideIcon[] = [GlassWater, RefreshCw, Smile, Smartphone];

export function DailyRitualSection() {
  const { t } = useTranslation();
  const steps = t('homeLayout.ritual.steps', { returnObjects: true }) as Step[];

  return (
    <section id="daily-ritual" className="bg-[#F7F5F1] py-14 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="max-w-2xl">
          <SectionEyebrow>{t('homeLayout.ritual.label')}</SectionEyebrow>
          <h2 className="mt-2 font-['Montserrat'] text-3xl font-bold leading-[1.12] text-[#3D4638] sm:text-4xl break-words">
            {t('homeLayout.ritual.title')}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#6C6763]/90">
            {t('homeLayout.ritual.subtitle')}
          </p>
        </div>

        {Array.isArray(steps) && steps.length > 0 && (
          <ol className="mt-12 grid gap-0 border-t border-[#D8CBB8]/55 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? GlassWater;
              return (
                <li
                  key={step.num}
                  className="border-b border-[#D8CBB8]/55 py-7 sm:border-r sm:px-5 lg:px-6 [&:nth-child(2)]:sm:border-r-0 lg:[&:nth-child(2)]:border-r lg:[&:nth-child(4)]:border-r-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold tracking-[0.16em] text-[#6B7A62]">
                      {step.num}
                    </span>
                    <Icon className="h-4 w-4 text-[#3D4638]" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-['Montserrat'] text-lg font-bold text-[#3D4638]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6C6763]/80">{step.desc}</p>
                </li>
              );
            })}
          </ol>
        )}

        <p className="mt-8 text-sm text-[#9A9188]">{t('homeLayout.ritual.closing')}</p>
      </div>
    </section>
  );
}
