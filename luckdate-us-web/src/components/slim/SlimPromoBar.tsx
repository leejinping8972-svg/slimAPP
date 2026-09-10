import { Leaf, ShieldCheck, Truck } from 'lucide-react';

const items = [
  { icon: Truck, label: 'Free Shipping on Orders $50+' },
  { icon: ShieldCheck, label: '30-Day Happiness Guarantee' },
  { icon: Leaf, label: 'Made with Clean Ingredients' },
];

export default function SlimPromoBar() {
  return (
    <div className="bg-[#EDE8DF] text-[#737A65] border-b border-[#737A65]/10">
      <div className="max-w-[1120px] mx-auto px-4 py-2 flex items-center justify-center gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 shrink-0">
            <Icon className="w-3.5 h-3.5 opacity-80" />
            <span className="text-[11px] sm:text-xs font-medium whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
