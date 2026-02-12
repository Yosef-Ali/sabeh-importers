"use server";

import { db } from "@/lib/db";
import { savedSearches } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface SavedSearchFilters {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sort?: string;
}

// Create a saved search
export async function createSavedSearch(
  userId: string,
  name: string,
  filters: SavedSearchFilters,
  alertEnabled = true
) {
  const [savedSearch] = await db
    .insert(savedSearches)
    .values({
      userId,
      name,
      query: filters.query,
      categoryId: filters.categoryId,
      filters: filters as Record<string, any>,
      alertEnabled,
    })
    .returning();

  revalidatePath("/saved-searches");
  return savedSearch;
}

// Get user's saved searches
export async function getUserSavedSearches(userId: string) {
  const data = await db.query.savedSearches.findMany({
    where: eq(savedSearches.userId, userId),
    orderBy: [desc(savedSearches.createdAt)],
  });

  return data;
}

// Delete saved search
export async function deleteSavedSearch(searchId: string) {
  await db.delete(savedSearches).where(eq(savedSearches.id, searchId));
  revalidatePath("/saved-searches");
  return { success: true };
}

// Toggle alert for saved search
export async function toggleSearchAlert(searchId: string, enabled: boolean) {
  await db
    .update(savedSearches)
    .set({ alertEnabled: enabled })
    .where(eq(savedSearches.id, searchId));

  revalidatePath("/saved-searches");
  return { success: true };
}
