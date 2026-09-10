'use client';

const items = [
  '10-in-1 Wellness Blend',
  '1000mg Shilajit Extract',
  'Enhanced Immune Defense',
  'Sustained Energy & Vitality',
  '84+ Essential Minerals',
  'Non-GMO • Gluten Free • Vegan',
];

export default function MarqueeBanner() {
  return (
    <div className="bg-primary overflow-hidden py-2 sm:py-3.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-3 sm:mx-8 text-primary-foreground font-body text-[9px] sm:text-sm font-semibold tracking-wider">
            ✦ {item}
          </span>
        ))}
      </div>
    </div>
  );
}
