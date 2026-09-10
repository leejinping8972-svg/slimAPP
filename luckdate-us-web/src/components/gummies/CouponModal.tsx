'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Check, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'luckdate_gummies_coupon_seen';

export default function CouponModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const hasSeen = sessionStorage.getItem(STORAGE_KEY);
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem(STORAGE_KEY, 'true');
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch {
      /* ignore */
    }
  }, [mounted]);

  const handleClaim = () => {
    setIsClaimed(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  const handleClose = () => {
    if (!isClaimed) {
      setIsClaimed(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } else {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-br from-soft-pink via-soft-pink to-mint-green/40 p-8 relative overflow-hidden">
          <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
          <div className="absolute bottom-4 right-4 w-20 h-20 bg-deep-rose/20 rounded-full blur-xl" />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300 z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-dark-charcoal" />
          </button>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-soft-lg mb-4 animate-float">
              <Gift className="w-10 h-10 text-deep-rose" />
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-deep-rose" />
              <span className="font-body text-sm font-medium text-dark-charcoal">Special Offer</span>
              <Sparkles className="w-4 h-4 text-deep-rose" />
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {!isClaimed ? (
            <>
              <div className="text-center">
                <h3 className="font-heading text-3xl font-semibold text-dark-charcoal mb-2">
                  Welcome Gift!
                </h3>
                <p className="font-body text-medium-gray">
                  Get{' '}
                  <span className="font-bold text-deep-rose text-lg">$10 OFF</span> your first order
                </p>
              </div>

              <div className="bg-gradient-to-r from-soft-pink/60 to-mint-green/30 rounded-xl p-5 text-center">
                <p className="font-heading text-4xl font-bold text-deep-rose mb-1">$10 OFF</p>
                <p className="font-body text-sm text-medium-gray">
                  Automatically applied at checkout
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {['Free Shipping', 'No Minimum', 'Limited Time'].map((benefit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-mint-green/30 px-3 py-1.5 rounded-full text-xs font-body text-dark-charcoal"
                  >
                    <Check className="w-3 h-3" />
                    {benefit}
                  </span>
                ))}
              </div>

              <button
                onClick={handleClaim}
                className="w-full bg-deep-rose text-white py-4 rounded-full font-body font-medium hover:shadow-soft-xl hover:scale-[1.02] transition-all duration-300 text-lg"
              >
                Claim Your $10 Off
              </button>

              <p className="text-center font-body text-xs text-medium-gray">
                No code needed — discount applied automatically
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-mint-green/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-mint-green" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-dark-charcoal mb-2">
                Discount Saved!
              </h3>
              <p className="font-body text-medium-gray mb-4">
                Your $10 OFF discount will be applied at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
