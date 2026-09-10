'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import slimImage from '@/assets/home/products/slim-vitality-14day-kit.png';
import gutImage from '@/assets/home/products/gut-balance-hero.png';
import { SectionEyebrow } from './SectionShell';

interface FeaturedProduct {
  title: string;
  tagline: string;
  bullets: string[];
  ctaBuy: string;
  ctaLearn: string;
  buyHref: string;
  learnHref: string;
  accent: string;
}

const PRODUCT_IMAGES = [slimImage, gutImage];

export function ReframeSection() {
  const { t } = useTranslation();
  const products = t('homeLayout.featured.products', { returnObjects: true }) as FeaturedProduct[];

  return (
    <section id="featured-solutions" className="bg-white py-14 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionEyebrow>{t('homeLayout.featured.label')}</SectionEyebrow>
            <h2 className="mt-2 font-['Montserrat'] text-3xl font-bold leading-[1.12] text-[#3D4638] sm:text-4xl break-words">
              {t('homeLayout.featured.title')}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6C6763]/90">
              {t('homeLayout.featured.subtitle')}
            </p>
          </div>
          <Link
            href="/products"
            className="shrink-0 text-sm font-semibold text-[#3D4638] underline decoration-[#B59461] underline-offset-4 transition-opacity hover:opacity-70"
          >
            Shop all
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:gap-7">
          {Array.isArray(products) &&
            products.map((product, i) => {
              const img = PRODUCT_IMAGES[i] ?? slimImage;
              const isSage = product.accent === 'sage' || product.accent === 'green';
              const bullets = Array.isArray(product.bullets) ? product.bullets.slice(0, 4) : [];

              return (
                <article
                  key={product.title}
                  className="group flex min-w-0 flex-col overflow-hidden bg-[#F7F5F1]"
                >
                  <div
                    className={`relative aspect-[5/4] overflow-hidden ${
                      isSage ? 'bg-[#E8EDE4]' : 'bg-[#F0EDE7]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={product.title}
                      fill
                      className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03] sm:p-6"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i === 0}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="font-['Montserrat'] text-xl font-bold text-[#3D4638] sm:text-2xl">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#6C6763]/85">{product.tagline}</p>
                    {bullets.length > 0 && (
                      <ul className="mt-4 space-y-2 text-sm text-[#6C6763]/80">
                        {bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2">
                            <span
                              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                                isSage ? 'bg-[#6B7A62]' : 'bg-[#B59461]'
                              }`}
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <Link
                        href={product.buyHref || '/products'}
                        className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 ${
                          isSage ? 'bg-[#6B7A62]' : 'bg-[#3D4638]'
                        }`}
                      >
                        {product.ctaBuy}
                      </Link>
                      <Link
                        href={product.learnHref || '/blog'}
                        className="inline-flex items-center justify-center border border-[#3D4638]/25 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-[#3D4638] transition-colors hover:bg-white"
                      >
                        {product.ctaLearn}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}
