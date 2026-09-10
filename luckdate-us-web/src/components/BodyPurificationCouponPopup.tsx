'use client';

import { useState } from 'react';
import { X, Ticket, Check, Copy, Gift } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCouponLogic } from '@/hooks/useCouponLogic';
import { BODY_PURIFICATION_COUPON_API } from '@/lib/api/coupon';
import logo from '@/assets/logo.png';

export default function BodyPurificationCouponPopup() {
    const user = useAuth().user;
    const {
        isCouponModalOpen,
        isCouponClaimed,
        claimed,
        email,
        error,
        isLoading,
        couponRuleText,
        showToast,
        toastMsg,
        openModal,
        closeModal,
        setEmail: setEmailHook,
        handleClaim,
    } = useCouponLogic('/body_purification', BODY_PURIFICATION_COUPON_API, { immediate: true });
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText('LUCKY15');
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
        }
    };

    return (
        <>
            {!isCouponModalOpen && !claimed && !isCouponClaimed && (
                <button
                    onClick={openModal}
                    aria-label="Open coupon"
                    className="fixed bottom-[88px] sm:bottom-[96px] left-2 sm:left-3 z-50 group flex items-center bg-gradient-to-br from-primary to-[hsl(168_60%_38%)] text-primary-foreground font-bold w-11 h-11 sm:w-12 sm:h-12 hover:w-[140px] sm:hover:w-[148px] hover:pl-3 hover:pr-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    <span className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/20 text-white shrink-0 mx-auto group-hover:mx-0 transition-[margin] duration-300">
                        <Ticket className="w-4 h-4" />
                        {!claimed && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                            </span>
                        )}
                    </span>
                    <span className="text-xs sm:text-sm whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-[120px] group-hover:ml-2 transition-all duration-300 leading-none self-center">
                        {claimed ? 'Your Coupon' : couponRuleText}
                    </span>
                </button>
            )}

            {isCouponModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
                        onClick={closeModal}
                    />
                    <div className="relative w-full max-w-sm max-h-[92vh] overflow-y-auto bg-card rounded-3xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 px-5 sm:px-7 py-6 sm:py-8">
                        <button
                            onClick={closeModal}
                            aria-label="Close"
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex justify-center mb-5 sm:mb-6">
                            <img src={logo.src} alt="LuckDate" className="h-5 sm:h-6" />
                        </div>

                        <div className="flex justify-center mb-3">
                            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent text-primary">
                                <Gift className="w-8 h-8 sm:w-9 sm:h-9" strokeWidth={2.25} />
                            </div>
                        </div>

                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
                            Special Gift!
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4 sm:mb-5 px-2">
                            You&apos;ve got an exclusive coupon!
                        </p>

                        <div className="rounded-2xl border-2 border-dashed border-primary/50 bg-accent/40 py-5 sm:py-6 px-4 text-center mb-4 sm:mb-5">
                            <p className="font-display text-3xl sm:text-4xl font-extrabold text-primary leading-none tabular-nums lining-nums">
                                {couponRuleText}
                            </p>
                        </div>

                        {!claimed ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleClaim(); }} className="space-y-3 sm:space-y-4">
                                {!user && (
                                    <input
                                        type="email"
                                        required
                                        maxLength={255}
                                        value={email}
                                        onChange={(e) => setEmailHook(e.target.value)}
                                        placeholder="Enter your email"
                                        className={`w-full h-11 sm:h-12 px-4 rounded-xl border ${error ? 'border-red-500' : 'border-border'} bg-background text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors`}
                                    />
                                )}
                                {error && (
                                    <p className="text-red-500 text-sm font-medium">{error}</p>
                                )}
                                {user && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        Click to claim your exclusive discount!
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading || (!user && !email)}
                                    className="w-full h-11 sm:h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : user ? 'Claim Now' : 'Claim Your Coupon'}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                                    <Check className="w-5 h-5" /> Coupon claimed
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="w-full h-11 sm:h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Code</>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(showToast || toastMsg) && !isCouponModalOpen && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#4E554B] text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-2">
                    {toastMsg ? (
                        <span className="font-medium text-sm">{toastMsg}</span>
                    ) : (
                        <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="font-medium text-sm">Coupon Claimed Successfully!</span>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
