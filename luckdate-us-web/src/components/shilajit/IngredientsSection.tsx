'use client';

import { Zap, Brain, Dumbbell, Heart, Leaf, Shield, Droplets, Flame, Sun, Mountain } from 'lucide-react';

const ingredients = [
  { icon: Mountain, name: 'Shilajit', benefit: 'Energy', dose: '1000mg' },
  { icon: Leaf, name: 'Ashwagandha', benefit: 'Stress Relief', dose: '200mg' },
  { icon: Sun, name: 'Turmeric', benefit: 'Immunity', dose: '50mg' },
  { icon: Dumbbell, name: 'Black Musli', benefit: 'Vitality', dose: '6mg' },
  { icon: Droplets, name: 'Gokshura', benefit: 'Kidney Health', dose: '6mg' },
  { icon: Heart, name: 'Kaunch', benefit: 'Muscle Health', dose: '6mg' },
  { icon: Flame, name: 'Black Pepper', benefit: 'Absorption', dose: '20mg' },
  { icon: Zap, name: 'Akarkara', benefit: 'Stamina', dose: '4mg' },
  { icon: Brain, name: 'Maca Root', benefit: 'Performance', dose: '400mg' },
  { icon: Shield, name: 'Tongkat Ali', benefit: 'Drive', dose: '200mg' },
];

export default function IngredientsSection() {
  return (
    <section className="py-8 sm:py-20 bg-card">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <h2 className="font-display text-lg sm:text-3xl lg:text-5xl font-bold text-center text-gold-gradient mb-1.5 sm:mb-4">
          The Power of 10-in-1
        </h2>
        <p className="text-center text-foreground/60 font-body text-[11px] sm:text-base mb-5 sm:mb-14 max-w-xl mx-auto">
          Each gummy packs 10 powerful natural ingredients, carefully dosed for maximum wellness benefits.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          {ingredients.map((ing) => (
            <div
              key={ing.name}
              className="bg-secondary rounded-xl p-2.5 sm:p-5 text-center hover:border-primary border border-border transition-colors group"
            >
              <ing.icon className="w-5 h-5 sm:w-9 sm:h-9 text-primary mx-auto mb-1 sm:mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-body text-[11px] sm:text-base font-bold text-foreground">{ing.name}</h3>
              <p className="text-[9px] sm:text-sm text-foreground/60 font-body mt-0.5">{ing.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
