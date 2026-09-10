'use client';

import Image from 'next/image';
import flowerImg from '@/assets/gummies/images/pain_points/flower.png';
import cloudImg from '@/assets/gummies/images/pain_points/cloud.png';
import scaleImg from '@/assets/gummies/images/pain_points/scale.png';

const painPoints = [
  {
    image: flowerImg,
    title: 'Constant dryness & discomfort?',
    description:
      'That persistent intimate dryness can make every day feel like a battle — stealing your comfort and shaking your confidence.',
  },
  {
    image: cloudImg,
    title: 'Worrying about unwanted odors?',
    description:
      'The anxiety of unexpected changes can hold you back from living fully — always second-guessing yourself.',
  },
  {
    image: scaleImg,
    title: 'Endless pH imbalance cycle?',
    description:
      "When your body's delicate balance feels out of control, it's exhausting. You deserve a solution that works naturally.",
  },
];

export default function PainPoints() {
  return (
    <section className="py-16 md:py-24 bg-light-gray">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-dark-charcoal mb-4 tracking-tight">
            We understand the whispers{' '}
            <span className="text-deep-rose italic font-light">you never share.</span>
          </h2>
          <p className="text-base md:text-lg text-medium-gray font-body px-2">
            Millions of women silently endure these struggles. You&apos;re not alone — and you don&apos;t have to
            settle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-soft-xl transition-all duration-700 border border-dark-charcoal/5 flex flex-col"
            >
              <div className="relative w-full h-48 md:h-56 overflow-hidden bg-soft-pink/30">
                <Image
                  src={point.image}
                  alt={point.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  width={400}
                  height={224}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
              </div>

              <div className="relative z-10 p-6 md:p-8 flex-grow flex flex-col justify-start">
                <h3 className="font-heading text-xl md:text-2xl font-medium text-dark-charcoal mb-3 pr-4 group-hover:text-deep-rose transition-colors duration-500">
                  {point.title}
                </h3>

                <p className="font-body text-sm md:text-base text-medium-gray leading-relaxed opacity-90">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-body text-lg md:text-xl text-dark-charcoal font-medium">
            It&apos;s time to{' '}
            <span className="text-deep-rose underline decoration-2 underline-offset-4 font-bold">
              take back your confidence.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
