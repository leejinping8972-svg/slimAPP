'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Check, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  CATALOG_PRODUCTS,
  type CatalogProduct,
  getCatalogHref,
} from '@/data/catalogProducts';

function money(n: number) {
  return n.toFixed(2).replace(/\.00$/, '');
}

function TrustStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[2px]" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="inline-flex h-4 w-4 items-center justify-center bg-[#00B67A]">
            <Star className="h-2.5 w-2.5 fill-white text-white" strokeWidth={0} />
          </span>
        ))}
      </div>
      <p className="text-sm text-[#333333]">
        <span className="font-semibold">{rating.toFixed(1)}</span>
        <span className="text-[#666666]"> out of 5</span>
      </p>
    </div>
  );
}

/** Cross-link nutrition size options between 7-day and 28-day PDPs. */
function sizeTargetSlug(product: CatalogProduct, sizeId: string): string | null {
  if (product.category !== 'nutrition') return null;
  if (product.slug === 'nutrition-28-day' && sizeId === '7') return 'nutrition-7-day';
  if (product.slug === 'nutrition-7-day' && sizeId === '28') return 'nutrition-28-day';
  return null;
}

export function ShopProductClient({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [sizeId, setSizeId] = useState(product.sizes[0]?.id ?? '');
  const [qty, setQty] = useState(1);

  const related = useMemo(
    () => CATALOG_PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3),
    [product.slug],
  );

  const handleSize = (nextId: string) => {
    const target = sizeTargetSlug(product, nextId);
    if (target) {
      router.push(getCatalogHref(target));
      return;
    }
    setSizeId(nextId);
  };

  const handleAdd = () => {
    addToCart(
      {
        id: product.cartId,
        name: `${product.name}${sizeId ? ` · ${product.sizes.find((s) => s.id === sizeId)?.label ?? ''}` : ''}`,
        price: product.price,
        image: product.images[0].src,
      },
      qty,
    );
    setIsCartOpen(true);
  };

  return (
    <div className="bg-[#F7F5F1]">
      {/* Purchase hero */}
      <section className="border-b border-[#1E261C]/08 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-14 xl:px-16">
          <div>
            <div className="relative aspect-square overflow-hidden bg-[#F0EDE7]">
              <Image
                src={product.images[imageIndex] ?? product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-6 sm:p-10"
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={`relative h-16 w-16 overflow-hidden bg-[#F0EDE7] ring-1 ${
                      i === imageIndex ? 'ring-[#1E261C]' : 'ring-[#1E261C]/15'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1.5" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7A62]">
              {product.eyebrow}
            </p>
            <h1 className="mt-2 font-['Montserrat'] text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[#111111] sm:text-4xl lg:text-[2.75rem]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <TrustStars rating={product.rating} />
              <span className="text-sm text-[#666666]">
                ({product.reviewCount.toLocaleString()}+ reviews)
              </span>
              {product.badge && (
                <span className="bg-[#1E261C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              {product.perServing && (
                <p className="text-sm font-semibold text-[#1E261C]">{product.perServing}</p>
              )}
              <p className="font-['Montserrat'] text-2xl font-bold text-[#111111]">
                ${money(product.price)}
              </p>
              {product.compareAt && product.compareAt > product.price && (
                <p className="text-base text-[#888888] line-through">${money(product.compareAt)}</p>
              )}
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#333333] sm:text-[15px]">
              {product.description}
            </p>

            <ul className="mt-5 space-y-2">
              {product.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-[#1A1A1A]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7A62]" strokeWidth={2.5} />
                  {b}
                </li>
              ))}
            </ul>

            {product.sizes.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-bold text-[#111111]">Choose your size</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {product.sizes.map((size) => {
                    const active = sizeId === size.id;
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => handleSize(size.id)}
                        className={`border px-4 py-3 text-left transition-colors ${
                          active
                            ? 'border-[#1E261C] bg-[#F7F5F1] ring-1 ring-[#1E261C]'
                            : 'border-[#1E261C]/15 hover:border-[#1E261C]/4'
                        }`}
                      >
                        <span className="block text-sm font-bold text-[#111111]">{size.label}</span>
                        <span className="mt-0.5 block text-xs text-[#666666]">{size.note}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-[#1E261C]/2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 text-[#111111]"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-3 text-[#111111]"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 bg-[#1E261C] py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
              >
                Add to cart — ${money(product.price * qty)}
              </button>
            </div>

            <p className="mt-3 text-xs text-[#666666]">
              Free U.S. shipping over $50 · 30-day money-back
            </p>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="border-b border-[#1E261C]/08 bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-16">
          <h2 className="font-['Montserrat'] text-2xl font-bold text-[#111111] sm:text-3xl">
            How to use
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {product.howToUse.map((step, i) => (
              <div key={step.title} className="border-t border-[#1E261C]/12 pt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7A62]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-['Montserrat'] text-lg font-bold text-[#111111]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#444444]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key features + benefits */}
      <section className="relative overflow-hidden border-b border-[#1E261C]/08 bg-white py-14 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,236,150,0.35)_0%,transparent_45%),radial-gradient(ellipse_at_10%_80%,rgba(210,230,200,0.35)_0%,transparent_45%)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-12 xl:px-16">
          <div>
            <h2 className="font-['Montserrat'] text-2xl font-bold text-[#111111]">Key features</h2>
            <ul className="mt-5 space-y-3">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#1A1A1A]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7A62]" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-['Montserrat'] text-2xl font-bold text-[#111111]">
              Whole-body benefits
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {product.benefits.map((b) => (
                <div key={b.title}>
                  <h3 className="text-sm font-bold text-[#111111]">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#444444]">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients / no list / certs */}
      <section className="border-b border-[#1E261C]/08 bg-[#F7F5F1] py-14 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-12 xl:px-16">
          <div>
            <h2 className="font-['Montserrat'] text-xl font-bold text-[#111111]">Ingredients</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#333333]">{product.ingredients}</p>
          </div>
          <div>
            <h2 className="font-['Montserrat'] text-xl font-bold text-[#111111]">The no list</h2>
            <ul className="mt-3 space-y-2">
              {product.noList.map((n) => (
                <li key={n} className="text-sm text-[#333333]">
                  · {n}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-['Montserrat'] text-xl font-bold text-[#111111]">
              Certifications &amp; testing
            </h2>
            <ul className="mt-3 space-y-2">
              {product.certifications.map((c) => (
                <li key={c} className="text-sm text-[#333333]">
                  · {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-16">
          <h2 className="font-['Montserrat'] text-2xl font-bold text-[#111111]">You may also like</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={getCatalogHref(item.slug)} className="group block">
                <div className="relative aspect-square overflow-hidden bg-[#F0EDE7]">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="33vw"
                  />
                </div>
                <h3 className="mt-3 font-['Montserrat'] text-sm font-bold text-[#111111]">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs text-[#666666]">{item.tagline}</p>
                <p className="mt-2 text-sm font-semibold text-[#111111]">${money(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
