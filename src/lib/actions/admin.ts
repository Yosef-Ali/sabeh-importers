"use server";

import { db } from "@/lib/db";
import { listings, users, reports, userVerifications, emailVerifications } from "@/db/schema";
import { desc, eq, sql, or, ilike, and, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

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
        avatar: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
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

// ─────────────────────────────────────────
// VERIFICATION MANAGEMENT (ADMIN ONLY)
// documentUrl is only returned by this server action — never exposed publicly
// ─────────────────────────────────────────

export async function getPendingVerifications() {
  const data = await db.query.userVerifications.findMany({
    where: eq(userVerifications.status, "PENDING"),
    orderBy: [desc(userVerifications.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });
  return data;
}

export async function getAllVerifications(userId?: string) {
  const data = await db.query.userVerifications.findMany({
    where: userId ? eq(userVerifications.userId, userId) : undefined,
    orderBy: [desc(userVerifications.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
  return data;
}

export async function reviewVerification(
  verificationId: string,
  decision: "VERIFIED" | "REJECTED",
  adminId: string,
  notes?: string
) {
  await db
    .update(userVerifications)
    .set({
      status: decision,
      verifiedAt: decision === "VERIFIED" ? new Date() : null,
      reviewedBy: adminId,
      notes: notes ?? null,
    })
    .where(eq(userVerifications.id, verificationId));

  // If all verifications for this user are VERIFIED, update user.verificationStatus
  if (decision === "VERIFIED") {
    const verification = await db.query.userVerifications.findFirst({
      where: eq(userVerifications.id, verificationId),
    });
    if (verification) {
      await db
        .update(users)
        .set({ verificationStatus: "VERIFIED" })
        .where(eq(users.id, verification.userId));
    }
  }

  revalidatePath("/admin/verifications");
  return { success: true };
}

// ─────────────────────────────────────────
// PROMOTION / FEATURED MANAGEMENT
// ─────────────────────────────────────────

export async function getPromotedListings(limit = 50) {
  const data = await db.query.listings.findMany({
    where: or(
      eq(listings.isPromoted, true),
      eq(listings.isFeatured, true)
    ),
    orderBy: [desc(listings.createdAt)],
    limit,
    with: {
      seller: {
        columns: { id: true, name: true, email: true },
      },
      category: {
        columns: { name: true },
      },
    },
  });
  return data;
}

export async function setListingPromotion(
  listingId: string,
  opts: {
    isPromoted?: boolean;
    isFeatured?: boolean;
    promotedUntil?: Date | null;
  }
) {
  await db
    .update(listings)
    .set({
      isPromoted: opts.isPromoted ?? false,
      isFeatured: opts.isFeatured ?? false,
      promotedUntil: opts.promotedUntil ?? null,
    })
    .where(eq(listings.id, listingId));

  revalidatePath("/admin/promotions");
  revalidatePath("/");
  return { success: true };
}

export async function getPromotionStats() {
  const [promoted] = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(eq(listings.isPromoted, true));

  const [featured] = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(eq(listings.isFeatured, true));

  const [expiringSoon] = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(
      and(
        eq(listings.isPromoted, true),
        isNotNull(listings.promotedUntil)
      )
    );

  return {
    promoted: Number(promoted?.count ?? 0),
    featured: Number(featured?.count ?? 0),
    expiringSoon: Number(expiringSoon?.count ?? 0),
  };
}

// Manually verify a user's email (admin action)
export async function verifyUserEmail(userId: string) {
  await db
    .update(users)
    .set({ isEmailVerified: true })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
  return { success: true };
}

// Update user role (e.g. promote BUYER → SELLER)
export async function updateUserRole(userId: string, role: "ADMIN" | "MANAGER" | "STAFF" | "SELLER" | "BUYER" | "DISTRIBUTOR") {
  await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
  return { success: true };
}

// ── Invite / create a new user (admin only) ───────────────────────────────────
export type InviteUserResult =
  | { success: true; userId: string; verifyLink: string }
  | { success: false; error: string };

export async function inviteUser(
  name: string,
  email: string,
  role: "SELLER" | "BUYER" | "STAFF" | "MANAGER" | "DISTRIBUTOR" = "SELLER"
): Promise<InviteUserResult> {
  const emailLower = email.toLowerCase().trim();

  const existing = await db.query.users.findFirst({ where: eq(users.email, emailLower) });
  if (existing) return { success: false, error: "A user with this email already exists." };

  // Create with a random temporary password — user must set their own via reset link
  const tempPassword = await bcrypt.hash(crypto.randomUUID(), 10);
  const userId = crypto.randomUUID();

  await db.insert(users).values({
    id: userId,
    name: name.trim(),
    email: emailLower,
    password: tempPassword,
    role,
    isActive: true,
    isEmailVerified: false,
    verificationStatus: "UNVERIFIED",
  });

  // Issue a verification token (also serves as their first-login setup link)
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days for invite

  await db.insert(emailVerifications).values({ userId, token, expiresAt });

  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}`;

  revalidatePath("/admin/users");
  return { success: true, userId, verifyLink };
}
