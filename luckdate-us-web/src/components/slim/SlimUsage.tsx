'use client';

import Image from 'next/image';
import SlimReveal from './SlimReveal';
import morningImg from '@/assets/slim/lifestyle-morning.png';
import busyImg from '@/assets/slim/lifestyle-energy.png';
import ritualImg from '@/assets/slim/lifestyle-ritual.png';

const scenes = [
  {
    image: morningImg,
    title: 'Morning Ritual',
    desc: 'Replace a rushed breakfast with balanced nutrition.',
  },
  {
    image: busyImg,
    title: 'Busy-Day Nutrition',
    desc: 'A convenient choice anywhere your day takes you.',
  },
  {
    image: ritualImg,
    title: 'Post-Movement Support',
    desc: 'Recharge after a walk or workout.',
  },
];

const tips = [
  'Mix 1 packet with 200–250ml cold water or milk.',
  'Shake well until smooth and creamy.',
  'Enjoy daily as breakfast, snack, or post-movement fuel.',
  'Combine with a balanced diet and movement for best results.',
];

export default function SlimUsage() {
  return (
    <section id="usage" className="py-14 md:py-20 bg-[#F9F7F2]">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8">
        <SlimReveal className="mb-8 md:mb-10 max-w-xl">
          <h2 className="text-3xl md:text-4xl lg:text-[2.65rem] font-medium text-[#2C322E] leading-tight">
            How to Use Slim.
            <br />
            Make it your daily ritual.
          </h2>
        </SlimReveal>

        <div className="grid lg:grid-cols-4 gap-4 md:gap-5">
          {scenes.map((scene, i) => (
            <SlimReveal key={scene.title} delay={i * 70} className="group">
              <div className="relative aspect-[3/4] rounded-[1.35rem] overflow-hidden mb-3">
                <Image
                  src={scene.image}
                  alt={scene.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2F27]/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-base font-medium">{scene.title}</p>
                  <p className="text-white/75 text-xs mt-1 leading-snug">{scene.desc}</p>
                </div>
              </div>
            </SlimReveal>
          ))}

          <SlimReveal delay={200}>
            <div className="h-full rounded-[1.35rem] bg-[#E8F0EA] border border-[#2A4035]/8 p-5 md:p-6 flex flex-col">
              <h3 className="text-xl font-medium text-[#2A4035] mb-1">How to Enjoy</h3>
              <p className="text-xs text-[#6C6763] mb-5">Four simple steps</p>
              <ol className="space-y-3.5 flex-1">
                {tips.map((tip, i) => (
                  <li key={tip} className="flex items-start gap-2.5 text-sm text-[#2C322E]/85 leading-snug">
                    <span className="w-5 h-5 rounded-full bg-[#2A4035] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ol>
            </div>
          </SlimReveal>
        </div>
      </div>
    </section>
  );
}
