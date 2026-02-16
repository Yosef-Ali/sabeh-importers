"use client";

import { useState } from "react";
import { reviewVerification } from "@/lib/actions/admin";
import { ShieldCheck, ShieldX, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface VerificationReviewCardProps {
  verification: any;
}

export function VerificationReviewCard({ verification }: VerificationReviewCardProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [notes, setNotes] = useState("");
  const [showDoc, setShowDoc] = useState(false);

  async function handleDecision(decision: "VERIFIED" | "REJECTED") {
    setLoading(true);
    try {
      await reviewVerification(verification.id, decision, "admin", notes || undefined);
      setDone(true);
      if (decision === "VERIFIED") {
        toast.success(`${verification.user?.name}'s verification has been approved.`);
      } else {
        toast.error(`${verification.user?.name}'s verification has been rejected.`);
      }
    } catch {
      toast.error("Failed to process verification. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-card border-2 border-green-200 bg-green-50 p-5 text-sm text-green-700 font-display font-medium">
        Verification decision recorded.
      </div>
    );
  }

  const docUrl = verification.documentUrl as string | null;
  const isImage = docUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(docUrl);

  return (
    <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-6 shadow-card space-y-5">
      {/* User info */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
          {verification.user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="font-display font-bold text-primary">{verification.user?.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{verification.user?.email} · {verification.user?.role}</p>
        </div>
        <span className="ml-auto text-xs font-mono uppercase text-muted-foreground bg-primary/5 border-2 border-primary/10 px-2 py-1 rounded-button">
          {verification.type.replace("_", " ")}
        </span>
      </div>

      {/* Document viewer — admin-only, toggle to show */}
      {docUrl ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Confidential Document</p>
            <button
              onClick={() => setShowDoc(!showDoc)}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
            >
              {showDoc ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showDoc ? "Hide" : "View Document"}
            </button>
          </div>
          {showDoc && (
            <div className="p-4">
              {isImage ? (
                <div className="relative aspect-[3/2] max-w-md rounded overflow-hidden">
                  <Image
                    src={docUrl}
                    alt="Verification document"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-button bg-primary text-primary-foreground px-4 py-2 text-sm font-display font-bold hover:bg-primary/90 transition-colors"
                >
                  Open Document
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground font-mono italic">No document uploaded.</p>
      )}

      {/* Submitted at */}
      <p className="text-xs text-muted-foreground font-mono">
        Submitted {new Date(verification.createdAt).toLocaleString()}
      </p>

      {/* Admin notes */}
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Admin notes (optional)…"
        className="w-full rounded-card border-2 border-primary/10 bg-white dark:bg-card text-foreground px-4 py-2.5 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      />

      {/* Decision buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleDecision("VERIFIED")}
          disabled={loading}
          className="flex items-center gap-2 rounded-button bg-green-600 text-white px-5 py-2 text-sm font-display font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          {loading ? "…" : "Approve"}
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
