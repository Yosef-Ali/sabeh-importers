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
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [notes,    setNotes]    = useState("");
  const [showDoc,  setShowDoc]  = useState(false);

  async function handleDecision(decision: "VERIFIED" | "REJECTED") {
    setLoading(true);
    try {
      await reviewVerification(
        verification.id,
        decision,
        "admin",
        notes || undefined
      );
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

  // Decision result — rounded-none (was rounded-none)
  if (done) {
    return (
      <div className="rounded-none border border-green-200 bg-green-50 p-5 font-mono text-xs font-bold uppercase tracking-widest text-green-700">
        Verification decision recorded.
      </div>
    );
  }

  const docUrl  = verification.documentUrl as string | null;
  const isImage = docUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(docUrl);

  return (
    // Card: rounded-none shadow-hard (was rounded-none shadow-card)
    <div className="bg-white dark:bg-card rounded-none border border-border p-6 shadow-hard space-y-5">

      {/* ── User info ── */}
      <div className="flex items-center gap-4">
        {/* Avatar: rounded-none border-gold (was rounded-full) */}
        <div className="h-10 w-10 rounded-none bg-[#0A192F] border border-accent/50 flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
          {verification.user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="font-display font-bold uppercase tracking-tight text-primary">
            {verification.user?.name}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            {verification.user?.email} · {verification.user?.role}
          </p>
        </div>
        {/* Type badge: rounded-none (was rounded-none) */}
        <span className="ml-auto font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-primary/5 border border-border px-2 py-1 rounded-none">
          {verification.type.replace("_", " ")}
        </span>
      </div>

      {/* ── Document viewer ── */}
      {docUrl ? (
        // Doc box: rounded-none shadow-hard-yellow (was rounded-lg)
        <div className="rounded-none border border-[#FFD700] bg-amber-50 overflow-hidden" style={{ boxShadow: "4px 4px 0px #FFD700" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#FFD700]/50">
            <p className="font-mono text-[9px] font-bold text-amber-800 uppercase tracking-widest">
              Confidential Document
            </p>
            <button
              onClick={() => setShowDoc(!showDoc)}
              className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-amber-700 hover:text-amber-900 uppercase tracking-widest transition-colors"
            >
              {showDoc ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showDoc ? "Hide" : "View Document"}
            </button>
          </div>
          {showDoc && (
            <div className="p-4">
              {isImage ? (
                // Image viewer: rounded-none (was rounded)
                <div className="relative aspect-[3/2] max-w-md rounded-none overflow-hidden">
                  <Image
                    src={docUrl}
                    alt="Verification document"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                // Open doc button: rounded-none (was rounded-none)
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-none bg-[#0A192F] text-white px-4 py-2 font-display text-xs font-bold uppercase tracking-wider hover:bg-[#0A192F]/90 transition-colors"
                >
                  Open Document
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest italic">
          No document uploaded.
        </p>
      )}

      {/* ── Submitted at ── */}
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
        Submitted {new Date(verification.createdAt).toLocaleString()}
      </p>

      {/* ── Admin notes input — rounded-none focus shadow-hard (was rounded-none rounded-8px) ── */}
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Admin notes (optional)…"
        className="w-full rounded-none border border-border bg-white dark:bg-card text-foreground px-4 py-2.5 font-mono text-xs uppercase tracking-widest placeholder:text-muted-foreground placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-foreground focus:shadow-hard transition-all duration-150"
        style={{ boxShadow: "none" }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = "4px 4px 0px #0A192F"; }}
        onBlur={(e)  => { e.currentTarget.style.boxShadow = "none"; }}
      />

      {/* ── Decision buttons — rounded-none throughout ── */}
      <div className="flex gap-3">
        <button
          onClick={() => handleDecision("VERIFIED")}
          disabled={loading}
          className="flex items-center gap-2 rounded-none bg-green-600 text-white px-5 py-2 font-display text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#14532d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          {loading ? "…" : "Approve"}
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
