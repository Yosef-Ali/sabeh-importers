"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  images: string[];
  city: string;
  condition?: string;
  isFeatured?: boolean;
  seller?: {
    name: string;
    isVerified?: boolean;
  };
}

interface PremiumCarouselProps {
  listings: any[];
}

export function PremiumCarousel({ listings }: PremiumCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || listings.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listings.length);
    }, 7000); // Auto-advance every 7 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, listings.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + listings.length) % listings.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % listings.length);
    setIsAutoPlaying(false);
  };

  if (listings.length === 0) return null;

  const visibleListings = listings.slice(0, Math.min(4, listings.length));

  return (
    <section className="py-16 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#1a2d4a] mb-2">
              Premium Featured Listings
            </h2>
            <p className="text-gray-600">
              Hand-picked luxury items from verified sellers
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="h-10 w-10 rounded-full border-[#FCDD09]/30 hover:bg-[#FCDD09]/10 hover:border-[#FCDD09]"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="h-10 w-10 rounded-full border-[#FCDD09]/30 hover:bg-[#FCDD09]/10 hover:border-[#FCDD09]"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden rounded-2xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {visibleListings.map((listing) => (
              <div key={listing.id} className="min-w-full">
                <div className="relative h-[500px] bg-white rounded-2xl overflow-hidden shadow-xl">
                  {/* Image */}
                  <div className="relative h-[350px]">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-[#1a2d4a] to-[#2d4a6f]" />
                    )}

                    {/* Featured Badge */}
                    {listing.isFeatured && (
                      <div className="absolute top-6 left-6 bg-[#FCDD09] text-[#1a2d4a] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg">
                        ✨ Premium Featured
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-6 right-6 flex gap-2">
                      <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg">
                        <Heart className="h-5 w-5 text-[#1a2d4a]" />
                      </button>
                      <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg">
                        <Share2 className="h-5 w-5 text-[#1a2d4a]" />
                      </button>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#1a2d4a] mb-2">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                          {listing.seller?.isVerified && (
                            <span className="flex items-center gap-1 text-[#FCDD09]">
                              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                <path d="M10 0L12.39 7.61L20 10L12.39 12.39L10 20L7.61 12.39L0 10L7.61 7.61L10 0Z" />
                              </svg>
                              Verified Seller
                            </span>
                          )}
                          <span>•</span>
                          <span>{listing.city}</span>
                          {listing.condition && (
                            <>
                              <span>•</span>
                              <span>{listing.condition.replace("_", " ")}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-4xl font-bold text-[#1a2d4a] tabular-nums mb-2">
                          {new Intl.NumberFormat("en-ET", {
                            style: "currency",
                            currency: listing.currency || "ETB",
                            maximumFractionDigits: 0,
                          }).format(Number(listing.price))}
                        </div>
                        <Link href={`/listings/${listing.id}`}>
                          <Button className="bg-[#FCDD09] hover:bg-[#e5c908] text-[#1a2d4a] font-bold">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {visibleListings.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentIndex
                  ? "w-8 bg-[#FCDD09]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
