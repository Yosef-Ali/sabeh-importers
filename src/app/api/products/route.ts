import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc, ilike, and, isNull } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const categoryId = searchParams.get('categoryId');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;

    const conditions = [
      eq(products.isActive, true),
      isNull(products.deletedAt),
    ];

    if (query) conditions.push(ilike(products.name, `%${query}%`));
    if (categoryId) conditions.push(eq(products.categoryId, categoryId));

    const data = await db.query.products.findMany({
      where: and(...conditions),
      orderBy: [desc(products.createdAt)],
      limit,
      offset: (page - 1) * limit,
      with: {
        category: true,
        inventory: true,
      },
    });

    return NextResponse.json({ products: data });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
