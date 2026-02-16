import { getPlans } from "@/lib/actions/plans";
import { Plus, CreditCard } from "lucide-react";
import { PlansTable } from "@/components/admin/plans-table"; // We'll need a client component for the table + sheet state

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Subscription Plans | Admin",
};

export default async function AdminPlansPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Subscription Plans</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Manage pricing tiers and features for sellers.
          </p>
        </div>
      </div>

       <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 overflow-hidden shadow-card">
           <PlansTable initialPlans={plans} />
       </div>
    </div>
  );
}
