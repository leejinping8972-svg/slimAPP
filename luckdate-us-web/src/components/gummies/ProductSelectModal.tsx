'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Check, Flame, Star, ShoppingCart } from 'lucide-react';
import a1Img from '@/assets/gummies/probiotic-gummies-hero.jpg';
import type { GoodsItem } from '@/lib/api/types';

function formatPrice(cents: number) {
  return (cents / 100).toFixed(1).replace(/\.0$/, '');
}

const LABELS = [
  { title: 'Buy 2 Get 1 FREE', desc: '3 Bottles · 180 Gummies' },
  { title: 'One Bottle', desc: '60 Gummies' },
];

interface ProductSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: GoodsItem[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onSubmitOrder: () => void | Promise<boolean>;
}

export default function ProductSelectModal({
  isOpen,
  onClose,
  products,
  selectedProductId,
  onSelectProduct,
  onSubmitOrder,
}: ProductSelectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const productButtons = products.slice(0, 2);
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const displayPrice = selectedProduct ? formatPrice(selectedProduct.sale_price) : '';

  const handleSubmitOrder = async () => {
    if (!selectedProductId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const success = await onSubmitOrder();
      if (success) {
        setIsOrderPlaced(true);
        setTimeout(() => {
          setIsOrderPlaced(false);
          onClose();
        }, 2000);
      } else {
        setIsSubmitting(false);
      }
    } finally {
      if (!isOrderPlaced) {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Content — bottom sheet on mobile */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up border border-dark-charcoal/5">
        {/* Close button */}
        <button
          onClick={() => !isSubmitting && onClose()}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-soft-pink transition-colors duration-300 z-20 shadow-soft"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-dark-charcoal" />
        </button>

        {/* Product Header */}
        <div className="bg-light-gray p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-soft-pink/20 to-transparent" />
          <div className="relative z-10 flex items-center gap-4">
            <Image
              src={a1Img}
              alt="Aura Probiotic Gummies"
              className="w-24 h-24 object-cover rounded-2xl shadow-soft bg-white"
              width={96}
              height={96}
            />
            <div>
              <h3 className="font-heading text-xl font-semibold text-dark-charcoal mb-1">
                Aura Probiotic Gummies
              </h3>
              <p className="font-body text-sm text-medium-gray">
                Slippery Elm + Ginkgo + Probiotics
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-[#FFA41C] text-[#FFA41C]" />
                ))}
                <span className="font-body text-xs text-medium-gray ml-1">
                  4.9 (2,847 reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SKU Selection */}
        <div className="p-6 space-y-4">
          <p className="font-body text-sm font-bold text-dark-charcoal uppercase tracking-wider">
            Choose Your Package
          </p>

          {productButtons.map((product, index) => {
            const salePrice = formatPrice(product.sale_price);
            const linePrice = formatPrice(product.line_price);
            const saveAmount = (product.line_price - product.sale_price) / 100;
            const isSelected = selectedProductId === product.id;
            const showBestValue = index === 0 && productButtons.length >= 2;
            const label = LABELS[index] ?? { title: product.name, desc: product.description ?? '' };

            return (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                disabled={isSubmitting}
                className={`w-full text-left rounded-2xl p-4 border-2 transition-all duration-300 relative overflow-hidden disabled:opacity-70 ${
                  isSelected
                    ? 'border-deep-rose bg-soft-pink/30 shadow-soft'
                    : 'border-dark-charcoal/10 bg-white hover:border-deep-rose/40'
                }`}
              >
                {showBestValue && (
                  <div className="absolute top-0 right-0 bg-deep-rose text-white text-[10px] font-body font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Flame className="w-3 h-3" /> BEST VALUE
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm font-bold text-dark-charcoal">{label.title}</p>
                    <p className="font-body text-xs text-medium-gray mt-0.5">{label.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-xl font-bold text-deep-rose">${salePrice}</p>
                    <p className="font-body text-xs text-medium-gray line-through">${linePrice}</p>
                    {saveAmount > 0 && (
                      <p className="font-body text-[10px] font-bold text-green-600">
                        Save ${saveAmount.toFixed(1).replace(/\.0$/, '')}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Benefits */}
          <div className="flex flex-wrap gap-2">
            {['Free Shipping', '30-Day Guarantee', 'Natural Ingredients'].map((benefit, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-soft-pink/50 px-3 py-1.5 rounded-full text-xs font-body text-dark-charcoal"
              >
                <Check className="w-3 h-3 text-mint-green" />
                {benefit}
              </span>
            ))}
          </div>

          {/* Buy Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={!selectedProductId || isSubmitting}
            className={`w-full py-4 rounded-full font-body font-medium transition-all duration-500 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed ${
              isOrderPlaced
                ? 'bg-mint-green text-dark-charcoal shadow-soft'
                : 'bg-deep-rose text-white hover:shadow-soft-xl hover:-translate-y-1'
            }`}
          >
            {!isOrderPlaced && (
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-full" />
            )}
            <span className="relative z-10 flex items-center gap-2 text-lg">
              {isOrderPlaced ? (
                <>
                  <Check className="w-5 h-5" />
                  Order Placed!
                </>
              ) : isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now — $ {displayPrice}
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
