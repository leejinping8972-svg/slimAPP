import type { StaticImageData } from 'next/image';
import nutrition28 from '@/assets/home/products/slim-28day-open-kit.png';
import nutrition28Pack from '@/assets/home/products/slim-28day-hero-pack.png';
import nutrition7 from '@/assets/home/products/slim-7day-open-kit.png';
import nutrition7Drink from '@/assets/home/products/slim-7day-hero-drink.png';
import fruitVeg from '@/assets/home/products/gut-fruit-veg-flavors.jpg';
import fruitKit from '@/assets/home/products/gut-14day-fiber-kit.jpg';
import probiotics from '@/assets/home/products/gut-balance-probiotic-box.jpg';
import probioticsKit from '@/assets/home/products/gut-balance-probiotic-kit.jpg';
import shakerCup from '@/assets/home/products/luckdate-shaker-cup.png';
import shakerCupAlt from '@/assets/home/products/luckdate-shaker-cup-alt.png';

export type CatalogProduct = {
  slug: string;
  cartId: number;
  category: 'nutrition' | 'gut' | 'merch';
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  price: number;
  compareAt?: number;
  perServing?: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  images: StaticImageData[];
  bullets: string[];
  sizes: { id: string; label: string; note: string; imageIndex?: number }[];
  howToUse: { title: string; body: string }[];
  features: string[];
  benefits: { title: string; body: string }[];
  ingredients: string;
  noList: string[];
  certifications: string[];
};

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    slug: 'nutrition-28-day',
    cartId: 90028,
    category: 'nutrition',
    name: '28-Day Nutrition Supplement',
    eyebrow: 'Nutrition · Chocolate',
    tagline: 'Your full-month vitality ritual.',
    description:
      'Slim Vitality Nutrition Drink Mix in a complete 28-Day ritual. 16g protein and essential nutrients in a chocolate pour you can keep every day — with sachets ready for a one-minute shake.',
    price: 69.9,
    compareAt: 99.9,
    perServing: 'As low as $2.50 / serving',
    badge: 'Best seller',
    rating: 4.9,
    reviewCount: 10000,
    images: [nutrition28, nutrition28Pack],
    bullets: [
      '16g protein · 6 vitamins & minerals per serving',
      '28 sachets for a full month of daily pours',
      'Chocolate flavor — easy to keep as a ritual',
      'Built on concentrated whey protein WPC80',
    ],
    sizes: [
      { id: '28', label: '28-Day Ritual', note: '28 sachets · best value' },
      { id: '7', label: '7-Day Travel', note: 'Starter / travel size' },
    ],
    howToUse: [
      {
        title: 'Pour',
        body: 'Empty one sachet into your luckdate shaker or a glass of cool liquid.',
      },
      {
        title: 'Shake',
        body: 'Add water or milk, shake for a few seconds until smooth.',
      },
      {
        title: 'Enjoy',
        body: 'Drink as your morning or post-workout ritual. Avoid very hot liquids.',
      },
    ],
    features: [
      '16g protein per serving',
      'Chocolate flavor nutrition drink mix',
      'Complete 28-Day Vitality Ritual',
      'WPC80 whey protein foundation',
      'Travel-friendly individual sachets',
      'Pairs with the luckdate app ritual',
    ],
    benefits: [
      {
        title: 'Better body',
        body: 'Daily complete protein to support a leaner routine you can keep.',
      },
      {
        title: 'Better workouts',
        body: 'Protein for training days and recovery without a chalky tub.',
      },
      {
        title: 'Better sleep',
        body: 'A simple evening pour instead of late-night snack stacks.',
      },
      {
        title: 'Stronger gut rhythm',
        body: 'A clean protein ritual that sits easier than heavy shakes.',
      },
    ],
    ingredients:
      'Whey Protein Concentrate (WPC80), cocoa, natural flavors, vitamins and minerals blend. Contains: Milk.',
    noList: [
      'No artificial colors',
      'No unnecessary fillers',
      'No lecithin added to WPC80 base',
      'No complicated multi-bottle stack',
    ],
    certifications: ['USDA / FDA food specs aligned', 'GMP', 'Halal', 'Kosher', 'Non-GMO aligned'],
  },
  {
    slug: 'nutrition-7-day',
    cartId: 90007,
    category: 'nutrition',
    name: '7-Day Nutrition Supplement',
    eyebrow: 'Nutrition · Travel',
    tagline: 'Start the chocolate ritual — travel size.',
    description:
      'A 7-Day starter pack of Slim Vitality Nutrition Drink Mix. Same chocolate pour and 16g protein — sized for travel, first weeks, or testing the ritual before the full month.',
    price: 19.9,
    compareAt: 29.9,
    perServing: 'As low as $2.84 / serving',
    badge: 'Travel',
    rating: 4.8,
    reviewCount: 4200,
    images: [nutrition7, nutrition7Drink],
    bullets: [
      '7 sachets · travel-ready',
      '16g protein per chocolate pour',
      'Ideal starter before the 28-Day ritual',
      'Same WPC80 foundation as the full kit',
    ],
    sizes: [
      { id: '7', label: '7-Day Travel', note: '7 sachets · starter' },
      { id: '28', label: '28-Day Ritual', note: 'Upgrade for best value' },
    ],
    howToUse: [
      {
        title: 'Pour',
        body: 'Empty one travel sachet into your shaker.',
      },
      {
        title: 'Shake',
        body: 'Add cool water, shake, and go.',
      },
      {
        title: 'Enjoy',
        body: 'Use for 7 days — then move to the 28-Day ritual if it sticks.',
      },
    ],
    features: [
      'Travel-size 7-Day kit',
      '16g protein chocolate pour',
      'Individual sachets',
      'Same formula family as 28-Day',
      'Easy on-the-go ritual',
    ],
    benefits: [
      {
        title: 'Easy start',
        body: 'Try the ritual for a week without committing to a full month.',
      },
      {
        title: 'Travel ready',
        body: 'Sachets pack flat — no tubs, scoops, or airport hassle.',
      },
      {
        title: 'Same daily pour',
        body: 'Identical chocolate ritual experience as the 28-Day kit.',
      },
      {
        title: 'Upgrade path',
        body: 'When the habit sticks, move to the full 28-Day ritual.',
      },
    ],
    ingredients:
      'Whey Protein Concentrate (WPC80), cocoa, natural flavors, vitamins and minerals blend. Contains: Milk.',
    noList: ['No bulky tub', 'No scoop required', 'No artificial colors', 'No complex prep'],
    certifications: ['USDA / FDA food specs aligned', 'GMP', 'Halal', 'Kosher', 'Non-GMO aligned'],
  },
  {
    slug: 'fruit-vegetable-powder',
    cartId: 90041,
    category: 'gut',
    name: 'Fruit & Vegetable Powder',
    eyebrow: 'Gut Management · Fiber',
    tagline: 'Daily fiber + plant blend ritual.',
    description:
      'Slim Vitality daily fiber and vegetable mix in Pink Guava and Oats & Grains. A gentle gut-management pour with plant fiber — pour, shake, enjoy.',
    price: 49.9,
    compareAt: 69.9,
    perServing: 'About $1.66 / serving',
    rating: 4.8,
    reviewCount: 3100,
    images: [fruitVeg, fruitKit],
    bullets: [
      'Daily fiber + vegetable blend',
      'Pink Guava and Oats & Grains flavors',
      'Built for gut rhythm and consistency',
      'Sachets for a simple daily pour',
    ],
    sizes: [
      { id: '30', label: '30-Day Dual Flavor', note: 'Guava + Oats & Grains', imageIndex: 0 },
      { id: '14', label: '14-Day Starter Kit', note: 'Includes shaker option', imageIndex: 0 },
      { id: 'gift', label: 'Gift Set', note: 'Open gift box · shaker + sachets', imageIndex: 1 },
    ],
    howToUse: [
      {
        title: 'Pour',
        body: 'Empty one fruit & vegetable sachet into your shaker.',
      },
      {
        title: 'Shake',
        body: 'Add cool water, shake until smooth.',
      },
      {
        title: 'Enjoy',
        body: 'Take daily as part of your gut management ritual.',
      },
    ],
    features: [
      '8g fiber per sachet*',
      'Plant-forward fruit & grain flavors',
      'Daily gut management support',
      'Easy pour-shake-enjoy format',
    ],
    benefits: [
      {
        title: 'Gut rhythm',
        body: 'Fiber-forward pours to support everyday digestive comfort.',
      },
      {
        title: 'Plant variety',
        body: 'Rotate Pink Guava and Oats & Grains to keep the ritual enjoyable.',
      },
      {
        title: 'Simple habit',
        body: 'One sachet replaces complicated fiber stacks.',
      },
      {
        title: 'Pairs with probiotics',
        body: 'Combine with Gut Balance for a fuller inner-reset routine.',
      },
    ],
    ingredients:
      'Plant fiber blend, fruit and vegetable powders, natural flavors. See label for full ingredient list.',
    noList: ['No artificial colors', 'No complicated prep', 'No daily pill organizer'],
    certifications: ['GMP Quality', 'Non-GMO aligned', 'Third-party tested ingredients'],
  },
  {
    slug: 'gift-box',
    cartId: 90043,
    category: 'gut',
    name: 'Gift Set',
    eyebrow: 'Gut Management · Gift Set',
    tagline: '14-Day fiber ritual in an open gift box.',
    description:
      'A gift-ready 14-Day Daily Fiber Ritual: open box with the luckdate shaker and Pink Guava plus Oats & Grains sachets. The same pour, packed to give.',
    price: 59.9,
    compareAt: 79.9,
    perServing: 'Gift set · shaker included',
    badge: 'Gift',
    rating: 4.8,
    reviewCount: 3100,
    images: [fruitKit, fruitVeg],
    bullets: [
      'Open gift box with shaker',
      'Pink Guava and Oats & Grains sachets',
      '14-Day Daily Fiber Ritual',
      'Ready to give or start at home',
    ],
    sizes: [{ id: 'gift', label: 'Gift Set', note: 'Shaker + sachets' }],
    howToUse: [
      {
        title: 'Open',
        body: 'Lift the gift box and take one sachet plus the shaker.',
      },
      {
        title: 'Shake',
        body: 'Empty the sachet into the shaker with cool water.',
      },
      {
        title: 'Enjoy',
        body: 'Drink as a daily fiber ritual for 14 days.',
      },
    ],
    features: [
      'Gift box presentation',
      'Shaker included',
      'Dual flavor sachets',
      '14-Day fiber ritual',
    ],
    benefits: [
      {
        title: 'Ready to gift',
        body: 'The open-box set is packed as a ritual, not a loose pouch.',
      },
      {
        title: 'Same daily pour',
        body: 'Pink Guava and Oats & Grains — the fruit & vegetable ritual.',
      },
      {
        title: 'Shaker included',
        body: 'No extra cup to buy before the first pour.',
      },
      {
        title: 'Easy start',
        body: 'Fourteen days is enough to see if the habit sticks.',
      },
    ],
    ingredients:
      'Plant fiber blend, fruit and vegetable powders, natural flavors. See label for full ingredient list.',
    noList: ['No artificial colors', 'No complicated prep', 'No extra shaker to buy'],
    certifications: ['GMP Quality', 'Non-GMO aligned', 'Third-party tested ingredients'],
  },
  {
    slug: 'gut-balance-probiotics',
    cartId: 90042,
    category: 'gut',
    name: 'Gut Balance Probiotics',
    eyebrow: 'Gut Management · Probiotic',
    tagline: '30-Day inner reset · 30 Billion CFU.',
    description:
      'Gut Balance is a probiotic + prebiotic formula designed as a 30-Day inner-reset ritual. 30 Billion CFU with prebiotic fiber for daily microbiome support.',
    price: 59.9,
    compareAt: 79.9,
    perServing: 'About $2.00 / serving',
    badge: 'New',
    rating: 4.9,
    reviewCount: 2800,
    images: [probiotics, probioticsKit],
    bullets: [
      '30 Billion CFU per serving',
      'Probiotic + prebiotic formula',
      '30 sachets · daily balance ritual',
      'Designed for digestive comfort',
    ],
    sizes: [{ id: '30', label: '30-Day Ritual', note: '30 sachets · 2g each' }],
    howToUse: [
      {
        title: 'Pour',
        body: 'Empty one Gut Balance sachet into cool water.',
      },
      {
        title: 'Mix',
        body: 'Stir or shake gently until dissolved.',
      },
      {
        title: 'Daily ritual',
        body: 'Take once daily — morning or evening — for 30 days.',
      },
    ],
    features: [
      '30 Billion CFU',
      'Prebiotic fiber support',
      '30-Day Inner Reset Ritual',
      'Gluten free · Non-GMO · No artificial flavors',
    ],
    benefits: [
      {
        title: 'Digestive comfort',
        body: 'Daily probiotic support for a more settled gut feel.',
      },
      {
        title: 'Microbiome support',
        body: 'Probiotic + prebiotic formula for everyday balance.',
      },
      {
        title: 'Simple format',
        body: 'Individual sachets — no fridge bottles or scoops.',
      },
      {
        title: 'Pairs with fiber',
        body: 'Use alongside Fruit & Vegetable Powder for a fuller gut ritual.',
      },
    ],
    ingredients:
      'Probiotic blend (30 Billion CFU), prebiotic fiber, natural flavors. See Supplement Facts on pack.',
    noList: ['No artificial flavors', 'No gluten', 'No GMO ingredients', 'No bulky bottles'],
    certifications: ['GMP Quality', 'Non-GMO', 'Gluten Free'],
  },
  {
    slug: 'shaker-cup',
    cartId: 90080,
    category: 'merch',
    name: 'luckdate Shaker Cup',
    eyebrow: 'Merch · Ritual Gear',
    tagline: 'Your daily pour, ready to shake.',
    description:
      'The official luckdate ritual shaker — clear bottle with mint lid, peach flip-cap, and matching scoop + star mixer inside. Built for Slim Vitality sachets and everyday chocolate pours.',
    price: 19.9,
    compareAt: 29.9,
    badge: 'New',
    rating: 4.9,
    reviewCount: 860,
    images: [shakerCup, shakerCupAlt],
    bullets: [
      'Clear bottle with mint lid + peach flip-cap',
      'Includes scoop and star mixing agitator',
      'Sized for Slim Vitality sachets',
      'Easy clean · travel-ready ritual gear',
    ],
    sizes: [{ id: 'standard', label: 'Standard', note: 'Cup + scoop + mixer' }],
    howToUse: [
      {
        title: 'Add',
        body: 'Drop in one Slim Vitality sachet (or your daily pour).',
      },
      {
        title: 'Shake',
        body: 'Add cool water or milk, close the lid, and shake with the mixer.',
      },
      {
        title: 'Sip',
        body: 'Open the flip-cap and enjoy. Rinse after each ritual.',
      },
    ],
    features: [
      'Official luckdate branding',
      'Mint + peach colorway',
      'Scoop + star mixer included',
      'Pairs with every nutrition ritual',
    ],
    benefits: [
      {
        title: 'Ritual-ready',
        body: 'One cup designed for the same daily pour you keep on the site.',
      },
      {
        title: 'No leftover tub mess',
        body: 'Sachet in, shake, sip — cleaner than scooping from a tub.',
      },
      {
        title: 'On-brand gear',
        body: 'Carry the luckdate wordmark and sunflower mark with you.',
      },
      {
        title: 'Travel friendly',
        body: 'Lid locks down for bags, gym, and desk rituals.',
      },
    ],
    ingredients: 'BPA-free plastic bottle and mixer components. Hand wash recommended.',
    noList: ['No batteries', 'No filters to replace', 'No complicated parts'],
    certifications: ['Food-contact materials', 'Everyday dishwasher top-rack friendly*'],
  },
];

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug);
}

export function getCatalogHref(slug: string) {
  return `/shop/${slug}`;
}
