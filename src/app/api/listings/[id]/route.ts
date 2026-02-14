import { NextRequest, NextResponse } from 'next/server';
import { getListing, deleteListing } from "@/lib/actions/marketplace";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
  }

  const listing = await getListing(params.id);

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  return NextResponse.json(listing);
}
