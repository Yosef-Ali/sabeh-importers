"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Package, MapPin, BadgeCheck } from "lucide-react";
import { PricingTierCard, PRICING_TIERS } from "./pricing-tier-card";
import { ListingFormData } from "./listing-wizard";

interface Step2VisibilityProps {
  formData: Partial<ListingFormData>;
  updateFormData: (data: Partial<ListingFormData>) => void;
  language?: "en" | "am";
}

export function Step2Visibility({
  formData,
  updateFormData,
  language = "en",
}: Step2VisibilityProps) {
  const [selectedTier, setSelectedTier] = useState<
    "deckhand" | "officer" | "captain"
  >(formData.pricingTier || "deckhand");

  const handleTierSelect = (tierId: "deckhand" | "officer" | "captain") => {
    setSelectedTier(tierId);
    updateFormData({ pricingTier: tierId });
  };

  return (
    <div className="space-y-8">
      {/* Listing Preview */}
      <div>
        <h3 className="text-xl font-display font-bold text-primary mb-4">
          {language === "am" ? "የዝርዝር ቅድመ እይታ" : "Listing Preview"}
        </h3>
        <div className="bg-white rounded-card border-2 border-primary/10 overflow-hidden shadow-card">
          <div className="relative h-48 bg-muted">
            {formData.images && formData.images.length > 0 ? (
              <img
                src={formData.images[0]}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            {selectedTier !== "deckhand" && (
              <div className="absolute top-3 left-3 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-button shadow-hard flex items-center gap-1">
                <BadgeCheck className="h-3 w-3" />
                {language === "am" ? "ተለይቷል" : "FEATURED"}
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-primary mb-2 font-display">
              {formData.currency || "ETB"}{" "}
              {formData.price?.toLocaleString() || "0"}
              {formData.negotiable && (
                <span className="text-sm text-muted-foreground font-mono ml-2">
                  ({language === "am" ? "ተደራሽ" : "Negotiable"})
                </span>
              )}
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">
              {formData.title || (language === "am" ? "ርዕስ" : "Title")}
            </h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {formData.condition && (
                <>
                  <span className="font-mono uppercase">
                    {formData.condition.replace("_", " ")}
                  </span>
                  <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                </>
              )}
              {formData.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {formData.city}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tier Selection */}
      <div>
        <h3 className="text-xl font-display font-bold text-primary mb-2">
          {language === "am" ? "የዋጋ እቅድ ይምረጡ" : "Choose Your Plan"}
        </h3>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          {language === "am"
            ? "የእርስዎን ዝርዝር ታይነት እና ተደራሽነት ለመጨመር እቅድ ይምረጡ"
            : "Select a plan to boost your listing's visibility and reach"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <PricingTierCard
              key={tier.id}
              tier={tier}
              selected={selectedTier === tier.id}
              onSelect={() => handleTierSelect(tier.id)}
              language={language}
            />
          ))}
        </div>
      </div>

      {/* Payment Notice */}
      {selectedTier !== "deckhand" && (
        <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-button">
          <h4 className="font-display font-bold text-primary mb-2">
            {language === "am" ? "ክፍያ" : "Payment"}
          </h4>
          <p className="text-sm font-mono text-foreground">
            {language === "am" ? (
              <>
                የተመረጠውን እቅድ ለማግበር ክፍያ ከማተም በኋላ ይጠየቃል። እኛ Telebirr፣
                CBE Birr እና የክሬዲት ካርዶችን እንቀበላለን።
              </>
            ) : (
              <>
                You will be prompted for payment after publishing to activate
                your selected plan. We accept Telebirr, CBE Birr, and credit
                cards.
              </>
            )}
          </p>
        </div>
      )}

      {/* Publish Options */}
      <div className="space-y-4">
        <h3 className="text-xl font-display font-bold text-primary">
          {language === "am" ? "የማተም አማራጮች" : "Publishing Options"}
        </h3>

        {/* Publish Now Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-card border border-border">
          <div>
            <Label htmlFor="publishNow" className="font-display font-semibold">
              {language === "am" ? "አሁን አትም" : "Publish Immediately"}
            </Label>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {language === "am"
                ? "ዝርዝርዎን ወዲያውኑ እንደ ንቁ ያድርጉ"
                : "Make your listing active right away"}
            </p>
          </div>
          <Switch
            id="publishNow"
            checked={formData.publishNow !== false}
            onCheckedChange={(checked) =>
              updateFormData({ publishNow: checked })
            }
          />
        </div>

        {formData.publishNow === false && (
          <div className="bg-muted/50 border border-border p-4 rounded-card">
            <p className="text-sm font-mono text-muted-foreground">
              {language === "am"
                ? "ዝርዝርዎ እንደ ረቂቅ ይቀመጣል። ዝግጁ ሲሆኑ ከዳሽቦርድዎ ማተም ይችላሉ።"
                : "Your listing will be saved as a draft. You can publish it from your dashboard when ready."}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-primary/5 rounded-card p-6 border-2 border-primary/10">
        <h3 className="text-lg font-display font-bold text-primary mb-4">
          {language === "am" ? "ማጠቃለያ" : "Summary"}
        </h3>
        <div className="space-y-3 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {language === "am" ? "የተመረጠ እቅድ:" : "Selected Plan:"}
            </span>
            <span className="font-bold text-primary">
              {PRICING_TIERS.find((t) => t.id === selectedTier)?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {language === "am" ? "ዋጋ:" : "Cost:"}
            </span>
            <span className="font-bold text-primary">
              {selectedTier === "deckhand"
                ? language === "am"
                  ? "ነፃ"
                  : "FREE"
                : `ETB ${
                    PRICING_TIERS.find((t) => t.id === selectedTier)?.price.toLocaleString()
                  }`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {language === "am" ? "ሁኔታ:" : "Status:"}
            </span>
            <span className="font-bold text-primary">
              {formData.publishNow !== false
                ? language === "am"
                  ? "ወዲያውኑ ንቁ"
                  : "Active Immediately"
                : language === "am"
                ? "ረቂቅ"
                : "Draft"}
            </span>
          </div>
        </div>
      </div>

      {/* Final Note */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-mono">
          {language === "am" ? (
            <>
              "አትም" የሚለውን ጠቅ በማድረግ የእኛን{" "}
              <a href="/terms" className="text-accent hover:underline">
                የአገልግሎት ውሎች
              </a>{" "}
              እና{" "}
              <a href="/privacy" className="text-accent hover:underline">
                የግላዊነት ፖሊሲ
              </a>{" "}
              ተቀብለዋል።
            </>
          ) : (
            <>
              By clicking "Publish", you agree to our{" "}
              <a href="/terms" className="text-accent hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </a>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
