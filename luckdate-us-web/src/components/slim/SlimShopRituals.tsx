'use client';

import Image from 'next/image';
import type { GoodsItem } from '@/lib/api/types';
import SlimReveal from './SlimReveal';
import productImg from '@/assets/slim/slim-product-hero.png';
import shakerImg from '@/assets/slim/slim-shaker-bg.png';

const RITUALS = [
  {
    key: 'trial',
    name: 'Slim Vitality™ 7-Day Trial',
    desc: 'Try the ritual with 7 daily sachets.',
    image: productImg,
  },
  {
    key: 'journey',
    name: 'Slim Vitality™ 28-Day Journey',
    desc: 'The full 28-day ritual cycle with Sunny.',
    image: productImg,
  },
  {
    key: 'shaker',
    name: 'Luckdate Shaker Cup',
    desc: 'Branded shaker for your daily ritual.',
    image: shakerImg,
  },
] as const;

interface SlimShopRitualsProps {
  products: GoodsItem[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onShopNow: () => void;
}

export default function SlimShopRituals({
  products,
  onSelectProduct,
  onShopNow,
}: SlimShopRitualsProps) {
  const handleShop = (index: number) => {
    const product = products[index];
    if (product) onSelectProduct(product.id);
    else if (products[0]) onSelectProduct(products[0].id);
    onShopNow();
  };

  return (
    <section id="shop" className="py-12 lg:py-16 bg-[#FCFBF7]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <SlimReveal className="text-center mb-8 lg:mb-10">
          <h2
            className="text-2xl sm:text-3xl lg:text-[2.35rem] font-medium text-[#3D4038]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Shop Daily Rituals
          </h2>
        </SlimReveal>

        <div className="grid md:grid-cols-3 gap-5">
          {RITUALS.map((item, index) => (
            <SlimReveal key={item.key} delay={index * 70}>
              <div className="bg-white rounded-2xl border border-[#737A65]/10 overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[5/4] bg-[#F3F0EA]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-[#3D4038] mb-1">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-[#6C6763] mb-4 flex-1">{item.desc}</p>
                  <button
                    onClick={() => handleShop(index)}
                    className="text-sm font-semibold text-[#737A65] hover:text-[#5F6558] transition-colors text-left"
                  >
                    Shop Now →
                  </button>
                </div>
              </div>
            </SlimReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
