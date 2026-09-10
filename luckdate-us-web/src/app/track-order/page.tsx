'use client';

import { useState } from 'react';
import { Package, Truck, CheckCircle2, MapPin, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TrackOrderPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<null | any>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || phone.length !== 4) return;

        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
            setResult({
                orderNumber: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                status: 'in_transit',
                estimatedDelivery: 'Dec 15, 2026',
                events: [
                    { time: 'Today, 08:45 AM', location: 'Los Angeles, CA', description: 'Out for delivery', done: false },
                    { time: 'Yesterday, 10:20 PM', location: 'Los Angeles Distribution Center', description: 'Arrived at local facility', done: true },
                    { time: '2 Days Ago, 03:15 PM', location: 'National Hub', description: 'In transit to destination', done: true },
                    { time: '3 Days Ago, 09:00 AM', location: 'Warehouse', description: 'Order packed and handed to courier', done: true },
                ]
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F7F5F1] noise-overlay flex flex-col">
            <Navigation />

            <main className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 max-w-4xl">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[#6C6763]/60 hover:text-[#D8CBB8] transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#4E554B] mb-4 font-['Montserrat']">
                            Track Your Order
                        </h2>
                        <p className="text-[#6C6763]/70 text-lg max-w-xl mx-auto">
                            Enter your billing name and the last 4 digits of your phone number to see your order status in real-time.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#4E554B]/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D8CBB8]/20 via-[#D8CBB8] to-[#D8CBB8]/20" />

                        <form onSubmit={handleSearch} className="grid md:grid-cols-12 gap-6 max-w-3xl mx-auto">
                            <div className="md:col-span-5 relative">
                                <Input
                                    type="text"
                                    placeholder="Recipient Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-4 pr-4 py-6 rounded-2xl bg-[#F7F5F1] border-transparent focus:border-[#D8CBB8] focus:ring-[#D8CBB8] text-lg w-full"
                                />
                            </div>
                            <div className="md:col-span-4 relative">
                                <Input
                                    type="text"
                                    placeholder="Phone (Last 4 digits)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    required
                                    maxLength={4}
                                    className="pl-4 pr-4 py-6 rounded-2xl bg-[#F7F5F1] border-transparent focus:border-[#D8CBB8] focus:ring-[#D8CBB8] text-lg w-full text-center tracking-widest"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <Button
                                    type="submit"
                                    disabled={isSearching || !name.trim() || phone.length !== 4}
                                    className="w-full h-full py-4 lg:py-0 bg-[#D8CBB8] hover:bg-[#C4B5A0] text-white rounded-2xl text-lg font-medium transition-all hover:scale-105"
                                >
                                    {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6 mr-2" />}
                                    {!isSearching && 'Track'}
                                </Button>
                            </div>
                        </form>

                        {result && (
                            <div className="mt-16 pt-12 border-t border-[#4E554B]/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                    <div>
                                        <p className="text-[#6C6763]/60 text-sm font-medium uppercase tracking-wider mb-1">Order Number</p>
                                        <h3 className="text-2xl font-bold font-['Montserrat'] text-[#4E554B]">{result.orderNumber}</h3>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-[#6C6763]/60 text-sm font-medium uppercase tracking-wider mb-1">Estimated Delivery</p>
                                        <h3 className="text-2xl font-bold font-['Montserrat'] text-[#D8CBB8]">{result.estimatedDelivery}</h3>
                                    </div>
                                </div>

                                <div className="relative mb-16 hidden md:block">
                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#F7F5F1] -translate-y-1/2 rounded-full" />
                                    <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-[#D8CBB8] -translate-y-1/2 rounded-full" />

                                    <div className="relative flex justify-between z-10 w-full px-2">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#D8CBB8] text-white flex items-center justify-center border-4 border-white shadow-sm">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-semibold text-[#4E554B]">Processing</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#D8CBB8] text-white flex items-center justify-center border-4 border-white shadow-sm">
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-semibold text-[#4E554B]">In Transit</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-[#F7F5F1] text-[#6C6763]/40 flex items-center justify-center border-4 border-white shadow-sm">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-semibold text-[#6C6763]/60">Delivered</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pl-4 lg:pl-16">
                                    {result.events.map((event: any, i: number) => (
                                        <div key={i} className="relative pl-8 md:pl-0">
                                            {i !== result.events.length - 1 && (
                                                <div className="absolute left-[3px] md:left-[23px] top-6 bottom-[-32px] w-px bg-[#4E554B]/10" />
                                            )}

                                            <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-start">
                                                <div className={`absolute md:relative left-0 top-1.5 md:top-1 w-2 h-2 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 
                                                    ${event.done ? 'bg-[#D8CBB8] text-white' : 'bg-[#F7F5F1] text-[#6C6763]/40'}`}>
                                                    <MapPin className="hidden md:block w-5 h-5" />
                                                </div>

                                                <div className="flex-1 w-full pt-0.5">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                                                        <h4 className={`text-lg font-semibold ${event.done ? 'text-[#4E554B]' : 'text-[#6C6763]/60'}`}>
                                                            {event.description}
                                                        </h4>
                                                        <span className="text-sm font-medium text-[#6C6763]/60">{event.time}</span>
                                                    </div>
                                                    <p className="text-[#6C6763]/70">{event.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
            <CartDrawer />
        </div>
    );
}
