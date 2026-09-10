'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import SlimReveal from './SlimReveal';
import avatar1 from '@/assets/slim/avatar-1.jpg';
import avatar2 from '@/assets/slim/avatar-2.jpg';
import avatar3 from '@/assets/slim/avatar-3.jpg';

const stories = [
  {
    image: avatar1,
    name: 'Maya R.',
    location: 'Austin, TX',
    quote:
      'I finally stopped restarting every Monday. Slim + Sunny made 28 days feel doable — not another diet.',
  },
  {
    image: avatar2,
    name: 'Elena K.',
    location: 'Brooklyn, NY',
    quote:
      'The shake is great, but the ritual is what changed things. Reminders and check-ins kept me honest.',
  },
  {
    image: avatar3,
    name: 'Priya S.',
    location: 'Seattle, WA',
    quote:
      'I wanted energy without cutting everything out. This feels like support, not restriction.',
  },
];

export default function SlimStories() {
  return (
    <section id="stories" className="py-14 md:py-20 bg-[#F9F7F2]">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8">
        <SlimReveal className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[2.65rem] font-medium text-[#2C322E] leading-tight mb-5">
            Real People. Real Journeys.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-[#2C322E]">
            <span className="font-semibold">10,000+ Happy Customers</span>
            <span className="flex items-center gap-1.5">
              <span className="font-semibold">4.9</span>
              <span className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#B59461] text-[#B59461]" />
                ))}
              </span>
              <span className="text-[#6C6763]">Average Rating</span>
            </span>
          </div>
        </SlimReveal>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {stories.map((story, i) => (
            <SlimReveal
              key={story.name}
              delay={i * 80}
              className="bg-white rounded-[1.5rem] p-6 border border-[#2A4035]/8"
            >
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="w-3.5 h-3.5 fill-[#B59461] text-[#B59461]" />
                ))}
              </div>
              <p className="text-sm text-[#2C322E]/85 leading-relaxed mb-5">
                &ldquo;{story.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src={story.image}
                  alt={story.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[#2C322E]">{story.name}</p>
                  <p className="text-xs text-[#6C6763]">{story.location}</p>
                </div>
              </div>
            </SlimReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
