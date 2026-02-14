"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, MailCheck, Store, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { registerAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

type Role = "SELLER" | "BUYER";

function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("SELLER");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  function set(key: keyof typeof formData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((p) => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await registerAction(formData.name, formData.email, formData.password, role);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setDone(true);
    setIsLoading(false);
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <MailCheck className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-display font-bold">Check your inbox</h1>
          <p className="text-muted-foreground text-sm">
            We sent a verification link to{" "}
            <span className="font-semibold text-foreground">{formData.email}</span>.
            Click it to activate your account, then sign in.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder. The link expires in 24 hours.
          </p>
          <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  // ── Step 1: Role selection ────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md">
          <LogoBlock />
          <Card className="border-border shadow-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-display text-xl">Create your account</CardTitle>
              <CardDescription>How will you be using Sabeh?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <RoleCard
                selected={role === "SELLER"}
                onClick={() => setRole("SELLER")}
                icon={<Store className="h-6 w-6" />}
                title="I'm a Seller"
                description="List products, manage inventory, and receive orders from buyers."
              />
              <RoleCard
                selected={role === "BUYER"}
                onClick={() => setRole("BUYER")}
                icon={<ShoppingBag className="h-6 w-6" />}
                title="I'm a Buyer"
                description="Browse listings, contact sellers, and save your favourite items."
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button className="w-full" onClick={() => setStep(2)}>
                Continue as {role === "SELLER" ? "Seller" : "Buyer"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-foreground font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
          <Footer />
        </div>
      </div>
    );
  }

  // ── Step 2: Details form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <LogoBlock />
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <div>
                <CardTitle className="font-display text-xl">Your details</CardTitle>
                <CardDescription>
                  Registering as a{" "}
                  <span className="font-semibold text-foreground capitalize">
                    {role.toLowerCase()}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Abebe Girma"
                  value={formData.name}
                  onChange={set("name")}
                  required
                  autoComplete="name"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={set("email")}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={set("password")}
                    required
                    autoComplete="new-password"
                    minLength={8}
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
                <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-2">
            <p className="text-center text-xs text-muted-foreground w-full">
              By creating an account you agree to our{" "}
              <Link href="/guide" className="underline hover:no-underline">Terms of Use</Link>.
            </p>
          </CardFooter>
        </Card>
        <Footer />
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function LogoBlock() {
  return (
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
  );
}

function Footer() {
  return (
    <p className="mt-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Sabeh Authority. All rights reserved.
    </p>
  );
}

interface RoleCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function RoleCard({ selected, onClick, icon, title, description }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-start gap-4 rounded-lg border-2 p-4 transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/50 hover:bg-muted/40"
      )}
    >
      <div className={cn(
        "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
      <div>
        <p className={cn("font-semibold text-sm", selected && "text-primary")}>{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className={cn(
        "ml-auto mt-1 flex-shrink-0 h-4 w-4 rounded-full border-2 transition-all",
        selected ? "border-primary bg-primary" : "border-muted-foreground/30"
      )} />
    </button>
  );
}
