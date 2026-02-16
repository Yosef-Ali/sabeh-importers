import { getPlans } from "@/lib/actions/plans";
import { PlansTable } from "@/components/admin/plans-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Subscription Plans | Admin",
};

export default async function AdminPlansPage() {
  const plans = await getPlans();

  return (
    <PlansTable initialPlans={plans} />
  );
}
