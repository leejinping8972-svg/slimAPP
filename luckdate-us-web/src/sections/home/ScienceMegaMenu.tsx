'use client';

import Image, { type StaticImageData } from 'next/image';
import formulationImg from '@/assets/home/whey-innovation-science.jpg';
import approachImg from '@/assets/home/luckdate-fitoo-light-body-woman.png';
import resultsImg from '@/assets/home/lab-scientist.jpg';

export type ScienceNavItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: StaticImageData;
  imageAlt: string;
};

export const SCIENCE_NAV_ITEMS: ScienceNavItem[] = [
  {
    id: 'formulation',
    title: 'Formulation',
    description:
      'Whey protein and probiotics — clean WPC80 concentrate plus targeted strains that nourish from the foundation up.',
    href: '/science/formulation',
    image: formulationImg,
    imageAlt: 'Concentrated whey protein and nutrition science',
  },
  {
    id: 'approach',
    title: 'The Approach',
    description:
      'Weight management, gut management, and metabolism management — daily rituals built for modern living.',
    href: '/science/approach',
    image: approachImg,
    imageAlt: 'Active lifestyle for weight and metabolism support',
  },
  {
    id: 'results',
    title: 'The Results',
    description:
      'Discover the compelling benefits of luckdate nutrition rituals backed by clinical research.',
    href: '/science/clinical-trials',
    image: resultsImg,
    imageAlt: 'Laboratory research and clinical science',
  },
];

type ScienceMegaMenuProps = {
  open: boolean;
  onNavigate: (href: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

/** ARMRA-style Science mega panel — three editorial columns. */
export function ScienceMegaMenu({
  open,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: ScienceMegaMenuProps) {
  return (
    <div
      data-science-panel
      className={`nav-dropdown-science fixed inset-x-0 z-[105] origin-top transition-[opacity,visibility] duration-150 ${
        open
          ? 'pointer-events-auto visible opacity-100'
          : 'pointer-events-none invisible opacity-0'
      }`}
      style={{ top: 'var(--nav-dropdown-top, 0px)' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-hidden={!open}
    >
      <div className="pointer-events-auto absolute inset-x-0 -top-3 h-3" aria-hidden />

      <div className="border-t border-[#E8E8E8] bg-white shadow-[0_18px_40px_rgba(30,38,28,0.12)]">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:gap-2 lg:px-10 lg:py-10 xl:px-14">
          {SCIENCE_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.href)}
              className="group grid grid-cols-[minmax(7.5rem,38%)_1fr] items-center gap-4 px-2 py-3 text-left transition-colors hover:bg-[#F7F5F1]/80 sm:gap-5 lg:px-3"
            >
              <span className="relative aspect-[3/4] w-full overflow-hidden bg-[#EDE8E0]">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 12vw, 30vw"
                  priority={open}
                />
              </span>
              <span className="min-w-0 pr-1">
                <span className="block font-['Montserrat'] text-base font-bold leading-tight text-[#111111] sm:text-lg">
                  {item.title}
                </span>
                <span className="mt-2 block text-[13px] leading-snug text-[#333333] sm:text-sm">
                  {item.description}
                </span>
                <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-[0.16em] text-[#111111] underline decoration-transparent underline-offset-4 transition-all group-hover:decoration-[#111111]">
                  Learn more
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
