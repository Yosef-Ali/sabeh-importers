import Link from "next/link";
import { EnhancedFooter } from "@/components/homepage/enhanced-footer";
import {
  ShieldCheck,
  Star,
  BadgeCheck,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "How Sabeh Works | Seller Guide",
  description:
    "Everything you need to know about Sabeh Authority — how to create a seller account, list your assets, get verified, and grow your business on the marketplace.",
};

function Section({
  id,
  badge,
  title,
  subtitle,
  children,
}: {
  id: string;
  badge: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-8">
      <div className="border-l-4 border-gold pl-6">
        <div className="flex items-center gap-3 mb-2">{badge}</div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground font-sans mt-1">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-navy text-white flex items-center justify-center font-display font-bold text-lg">
        {number}
      </div>
      <div className="pt-1.5">
        <p className="font-display font-bold text-foreground">{title}</p>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  title,
  children,
  variant = "default",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "warning" | "success";
}) {
  const styles = {
    default: "bg-card border-border",
    warning: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
    success: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
  };
  const iconStyles = {
    default: "text-gold",
    warning: "text-amber-600",
    success: "text-green-600",
  };

  return (
    <div className={`rounded-xl border p-5 ${styles[variant]}`}>
      <div className="flex items-start gap-3">
        <span className={`flex-shrink-0 mt-0.5 ${iconStyles[variant]}`}>{icon}</span>
        <div>
          <p className="font-bold text-foreground text-sm">{title}</p>
          <div className="text-muted-foreground text-sm mt-1 space-y-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero */}
      <div className="bg-navy text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold font-mono text-xs uppercase tracking-[0.25em] font-bold mb-4">
            SABEH_AUTHORITY — PLATFORM GUIDE
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
            How Sabeh Works
          </h1>
          <p className="text-white/70 mt-4 max-w-2xl text-lg leading-relaxed">
            Sabeh is Ethiopia's high-trust marketplace for verified industrial, maritime, and commercial assets.
            This guide covers everything — from creating your account to getting your listings seen by serious buyers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ["#what-is-sabeh", "Platform Overview"],
              ["#create-account", "Create Account"],
              ["#seller-guide", "Seller Guide"],
              ["#get-verified", "Verification"],
              ["#promotions", "Promotions"],
              ["#admin-control", "For Sabeh Admins"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-white/20 text-white/80 hover:border-gold hover:text-gold px-4 py-1.5 text-sm font-bold transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* ── SECTION 1: What is Sabeh ── */}
        <Section
          id="what-is-sabeh"
          badge={<span className="text-gold font-mono text-xs font-bold uppercase tracking-widest">01 — Overview</span>}
          title="What is Sabeh Authority?"
          subtitle="A verified marketplace for high-value industrial and commercial assets in Ethiopia."
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p>
              Sabeh Authority is a structured, trust-first marketplace built for buyers and sellers of high-value assets —
              including industrial machinery, marine equipment, vehicles, and commercial real estate.
              Unlike general classifieds, every seller on Sabeh goes through an identity and business verification process.
            </p>
            <p>
              Listings are reviewed by the Sabeh team before going live. Promoted and Featured listings
              receive additional visibility across the homepage, category pages, and search results.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <ShieldCheck className="h-5 w-5" />, title: "Verified Sellers", desc: "Every commercial seller is identity-verified before listing." },
              { icon: <BadgeCheck className="h-5 w-5" />, title: "Admin-Reviewed Listings", desc: "All listings pass moderation before going public." },
              { icon: <Star className="h-5 w-5" />, title: "Promoted Visibility", desc: "Featured and promoted listings appear in prime positions." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 space-y-2">
                <span className="text-gold">{icon}</span>
                <p className="font-bold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 2: Create Account ── */}
        <Section
          id="create-account"
          badge={<span className="text-gold font-mono text-xs font-bold uppercase tracking-widest">02 — Getting Started</span>}
          title="Creating Your Account"
          subtitle="Signing up takes two minutes. Verification for sellers takes 1–3 business days."
        >
          <div className="space-y-6">
            <Step
              number={1}
              title="Go to the Sign Up page"
              description="Click 'Sign Up' on the top navigation. You'll need a valid email address and phone number registered in Ethiopia."
            />
            <Step
              number={2}
              title="Choose your account type"
              description="Select Buyer if you're looking to purchase assets. Select Seller if you intend to list items for sale. You can always upgrade from Buyer to Seller later."
            />
            <Step
              number={3}
              title="Verify your email and phone"
              description="Check your inbox for a verification email. You'll also receive an SMS to your phone number to confirm your identity."
            />
            <Step
              number={4}
              title="Complete your profile"
              description="Add your business name, profile photo, and contact details. A complete profile receives 60% more inquiries."
            />
          </div>

          <InfoBox icon={<AlertCircle className="h-5 w-5" />} title="Important for sellers" variant="warning">
            <p>
              Sellers must additionally submit a government-issued ID or business license before their first listing can go live.
              Documents are reviewed securely by the Sabeh team — they are never visible to buyers.
            </p>
          </InfoBox>
        </Section>

        {/* ── SECTION 3: Seller Guide ── */}
        <Section
          id="seller-guide"
          badge={<span className="text-gold font-mono text-xs font-bold uppercase tracking-widest">03 — Selling</span>}
          title="Listing Your Assets"
          subtitle="Create a listing that attracts serious, qualified buyers."
        >
          <div className="space-y-6">
            <Step
              number={1}
              title="Go to Dashboard → Create Listing"
              description="From your seller dashboard, click 'Create Listing'. Choose the right category — Motors, Marine, Industrial, Real Estate, etc."
            />
            <Step
              number={2}
              title="Fill in asset details"
              description="Provide an accurate title, clear description, and competitive price. Include condition, year (for vehicles), and any relevant specifications."
            />
            <Step
              number={3}
              title="Add high-quality photos"
              description="Listings with 5+ photos receive 3× more inquiries. Use real, unedited photos of the actual item. Cover all angles including any wear or defects."
            />
            <Step
              number={4}
              title="Set your contact preferences"
              description="Choose whether to show your phone number publicly or require buyers to message you through the platform first."
            />
            <Step
              number={5}
              title="Submit for review"
              description="The Sabeh moderation team will review your listing within 24 hours. You'll be notified by email when it goes live or if changes are required."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoBox icon={<CheckCircle2 className="h-5 w-5" />} title="What makes a great listing" variant="success">
              <ul className="list-disc pl-4 space-y-1">
                <li>Clear, specific title (include make, model, year)</li>
                <li>Honest condition description</li>
                <li>Accurate price — negotiable or firm</li>
                <li>5+ real photos from multiple angles</li>
                <li>Complete specifications</li>
              </ul>
            </InfoBox>
            <InfoBox icon={<AlertCircle className="h-5 w-5" />} title="What gets listings rejected" variant="warning">
              <ul className="list-disc pl-4 space-y-1">
                <li>Inaccurate or misleading descriptions</li>
                <li>Stolen goods or items without valid ownership</li>
                <li>Duplicate listings for the same item</li>
                <li>Missing or fake photos</li>
                <li>Pricing in wrong currency</li>
              </ul>
            </InfoBox>
          </div>
        </Section>

        {/* ── SECTION 4: Verification ── */}
        <Section
          id="get-verified"
          badge={<span className="text-gold font-mono text-xs font-bold uppercase tracking-widest">04 — Trust</span>}
          title="Getting Verified"
          subtitle="Verified sellers get a badge, higher search ranking, and more buyer trust."
        >
          <div className="space-y-6">
            <Step
              number={1}
              title="Go to Settings → Verification"
              description="In your seller dashboard, navigate to Settings. Under the Verification section, you'll see what documents are required."
            />
            <Step
              number={2}
              title="Upload your documents"
              description="Individual sellers: upload a government-issued ID (passport, Fayda ID, or driver's license). Business sellers: upload your business license or trade registration certificate."
            />
            <Step
              number={3}
              title="Wait for review (1–3 business days)"
              description="The Sabeh compliance team reviews documents in strict confidence. Documents are never shared with buyers or other users."
            />
            <Step
              number={4}
              title="Receive your Verified Partner badge"
              description="Once approved, your profile and all listings will display the Verified Partner badge, boosting credibility and search visibility."
            />
          </div>

          <InfoBox icon={<ShieldCheck className="h-5 w-5" />} title="Your documents are confidential" variant="success">
            <p>
              Sabeh Authority treats all submitted documents with the highest level of security.
              Only Sabeh compliance administrators can view verification documents — they are encrypted,
              never exposed to the public marketplace, and never shared with third parties.
            </p>
          </InfoBox>
        </Section>

        {/* ── SECTION 5: Promotions ── */}
        <Section
          id="promotions"
          badge={<span className="text-gold font-mono text-xs font-bold uppercase tracking-widest">05 — Visibility</span>}
          title="Promoting Your Listings"
          subtitle="Promoted and Featured listings get up to 10× more views."
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border-2 border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-foreground font-display font-bold">
                <Zap className="h-5 w-5 text-gold" />
                Promoted Listing
              </div>
              <p className="text-sm text-muted-foreground">
                Your listing appears at the top of relevant search results and category pages.
                Promotion runs for a set period and can be renewed.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> Priority search placement</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> "Promoted" badge on listing card</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> 3–5× average more views</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-gold/40 bg-card p-6 space-y-3 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-gold text-navy text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Premium
              </div>
              <div className="flex items-center gap-2 text-foreground font-display font-bold">
                <Star className="h-5 w-5 text-gold" />
                Featured / Verified Partner
              </div>
              <p className="text-sm text-muted-foreground">
                Featured listings appear in the exclusive "Verified Partners" section on the
                homepage, with a gold border and verified badge. Maximum trust signal for buyers.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> Homepage "Verified Partners" carousel</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> Gold border + "Verified Partner" badge</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> 8–10× average more views</li>
              </ul>
            </div>
          </div>

          <InfoBox icon={<MessageSquare className="h-5 w-5" />} title="How to request a promotion">
            <p>
              Contact the Sabeh team via the platform messaging system or WhatsApp to request a promotion package.
              Pricing is based on listing category, duration, and current market demand.
              The Sabeh admin team activates promotions directly from the admin panel.
            </p>
          </InfoBox>
        </Section>

        {/* ── SECTION 6: Admin Control (for Sabeh team) ── */}
        <Section
          id="admin-control"
          badge={<span className="text-gold font-mono text-xs font-bold uppercase tracking-widest">06 — Admin</span>}
          title="For the Sabeh Admin Team"
          subtitle="How Sabeh controls listings, verifications, and promotions."
        >
          <div className="space-y-4">
            {[
              {
                href: "/admin",
                title: "Admin Dashboard",
                desc: "Overview of all platform stats — total users, active listings, pending reviews, and reports.",
              },
              {
                href: "/admin/listings",
                title: "Listing Moderation",
                desc: "Review and approve or reject submitted listings. All listings start as PENDING_REVIEW and must be explicitly approved.",
              },
              {
                href: "/admin/users",
                title: "User Management",
                desc: "View all registered users, see their role and verification status, and ban or unban accounts.",
              },
              {
                href: "/admin/verifications",
                title: "Verification Review",
                desc: "Securely review uploaded government IDs and business licenses. Approve or reject seller verification requests. Documents are only visible here — never in public pages.",
              },
              {
                href: "/admin/promotions",
                title: "Promotion Control",
                desc: "Activate, deactivate, or extend listing promotions and featured status. Set expiry dates for time-limited promotions.",
              },
              {
                href: "/admin/reports",
                title: "Reports",
                desc: "Review buyer and seller reports about listings or users. Mark as resolved or dismissed with a resolution note.",
              },
            ].map(({ href, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 hover:border-gold/50 transition-colors"
              >
                <div>
                  <p className="font-bold text-foreground group-hover:text-gold transition-colors">{title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0 ml-4" />
              </Link>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <div className="rounded-2xl bg-navy text-white p-10 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold">Ready to start selling?</h2>
          <p className="text-white/70 max-w-md mx-auto">
            Join thousands of verified sellers on Sabeh Authority. Create your account, get verified, and reach serious buyers today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard/marketplace/create"
              className="rounded-sm bg-gold text-navy font-display font-bold uppercase tracking-widest text-sm px-8 py-3 hover:bg-gold/90 transition-colors"
            >
              Create a Listing
            </Link>
            <Link
              href="/search"
              className="rounded-sm border border-white/30 text-white font-display font-bold uppercase tracking-widest text-sm px-8 py-3 hover:border-gold hover:text-gold transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        </div>

      </div>

      <EnhancedFooter />
    </div>
  );
}
