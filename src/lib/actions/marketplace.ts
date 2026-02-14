
"use server";

import { db } from "@/lib/db";
import { listings, categories } from "@/db/schema";
import { desc, eq, and, gte, lte, ilike, or, sql, SQL } from "drizzle-orm";

export interface GetListingsParams {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: "NEW" | "LIKE_NEW" | "USED_GOOD" | "USED_FAIR" | "FOR_PARTS";
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
  featured?: boolean;
  verified?: boolean; // Filter by verified sellers
}

export async function getListings({
  query,
  categoryId,
  minPrice,
  maxPrice,
  condition,
  sort = "newest",
  page = 1,
  limit = 20,
  featured,
}: GetListingsParams) {
  const offset = (page - 1) * limit;
  const conditions: SQL[] = [eq(listings.status, "ACTIVE")];

  // Search Query
  if (query) {
    const searchTerm = `%${query}%`;
    conditions.push(
      or(
        ilike(listings.title, searchTerm),
        ilike(listings.description, searchTerm)
      )!
    );
  }

  // Category Filter
  if (categoryId) {
    conditions.push(eq(listings.categoryId, categoryId));
  }

  // Price Range
  if (minPrice !== undefined) {
    conditions.push(gte(listings.price, minPrice.toString()));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(listings.price, maxPrice.toString()));
  }

  // Condition
  if (condition) {
    conditions.push(eq(listings.condition, condition));
  }

  // Featured Filter
  if (featured !== undefined) {
    conditions.push(eq(listings.isFeatured, featured));
  }

  // Note: 'verified' filter would strictly require joining with the seller table if filtering at SQL level
  // or we can handle it if we have a denormalized field. For now, we will handle it in the query if possible
  // or rely on isFeatured for the homepage section as a proxy for "Premium/Verified" listings for this refactor.


  // Sorting
  let orderBy;
  switch (sort) {
    case "price_asc":
      orderBy = listings.price;
      break;
    case "price_desc":
      orderBy = desc(listings.price);
      break;
    case "newest":
    default:
      orderBy = desc(listings.createdAt);
  }

  // Run data query and count query in parallel
  const whereClause = and(...conditions);

  const [data, countResult] = await Promise.all([
    db.query.listings.findMany({
      where: whereClause,
      limit: limit,
      offset: offset,
      orderBy: [orderBy],
      with: {
        seller: {
          columns: {
            name: true,
            avatar: true,
            id: true,
          },
        },
        category: {
          columns: {
            name: true,
            slug: true,
          },
        },
      },
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(whereClause),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const totalPages = Math.ceil(total / limit);

  return { data, total, totalPages, page, limit };
}

export async function getListing(id: string) {
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, id),
    with: {
      seller: {
        columns: {
          id: true,
          name: true,
          avatar: true,
          phone: true,
          email: true,
          createdAt: true,
          verificationStatus: true,
        },
      },
      category: true,
    },
  });

  return listing;
}

export async function getSellerActiveListingCount(sellerId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(and(eq(listings.sellerId, sellerId), eq(listings.status, "ACTIVE")));
  return Number(result?.count ?? 0);
}

export async function getCategories() {
  const data = await db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: [desc(categories.sortOrder), categories.name],
  });
  return data;
}

export const getListingById = getListing;

export async function getUserListings(userId: string) {
  const data = await db.query.listings.findMany({
    where: eq(listings.sellerId, userId),
    orderBy: [desc(listings.createdAt)],
    with: {
      category: {
        columns: {
          name: true,
        },
      },
    },
  });

  return { data };
}

export async function getUserListingsWithStats(userId: string) {
  // Run queries in parallel for better performance
  const [userListings, statsResult] = await Promise.all([
    // Get all user listings with category information
    db.query.listings.findMany({
      where: eq(listings.sellerId, userId),
      orderBy: [desc(listings.createdAt)],
      with: {
        category: {
          columns: {
            name: true,
            slug: true,
          },
        },
      },
    }),
    // Get aggregated stats
    db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where ${listings.status} = 'ACTIVE')::int`,
        totalViews: sql<number>`coalesce(sum(${listings.viewCount}), 0)::int`,
      })
      .from(listings)
      .where(eq(listings.sellerId, userId)),
  ]);

  // Calculate unread messages count (placeholder for now)
  // TODO: Implement when messages table is available
  const unreadMessages = 0;

  return {
    listings: userListings,
    stats: {
      total: statsResult[0]?.total || 0,
      active: statsResult[0]?.active || 0,
      totalViews: statsResult[0]?.totalViews || 0,
      unreadMessages,
    },
  };
}

export async function deleteListing(listingId: string) {
  await db.delete(listings).where(eq(listings.id, listingId));
  return { success: true };
}
