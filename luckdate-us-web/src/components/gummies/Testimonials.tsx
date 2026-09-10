'use client';

import Image from 'next/image';
import { Star, CheckCircle } from 'lucide-react';

const avatarList = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=80&h=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=faces',
];

const reviews = [
  {
    name: 'Sarah M.',
    age: '32',
    verified: true,
    text: "I've struggled with pH imbalances for years. Since starting these gummies, I feel completely fresh and confident all day long. They actually taste amazing too!",
    rating: 5,
  },
  {
    name: 'Jessica R.',
    age: '28',
    verified: true,
    text: "Finally something that addresses intimate moisture and odor naturally! I noticed a huge difference within the first two weeks of taking them.",
    rating: 5,
  },
  {
    name: 'Emily T.',
    age: '41',
    verified: true,
    text: "These are a game changer for women's wellness. The dryness and irritation are completely gone, and I love that it uses natural ingredients like Slippery Elm.",
    rating: 5,
  },
  {
    name: 'Amanda H.',
    age: '35',
    verified: true,
    text: "I was skeptical at first, but these really work for controlling odor and keeping my body in balance. Plus, the raspberry mint flavor is delicious.",
    rating: 5,
  },
  {
    name: 'Lauren C.',
    age: '29',
    verified: true,
    text: "Best addition to my daily routine. My confidence is back, and I don't have to worry about unpredictable changes anymore.",
    rating: 5,
  },
  {
    name: 'Michelle K.',
    age: '38',
    verified: true,
    text: "I feel balanced, hydrated, and completely normal again. It's so nice to find a product that does exactly what it promises without weird chemicals.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-light-gray/50">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-deep-rose text-deep-rose" />
            ))}
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-dark-charcoal mb-4 tracking-tight">
            Trusted by Thriving Women
          </h2>
          <p className="text-base md:text-lg text-medium-gray font-body max-w-2xl mx-auto">
            See why thousands of women have made Aura Probiotic Gummies a staple in their daily wellness
            routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-xs hover:shadow-soft-lg border border-dark-charcoal/5 transform hover:-translate-y-1 transition-all duration-500 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFA41C] text-[#FFA41C]" />
                  ))}
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 text-mint-green">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-body font-medium">Verified</span>
                  </div>
                )}
              </div>
              <p className="font-body text-dark-charcoal/90 text-[15px] leading-loose mb-8 flex-grow">
                &quot;{review.text}&quot;
              </p>
              <div className="flex items-center justify-between border-t border-dark-charcoal/5 pt-5 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-light-gray">
                    <Image
                      src={avatarList[index]}
                      alt={review.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                      unoptimized
                    />
                  </div>
                  <span className="font-heading font-medium text-lg text-dark-charcoal truncate">
                    {review.name}
                  </span>
                </div>
                <span className="text-xs text-medium-gray font-body uppercase tracking-wider flex-shrink-0">
                  Age {review.age}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white shadow-soft px-8 py-4 rounded-full border border-dark-charcoal/5 hover:shadow-soft-lg transition-shadow duration-300">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
              alt="Amazon"
              className="h-4"
              width={60}
              height={16}
              unoptimized
            />
            <span className="w-px h-4 bg-gray-200" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#FFA41C] text-[#FFA41C]" />
              ))}
            </div>
            <span className="text-xs font-body font-bold text-dark-charcoal">4.8/5 Rating</span>
          </div>
        </div>

        <div className="mt-10 max-w-xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#232F3E] to-[#131921] rounded-3xl p-8 text-center overflow-hidden shadow-soft-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF9900]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00A8E1]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-white/10">
                <span className="text-[#00A8E1] text-xs font-body font-bold tracking-wider uppercase">
                  Prime Member?
                </span>
              </div>

              <h3 className="font-heading text-xl md:text-2xl font-semibold text-white mb-3">
                I&apos;m an Amazon Prime Member
              </h3>
              <p className="font-body text-sm text-white/70 mb-6 max-w-sm mx-auto">
                Enjoy faster delivery, easy returns, and the same great product — right from Amazon.
              </p>

              <a
                href="https://www.amazon.com/probiotic gummies-probiotics for women-ph balance gummies-slippery elm for women-pheromone gummies for women/dp/B0GD19FN4L"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] px-8 py-3.5 rounded-full font-body text-base font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                  alt="Amazon"
                  className="h-4"
                  width={60}
                  height={16}
                  unoptimized
                />
                Buy on Amazon
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
