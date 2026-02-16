"use server";

import { db } from "@/lib/db";
import { systemSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get system settings (singleton row 'default')
export async function getSystemSettings() {
  const existing = await db.query.systemSettings.findFirst({
    where: eq(systemSettings.id, "default"),
  });

  if (!existing) {
    // Return defaults if not yet initialized
    return {
      id: "default",
      isFreeSubscriptionMode: false,
    };
  }

  return existing;
}

// Toggle free subscription mode
export async function toggleFreeSubscriptionMode(enabled: boolean) {
  // Upsert 'default' row
  await db
    .insert(systemSettings)
    .values({
      id: "default",
      isFreeSubscriptionMode: enabled,
    })
    .onConflictDoUpdate({
      target: systemSettings.id,
      set: {
        isFreeSubscriptionMode: enabled,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/admin/settings");
  revalidatePath("/pricing");
  revalidatePath("/");

  return { success: true };
}
