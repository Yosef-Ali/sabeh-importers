"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordAction } from "@/lib/actions/auth";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // No token in URL
  if (!token) {
    return (
      <Shell>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-xl font-display font-bold mt-4">Invalid reset link</h1>
        <p className="text-muted-foreground text-sm">
          This link is missing a reset token. Please request a new one.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full mt-2">Request new link</Button>
        </Link>
      </Shell>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    const result = await resetPasswordAction(token, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <Shell>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-xl font-display font-bold mt-4">Password updated</h1>
        <p className="text-muted-foreground text-sm">
          Your password has been changed. You can now sign in with your new password.
        </p>
        <Button className="w-full mt-2" onClick={() => router.push("/login")}>
          Sign in
        </Button>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-navy shadow-hard-navy">
              <span className="material-symbols-outlined text-gold text-3xl">anchor</span>
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Sabeh Authority
          </h1>
          <p className="text-muted-foreground font-amharic text-sm mt-0.5">ሳቤህ ኢምፖርተርስ</p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-display text-xl">Choose a new password</CardTitle>
            <CardDescription>Must be at least 8 characters long.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating…</>
                  : "Update password"
                }
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sabeh Authority. All rights reserved.
        </p>
      </div>
    </div>
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
