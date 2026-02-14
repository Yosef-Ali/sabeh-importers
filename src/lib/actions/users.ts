"use server";

import { db } from "@/lib/db";
import { users, listings, reviews } from "@/db/schema";
import { desc, eq, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Update profile fields (name, phone, bio, city)
export async function updateProfile(
  userId: string,
  data: { name?: string; phone?: string; bio?: string; city?: string }
) {
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

// Get user profile with stats
export async function getUserProfile(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      bio: true,
      createdAt: true,
      verificationStatus: true,
    },
  });

  if (!user) return null;

  // Get user's listings count
  const [listingsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(eq(listings.sellerId, userId));

  // Get average rating
  const [ratingData] = await db
    .select({
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      totalReviews: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(eq(reviews.revieweeId, userId));

  return {
    ...user,
    stats: {
      totalListings: Number(listingsCount?.count || 0),
      avgRating: Number(ratingData?.avgRating || 0),
      totalReviews: Number(ratingData?.totalReviews || 0),
    },
  };
}

// Get user's active listings
export async function getUserListings(userId: string, limit = 12) {
  const data = await db.query.listings.findMany({
    where: and(
      eq(listings.sellerId, userId),
      eq(listings.status, "ACTIVE")
    ),
    orderBy: [desc(listings.createdAt)],
    limit,
    with: {
      category: {
        columns: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return data;
}

// Get reviews for a user
export async function getUserReviews(userId: string) {
  const data = await db.query.reviews.findMany({
    where: eq(reviews.revieweeId, userId),
    orderBy: [desc(reviews.createdAt)],
    with: {
      reviewer: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      listing: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
  });

  return data;
}

// Submit a review
export async function submitReview(data: {
  reviewerId: string;
  revieweeId: string;
  listingId: string;
  rating: number;
  title?: string;
  comment: string;
}) {
  const [review] = await db
    .insert(reviews)
    .values({
      reviewerId: data.reviewerId,
      revieweeId: data.revieweeId,
      listingId: data.listingId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
    })
    .returning();

  return review;
}
