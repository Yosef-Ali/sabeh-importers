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
  LayoutDashboard,
  Package,
  Users,
  Flag,
  CreditCard,
  Settings,
  Sparkles,
  Search,
  Heart,
  Bell,
  UserPlus,
  Camera,
  Globe,
  Lock,
  BookOpen,
  Monitor,
  Smartphone,
} from "lucide-react";

export const metadata = {
  title: "Platform Guide | Sabeh Authority",
  description:
    "Complete guide to Sabeh Authority — for buyers, sellers, and administrators. How to create accounts, list assets, manage verifications, promotions, and the full admin panel.",
};

/* ────────────────────────────── Reusable components ───────────────────────── */

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

function SectionBadge({ number, label }: { number: string; label: string }) {
  return (
    <span className="text-gold font-mono text-xs font-bold uppercase tracking-widest">
      {number} — {label}
    </span>
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

function AdminLink({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 hover:border-gold/50 transition-colors"
    >
      <div className="flex items-start gap-4">
        <span className="text-gold mt-0.5 flex-shrink-0">{icon}</span>
        <div>
          <p className="font-bold text-foreground group-hover:text-gold transition-colors">{title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0 ml-4" />
    </Link>
  );
}

/* ────────────────────────────── Page ──────────────────────────────────────── */

export default function GuidePage() {
  const tocItems = [
    ["#what-is-sabeh", "Platform Overview"],
    ["#for-buyers", "For Buyers"],
    ["#create-account", "Create Account"],
    ["#seller-guide", "Seller Guide"],
    ["#messaging", "Messaging"],
    ["#get-verified", "Verification"],
    ["#promotions", "Promotions & Plans"],
    ["#ai-tools", "AI Tools"],
    ["#admin-control", "Admin Panel"],
    ["#technical", "Technical Notes"],
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* ─── Hero ─── */}
      <div className="bg-navy text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold font-mono text-xs uppercase tracking-[0.25em] font-bold mb-4">
            SABEH_AUTHORITY — COMPLETE PLATFORM GUIDE
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
            How Sabeh Works
          </h1>
          <p className="text-white/70 mt-4 max-w-2xl text-lg leading-relaxed">
            Sabeh is Ethiopia&apos;s high-trust marketplace for verified industrial, maritime, and
            commercial assets. This guide covers everything — for buyers, sellers, and the
            Sabeh admin team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {tocItems.map(([href, label]) => (
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

      {/* ─── Body ─── */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* ═══════════════════ 01 — WHAT IS SABEH ═══════════════════ */}
        <Section
          id="what-is-sabeh"
          badge={<SectionBadge number="01" label="Overview" />}
          title="What is Sabeh Authority?"
          subtitle="A verified marketplace for high-value industrial and commercial assets in Ethiopia."
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p>
              Sabeh Authority is a structured, trust-first marketplace built for buyers and sellers
              of high-value assets — including industrial machinery, marine equipment, vehicles, and
              commercial real estate. Unlike general classifieds, every seller on Sabeh goes through
              an identity and business verification process.
            </p>
            <p>
              Listings are reviewed by the Sabeh team before going live. Promoted and Featured
              listings receive additional visibility across the homepage, category pages, and search
              results.
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

        {/* ═══════════════════ 02 — FOR BUYERS ═══════════════════ */}
        <Section
          id="for-buyers"
          badge={<SectionBadge number="02" label="Buying" />}
          title="For Buyers"
          subtitle="How to find, evaluate, and contact sellers for the assets you need."
        >
          <div className="space-y-6">
            <Step
              number={1}
              title="Browse or search for assets"
              description="Use the search bar or browse by category (Motors, Marine, Industrial, Real Estate, etc.). Filter by price, condition, and location to find exactly what you need."
            />
            <Step
              number={2}
              title="Check seller verification"
              description="Look for the Verified Partner badge on seller profiles. Verified sellers have submitted government ID or business licenses — giving you added confidence."
            />
            <Step
              number={3}
              title="Save and compare"
              description="Add listings to your Wishlist to compare later. Use Saved Searches to receive alerts when new matching listings are posted."
            />
            <Step
              number={4}
              title="Contact the seller"
              description="Use the built-in messaging system to ask questions, negotiate, or arrange viewing. You can also reach sellers via WhatsApp if they've shared their number."
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <Search className="h-5 w-5" />, title: "Search & Filter", desc: "Find assets by keyword, category, price range, and condition." },
              { icon: <Heart className="h-5 w-5" />, title: "Wishlist", desc: "Save listings you're interested in for easy comparison." },
              { icon: <Bell className="h-5 w-5" />, title: "Saved Searches", desc: "Get notified when new listings match your criteria." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 space-y-2">
                <span className="text-gold">{icon}</span>
                <p className="font-bold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════════ 03 — CREATE ACCOUNT ═══════════════════ */}
        <Section
          id="create-account"
          badge={<SectionBadge number="03" label="Getting Started" />}
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
              description="Check your inbox for a verification email. You'll also receive an SMS to confirm your identity."
            />
            <Step
              number={4}
              title="Complete onboarding"
              description="New users are guided through a step-by-step onboarding flow: complete your profile, choose a subscription plan, and submit verification documents (sellers). A complete profile receives 60% more inquiries."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoBox icon={<UserPlus className="h-5 w-5" />} title="Onboarding flow" variant="success">
              <p>
                After registration, you&apos;ll be guided through onboarding steps tailored to your
                role. Buyers complete their profile and choose a plan. Sellers additionally add
                company details and submit verification documents.
              </p>
            </InfoBox>
            <InfoBox icon={<AlertCircle className="h-5 w-5" />} title="Important for sellers" variant="warning">
              <p>
                Sellers must submit a government-issued ID or business license before their first
                listing can go live. Documents are reviewed securely by the Sabeh team — they are
                never visible to buyers.
              </p>
            </InfoBox>
          </div>
        </Section>

        {/* ═══════════════════ 04 — SELLER GUIDE ═══════════════════ */}
        <Section
          id="seller-guide"
          badge={<SectionBadge number="04" label="Selling" />}
          title="Listing Your Assets"
          subtitle="Create a listing that attracts serious, qualified buyers."
        >
          <div className="space-y-6">
            <Step
              number={1}
              title="Go to Marketplace → Create Listing"
              description="From your dashboard, navigate to Marketplace and click 'Create Listing'. A step-by-step wizard guides you through the entire process."
            />
            <Step
              number={2}
              title="Choose a category and fill in details"
              description="Select the right category — Motors, Marine, Industrial, Real Estate, etc. Provide an accurate title, clear description, competitive price, condition, and specifications."
            />
            <Step
              number={3}
              title="Add high-quality photos"
              description="Listings with 5+ photos receive 3× more inquiries. Use real, unedited photos of the actual item. Cover all angles including any wear or defects."
            />
            <Step
              number={4}
              title="Set your contact preferences"
              description="Choose whether to show your phone number publicly or require buyers to message you through the platform's built-in messaging system first."
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

          <InfoBox icon={<Package className="h-5 w-5" />} title="Managing your listings">
            <p>
              View and manage all your active listings from <strong>My Listings</strong> in your
              dashboard. You can edit, deactivate, or delete listings at any time. Track views
              and inquiries to understand how your listings are performing.
            </p>
          </InfoBox>
        </Section>

        {/* ═══════════════════ 05 — MESSAGING ═══════════════════ */}
        <Section
          id="messaging"
          badge={<SectionBadge number="05" label="Communication" />}
          title="Messaging System"
          subtitle="Built-in messaging for secure buyer-seller communication."
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p>
              Sabeh includes a real-time messaging system so buyers and sellers can communicate
              directly within the platform. No need to share personal phone numbers or emails
              until you&apos;re ready.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <MessageSquare className="h-5 w-5" />, title: "Direct Messages", desc: "Start a conversation from any listing page. Messages are organized by conversation thread." },
              { icon: <Globe className="h-5 w-5" />, title: "WhatsApp Integration", desc: "Sellers can optionally share their WhatsApp number for direct contact outside the platform." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 space-y-2">
                <span className="text-gold">{icon}</span>
                <p className="font-bold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════════ 06 — VERIFICATION ═══════════════════ */}
        <Section
          id="get-verified"
          badge={<SectionBadge number="06" label="Trust" />}
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

          <InfoBox icon={<Lock className="h-5 w-5" />} title="Your documents are confidential" variant="success">
            <p>
              Sabeh Authority treats all submitted documents with the highest level of security.
              Only Sabeh compliance administrators can view verification documents — they are
              encrypted, never exposed to the public marketplace, and never shared with third
              parties.
            </p>
          </InfoBox>
        </Section>

        {/* ═══════════════════ 07 — PROMOTIONS & PLANS ═══════════════════ */}
        <Section
          id="promotions"
          badge={<SectionBadge number="07" label="Visibility & Plans" />}
          title="Promotions & Subscription Plans"
          subtitle="Promoted listings get up to 10× more views. Choose a plan that fits your needs."
        >
          {/* Subscription plans */}
          <div>
            <h3 className="font-display font-bold text-foreground text-lg mb-4">Subscription Plans</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  name: "Deckhand",
                  nameAm: "ዴክሃንድ",
                  price: "Free",
                  features: ["Up to 3 listings", "Basic visibility", "Platform messaging"],
                },
                {
                  name: "First Mate",
                  nameAm: "ፈርስት ሜት",
                  price: "Paid",
                  features: ["More listings", "Priority placement", "Promoted badge", "Analytics"],
                },
                {
                  name: "Captain",
                  nameAm: "ካፒቴን",
                  price: "Premium",
                  features: ["Unlimited listings", "Featured placement", "Verified Partner", "Priority support"],
                },
              ].map((plan) => (
                <div key={plan.name} className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <div>
                    <p className="font-display font-bold text-foreground">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">{plan.nameAm}</p>
                  </div>
                  <p className="text-gold font-mono text-sm font-bold">{plan.price}</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Plans and pricing are managed by the Sabeh admin team. Visit the{" "}
              <Link href="/pricing" className="text-gold hover:underline">Pricing page</Link>{" "}
              for current rates. Admins can enable &quot;Free Subscription Mode&quot; to make all plans free during promotions.
            </p>
          </div>

          {/* Promotion tiers */}
          <div>
            <h3 className="font-display font-bold text-foreground text-lg mb-4">Listing Promotions</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-xl border-2 border-border bg-card p-6 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-display font-bold">
                  <Zap className="h-5 w-5 text-gold" />
                  Promoted Listing
                </div>
                <p className="text-sm text-muted-foreground">
                  Your listing appears at the top of relevant search results and category pages.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> Priority search placement</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> &quot;Promoted&quot; badge on listing card</li>
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
                  Featured listings appear in the exclusive &quot;Verified Partners&quot; section on the
                  homepage, with a gold border and verified badge.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> Homepage &quot;Verified Partners&quot; carousel</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> Gold border + &quot;Verified Partner&quot; badge</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" /> 8–10× average more views</li>
                </ul>
              </div>
            </div>
          </div>

          <InfoBox icon={<MessageSquare className="h-5 w-5" />} title="How to request a promotion">
            <p>
              Contact the Sabeh team via the platform messaging system or WhatsApp. The admin team
              activates promotions directly from the admin panel under{" "}
              <strong>Admin → Promotions</strong>.
            </p>
          </InfoBox>
        </Section>

        {/* ═══════════════════ 08 — AI TOOLS ═══════════════════ */}
        <Section
          id="ai-tools"
          badge={<SectionBadge number="08" label="AI" />}
          title="AI-Powered Tools"
          subtitle="Built-in AI to help create compelling ad content and product images."
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p>
              Sabeh includes an AI content generator available to admins under{" "}
              <strong>Admin → AI Generator</strong>. It uses Google&apos;s Gemini models to create
              professional ad descriptions and product images — with full support for Amharic
              language prompts.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "Create Ad",
                desc: "Enter a product title, category, condition, and price — AI generates both a description and a matching product image in one click.",
              },
              {
                icon: <Camera className="h-5 w-5" />,
                title: "Image Studio",
                desc: "Write a custom text prompt (in Amharic or English) to generate any product image. Upload a reference photo for image-to-image generation.",
              },
              {
                icon: <BookOpen className="h-5 w-5" />,
                title: "Prompt Gallery",
                desc: "Browse pre-made sample prompts for common product categories — electronics, vehicles, fashion, furniture, and more.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 space-y-2">
                <span className="text-gold">{icon}</span>
                <p className="font-bold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoBox icon={<Globe className="h-5 w-5" />} title="Amharic prompt support" variant="success">
              <p>
                Amharic prompts are automatically translated to English before image generation
                for best results. The AI model used is <code className="text-xs bg-muted px-1 py-0.5 rounded">gemini-3-pro-image-preview</code>{" "}
                — chosen specifically for its superior understanding of Amharic text.
              </p>
            </InfoBox>
            <InfoBox icon={<Camera className="h-5 w-5" />} title="Image styles">
              <p>
                Choose from four image styles: <strong>Product Photo</strong> (clean white background),{" "}
                <strong>Lifestyle</strong> (natural setting), <strong>Minimal</strong> (simple elegant),
                and <strong>Dramatic</strong> (bold contrast). Aspect ratios from 1:1 square to 16:9 wide.
              </p>
            </InfoBox>
          </div>
        </Section>

        {/* ═══════════════════ 09 — ADMIN PANEL ═══════════════════ */}
        <Section
          id="admin-control"
          badge={<SectionBadge number="09" label="Admin" />}
          title="Admin Panel Guide"
          subtitle="Complete reference for the Sabeh admin team — all tools available at /admin."
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p>
              The admin panel is accessible to users with <strong>ADMIN</strong> or{" "}
              <strong>MANAGER</strong> roles. It provides full control over listings, users,
              verifications, promotions, subscription plans, system settings, and AI tools.
            </p>
          </div>

          <div className="space-y-4">
            <AdminLink
              href="/admin"
              icon={<LayoutDashboard className="h-5 w-5" />}
              title="Dashboard"
              desc="Platform overview — total users, active listings, pending reviews, verified sellers, and promotion statistics at a glance."
            />
            <AdminLink
              href="/admin/listings"
              icon={<Package className="h-5 w-5" />}
              title="Listing Moderation"
              desc="Review, approve, or reject submitted listings. All new listings start as PENDING_REVIEW and must be explicitly approved before appearing publicly."
            />
            <AdminLink
              href="/admin/users"
              icon={<Users className="h-5 w-5" />}
              title="User Management"
              desc="View all registered users with their roles (BUYER, SELLER, ADMIN, MANAGER) and verification status. Ban or unban accounts. Change user roles."
            />
            <AdminLink
              href="/admin/verifications"
              icon={<BadgeCheck className="h-5 w-5" />}
              title="Verification Review"
              desc="Securely review uploaded government IDs and business licenses. Approve or reject seller verification requests. Documents are encrypted and only visible here."
            />
            <AdminLink
              href="/admin/promotions"
              icon={<Star className="h-5 w-5" />}
              title="Promotion Control"
              desc="Activate, deactivate, or extend listing promotions and featured status. Set expiry dates for time-limited promotions."
            />
            <AdminLink
              href="/admin/reports"
              icon={<Flag className="h-5 w-5" />}
              title="Reports"
              desc="Review buyer and seller reports about listings or users. Mark reports as resolved or dismissed with a resolution note."
            />
            <AdminLink
              href="/admin/plans"
              icon={<CreditCard className="h-5 w-5" />}
              title="Subscription Plans"
              desc="Create, edit, and manage subscription plan tiers (Deckhand, First Mate, Captain). Set pricing, listing limits, and features for each plan."
            />
            <AdminLink
              href="/admin/ai-generator"
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Generator"
              desc="Generate ad descriptions and product images using AI. Supports Amharic prompts, multiple image styles, reference image upload, and a prompt gallery."
            />
            <AdminLink
              href="/admin/settings"
              icon={<Settings className="h-5 w-5" />}
              title="System Settings"
              desc="Configure global platform behavior — toggle Free Subscription Mode (all plans become $0), manage verification methods, and other system-wide settings."
            />
          </div>

          <InfoBox icon={<Lock className="h-5 w-5" />} title="Admin access is role-protected" variant="warning">
            <p>
              The admin panel is protected by middleware. Only users with <code className="text-xs bg-muted px-1 py-0.5 rounded">ADMIN</code> or{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">MANAGER</code> roles can access <code className="text-xs bg-muted px-1 py-0.5 rounded">/admin/*</code> routes.
              Unauthorized users are redirected to the login page.
            </p>
          </InfoBox>
        </Section>

        {/* ═══════════════════ 10 — TECHNICAL NOTES ═══════════════════ */}
        <Section
          id="technical"
          badge={<SectionBadge number="10" label="Technical" />}
          title="Technical Notes for Handover"
          subtitle="Key technical details for the Sabeh development and operations team."
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <Monitor className="h-5 w-5 text-gold" /> Technology Stack
              </h3>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between border-b border-dashed border-border py-1.5">
                  <span className="font-medium text-foreground">Framework</span>
                  <span>Next.js 14 (App Router)</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border py-1.5">
                  <span className="font-medium text-foreground">Language</span>
                  <span>TypeScript</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border py-1.5">
                  <span className="font-medium text-foreground">Database</span>
                  <span>Prisma ORM</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border py-1.5">
                  <span className="font-medium text-foreground">Auth</span>
                  <span>Custom JWT (httpOnly cookies)</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border py-1.5">
                  <span className="font-medium text-foreground">AI</span>
                  <span>Google Gemini (genai SDK)</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border py-1.5">
                  <span className="font-medium text-foreground">Hosting</span>
                  <span>Vercel</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border py-1.5">
                  <span className="font-medium text-foreground">Styling</span>
                  <span>Tailwind CSS + shadcn/ui</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border py-1.5">
                  <span className="font-medium text-foreground">State</span>
                  <span>Zustand + Server Actions</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-gold" /> Key User Flows
              </h3>
              <div className="text-sm text-muted-foreground space-y-3">
                <div>
                  <p className="font-medium text-foreground">Registration → Onboarding</p>
                  <p><code className="text-xs bg-muted px-1 py-0.5 rounded">/register</code> → email verification → <code className="text-xs bg-muted px-1 py-0.5 rounded">/onboarding</code> (profile, company, plan, verify)</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Create Listing</p>
                  <p><code className="text-xs bg-muted px-1 py-0.5 rounded">/marketplace/create</code> → step-by-step wizard → submitted as PENDING_REVIEW → admin approves</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Buyer Journey</p>
                  <p><code className="text-xs bg-muted px-1 py-0.5 rounded">/search</code> or <code className="text-xs bg-muted px-1 py-0.5 rounded">/category/[slug]</code> → <code className="text-xs bg-muted px-1 py-0.5 rounded">/listings/[id]</code> → message seller or WhatsApp</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Admin Moderation</p>
                  <p><code className="text-xs bg-muted px-1 py-0.5 rounded">/admin/listings</code> → review pending → approve/reject → listing goes live or seller notified</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5 text-gold" /> Environment Variables Required
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>The following env vars must be set in Vercel (or <code className="text-xs bg-muted px-1 py-0.5 rounded">.env</code> locally):</p>
                <ul className="list-disc pl-4 space-y-1 font-mono text-xs">
                  <li>DATABASE_URL — Database connection string</li>
                  <li>JWT_SECRET — For session token signing</li>
                  <li>GOOGLE_GENERATIVE_AI_API_KEY — Gemini API for AI generator</li>
                  <li>RESEND_API_KEY — For transactional emails</li>
                  <li>NEXT_PUBLIC_APP_URL — Public app URL</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── CTA ─── */}
        <div className="rounded-2xl bg-navy text-white p-10 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold">Ready to start?</h2>
          <p className="text-white/70 max-w-md mx-auto">
            Join verified sellers on Sabeh Authority. Create your account, get verified, and
            reach serious buyers today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/marketplace/create"
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
            <Link
              href="/pricing"
              className="rounded-sm border border-white/30 text-white font-display font-bold uppercase tracking-widest text-sm px-8 py-3 hover:border-gold hover:text-gold transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>

      </div>

      <EnhancedFooter />
    </div>
  );
}
