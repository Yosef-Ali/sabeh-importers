import { getPendingReports } from "@/lib/actions/admin";

export const dynamic = 'force-dynamic';
import { ReportCard } from "@/components/admin/report-card";
import { Flag } from "lucide-react";

export const metadata = {
  title: "Reports | Admin",
};

export default async function AdminReportsPage() {
  const pendingReports = await getPendingReports(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Reports</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {pendingReports.length} pending report{pendingReports.length !== 1 && "s"} to review
        </p>
      </div>

      {pendingReports.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center bg-white dark:bg-card rounded-card border-2 border-dashed border-primary/20 p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-accent/20">
            <Flag className="h-10 w-10 text-accent/60" />
          </div>
          <h3 className="text-xl font-display font-bold text-primary mb-2">All clear!</h3>
          <p className="text-muted-foreground font-mono text-sm max-w-sm">No pending reports at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
