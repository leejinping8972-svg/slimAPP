'use client';

import { useState, useEffect } from 'react';
import { Clock, Tag, Flame } from 'lucide-react';

const STORAGE_KEY = 'luckdate_gummies_countdown_end';
const SEVEN_HOURS_MS = 7 * 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getTimeLeft() {
  if (typeof window === 'undefined') return { h: 7, m: 0, s: 0 };

  const now = Date.now();
  let end = 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) end = parseInt(stored, 10);
  } catch {
    /* ignore */
  }

  if (!end || now >= end) {
    const newEnd = now + SEVEN_HOURS_MS;
    try {
      localStorage.setItem(STORAGE_KEY, String(newEnd));
    } catch {
      /* ignore */
    }
    end = newEnd;
  }

  const remaining = Math.max(0, end - now);
  if (remaining <= 0) {
    const newEnd = now + SEVEN_HOURS_MS;
    try {
      localStorage.setItem(STORAGE_KEY, String(newEnd));
    } catch {
      /* ignore */
    }
    return getTimeLeft();
  }

  const h = Math.floor(remaining / (60 * 60 * 1000));
  const m = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const s = Math.floor((remaining % (60 * 1000)) / 1000);
  return { h, m, s };
}

interface CountdownBannerProps {
  onShopNow: () => void;
}

export default function CountdownBanner({ onShopNow }: CountdownBannerProps) {
  const [time, setTime] = useState({ h: 7, m: 0, s: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [stockCount, setStockCount] = useState(100);

  useEffect(() => {
    setStockCount(Math.floor(Math.random() * 50) + 80);
  }, []);

  useEffect(() => {
    const tick = () => setTime(getTimeLeft());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-[72px] left-0 right-0 z-40 bg-gradient-to-r from-deep-rose to-[#d4a0a4] text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <span className="font-body text-sm font-medium">
            Flash Sale: <span className="font-bold">UP TO 50% OFF</span>
          </span>
        </div>

        <div className="hidden sm:block w-px h-4 bg-white/30" />

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-body text-sm">Ends in:</span>
          <div className="flex items-center gap-1">
            <div className="bg-white/20 rounded-lg px-2 py-1 min-w-[36px] text-center">
              <span className="font-body font-bold text-sm">{pad(time.h)}</span>
            </div>
            <span className="font-body">:</span>
            <div className="bg-white/20 rounded-lg px-2 py-1 min-w-[36px] text-center">
              <span className="font-body font-bold text-sm">{pad(time.m)}</span>
            </div>
            <span className="font-body">:</span>
            <div className="bg-white/20 rounded-lg px-2 py-1 min-w-[36px] text-center">
              <span className="font-body font-bold text-sm">{pad(time.s)}</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <div className="w-px h-4 bg-white/30" />
          <Flame className="w-3.5 h-3.5 text-yellow-200" />
          <span className="font-body text-xs text-yellow-200 font-medium">Only {stockCount} left</span>
        </div>

        <button
          onClick={onShopNow}
          className="hidden sm:block bg-white text-deep-rose px-4 py-1.5 rounded-full font-body text-sm font-medium hover:bg-soft-pink transition-colors duration-300"
        >
          Shop Now
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors duration-300"
          aria-label="Close banner"
        >
          <span className="text-lg leading-none">&times;</span>
        </button>
      </div>
    </div>
  );
}
