"use server";

import { db } from "@/lib/db";
import { plans, subscriptions } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getPlans() {
  return db.query.plans.findMany({
    where: eq(plans.isActive, true),
    orderBy: (t, { asc }) => [asc(t.sortOrder)],
  });
}

export async function getUserActivePlan(userId: string) {
  const sub = await db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "ACTIVE")
    ),
    with: { plan: true },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return sub ?? null;
}

// Seed default plans (run once / idempotent)
export async function seedDefaultPlans() {
  const defaults = [
    {
      id: "plan_free",
      name: "Deckhand",
      nameAmharic: "ዴክሃንድ",
      slug: "free",
      price: "0",
      currency: "ETB" as const,
      durationDays: 30,
      maxActiveListings: 3,
      canPromote: false,
      canFeature: false,
      isActive: true,
      sortOrder: 0,
    },
    {
      id: "plan_pro",
      name: "Navigator",
      nameAmharic: "ናቪጌተር",
      slug: "pro",
      price: "299",
      currency: "ETB" as const,
      durationDays: 30,
      maxActiveListings: 20,
      canPromote: true,
      canFeature: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      id: "plan_business",
      name: "Captain",
      nameAmharic: "ካፒቴን",
      slug: "business",
      price: "799",
      currency: "ETB" as const,
      durationDays: 30,
      maxActiveListings: 100,
      canPromote: true,
      canFeature: true,
      isActive: true,
      sortOrder: 2,
    },
  ];

  for (const plan of defaults) {
    await db
      .insert(plans)
      .values(plan)
      .onConflictDoNothing();
  }

  return { success: true };
}
