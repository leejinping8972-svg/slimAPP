'use client';

const GutBanner = () => {
  return (
    <section className="bg-secondary py-5 sm:py-7 lg:py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-display text-brand-dark leading-tight text-center">
          Bad Breath Starts in Your Gut,{" "}
          <span className="underline decoration-primary decoration-[3px] underline-offset-4 text-primary">
            Not Your Mouth
          </span>
        </h2>
        <p className="mt-3 sm:mt-4 text-sm lg:text-base text-muted-foreground leading-relaxed max-w-5xl mx-auto text-center">
          LuckDate&apos;s revolutionary internal deodorant works from the inside out, neutralizing
          odor-causing bacteria at the source. One simple capsule a day gives you{" "}
          <strong className="text-foreground">24/7 fresh-breath confidence</strong>.
        </p>
      </div>
    </section>
  );
};

export default GutBanner;
