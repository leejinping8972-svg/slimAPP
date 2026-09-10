'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { type Product } from '@/sections/Products';
import type { ProductsPaginationData } from '@/lib/api/server-fetch';
import CartDrawer from '@/components/CartDrawer';
import { GlobalCoupon } from '@/components/GlobalCoupon';

interface ProductsClientProps {
    initialData: ProductsPaginationData;
}

export default function ProductsClient({ initialData }: ProductsClientProps) {
    const router = useRouter();
    const { t, ready } = useTranslation();
    const { addToCart } = useCart();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [filter, setFilter] = useState('All');
    const [products, setProducts] = useState<Product[]>(initialData.products);
    const [currentPage, setCurrentPage] = useState<number>(initialData.currentPage);
    const [totalPages, setTotalPages] = useState<number>(initialData.totalPages);
    const [total, setTotal] = useState<number>(initialData.total);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const safeT = (key: string, defaultValue: string, options?: Record<string, any>): string => {
        if (!ready) return defaultValue;
        return t(key, { defaultValue, ...options });
    };

    const categories = ['All'];

    const filteredProducts = products.filter((p: Product) => {
        if (filter === 'All') return true;
        if (filter === 'Best Sellers') return p.badge === 'Best Seller';
        if (filter === 'New Arrivals') return p.badge === 'New';
        return true;
    });

    const fetchPage = useCallback(async (page: number) => {
        if (page < 1 || page > totalPages || isLoading) return;

        setIsLoading(true);

        try {
            const res = await fetch(`/api/products?page=${page}`, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error('Failed to fetch');

            const data: ProductsPaginationData = await res.json();

            setProducts(data.products);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
            setTotal(data.total);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }, [totalPages, isLoading]);

    const handlePrevPage = () => {
        if (currentPage > 1) fetchPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) fetchPage(currentPage + 1);
    };

    const handlePageClick = (page: number) => {
        fetchPage(page);
    };

    const renderPaginationNumbers = () => {
        const pages: number[] = [];
        const maxVisible = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const openProductDetail = (product: Product) => {
        router.push(`/product/${product.id}`);
    };

    const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });

        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ ecommerce: null });
        (window as any).dataLayer.push({
            event: "add_to_cart",
            ecommerce: {
                currency: "USD",
                value: product.price,
                items: [{
                    item_id: String(product.id),
                    item_name: product.name,
                    price: product.price,
                    quantity: 1
                }]
            }
        });
    };

    return (
        <>
            {/* <div className="flex justify-center mb-12 gap-4 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                            ? 'bg-[#4E554B] text-white'
                            : 'bg-white text-[#4E554B] hover:bg-[#4E554B]/5'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div> */}

            {filteredProducts.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#D8CBB8]/20">
                    <Star className="w-10 h-10 text-[#D8CBB8]/40 mb-4" />
                    <p className="text-[#4E554B] font-medium mb-2">{safeT('products.noProducts', 'No products found')}</p>
                    <p className="text-sm text-gray-500">{safeT('products.tryDifferentFilter', 'Try selecting a different filter')}</p>
                </div>
            )}

            {/* Mobile: 2-column masonry using two separate columns */}
            <div className="sm:hidden">
                <div className="grid grid-cols-2 gap-3">
                    {/* Left column: even indices (0, 2, 4...) */}
                    <div className="flex flex-col gap-3">
                        {filteredProducts.filter((_, i) => i % 2 === 0).map((product, colIndex) => {
                            const index = colIndex * 2;
                            return (
                                <div
                                    key={product.id}
                                    className={`product-card group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${hoveredIndex === index ? 'scale-[1.02] shadow-2xl' : ''
                                        } ${hoveredIndex !== null && hoveredIndex !== index ? 'scale-[0.98] opacity-80' : ''}`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => openProductDetail(product)}
                                >
                                    {product.badge && (
                                        <div className="absolute top-2.5 left-2.5 z-10 bg-[#D8CBB8] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                                            {product.badge}
                                        </div>
                                    )}

                                    <div className="relative w-full aspect-square overflow-hidden bg-[#F7F5F1] flex items-center justify-center">
                                        <img
                                            src={product.image}
                                            alt={`${product.name} - premium supplement by LUCKDATE`}
                                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="flex items-center gap-0.5">
                                                <Star className="w-2.5 h-2.5 fill-[#D8CBB8] text-[#D8CBB8]" />
                                                <span className="text-[11px] font-medium text-[#4E554B]">{(product.rating).toFixed(1)}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-bold text-[#4E554B] mb-1.5 group-hover:text-[#D8CBB8] transition-colors duration-300 font-['Montserrat'] leading-tight line-clamp-2">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="text-base font-bold text-[#4E554B] font-['Montserrat']">
                                                ${product.price}
                                            </div>
                                            <button
                                                onClick={(e) => handleQuickAdd(e, product)}
                                                className="w-8 h-8 bg-[#4E554B] rounded-full flex items-center justify-center hover:bg-[#D8CBB8] transition-colors duration-300"
                                                aria-label={`Add ${product.name} to cart`}
                                            >
                                                <ShoppingCart className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Right column: odd indices (1, 3, 5...) */}
                    <div className="flex flex-col gap-3">
                        {filteredProducts.filter((_, i) => i % 2 === 1).map((product, colIndex) => {
                            const index = colIndex * 2 + 1;
                            return (
                                <div
                                    key={product.id}
                                    className={`product-card group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${hoveredIndex === index ? 'scale-[1.02] shadow-2xl' : ''
                                        } ${hoveredIndex !== null && hoveredIndex !== index ? 'scale-[0.98] opacity-80' : ''}`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => openProductDetail(product)}
                                >
                                    {product.badge && (
                                        <div className="absolute top-2.5 left-2.5 z-10 bg-[#D8CBB8] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                                            {product.badge}
                                        </div>
                                    )}

                                    <div className="relative w-full aspect-square overflow-hidden bg-[#F7F5F1] flex items-center justify-center">
                                        <img
                                            src={product.image}
                                            alt={`${product.name} - premium supplement by LUCKDATE`}
                                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="flex items-center gap-0.5">
                                                <Star className="w-2.5 h-2.5 fill-[#D8CBB8] text-[#D8CBB8]" />
                                                <span className="text-[11px] font-medium text-[#4E554B]">{(product.rating).toFixed(1)}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-bold text-[#4E554B] mb-1.5 group-hover:text-[#D8CBB8] transition-colors duration-300 font-['Montserrat'] leading-tight line-clamp-2">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="text-base font-bold text-[#4E554B] font-['Montserrat']">
                                                ${product.price}
                                            </div>
                                            <button
                                                onClick={(e) => handleQuickAdd(e, product)}
                                                className="w-8 h-8 bg-[#4E554B] rounded-full flex items-center justify-center hover:bg-[#D8CBB8] transition-colors duration-300"
                                                aria-label={`Add ${product.name} to cart`}
                                            >
                                                <ShoppingCart className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Desktop: Original grid layout */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className={`product-card group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer ${hoveredIndex === index ? 'scale-[1.02] shadow-2xl' : ''
                            } ${hoveredIndex !== null && hoveredIndex !== index ? 'scale-[0.98] opacity-80' : ''}`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => openProductDetail(product)}
                    >
                        {product.badge && (
                            <div className="absolute top-4 left-4 z-10 bg-[#D8CBB8] text-white text-xs font-medium px-3 py-1 rounded-full">
                                {product.badge}
                            </div>
                        )}

                        <div className="relative w-full aspect-square overflow-hidden bg-[#F7F5F1] flex items-center justify-center">
                            <img
                                src={product.image}
                                alt={`${product.name} - premium supplement by LUCKDATE`}
                                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-[#D8CBB8] text-[#D8CBB8]" />
                                    <span className="text-xs font-medium text-[#4E554B]">{(product.rating).toFixed(1)}</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-[#4E554B] mb-2 group-hover:text-[#D8CBB8] transition-colors duration-300 font-['Montserrat'] leading-tight line-clamp-2">
                                {product.name}
                            </h3>

                            <div className="flex items-center justify-between mt-4">
                                <div className="text-xl font-bold text-[#4E554B] font-['Montserrat']">
                                    ${product.price}
                                </div>
                                <button
                                    onClick={(e) => handleQuickAdd(e, product)}
                                    className="w-10 h-10 bg-[#4E554B] rounded-full flex items-center justify-center hover:bg-[#D8CBB8] transition-colors duration-300"
                                    aria-label={`Add ${product.name} to cart`}
                                >
                                    <ShoppingCart className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col items-center justify-center mt-16 space-y-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || isLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5e5e5] text-[#6C6763] hover:border-[#D8CBB8] hover:text-[#D8CBB8] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {safeT('products.pagination.previous', 'Previous')}
                        </button>

                        <div className="flex items-center gap-1">
                            {renderPaginationNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    disabled={isLoading}
                                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                                        page === currentPage
                                            ? 'bg-[#D8CBB8] text-white shadow-md'
                                            : 'bg-white text-[#6C6763] hover:bg-[#D8CBB8]/10 border border-[#e5e5e5]'
                                    } disabled:opacity-60`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || isLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5e5e5] text-[#6C6763] hover:border-[#D8CBB8] hover:text-[#D8CBB8] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                        >
                            {safeT('products.pagination.next', 'Next')}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-sm text-[#6C6763]/50">
                        {safeT('products.pagination.showingPage',
                            'Showing page {{currentPage}} of {{totalPages}} ({{total}} products total)',
                            { currentPage, totalPages, total }
                        )}
                    </p>
                </div>
            )}

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-3 border-[#D8CBB8]/20 border-t-[#D8CBB8] rounded-full animate-spin" />
                </div>
            )}

            <CartDrawer />
            <GlobalCoupon />
        </>
    );
}
