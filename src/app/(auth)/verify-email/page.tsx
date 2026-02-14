"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyEmailAction, resendVerificationEmailAction } from "@/lib/actions/auth";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error" | "resend">(
    token ? "verifying" : "resend"
  );
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    verifyEmailAction(token).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setStatus("success");
        setMessage(result.message);
      } else {
        setStatus("error");
        setMessage(result.error);
      }
    });
    return () => { cancelled = true; };
  }, [token]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setResendLoading(true);
    const result = await resendVerificationEmailAction(resendEmail);
    setResendLoading(false);
    if (result.success) setResendDone(true);
  }

  // ── Verifying ───────────────────────────────────────────────────────────────
  if (status === "verifying") {
    return (
      <Shell>
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <h1 className="text-xl font-display font-bold mt-4">Verifying your email…</h1>
        <p className="text-muted-foreground text-sm">Just a moment, please wait.</p>
      </Shell>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <Shell>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-xl font-display font-bold mt-4">Email verified!</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
        <Link href="/login">
          <Button className="mt-2 w-full">Sign in to your account</Button>
        </Link>
      </Shell>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <Shell>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-xl font-display font-bold mt-4">Verification failed</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
        <Button variant="outline" className="w-full mt-2" onClick={() => setStatus("resend")}>
          Resend verification email
        </Button>
        <Link href="/login">
          <Button variant="ghost" className="w-full">Back to sign in</Button>
        </Link>
      </Shell>
    );
  }

  // ── Resend form ─────────────────────────────────────────────────────────────
  return (
    <Shell>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
        <MailCheck className="h-8 w-8 text-amber-600" />
      </div>
      <h1 className="text-xl font-display font-bold mt-4">Verify your email</h1>

      {resendDone ? (
        <>
          <p className="text-muted-foreground text-sm">
            If that email is registered and unverified, a new link has been sent.
            Check your inbox (and spam folder).
          </p>
          <Link href="/login">
            <Button className="w-full mt-2">Back to sign in</Button>
          </Link>
        </>
      ) : (
        <>
          <p className="text-muted-foreground text-sm">
            Enter your email address and we&apos;ll send you a new verification link.
          </p>
          <form onSubmit={handleResend} className="w-full space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="resend-email">Email address</Label>
              <Input
                id="resend-email"
                type="email"
                placeholder="you@example.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={resendLoading}>
              {resendLoading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
                : "Send verification link"
              }
            </Button>
          </form>
          <Link href="/login">
            <Button variant="ghost" className="w-full">Back to sign in</Button>
          </Link>
        </>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm text-center space-y-3">
        <Link href="/" className="inline-block mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-navy">
            <span className="material-symbols-outlined text-gold text-2xl">anchor</span>
          </div>
        </Link>
        {children}
        <p className="pt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sabeh Authority
        </p>
      </div>
    </div>
  );
}
