import { NextResponse } from "next/server";
import { seedDefaultPlans } from "@/lib/actions/plans";
import { getSession } from "@/lib/session";

// GET /api/admin/seed-plans  — run once to insert default plans
// Protected: ADMIN only
export async function GET() {
  // Inline session check (can't use middleware in Route Handlers)
  const session = getSession();
  if (!session || !["ADMIN", "MANAGER"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await seedDefaultPlans();
  return NextResponse.json(result);
}
