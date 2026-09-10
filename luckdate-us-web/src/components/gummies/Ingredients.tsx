'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Shield, Check } from 'lucide-react';
import a2Img from '@/assets/gummies/probiotic-gummies-ingredients.jpg';
import slipperyElmImg from '@/assets/gummies/images/ingredients/slippery_elm.png';
import ginkgoImg from '@/assets/gummies/images/ingredients/ginkgo.png';
import probioticsImg from '@/assets/gummies/images/ingredients/probiotics.png';

interface IngredientsProps {
  onShopNow: () => void;
}

const ingredients = [
  {
    title: 'Slippery Elm',
    description: 'Soothes mucosal irritation, locks in moisture, and supports skin repair.',
    benefits: ['Soothes mucosal irritation', 'Locks in moisture', 'Skin Repair'],
    image: slipperyElmImg,
    color: 'bg-soft-pink/50',
  },
  {
    title: 'Ginkgo Leaf',
    description: 'Boosts blood circulation, provides antioxidant support, and enhances vitality.',
    benefits: ['Boosts blood circulation', 'Antioxidant support', 'Enhances vitality'],
    image: ginkgoImg,
    color: 'bg-mint-green/30',
  },
  {
    title: 'Probiotics',
    description: 'Balances flora, maintains pH balance, and strengthens immunity.',
    benefits: ['Balances flora', 'Maintains pH balance', 'Strengthens immunity'],
    image: probioticsImg,
    color: 'bg-soft-pink/50',
  },
];

export default function Ingredients({ onShopNow }: IngredientsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="ingredients" ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 lg:mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-soft-pink/50 px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4 text-deep-rose" />
            <span className="text-sm font-body font-medium text-dark-charcoal">Science-Backed</span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-dark-charcoal mb-6">
            Powerful Natural Ingredients
          </h2>

          <p className="font-body text-lg text-medium-gray leading-relaxed">
            Every gummy is formulated with premium botanical extracts supported by research for
            women&apos;s wellness. Pure, effective, and delicious.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div
            className={`relative transition-all duration-700 delay-200 sticky top-32 z-20 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-soft-xl border border-soft-pink/30">
              <Image
                src={a2Img}
                alt="Aura Probiotic Gummies with key ingredients"
                className="w-full h-auto object-cover"
                width={600}
                height={600}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-mint-green/30 rounded-full blur-2xl -z-10" />
          </div>

          <div className="space-y-6">
            {ingredients.map((ingredient, index) => (
              <div
                key={ingredient.title}
                className={`${ingredient.color} rounded-2xl p-6 transition-all duration-700 hover:shadow-soft-lg hover:scale-[1.02] border border-[#F5E6E8]/50 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl flex items-center justify-center shadow-soft flex-shrink-0 overflow-hidden">
                    <Image
                      src={ingredient.image}
                      alt={ingredient.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      width={96}
                      height={96}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-heading text-xl md:text-2xl font-semibold text-dark-charcoal mb-2">
                      {ingredient.title}
                    </h3>
                    <p className="font-body text-sm md:text-base text-medium-gray mb-4 leading-relaxed">
                      {ingredient.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ingredient.benefits.map((benefit, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-body text-dark-charcoal shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5 text-deep-rose" />
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-16 lg:mt-20 text-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button
            onClick={onShopNow}
            className="bg-deep-rose text-white px-8 py-4 rounded-full font-body text-base font-medium hover:shadow-soft-xl hover:scale-[1.02] transition-all duration-300"
          >
            Shop Now — Save $10
          </button>
        </div>
      </div>
    </section>
  );
}
