'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';

export default function CancelPage() {
    const router = useRouter();

    useEffect(() => {
        gsap.fromTo(
            '.cancel-content',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.2 }
        );
    }, []);

    return (
        <div className="min-h-screen bg-[#F7F5F1] noise-overlay flex flex-col">
            <Navigation />

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
                <div className="cancel-content text-center max-w-lg mx-auto bg-white p-12 rounded-3xl shadow-sm">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-[#4E554B] mb-4 font-['Montserrat']">
                        Payment Cancelled
                    </h2>

                    <p className="text-[#6C6763]/70 mb-8 text-lg">
                        Your payment was cancelled. No charges were made.
                        You can try again or continue shopping.
                    </p>

                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/products')}
                            className="bg-[#4E554B] text-white px-8 py-6 rounded-full text-lg w-full hover:bg-[#D8CBB8] transition-all"
                        >
                            Return to Shop
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => router.push('/')}
                            className="text-[#6C6763] hover:text-[#4E554B]"
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
            <CartDrawer />
        </div>
    );
}
