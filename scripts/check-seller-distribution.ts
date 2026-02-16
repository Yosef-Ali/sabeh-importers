
import "dotenv/config";
import { db } from "@/lib/db";
import { listings } from "@/db/schema";
import { count, sql } from "drizzle-orm";

async function checkSellerDistribution() {
  try {
    const result = await db
      .select({
        sellerId: listings.sellerId,
        count: count()
      })
      .from(listings)
      .groupBy(listings.sellerId);
    console.log("Seller Distribution:", result);
  } catch (error) {
    console.error("DB Check failed:", error);
  }
}

checkSellerDistribution();
