"use server";

import { db } from "@/lib/db";
import { plans } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPlans() {
  const allPlans = await db.select().from(plans).orderBy(asc(plans.sortOrder), asc(plans.price));
  return allPlans as unknown as (typeof plans.$inferSelect & { features: string[] })[];
}

export async function getActivePlans() {
  const activePlans = await db
    .select()
    .from(plans)
    .where(eq(plans.isActive, true))
    .orderBy(asc(plans.sortOrder), asc(plans.price));
  return activePlans as unknown as (typeof plans.$inferSelect & { features: string[] })[];
}

export async function updatePlan(id: string, data: Partial<typeof plans.$inferInsert>) {
  await db.update(plans).set(data).where(eq(plans.id, id));
  revalidatePath("/admin/plans");
  revalidatePath("/pricing"); // Assuming a public pricing page exists
  return { success: true };
}

export async function createPlan(data: typeof plans.$inferInsert) {
  await db.insert(plans).values(data);
  revalidatePath("/admin/plans");
  revalidatePath("/pricing");
  return { success: true };
}

export async function deletePlan(id: string) {
  await db.update(plans).set({ isActive: false }).where(eq(plans.id, id));
  revalidatePath("/admin/plans");
  revalidatePath("/pricing");
  return { success: true };
}

export async function seedDefaultPlans() {
  const SEED_PLANS = [
    {
      name: "Free",
      nameAmharic: "ነጻ (FREE)",
      slug: "free",
      price: "0",
      currency: "ETB" as const,
      durationDays: 30,
      maxActiveListings: 1,
      canPromote: false,
      canFeature: false,
      sortOrder: 0,
      description: "For individuals starting out.",
      features: ["መደበኛ ፍለጋ", "ለ30 ቀናት የሚቆይ", "የባለሙያ ማረጋገጫ የለውም"],
    },
    {
      name: "Standard",
      nameAmharic: "መደበኛ",
      slug: "standard",
      price: "500",
      currency: "ETB" as const,
      durationDays: 60,
      maxActiveListings: 5,
      canPromote: true,
      canFeature: true,
      sortOrder: 1,
      description: "For serious sellers.",
      features: ["ቅድሚያ የሚሰጠው", "ለ60 ቀናት የሚቆይ", "የተረጋገጠ አቅራቢ (BADGE)"],
    },
    {
      name: "Premium",
      nameAmharic: "ፕሪሚያም",
      slug: "premium",
      price: "2000",
      currency: "ETB" as const,
      durationDays: 90,
      maxActiveListings: 100,
      canPromote: true,
      canFeature: true,
      sortOrder: 2,
      description: "For businesses and power sellers.",
      features: [
        "ሁሉም ጥቅማጥቅሞች",
        "ያልተገደበ ዝርዝር",
        "የመጀመሪያ ደረጃ ድጋፍ",
        "ወርቃማ ባጅ (GOLD BADGE)",
        "ያልተገደበ ጊዜ",
        "ከፊት ገጹ ላይ የሚቀመጥ",
        "የሎጂስቲክስ ድጋፍ",
        "ፕሮፌሽናል ፎቶግራፍ",
      ],
    },
  ];

  let created = 0;
  let updated = 0;

  for (const plan of SEED_PLANS) {
    const existing = await db.query.plans.findFirst({
      where: eq(plans.slug, plan.slug),
    });

    if (existing) {
      await db.update(plans).set(plan).where(eq(plans.slug, plan.slug));
      updated++;
    } else {
      await db.insert(plans).values(plan);
      created++;
    }
  }

  revalidatePath("/admin/plans");
  revalidatePath("/pricing");
  return { success: true, created, updated };
}
