'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import heroImg from '@/assets/home/whey-innovation-science.jpg';
import scoopImg from '@/assets/home/whey-innovation-scoop.jpg';
import probioticImg from '@/assets/home/products/gut-balance-probiotic-box.jpg';

const COMPARE_TABS = [
  {
    id: 'sourcing',
    label: 'Sourcing',
    conventional: {
      title: 'Conventional whey & probiotics',
      body: [
        'Often sourced from mixed dairy streams with inconsistent batch control, added lecithin for mixability, and filler carriers that dilute what you actually drink.',
        'Probiotic formulas may list high CFU counts without clear strain transparency, or use strains poorly matched to daily gut rhythm.',
      ],
    },
    luckdate: {
      title: 'luckdate Formulation',
      body: [
        'WPC80 from a single cheese-whey source and single factory — high batch-to-batch stability, no lecithin or unnecessary fillers, clean milky flavor.',
        'Targeted probiotic rituals designed for daily inner reset, paired with protein so foundation nutrition stays coherent.',
      ],
    },
  },
  {
    id: 'efficacy',
    label: 'Efficacy',
    conventional: {
      title: 'Conventional whey & probiotics',
      body: [
        'Many powders require larger servings without delivering comparable mixability or taste you can keep — so consistency breaks down.',
        'Without clear specs and third-party-aligned quality stories, everyday benefits stay harder to trust.',
      ],
    },
    luckdate: {
      title: 'luckdate Formulation',
      body: [
        'Complete protein with all 9 essential amino acids and high bioavailability — supporting recovery, daily protein targets, and vitality.',
        'Agglomeration for excellent powder flow and water solubility. Strict control of microbes, contaminant limits, and risk indicators.',
      ],
      bullets: [
        '16g protein per pour in Slim Vitality rituals*',
        'WPC80 concentrate preserved with mid-to-low temperature spray drying*',
        'Probiotic support for gut rhythm alongside protein*',
        'Ritual formats built for 7-day starts and 28-day consistency*',
      ],
    },
  },
  {
    id: 'process',
    label: 'Process',
    conventional: {
      title: 'Conventional whey & probiotics',
      body: [
        'High-heat processing and heavy additives can blunt native protein character and leave chalky, hard-to-mix powder.',
        'Probiotic handling without careful formulation can leave you with strains that do not survive the daily ritual you actually keep.',
      ],
    },
    luckdate: {
      title: 'luckdate Formulation',
      body: [
        'WPC80 spray-dried to help preserve native protein form and solubility — agglomerated for a smooth daily pour.',
        'Probiotic formats designed for daily use, so gut support sits beside protein as one system — not an afterthought.',
      ],
    },
  },
  {
    id: 'testing',
    label: 'Testing + Purity',
    conventional: {
      title: 'Conventional whey & probiotics',
      body: [
        'Not every powder shows clear contaminant controls, certifications, or packaging specs you can inspect.',
        'Binding agents and flavor systems can mask what is really in the scoop.',
      ],
    },
    luckdate: {
      title: 'luckdate Formulation',
      body: [
        'Aligned with USDA / FDA food specs thinking, GMP pathways, Halal, Kosher, and Non-GMO positioning where applicable.',
        'Sunpro WPC80 audited controls include FSSC 22000, pasture-fed, GMO free, rBST free, BSE free — with high-spec barrier packaging.',
      ],
    },
  },
] as const;

