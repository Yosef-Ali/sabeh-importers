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

  if (done) {
    return (
      <div className={`rounded-card border-2 p-5 text-sm font-display font-medium ${
        done === "VERIFIED"
          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300"
          : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
      }`}>
        {seller.name} — {done === "VERIFIED" ? "Verified" : "Rejected"}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-6 shadow-card space-y-4">
      {/* Seller info */}
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm shrink-0">
          {seller.avatar ? (
            <img src={seller.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
          ) : (
            seller.name?.[0]?.toUpperCase() ?? "?"
          )}
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-primary truncate">{seller.name}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{seller.email}</span>
            {seller.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{seller.phone}</span>}
          </div>
        </div>
        <span className={`ml-auto text-xs font-mono uppercase px-2 py-1 rounded-button border-2 shrink-0 ${
          seller.verificationStatus === "PENDING"
            ? "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/50 dark:border-amber-800"
            : "text-muted-foreground bg-primary/5 border-primary/10"
        }`}>
          {seller.verificationStatus}
        </span>
      </div>

      {/* Business details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground font-mono">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{seller.companyName || "No company name"}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground font-mono">
          <FileText className="h-4 w-4 shrink-0" />
          <span className="truncate">{seller.businessLicense || "No license"}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground font-mono">
          <Hash className="h-4 w-4 shrink-0" />
          <span className="truncate">{seller.tinNumber || "No TIN"}</span>
        </div>
      </div>

      {/* Joined date */}
      <p className="text-xs text-muted-foreground font-mono">
        Joined {new Date(seller.createdAt).toLocaleDateString()}
      </p>

      {/* Decision buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleDecision("VERIFIED")}
          disabled={loading}
          className="flex items-center gap-2 rounded-button bg-green-600 text-white px-5 py-2 text-sm font-display font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          {loading ? "…" : "Verify Seller"}
        </button>
        <button
          onClick={() => handleDecision("REJECTED")}
          disabled={loading}
          className="flex items-center gap-2 rounded-button bg-red-50 text-red-600 border-2 border-red-200 px-5 py-2 text-sm font-display font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          <ShieldX className="h-4 w-4" />
          {loading ? "…" : "Reject"}
        </button>
      </div>
    </div>
  );
}
