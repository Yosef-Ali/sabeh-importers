import { NextRequest, NextResponse } from 'next/server';
import { getListingById } from '@/actions/marketplace';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await getListingById(params.id);

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result);
}
