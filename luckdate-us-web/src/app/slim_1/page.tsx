'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy Slim landing — redirects to catalog PDP (static-export friendly). */
export default function SlimPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/shop/nutrition-28-day');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F5F1] text-sm text-[#666666]">
      Redirecting…
    </div>
  );
}
