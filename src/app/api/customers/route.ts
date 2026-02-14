import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = "force-dynamic";
import { customers } from '@/db/schema';
import { eq, desc, ilike, and, isNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const type = searchParams.get('type');

    const conditions = [
      eq(customers.isActive, true),
      isNull(customers.deletedAt),
    ];

    if (query) conditions.push(ilike(customers.name, `%${query}%`));
    if (type) conditions.push(eq(customers.type, type as any));

    const data = await db.query.customers.findMany({
      where: and(...conditions),
      orderBy: [desc(customers.createdAt)],
      with: {
        orders: { limit: 5 },
      },
    });

    return NextResponse.json({ customers: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load customers' }, { status: 500 });
  }
}
