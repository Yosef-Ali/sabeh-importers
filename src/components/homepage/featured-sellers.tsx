"use client";

import Link from "next/link";
import { Star, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Seller {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalListings: number;
  isVerified: boolean;
}

// Mock data - replace with real API call
const FEATURED_SELLERS: Seller[] = [
  { id: "1", name: "Abebe Motors", rating: 5.0, totalListings: 45, isVerified: true },
  { id: "2", name: "Luxury Homes ET", rating: 4.9, totalListings: 32, isVerified: true },
  { id: "3", name: "Premium Cars", rating: 4.8, totalListings: 67, isVerified: true },
  { id: "4", name: "Elite Properties", rating: 5.0, totalListings: 28, isVerified: true },
  { id: "5", name: "Tech Hub Ethiopia", rating: 4.9, totalListings: 54, isVerified: true },
  { id: "6", name: "Fashion Forward", rating: 4.7, totalListings: 41, isVerified: true },
];

export function FeaturedSellers() {
  return (
    <section className="py-24 px-8 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-12 border-b-2 border-primary pb-8">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-none bg-accent shadow-hard-navy">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-4xl font-display font-bold text-primary uppercase tracking-tighter">
              Verified Authority Partners
            </h2>
          </div>
          <p className="text-primary/50 font-mono text-xs uppercase tracking-widest pl-14">
            Authorized entities within the Sabeh Maritime Registry with Grade-A clearance.
          </p>
        </div>
        <Link href="/sellers">
          <button className="bg-primary text-white px-8 py-3 rounded-none font-mono text-[10px] font-bold uppercase tracking-widest shadow-hard-yellow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            Access Directory
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {FEATURED_SELLERS.map((seller) => (
          <Link
            key={seller.id}
            href={`/users/${seller.id}`}
            className="group bg-white rounded-none border-2 border-primary/10 p-6 text-center hover:border-accent hover:shadow-hard-navy transition-all"
          >
            {/* Avatar */}
            <div className="relative mx-auto mb-6">
              <div className="h-20 w-20 rounded-none bg-primary flex items-center justify-center text-3xl font-display font-bold text-accent shadow-hard transition-all mx-auto">
                {seller.name[0]}
              </div>
              {seller.isVerified && (
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-none bg-accent flex items-center justify-center border-2 border-primary shadow-hard-navy">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="font-display font-bold text-sm text-primary mb-3 uppercase tracking-tighter group-hover:text-accent transition-colors truncate">
              {seller.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-3 bg-primary/5 py-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-xs font-mono font-bold text-primary">{seller.rating}</span>
            </div>

            {/* Stats */}
            <p className="text-[10px] font-mono text-primary/40 uppercase tracking-widest">
              Manifest: {seller.totalListings} Units
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
