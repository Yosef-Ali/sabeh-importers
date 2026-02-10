import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const conditions = [isNull(orders.deletedAt)];
    if (status) conditions.push(eq(orders.status, status as any));

    const data = await db.query.orders.findMany({
      where: and(...conditions),
      orderBy: [desc(orders.createdAt)],
      limit: 50,
      with: {
        customer: true,
        items: {
          with: { product: true },
        },
        payments: true,
      },
    });

    return NextResponse.json({ orders: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
  }
}
