"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Phone, MapPin, FileText, CheckCircle2,
  ChevronRight, Loader2, Store, Zap, Building2, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { updateProfile } from "@/lib/actions/users";

// ── Step definitions ─────────────────────────────────────────────────────────
const BUYER_STEPS = [
  { id: 1, label: "Profile",   icon: User },
  { id: 2, label: "Plan",      icon: Zap },
  { id: 3, label: "Verify",    icon: FileText },
];

const SELLER_STEPS = [
  { id: 1, label: "Profile",   icon: User },
  { id: 2, label: "Company",   icon: Building2 },
  { id: 3, label: "Plan",      icon: Zap },
  { id: 4, label: "Verify",    icon: FileText },
];

const PLANS = [
  {
    slug: "free",
    name: "Deckhand",
    nameAm: "ዴክሃንድ",
    price: "Free",
    listings: 3,
    promote: false,
    description: "Get started — list up to 3 items at no cost.",
    icon: Store,
    highlight: false,
  },
  {
    slug: "pro",
    name: "Navigator",
    nameAm: "ናቪጌተር",
    price: "ETB 299 / mo",
    listings: 20,
    promote: true,
    description: "For active sellers — more listings and promoted slots.",
    icon: Zap,
    highlight: true,
  },
  {
    slug: "business",
    name: "Captain",
    nameAm: "ካፒቴን",
    price: "ETB 799 / mo",
    listings: 100,
    promote: true,
    description: "Full B2B suite — unlimited reach and featured placement.",
    icon: Building2,
    highlight: false,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const isSeller = user?.role === "SELLER";
  const STEPS = isSeller ? SELLER_STEPS : BUYER_STEPS;

  // Step 1 data
  const [profile, setProfile] = useState({
    phone: "",
    bio: "",
    city: "",
  });

  // Company data (seller only)
  const [company, setCompanyState] = useState({
    companyName: "",
    companyNameAmharic: "",
    businessLicense: "",
    tinNumber: "",
    website: "",
    companyDescription: "",
  });

  // Step: Plan data
  const [selectedPlan, setSelectedPlan] = useState("free");

  function setP(key: keyof typeof profile) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setProfile((p) => ({ ...p, [key]: e.target.value }));
  }

  function setC(key: keyof typeof company) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCompanyState((p) => ({ ...p, [key]: e.target.value }));
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    await updateProfile(user.id, {
      phone: profile.phone || undefined,
      bio: profile.bio || undefined,
      city: profile.city || undefined,
    });
    setSaving(false);
    setStep(2);
  }

  async function saveCompany() {
    if (!user) return;
    setSaving(true);
    await updateProfile(user.id, {
      companyName: company.companyName || undefined,
      companyNameAmharic: company.companyNameAmharic || undefined,
      businessLicense: company.businessLicense || undefined,
      tinNumber: company.tinNumber || undefined,
      website: company.website || undefined,
      companyDescription: company.companyDescription || undefined,
    });
    setSaving(false);
    setStep(3);
  }

  // For sellers: plan=step3, verify=step4; for buyers: plan=step2, verify=step3
  const planStep = isSeller ? 3 : 2;
  const verifyStep = isSeller ? 4 : 3;

  function goToDashboard() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-2xl space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold tracking-tight">
            Welcome to Sabeh, {user?.name?.split(" ")[0] ?? "Seller"}!
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Let&apos;s get your account set up in 3 quick steps.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    done  ? "bg-primary border-primary text-primary-foreground"
                         : active ? "border-primary bg-primary/10 text-primary"
                                  : "border-muted-foreground/30 text-muted-foreground"
                  )}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                  )}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "h-0.5 w-16 mb-5 mx-1 transition-all",
                    step > s.id ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Step 1: Profile ─────────────────────────────────── */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Complete your profile
              </CardTitle>
              <CardDescription>
                Help buyers trust you — a complete profile gets more enquiries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Phone number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+251 91 234 5678"
                    value={profile.phone}
                    onChange={setP("phone")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Addis Ababa"
                    value={profile.city}
                    onChange={setP("city")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Short bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell buyers a little about yourself or your business…"
                  value={profile.bio}
                  onChange={setP("bio")}
                  rows={3}
                />
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Skip for now
                </Button>
                <Button onClick={saveProfile} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save & Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Company details step (seller only) ──────────────── */}
        {isSeller && step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Company details
              </CardTitle>
              <CardDescription>
                Add your business information to build trust with buyers. You can skip and fill this in later from Settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Importers PLC"
                    value={company.companyName}
                    onChange={setC("companyName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyNameAmharic">Company Name (Amharic)</Label>
                  <Input
                    id="companyNameAmharic"
                    placeholder="የድርጅት ስም"
                    className="font-amharic"
                    value={company.companyNameAmharic}
                    onChange={setC("companyNameAmharic")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License</Label>
                  <Input
                    id="businessLicense"
                    placeholder="ET/BL/2024/XXXXX"
                    value={company.businessLicense}
                    onChange={setC("businessLicense")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tinNumber">TIN Number</Label>
                  <Input
                    id="tinNumber"
                    placeholder="0012345678"
                    value={company.tinNumber}
                    onChange={setC("tinNumber")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={company.website}
                    onChange={setC("website")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  placeholder="Describe your business, products, and services..."
                  value={company.companyDescription}
                  onChange={setC("companyDescription")}
                  rows={3}
                />
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(planStep)}>Skip for now</Button>
                  <Button onClick={saveCompany} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Save & Continue <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Plan selection step ───────────────────────────── */}
        {step === planStep && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" /> Choose your plan
                </CardTitle>
                <CardDescription>
                  You can upgrade at any time from Settings → Billing.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                const selected = selectedPlan === plan.slug;
                return (
                  <button
                    key={plan.slug}
                    type="button"
                    onClick={() => setSelectedPlan(plan.slug)}
                    className={cn(
                      "relative text-left rounded-xl border-2 p-5 transition-all space-y-3",
                      selected ? "border-primary bg-primary/5 shadow-sm"
                               : "border-border hover:border-primary/40"
                    )}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-base">{plan.name}</p>
                      <p className="text-xs font-amharic text-muted-foreground">{plan.nameAm}</p>
                    </div>
                    <p className="text-xl font-bold tabular-nums text-primary">{plan.price}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        Up to {plan.listings} active listings
                      </li>
                      <li className="flex items-center gap-1.5">
                        {plan.promote
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                          : <span className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30 flex-shrink-0 inline-block" />
                        }
                        Promoted listings
                      </li>
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(isSeller ? 2 : 1)}>← Back</Button>
              <Button onClick={() => setStep(verifyStep)} className="gap-2">
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Verification docs step ────────────────────────── */}
        {step === verifyStep && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Verify your account
              </CardTitle>
              <CardDescription>
                Verified sellers get a trust badge and higher placement in search results.
                This step is optional — you can do it later from Settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <VerifyOption
                  icon="🪪"
                  title="Government ID"
                  description="National ID, passport, or driver's licence"
                  href="/settings?tab=verification"
                />
                <VerifyOption
                  icon="🏢"
                  title="Business Licence"
                  description="Trade licence or business registration"
                  href="/settings?tab=verification"
                />
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-400">
                Documents are reviewed by the Sabeh admin team within 1–2 business days.
                You can list items while verification is pending.
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                <Button variant="ghost" onClick={() => setStep(planStep)}>← Back</Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={goToDashboard}>
                    Skip — go to dashboard
                  </Button>
                  <Button onClick={goToDashboard} className="gap-2">
                    Done <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

function VerifyOption({
  icon, title, description, href,
}: { icon: string; title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-start gap-3 rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-muted/40 transition-all"
    >
      <span className="text-2xl leading-none mt-0.5">{icon}</span>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
    </a>
  );
}
