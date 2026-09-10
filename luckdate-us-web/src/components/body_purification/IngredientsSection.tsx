'use client';

import chlorophyll from "@/assets/body_purification/ingredient-chlorophyll.jpg";
import parsley from "@/assets/body_purification/ingredient-parsley.jpg";
import peppermint from "@/assets/body_purification/ingredient-peppermint.jpg";
import probiotic from "@/assets/body_purification/ingredient-probiotic.jpg";
import teaTree from "@/assets/body_purification/ingredient-tea-tree.jpg";
import bromelain from "@/assets/body_purification/ingredient-bromelain.jpg";
import { getImageSrc } from "./utils";
import { LazyImg } from './LazyMedia';

const ingredientsList = [
  { name: "Sodium Copper Chlorophyllin", image: chlorophyll, desc: "Neutralizes odor compounds from the inside." },
  { name: "Organic Parsley Leaf Extract", image: parsley, desc: "Natural antibacterial and breath-freshening support." },
  { name: "Organic Peppermint Leaf", image: peppermint, desc: "Cooling freshness and digestive support." },
  { name: "Lactobacillus Rhamnosus GG", image: probiotic, desc: "Micro-ecological balance for gut health." },
  { name: "Microencapsulated Tea Tree Oil", image: teaTree, desc: "Targeted antibacterial action that releases gradually to neutralize odor-causing bacteria." },
  { name: "Bromelain", image: bromelain, desc: "Anti-inflammatory enzyme support." },
];

const IngredientsSection = () => {
  return (
    <section className="py-5 sm:py-7 lg:py-8 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-center mb-5 sm:mb-6 text-brand-dark">
          What&apos;s Inside
        </h2>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-5 sm:mb-8 max-w-2xl mx-auto">
          Six Core Key Ingredients, with complementary nutrients working in perfect synergy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ingredientsList.map((item, i) => (
            <div key={i} className="bg-background rounded-xl p-4 sm:p-6 shadow-sm flex flex-col items-center text-center">
              <LazyImg
                src={getImageSrc(item.image)}
                alt={item.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mb-3 sm:mb-4"
              />
              <h3 className="font-semibold mb-2">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          100% vegan and chemical-free · No aluminum, parabens, or artificial fragrances
        </p>
      </div>
    </section>
  );
};

export default IngredientsSection;
