"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Phone,
  Share2,
  Flag,
  Heart,
  CheckCircle,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SellerInfo {
  id: string;
  name: string;
  avatar?: string | null;
  verified?: boolean;
  rating?: number;
  totalRatings?: number;
  memberSince?: Date | null;
  location?: string | null;
  totalListings?: number;
}

interface SellerCardProps {
  seller: SellerInfo;
  listingId: string;
  language?: "en" | "am";
  className?: string;
}

export function SellerCard({
  seller,
  listingId,
  language = "en",
  className,
}: SellerCardProps) {
  const memberSinceDate = seller.memberSince
    ? new Date(seller.memberSince).toLocaleDateString(
        language === "am" ? "am-ET" : "en-US",
        { year: "numeric", month: "short" }
      )
    : null;

  return (
    <div
      className={cn(
        "bg-card rounded-card border border-border shadow-card p-6 space-y-6",
        "sticky top-24",
        className
      )}
    >
      {/* Seller Profile */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-muted flex-shrink-0">
            {seller.avatar ? (
              <Image
                src={seller.avatar}
                alt={seller.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-navy text-white font-display font-bold text-xl">
                {seller.name.charAt(0).toUpperCase()}
              </div>
            )}
            {seller.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center border-2 border-card shadow-hard">
                <CheckCircle className="h-4 w-4 text-navy" />
              </div>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/users/${seller.id}`}
              className="font-display font-bold text-lg text-foreground hover:text-gold transition-colors line-clamp-1"
            >
              {seller.name}
            </Link>

            {/* Rating */}
            {seller.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-sm text-foreground">
                  {seller.rating.toFixed(1)}
                </span>
                {seller.totalRatings && (
                  <span className="text-xs text-muted-foreground font-mono">
                    ({seller.totalRatings})
                  </span>
                )}
              </div>
            )}

            {/* Member Since */}
            {memberSinceDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono mt-1">
                <Calendar className="h-3 w-3" />
                {language === "am" ? "አባል ከ" : "Member since"} {memberSinceDate}
              </div>
            )}

            {/* Location */}
            {seller.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono mt-1">
                <MapPin className="h-3 w-3" />
                {seller.location}
              </div>
            )}
          </div>
        </div>

        {/* Total Listings */}
        {seller.totalListings !== undefined && (
          <div className="bg-muted/50 rounded-button p-3 text-center">
            <div className="text-2xl font-display font-bold text-primary">
              {seller.totalListings}
            </div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
              {language === "am" ? "ጠቅላላ ዝርዝሮች" : "Total Listings"}
            </div>
          </div>
        )}
      </div>

      {/* Contact Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-display font-bold text-foreground uppercase tracking-wide">
          {language === "am" ? "አግኝ" : "Contact Seller"}
        </h3>

        {/* Chat Button */}
        <Button
          variant="accent"
          size="lg"
          className="w-full font-display font-bold shadow-hard-navy"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          {language === "am" ? "መልዕክት ላክ" : "Send Message"}
        </Button>

        {/* Call Button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full font-display font-semibold"
        >
          <Phone className="mr-2 h-5 w-5" />
          {language === "am" ? "ደውል" : "Call Now"}
        </Button>

        {/* WhatsApp Button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full font-display font-semibold text-green-600 hover:bg-green-50"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          {language === "am" ? "ዋትሳፕ" : "WhatsApp"}
        </Button>

        {/* Make Offer Button */}
        <Button
          variant="ghost"
          size="lg"
          className="w-full font-display font-semibold"
        >
          {language === "am" ? "ቀረጻ አቅርብ" : "Make an Offer"}
        </Button>
      </div>

      {/* Additional Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-xs font-mono"
        >
          <Heart className="mr-1.5 h-4 w-4" />
          {language === "am" ? "አስቀምጥ" : "Save"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-xs font-mono"
        >
          <Share2 className="mr-1.5 h-4 w-4" />
          {language === "am" ? "አጋራ" : "Share"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-xs font-mono text-destructive hover:text-destructive"
        >
          <Flag className="mr-1.5 h-4 w-4" />
          {language === "am" ? "ሪፖርት" : "Report"}
        </Button>
      </div>

      {/* Safety Notice */}
      <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-button">
        <p className="text-xs font-mono text-foreground leading-relaxed">
          {language === "am" ? (
            <>
              <strong>ደህንነት ጠቃሚ ምክር:</strong> ከመክፈል በፊት ሁልጊዜ በግል ይገናኙ እና
              እቃውን ይመርምሩ። ቅድመ ክፍያዎችን በፍጹም አይላኩ።
            </>
          ) : (
            <>
              <strong>Safety Tip:</strong> Always meet in person and inspect
              the item before paying. Never send advance payments.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
