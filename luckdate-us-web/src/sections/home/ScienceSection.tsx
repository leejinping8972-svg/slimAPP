'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Award,
  ShieldCheck,
  Leaf,
  FlaskConical,
  FileText,
  ExternalLink,
  Download,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import fdaPreview from '@/assets/certified/fda-innova-registration.png';
import { SectionShell, SectionEyebrow, SectionTitle } from './SectionShell';

interface SciencePillar {
  title: string;
  desc: string;
  actionLabel?: string;
  actionHref?: string;
}

interface FactoryCert {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  type: 'image' | 'pdf';
}

const PILLAR_ICONS: LucideIcon[] = [Award, ShieldCheck, Leaf, FlaskConical];

const ICON_STYLES = [
  { wrap: 'bg-[#FAF6EE] ring-1 ring-[#E8D5A3]/50', color: 'text-[#B8860B]' },
  { wrap: 'bg-[#E8F0E4] ring-1 ring-[#A8C4A0]/40', color: 'text-[#5A7A52]' },
  { wrap: 'bg-[#F0E0B8]/35 ring-1 ring-[#E8D5A3]/40', color: 'text-[#8B7355]' },
  { wrap: 'bg-white ring-1 ring-[#E8D5A3]/35', color: 'text-[#4E554B]' },
];

const CERT_PREVIEWS: Record<string, typeof fdaPreview | null> = {
  fda: fdaPreview,
};

function navigateHref(href: string, router: ReturnType<typeof useRouter>) {
  if (href.startsWith('#')) {
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  router.push(href);
}

export function ScienceSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const pillars = t('homeLayout.science.pillars', { returnObjects: true }) as SciencePillar[];
  const certifications = t('homeLayout.science.certifications', {
    returnObjects: true,
  }) as FactoryCert[];

  return (
    <SectionShell background="ivory" id="scientific-background">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8 lg:mb-10">
          <SectionEyebrow>{t('homeLayout.science.label')}</SectionEyebrow>
          <SectionTitle className="mb-3">{t('homeLayout.science.title')}</SectionTitle>
          <p className="text-sm text-[#6C6763]/80 leading-relaxed mb-4">{t('homeLayout.science.subtitle')}</p>
          <button
            type="button"
            onClick={() => router.push('/about')}
            className="text-sm font-semibold text-[#B8860B] hover:text-[#9A7B2F] transition-colors"
          >
            {t('homeLayout.science.cta')}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-12">
          {Array.isArray(pillars) &&
            pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[i] ?? Award;
              const iconStyle = ICON_STYLES[i] ?? ICON_STYLES[0];

              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-2xl p-5 lg:p-6 border border-[#E8D5A3]/30 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${iconStyle.wrap}`}
                  >
                    <Icon className={`w-5 h-5 ${iconStyle.color}`} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-[#4E554B] mb-2 text-sm font-['Montserrat']">{pillar.title}</h3>
                  <p className="text-xs text-[#6C6763]/70 leading-relaxed flex-1">{pillar.desc}</p>

                  {pillar.actionLabel && pillar.actionHref && (
                    <div className="mt-4 pt-3 border-t border-[#E8D5A3]/25">
                      <button
                        type="button"
                        onClick={() => navigateHref(pillar.actionHref!, router)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#B8860B] hover:text-[#9A7B2F] transition-colors"
                      >
                        {pillar.actionLabel}
                        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {Array.isArray(certifications) && certifications.length > 0 && (
          <div id="factory-certifications">
            <div className="text-center mb-6 lg:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#4E554B] font-['Montserrat'] mb-2">
                {t('homeLayout.science.certificationsTitle')}
              </h3>
              <p className="text-sm text-[#6C6763]/80 max-w-2xl mx-auto">
                {t('homeLayout.science.certificationsSubtitle')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {certifications.map((cert) => {
                const preview = CERT_PREVIEWS[cert.id];
                const downloadName = cert.file.split('/').pop() ?? 'certificate';

                return (
                  <article
                    key={cert.id}
                    className="bg-white rounded-2xl border border-[#E8D5A3]/35 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                  >
                    <a
                      href={cert.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-[4/3] bg-[#F7F5F1] border-b border-[#E8D5A3]/25 group"
                    >
                      {preview ? (
                        <Image
                          src={preview}
                          alt={cert.title}
                          fill
                          className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#9A9188] p-4">
                          <FileText className="w-10 h-10 text-[#D4AF5A]" strokeWidth={1.5} />
                          <span className="text-xs font-medium uppercase tracking-wider">PDF Certificate</span>
                        </div>
                      )}
                    </a>

                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-bold text-[#4E554B] text-sm font-['Montserrat'] mb-1 leading-snug">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-[#6C6763]/70 leading-relaxed mb-4 flex-1">{cert.subtitle}</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={cert.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4E554B] bg-[#F7F5F1] hover:bg-[#FAF6EE] border border-[#E8D5A3]/40 rounded-full px-2.5 py-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" strokeWidth={2} />
                          View
                        </a>
                        <a
                          href={cert.file}
                          download={downloadName}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B8860B] bg-[#FAF6EE] hover:bg-[#F0E0B8]/40 border border-[#E8D5A3]/40 rounded-full px-2.5 py-1.5 transition-colors"
                        >
                          <Download className="w-3 h-3" strokeWidth={2} />
                          Download
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-[#9A9188] mt-8">{t('homeLayout.science.complianceNote')}</p>
      </div>
    </SectionShell>
  );
}
