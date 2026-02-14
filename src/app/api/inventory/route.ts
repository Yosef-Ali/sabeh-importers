import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await db.query.inventory.findMany({
      with: {
        product: true,
        warehouse: true,
      },
    });

    return NextResponse.json({ inventory: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load inventory' }, { status: 500 });
  }
}
