import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = "force-dynamic";
import { distributors } from '@/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const conditions = [isNull(distributors.deletedAt)];
    if (status) conditions.push(eq(distributors.status, status as any));

    const data = await db.select().from(distributors)
      .where(and(...conditions))
      .orderBy(desc(distributors.createdAt));

    return NextResponse.json({ distributors: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load distributors' }, { status: 500 });
  }
}
