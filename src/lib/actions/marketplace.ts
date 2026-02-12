
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
          name: true,
          avatar: true,
          phone: true,
          email: true,
          createdAt: true,
        },
      },
      category: true,
    },
  });

  return listing;
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

export async function deleteListing(listingId: string) {
  await db.delete(listings).where(eq(listings.id, listingId));
  return { success: true };
}
