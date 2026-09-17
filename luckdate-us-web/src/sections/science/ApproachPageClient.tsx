'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import heroImg from '@/assets/home/luckdate-fitoo-light-body-woman.png';
import barrierImg from '@/assets/home/barriers-cells-still.jpg';

const STATS = [
  {
    value: '90,000+',
    body: 'new chemicals introduced into public use since the 1970s — only a fraction thoroughly tested for long-term safety.*',
  },
  {
    value: '50 yrs',
    body: 'The food we eat has changed more in the last 50 years than it did in the previous 10,000.*',
  },
  {
    value: '54%',
    body: 'of children today face a chronic health issue, versus roughly 1.6% in the 1960s.*',
  },
] as const;

const LAYERS = [
  {
    id: 'weight',
    title: 'Weight management',
    short: 'Silhouette you can keep',
    body: 'Daily protein rituals help you stay fuller, more consistent, and better fueled — so silhouette goals become habits, not short-term extremes. Complete amino acids support lean mass while you navigate modern meal patterns.',
  },
  {
    id: 'gut',
    title: 'Gut management',
    short: 'Inside suit of armor',
    body: 'Your mucosa is an inside suit of armor. Probiotics and protein-forward rituals support the gut ecosystem that houses much of your immune system — your first line of defense against everything inhaled and ingested.',
  },
  {
    id: 'metabolism',
    title: 'Metabolism management',
    short: 'Steadier daily rhythm',
    body: 'Complete amino acids and steady daily nutrition help maintain energy, recovery, and metabolic rhythm — especially when stress, irregular meals, and processed food pull you off track.',
  },
  {
    id: 'barrier',
    title: 'Barrier integrity',
    short: 'Foundation first',
    body: 'A healthy barrier absorbs nutrients while keeping harmful particles out. Modern exposures — pollution, chemicals, stress hormones, refined carbs — make that line of defense more penetrable. luckdate starts here.',
  },
] as const;

export default function ApproachPageClient() {
  const [activeLayer, setActiveLayer] = useState(0);
  const layer = LAYERS[activeLayer];

  return (
    <div className="min-h-screen bg-[#F7F5F1]">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative isolate min-h-[70svh] overflow-hidden bg-[#EDE8E0] lg:min-h-[78svh]">
          <Image
            src={heroImg}
            alt="Active lifestyle for luckdate approach"
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F1]/95 via-[#F7F5F1]/55 to-transparent" />
          <div className="relative z-10 flex min-h-[70svh] items-center px-5 py-24 sm:px-8 lg:min-h-[78svh] lg:px-16">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
                The Approach
              </p>
              <h1 className="mt-3 font-['Montserrat'] text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-[#111111] sm:text-5xl lg:text-[3.5rem]">
                Confronting the modern environment
              </h1>
              <p className="mt-5 text-[15px] leading-relaxed text-[#333333] sm:text-base">
                The entire inside of the body is lined by a thin membrane called the mucosa. It
                forms the barrier between the bloodstream and everything we inhale and ingest —
                hosting the microbiome and much of the immune system.
              </p>
            </div>
          </div>
        </section>

        {/* Modern environment stats */}
        <section className="bg-[#1E261C] text-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
            <p className="text-center text-sm font-medium text-white/70">
              The modern environment drives modern health issues.*
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {STATS.map((stat) => (
                <article key={stat.value} className="text-center sm:text-left">
                  <p className="font-['Montserrat'] text-4xl font-bold tracking-[-0.03em] text-[#C8E07A] lg:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{stat.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* The Barriers / pillars interactive */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-['Montserrat'] text-3xl font-bold tracking-[-0.02em] text-[#111111] sm:text-4xl">
                The barriers — and how we manage them
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[#444444]">
                A healthy barrier absorbs essential nutrients while keeping harmful substances out.
                Modern living impairs that line of defense. luckdate responds with three management
                pillars — weight, gut, and metabolism — starting at the foundation.
              </p>
            </div>

            <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8E0] lg:aspect-auto lg:min-h-[520px]">
                <Image
                  src={barrierImg}
                  alt="Protective barrier visualization"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                    Active pillar
                  </p>
                  <p className="mt-1 font-['Montserrat'] text-xl font-bold">{layer.title}</p>
                  <p className="mt-1 text-sm text-white/80">{layer.short}</p>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  {LAYERS.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveLayer(i)}
                      className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                        activeLayer === i
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#F0EDE7] text-[#555555] hover:bg-[#E5E0D8]'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                <article className="mt-8 border-t border-[#111111] pt-6">
                  <h3 className="font-['Montserrat'] text-2xl font-bold text-[#111111]">
                    {layer.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#333333]">{layer.body}</p>
                </article>

                <ul className="mt-8 space-y-3">
                  {LAYERS.map((item, i) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setActiveLayer(i)}
                        className={`flex w-full items-start gap-3 border-l-2 py-2 pl-4 text-left transition-colors ${
                          activeLayer === i
                            ? 'border-[#111111] text-[#111111]'
                            : 'border-transparent text-[#888888] hover:text-[#444444]'
                        }`}
                      >
                        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em]">
                          0{i + 1}
                        </span>
                        <span>
                          <span className="block text-sm font-bold">{item.title}</span>
                          <span className="mt-0.5 block text-xs">{item.short}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Revival close */}
        <section className="relative overflow-hidden bg-[#F7F5F1]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(200,224,122,0.35)_0%,transparent_55%)]"
          />
          <div className="relative mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 lg:py-24">
            <h2 className="font-['Montserrat'] text-3xl font-bold tracking-[-0.02em] text-[#111111] sm:text-4xl">
              The luckdate revival
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-[#333333] sm:text-base">
              Modern living breaks down the barrier. luckdate nutrition rituals help build it back —
              with clean whey protein for daily protein targets and probiotics for gut ecosystem
              support. Start at the foundation, then let whole-body benefits follow.*
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/science/clinical-trials"
                className="inline-flex bg-[#111111] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:opacity-90"
              >
                The Results
              </Link>
              <Link
                href="/science/formulation"
                className="inline-flex border border-[#111111] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#111111] hover:bg-white"
              >
                Formulation
              </Link>
            </div>
            <p className="mt-10 text-xs text-[#888888]">
              *Individual results vary. Educational statistics reflect widely cited public-health
              trends and are not product claims.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
