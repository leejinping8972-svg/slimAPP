'use client';

import { CheckCircle2, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type Review = {
  name: string;
  initials: string;
  title: string;
  date: string;
  likes: number;
  text: string;
};

const reviews: Review[] = [
  { name: "Mattie W.", initials: "MW", title: "Bad Breath, Gone For Good", date: "4/20/2026", likes: 312, text: "I love this product!!! My breath odor has decreased so much. I used to be self-conscious all day but now I don't even think about it. LuckDate will forever be in my routine from now on." },
  { name: "Asia L.", initials: "AL", title: "Confidence From The Inside Out", date: "4/5/2026", likes: 287, text: "I'm in love with the LuckDate pills. My mouth feels cleansed and my breath stays fresh for hours. Those mints have NOTHING on this. By day 3 I felt totally different. Will definitely restock." },
  { name: "April R.", initials: "AR", title: "Skeptic Turned Believer", date: "3/17/2026", likes: 245, text: "I'm not even gonna lie… I was a little skeptical at first, but after actually using these, I get the hype now. I've been taking LuckDate consistently and one thing I noticed is how clean and refreshed my breath feels from the inside out." },
  { name: "Shamprea L.", initials: "SL", title: "Perfect For On The Go", date: "3/28/2026", likes: 198, text: "I love these pills for on the go. I sit back and take one with water on my off days. This is week 3 and I'm already ordering 2 more bottles. Game changer." },
  { name: "Maria S.", initials: "MS", title: "Way More Than I Expected", date: "4/16/2026", likes: 421, text: "I absolutely love LuckDate! I originally bought it for bad breath, but after a month of taking it daily I noticed other things too — my gum health improved and my confidence shot up. This is a must have, I could never go back!" },
  { name: "Amanda L.", initials: "AL", title: "Pleasantly Surprised", date: "4/15/2026", likes: 156, text: "I loved them! Definitely helped with my morning breath. No bad smell at all! I'm on my last bottle and reordering. They don't taste bad, actually kind of refreshing." },
  { name: "Stella P.", initials: "SP", title: "Simply Amazing", date: "3/26/2026", likes: 134, text: "This product is amazing and I feel great. My breath is fresh, my dates go better, and I just feel more confident overall. Highly recommend." },
  { name: "Christina B.", initials: "CB", title: "Long-Term User", date: "4/15/2026", likes: 178, text: "I've been using LuckDate for a few months now and just upped my daily dose. The freshness lasts longer than any mint or gum I've tried. Worth every penny." },
  { name: "Tamara M.", initials: "TM", title: "Subtle But Real", date: "3/29/2026", likes: 92, text: "Been using it for about 3 months now. Real changes — my breath is consistently fresher and my mouth feels cleaner all day. Subtle at first but definitely there." },
  { name: "Merelin D.", initials: "MD", title: "Works For The Whole Family", date: "4/1/2026", likes: 267, text: "I ordered two, one for me and one for my husband. We've been taking these for about 2 weeks. I'm extremely impressed at how well it works — even his coffee breath is gone. Will be ordering more for us." },
  { name: "Drew G.", initials: "DG", title: "Best On The Market", date: "3/15/2026", likes: 189, text: "This is the best breath freshening product I've had on the market. It has really helped me with dating and my fitness journey too. Confidence boost across the board." },
  { name: "Ivy W.", initials: "IW", title: "Giving It A Real Chance", date: "3/27/2026", likes: 76, text: "I've been taking them for about 3 weeks and have noticed a real difference. My partner mentioned my breath smells better. I'm going to keep taking to see what else happens." },
  { name: "Marian F.", initials: "MF", title: "Consistency Is Key", date: "3/8/2026", likes: 145, text: "Works well when consistent. Take it every day and you'll see results within a week. Perfect addition to my morning routine." },
  { name: "Mariam L.", initials: "ML", title: "The Truth", date: "4/10/2026", likes: 356, text: "Top tier — these LuckDate capsules are seriously the truth. Your days of awkward conversations, dating anxiety, and constantly chewing gum are over. Absolute game changer." },
  { name: "Ashley W.", initials: "AW", title: "Part Of My Daily Ritual", date: "3/19/2026", likes: 201, text: "When I say LuckDate is life... This is how I start my day — staying hydrated and taking my LuckDate pill at the same damn time. Keep it simple and consistent and you'll see results." },
  { name: "Rumour D.", initials: "RD", title: "Worth The Chance", date: "4/19/2026", likes: 312, text: "I was hesitant about trying this brand, but after my dental work I felt like no matter what I did my breath was just off. I saw the ads for LuckDate and figured I'd take the chance. It took maybe 3 days to fully kick in. Now I can talk close all day and still feel fresh!" },
  { name: "Monique V.", initials: "MV", title: "Fast Results", date: "4/11/2026", likes: 167, text: "It works amazing — literally after 3 days I saw a difference. My partner noticed before I did. Now it's a permanent part of my routine." },
  { name: "Treva W.", initials: "TW", title: "Absolute Love", date: "3/8/2026", likes: 124, text: "Absolutely love this!!! LuckDate has changed how I feel about myself in social situations. No more covering my mouth when I laugh." },
  { name: "Diana N.", initials: "DN", title: "Highly Recommended", date: "4/19/2026", likes: 98, text: "Highly recommended! Has my confidence at an all-time high and my breath staying fresh all day long. Just buy it." },
  { name: "Lavern C.", initials: "LC", title: "Obsessed", date: "3/22/2026", likes: 234, text: "I'm so in love with this product to the point that I'm obsessed. I can't see myself going through life without it. This is a product I didn't know I needed but now can't live without." },
  { name: "Jada M.", initials: "JM", title: "First Date Ready", date: "3/12/2026", likes: 289, text: "I had a first date last weekend and for the first time in years I wasn't paranoid about my breath. LuckDate gave me the confidence to actually be present instead of obsessing. He went in for the kiss and I just smiled." },
  { name: "Kelsey B.", initials: "KB", title: "Sales Job Saver", date: "3/2/2026", likes: 178, text: "Working in sales, I'm in people's faces all day. I used to constantly pop mints between meetings. Three weeks on LuckDate and I haven't touched a mint. My closing rate even went up — coincidence?" },
  { name: "Brittany H.", initials: "BH", title: "From Anxiety To Confidence", date: "2/27/2026", likes: 245, text: "I had social anxiety partly because of my breath. I'd avoid getting close to anyone. After LuckDate I actually go on dates again and stay in the conversation. It changed my life, not just my breath." },
  { name: "Tasha R.", initials: "TR", title: "Husband Noticed First", date: "2/19/2026", likes: 198, text: "My husband noticed before I did. He said 'whatever you've been doing lately, keep doing it.' We're cuddling more, kissing more — I didn't realize how much my breath was affecting our intimacy until LuckDate fixed it." },
  { name: "Olivia C.", initials: "OC", title: "Goodbye Mints, Forever", date: "2/14/2026", likes: 167, text: "I used to keep mints in every bag, every drawer, every car. Now my purse feels lighter and so does my mind. LuckDate works from the inside, so I don't have to constantly mask anything." },
  { name: "Vanessa P.", initials: "VP", title: "Even My Dentist Noticed", date: "2/8/2026", likes: 213, text: "Went in for my regular cleaning and my dentist asked if I'd changed something — said my mouth looked healthier. I told her about LuckDate. She wrote it down. That's all I needed to know." },
  { name: "Renee K.", initials: "RK", title: "Date Night Game Changer", date: "1/30/2026", likes: 256, text: "Date nights are completely different now. I'm not turning my head when he leans in. I'm not chewing gum the whole dinner. I'm just present, fresh, and confident. LuckDate is the secret weapon." },
  { name: "Jasmine F.", initials: "JF", title: "Goodbye Coffee Breath", date: "1/22/2026", likes: 145, text: "I drink 3 cups of coffee a day and my breath used to show it by 10am. With LuckDate it doesn't matter what I eat or drink — I stay fresh. Best supplement I've ever bought." },
  { name: "Megan T.", initials: "MT", title: "Worth Every Cent", date: "1/15/2026", likes: 187, text: "I was on the fence about the price but figured I'd try one bottle. Three bottles in and I'm subscribed. The freshness is real, the confidence is real, and the dating life is finally real." },
  { name: "Crystal A.", initials: "CA", title: "Life Changing Honestly", date: "1/9/2026", likes: 298, text: "I don't usually leave reviews but LuckDate deserves it. After years of feeling self-conscious every time I opened my mouth, I finally feel free. My friends ask why I'm so much more outgoing lately. This is why." },
];

const ReviewCard = ({ r }: { r: Review }) => (
  <div className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col h-full">
    <div className="flex items-center gap-3 mb-3">
      {/* <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {r.initials}
        </AvatarFallback>
      </Avatar> */}
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm">{r.name}</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground">Verified Customer · {r.date}</span>
      </div>
    </div>

    <h3 className="font-bold text-sm sm:text-base mb-2">{r.title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{r.text}</p>

    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-muted-foreground">
      <ThumbsUp className="w-4 h-4" />
      <span className="text-xs">{r.likes} found this helpful</span>
    </div>
  </div>
);

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const ReviewsSection = () => {
  const isMobile = useIsMobile();
  const perSlide = isMobile ? 3 : 6;
  const slides = chunk(reviews, perSlide);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 8000, stopOnInteraction: false, stopOnMouseEnter: true }));

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="py-5 sm:py-7 lg:py-8 bg-background">
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-center mb-2 text-brand-dark">
          What Our Customers Say
        </h2>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-4 sm:mb-7">
          14,837+ happy customers
        </p>

        <div className="max-w-8xl mx-auto relative px-0 lg:px-16">
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "start" }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="items-stretch">
              {slides.map((group, i) => (
                <CarouselItem key={i} className="h-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 auto-rows-min">
                    {group.map((r, j) => (
                      <ReviewCard key={`${i}-${j}`} r={r} />
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="flex left-1 lg:-left-14 h-7 w-7 sm:h-8 sm:w-8 bg-background/80 lg:bg-background shadow-md" />
            <CarouselNext className="flex right-1 lg:-right-14 h-7 w-7 sm:h-8 sm:w-8 bg-background/80 lg:bg-background shadow-md" />
          </Carousel>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-3 sm:mt-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  current === i ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
