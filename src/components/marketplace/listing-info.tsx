import { CheckCircle2 } from "lucide-react";
import { TopActions, SellerActions } from "./listing-actions";

interface ListingInfoProps {
  listing: any;
}

export function ListingInfo({ listing }: ListingInfoProps) {
  const attributes = listing.attributes || {};
  const attributeKeys = Object.keys(attributes);

  return (
    <div className="space-y-8">
      {/* Price & Primary Action */}
      <div className="rounded-none border-4 border-foreground bg-card p-8 shadow-hard-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 px-4 py-1 bg-gold text-navy font-mono text-[8px] font-bold uppercase tracking-widest shadow-hard">
          LIVE_QUOTATION
        </div>

        <p className="text-5xl font-display font-bold text-foreground tabular-nums tracking-tighter">
          {new Intl.NumberFormat('en-ET', { style: 'currency', currency: listing.currency || 'ETB', maximumFractionDigits: 0 }).format(Number(listing.price))}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {listing.negotiable && (
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest bg-muted p-3 border border-border">
              <span className="w-2 h-2 bg-gold flex-shrink-0" />
              NEGOTIABLE_PROTOCOL: ACTIVE
            </div>
          )}
          <SellerActions sellerPhone={listing.seller?.phone} />
        </div>
      </div>

      {/* Specifications */}
      <div className="rounded-none border-2 border-border bg-card p-8 shadow-hard relative">
        <h3 className="text-[10px] font-mono font-bold text-primary-foreground bg-foreground inline-block px-3 py-1 uppercase tracking-[0.2em] mb-8">
          ASSET_SPECIFICATIONS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-none border border-border">
            <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Registry_Condition</p>
            <p className="font-display font-bold text-foreground uppercase">
              {listing.condition?.replace("_", " ") || "CLASSIFIED"}
            </p>
          </div>
          <div className="p-4 bg-muted rounded-none border border-border">
            <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Sector_Classification</p>
            <p className="font-display font-bold text-foreground uppercase">{listing.category?.name || "UNASSIGNED"}</p>
          </div>
          {attributeKeys.slice(0, 8).map((key) => (
            <div key={key} className="p-4 bg-muted rounded-none border border-border">
              <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                {key.replace(/_/g, " ")}
              </p>
              <p className="font-display font-bold text-foreground uppercase truncate">{String(attributes[key])}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-none border-2 border-border bg-card p-8 shadow-hard">
        <h3 className="text-[10px] font-mono font-bold text-foreground uppercase tracking-[0.2em] mb-6 border-b-2 border-border pb-2">
          OPERATIONAL_DESCRIPTION
        </h3>
        <div className="prose prose-sm max-w-none text-muted-foreground font-sans leading-relaxed whitespace-pre-line">
          {listing.description}
        </div>
      </div>

      {/* Seller Credentials — intentionally always dark */}
      <div className="rounded-none border-4 border-gold bg-navy p-8 shadow-hard-navy text-white">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-16 w-16 rounded-none bg-gold flex items-center justify-center text-2xl font-display font-bold text-navy shadow-hard">
            {listing.seller?.name?.[0] || "A"}
          </div>
          <div>
            <p className="font-display font-bold text-xl uppercase tracking-tighter text-white">{listing.seller?.name || "AUTHORITY_PARTNER"}</p>
            <div className="flex items-center gap-2 text-[10px] text-gold font-mono font-bold uppercase tracking-widest mt-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>VERIFIED_MANIFEST_ENTITY</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <span>REGISTRY_ENTRY: {new Date(listing.seller?.createdAt || listing.createdAt).getFullYear()}</span>
          <TopActions listingId={listing.id} listingTitle={listing.title} />
        </div>
      </div>
    </div>
  );
}
