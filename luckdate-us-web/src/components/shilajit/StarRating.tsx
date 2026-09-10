'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-3 h-3 sm:w-4 sm:h-4',
  md: 'w-3.5 h-3.5 sm:w-5 sm:h-5',
  lg: 'w-4 h-4 sm:w-6 sm:h-6',
};

export default function StarRating({ count = 5, size = 'md' }: StarRatingProps) {
  return (
    <div className="flex">
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} className={`${sizeMap[size]} fill-primary text-primary`} />
      ))}
    </div>
  );
}
