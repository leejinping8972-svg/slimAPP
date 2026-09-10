'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SkuPicker from '@/components/microneedle/SkuPicker';
import type { MicroneedleSkuOption } from '@/lib/microneedle/skus';
import type { ReactNode } from 'react';

type SkuPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skuOptions: MicroneedleSkuOption[];
  selected: string;
  onSelect: (id: string) => void;
  onCheckout: () => void;
  isSubmitting?: boolean;
  checkoutDisabled?: boolean;
  checkoutPrice: number;
  originalCheckoutPrice?: number;
  hasDiscount?: boolean;
  couponPicker?: ReactNode;
};

export default function SkuPickerDialog({
  open,
  onOpenChange,
  skuOptions,
  selected,
  onSelect,
  onCheckout,
  isSubmitting = false,
  checkoutDisabled = false,
  checkoutPrice,
  originalCheckoutPrice,
  hasDiscount = false,
  couponPicker,
}: SkuPickerDialogProps) {
  // modal={false} 便于与未支付叠层共存；forceBackdrop 补 Radix 不渲染的蒙层
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        forceBackdrop
        overlayOpen={open}
        onBackdropClick={() => onOpenChange(false)}
        className="microneedle-theme max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto modal-scrollbar border-border bg-background text-foreground"
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Choose Your Program</DialogTitle>
          <DialogDescription>
            Real results show in 21 days. Select a package and proceed to secure checkout.
          </DialogDescription>
        </DialogHeader>
        <SkuPicker
          skuOptions={skuOptions}
          selected={selected}
          onSelect={onSelect}
          compact
          onCheckout={onCheckout}
          isSubmitting={isSubmitting}
          checkoutDisabled={checkoutDisabled}
          checkoutPrice={checkoutPrice}
          originalCheckoutPrice={originalCheckoutPrice}
          hasDiscount={hasDiscount}
          couponPicker={couponPicker}
        />
      </DialogContent>
    </Dialog>
  );
}
