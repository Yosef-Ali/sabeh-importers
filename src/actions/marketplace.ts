'use server';

import { db } from '@/lib/db';
import { listings, categories, users, wishlists } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, desc, asc, and, gte, lte, ilike, sql, isNull } from 'drizzle-orm';
import { createListingSchema } from '@/lib/validations/listing';
import { slugify } from '@/lib/utils';

// ─── CREATE LISTING ───────────────────────────────────
export async function createListing(_prevState: any, formData: FormData) {
  try {
    // TODO: Replace with real auth when NextAuth is configured
    // const session = await auth();
    // if (!session?.user?.id) return { error: 'Unauthorized' };
    // const sellerId = session.user.id;

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
      images: [],
    };

    const validatedData = createListingSchema.parse(rawData);

    // Generate slug from title
    const slug = slugify(validatedData.title) + '-' + Date.now();

    // TEMPORARY: Use first user in DB until auth is set up
    const [firstUser] = await db.select({ id: users.id }).from(users).limit(1);
    if (!firstUser) return { error: 'No users in database. Run db:seed first.' };
    const sellerId = firstUser.id;

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
      sellerId,
      status: 'ACTIVE',
    }).returning();

    revalidatePath('/marketplace');
    revalidatePath('/');
    return { success: true, listingId: listing.id };
  } catch (error) {
    console.error('Failed to create listing:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Validation failed. Please check your input.' };
    }
    return { error: 'Failed to create listing. Please try again.' };
  }
}

// ─── GET LISTINGS (with filters & pagination) ──────────
export async function getListings(params?: {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  city?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const { query, categoryId, minPrice, maxPrice, condition, city, sortBy = 'newest', page = 1, limit = 20 } = params || {};

    const conditions = [
      eq(listings.status, 'ACTIVE'),
      isNull(listings.deletedAt),
    ];

    if (query) {
      conditions.push(
        ilike(listings.title, `%${query}%`)
      );
    }
    if (categoryId) conditions.push(eq(listings.categoryId, categoryId));
    if (minPrice) conditions.push(gte(listings.price, minPrice.toString()));
    if (maxPrice) conditions.push(lte(listings.price, maxPrice.toString()));
    if (condition) conditions.push(eq(listings.condition, condition as any));
    if (city) conditions.push(ilike(listings.city, `%${city}%`));

    // Determine sort order
    let orderBy;
    switch (sortBy) {
      case 'price_asc':
        orderBy = [asc(listings.price)];
        break;
      case 'price_desc':
        orderBy = [desc(listings.price)];
        break;
      default:
        orderBy = [desc(listings.isPromoted), desc(listings.createdAt)];
    }

    const offset = (page - 1) * limit;

    const data = await db.query.listings.findMany({
      where: and(...conditions),
      orderBy,
      limit,
      offset,
      with: {
        category: true,
        seller: {
          columns: {
            id: true,
            name: true,
            avatar: true,
            verificationStatus: true,
            responseRate: true,
          },
        },
      },
    });

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(and(...conditions));

    return {
      listings: data,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return { error: 'Failed to load listings' };
  }
}

// ─── GET SINGLE LISTING ───────────────────────────────
export async function getListingById(id: string) {
  try {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, id),
      with: {
        category: true,
        seller: {
          columns: {
            id: true,
            name: true,
            nameAmharic: true,
            avatar: true,
            phone: true,
            verificationStatus: true,
            responseRate: true,
            responseTime: true,
            createdAt: true,
          },
        },
        reviews: {
          with: {
            reviewer: {
              columns: { name: true, avatar: true },
            },
          },
          limit: 10,
        },
      },
    });

    if (!listing) return { error: 'Listing not found' };

    // Increment view count
    await db.update(listings)
      .set({ viewCount: sql`${listings.viewCount} + 1` })
      .where(eq(listings.id, id));

    return { listing };
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return { error: 'Failed to load listing' };
  }
}

// ─── GET CATEGORIES ───────────────────────────────────
export async function getCategories() {
  try {
    const allCategories = await db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [asc(categories.sortOrder), asc(categories.name)],
      with: {
        children: {
          where: eq(categories.isActive, true),
          orderBy: [asc(categories.sortOrder)],
        },
      },
    });

    // Filter to root categories only
    const rootCategories = allCategories.filter((c) => !c.parentId);

    return { categories: rootCategories };
  } catch (error) {
    console.error('Failed to load categories:', error);
    return { error: 'Failed to load categories' };
  }
}

// ─── TOGGLE WISHLIST ──────────────────────────────────
export async function toggleWishlist(listingId: string, userId: string) {
  try {
    const existing = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, userId),
        eq(wishlists.listingId, listingId),
      ),
    });

    if (existing) {
      await db.delete(wishlists).where(eq(wishlists.id, existing.id));
      await db.update(listings)
        .set({ favoriteCount: sql`${listings.favoriteCount} - 1` })
        .where(eq(listings.id, listingId));
      return { saved: false };
    } else {
      await db.insert(wishlists).values({ userId, listingId });
      await db.update(listings)
        .set({ favoriteCount: sql`${listings.favoriteCount} + 1` })
        .where(eq(listings.id, listingId));
      return { saved: true };
    }
  } catch (error) {
    console.error('Failed to toggle wishlist:', error);
    return { error: 'Failed to update wishlist' };
  }
}

// ─── DELETE LISTING (soft delete) ─────────────────────
export async function deleteListing(listingId: string) {
  try {
    await db.update(listings)
      .set({ deletedAt: new Date(), status: 'DELETED' })
      .where(eq(listings.id, listingId));

    revalidatePath('/marketplace');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete listing' };
  }
}
