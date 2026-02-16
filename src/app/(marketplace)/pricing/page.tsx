import Link from "next/link";
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { PricingTierCard, PRICING_TIERS } from "@/components/marketplace/listing-wizard/pricing-tier-card";
import { Check, Zap, TrendingUp, Award } from "lucide-react";

import { getSystemSettings } from "@/lib/actions/settings";
import { subscribeToPlan } from "@/lib/actions/subscription";
import { toast } from "sonner";

export const metadata = {
  title: "Pricing Plans | Sabeh Importers",
  description:
    "Choose the perfect plan to showcase your listings and reach more buyers on Sabeh Importers marketplace.",
};

export default async function PricingPage() {
  const settings = await getSystemSettings();
  const isFreeMode = settings.isFreeSubscriptionMode;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-blueprint opacity-20" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {isFreeMode && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-button border-2 border-accent bg-accent/20 px-4 py-2 text-sm font-bold font-mono text-accent uppercase tracking-widest shadow-hard animate-pulse">
                <Zap className="h-4 w-4" />
                Limited Time Offer: All Plans Free!
              </div>
            )}
            <h1 className="mb-6 text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
              Boost Your Listings
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-mono leading-relaxed max-w-2xl mx-auto">
              Choose the plan that fits your selling needs. {isFreeMode ? "Start for free today!" : "From free basic listings to premium features."}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <PricingTierCard
              key={tier.id}
              tier={tier}
              selected={false}
              onSelect={async () => {
                "use server";
                // This needs to be handled by a client wrapper or form action.
                // Since PricingTierCard is a client component, we'll pass the action or handle it there.
              }} 
              language="en"
              isFreeMode={isFreeMode}
            />
          ))}
        </div>

        {/* CTA Below Tiers */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground font-mono text-sm mb-6">
            Ready to start selling?
          </p>
          <Link href="/dashboard/marketplace/create">
            <Button
              variant="accent"
              size="xl"
              className="font-display font-bold shadow-hard-navy"
            >
              Create Your First Listing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="bg-muted/30 py-16 md:py-24 border-y-2 border-primary/10">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 tracking-tight">
                Compare Features
              </h2>
              <p className="text-muted-foreground font-mono text-sm">
                See what's included in each plan
              </p>
            </div>

            <div className="bg-white rounded-card border-2 border-primary/10 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-primary/10">
                      <th className="px-6 py-4 text-left text-sm font-mono font-bold text-primary uppercase tracking-wide">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-mono font-bold text-primary uppercase tracking-wide">
                        Deckhand
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-mono font-bold text-accent uppercase tracking-wide bg-accent/5">
                        Officer
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-mono font-bold text-primary uppercase tracking-wide">
                        Captain
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <ComparisonRow
                      feature="Listing Duration"
                      deckhand="30 days"
                      officer="60 days"
                      captain="Unlimited"
                    />
                    <ComparisonRow
                      feature="Number of Photos"
                      deckhand="5"
                      officer="10"
                      captain="Unlimited"
                    />
                    <ComparisonRow
                      feature="Featured Badge"
                      deckhand={false}
                      officer={true}
                      captain={true}
                    />
                    <ComparisonRow
                      feature="Priority in Search"
                      deckhand={false}
                      officer={true}
                      captain={true}
                    />
                    <ComparisonRow
                      feature="Homepage Placement"
                      deckhand={false}
                      officer={false}
                      captain={true}
                    />
                    <ComparisonRow
                      feature="Analytics Dashboard"
                      deckhand={false}
                      officer={false}
                      captain={true}
                    />
                    <ComparisonRow
                      feature="Email Notifications"
                      deckhand={false}
                      officer={true}
                      captain={true}
                    />
                    <ComparisonRow
                      feature="Priority Support"
                      deckhand={false}
                      officer={false}
                      captain={true}
                    />
                    <ComparisonRow
                      feature="Verification Badge"
                      deckhand={false}
                      officer={false}
                      captain={true}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 tracking-tight">
              Why Upgrade?
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              Premium listings sell faster and get more views
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Sell Faster"
              description="Premium listings get 3x more views and sell 50% faster than free listings."
            />
            <BenefitCard
              icon={<Zap className="h-8 w-8" />}
              title="Priority Placement"
              description="Your listings appear at the top of search results, getting maximum visibility."
            />
            <BenefitCard
              icon={<Award className="h-8 w-8" />}
              title="Build Trust"
              description="Featured badges and verification help buyers trust your listings more."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-16 md:py-24 border-t-2 border-primary/10">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              <FAQItem
                question="Can I upgrade my listing after publishing?"
                answer="Yes! You can upgrade any active listing to a paid plan at any time from your dashboard."
              />
              <FAQItem
                question="What payment methods do you accept?"
                answer="We accept Telebirr, CBE Birr, credit cards, and other major payment methods in Ethiopia."
              />
              <FAQItem
                question="What happens when my listing expires?"
                answer="You'll receive a notification before expiry. You can renew or upgrade your listing to keep it active."
              />
              <FAQItem
                question="Can I get a refund?"
                answer="We offer refunds within 24 hours of purchase if your listing hasn't gained significant views yet."
              />
              <FAQItem
                question="Is there a monthly subscription?"
                answer="The Captain plan is a monthly subscription with unlimited active listings. Other plans are per-listing fees."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center bg-primary rounded-card p-12 md:p-16 shadow-hard-navy">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-tight">
            Ready to Start Selling?
          </h2>
          <p className="text-white/80 font-mono text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of sellers already reaching buyers on Sabeh
            Importers marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/marketplace/create">
              <Button
                variant="accent"
                size="xl"
                className="font-display font-bold shadow-hard"
              >
                Create Free Listing
              </Button>
            </Link>
            <Link href="/search">
              <Button
                variant="outline"
                size="xl"
                className="font-display font-bold bg-white hover:bg-white/90"
              >
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Components

function ComparisonRow({
  feature,
  deckhand,
  officer,
  captain,
}: {
  feature: string;
  deckhand: string | boolean;
  officer: string | boolean;
  captain: string | boolean;
}) {
  return (
    <tr>
      <td className="px-6 py-4 text-sm font-medium text-foreground">
        {feature}
      </td>
      <td className="px-6 py-4 text-center">
        <FeatureValue value={deckhand} />
      </td>
      <td className="px-6 py-4 text-center bg-accent/5">
        <FeatureValue value={officer} highlight />
      </td>
      <td className="px-6 py-4 text-center">
        <FeatureValue value={captain} />
      </td>
    </tr>
  );
}

function FeatureValue({
  value,
  highlight,
}: {
  value: string | boolean;
  highlight?: boolean;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <Check
        className={`h-5 w-5 mx-auto ${
          highlight ? "text-accent" : "text-green-600"
        }`}
      />
    ) : (
      <span className="text-muted-foreground text-xs">—</span>
    );
  }
  return (
    <span
      className={`text-sm font-mono ${
        highlight ? "text-accent font-bold" : "text-foreground"
      }`}
    >
      {value}
    </span>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-card border-2 border-primary/10 p-8 shadow-card hover:shadow-card-hover transition-all">
      <div className="w-14 h-14 bg-accent/10 rounded-button flex items-center justify-center mb-6 text-accent">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-primary mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground font-mono text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="bg-white rounded-card border-2 border-primary/10 p-6 shadow-card">
      <h3 className="text-lg font-display font-bold text-primary mb-3">
        {question}
      </h3>
      <p className="text-muted-foreground font-mono text-sm leading-relaxed">
        {answer}
      </p>
    </div>
  );
}
