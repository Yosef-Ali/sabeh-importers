import { getPendingVerifications } from "@/lib/actions/admin";
import { BadgeCheck, FileText, User } from "lucide-react";
import { VerificationReviewCard } from "@/components/admin/verification-review-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verifications | Admin",
};

/**
 * SECURITY NOTE:
 * documentUrl (government IDs, business licenses) is ONLY accessible via
 * this server-rendered admin page. It is never returned to the public API
 * or marketplace pages. The action `getPendingVerifications` is a "use server"
 * action gated to this admin route only.
 */
export default async function AdminVerificationsPage() {
  const verifications = await getPendingVerifications();

  const govIdVerifications = verifications.filter((v) => v.type === "government_id");
  const bizLicVerifications = verifications.filter((v) => v.type === "business_license");
  const otherVerifications = verifications.filter(
    (v) => v.type !== "government_id" && v.type !== "business_license"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Seller Verifications</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {verifications.length} pending verification{verifications.length !== 1 && "s"} — documents are admin-only
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

      {verifications.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center bg-white dark:bg-card rounded-card border-2 border-dashed border-primary/20 p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-accent/20">
            <BadgeCheck className="h-10 w-10 text-accent/60" />
          </div>
          <h3 className="text-xl font-display font-bold text-primary mb-2">All reviewed!</h3>
          <p className="text-muted-foreground font-mono text-sm max-w-sm">No pending verification documents.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {govIdVerifications.length > 0 && (
            <section>
              <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <User className="h-4 w-4" /> Government IDs ({govIdVerifications.length})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {govIdVerifications.map((v) => (
                  <VerificationReviewCard key={v.id} verification={v} />
                ))}
              </div>
            </section>
          )}

          {bizLicVerifications.length > 0 && (
            <section>
              <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Business Licenses ({bizLicVerifications.length})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {bizLicVerifications.map((v) => (
                  <VerificationReviewCard key={v.id} verification={v} />
                ))}
              </div>
            </section>
          )}

          {otherVerifications.length > 0 && (
            <section>
              <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Other ({otherVerifications.length})
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {otherVerifications.map((v) => (
                  <VerificationReviewCard key={v.id} verification={v} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
