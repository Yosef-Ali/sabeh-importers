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
    <section className="py-32 bg-primary grid-blueprint border-y border-white/5">
      <div className="max-w-5xl mx-auto px-8 text-center">
        <div className="mb-16">
          <div className="flex flex-col items-center gap-4 mb-4">
            <span className="font-mono text-[10px] text-accent tracking-[0.4em] uppercase">Transmission_Log</span>
            <h2 className="text-5xl font-display font-bold text-white uppercase tracking-tighter">
              Authority Activity Logs
            </h2>
          </div>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
            Intercepted communications from certified registry participants.
          </p>
        </div>

        <div className="relative">
          {/* Testimonial Card */}
          <div className="bg-white p-10 md:p-16 rounded-none border-4 border-accent shadow-hard-yellow max-w-3xl mx-auto text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 font-mono text-[60px] font-bold text-primary/5 leading-none select-none">LOG_{current.id}</div>
            
             {/* Header */}
             <div className="flex items-center gap-6 mb-10">
                <div className="h-20 w-20 rounded-none bg-primary flex items-center justify-center text-3xl font-display font-bold text-accent shadow-hard">
                  {current.name[0]}
                </div>
                <div>
                   <p className="font-display font-bold text-xl text-primary uppercase tracking-tighter">{current.name}</p>
                   <p className="text-xs font-mono text-primary/40 uppercase tracking-widest">Unit_Origin: {current.location.toUpperCase()}</p>
                </div>
             </div>

            {/* Stars */}
            <div className="flex gap-1 mb-8">
              {[...Array(current.rating)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-primary/5 flex items-center justify-center">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                </div>
              ))}
            </div>

            {/* Comment */}
            <p className="text-primary text-xl md:text-2xl leading-tight font-display font-bold uppercase tracking-tight mb-10 border-l-4 border-accent pl-6">
              "{current.comment}"
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-8 border-t border-primary/5 font-mono text-[10px] text-primary/30 uppercase tracking-[0.2em]">
               <span>Packet_Status: Verified</span>
               <span>Encryption: RSA_4096</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-16">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="h-14 w-14 rounded-none bg-white/5 text-white hover:bg-accent hover:text-primary border-white/10 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Dots */}
            <div className="flex gap-3">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 transition-all rounded-none ${
                    index === currentIndex
                      ? "w-12 bg-accent"
                      : "w-4 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Access log ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="h-14 w-14 rounded-none bg-white/5 text-white hover:bg-accent hover:text-primary border-white/10 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
