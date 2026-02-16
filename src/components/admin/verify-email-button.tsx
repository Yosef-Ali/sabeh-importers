"use client";

import { useState } from "react";
import { verifyUserEmail } from "@/lib/actions/admin";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

interface VerifyEmailButtonProps {
  userId: string;
  isEmailVerified: boolean;
  userName: string;
}

export function VerifyEmailButton({ userId, isEmailVerified, userName }: VerifyEmailButtonProps) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(isEmailVerified);

  if (verified) {
    return (
      <span className="flex items-center gap-1 text-xs text-green-600 font-bold">
        <MailCheck className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }

  async function handleVerify() {
    const confirmed = window.confirm(`Verify email for ${userName}? They will be able to log in.`);
    if (!confirmed) return;
    setLoading(true);
    try {
      await verifyUserEmail(userId);
      setVerified(true);
      toast.success(`Email verified for ${userName}.`);
    } catch {
      toast.error("Failed to verify email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleVerify}
      disabled={loading}
      className="rounded px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-50"
    >
      {loading ? "…" : "Verify Email"}
    </button>
  );
}
