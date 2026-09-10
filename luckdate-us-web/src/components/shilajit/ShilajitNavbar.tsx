'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import luckdateLogo from '@/assets/shilajit/luckdate-logo-white.png';

const STORAGE_KEY = 'luckdate_shilajit_countdown_end';
const THIRTY_MIN_MS = 30 * 60 * 1000;

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
    const newEnd = now + THIRTY_MIN_MS;
    try {
      localStorage.setItem(STORAGE_KEY, String(newEnd));
    } catch {
      /* ignore */
    }
    end = newEnd;
  }

  const remaining = Math.max(0, end - now);
  if (remaining <= 0) {
    const newEnd = now + THIRTY_MIN_MS;
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

interface ShilajitNavbarProps {
  onShopNow: () => void;
}

export default function ShilajitNavbar({ onShopNow }: ShilajitNavbarProps) {
  const [time, setTime] = useState({ h: 7, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => setTime(getTimeLeft());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Promo banner */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 sm:py-2.5 text-[10px] sm:text-sm font-body font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-4 px-2">
        <span className="animate-pulse">🔥</span>
        <span className="truncate">Shop Now & Get Up To 82% Off</span>
        <span className="inline-flex items-center gap-0.5 sm:gap-1 font-mono text-[10px] sm:text-base font-bold bg-primary-foreground text-primary rounded px-1.5 py-0.5 sm:rounded-md sm:px-2 sm:py-1 shadow-md tracking-normal flex-shrink-0">
          <span className="w-5 sm:w-7 text-center text-[#ff0303]">{pad(time.h)}</span>
          <span>:</span>
          <span className="w-5 sm:w-7 text-center text-[#ff0303]">{pad(time.m)}</span>
          <span>:</span>
          <span className="w-5 sm:w-7 text-center text-[#ff0303]">{pad(time.s)}</span>
        </span>
        <span className="animate-pulse">🔥</span>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-10 sm:h-16">
        <div className="flex items-center gap-2 sm:gap-4">
          <Image src={luckdateLogo} alt="Luckdate" className="h-4 sm:h-8 w-auto brightness-200" width={120} height={32} />
          <span className="font-body text-sm sm:text-xl font-bold text-gold-gradient tracking-wide whitespace-nowrap">
            🏆 100k+ Sold
          </span>
        </div>
        <button
          onClick={onShopNow}
          className="px-2.5 py-1 sm:px-5 sm:py-2 bg-gold-gradient text-primary-foreground font-body font-bold text-[10px] sm:text-sm rounded-lg hover:opacity-90 transition-opacity active:scale-95"
        >
          Shop Now
        </button>
      </div>

      {/* Guarantee banner */}
      <div className="bg-primary text-primary-foreground text-center py-1 sm:py-2.5 text-[8px] sm:text-xs font-body font-semibold tracking-[0.15em] sm:tracking-[0.3em] uppercase flex items-center justify-center gap-1.5 sm:gap-4">
        <span className="opacity-60">✦</span>
        <span>SEE RESULTS IN 30 DAYS OR YOUR MONEY BACK</span>
        <span className="opacity-60">✦</span>
      </div>
    </nav>
  );
}
