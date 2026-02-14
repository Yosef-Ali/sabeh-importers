
"use server";

import { db } from "@/lib/db";
import { listings, categories } from "@/db/schema";
import { desc, eq, and, gte, lte, ilike, or, sql, SQL } from "drizzle-orm";
import { createListingSchema, updateListingSchema } from "@/lib/validations/listing";
import { slugify } from "@/lib/utils";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

// ─── CREATE LISTING ───────────────────────────────────
export async function createListing(formData: FormData) {
  try {
    const session = await getCurrentUser();
    if (!session) return { error: 'Unauthorized. Please sign in.' };
    const sellerId = session.id;

    // Parse images: sent as a JSON array string
    let images: string[] = [];
    const imagesRaw = formData.get('images');
    if (imagesRaw && typeof imagesRaw === 'string') {
      try {
        images = JSON.parse(imagesRaw);
      } catch {
        images = [];
      }
    }

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price'),
      currency: formData.get('currency') || 'ETB',
      negotiable: formData.get('negotiable') === 'true',
      categoryId: formData.get('categoryId'),
      condition: formData.get('condition') || 'USED_GOOD',
      location: formData.get('location'),
      city: formData.get('city'),
      region: formData.get('region'),
      contactPhone: formData.get('contactPhone'),
      contactWhatsapp: formData.get('contactWhatsapp'),
      showPhone: formData.get('showPhone') !== 'false',
      images,
    };

    const validatedData = createListingSchema.parse(rawData);

    // Generate slug from title
    const slug = slugify(validatedData.title) + '-' + Date.now();

    const [listing] = await db.insert(listings).values({
      title: validatedData.title,
      titleAmharic: validatedData.titleAmharic,
      description: validatedData.description,
      descriptionAmharic: validatedData.descriptionAmharic,
      price: validatedData.price.toString(),
      currency: validatedData.currency,
      negotiable: validatedData.negotiable,
      categoryId: validatedData.categoryId,
      condition: validatedData.condition,
      slug,
      location: validatedData.location,
      city: validatedData.city,
      region: validatedData.region,
      contactPhone: validatedData.contactPhone,
      contactWhatsapp: validatedData.contactWhatsapp,
      showPhone: validatedData.showPhone,
      attributes: validatedData.attributes,
      images: images,
      sellerId,
      status: 'PENDING_REVIEW',
    }).returning();

    revalidatePath('/marketplace');
    revalidatePath('/');
    revalidatePath('/my-listings');
    return { success: true, listingId: listing.id };
  } catch (error) {
    console.error('Failed to create listing:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Validation failed. Please check your input.' };
    }
    return { error: 'Failed to create listing. Please try again.' };
  }
}

// ─── UPDATE LISTING ───────────────────────────────────
export async function updateListing(listingId: string, formData: FormData) {
  try {
    const session = await getCurrentUser();
    if (!session) return { error: 'Unauthorized. Please sign in.' };
    const sellerId = session.id;

    // Verify ownership
    const existingListing = await db.query.listings.findFirst({
      where: and(eq(listings.id, listingId), eq(listings.sellerId, sellerId)),
    });

    if (!existingListing) {
      return { error: 'Listing not found or you do not have permission to edit it.' };
    }

    // Parse images
    let images: string[] | undefined;
    const imagesRaw = formData.get('images');
    if (imagesRaw && typeof imagesRaw === 'string') {
      try {
        images = JSON.parse(imagesRaw);
      } catch {
        images = [];
      }
    }

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price'),
      currency: formData.get('currency'),
      negotiable: formData.get('negotiable') === 'true',
      categoryId: formData.get('categoryId'),
      condition: formData.get('condition'),
      location: formData.get('location'),
      city: formData.get('city'),
      region: formData.get('region'),
      contactPhone: formData.get('contactPhone'),
      contactWhatsapp: formData.get('contactWhatsapp'),
      showPhone: formData.get('showPhone') !== 'false',
      images,
    };

    // Filter out undefined/empty string keys for partial update
    const dataToValidate: any = {};
    for (const [key, value] of Object.entries(rawData)) {
      if (value !== null && value !== "" && value !== undefined) {
        dataToValidate[key] = value;
      }
    }

    const validatedData = updateListingSchema.parse(dataToValidate);

    const updatePayload: any = { ...validatedData, updatedAt: new Date() };
    if (validatedData.price !== undefined) {
      updatePayload.price = validatedData.price.toString();
    }

    await db.update(listings)
      .set(updatePayload)
      .where(eq(listings.id, listingId));

    revalidatePath('/marketplace');
    revalidatePath(`/listings/${listingId}`);
    revalidatePath('/my-listings');
    return { success: true, listingId };
  } catch (error) {
    console.error('Failed to update listing:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Validation failed. Please check your input.' };
    }
    return { error: 'Failed to update listing.' };
  }
}

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
  city?: string;
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
  city,
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

  // Location / City
  if (city) {
    conditions.push(ilike(listings.city, `%${city}%`));
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

  try {
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
  } catch (error) {
    console.error("getListings failed:", error instanceof Error ? error.message : error);
    return { data: [], total: 0, totalPages: 0, page, limit };
  }
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
