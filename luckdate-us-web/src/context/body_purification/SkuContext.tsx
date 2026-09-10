'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { StaticImageData } from "next/image";
import type { GoodsItem } from "@/lib/api/types";
import sku1 from "@/assets/body_purification/sku-1-bottle.jpg";
import sku3 from "@/assets/body_purification/sku-3-bottles.jpg";
import sku5 from "@/assets/body_purification/sku-5-bottles.jpg";

const skuImages = [sku1, sku3, sku5];

export type SkuOption = {
  id: string;
  label: string;
  subtitle: string;
  price: string;
  perUnit: string;
  originalPrice: string;
  badge: string | null;
  image: StaticImageData | string;
};

const SKU_LABELS = [
  { name: 'One Bottle', serving: '$15.90/bottle', badge: '' },
  { name: 'Buy 2 Get 1 Free', serving: '$13.30/bottle', badge: 'Most Popular' },
  { name: 'Buy 3 Get 2 Free', serving: '$11.98/bottle', badge: 'Best Value' },
];

function mapGoodsToSkuOptions(products: GoodsItem[]): SkuOption[] {
  return products.map((p, i) => {
    const label = SKU_LABELS[i] ?? { name: p.name, serving: '', badge: '' };
    const price = p.sale_price / 100;
    const original = p.line_price / 100;
    return {
      id: String(p.id),
      label: label.name,
      subtitle: label.serving || `${Math.round(price * 30)}-day supply`,
      price: `$${price.toFixed(2)}`,
      perUnit: `$${(price / (i + 1)).toFixed(2)}/bottle`,
      originalPrice: `$${original.toFixed(2)}`,
      badge: label.badge || null,
      image: skuImages[i] ?? sku1,
    };
  });
}

type SkuContextValue = {
  selectedSku: string;
  setSelectedSku: (id: string) => void;
  skuOptions: SkuOption[];
  current: SkuOption;
  products: GoodsItem[];
  priceNum: number;
  originalNum: number;
  saveAmount: number;
  savePct: number;
  loading: boolean;
};

const SkuContext = createContext<SkuContextValue | null>(null);

export const SkuProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<GoodsItem[]>([]);
  const [selectedSku, setSelectedSku] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    import('@/lib/api/goods').then(({ getGoodsListBodyPurification }) => {
      getGoodsListBodyPurification()
        .then((res) => {
          if (!mounted) return;
          const list = res.data?.list?.data ?? [];
          setProducts(list);
          if (list.length > 0 && !selectedSku) {
            setSelectedSku(String(list[1]?.id ?? list[0].id));
          }
        })
        .catch(() => {})
        .finally(() => { if (mounted) setLoading(false); });
    });
    return () => { mounted = false; };
  }, []);

  const skuOptions = mapGoodsToSkuOptions(products);
  const current = skuOptions.find((s) => s.id === selectedSku) ?? skuOptions[0];
  const priceNum = current ? parseFloat(current.price.replace("$", "")) : 0;
  const originalNum = current ? parseFloat(current.originalPrice.replace("$", "")) : 0;
  const saveAmount = +(originalNum - priceNum).toFixed(2);
  const savePct = originalNum > 0 ? Math.round((1 - priceNum / originalNum) * 100) : 0;

  return (
    <SkuContext.Provider
      value={{ selectedSku, setSelectedSku, skuOptions, current, products, priceNum, originalNum, saveAmount, savePct, loading }}
    >
      {children}
    </SkuContext.Provider>
  );
};

export const useSku = () => {
  const ctx = useContext(SkuContext);
  if (!ctx) throw new Error("useSku must be used within SkuProvider");
  return ctx;
};
