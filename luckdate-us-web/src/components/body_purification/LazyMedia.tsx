'use client';

import { useEffect, useState, useRef } from 'react';

let appReady = false;
const readyListeners: Array<() => void> = [];

if (typeof window !== 'undefined') {
  window.addEventListener('app:ready', () => {
    appReady = true;
    readyListeners.forEach((fn) => fn());
    readyListeners.length = 0;
  }, { once: true });
}

export function useAppReady(): boolean {
  const [ready, setReady] = useState(appReady);
  const readyRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (appReady) return;
    const fn = () => setReady(true);
    readyRef.current = fn;
    readyListeners.push(fn);
    return () => {
      const idx = readyListeners.indexOf(readyRef.current);
      if (idx > -1) readyListeners.splice(idx, 1);
    };
  }, []);

  return ready;
}

interface LazyImgProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  placeholderClassName?: string;
}

export function LazyImg({
  src,
  placeholderClassName,
  className,
  style,
  alt,
  ...rest
}: LazyImgProps) {
  const ready = useAppReady();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ready || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  const shouldLoad = ready && inView;

  return (
    <div ref={ref} className={placeholderClassName ?? ''} style={style}>
      {shouldLoad ? (
        <img
          src={src}
          alt={alt}
          className={className}
          loading="lazy"
          decoding="async"
          {...rest}
        />
      ) : (
        <div
          className={`animate-pulse bg-secondary/60 ${className ?? ''}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

interface LazyVideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  src: string;
  placeholderClassName?: string;
}

export function LazyVideo({
  src,
  placeholderClassName,
  className,
  style,
  ...rest
}: LazyVideoProps) {
  const ready = useAppReady();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ready || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  const shouldLoad = ready && inView;

  return (
    <div ref={ref} className={placeholderClassName ?? ''} style={style}>
      {shouldLoad ? (
        <video
          src={src}
          className={className}
          preload="none"
          playsInline
          {...rest}
        />
      ) : (
        <div
          className={`animate-pulse bg-secondary/60 ${className ?? ''}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
