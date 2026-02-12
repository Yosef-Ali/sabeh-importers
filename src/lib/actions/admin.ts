"use server";

import { db } from "@/lib/db";
import { listings, users, reports } from "@/db/schema";
import { desc, eq, sql, or, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get admin dashboard stats
export async function getAdminStats() {
  const [totalUsers] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  const [activeListings] = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(eq(listings.status, "ACTIVE"));

  const [pendingListings] = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(eq(listings.status, "PENDING_REVIEW"));

  const [pendingReports] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reports)
    .where(eq(reports.status, "PENDING"));

  return {
    totalUsers: Number(totalUsers?.count || 0),
    activeListings: Number(activeListings?.count || 0),
    pendingListings: Number(pendingListings?.count || 0),
    pendingReports: Number(pendingReports?.count || 0),
  };
}

// Get pending listings for moderation
export async function getPendingListings(limit = 20) {
  const data = await db.query.listings.findMany({
    where: or(
      eq(listings.status, "PENDING_REVIEW"),
      eq(listings.status, "DRAFT")
    ),
    orderBy: [desc(listings.createdAt)],
    limit,
    with: {
      seller: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: {
        columns: {
          name: true,
        },
      },
    },
  });

  return data;
}

// Approve listing
export async function approveListing(listingId: string) {
  await db
    .update(listings)
    .set({ status: "ACTIVE" })
    .where(eq(listings.id, listingId));

  revalidatePath("/admin/listings");
  return { success: true };
}

// Reject listing
export async function rejectListing(listingId: string) {
  await db
    .update(listings)
    .set({
      status: "REJECTED",
    })
    .where(eq(listings.id, listingId));

  revalidatePath("/admin/listings");
  return { success: true };
}

// Get all users (with pagination)
export async function getAllUsers(page = 1, limit = 20, search?: string) {
  let whereClause;
  if (search) {
    whereClause = or(
      ilike(users.name, `%${search}%`),
      ilike(users.email, `%${search}%`)
    );
  }

  const [data, countResult] = await Promise.all([
    db.query.users.findMany({
      where: whereClause,
      limit,
      offset: (page - 1) * limit,
      orderBy: [desc(users.createdAt)],
      columns: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        verificationStatus: true,
        createdAt: true,
      },
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const totalPages = Math.ceil(total / limit);

  return { data, total, totalPages, page };
}

// Ban/Unban user
export async function toggleUserBan(userId: string, isActive: boolean) {
  await db
    .update(users)
    .set({ isActive })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
  return { success: true };
}

// Get pending reports
export async function getPendingReports(limit = 20) {
  const data = await db.query.reports.findMany({
    where: eq(reports.status, "PENDING"),
    orderBy: [desc(reports.createdAt)],
    limit,
    with: {
      reporter: {
        columns: {
          id: true,
          name: true,
          email: true,
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

// Resolve report
export async function resolveReport(
  reportId: string,
  status: "RESOLVED" | "DISMISSED",
  resolution: string
) {
  await db
    .update(reports)
    .set({
      status,
      resolution,
      resolvedAt: new Date(),
    })
    .where(eq(reports.id, reportId));

  revalidatePath("/admin/reports");
  return { success: true };
}
