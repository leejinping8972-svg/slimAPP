'use client';

const CLAIMS = [
  {
    kicker: 'Better body',
    value: 'Leaner',
    detail: 'Daily protein to support a silhouette you can keep.',
  },
  {
    kicker: 'Better workouts',
    value: 'Stronger',
    detail: '16g protein per pour for training and recovery.',
  },
  {
    kicker: 'Better sleep',
    value: 'Deeper',
    detail: 'A simple evening ritual instead of a late-night stack.',
  },
  {
    kicker: 'Stronger gut',
    value: 'Steadier',
    detail: 'Whey protein to support everyday gut rhythm.',
  },
];

/** ARMRA-style results strip — pastel wash, four editorial columns. */
export function ClaimsStrip() {
  return (
    <section id="claims" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_20%,rgba(255,210,230,0.55)_0%,transparent_42%),radial-gradient(ellipse_at_88%_18%,rgba(255,236,150,0.7)_0%,transparent_46%),radial-gradient(ellipse_at_78%_82%,rgba(190,235,170,0.55)_0%,transparent_48%),radial-gradient(ellipse_at_18%_85%,rgba(210,220,255,0.4)_0%,transparent_42%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-['Montserrat'] text-[2rem] font-bold leading-[1.12] tracking-[-0.03em] text-[#111111] sm:text-4xl lg:text-[2.85rem]">
            Whole-body results.
            <br />
            One daily ritual.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#333333] sm:text-base">
            Slim Vitality is built for a chocolate pour you can keep — supporting body, training,
            sleep, and gut rhythm in one ritual.
          </p>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-16 lg:grid-cols-4 lg:gap-8">
          {CLAIMS.map((claim) => (
            <div key={claim.kicker} className="text-center">
              <dt className="text-sm font-semibold text-[#111111] sm:text-[15px]">{claim.kicker}</dt>
              <dd>
                <p className="mt-2 font-['Montserrat'] text-[2.6rem] font-bold leading-none tracking-[-0.04em] text-[#111111] sm:text-5xl lg:text-[3.4rem]">
                  {claim.value}
                </p>
                <p className="mx-auto mt-3 max-w-[22ch] text-[13px] leading-relaxed text-[#444444] sm:text-sm">
                  {claim.detail}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-12 text-center text-[10px] leading-relaxed text-[#777777] sm:text-[11px]">
          Individual results vary. Not a substitute for a varied diet or medical advice.
        </p>
      </div>
    </section>
  );
}
