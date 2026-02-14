"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAction } from "@/lib/actions/auth";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");
  // Role-based default destinations — only used when there's no explicit callbackUrl
  const roleDestination: Record<string, string> = {
    ADMIN: "/admin", MANAGER: "/admin", STAFF: "/admin",
    SELLER: "/dashboard", BUYER: "/", DISTRIBUTOR: "/dashboard",
  };
  const setUser = useAuthStore((s) => s.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEmailNotVerified(false);

    const result = await loginAction(formData.email, formData.password);

    if (!result.success) {
      if (result.error === "EMAIL_NOT_VERIFIED") {
        setEmailNotVerified(true);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
      return;
    }

    // Persist user in Zustand (localStorage) so client components can read it
    setUser({
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      avatar: result.user.avatar ?? undefined,
      verificationStatus: result.user.verificationStatus,
    });

    // Flush the Next.js router cache so server components pick up the new
    // session cookie before we navigate — avoids the stale-cache redirect loop.
    router.refresh();
    const destination = rawCallback || roleDestination[result.user.role] || "/dashboard";
    router.push(destination);
  };

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
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-display text-xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {emailNotVerified && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-400">
                    <MailCheck className="h-4 w-4 flex-shrink-0" />
                    Email not yet verified
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed">
                    Check your inbox for the verification email we sent when you registered.
                  </p>
                  <Link
                    href={`/verify-email`}
                    className="inline-block text-xs font-bold text-amber-800 dark:text-amber-400 underline hover:no-underline"
                  >
                    Resend verification email →
                  </Link>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    autoComplete="current-password"
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-2">
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-foreground font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sabeh Authority. All rights reserved.
        </p>
      </div>
    </div>
  );
}