const COMPOUNDS = [
  {
    title: 'Complete whey protein (WPC80)',
    body: 'Whey protein concentrate delivers all nine essential amino acids with high bioavailability — supporting muscle recovery, daily protein targets, immune building blocks, and sustained vitality.',
  },
  {
    title: 'Essential amino acids',
    body: 'The building blocks of proteins. They support tissue repair, neurotransmitter production, hormone synthesis, and balanced immune defense — the foundation of a ritual you can keep.',
  },
  {
    title: 'BCAA & leucine support',
    body: 'Naturally present in whey, branched-chain amino acids help signal recovery after training and everyday activity — so your pour works as hard as you do.',
  },
  {
    title: 'Targeted probiotics',
    body: 'Selected strains support the gut ecosystem that houses much of your immune system — helping digestion, nutrient absorption, and day-to-day comfort.',
  },
  {
    title: 'Gut barrier nutrition',
    body: 'Your mucosa is an inside suit of armor. Protein and probiotic rituals reinforce the foundation modern living wears down — pollution, stress, irregular meals, and processed food.',
  },
  {
    title: 'Clean processing profile',
    body: 'No lecithin or unnecessary fillers. Agglomeration for solubility. Single-source, single-factory discipline for batch stability you can taste.',
  },
  {
    title: 'Trace minerals & micronutrient context',
    body: 'Dairy-derived whey carries complementary micronutrient context that supports enzyme function, metabolism, and everyday cellular processes when paired with a varied diet.',
  },
  {
    title: 'Daily ritual formats',
    body: '7-Day and 28-Day kits, chocolate flavor, and the luckdate shaker — designed so science becomes habit, not another bottle you abandon.',
  },
] as const;

