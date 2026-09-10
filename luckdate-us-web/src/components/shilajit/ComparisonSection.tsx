'use client';

import Image from 'next/image';
import { Check, X } from 'lucide-react';
import productHero from '@/assets/shilajit/product-hero.jpg';
import genericSupplement from '@/assets/shilajit/generic-supplement.png';

const features = [
  "Third-Party Tested Fulvic Acid",
  "Supports Testosterone & Drive*",
  "Blood Flow & Firmer Erections*",
  "No Stimulants • No Crash",
  "Precision Daily Dosing",
  "Clean Ingredients • No Fillers",
];

export default function ComparisonSection() {
  return (
    <section className="py-8 sm:py-20 bg-card">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <p className="text-center text-primary font-body text-[10px] sm:text-sm font-bold uppercase tracking-widest mb-1.5 sm:mb-3">
          THE LUCKDATE DIFFERENCE
        </p>
        <h2 className="font-display text-lg sm:text-3xl lg:text-5xl font-bold text-center text-foreground mb-1.5 sm:mb-4">
          <span className="text-gold-gradient">Luckdate</span> vs Other Brands
        </h2>
        <p className="text-center text-foreground/60 font-body text-[11px] sm:text-base mb-5 sm:mb-12">
          What actually impacts performance.*
        </p>

        <div className="overflow-x-auto -mx-3 px-3 sm:-mx-4 sm:px-4">
          <table className="w-full min-w-[320px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 sm:py-5 font-body text-[11px] sm:text-lg text-foreground/60 font-semibold">What matters</th>
                <th className="text-center py-2.5 sm:py-5 w-16 sm:w-36">
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <Image src={productHero} alt="Luckdate" width={64} height={64} className="w-8 h-8 sm:w-16 sm:h-16 rounded-lg object-cover" />
                    <span className="font-body text-[10px] sm:text-lg font-bold text-gold-gradient">Luckdate</span>
                  </div>
                </th>
                <th className="text-center py-2.5 sm:py-5 w-16 sm:w-36">
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <Image src={genericSupplement} alt="Other brands" width={64} height={64} className="w-8 h-8 sm:w-16 sm:h-16 rounded-lg object-cover" />
                    <span className="font-body text-[10px] sm:text-lg text-foreground/50">Other</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f} className="border-b border-border/50">
                  <td className="py-2 sm:py-5 font-body text-[10px] sm:text-lg text-foreground pr-2">{f}</td>
                  <td className="py-2 sm:py-5 text-center">
                    <div className="flex justify-center">
                      <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-primary" />
                      </div>
                    </div>
                  </td>
                  <td className="py-2 sm:py-5 text-center">
                    <div className="flex justify-center">
                      <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-destructive/20 flex items-center justify-center">
                        <X className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-destructive" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
