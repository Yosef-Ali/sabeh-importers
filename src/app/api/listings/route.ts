import { NextRequest, NextResponse } from 'next/server';
import { getListings } from '@/actions/marketplace';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const result = await getListings({
    query: searchParams.get('query') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    condition: searchParams.get('condition') || undefined,
    city: searchParams.get('city') || undefined,
    sortBy: searchParams.get('sortBy') || 'newest',
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 20,
  });

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result);
}
