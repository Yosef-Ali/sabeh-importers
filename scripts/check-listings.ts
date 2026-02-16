import "dotenv/config";
import { db } from "@/lib/db";
import { listings } from "@/db/schema";
import { count } from "drizzle-orm";

async function checkListings() {
  try {
    console.log("Attempting to connect to DB...");
    const result = await db.select({ count: count() }).from(listings);
    console.log("Connection successful.");
    console.log("Listings count:", result[0].count);
  } catch (error) {
    console.error("DB Connection failed:", error);
  }
}

checkListings();
