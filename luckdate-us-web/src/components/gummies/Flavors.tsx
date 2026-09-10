'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star, Check } from 'lucide-react';
import a3Img from '@/assets/gummies/probiotic-gummies-flavors.jpg';

interface FlavorsProps {
  onShopNow: () => void;
}

export default function Flavors({ onShopNow }: FlavorsProps) {
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
    <section id="flavors" ref={sectionRef} className="py-24 lg:py-32 bg-soft-pink/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 lg:mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-deep-rose" />
            <span className="text-sm font-body font-medium text-dark-charcoal">Deliciously Natural</span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-dark-charcoal mb-6">
            Refreshing Raspberry & Mint
          </h2>

          <p className="font-body text-lg text-medium-gray leading-relaxed">
            Made with real fruit extracts and natural sweeteners. No artificial colors or
            flavors—just pure, delicious wellness.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-soft-xl">
              <Image
                src={a3Img}
                alt="Raspberry Mint Flavor - Refreshing and Chewy"
                className="w-full h-auto object-cover"
                width={600}
                height={600}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-deep-rose/20 rounded-full blur-2xl" />
          </div>

          <div
            className={`space-y-8 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="font-heading text-2xl font-semibold text-dark-charcoal mb-4">
                Mint + Raspberry
              </h3>
              <p className="font-body text-medium-gray mb-4">
                A refreshing blend of ripe raspberries and cool mint. Sweet, refreshing, and utterly
                delightful.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-mint-green/30 px-3 py-1.5 rounded-full text-sm font-body text-dark-charcoal">
                  <Check className="w-3 h-3" />
                  Refreshing
                </span>
                <span className="inline-flex items-center gap-1 bg-soft-pink/70 px-3 py-1.5 rounded-full text-sm font-body text-dark-charcoal">
                  <Check className="w-3 h-3" />
                  Chewy
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border-2 border-deep-rose/20">
              <h4 className="font-heading text-3xl font-black text-dark-charcoal mb-1 border-b-[8px] border-dark-charcoal pb-2">
                Supplement Facts
              </h4>
              <div className="flex justify-between font-body text-sm text-dark-charcoal font-bold mb-1 border-b-[4px] border-dark-charcoal pb-1">
                <span>Serving Size: 2 Gummies</span>
                <span>Serving Per Container: 30</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-8 border-b-[4px] border-dark-charcoal pb-2 mb-2">
                <div>
                  <div className="flex justify-between font-body text-xs font-bold border-b border-dark-charcoal pb-1 mb-1">
                    <span />
                    <div className="flex gap-4">
                      <span>Amount Per Serving</span>
                      <span>%DV</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: 'Calories', amount: '21 kcal', dv: '1%' },
                      { label: 'Protein', amount: '0g', dv: '0%' },
                      { label: 'Total Fat', amount: '0g', dv: '0%' },
                      { label: 'Total Sugar', amount: '0g', dv: '0%' },
                      { label: 'Total Carbohydrates', amount: '5.18g', dv: '2%*' },
                      { label: 'Sodium', amount: '9mg', dv: '1%' },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between text-xs font-body border-b border-light-gray pb-1">
                        <span className="font-bold">{item.label}</span>
                        <div className="flex gap-4 min-w-[120px] justify-between">
                          <span>{item.amount}</span>
                          <span className="font-bold">{item.dv}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="hidden md:flex justify-between font-body text-xs font-bold border-b border-dark-charcoal pb-1 mb-1">
                    <span />
                    <div className="flex gap-4">
                      <span>Amount Per Serving</span>
                      <span>%DV</span>
                    </div>
                  </div>
                  <div className="space-y-1 md:border-l-[4px] md:border-dark-charcoal md:pl-4">
                    {[
                      { label: 'Ginkgo Biloba Extract', amount: '50 mg', dv: '†' },
                      { label: 'Slippery Elm Bark Extract', amount: '20 mg', dv: '†' },
                      { label: 'Vitamin D3', amount: '1000 IU', dv: '125%' },
                      { label: 'Vitamin B6', amount: '10 mg', dv: '588%' },
                      {
                        label: 'Lactobacillus Rhamnosus 19',
                        amount: '500 million CFU',
                        dv: '†',
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between text-xs font-body border-b border-light-gray pb-1">
                        <span className="font-bold">{item.label}</span>
                        <div className="flex gap-4 min-w-[100px] justify-between">
                          <span>{item.amount}</span>
                          <span className="font-bold">{item.dv}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="font-body text-[10px] leading-tight text-dark-charcoal">
                <p>
                  *Percent Daily Values (DV) are based on a 2000 calorie diet. † Daily Value (DV) not
                  established.
                </p>
                <p className="mt-1">
                  <span className="font-bold">Other Ingredients:</span> Maltitol Syrup, Water, Pectin,
                  CitricAcid Monohydrate, Sodium Citrate, DL-Malic Acid, Sodium Hexametaphosphate,
                  Flavor, Allura Red, Carnauba Wax, Caprylic/Capric Triglycerides, Glutinous Rice
                  Flour.
                </p>
              </div>
            </div>

            <button
              onClick={onShopNow}
              className="w-full bg-deep-rose text-white px-8 py-4 rounded-full font-body text-base font-medium hover:shadow-soft-xl hover:scale-[1.02] transition-all duration-300"
            >
              Shop Now — Save $10
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
