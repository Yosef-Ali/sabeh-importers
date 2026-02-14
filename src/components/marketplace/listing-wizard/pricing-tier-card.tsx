"use client";

import { Check, Crown, Anchor, Ship } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PricingTier {
  id: "deckhand" | "officer" | "captain";
  name: string;
  nameAm: string;
  price: number;
  duration: string;
  durationAm: string;
  features: Array<{ text: string; textAm: string; included: boolean }>;
  recommended?: boolean;
}

interface PricingTierCardProps {
  tier: PricingTier;
  selected: boolean;
  onSelect: () => void;
  language?: "en" | "am";
}

const TIER_ICONS = {
  deckhand: Anchor,
  officer: Ship,
  captain: Crown,
};

const TIER_COLORS = {
  deckhand: "border-muted hover:border-primary/30",
  officer: "border-accent/50 hover:border-accent",
  captain: "border-primary hover:border-primary",
};

export function PricingTierCard({
  tier,
  selected,
  onSelect,
  language = "en",
}: PricingTierCardProps) {
  const Icon = TIER_ICONS[tier.id];
  const isFree = tier.price === 0;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative bg-white rounded-card border-2 p-6 cursor-pointer transition-all shadow-card hover:shadow-card-hover",
        selected ? "border-accent shadow-hard-navy" : TIER_COLORS[tier.id],
        tier.recommended && "ring-2 ring-accent ring-offset-4"
      )}
    >
      {/* Recommended Badge */}
      {tier.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-button text-xs font-bold font-mono shadow-hard">
          {language === "am" ? "የተመከረ" : "RECOMMENDED"}
        </div>
      )}

      {/* Selected Indicator */}
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-hard">
          <Check className="h-4 w-4 text-primary" />
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-button flex items-center justify-center mb-4",
          tier.id === "captain" && "bg-primary",
          tier.id === "officer" && "bg-accent",
          tier.id === "deckhand" && "bg-muted"
        )}
      >
        <Icon
          className={cn(
            "h-7 w-7",
            tier.id === "captain" && "text-accent",
            tier.id === "officer" && "text-primary",
            tier.id === "deckhand" && "text-muted-foreground"
          )}
        />
      </div>

      {/* Tier Name */}
      <h3 className="text-2xl font-display font-bold text-primary mb-2">
        {language === "am" ? tier.nameAm : tier.name}
      </h3>

      {/* Price */}
      <div className="mb-4">
        {isFree ? (
          <div className="text-3xl font-display font-bold text-primary">
            {language === "am" ? "ነፃ" : "FREE"}
          </div>
        ) : (
          <>
            <div className="text-3xl font-display font-bold text-primary">
              ETB {tier.price.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {language === "am" ? tier.durationAm : tier.duration}
            </div>
          </>
        )}
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-6">
        {tier.features.map((feature, index) => (
          <li
            key={index}
            className={cn(
              "flex items-start gap-2 text-sm",
              feature.included ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <Check
              className={cn(
                "h-4 w-4 mt-0.5 flex-shrink-0",
                feature.included ? "text-accent" : "text-muted"
              )}
            />
            <span>
              {language === "am" ? feature.textAm : feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Select Button */}
      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        variant={selected ? "accent" : "outline"}
        className="w-full font-display font-bold"
        size="lg"
      >
        {selected
          ? language === "am"
            ? "ተመርጧል"
            : "Selected"
          : language === "am"
          ? "ምረጥ"
          : "Select Plan"}
      </Button>
    </div>
  );
}

// Preset tier configurations
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "deckhand",
    name: "Deckhand",
    nameAm: "መርከበኛ",
    price: 0,
    duration: "30 days active",
    durationAm: "ለ30 ቀናት ንቁ",
    features: [
      {
        text: "Basic listing visibility",
        textAm: "መሰረታዊ የዝርዝር ታይነት",
        included: true,
      },
      {
        text: "Up to 5 photos",
        textAm: "እስከ 5 ፎቶዎች",
        included: true,
      },
      {
        text: "Standard search placement",
        textAm: "መደበኛ የፍለጋ አቀማመጥ",
        included: true,
      },
      {
        text: "Featured badge",
        textAm: "የቀረበ ባጅ",
        included: false,
      },
      {
        text: "Priority support",
        textAm: "ቅድሚያ የሚሰጠው ድጋፍ",
        included: false,
      },
    ],
  },
  {
    id: "officer",
    name: "Officer",
    nameAm: "ኦፊሰር",
    price: 500,
    duration: "per listing, 60 days",
    durationAm: "በዝርዝር፣ ለ60 ቀናት",
    recommended: true,
    features: [
      {
        text: "Featured badge on listing",
        textAm: "በዝርዝር ላይ የቀረበ ባጅ",
        included: true,
      },
      {
        text: "Up to 10 photos",
        textAm: "እስከ 10 ፎቶዎች",
        included: true,
      },
      {
        text: "Priority in search results",
        textAm: "በፍለጋ ውጤቶች ውስጥ ቅድሚያ",
        included: true,
      },
      {
        text: "60-day active period",
        textAm: "የ60 ቀን ንቁ ጊዜ",
        included: true,
      },
      {
        text: "Email notifications",
        textAm: "የኢሜይል ማሳወቂያዎች",
        included: true,
      },
    ],
  },
  {
    id: "captain",
    name: "Captain",
    nameAm: "ካፒቴን",
    price: 2000,
    duration: "per month, unlimited ads",
    durationAm: "በወር፣ ያልተወሰነ ማስታወቂያ",
    features: [
      {
        text: "Top homepage placement",
        textAm: "ከፍተኛ ቤት ገጽ አቀማመጥ",
        included: true,
      },
      {
        text: "Unlimited active listings",
        textAm: "ያልተወሰነ ንቁ ዝርዝሮች",
        included: true,
      },
      {
        text: "Unlimited photos per listing",
        textAm: "በዝርዝር ያልተወሰነ ፎቶዎች",
        included: true,
      },
      {
        text: "Advanced analytics dashboard",
        textAm: "የላቁ የትንታኔ ዳሽቦርድ",
        included: true,
      },
      {
        text: "Priority support & verification",
        textAm: "ቅድሚያ ድጋፍ እና ማረጋገጫ",
        included: true,
      },
    ],
  },
];
