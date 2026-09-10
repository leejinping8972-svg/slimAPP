'use client';

import { useState } from "react";

const faqs = [
  {
    q: "How does LuckDate work?",
    a: "LuckDate works from the inside out. Our formula combines 6 powerhouse core ingredients — including Sodium Copper Chlorophyllin, Organic Parsley Leaf Extract, Organic Peppermint Leaf, Lactobacillus Rhamnosus GG, Microencapsulated Tea Tree Oil, and Bromelain — with complementary supporting nutrients that work in perfect synergy. Together, they target and neutralize odor-causing compounds deep in your gut before they spread to your breath, sweat, and skin — eliminating unwanted odor at the source, rather than just masking it with temporary fixes.",
  },
  {
    q: "Will it work for my specific type of body odor?",
    a: "Yes. Because LuckDate addresses the root cause inside your body, it works for all odor types — including underarms, feet, breath, and intimate areas.",
  },
  {
    q: "How quickly will I see results?",
    a: "Most users notice fresher breath and reduced body odor within two weeks of daily use. Full benefits typically deepen over three to four weeks of consistent use.",
  },
  {
    q: "How do I take LuckDate, and when is the best time?",
    a: "Take 2 capsules once a day with water. Many customers prefer taking it in the evening as part of their nightly routine for optimal morning freshness.",
  },
  {
    q: "Is it safe to take daily, and are there any side effects?",
    a: "Yes. LuckDate is made with 100% natural, vegan-friendly ingredients and is free from parabens, aluminum, and harsh chemicals. Some people may experience mild digestive adjustments when first starting — if you have a sensitive stomach, take it with food.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day money-back guarantee. If you're not satisfied with your results, contact us for a full refund — no questions asked.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState(-1);

  return (
    <section className="py-5 sm:py-7 lg:py-8 bg-secondary">
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-center mb-5 sm:mb-6 text-brand-dark">
          FAQ
        </h2>
        <div className="max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 text-left bg-background hover:bg-accent/30 transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
                <span className="text-xl flex-shrink-0">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="p-4 pt-0 bg-background">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
