'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star } from 'lucide-react';
import { SectionShell, SectionEyebrow, SectionTitle } from './SectionShell';

interface ReviewCard {
  rating: number;
  date: string;
  title: string;
  body: string;
  name: string;
  verified: boolean;
  product: string;
}

const PREVIEW_LENGTH = 140;
const INITIAL_VISIBLE = 4;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-[#D4AF5A] fill-[#D4AF5A]' : 'text-[#E8D5A3]/50'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewCardItem({ review }: { review: ReviewCard }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.body.length > PREVIEW_LENGTH;
  const displayBody =
    expanded || !isLong ? review.body : `${review.body.slice(0, PREVIEW_LENGTH).trim()}...`;

  return (
    <article className="border border-[#D8CBB8]/45 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <StarRating rating={review.rating} />
        <time className="text-xs text-[#9A9188] shrink-0">{review.date}</time>
      </div>

      <h3 className="font-bold text-[#1E261C] text-base mb-2 font-['Montserrat'] leading-snug">
        {review.title}
      </h3>

      <p className="text-sm text-[#4A4A4A] leading-relaxed mb-3 line-clamp-4">{displayBody}</p>
      {isLong && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-sm text-[#9A9188] hover:text-[#6C6763] transition-colors mb-3"
        >
          Read more
        </button>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {review.verified && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7A62]">
            <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
            {review.name}
          </span>
        )}
        <span className="inline-flex items-center border border-[#6B7A62]/35 bg-[#E8EDE4]/60 px-2.5 py-0.5 text-xs font-medium text-[#5A6852]">
          {review.product}
        </span>
      </div>
    </article>
  );
}

export function FeaturedReviewsSection() {
  const { t } = useTranslation();
  const cards = t('homeLayout.reviews.cards', { returnObjects: true }) as ReviewCard[];
  const reviews = Array.isArray(cards) ? cards : [];
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  if (reviews.length === 0) return null;

  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <SectionShell id="customer-stories" background="ivory" layout="compact">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8 lg:mb-10">
          <SectionEyebrow>{t('homeLayout.reviews.label')}</SectionEyebrow>
          <SectionTitle className="mb-2">{t('homeLayout.reviews.title')}</SectionTitle>
          <p className="text-sm text-[#6C6763]/80 leading-relaxed">{t('homeLayout.reviews.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5">
          {visible.map((review, i) => (
            <ReviewCardItem key={`${review.name}-${review.date}-${i}`} review={review} />
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => Math.min(n + 4, reviews.length))}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold border-2 border-[#1E261C] text-[#1E261C] hover:bg-[#1E261C] hover:text-white transition-colors"
            >
              {t('homeLayout.reviews.loadMore')}
            </button>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
