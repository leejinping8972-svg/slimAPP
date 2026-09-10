'use client';

const items = [
  "Neutralize body & breath odor naturally",
  "Naturally formulated with chlorophyll & mint",
  "100,000+ confident LuckDate customers",
  "Feel fresh from the inside out",
  "30-day money-back guarantee",
  "Free Shipping",
];

const Marquee = () => {
  return (
    <div className="bg-accent text-accent-foreground py-1.5 sm:py-2 overflow-hidden border-y border-border">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 sm:mx-8 text-xs sm:text-sm font-semibold tracking-wide uppercase">
            ✦ {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
