"use server";

import { db } from "@/lib/db";
import { wishlists, listings } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Add listing to wishlist
export async function addToWishlist(userId: string, listingId: string) {
  try {
    await db.insert(wishlists).values({
      userId,
      listingId,
    });

    revalidatePath("/wishlist");
    revalidatePath(`/listings/${listingId}`);
    return { success: true };
  } catch (error) {
    // Handle duplicate key error
    return { success: false, error: "Already in wishlist" };
  }
}

// Remove from wishlist
export async function removeFromWishlist(userId: string, listingId: string) {
  await db
    .delete(wishlists)
    .where(and(eq(wishlists.userId, userId), eq(wishlists.listingId, listingId)));

  revalidatePath("/wishlist");
  revalidatePath(`/listings/${listingId}`);
  return { success: true };
}

// Check if listing is in wishlist
export async function isInWishlist(userId: string, listingId: string) {
  const item = await db.query.wishlists.findFirst({
    where: and(eq(wishlists.userId, userId), eq(wishlists.listingId, listingId)),
  });

  return !!item;
}

// Get user's wishlist
export async function getUserWishlist(userId: string) {
  const data = await db.query.wishlists.findMany({
    where: eq(wishlists.userId, userId),
    orderBy: [desc(wishlists.createdAt)],
    with: {
      listing: {
        with: {
          seller: {
            columns: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: {
            columns: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return data.map((item) => item.listing);
}
