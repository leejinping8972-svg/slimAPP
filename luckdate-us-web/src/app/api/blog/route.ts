import { NextRequest, NextResponse } from 'next/server';
import { fetchBlogPageArticles } from '@/lib/api/server-fetch';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);

    try {
        const data = await fetchBlogPageArticles(page);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { articles: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 },
            { status: 500 }
        );
    }
}
