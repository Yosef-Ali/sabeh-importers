"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const mainImageRef = useRef<HTMLDivElement>(null);

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

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageList || imageList.length <= 1) return;

      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageList, isFullscreen]);

  // Mobile swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  if (!imageList || imageList.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-none border-2 border-primary/10 bg-primary/5 shadow-hard">
        <PlaceholderImage title={title} category={category} className="h-full" />
      </div>
    );
  }

  const currentImageFailed = failedImages.has(selectedIndex);

  return (
    <>
      <div className="space-y-6">
        {/* Main Image */}
        <div
          ref={mainImageRef}
          className="group relative aspect-[4/3] w-full overflow-hidden rounded-none bg-primary border-4 border-primary shadow-hard-navy touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {!currentImageFailed ? (
            <Image
              src={imageList[selectedIndex]}
              alt={`${title} - Image ${selectedIndex + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              priority
              onError={() => handleImageError(selectedIndex)}
            />
          ) : (
             <PlaceholderImage title={title} category={category} className="h-full" />
          )}

          {/* ... (rest of the component) ... */}

        {/* Thumbnails */}
        {imageList.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {imageList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-none border-2 transition-all duration-300",
                  selectedIndex === idx
                    ? "border-accent shadow-hard-navy scale-105 z-10"
                    : "border-primary/10 opacity-50 hover:opacity-100 hover:border-primary/30"
                )}
              >
                {!failedImages.has(idx) ? (
                  <Image
                    src={img}
                    alt={`${title} - Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(idx)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <PlaceholderImage category={category} className="h-full w-full opacity-50" iconClassName="h-8 w-8" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 backdrop-blur-md p-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-8 right-8 h-12 w-12 rounded-none bg-white text-primary border-4 border-accent shadow-hard-yellow hover:bg-accent"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative h-full w-full max-w-6xl border-4 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
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
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-8 top-1/2 -translate-y-1/2 h-16 w-16 rounded-none bg-white/10 border-2 border-white/20 text-white hover:bg-accent hover:text-primary hover:border-accent transition-all"
              >
                <ChevronLeft className="h-10 w-10" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="absolute right-8 top-1/2 -translate-y-1/2 h-16 w-16 rounded-none bg-white/10 border-2 border-white/20 text-white hover:bg-accent hover:text-primary hover:border-accent transition-all"
              >
                <ChevronRight className="h-10 w-10" />
              </Button>
            </>
          )}

          {/* Fullscreen Counter */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-accent text-primary px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest shadow-hard-navy">
            MANIFEST_OVERVIEW: {selectedIndex + 1} / {imageList.length}
          </div>
        </div>
      )}
    </>
  );
}
