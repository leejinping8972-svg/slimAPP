'use client';

import { useState, useEffect } from "react";

const CountdownBar = () => {
  const [countdown, setCountdown] = useState(30 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="bg-primary text-primary-foreground text-center py-1 sm:py-1.5 text-[11px] sm:text-sm font-semibold tracking-wide px-3 leading-tight">
      🔥 Limited-Time Offer — Ends in{" "}
      <span className="inline-flex items-center gap-1 font-bold tabular-nums text-[#f87171]" style={{ WebkitTextStroke: '0px transparent', textShadow: 'none' }}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>{" "}
      — Up to 70% Off
    </div>
  );
};

export default CountdownBar;
