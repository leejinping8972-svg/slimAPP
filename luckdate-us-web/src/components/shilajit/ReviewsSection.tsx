'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ThumbsUp } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import StarRating from './StarRating';
import { useIsMobileView } from '@/hooks/use-mobile-view';
import { CAROUSEL_AUTOPLAY_MS } from '@/lib/shilajit-constants';

const avatarColors = [
  'bg-amber-700', 'bg-emerald-700', 'bg-blue-700', 'bg-rose-700',
  'bg-violet-700', 'bg-cyan-700', 'bg-orange-700', 'bg-teal-700',
];

const allReviews = [
  { name: 'James H.', text: 'The doctors suggested pills with bad side effects. I tried Luckdate instead. The stamina gains are legit. No regrets. Better blood flow = harder, longer-lasting results.', rating: 5, verified: true, likes: 247, daysAgo: 3 },
  { name: 'Sarah M.', text: 'Bought this for my husband as a surprise. He was hesitant but after the first month, he became a believer. Our intimacy has never been better.', rating: 5, verified: true, likes: 189, daysAgo: 5 },
  { name: 'David P.', text: 'I thought my best days were behind me. Now she is the one asking for more. Truly life changing for my marriage. In just 2 weeks, I felt the difference.', rating: 5, verified: true, likes: 312, daysAgo: 8 },
  { name: 'Lisa R.', text: "Finally a shilajit product that doesn't taste terrible! These gummies are easy to take and I can feel the difference in my daily energy and focus.", rating: 5, verified: true, likes: 93, daysAgo: 12 },
  { name: 'Michael K.', text: "Best supplement investment I've made. Luckdate's 10-in-1 formula covers everything I was taking separately. Simplified my routine completely!", rating: 5, verified: true, likes: 156, daysAgo: 14 },
  { name: 'Anna W.', text: 'I bought Luckdate for my husband and he absolutely loves it. He says his energy is better and he feels more focused throughout the day.', rating: 5, verified: true, likes: 78, daysAgo: 17 },
  { name: 'Robert T.', text: 'At 60 I worried about my manhood and prostate health constantly. Luckdate handles both. I feel strong and capable again downstairs.', rating: 5, verified: true, likes: 421, daysAgo: 19 },
  { name: 'Christina K.', text: "As the wife of a man who has been struggling with ED… Luckdate saved our marriage. He's lasting longer, pleasing me, and noticeable energy overall.", rating: 5, verified: true, likes: 534, daysAgo: 21 },
  { name: 'Marcus W.', text: 'I was skeptical at first but gave Luckdate a shot. After 3 weeks, the difference was undeniable. My wife noticed before I even said anything.', rating: 5, verified: true, likes: 203, daysAgo: 24 },
  { name: 'Frank L.', text: 'At 55, I thought declining performance was just part of aging. Luckdate proved me wrong. I feel like I\'m in my 30s again. Prostate benefits are huge too.', rating: 5, verified: true, likes: 167, daysAgo: 27 },
  { name: 'Anthony R.', text: 'Been using Luckdate for 2 months now. Better blood flow, more endurance, and my confidence is through the roof. This is the real deal.', rating: 5, verified: true, likes: 289, daysAgo: 30 },
  { name: 'Jennifer S.', text: 'Got Luckdate for my husband as a gift. He\'s been taking it daily and says he feels more energized and focused. We\'re both thrilled!', rating: 5, verified: true, likes: 114, daysAgo: 33 },
  { name: 'Thomas B.', text: 'The quality of Luckdate is outstanding. I\'ve recommended it to all my friends. Natural ingredients that actually work — what more could you ask for?', rating: 5, verified: true, likes: 76, daysAgo: 36 },
  { name: 'Kevin D.', text: 'I replaced 3 different supplements with Luckdate. Saves money and works better than any of them individually. Absolutely love it.', rating: 5, verified: true, likes: 198, daysAgo: 38 },
  { name: 'Rachel P.', text: 'My husband has been using Luckdate for 6 weeks and the change is remarkable. More energy, better sleep, and he\'s in a much better mood overall.', rating: 5, verified: true, likes: 145, daysAgo: 41 },
  { name: 'Daniel G.', text: 'Luckdate is the first supplement that actually delivered on its promises. I feel more energized, my workouts are better, and recovery is faster.', rating: 5, verified: true, likes: 87, daysAgo: 44 },
  { name: 'Patricia N.', text: 'My partner started taking Luckdate and within a month I noticed the difference. More stamina, better mood, and he\'s more confident than ever.', rating: 5, verified: true, likes: 231, daysAgo: 47 },
  { name: 'Steven C.', text: 'I\'ve been taking Luckdate daily for 3 months. The sustained energy boost alone is worth it, but the other benefits keep me coming back.', rating: 5, verified: true, likes: 162, daysAgo: 50 },
  { name: 'William F.', text: 'After trying countless supplements, Luckdate is the only one that gave me real, noticeable results. My energy, stamina, and overall health have improved.', rating: 5, verified: true, likes: 304, daysAgo: 53 },
  { name: 'Maria L.', text: 'Bought Luckdate for my husband after reading the reviews. He was skeptical but now he swears by it. Our intimacy life has improved dramatically.', rating: 5, verified: true, likes: 178, daysAgo: 56 },
  { name: 'George A.', text: 'Luckdate\'s 10-in-1 formula is genius. I used to take shilajit, ashwagandha, and pomegranate separately. Now it\'s all in one delicious gummy.', rating: 5, verified: true, likes: 95, daysAgo: 59 },
  { name: 'Nancy H.', text: 'My husband has more energy since starting Luckdate. He\'s back to his morning jogs and our evenings together have been more enjoyable too.', rating: 5, verified: true, likes: 267, daysAgo: 62 },
  { name: 'Richard M.', text: 'At 48, I felt like I was slowing down. Luckdate brought back the drive and energy I had in my 20s. Can\'t recommend it enough.', rating: 5, verified: true, likes: 143, daysAgo: 65 },
  { name: 'Susan T.', text: 'The best part about Luckdate is that it\'s all natural. No weird chemicals, no side effects. Just pure, effective ingredients that work.', rating: 5, verified: true, likes: 412, daysAgo: 68 },
  { name: 'Charles E.', text: 'Luckdate gave me back my confidence. I feel like a new man. Better performance, more energy, and I\'m in a better mood every single day.', rating: 5, verified: true, likes: 186, daysAgo: 71 },
  { name: 'Barbara J.', text: 'I surprised my partner with Luckdate and he loves it. He says it\'s the best supplement he\'s ever tried. Our relationship has never been stronger.', rating: 5, verified: true, likes: 59, daysAgo: 74 },
  { name: 'Joseph W.', text: 'The shilajit and manuka honey combination in Luckdate is incredible. I\'ve noticed improved focus at work and better stamina in the gym.', rating: 5, verified: true, likes: 328, daysAgo: 77 },
  { name: 'Linda K.', text: 'Recommended Luckdate to my husband after a friend told me about it. Within 2 weeks he was raving about how much better he felt overall.', rating: 5, verified: true, likes: 121, daysAgo: 80 },
  { name: 'Paul S.', text: 'I\'ve tried expensive prescription options before. Luckdate works just as well naturally and without any side effects. A total game changer for me.', rating: 5, verified: true, likes: 253, daysAgo: 83 },
  { name: 'Carol D.', text: 'My husband is 62 and Luckdate has given him a new lease on life. More vitality, better prostate health, and he feels years younger.', rating: 5, verified: true, likes: 197, daysAgo: 87 },
];

function formatDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function ReviewsSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useIsMobileView();
  const perPage = isMobile ? 3 : 6;
  const pages = chunkArray(allReviews, perPage);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), CAROUSEL_AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [perPage, emblaApi]);

  return (
    <section className="py-8 sm:py-20 bg-card">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <h2 className="font-display text-lg sm:text-3xl lg:text-5xl font-bold text-center text-foreground mb-1.5 sm:mb-3">
          What Our Customers Say
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-5 sm:mb-12">
          <StarRating />
          <span className="text-[11px] sm:text-base text-foreground/60 font-body">4.9/5 based on 2,400+ reviews</span>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {pages.map((page, pageIdx) => (
                <div key={pageIdx} className="flex-[0_0_100%] min-w-0 px-1 sm:px-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
                    {page.map((r, rIdx) => {
                      const colorClass = avatarColors[(pageIdx * perPage + rIdx) % avatarColors.length];
                      const initials = r.name.charAt(0);
                      return (
                        <div key={r.name} className="bg-secondary rounded-xl p-3 sm:p-6 border border-border flex flex-col">
                          {/* Header: Avatar + Name + Time */}
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            {/* <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-white font-body font-bold text-xs sm:text-sm">{initials}</span>
                            </div> */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-body text-xs sm:text-base font-bold text-foreground">{r.name}</span>
                                {r.verified && (
                                  <span className="text-[9px] sm:text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-body font-semibold">
                                    ✓ Verified
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] sm:text-xs text-muted-foreground font-body">{formatDate(r.daysAgo)}</span>
                            </div>
                          </div>

                          {/* Stars */}
                          <div className="mb-1.5 sm:mb-3">
                            <StarRating size="sm" />
                          </div>

                          {/* Review text */}
                          <p className="font-body text-[11px] sm:text-base text-foreground/80 mb-2.5 sm:mb-4 leading-relaxed line-clamp-4 flex-1">
                            &quot;{r.text}&quot;
                          </p>

                          {/* Footer: Likes */}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-[10px] sm:text-xs font-body">{r.likes}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 p-1 sm:p-2.5 rounded-full bg-card border border-border hover:border-primary transition-colors z-10 active:scale-90">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          <button onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 p-1 sm:p-2.5 rounded-full bg-card border border-border hover:border-primary transition-colors z-10 active:scale-90">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-8">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full transition-colors ${i === selectedIndex ? 'bg-primary' : 'bg-border'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
