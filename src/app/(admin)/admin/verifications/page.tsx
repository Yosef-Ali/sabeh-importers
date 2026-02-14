import { getPendingVerifications } from "@/lib/actions/admin";
import { BadgeCheck, FileText, User } from "lucide-react";
import { VerificationReviewCard } from "@/components/admin/verification-review-card";

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
        <h1 className="text-3xl font-bold text-[#1a2d4a]">Seller Verifications</h1>
        <p className="text-gray-600 mt-1">
          {verifications.length} pending verification{verifications.length !== 1 && "s"} — documents are admin-only
        </p>
      </div>

      {/* Security notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <FileText className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-bold">Confidential Documents</p>
          <p className="mt-0.5 text-amber-700">
            Government IDs and business licenses are only visible here. They are never
            exposed to the public marketplace. Treat all documents as strictly confidential.
          </p>
        </div>
      </div>

      {verifications.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf8f5] border border-[#FCDD09]/20">
            <BadgeCheck className="h-10 w-10 text-[#FCDD09]/60" />
          </div>
          <h3 className="text-xl font-bold text-[#1a2d4a] mb-2">All reviewed!</h3>
          <p className="text-gray-600 max-w-sm">No pending verification documents.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {govIdVerifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
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
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
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
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
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
