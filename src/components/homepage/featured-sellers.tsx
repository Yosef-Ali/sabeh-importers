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
    <section className="py-16 px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCDD09]/20">
              <CheckCircle2 className="h-5 w-5 text-[#FCDD09]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1a2d4a]">
              Verified Premium Sellers
            </h2>
          </div>
          <p className="text-gray-600 ml-13">
            Top-rated sellers with verified badges and excellent reviews
          </p>
        </div>
        <Link href="/sellers">
          <Button variant="outline" className="border-[#FCDD09]/30 text-[#1a2d4a] hover:bg-[#FCDD09]/10 hover:border-[#FCDD09]">
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {FEATURED_SELLERS.map((seller) => (
          <Link
            key={seller.id}
            href={`/users/${seller.id}`}
            className="group bg-white rounded-xl border border-gray-100 p-5 text-center hover:border-[#FCDD09]/50 hover:shadow-lg transition-all"
          >
            {/* Avatar */}
            <div className="relative mx-auto mb-3">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#2d4a6f] flex items-center justify-center text-2xl font-bold text-white shadow-md ring-4 ring-[#FCDD09]/20 group-hover:ring-[#FCDD09]/40 transition-all mx-auto">
                {seller.name[0]}
              </div>
              {seller.isVerified && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#FCDD09] flex items-center justify-center border-2 border-white shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1a2d4a]" />
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="font-bold text-sm text-[#1a2d4a] mb-2 truncate group-hover:text-[#FCDD09] transition-colors">
              {seller.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="h-3.5 w-3.5 fill-[#FCDD09] text-[#FCDD09]" />
              <span className="text-sm font-bold text-[#1a2d4a]">{seller.rating}</span>
            </div>

            {/* Stats */}
            <p className="text-xs text-gray-500">
              {seller.totalListings} listings
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
