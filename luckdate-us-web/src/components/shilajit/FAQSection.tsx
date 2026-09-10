'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How soon will I see a difference?',
    a: 'Most people notice increased energy and improved well-being within the first 7-14 days. For maximum results, we recommend consistent daily use over a 90-day period to allow the nutrients to fully saturate your system.',
  },
  {
    q: 'How do I take the gummies?',
    a: 'Simply take 2 gummies daily with or without food. Each bottle contains 60 gummies, providing a full 30-day supply.',
  },
  {
    q: 'Is Luckdate safe?',
    a: 'Yes. Our gummies are made with Non-GMO, Gluten-Free, and Vegan-Friendly ingredients. All production follows strict quality standards.',
  },
  {
    q: 'What makes the 10-in-1 formula special?',
    a: 'Unlike single-ingredient shilajit products, our formula combines 10 powerful ingredients including Ashwagandha, Maca Root, Tongkat Ali, and more — all working synergistically for comprehensive wellness support.',
  },
  {
    q: 'Can I take this with other supplements?',
    a: 'Yes, our gummies can be taken alongside most common supplements. However, if you have existing health conditions, consult your doctor before combining with other products.',
  },
  {
    q: 'How should I store the gummies?',
    a: 'Store in a cool, dry place away from direct sunlight. Keep the lid tightly closed to maintain freshness.',
  },
  {
    q: 'Shipping & Delivery?',
    a: 'US orders are shipped within 24 hours and delivered within 3-5 business days.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-8 sm:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        <h2 className="font-display text-lg sm:text-3xl lg:text-5xl font-bold text-center text-foreground mb-5 sm:mb-12">
          FAQ
        </h2>
        <div className="space-y-1.5 sm:space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-3 sm:p-5 text-left hover:bg-secondary/50 transition-colors active:bg-secondary/70"
              >
                <span className="font-body text-[11px] sm:text-base font-semibold text-foreground pr-3">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-foreground/50 transition-transform flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-3 pb-3 sm:px-5 sm:pb-5">
                  <p className="font-body text-[11px] sm:text-base text-foreground/70 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
