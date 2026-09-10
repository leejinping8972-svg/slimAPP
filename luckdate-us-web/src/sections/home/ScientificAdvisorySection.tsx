'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Microscope,
  BookOpen,
  ShieldCheck,
  X,
  FlaskConical,
  FileSearch,
  BadgeCheck,
  Factory,
  Scale,
  ExternalLink,
  ArrowRight,
  Sun,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import professorImage from '@/assets/home/professor-ciechanover.jpg';
import labImage from '@/assets/home/lab-scientist.jpg';

interface AdvisoryItem {
  title: string;
  desc: string;
}

const ADVISE_ICONS: LucideIcon[] = [Microscope, BookOpen, ShieldCheck];
const STANDARD_ICONS: LucideIcon[] = [FlaskConical, FileSearch, BadgeCheck, Factory, Scale];

export function ScientificAdvisorySection() {
  const { t } = useTranslation();
  const router = useRouter();

  const hero = {
    eyebrow: t('homeLayout.scientificAdvisory.hero.eyebrow'),
    name: t('homeLayout.scientificAdvisory.hero.name'),
    title: t('homeLayout.scientificAdvisory.hero.title'),
    bio: t('homeLayout.scientificAdvisory.hero.bio'),
    cta: t('homeLayout.scientificAdvisory.hero.cta'),
    ctaHref: t('homeLayout.scientificAdvisory.hero.ctaHref'),
  };

  const advisesTitle = t('homeLayout.scientificAdvisory.advises.title');
  const advises = t('homeLayout.scientificAdvisory.advises.items', {
    returnObjects: true,
  }) as AdvisoryItem[];

  const notMeansTitle = t('homeLayout.scientificAdvisory.notMeans.title');
  const notMeans = t('homeLayout.scientificAdvisory.notMeans.items', {
    returnObjects: true,
  }) as string[];

  const standardsTitle = t('homeLayout.scientificAdvisory.standards.title');
  const standards = t('homeLayout.scientificAdvisory.standards.items', {
    returnObjects: true,
  }) as string[];
  const standardsCta = t('homeLayout.scientificAdvisory.standards.cta');
  const standardsHref = t('homeLayout.scientificAdvisory.standards.ctaHref');

  const quote = t('homeLayout.scientificAdvisory.quote.text');
  const attribution = t('homeLayout.scientificAdvisory.quote.attribution');

  const journalTitle = t('homeLayout.scientificAdvisory.journal.title');
  const journalDesc = t('homeLayout.scientificAdvisory.journal.desc');
  const journalCta = t('homeLayout.scientificAdvisory.journal.cta');
  const journalHref = t('homeLayout.scientificAdvisory.journal.ctaHref');

  const go = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    router.push(href);
  };

  return (
    <div id="scientific-advisory" className="bg-[#F9F7F2]">
      {/* 1. Advisor hero */}
      <section className="bg-[#2A4035] text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="grid lg:grid-cols-[minmax(240px,320px)_1fr] gap-8 lg:gap-12 items-center">
            <div className="relative aspect-[4/5] max-w-[320px] mx-auto lg:mx-0 w-full overflow-hidden rounded-2xl bg-[#1E2F27]">
              <Image
                src={professorImage}
                alt={hero.name}
                fill
                className="object-cover object-top"
                sizes="320px"
                priority
              />
            </div>

            <div className="text-center lg:text-left">
              <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/55 mb-3">
                {hero.eyebrow}
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-[2.65rem] font-medium leading-tight mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {hero.name}
              </h2>
              <p className="text-sm text-white/70 mb-5">{hero.title}</p>
              <p className="text-sm sm:text-[15px] text-white/75 leading-relaxed max-w-2xl mb-7 mx-auto lg:mx-0">
                {hero.bio}
              </p>
              <Link
                href={hero.ctaHref}
                className="inline-flex items-center gap-2 bg-white text-[#2A4035] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#F7F5F1] transition-colors"
              >
                {hero.cta}
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What he advises */}
      <section className="py-12 lg:py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <h3
            className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#2C322E] text-center mb-10 lg:mb-12"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {advisesTitle}
          </h3>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
            {Array.isArray(advises) &&
              advises.map((item, i) => {
                const Icon = ADVISE_ICONS[i] ?? Microscope;
                return (
                  <div
                    key={item.title}
                    className={`text-center px-2 ${
                      i < advises.length - 1 ? 'md:border-r md:border-[#2A4035]/10' : ''
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full border border-[#2A4035]/15 flex items-center justify-center mx-auto mb-4 text-[#2A4035]">
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-lg font-semibold text-[#2C322E] mb-2">{item.title}</h4>
                    <p className="text-sm text-[#6C6763] leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* 3. What this role does not mean */}
      <section className="pb-12 lg:pb-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="rounded-2xl bg-[#EDE8DF] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <h3
              className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#2C322E] text-center mb-8 lg:mb-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {notMeansTitle}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {Array.isArray(notMeans) &&
                notMeans.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full border border-[#2A4035]/25 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-[#6C6763]" strokeWidth={2.5} />
                    </span>
                    <p className="text-sm text-[#6C6763] leading-relaxed">{item}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Science standards */}
      <section className="py-12 lg:py-16 bg-[#F9F7F2] border-t border-[#2A4035]/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <h3
                className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#2C322E] mb-8"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {standardsTitle}
              </h3>
              <ul className="space-y-5 mb-8">
                {Array.isArray(standards) &&
                  standards.map((item, i) => {
                    const Icon = STANDARD_ICONS[i] ?? BadgeCheck;
                    return (
                      <li key={item} className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-[#2A4035] shrink-0 mt-0.5" strokeWidth={1.75} />
                        <span className="text-sm sm:text-[15px] text-[#2C322E]/85 leading-relaxed">{item}</span>
                      </li>
                    );
                  })}
              </ul>
              <button
                type="button"
                onClick={() => go(standardsHref)}
                className="inline-flex items-center gap-2 border border-[#2A4035]/35 text-[#2A4035] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#2A4035]/5 transition-colors"
              >
                {standardsCta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[16/10] sm:aspect-[5/3] rounded-2xl overflow-hidden bg-[#E8F0EA]">
              <Image
                src={labImage}
                alt="Luckdate science and quality standards"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Quote + journal */}
      <section className="bg-[#EDE8DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 py-12 lg:py-14 items-center relative overflow-hidden">
            <div className="relative z-10">
              <span
                className="block text-5xl sm:text-6xl text-[#2A4035]/20 leading-none mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                &ldquo;
              </span>
              <blockquote
                className="text-lg sm:text-xl lg:text-2xl text-[#2C322E] leading-relaxed mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {quote}
              </blockquote>
              <p className="text-sm text-[#6C6763]">{attribution}</p>
            </div>

            <div className="relative z-10 lg:pl-6">
              <h3
                className="text-2xl sm:text-3xl font-medium text-[#2C322E] mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {journalTitle}
              </h3>
              <p className="text-sm text-[#6C6763] leading-relaxed mb-6 max-w-md">{journalDesc}</p>
              <Link
                href={journalHref}
                className="inline-flex items-center justify-center bg-[#2A4035] text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#1E2F27] transition-colors"
              >
                {journalCta}
              </Link>
            </div>

            <Sun
              className="hidden lg:block absolute -right-4 bottom-0 w-40 h-40 text-[#2A4035]/10 pointer-events-none"
              strokeWidth={0.75}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
