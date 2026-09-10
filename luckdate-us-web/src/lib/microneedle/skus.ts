import type { GoodsItem } from '@/lib/api/types';

export type Sku = {
  id: string;
  title: string;
  subtitle: string;
  boxes: number;
  price: number;
  original: number;
  perBox: number;
  badge?: string;
  shipping: string;
};

export type MicroneedleSkuOption = Sku & {
  productId?: string;
};

export const SKUS: Sku[] = [
  {
    id: '1box',
    title: 'Starter',
    subtitle: '1 Box · 7 Patches · 1 Week Trial',
    boxes: 1,
    price: 29,
    original: 39,
    perBox: 29,
    shipping: 'Free US Shipping',
  },
  {
    id: '3box',
    title: 'Executive Routine',
    subtitle: '3 Boxes · 21 Patches · 3 Week Program',
    boxes: 3,
    price: 87,
    original: 117,
    perBox: 29,
    badge: 'Most Popular',
    shipping: 'Free Priority Shipping',
  },
  {
    id: '6box',
    title: 'Performance Reserve',
    subtitle: '6 Boxes · 42 Patches · Full Optimization',
    boxes: 6,
    price: 174,
    original: 234,
    perBox: 29,
    badge: 'Best Value',
    shipping: 'Free Priority + Bonus Travel Case',
  },
];

export const SKU_INDEX_MAP: Record<string, number> = {
  '1box': 0,
  '3box': 1,
  '6box': 2,
};

export function getSkuById(id: string): Sku {
  return SKUS.find((sku) => sku.id === id) ?? SKUS[1];
}

export function formatMicroneedlePrice(amount: number): string {
  return amount % 1 === 0 ? String(amount) : amount.toFixed(2);
}

/** SKU 卡片 / Hero 按钮展示的单价（选中且有券时用券后价） */
export function getSkuPerBoxDisplayPrice(
  sku: MicroneedleSkuOption,
  options?: {
    isSelected?: boolean;
    checkoutPrice?: number;
    hasDiscount?: boolean;
  },
): number {
  const isSelected = options?.isSelected ?? false;
  const checkoutPrice = options?.checkoutPrice;
  const hasDiscount = options?.hasDiscount ?? false;

  if (isSelected && hasDiscount && typeof checkoutPrice === 'number' && sku.boxes > 0) {
    return checkoutPrice / sku.boxes;
  }

  return sku.perBox;
}

/** 将接口商品列表与静态 SKU 元数据合并（价格取自接口，单位：美元） */
export function buildMicroneedleSkuOptions(products: GoodsItem[]): MicroneedleSkuOption[] {
  if (products.length === 0) {
    return SKUS.map((meta) => ({ ...meta }));
  }

  return products.reduce<MicroneedleSkuOption[]>((options, product, index) => {
    const meta = SKUS[index];
    if (!meta) {
      return options;
    }
    const price = product.sale_price / 100;
    const original = product.line_price > 0 ? product.line_price / 100 : price;
    const perBox = meta.boxes > 0 ? price / meta.boxes : price;
    options.push({
      ...meta,
      price,
      original,
      perBox,
      productId: product.id,
    });
    return options;
  }, []);
}

export function getCheapestPerBoxPrice(skuOptions: MicroneedleSkuOption[]): number {
  const priced = skuOptions.filter((sku) => sku.productId);
  if (priced.length === 0) {
    return SKUS[0].perBox;
  }
  return Math.min(...priced.map((sku) => sku.perBox));
}
