"use client";

import { useState } from "react";
import { reviewVerification } from "@/lib/actions/admin";
import { ShieldCheck, ShieldX, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface VerificationReviewCardProps {
  verification: any;
}

export function VerificationReviewCard({ verification }: VerificationReviewCardProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [notes, setNotes] = useState("");
  const [showDoc, setShowDoc] = useState(false);

  async function handleDecision(decision: "VERIFIED" | "REJECTED") {
    const confirmed = window.confirm(
      decision === "VERIFIED"
        ? `Approve verification for ${verification.user?.name}?`
        : `Reject verification for ${verification.user?.name}?`
    );
    if (!confirmed) return;
    setLoading(true);
    // ADMIN_ID placeholder — in production, read from session
    await reviewVerification(verification.id, decision, "admin", notes || undefined);
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-green-100 bg-green-50 p-5 text-sm text-green-700 font-medium">
        Verification decision recorded.
      </div>
    );
  }

  const docUrl = verification.documentUrl as string | null;
  const isImage = docUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(docUrl);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
      {/* User info */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-[#1a2d4a] flex items-center justify-center text-white font-bold text-sm">
          {verification.user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="font-bold text-[#1a2d4a]">{verification.user?.name}</p>
          <p className="text-xs text-gray-500">{verification.user?.email} · {verification.user?.role}</p>
        </div>
        <span className="ml-auto text-xs font-mono uppercase text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded">
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
                  className="inline-flex items-center gap-2 rounded bg-[#1a2d4a] text-white px-4 py-2 text-sm font-bold hover:bg-[#2d4a6f] transition-colors"
                >
                  Open Document
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">No document uploaded.</p>
      )}

      {/* Submitted at */}
      <p className="text-xs text-gray-400">
        Submitted {new Date(verification.createdAt).toLocaleString()}
      </p>

      {/* Admin notes */}
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Admin notes (optional)…"
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCDD09]"
      />

      {/* Decision buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleDecision("VERIFIED")}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-green-600 text-white px-5 py-2 text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          {loading ? "…" : "Approve"}
        </button>
        <button
          onClick={() => handleDecision("REJECTED")}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-red-50 text-red-600 border border-red-200 px-5 py-2 text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          <ShieldX className="h-4 w-4" />
          {loading ? "…" : "Reject"}
        </button>
      </div>
    </div>
  );
}
