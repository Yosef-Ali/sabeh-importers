"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
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
import { AuthShell } from "@/components/auth/auth-shell";
import { AlertBanner } from "@/components/ui/alert-banner";

// Hoisted out of render — recreating an 8-key map per render is pointless.
const ROLE_DESTINATION: Record<string, string> = {
  ADMIN: "/admin",
  MANAGER: "/admin",
  STAFF: "/admin",
  SELLER: "/dashboard",
  BUYER: "/",
  DISTRIBUTOR: "/dashboard",
};

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
    const destination = rawCallback || ROLE_DESTINATION[result.user.role] || "/dashboard";
    router.push(destination);
  };

  return (
    <AuthShell>
      <Card>
        <CardHeader className="text-center pb-4">
          <CardTitle className="font-display text-2xl uppercase tracking-tight">Sign In</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <AlertBanner label="Authentication Failed">{error}</AlertBanner>
            )}

            {emailNotVerified && (
              <AlertBanner tone="warning" icon={MailCheck} label="Verification Pending">
                <p className="leading-relaxed">
                  Check your inbox for the verification email we sent when you registered.
                </p>
                <Link
                  href="/verify-email"
                  className="inline-block font-mono text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 hover:no-underline mt-2"
                >
                  Resend verification email →
                </Link>
              </AlertBanner>
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
    </AuthShell>
  );
}
