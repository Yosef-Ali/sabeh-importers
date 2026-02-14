"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordAction } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await forgotPasswordAction(email);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
          {done ? (
            <>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-3">
                  <MailCheck className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="font-display text-xl">Check your inbox</CardTitle>
                <CardDescription>
                  If <span className="font-semibold text-foreground">{email}</span> is registered,
                  a password reset link has been sent. It expires in 1 hour.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground text-center mb-4">
                  Didn&apos;t receive it? Check your spam folder.
                </p>
                <Link href="/login">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to sign in
                  </Button>
                </Link>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="font-display text-xl">Forgot your password?</CardTitle>
                <CardDescription>
                  Enter your email and we&apos;ll send you a reset link.
                </CardDescription>
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
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      autoComplete="email"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
                      : "Send reset link"
                    }
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground gap-1 inline-flex items-center">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sabeh Authority. All rights reserved.
        </p>
      </div>
    </div>
  );
}
