"use server";

import { db } from "@/lib/db";
import { subscriptions, subscriptionPayments, plans } from "@/db/schema";
import { getSystemSettings } from "@/lib/actions/settings";
import { getCurrentUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function subscribeToPlan(planId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "You must be logged in to subscribe." };
  }

  const settings = await getSystemSettings();
  const plan = await db.query.plans.findFirst({
    where: eq(plans.id, planId),
  });

  if (!plan) {
    return { error: "Plan not found." };
  }

  // 1. FREE MODE or FREE PLAN Logic
  if (settings.isFreeSubscriptionMode || plan.price === "0" || parseFloat(plan.price) === 0) {
    // Create ACTIVE subscription immediately
    const [sub] = await db
      .insert(subscriptions)
      .values({
        userId: user.id,
        planId: plan.id,
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
      })
      .returning();

    // Record $0 "Payment" for audit trail
    // paymentMethodEnum: 'CASH', 'BANK_TRANSFER', ...
    // paymentStatusEnum: 'PENDING', 'COMPLETED', ...
    await db.insert(subscriptionPayments).values({
      subscriptionId: sub.id,
      amount: "0",
      currency: "ETB",
      status: "COMPLETED",
      method: "CASH", // Using CASH as a proxy for 'Free/System' to avoid enum migration
      reference: `SYSTEM_FREE_${Date.now()}_${user.id.substring(0, 4)}`,
      paidAt: new Date(),
    });

    revalidatePath("/dashboard");
    revalidatePath("/pricing");

    // Determine redirect
    return { success: true, redirectUrl: "/dashboard?subscribed=true" };
  }

  // 2. STANDARD PAYMENT FLOW (Future Implementation)
  return { error: "Online payments are not yet enabled. Watch this space!" };
}
