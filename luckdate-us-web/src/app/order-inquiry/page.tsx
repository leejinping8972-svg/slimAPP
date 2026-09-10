'use client';

import { useState } from 'react';
import { Search, ArrowLeft, Loader2, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import OrderResultCard, { type OrderResultCardData } from '@/components/OrderResultCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { orderApi } from '@/lib/api';

export default function OrderInquiryPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [orders, setOrders] = useState<OrderResultCardData[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [expandedOrderNo, setExpandedOrderNo] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const pageSize = 10;

    const fetchOrders = async (targetPage: number, keepExpanded = false) => {
        setIsSearching(true);
        try {
            const data = await orderApi.queryOrders(name.trim(), phone, targetPage, pageSize);
            const list = Array.isArray(data.result) ? data.result : Array.isArray(data) ? data : [];
            const pagination = data.pagination || null;

            setOrders(list);
            setPage(targetPage);
            if (pagination) {
                setTotalPages(pagination.totalPages || 1);
                setTotalCount(pagination.total || list.length);
            } else {
                setTotalPages(1);
                setTotalCount(list.length);
            }

            if (!keepExpanded) {
                const first = list[0];
                setExpandedOrderNo(list.length > 0 ? (first?.order_sn ?? first?.orderNo ?? null) : null);
            } else if (list.length === 0) {
                setExpandedOrderNo(null);
            }
        } catch {
            setOrders([]);
            setExpandedOrderNo(null);
            setTotalPages(1);
            setTotalCount(0);
        } finally {
            setIsSearching(false);
            setHasSearched(true);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || phone.length !== 4) return;

        setHasSearched(false);
        await fetchOrders(1);
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
                        {t('orderInquiry.back')}
                    </button>

                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#4E554B] mb-4 font-['Montserrat']">
                            {t('orderInquiry.title')}
                        </h2>
                        <p className="text-[#6C6763]/70 text-lg max-w-xl mx-auto">
                            {t('orderInquiry.description')}
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#4E554B]/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D8CBB8]/20 via-[#D8CBB8] to-[#D8CBB8]/20" />

                        <form onSubmit={handleSearch} className="grid md:grid-cols-12 gap-6 max-w-3xl mx-auto">
                            <div className="md:col-span-5 relative">
                                <Input
                                    type="text"
                                    placeholder={t('orderInquiry.namePlaceholder')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-4 pr-4 py-6 rounded-2xl bg-[#F7F5F1] border-transparent focus:border-[#D8CBB8] focus:ring-[#D8CBB8] text-lg w-full"
                                />
                            </div>
                            <div className="md:col-span-4 relative">
                                <Input
                                    type="text"
                                    placeholder={t('orderInquiry.phonePlaceholder')}
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
                                    {!isSearching && t('orderInquiry.search')}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {hasSearched && (
                        <div className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                            {orders.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-black text-[#4E554B] font-['Montserrat']">
                                            {t('orderInquiry.foundOrders', { count: totalCount || orders.length })}
                                        </h2>
                                    </div>
                                    <div className="space-y-6">
                                        {orders.map((order, index) => (
                                            <OrderResultCard
                                                key={order.order_sn ?? order.orderNo ?? index}
                                                order={order}
                                                expanded={expandedOrderNo === (order.order_sn ?? order.orderNo)}
                                                onToggle={() => {
                                                    const sn = order.order_sn ?? order.orderNo;
                                                    setExpandedOrderNo((prev) => (prev === sn ? null : sn ?? null));
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="mt-8 flex items-center justify-center gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isSearching || page <= 1}
                                                onClick={() => fetchOrders(page - 1, true)}
                                                className="rounded-full px-4 py-2 text-sm"
                                            >
                                                {t('common.prev', 'Prev')}
                                            </Button>
                                            <span className="text-xs text-[#6b7280]">
                                                {page} / {totalPages}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isSearching || page >= totalPages}
                                                onClick={() => fetchOrders(page + 1, true)}
                                                className="rounded-full px-4 py-2 text-sm"
                                            >
                                                {t('common.next', 'Next')}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-[#F7F5F1] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Package className="w-10 h-10 text-[#6C6763]/30" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#4E554B] mb-2 font-['Montserrat']">
                                        {t('orderInquiry.noOrders')}
                                    </h3>
                                    <p className="text-[#6C6763]/60 max-w-md mx-auto">
                                        {t('orderInquiry.noOrdersDescription')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
            <CartDrawer />
        </div>
    );
}
