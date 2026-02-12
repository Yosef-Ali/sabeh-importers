"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PlaceholderImage } from "./placeholder-image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingGalleryProps {
  images: string[] | null;
  title: string;
  category?: string;
}

export function ListingGallery({ images, title, category }: ListingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Safe fallback if images is null or empty
  const imageList = images && images.length > 0 ? images : null;

  const handlePrevious = () => {
    if (!imageList) return;
    setSelectedIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!imageList) return;
    setSelectedIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  if (!imageList) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-muted/30 shadow-sm">
        <PlaceholderImage title={title} category={category} className="h-full" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#faf8f5] border border-gray-100 shadow-lg transition-shadow hover:shadow-xl">
          <Image
            src={imageList[selectedIndex]}
            alt={`${title} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />

          {/* Image Counter Badge */}
          <div className="absolute bottom-4 right-4 rounded-lg bg-[#1a2d4a]/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
            {selectedIndex + 1} / {imageList.length}
          </div>

          {/* Navigation Arrows */}
          {imageList.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-[#1a2d4a] shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white hover:scale-110"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-[#1a2d4a] shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white hover:scale-110"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 h-10 w-10 rounded-lg bg-white/90 text-[#1a2d4a] shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white hover:scale-110"
          >
            <Expand className="h-4 w-4" />
          </Button>
        </div>

        {/* Thumbnails */}
        {imageList.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {imageList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative aspect-square h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
                  selectedIndex === idx
                    ? "border-[#FCDD09] opacity-100 ring-2 ring-[#FCDD09]/30 shadow-md scale-105"
                    : "border-gray-200 opacity-60 hover:opacity-100 hover:scale-105"
                )}
              >
                <Image
                  src={img}
                  alt={`${title} - Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2d4a]/95 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative h-[80vh] w-[90vw]">
            <Image
              src={imageList[selectedIndex]}
              alt={`${title} - Image ${selectedIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Fullscreen Navigation */}
          {imageList.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Fullscreen Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
            {selectedIndex + 1} / {imageList.length}
          </div>
        </div>
      )}
    </>
  );
}
