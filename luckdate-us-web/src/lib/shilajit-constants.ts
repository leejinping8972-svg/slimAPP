// Product images for different SKU options
import product1Bottle from '@/assets/shilajit/product-1bottle.png';
import product3Bottles from '@/assets/shilajit/product-3bottles.png';
import product5Bottles from '@/assets/shilajit/product-5bottles.png';

/** Shared product SKU options used across ProductHero and BottomCTA */
export interface SkuOption {
  id: string;
  name: string;
  serving: string;
  price: number;
  original: number;
  save: string;
  badge: string;
  image: string;
}

export const SKU_OPTIONS: SkuOption[] = [
  { id: '1bottle', name: 'One Bottle', serving: '$1 per serving', price: 36.9, original: 99.0, save: '63%', badge: '', image: product1Bottle.src },
  { id: '2get1', name: 'Buy 2 Get 1 Free', serving: '$0.67 per serving', price: 69.9, original: 297.0, save: '76%', badge: 'MOST POPULAR', image: product3Bottles.src },
  { id: '3get2', name: 'Buy 3 Get 2 Free', serving: '$0.6 per serving', price: 99.9, original: 495.0, save: '80%', badge: 'BEST VALUE', image: product5Bottles.src },
];

export const DEFAULT_SKU_ID = '2get1';

/** Shared benefit list for the product hero */
export const PRODUCT_BENEFITS = [
  "Stronger, fuller erections & blood flow",
  "Higher daily energy & stamina",
  "Testosterone signaling & male vitality",
  "Confidence, control, and endurance",
];

/** Smooth-scroll to the product hero section */
export const scrollToProduct = () => {
  document.getElementById('product-hero')?.scrollIntoView({ behavior: 'smooth' });
};

/** Auto-play interval durations (ms) */
export const CAROUSEL_AUTOPLAY_MS = 8_000;
export const HERO_AUTOPLAY_MS = 8_000;
