'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Suspense } from 'react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import { GlobalCoupon } from '@/components/GlobalCoupon';
import heroImage from '@/assets/about/hero-wellness.jpg';
import pillarFitoo from '@/assets/about/pillar-fitoo.jpg';
import pillarVitality from '@/assets/about/pillar-vitality.jpg';
import pillarApp from '@/assets/about/pillar-app.jpg';
import pillarSupport from '@/assets/about/pillar-support.jpg';
import commitmentsImage from '@/assets/about/commitments-quality.jpg';
import professorImg from '@/assets/home/professor-ciechanover.jpg';
import certFda from '@/assets/home/certs/fda.png';
import certGmp from '@/assets/home/certs/gmp.png';
import certUsda from '@/assets/home/certs/usda.png';
import certHalal from '@/assets/home/certs/halal.png';
import certKosher from '@/assets/home/certs/kosher.png';
import certNonGmo from '@/assets/home/certs/non-gmo.png';

const PRESS_URL =
  'https://www.healthcarebusinesstoday.com/nobel-laureate-aaron-ciechanover-serves-as-chief-consulting-scientist-to-luckdate/';

const PILLARS = [
  {
    title: 'Fitoo',
    body: 'Meal replacement and light body management support for sustainable daily nutrition.',
    image: pillarFitoo,
    alt: 'Daily nutrition shake ritual for light body management',
  },
  {
    title: 'NMN & Vitality',
    body: 'Long-term vitality formulas aligned with healthy aging and cellular wellness goals.',
    image: pillarVitality,
    alt: 'Morning vitality supplement ritual',
  },
  {
    title: 'LuckDate App',
    body: 'Track routines, progress, and habits so wellness becomes measurable — not guesswork.',
    image: pillarApp,
    alt: 'Wellness habit tracking on a phone',
  },
  {
    title: 'Professional support',
    body: 'Guidance to reduce choice anxiety and help you stay consistent every day.',
    image: pillarSupport,
    alt: 'Nutrition consultation notes and guidance',
  },
] as const;

const TRUST = [
  'Operated by Luckdate Health Glow LLC',
  'Factory documents include FDA food facility registration, GMP, and HACCP certificates',
  'Product pages and guides describe formulas, intended use, and wellness positioning',
  '30-day satisfaction guarantee and customer support for orders',
] as const;

const CERTS = [
  { src: certUsda, label: 'USDA' },
  { src: certFda, label: 'FDA' },
  { src: certGmp, label: 'GMP' },
  { src: certHalal, label: 'Halal' },
  { src: certKosher, label: 'Kosher' },
  { src: certNonGmo, label: 'Non-GMO' },
] as const;

