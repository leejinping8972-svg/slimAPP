import { NextRequest, NextResponse } from 'next/server';
import { fetchProductsPage } from '@/lib/api/server-fetch';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);

    try {
        const data = await fetchProductsPage(page);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { products: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 },
            { status: 500 }
        );
    }
}
