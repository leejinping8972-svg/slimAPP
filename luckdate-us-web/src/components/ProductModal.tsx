'use client';

import { X, Star, Check, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  benefits: string[];
  ingredients: string[];
  dosage: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }, quantity);
    onClose();
    setQuantity(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative bg-gradient-to-b from-[#F7F5F1] to-white p-8 flex items-center justify-center min-h-[300px] md:min-h-full">
            {product.badge && (
              <div className="absolute top-4 left-4 bg-[#D8CBB8] text-white text-xs font-medium px-3 py-1 rounded-full">
                {product.badge}
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-[350px] object-contain"
            />
          </div>

          <div className="p-6 lg:p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-[#F7F5F1] rounded-full flex items-center justify-center hover:bg-[#4E554B] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#D8CBB8] text-[#D8CBB8]'
                        : 'text-[#6C6763]/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#6C6763]/60">
                {product.rating} ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-[#4E554B] mb-3 font-['Montserrat']">
              {product.name}
            </h2>

            <p className="text-[#6C6763]/70 mb-6">{product.fullDescription}</p>

            <div className="mb-6">
              <h3 className="font-semibold text-[#4E554B] mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-[#D8CBB8]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#D8CBB8]" />
                    </div>
                    <span className="text-sm text-[#6C6763]/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-[#4E554B] mb-3">Key Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="text-xs bg-[#F7F5F1] text-[#6C6763] px-3 py-1 rounded-full"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6 p-4 bg-[#F7F5F1] rounded-xl">
              <h3 className="font-semibold text-[#4E554B] mb-1">Suggested Use</h3>
              <p className="text-sm text-[#6C6763]/70">{product.dosage}</p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#4E554B]/10">
              <div className="text-3xl font-bold text-[#4E554B] font-['Montserrat']">
                ${product.price}
              </div>

              <div className="flex items-center gap-3 bg-[#F7F5F1] rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-[#D8CBB8] hover:text-white transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-medium w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-[#D8CBB8] hover:text-white transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white py-6 rounded-full font-medium"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
