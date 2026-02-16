import { getPendingVerifications, getUnverifiedSellers } from "@/lib/actions/admin";
import { BadgeCheck, FileText, Users } from "lucide-react";
import { VerificationReviewCard } from "@/components/admin/verification-review-card";
import { SellerVerifyCard } from "@/components/admin/seller-verify-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verifications | Admin",
};

export default async function AdminVerificationsPage() {
  const [verifications, unverifiedSellers] = await Promise.all([
    getPendingVerifications(),
    getUnverifiedSellers(),
  ]);

  const totalPending = verifications.length + unverifiedSellers.length;

  // Group document verifications by type
  const groupedVerifications = verifications.reduce((acc, v) => {
    const key = v.type === "government_id" ? "Government ID" : v.type === "business_license" ? "Business License" : v.type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(v);
    return acc;
  }, {} as Record<string, typeof verifications>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Seller Verifications</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {totalPending} pending item{totalPending !== 1 && "s"} — documents are admin-only
        </p>
      </div>

      {/* Security notice */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-4 flex items-start gap-3">
        <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <p className="font-bold">Confidential Documents</p>
          <p className="mt-0.5 text-amber-700 dark:text-amber-300">
            Government IDs and business licenses are only visible here. They are never
            exposed to the public marketplace. Treat all documents as strictly confidential.
          </p>
        </div>
      </div>

      {/* Unverified Sellers Section */}
      {unverifiedSellers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Users className="h-4 w-4" /> Unverified Sellers ({unverifiedSellers.length})
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {unverifiedSellers.map((seller) => (
              <SellerVerifyCard key={seller.id} seller={seller} />
            ))}
          </div>
        </section>
      )}

      {/* Document Verifications Section */}
      {verifications.length > 0 && (
        <div className="space-y-8">
          {Object.entries(groupedVerifications).map(([type, items]) => (
            <section key={type}>
              <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" /> {type} ({items.length})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {items.map((v) => (
                  <VerificationReviewCard key={v.id} verification={v} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Empty state */}
      {totalPending === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center bg-white dark:bg-card rounded-card border-2 border-dashed border-primary/20 p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-accent/20">
            <BadgeCheck className="h-10 w-10 text-accent/60" />
          </div>
          <h3 className="text-xl font-display font-bold text-primary mb-2">All reviewed!</h3>
          <p className="text-muted-foreground font-mono text-sm max-w-sm">No pending verifications or unverified sellers.</p>
        </div>
      )}
    </div>
  );
}
