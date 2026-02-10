import { NextResponse } from 'next/server';
import { getCategories } from '@/actions/marketplace';

export async function GET() {
  const result = await getCategories();

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result);
}
