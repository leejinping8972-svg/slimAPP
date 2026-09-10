'use client';

import { useState, useEffect } from 'react';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const SocialProof = () => {
  const [viewers, setViewers] = useState(() => rand(18, 47));
  const [buyers, setBuyers] = useState(() => {
    const v = rand(18, 47);
    return rand(1, Math.floor(v * 0.35));
  });

  useEffect(() => {
    const id = setInterval(() => {
      const v = rand(18, 47);
      setViewers(v);
      setBuyers(rand(1, Math.max(1, Math.floor(v * 0.35))));
    }, 5000 + rand(0, 3000));
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500" />
        </span>
        <span className="font-body text-[11px] sm:text-sm text-foreground/70">
          <strong className="text-foreground">{viewers}</strong> people are viewing this right now
        </span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-500" />
        </span>
        <span className="font-body text-[11px] sm:text-sm text-foreground/70">
          <strong className="text-foreground">{buyers}</strong> people purchased recently
        </span>
      </div>
    </div>
  );
};

export default SocialProof;
