import { MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { TopActions, SellerActions } from "./listing-actions";

interface ListingInfoProps {
  listing: any; // Typed properly in production
}

export function ListingInfo({ listing }: ListingInfoProps) {
  const attributes = listing.attributes || {};
  const attributeKeys = Object.keys(attributes);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1a2d4a] leading-tight sm:text-3xl">{listing.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600">
               <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#FCDD09]" />
                {listing.location}, {listing.city}
               </span>
               <span className="text-gray-300">•</span>
               <span className="flex items-center gap-1.5 tabular-nums">
                <Calendar className="h-4 w-4 text-[#FCDD09]" />
                {new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
               </span>
            </div>
          </div>
          <TopActions listingId={listing.id} listingTitle={listing.title} />
        </div>

        {/* Price */}
        <div className="mt-6 pt-6 border-t border-gray-100">
           <p className="text-4xl font-extrabold text-[#1a2d4a] tabular-nums tracking-tight">
            {new Intl.NumberFormat('en-ET', { style: 'currency', currency: listing.currency || 'ETB', maximumFractionDigits: 0 }).format(Number(listing.price))}
           </p>
           {listing.negotiable && (
             <p className="text-sm font-semibold text-[#FCDD09] mt-2 uppercase tracking-wide">Negotiable Price</p>
           )}
        </div>
      </div>

      {/* Key Details / Attributes Grid */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#1a2d4a] uppercase tracking-wide mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          Specifications
        </h3>
        <div className="grid grid-cols-2 gap-3">
           <div className="p-4 bg-[#faf8f5] rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1" style={{ fontSize: '10px', letterSpacing: '0.15em' }}>Condition</p>
              <p className="font-semibold text-sm text-[#1a2d4a]">
                {listing.condition === 'NEW' ? 'Brand New' : listing.condition === 'LIKE_NEW' ? 'Like New' : listing.condition === 'USED_GOOD' ? 'Used - Good' : listing.condition === 'USED_FAIR' ? 'Used - Fair' : listing.condition?.replace("_", " ") || "N/A"}
              </p>
           </div>
           <div className="p-4 bg-[#faf8f5] rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1" style={{ fontSize: '10px', letterSpacing: '0.15em' }}>Category</p>
              <p className="font-semibold text-sm text-[#1a2d4a]">{listing.category?.name}</p>
           </div>
           {attributeKeys.slice(0, 6).map((key) => (
             <div key={key} className="p-4 bg-[#faf8f5] rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1 capitalize" style={{ fontSize: '10px', letterSpacing: '0.15em' }}>
                  {key.replace(/_/g, " ")}
                </p>
                <p className="font-semibold text-sm text-[#1a2d4a]">{String(attributes[key])}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#1a2d4a] uppercase tracking-wide mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
          Description
        </h3>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
          {listing.description}
        </div>
      </div>

      {/* Seller Actions Block */}
       <div className="rounded-xl border border-[#FCDD09]/30 bg-gradient-to-br from-white to-[#faf8f5] p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
             <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#2d4a6f] flex items-center justify-center text-2xl font-bold text-white shadow-md ring-4 ring-[#FCDD09]/20">
                {listing.seller?.name?.[0] || "S"}
             </div>
             <div>
                <p className="font-bold text-lg text-[#1a2d4a]">{listing.seller?.name || "Seller"}</p>
                <div className="flex items-center gap-1.5 text-xs text-[#FCDD09] font-bold uppercase tracking-wide">
                   <CheckCircle2 className="h-3.5 w-3.5" />
                   <span>Verified Seller</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Member since {new Date(listing.seller?.createdAt || listing.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
             </div>
          </div>

          <SellerActions sellerPhone={listing.seller?.phone} />
       </div>

    </div>
  );
}
