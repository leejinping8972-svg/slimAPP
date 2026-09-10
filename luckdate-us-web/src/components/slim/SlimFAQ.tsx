'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SlimReveal from './SlimReveal';

const faqs = [
  {
    q: 'What is Luckdate Slim?',
    a: 'Luckdate Slim is a daily system — Slim Vitality nutrition, Sunny AI guidance in the App, and a 28-day ritual designed to help women build sustainable energy, satiety, and lightness.',
  },
  {
    q: 'How is it different from regular protein powder?',
    a: 'Most powders stop at nutrition. Slim pairs a clean formula with Sunny AI and a structured 28-day journey — personalized guidance, reminders, and progress tracking, not just a shake.',
  },
  {
    q: 'Who is Slim for?',
    a: 'Women who want better daily nutrition and consistency without extreme diets — especially if you skip breakfast, struggle with protein, or restart plans every few weeks.',
  },
  {
    q: 'Why do I need the App and Sunny?',
    a: 'Sunny turns Slim into a ritual. After you scan and activate your product, Sunny learns your goals and helps with daily plans, reminders, and check-ins so habits stick.',
  },
  {
    q: 'Which plan should I buy?',
    a: 'New to Slim? Start with the 7-Day Trial. Ready to commit? The 28-Day Journey is our most popular. Want the full kit? Choose the Complete Ritual with a branded shaker.',
  },
  {
    q: 'Is it suitable for vegans?',
    a: 'Slim Vitality uses a plant + whey protein blend. If you need a fully vegan option, please check the latest ingredient label or contact support before ordering.',
  },
  {
    q: 'Do I need to exercise?',
    a: 'No extreme workouts required. Light daily movement helps, and Slim supports energy whether you are walking, stretching, or simply staying active in everyday life.',
  },
  {
    q: 'How does shipping & returns work?',
    a: 'Free shipping on orders $50+. We offer a 30-day Happiness Guarantee — contact support@luckdate.com within 30 days if Slim isn’t right for you.',
  },
];

export default function SlimFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-14 md:py-20 bg-[#F9F7F2]">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8">
        <SlimReveal className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[2.65rem] font-medium text-[#2C322E] leading-tight">
            Got Questions? We&apos;ve Got Answers.
          </h2>
        </SlimReveal>

        <div className="grid md:grid-cols-2 gap-3">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <SlimReveal key={faq.q} delay={(index % 2) * 30}>
                <div className="bg-white rounded-2xl border border-[#2A4035]/8 overflow-hidden h-full">
                  <button
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="w-full flex items-center justify-between gap-3 p-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="text-sm md:text-[15px] font-medium text-[#2C322E] pr-2">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#2A4035] shrink-0 transition-transform duration-300 ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-5 pb-5 text-sm text-[#6C6763] leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </SlimReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
