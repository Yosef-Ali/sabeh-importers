"use server";

import { db } from "@/lib/db";
import { verificationMethods, userVerifications, users } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ─── ADMIN ACTIONS ──────────────────────────────────────────────

export async function getVerificationMethods() {
  const methods = await db.query.verificationMethods.findMany({
    orderBy: [desc(verificationMethods.createdAt)],
  });
  return methods;
}

export async function createVerificationMethod(data: {
  name: string;
  description?: string;
  isRequired: boolean;
}) {
  await db.insert(verificationMethods).values({
    name: data.name,
    description: data.description,
    isRequired: data.isRequired,
    isActive: true,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateVerificationMethod(
  id: string,
  data: {
    name?: string;
    description?: string;
    isRequired?: boolean;
    isActive?: boolean;
  }
) {
  await db
    .update(verificationMethods)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(verificationMethods.id, id));

  revalidatePath("/admin/settings");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function deleteVerificationMethod(id: string) {
  await db.delete(verificationMethods).where(eq(verificationMethods.id, id));
  revalidatePath("/admin/settings");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

// ─── USER ACTIONS ──────────────────────────────────────────────

export async function getUserVerifications(userId: string) {
  return await db.query.userVerifications.findMany({
    where: eq(userVerifications.userId, userId),
    with: {
      method: true,
    },
  });
}

export async function submitVerificationDocument(data: {
  userId: string;
  methodId: string;
  documentUrl: string;
}) {
  // Check if a pending verification already exists for this method
  const existing = await db.query.userVerifications.findFirst({
    where: and(
      eq(userVerifications.userId, data.userId),
      eq(userVerifications.methodId, data.methodId),
      eq(userVerifications.status, "PENDING")
    ),
  });

  if (existing) {
    // Update existing pending request
    await db
      .update(userVerifications)
      .set({
        documentUrl: data.documentUrl,
        updatedAt: new Date(),
      })
      .where(eq(userVerifications.id, existing.id));
  } else {
    // Create new request
    await db.insert(userVerifications).values({
      userId: data.userId,
      type: "document", // Generic type, specific method linked via methodId
      methodId: data.methodId,
      documentUrl: data.documentUrl,
      status: "PENDING",
    });
  }

  // Update user verification status to PENDING if they were UNVERIFIED
  await db
    .update(users)
    .set({ verificationStatus: "PENDING" })
    .where(
      and(
        eq(users.id, data.userId),
        eq(users.verificationStatus, "UNVERIFIED")
      )
    );

  revalidatePath("/dashboard/settings");
  revalidatePath("/admin/verifications");
  return { success: true };
}
