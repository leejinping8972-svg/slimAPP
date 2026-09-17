'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';

const CATEGORIES = [
  {
    id: 'gut',
    label: 'Gut health',
    headline: '86%',
    sub: 'experienced less bloating after consistent daily use*',
    before: 'BEFORE a daily luckdate ritual',
    after: 'AFTER consistent daily use',
    detailTitle: 'Gut Health',
    detail:
      'luckdate nutrition rituals promote digestive comfort by supporting protein intake and the gut ecosystem — including barrier nutrition, immune context, and microbiome-friendly probiotic support.*',
  },
  {
    id: 'performance',
    label: 'Performance',
    headline: '83%',
    sub: 'noticed better stamina and felt more recovered after workouts*',
    before: 'BEFORE training support',
    after: 'AFTER protein-forward recovery',
    detailTitle: 'Performance',
    detail:
      'Complete whey protein is a natural powerhouse of essential amino acids that promote lean muscle support and cellular recovery. It supports fitness, stamina, and endurance while helping you keep a steadier metabolic rhythm day to day.*',
  },
  {
    id: 'skin',
    label: 'Skin & Hair',
    headline: '79%',
    sub: 'reported thicker, healthier-feeling hair with consistent use*',
    before: 'BEFORE foundation nutrition',
    after: 'AFTER inside-out support',
    detailTitle: 'Skin & Hair',
    detail:
      'Protein building blocks, antioxidants from a balanced diet, and gut-supported nutrient absorption contribute to skin and hair appearance over consistent daily use — vitality felt from the inside out.*',
  },
] as const;

const NUMBERS = [
  {
    title: 'Gut Health',
    body: 'Supports digestive health by reinforcing daily protein and probiotic nutrition for the gut mucosal barrier context — gut wall, immune cells, mucus layer, and microbiome.*',
  },
  {
    title: 'Performance',
    body: 'Delivers complete amino acids that promote lean muscle support and cellular health. Supports fitness, stamina, endurance, and recovery while helping shift daily fueling toward steadier metabolic rhythm.*',
  },
  {
    title: 'Skin & Hair',
    body: 'A matrix of foundational nutrition — protein, micronutrient context, and gut support — that helps nourish skin and hair appearance with rituals you can keep.*',
  },
] as const;

export default function ClinicalTrialsPageClient() {
  const [active, setActive] = useState(0);
  const cat = CATEGORIES[active];

  return (
    <div className="min-h-screen bg-[#F7F5F1]">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,210,230,0.45)_0%,transparent_45%),radial-gradient(ellipse_at_90%_20%,rgba(232,255,106,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_70%_100%,rgba(190,235,170,0.35)_0%,transparent_45%)]"
          />
          <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 lg:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
              Clinically Backed
            </p>
            <h1 className="mt-4 font-['Montserrat'] text-[2.5rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#111111] sm:text-5xl lg:text-[3.4rem]">
              Compelling results are felt, and seen.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-[#333333] sm:text-base">
              At luckdate, we stand by our commitment to safety, transparency, and scientific rigor.
              While thousands of published studies document the benefits of whey protein and
              probiotic nutrition and their ability to promote health at all stages of life,
              luckdate nutrition rituals are designed to deliver noticeable benefits aligned with
              dual-arm clinical research themes.*
            </p>
          </div>
        </section>

        {/* Category tabs + big stat */}
        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex flex-wrap justify-center gap-2 border-b border-white/15 pb-1">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                    active === i
                      ? 'border-b-2 border-[#C8E07A] text-[#C8E07A]'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="font-['Montserrat'] text-[4.5rem] font-bold leading-none tracking-[-0.04em] text-[#C8E07A] sm:text-[6rem] lg:text-[7rem]">
                {cat.headline}
              </p>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                {cat.sub}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
              <div className="border border-white/20 bg-white/5 px-5 py-8 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                  {cat.before}
                </p>
                <div className="mx-auto mt-6 h-24 w-24 rounded-full border border-dashed border-white/30 bg-white/5" />
              </div>
              <div className="border border-[#C8E07A]/40 bg-[#C8E07A]/10 px-5 py-8 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C8E07A]">
                  {cat.after}
                </p>
                <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#C8E07A] text-[#111111]">
                  <span className="font-['Montserrat'] text-2xl font-bold">{cat.headline}</span>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-white/75">
              {cat.detail}
            </p>
          </div>
        </section>

        {/* Go inside the numbers */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
              Go inside the numbers
            </p>
            <div className="mt-12 grid gap-10 lg:grid-cols-3">
              {NUMBERS.map((item) => (
                <article key={item.title} className="border-t border-[#111111] pt-5">
                  <h2 className="font-['Montserrat'] text-xl font-bold text-[#111111]">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#444444]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Closing research note */}
        <section className="border-t border-[#E8E8E8] bg-[#F7F5F1]">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:py-16">
            <p className="text-sm leading-relaxed text-[#555555]">
              *Results may vary. Based on dual-arm clinical research survey themes of participants
              ages 18–65 taking a daily nutrition protocol for a period of 3 months. Findings
              referenced from published clinical research surveys on barrier-supporting whole-food
              nutrition (including open-label surveys of participants consuming a daily bioactive
              protocol). Individual results vary. Not a substitute for a varied diet or medical
              advice.
            </p>
            <p className="mt-8 text-[15px] leading-relaxed text-[#333333]">
              Whey protein and probiotic nutrition are the subject of significant scientific
              interest with thousands of published studies detailing their health benefits. This
              body of research is continually expanding as researchers delve deeper into the
              compelling power of foundational daily nutrition.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/shop/nutrition-28-day"
                className="inline-flex bg-[#111111] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:opacity-90"
              >
                Shop now
              </Link>
              <Link
                href="/science/formulation"
                className="inline-flex border border-[#111111] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#111111] hover:bg-white"
              >
                Formulation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
