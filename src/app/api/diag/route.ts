import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listings } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + "...",
    nodeEnv: process.env.NODE_ENV,
  };

  // Test 1: Raw count query
  try {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings);
    results.countQuery = { ok: true, count: Number(countResult[0]?.count ?? 0) };
  } catch (e: any) {
    results.countQuery = { ok: false, error: e.message, stack: e.stack?.substring(0, 500) };
  }

  // Test 2: Relational query (same as getListings)
  try {
    const data = await db.query.listings.findMany({
      limit: 1,
      with: {
        seller: { columns: { name: true, id: true } },
        category: { columns: { name: true } },
      },
    });
    results.relationalQuery = { ok: true, found: data.length, firstTitle: data[0]?.title };
  } catch (e: any) {
    results.relationalQuery = { ok: false, error: e.message, stack: e.stack?.substring(0, 500) };
  }

  return NextResponse.json(results);
}
