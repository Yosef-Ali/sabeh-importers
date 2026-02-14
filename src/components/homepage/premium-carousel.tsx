"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Share2, Eye, CheckCircle2, MapPin } from "lucide-react";
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
    <section className="py-24 bg-background grid-blueprint border-y-2 border-primary/5">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-center justify-between mb-12 border-l-8 border-accent pl-8">
          <div>
            <h2 className="text-4xl font-display font-bold text-primary uppercase tracking-tighter mb-2">
              Priority_Featured_Manifest
            </h2>
            <p className="font-mono text-xs text-primary/40 uppercase tracking-widest">
              Selected high-clearance assets from verified industrial suppliers.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="h-14 w-14 rounded-none border-primary/20 hover:bg-accent hover:text-primary transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="h-14 w-14 rounded-none border-primary/20 hover:bg-accent hover:text-primary transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden rounded-none border-4 border-primary shadow-hard-navy"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {visibleListings.map((listing) => (
              <div key={listing.id} className="min-w-full">
                <div className="relative h-[600px] bg-white flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative h-[300px] md:h-full md:flex-1 bg-primary">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        priority
                      />
                    ) : (
                      <div className="h-full bg-hero-authority" />
                    )}

                    {/* Featured Badge */}
                    {listing.isFeatured && (
                      <div className="absolute top-8 left-8 bg-accent text-primary px-6 py-2 rounded-none text-[10px] font-mono font-bold uppercase tracking-[0.3em] shadow-hard-navy">
                        PRIORITY_MANIFEST
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-8 right-8 flex flex-col gap-3">
                      <button className="h-12 w-12 rounded-none bg-primary/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all hover:bg-accent hover:text-primary">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-10 md:p-16 md:w-[450px] flex flex-col justify-center bg-white border-l border-primary/5">
                    <div className="flex flex-col h-full">
                      <div className="mb-auto">
                        <div className="flex items-center gap-2 mb-6">
                           <span className="font-mono text-[10px] bg-primary/5 px-2 py-1 text-primary/40 uppercase">Vessel_ID: {listing.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <h3 className="text-4xl font-display font-bold text-primary mb-6 uppercase tracking-tighter leading-none">
                          {listing.title}
                        </h3>
                        <div className="flex flex-wrap gap-6 text-xs text-primary/50 font-mono uppercase tracking-widest mb-10">
                          {listing.seller?.isVerified && (
                            <span className="flex items-center gap-2 text-accent bg-primary px-3 py-1">
                              <CheckCircle2 className="h-3 w-3" />
                              VERIFIED_ENTITY
                            </span>
                          )}
                          <span className="flex items-center gap-2">
                             <MapPin className="h-3 w-3" />
                             {listing.city.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-12 pt-12 border-t-4 border-primary/5">
                        <div className="text-4xl font-display font-bold text-primary mb-8 tabular-nums tracking-tighter">
                          {new Intl.NumberFormat("en-ET", {
                            style: "currency",
                            currency: listing.currency || "ETB",
                            maximumFractionDigits: 0,
                          }).format(Number(listing.price))}
                        </div>
                        <Link href={`/listings/${listing.id}`}>
                          <button className="w-full bg-accent text-primary py-4 rounded-none font-display font-bold uppercase tracking-widest shadow-hard-navy hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                             Commence_Inspection
                          </button>
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
        <div className="flex justify-center gap-4 mt-12">
          {visibleListings.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 transition-all rounded-none",
                index === currentIndex
                  ? "w-16 bg-accent"
                  : "w-4 bg-primary/10 hover:bg-primary/20"
              )}
              aria-label={`Go to manifest ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
