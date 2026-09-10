'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { type ArticleDisplay } from '@/lib/api/mappers';
import { GlobalCoupon } from '@/components/GlobalCoupon';
import ArticleRelatedModules from '@/components/seo/ArticleRelatedModules';

export default function ArticleClient({ post }: { post: ArticleDisplay }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
        }
    };

    return (
        <>
            <div className="rounded-3xl overflow-hidden mb-16 shadow-lg aspect-square max-w-xl mx-auto flex items-center justify-center bg-[#F7F5F1]">
                <img
                    src={post.coverImage}
                    alt={`${post.title} - cover image`}
                    className="w-full h-full object-contain"
                />
            </div>

            <div
                className="prose prose-lg prose-neutral max-w-none text-[#6C6763]/80"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            <div className="mt-20 pt-10 border-t border-[#4E554B]/10 flex justify-between items-center">
                <span className="font-medium text-[#4E554B]">Share this article</span>
                <div className="flex gap-4">
                    <button 
                        onClick={handleCopyLink}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${isCopied ? 'bg-[#D8CBB8] text-white' : 'bg-white hover:bg-[#D8CBB8] hover:text-white'}`}
                        aria-label="Copy article link"
                    >
                        {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>
            <ArticleRelatedModules />
            <GlobalCoupon />
        </>
    );
}
