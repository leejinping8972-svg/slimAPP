'use client';

import { useEffect } from 'react';
import { getInit } from '@/lib/api/token';

const TOKEN_KEY = 'token';

export function TokenInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existing = localStorage.getItem(TOKEN_KEY);
    if (existing) return;

    getInit()
      .then((res) => {
        const token = res.data?.token;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
        }
      })
      .catch(() => {
        // 静默失败，不影响页面
      });
  }, []);

  return null;
}
