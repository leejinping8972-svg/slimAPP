'use client';

import capsuleHand from "@/assets/body_purification/capsule-hand.webp";
import { getImageSrc } from "./utils";
import { LazyImg } from './LazyMedia';

const benefits = [
  {
    title: "Attacks the Root Cause",
    desc: "Works from within your body — not just covering up odors with mouthwash, mints, perfume and deodorant.",
  },
  {
    title: "24/7 Continuous Protection",
    desc: "Even works while you sleep — wake up with fresh breath instead of morning panic over bad breath and body odor.",
  },
  {
    title: "100% Natural & Safe",
    desc: "Plant-based formula gentle on sensitive stomachs — no harsh chemicals or side effects.",
  },
  {
    title: "Discreet & Travel-Friendly",
    desc: "Small capsules look like any vitamin — take them anywhere without awkward explanations.",
  },
  {
    title: "Scientifically Formulated",
    desc: "Chlorophyll neutralizes odor compounds while parsley and mint provide antibacterial action.",
  },
];

const CheckCircle = () => (
  <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const WhySection = () => {
  return (
    <>
      {/* Section 1: Why LuckDate Works */}
      <section className="py-5 sm:py-7 lg:py-8 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-bold font-display text-center mb-5 sm:mb-6 leading-[1.3] text-brand-dark text-[1.55rem] sm:text-3xl lg:text-[2.5rem] max-w-[20ch] sm:max-w-none mx-auto pb-3 lg:pb-5">
            Why LuckDate Works When{" "}
            <span className="inline-block underline decoration-primary decoration-[3px] underline-offset-[6px] lg:underline-offset-[10px] text-primary">
              Everything Else Fails
            </span>
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-8 lg:gap-16">
            {/* Image first on mobile, right on desktop */}
            <div className="order-1 lg:order-2 lg:w-[45%] flex justify-center">
              <LazyImg
                src={getImageSrc(capsuleHand)}
                alt="LuckDate capsule"
                className="max-w-[240px] sm:max-w-xs lg:max-w-sm w-full object-contain"
              />
            </div>

            <div className="order-2 lg:order-1 lg:w-[55%] space-y-4 sm:space-y-5 flex flex-col items-center">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3 text-left max-w-md w-full">
                  <CheckCircle />
                  <div>
                    <p className="font-bold text-foreground text-base mb-1">{b.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}

              <a
                href="#top"
                className="inline-block bg-primary text-primary-foreground font-bold py-4 px-10 rounded-lg text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors mt-2"
              >
                Stop the Embarrassment Now
              </a>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default WhySection;
