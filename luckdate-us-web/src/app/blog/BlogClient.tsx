'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { type ArticleDisplay } from '@/lib/api/mappers';
import type { BlogPaginationData } from '@/lib/api/server-fetch';
import BlogCategoryNav from '@/components/seo/BlogCategoryNav';
import { inferBlogCategory, type BlogCategoryId } from '@/lib/seo/blog-categories';

interface BlogClientProps {
    initialData: BlogPaginationData;
}

export default function BlogClient({ initialData }: BlogClientProps) {
    const router = useRouter();
    const { t, ready } = useTranslation();
    const [articles, setArticles] = useState<ArticleDisplay[]>(initialData.articles);
    const [currentPage, setCurrentPage] = useState<number>(initialData.currentPage);
    const [totalPages, setTotalPages] = useState<number>(initialData.totalPages);
    const [total, setTotal] = useState<number>(initialData.total);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeCategory, setActiveCategory] = useState<BlogCategoryId>('all');

    const safeT = (key: string, defaultValue: string, options?: Record<string, unknown>): string => {
        if (!ready) return defaultValue;
        return t(key, { defaultValue, ...options });
    };

    const filteredArticles = useMemo(() => {
        if (activeCategory === 'all') return articles;
        return articles.filter((post) => inferBlogCategory(post.title) === activeCategory);
    }, [articles, activeCategory]);

    const fetchPage = useCallback(async (page: number) => {
        if (page < 1 || page > totalPages || isLoading) return;

        setIsLoading(true);

        try {
            const res = await fetch(`/api/blog?page=${page}`, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error('Failed to fetch');

            const data: BlogPaginationData = await res.json();

            setArticles(data.articles);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
            setTotal(data.total);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            // ignore
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

    return (
        <>
        <BlogCategoryNav active={activeCategory} onChange={setActiveCategory} />
        <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((post) => (
                    <div
                        key={post.id}
                        className="group bg-white rounded-3xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
                        onClick={() => router.push(`/blog/${post.id}`)}
                    >
                        <div className="aspect-square overflow-hidden flex items-center justify-center bg-[#F7F5F1]">
                            <img
                                src={post.coverImage}
                                alt={`${post.title} - featured image from LUCKDATE wellness journal`}
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                        <div className="p-8">
                            {(post.date || post.author) && (
                            <div className="flex items-center gap-4 text-sm text-[#6C6763]/40 mb-4">
                                {post.date && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {post.date}
                                    </span>
                                )}
                                {post.author && (
                                    <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {post.author}
                                    </span>
                                )}
                            </div>
                            )}
                            <h3 className="text-xl font-bold text-[#4E554B] mb-3 group-hover:text-[#D8CBB8] transition-colors line-clamp-2 font-['Montserrat']">
                                {post.title}
                            </h3>
                            <p className="text-[#6C6763]/60 mb-6 line-clamp-3">
                                {post.excerpt}
                            </p>
                            <div className="flex items-center text-[#D8CBB8] font-medium text-sm group-hover:gap-2 transition-all">
                                {safeT('blog.readArticle', 'Read Article')} <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <p className="text-center text-[#6C6763]/60 py-12">
                    No articles in this category yet. Browse all articles or check back soon.
                </p>
            )}

            {totalPages > 1 && (
                <div className="flex flex-col items-center justify-center mt-16 space-y-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || isLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e5e5e5] text-[#6C6763] hover:border-[#D8CBB8] hover:text-[#D8CBB8] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {safeT('blog.pagination.previous', 'Previous')}
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
                            {safeT('blog.pagination.next', 'Next')}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-sm text-[#6C6763]/50">
                        {safeT('blog.pagination.showingPage',
                            'Showing page {{currentPage}} of {{totalPages}} ({{total}} articles total)',
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
        </div>
        </>
    );
}