export default function FormulationPageClient() {
  const [tab, setTab] = useState<(typeof COMPARE_TABS)[number]['id']>('sourcing');
  const [openCompound, setOpenCompound] = useState(0);
  const active = COMPARE_TABS.find((t) => t.id === tab) ?? COMPARE_TABS[0];

  return (
    <div className="min-h-screen bg-[#F7F5F1]">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative isolate min-h-[72svh] overflow-hidden bg-[#1E261C] lg:min-h-[80svh]">
          <Image
            src={heroImg}
            alt="luckdate whey protein and nutrition science"
            fill
            priority
            className="object-cover object-center opacity-70"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />
          <div className="relative z-10 flex min-h-[72svh] items-end px-5 pb-14 pt-28 sm:px-8 lg:min-h-[80svh] lg:px-16 lg:pb-20">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                Formulation
              </p>
              <h1 className="mt-3 font-['Montserrat'] text-[2.6rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.75rem]">
                Whey protein &amp; probiotics.
                <br />
                <em className="font-semibold not-italic text-[#C8E07A]">Foundation, perfected.</em>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Clean WPC80 concentrate plus targeted strains — daily nutrition your body
                recognizes, in rituals you can keep.
              </p>
              <Link
                href="/science/clinical-trials"
                className="mt-8 inline-flex border border-white/70 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[#111111]"
              >
                Explore research
              </Link>
            </div>
          </div>
        </section>

        {/* Origin story */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-12 lg:py-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7A62]">
                Why this formula
              </p>
              <h2 className="mt-3 font-['Montserrat'] text-3xl font-bold leading-tight tracking-[-0.02em] text-[#111111] sm:text-4xl">
                We built luckdate nutrition to make foundation health simple again.
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#333333]">
                <p>
                  Modern living breaks consistency — irregular meals, stress, and shortcuts that
                  leave protein and gut support behind. luckdate brings two essentials into one
                  coherent system: concentrated whey protein and targeted probiotics.
                </p>
                <p>
                  Not another chalky shake. Not another bottle you forget. A daily pour designed
                  for absorption, taste, and rituals you actually finish.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8E0]">
              <Image
                src={scoopImg}
                alt="WPC80 whey protein scoop"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </div>
        </section>

        {/* Pull quote */}
        <section className="bg-[#1E261C] text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 lg:py-24">
            <h2 className="font-['Montserrat'] text-2xl font-bold leading-snug tracking-[-0.02em] sm:text-3xl lg:text-[2.35rem]">
              Perfected for daily use and validated by generations of nutrition science, whey
              protein and probiotics are foundational tools for gut rhythm, recovery, and metabolic
              steadiness.
            </h2>
          </div>
        </section>

        {/* Education */}
        <section className="bg-[#F7F5F1]">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:py-24">
            <div className="space-y-5 text-[15px] leading-relaxed text-[#1A1A1A]">
              <p>
                Whey protein is one of the most studied complete proteins available — delivering
                essential amino acids with high bioavailability to support immunity, muscle
                recovery, and daily vitality.
              </p>
              <p>
                Our WPC80 concentrate is spray-dried at mid-to-low temperature to help preserve
                native protein form and excellent solubility. No lecithin. No filler theater. Just a
                clean, milky flavor you can pour every day.
              </p>
              <p>
                Probiotics support the gut ecosystem that hosts much of your immune system — the
                first line of defense against everything you inhale and ingest. Together, they form
                luckdate’s formulation blueprint.
              </p>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden bg-[#EDE8E0]">
              <Image
                src={probioticImg}
                alt="Gut Balance probiotics"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </div>
        </section>

        {/* Compare tabs */}
        <section className="border-y border-[#E8E8E8] bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
              How luckdate is different
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2 border-b border-[#E8E8E8] pb-1">
              {COMPARE_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                    tab === t.id
                      ? 'border-b-2 border-[#111111] text-[#111111]'
                      : 'text-[#888888] hover:text-[#111111]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
              <article className="border border-[#E8E8E8] bg-[#F7F5F1] p-6 sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A9188]">
                  Conventional
                </p>
                <h3 className="mt-3 font-['Montserrat'] text-xl font-bold text-[#111111]">
                  {active.conventional.title}
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#444444]">
                  {active.conventional.body.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </article>

              <article className="border border-[#1E261C] bg-[#1E261C] p-6 text-white sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8E07A]">
                  luckdate
                </p>
                <h3 className="mt-3 font-['Montserrat'] text-xl font-bold">{active.luckdate.title}</h3>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/85">
                  {active.luckdate.body.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
                {'bullets' in active.luckdate &&
                  Array.isArray((active.luckdate as { bullets?: string[] }).bullets) && (
                  <ul className="mt-5 space-y-2.5">
                    {((active.luckdate as { bullets: string[] }).bullets).map((b) => (
                      <li key={b} className="flex gap-2.5 text-sm text-white/90">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8E07A]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          </div>
        </section>

        {/* Accordion compounds */}
        <section className="bg-[#F7F5F1]">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
            <h2 className="text-center font-['Montserrat'] text-3xl font-bold tracking-[-0.02em] text-[#111111] sm:text-4xl">
              Inside the formula
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-[#555555]">
              The building blocks that make luckdate whey protein and probiotic rituals work as one
              system.
            </p>
            <ul className="mt-10 divide-y divide-[#D9D2C8] border-y border-[#D9D2C8]">
              {COMPOUNDS.map((item, i) => {
                const open = openCompound === i;
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => setOpenCompound(open ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="font-['Montserrat'] text-base font-bold text-[#111111] sm:text-lg">
                        {item.title}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#111111] transition-transform ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ${
                        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-5 text-sm leading-relaxed text-[#444444]">{item.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:px-12">
            <div>
              <h2 className="font-['Montserrat'] text-2xl font-bold text-[#111111]">
                Next: how we apply the formula
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[#555555]">
                Weight, gut, and metabolism management — the luckdate approach to modern living.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/science/approach"
                className="inline-flex bg-[#111111] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:opacity-90"
              >
                The Approach
              </Link>
              <Link
                href="/shop/nutrition-28-day"
                className="inline-flex border border-[#111111] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#111111] hover:bg-[#F7F5F1]"
              >
                Shop now
              </Link>
            </div>
          </div>
          <p className="mx-auto max-w-6xl px-5 pb-10 text-xs text-[#888888] sm:px-8 lg:px-12">
            *Individual results vary. Not a substitute for a varied diet or medical advice.
          </p>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
