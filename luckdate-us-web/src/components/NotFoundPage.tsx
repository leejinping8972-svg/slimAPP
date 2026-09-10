'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/sections/Navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
    type?: 'product' | 'article' | 'general';
}

export default function NotFoundPage({ type = 'general' }: NotFoundPageProps) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(3);

    const getContent = () => {
        switch (type) {
            case 'product':
                return {
                    title: 'Product Not Found',
                    message: 'The product you are looking for does not exist or has been removed.',
                    ctaText: 'Browse All Products',
                    ctaHref: '/products',
                };
            case 'article':
                return {
                    title: 'Article Not Found',
                    message: 'The article you are looking for does not exist or has been removed.',
                    ctaText: 'Back to Journal',
                    ctaHref: '/blog',
                };
            default:
                return {
                    title: 'Page Not Found',
                    message: "The page you are looking for doesn't exist or has been moved.",
                    ctaText: 'Back to Home',
                    ctaHref: '/',
                };
        }
    };

    const { title, message, ctaText, ctaHref } = getContent();

    useEffect(() => {
        if (countdown <= 0) {
            router.push(ctaHref);
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, ctaHref, router]);

    return (
        <div className="min-h-screen bg-[#F7F5F1] noise-overlay flex flex-col">
            <Navigation />

            <main className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-lg w-full">
                    <div className="w-20 h-20 bg-[#D8CBB8]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <AlertCircle className="w-10 h-10 text-[#D8CBB8]" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-[#4E554B] mb-4 font-['Montserrat']">
                        404
                    </h2>
                    <h3 className="text-xl font-semibold text-[#4E554B] mb-4">
                        {title}
                    </h3>
                    <p className="text-[#6C6763]/70 mb-6 leading-relaxed">
                        {message}
                    </p>

                    <p className="text-sm text-[#6C6763]/50 mb-8">
                        Redirecting in <span className="font-bold text-[#D8CBB8]">{countdown}</span> seconds...
                    </p>

                    <Link
                        href={ctaHref}
                        className="bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white font-semibold rounded-full px-10 py-3 transition-colors inline-flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {ctaText}
                    </Link>
                </div>
            </main>
        </div>
    );
}
