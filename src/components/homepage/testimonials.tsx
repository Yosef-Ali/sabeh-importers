"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Abebe Kebede",
    location: "Addis Ababa",
    rating: 5,
    comment: "Found my dream Mercedes C-Class in just 2 days! The verification process made me feel secure about the purchase.",
  },
  {
    id: 2,
    name: "Sara Tesfaye",
    location: "Bole",
    rating: 5,
    comment: "Sold my villa within a week at a great price. The premium listing feature really made a difference!",
  },
  {
    id: 3,
    name: "Dawit Haile",
    location: "CMC",
    rating: 5,
    comment: "Best marketplace in Ethiopia! Professional sellers, verified listings, and excellent customer support.",
  },
  {
    id: 4,
    name: "Helen Mekonnen",
    location: "Kazanchis",
    rating: 5,
    comment: "The app is so easy to use. I browse luxury items during my coffee breaks and found amazing deals!",
  },
  {
    id: 5,
    name: "Yonas Alemu",
    location: "Bishoftu",
    rating: 5,
    comment: "As a seller, the dashboard is incredibly helpful. I can track all my listings and communicate with buyers easily.",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    setIsAutoPlaying(false);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-[#1a2d4a] via-[#2d4a6f] to-[#1a2d4a]">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Quote className="h-8 w-8 text-[#FCDD09]" />
            <h2 className="text-3xl font-bold text-white">
              What Our Community Says
            </h2>
          </div>
          <p className="text-white/70">
            Join thousands of satisfied buyers and sellers
          </p>
        </div>

        <div className="relative">
          {/* Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#FCDD09] to-[#e5c908] flex items-center justify-center text-2xl font-bold text-[#1a2d4a] shadow-lg ring-4 ring-white/20">
                {current.name[0]}
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#FCDD09] text-[#FCDD09]" />
              ))}
            </div>

            {/* Comment */}
            <p className="text-white text-lg md:text-xl leading-relaxed mb-6 italic">
              "{current.comment}"
            </p>

            {/* Author */}
            <div className="text-white/90">
              <p className="font-bold text-lg">{current.name}</p>
              <p className="text-sm text-white/60">{current.location}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-[#FCDD09]"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
