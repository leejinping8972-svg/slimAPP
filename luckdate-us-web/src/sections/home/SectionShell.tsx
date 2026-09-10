'use client';

import type { ReactNode } from 'react';

interface SectionShellProps {
  id?: string;
  className?: string;
  children: ReactNode;
  background?: 'ivory' | 'white' | 'olive' | 'gold';
  /** screen = 16:9 viewport slice; compact = tight padding */
  layout?: 'screen' | 'compact' | 'default';
}

const bgMap = {
  ivory: 'bg-[#F7F5F1]',
  white: 'bg-white',
  olive: 'bg-[#4E554B] text-white',
  gold: 'bg-[#FAF6EE]',
};

export function SectionShell({
  id,
  className = '',
  children,
  background = 'ivory',
  layout = 'compact',
}: SectionShellProps) {
  const layoutClass =
    layout === 'screen'
      ? 'home-screen py-4 lg:py-6'
      : layout === 'compact'
        ? 'py-8 lg:py-10'
        : 'py-12 lg:py-14';

  return (
    <section id={id} className={`${layoutClass} ${bgMap[background]} ${className}`}>
      <div className={`w-full px-4 sm:px-6 lg:px-12 xl:px-20 ${layout === 'screen' ? 'home-screen-inner' : ''}`}>
        {children}
      </div>
    </section>
  );
}

export function SectionEyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  if (!children) return null;
  return (
    <p
      className={`text-xs font-medium uppercase tracking-[0.2em] mb-2 ${
        dark ? 'text-white/60' : 'text-[#9A9188]'
      }`}
    >
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  dark,
  className = '',
  compact = true,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
  compact?: boolean;
}) {
  const size = compact
    ? 'text-2xl sm:text-3xl lg:text-4xl'
    : 'text-3xl sm:text-4xl lg:text-5xl';

  return (
    <h2
      className={`${size} font-bold font-['Montserrat'] leading-tight ${
        dark ? 'text-white' : 'text-[#4E554B]'
      } ${className}`}
    >
      {children}
    </h2>
  );
}

const goldPrimary =
  'bg-gradient-to-br from-[#F0E0B8] via-[#D4AF5A] to-[#B8860B] text-[#2C2416] shadow-[0_4px_24px_rgba(184,134,11,0.35)] hover:shadow-[0_6px_32px_rgba(184,134,11,0.45)] hover:from-[#F5E8C8] hover:via-[#E0C06A] hover:to-[#C9A03A] border border-[#E8D5A3]/60';

export function PillButton({
  children,
  variant = 'primary',
  onClick,
  href,
  size = 'default',
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  onClick?: () => void;
  href?: string;
  size?: 'default' | 'large';
}) {
  const base =
    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300';
  const sizes = {
    default: 'px-5 py-3 text-sm',
    large: 'px-8 py-3.5 text-base',
  };
  const variants = {
    primary: goldPrimary,
    gold: goldPrimary,
    secondary: 'bg-[#D8CBB8] text-[#4E554B] hover:bg-[#C4B5A0]',
    outline:
      'border-2 border-[#4E554B] text-[#4E554B] hover:bg-[#4E554B] hover:text-white bg-transparent',
  };

  const cls = `${base} ${sizes[size]} ${variants[variant]}`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
