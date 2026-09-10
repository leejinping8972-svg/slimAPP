'use client';

import Image from 'next/image';
import SlimReveal from './SlimReveal';
import yogaImg from '@/assets/slim/slim-lifestyle-yoga.png';
import routineImg from '@/assets/slim/slim-lifestyle-routine.png';
import womenImg from '@/assets/slim/slim-lifestyle-women.png';
import agingImg from '@/assets/slim/slim-lifestyle-aging.png';

const scenes = [
  { image: yogaImg, title: 'Daily movement', label: 'Morning stretch & mindful movement' },
  { image: routineImg, title: 'Balanced routines', label: 'Nutrition that fits your day' },
  { image: womenImg, title: "Women's vitality", label: 'Energy for every chapter' },
  { image: agingImg, title: 'Healthy aging', label: 'Strength that lasts' },
];

export default function SlimVitalityGallery() {
  return (
    <section id="vitality" className="py-12 lg:py-16 bg-[#FCFBF7]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <SlimReveal className="text-center mb-8 lg:mb-10">
          <h2
            className="text-[1.75rem] sm:text-[2rem] lg:text-[2.2rem] font-medium text-[#3D4038]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Vitality for every chapter.
          </h2>
        </SlimReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {scenes.map((scene, i) => (
            <SlimReveal key={scene.title} delay={i * 60}>
              <div className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-[#EDE8DF]">
                  <Image
                    src={scene.image}
                    alt={scene.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D4038]/55 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-[13px] sm:text-sm font-medium">
                    {scene.title}
                  </p>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#6C6763] px-0.5 leading-snug">{scene.label}</p>
              </div>
            </SlimReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