/**
 * ARMRA-inspired Our Story — LuckDate content + Nobel science collaboration.
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F1]">
      <h1 className="sr-only">Our Story | luckdate</h1>
      <Navigation />

      <main id="about-content" className="pt-[4.5rem]">
        {/* Full-bleed hero */}
        <section className="relative aspect-[16/10] min-h-[280px] w-full overflow-hidden sm:min-h-[380px] lg:aspect-[21/9] lg:min-h-[460px]">
          <Image
            src={heroImage}
            alt="Calm river landscape — wellness that starts from within"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </section>

        {/* Manifesto */}
        <section className="relative overflow-hidden bg-[#E8EDE6]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(245,228,170,0.35)_0%,transparent_55%)]"
          />
          <div className="relative mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6B7A62]">
              Our Story
            </p>
            <h2 className="mt-4 font-['Montserrat'] text-[2.15rem] font-bold italic leading-[1.1] tracking-[-0.03em] text-[#111111] sm:text-5xl lg:text-[3.25rem]">
              Wellness From Within
            </h2>
            <p className="mt-6 text-base font-medium text-[#1E261C] sm:text-lg">
              We&apos;re building daily routines you can keep — not another short-term plan.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-[#333333] sm:text-[15px]">
              At luckdate, we believe that true wellness starts from within. Founded with a passion
              for helping people live healthier, more vibrant lives, we create premium,
              science-backed supplements that deliver real results — and make them accessible for
              everyday routines.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#333333] sm:text-[15px]">
              Our journey began with a simple mission: high-quality wellness products that are
              easy to keep. Today we offer a connected system spanning light body management,
              long-term vitality support, app tracking, and nutritionist guidance.
            </p>
            <p className="mt-8 font-['Montserrat'] text-lg font-bold text-[#1E261C] sm:text-xl">
              We&apos;re luckdate. Wellness you can keep.
            </p>
          </div>
        </section>

        {/* Nobel collaboration */}
        <section id="science" className="border-y border-[#1E261C]/08 bg-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:py-20 xl:px-16">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8E0] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[480px]">
              <Image
                src={professorImg}
                alt="Professor Aaron Ciechanover, 2004 Nobel Laureate in Chemistry"
                fill
                className="object-cover object-[center_18%]"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7A62]">
                Scientific Collaboration
              </p>
              <h2 className="mt-4 font-['Montserrat'] text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111] sm:text-4xl">
                Guided by a Nobel Laureate
              </h2>
              <p className="mt-3 font-['Montserrat'] text-lg font-semibold text-[#1E261C]">
                Professor Aaron Ciechanover
              </p>
              <p className="mt-1 text-sm text-[#666666]">
                2004 Nobel Prize in Chemistry · Chief Consulting Scientist to luckdate
              </p>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#333333] sm:text-[15px]">
                <p>
                  Professor Ciechanover was awarded the Nobel Prize in Chemistry for discovering how
                  proteins are broken down in cells — work that reshaped modern biology. As Chief
                  Consulting Scientist to luckdate, he provides advisory perspectives on scientific
                  principles, long-term health thinking, and responsible science communication.
                </p>
                <p>
                  His role is at the brand and scientific-principles level. He did not formulate
                  individual product recipes or develop the luckdate App — and we share that clearly
                  so our science story stays honest.
                </p>
              </div>
              <a
                href={PRESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 border border-[#1E261C] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1E261C] transition-colors hover:bg-[#1E261C] hover:text-white"
              >
                Read the Healthcare Business Today feature
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* The System */}
        <section className="bg-[#F7F5F1]">
          <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7A62]">
              The System
            </p>
            <blockquote className="mt-5 font-['Montserrat'] text-2xl font-bold italic leading-snug tracking-[-0.02em] text-[#111111] sm:text-3xl lg:text-[2.35rem]">
              &ldquo;Not just single products — a connected routine you can follow for light body
              management, long-term vitality, app tracking, and professional guidance.&rdquo;
            </blockquote>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-[#333333] sm:text-[15px]">
              <p>
                LuckDate is a wellness brand from Luckdate Health Glow LLC designed to help adults
                build daily routines — so progress is measurable and consistency feels natural.
              </p>
              <p>
                What sets us apart is an unwavering commitment to quality. Every product undergoes
                rigorous testing and quality control for purity, potency, and safety. We work with
                scientists and nutrition experts to develop formulations that are effective and
                easy to incorporate into your day.
              </p>
              <p>
                Whether you want steadier energy, support for healthy aging, or a simpler daily
                ritual, luckdate is here to support you every step of the way.
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-5 lg:px-12 lg:pb-20 xl:px-16">
            {PILLARS.map((pillar) => (
              <article key={pillar.title} className="group flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EDE7]">
                  <Image
                    src={pillar.image}
                    alt={pillar.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 22vw, 50vw"
                  />
                </div>
                <h3 className="mt-4 font-['Montserrat'] text-base font-bold text-[#111111]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#555555]">{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Commitments */}
        <section className="relative overflow-hidden bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(210,230,200,0.35)_0%,rgba(245,228,170,0.2)_40%,transparent_70%)]"
          />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:py-24 xl:px-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7A62]">
                Our Commitments
              </p>
              <h2 className="mt-4 max-w-[18ch] font-['Montserrat'] text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111] sm:text-4xl lg:text-[2.5rem]">
                Doing good — so you can feel great about feeling good.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-[#333333] sm:text-[15px]">
                We are committed to transparency, scientific rigor, and safety. Our products are
                clean, carefully formulated, and manufactured under rigorous testing and quality
                standards.
              </p>
              <ul className="mt-8 space-y-3">
                {TRUST.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-t border-[#1E261C]/12 pt-3 text-sm text-[#1A1A1A]"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6B7A62]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs leading-relaxed text-[#666666]">
                luckdate is developed and maintained under OMNI HEALTH TECHNOLOGY LLC, the
                registered entity responsible for product operations and compliance.
              </p>
            </div>

            <div>
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE8E0]">
                <Image
                  src={commitmentsImage}
                  alt="Quality testing and careful formulation"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <ul className="mt-8 flex flex-wrap items-end justify-center gap-x-5 gap-y-5 sm:justify-start lg:gap-x-6">
                {CERTS.map((cert) => (
                  <li key={cert.label} className="flex w-14 flex-col items-center sm:w-16">
                    <div className="relative flex h-11 w-full items-center justify-center sm:h-12">
                      <Image
                        src={cert.src}
                        alt={cert.label}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#6B7A62]">
                      {cert.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-[#1E261C]/08 bg-[#F7F5F1]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:px-12 lg:py-14 xl:px-16">
            <div>
              <h2 className="font-['Montserrat'] text-2xl font-bold text-[#111111] sm:text-3xl">
                Start your luckdate ritual
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[#555555]">
                Join customers who made luckdate part of their daily wellness journey.
              </p>
            </div>
            <Link
              href="/shop/nutrition-28-day"
              className="inline-flex items-center justify-center bg-[#1E261C] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </main>

      <UnpaidOrderFloat />
      <Footer />
      <Suspense fallback={null}>
        <CartDrawer />
        <GlobalCoupon />
      </Suspense>
    </div>
  );
}
