'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How long does it take to see results?',
    answer:
      'Most women notice improvements in intimate moisture and comfort within 2–4 weeks of daily use. For full pH balance and flora optimization, we recommend consistent use for at least 6–8 weeks.',
  },
  {
    question: 'Are there any side effects?',
    answer:
      "Our gummies are made with all-natural ingredients and are generally well-tolerated. They contain no artificial colors, flavors, or preservatives. However, if you have specific allergies, please check the full ingredient list or consult your healthcare provider.",
  },
  {
    question: 'How should I take the gummies?',
    answer:
      'Take 2 gummies daily, preferably at the same time each day. They can be taken with or without food. For best results, make them a consistent part of your daily routine.',
  },
  {
    question: 'Can I take these while pregnant or breastfeeding?',
    answer:
      'We recommend consulting with your healthcare provider before taking any supplements during pregnancy or while breastfeeding.',
  },
  {
    question: 'What is your return policy?',
    answer:
      "We offer a 30-day money-back guarantee. If you're not completely satisfied, simply contact our customer service team for a full refund — no questions asked.",
  },
  {
    question: 'Is the "Buy 2 Get 1 Free" deal always available?',
    answer:
      'This bundle offer is part of our limited-time flash sale. We cannot guarantee how long it will be available, so we recommend taking advantage of the savings while they last.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-soft-pink/50 px-4 py-2 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-deep-rose" />
            <span className="text-sm font-body font-medium text-dark-charcoal">Got Questions?</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-dark-charcoal mb-4">
            FAQ
          </h2>
          <p className="font-body text-base text-medium-gray">
            Everything you need to know about Aura Probiotic Gummies.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-light-gray rounded-2xl border border-dark-charcoal/5 overflow-hidden transition-all duration-300 hover:shadow-soft"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left"
              >
                <span className="font-body text-base md:text-lg font-medium text-dark-charcoal pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-deep-rose shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-5 md:px-6 pb-5 md:pb-6 font-body text-sm md:text-base text-medium-gray leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
