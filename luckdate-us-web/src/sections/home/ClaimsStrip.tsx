'use client';

const claims = [
  { value: '16g', label: 'Protein per serving' },
  { value: '7', label: 'Day starter ritual' },
  { value: '28', label: 'Day full vitality ritual' },
  { value: '6', label: 'Vitamins & minerals' },
];

export function ClaimsStrip() {
  return (
    <section id="claims" className="bg-[#1E261C] py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-['Montserrat'] text-2xl font-bold text-white sm:text-3xl">
            Formula-led. Ritual-ready.
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Clear claims from the Slim Vitality label — built for a chocolate ritual you can keep.
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
          {claims.map((claim) => (
            <div key={claim.label} className="text-center">
              <dt className="font-['Montserrat'] text-4xl font-bold tracking-tight text-[#D8CBB8] sm:text-5xl">
                {claim.value}
              </dt>
              <dd className="mt-2 text-xs uppercase tracking-[0.12em] text-white/65 sm:text-sm">
                {claim.label}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-center text-[10px] text-white/40">
          As stated on packaging. Individual results vary.
        </p>
      </div>
    </section>
  );
}
