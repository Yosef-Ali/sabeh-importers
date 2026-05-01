"use client";

import { useState } from "react";
import { verifySellerDirect } from "@/lib/actions/admin";
import { ShieldCheck, ShieldX, Building2, Phone, Mail, FileText, Hash } from "lucide-react";
import { toast } from "sonner";

interface SellerVerifyCardProps {
  seller: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    companyName: string | null;
    businessLicense: string | null;
    tinNumber: string | null;
    verificationStatus: string;
    createdAt: Date;
  };
}

export function SellerVerifyCard({ seller }: SellerVerifyCardProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"VERIFIED" | "REJECTED" | null>(null);

  async function handleDecision(decision: "VERIFIED" | "REJECTED") {
    setLoading(true);
    try {
      await verifySellerDirect(seller.id, decision);
      setDone(decision);
      if (decision === "VERIFIED") {
        toast.success(`${seller.name} has been verified successfully.`);
      } else {
        toast.error(`${seller.name} has been rejected.`);
      }
    } catch {
      toast.error("Failed to update seller verification. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Decision result state — rounded-none (was rounded-none)
  if (done) {
    return (
      <div
        className={`rounded-none border p-5 font-mono text-xs font-bold uppercase tracking-widest ${
          done === "VERIFIED"
            ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300"
            : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
        }`}
      >
        {seller.name} — {done === "VERIFIED" ? "Verified" : "Rejected"}
      </div>
    );
  }

  return (
    // Card: rounded-none shadow-hard (was rounded-none shadow-card)
    <div className="bg-white dark:bg-card rounded-none border border-border p-6 shadow-hard space-y-4">

      {/* ── Seller info ── */}
      <div className="flex items-center gap-4">
        {/* Avatar: rounded-none border-gold (was rounded-full) */}
        <div className="h-11 w-11 rounded-none bg-[#0A192F] border border-accent/50 flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0 overflow-hidden">
          {seller.avatar ? (
            <img
              src={seller.avatar}
              alt=""
              className="h-11 w-11 object-cover"
            />
          ) : (
            seller.name?.[0]?.toUpperCase() ?? "?"
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display font-bold uppercase tracking-tight text-primary truncate">
            {seller.name}
          </p>
          <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex-wrap">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {seller.email}
            </span>
            {seller.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {seller.phone}
              </span>
            )}
          </div>
        </div>

        {/* Status badge: rounded-none (was rounded-none) */}
        <span
          className={`ml-auto font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-none border flex-shrink-0 ${
            seller.verificationStatus === "PENDING"
              ? "text-amber-700 bg-amber-50 border-amber-300 dark:text-amber-300 dark:bg-amber-950/50 dark:border-amber-800"
              : "text-muted-foreground bg-primary/5 border-border"
          }`}
        >
          {seller.verificationStatus}
        </span>
      </div>

      {/* ── Business details ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          <Building2 className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{seller.companyName || "No company name"}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          <FileText className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{seller.businessLicense || "No license"}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          <Hash className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{seller.tinNumber || "No TIN"}</span>
        </div>
      </div>

      {/* ── Joined date ── */}
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
        Joined {new Date(seller.createdAt).toLocaleDateString()}
      </p>

      {/* ── Decision buttons — rounded-none throughout ── */}
      <div className="flex gap-3">
        <button
          onClick={() => handleDecision("VERIFIED")}
          disabled={loading}
          className="flex items-center gap-2 rounded-none bg-green-600 text-white px-5 py-2 font-display text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#14532d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          {loading ? "…" : "Verify Seller"}
        </button>
        <button
          onClick={() => handleDecision("REJECTED")}
          disabled={loading}
          className="flex items-center gap-2 rounded-none bg-transparent text-destructive border border-destructive px-5 py-2 font-display text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <ShieldX className="h-4 w-4" />
          {loading ? "…" : "Reject"}
        </button>
      </div>
    </div>
  );
}
