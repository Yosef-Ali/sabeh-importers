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
        <h1 className="text-3xl font-bold text-[#1a2d4a]">Reports</h1>
        <p className="text-gray-600 mt-1">
          {pendingReports.length} pending report{pendingReports.length !== 1 && "s"} to review
        </p>
      </div>

      {pendingReports.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf8f5] border border-[#FCDD09]/20">
            <Flag className="h-10 w-10 text-[#FCDD09]/60" />
          </div>
          <h3 className="text-xl font-bold text-[#1a2d4a] mb-2">All clear!</h3>
          <p className="text-gray-600 max-w-sm">No pending reports at the moment.</p>
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
