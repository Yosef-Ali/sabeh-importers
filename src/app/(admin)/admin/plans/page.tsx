import { getPlans } from "@/lib/actions/plans";
import { PlansTable } from "@/components/admin/plans-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Subscription Plans | Admin",
};

export default async function AdminPlansPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">
          Subscription Plans
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage pricing tiers and features for sellers.
        </p>
      </div>

      <PlansTable initialPlans={plans} />
    </div>
  );
}
