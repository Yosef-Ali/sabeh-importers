"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-gold py-16">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy uppercase leading-tight">
            ንብረትዎን ዛሬ ያስመዝግቡ
          </h2>
          <p className="text-navy/70 text-lg mt-2 max-w-xl">
            Start selling to thousands of verified buyers across Ethiopia.
          </p>
        </div>
        <Link href="/my-listings">
          <Button className="h-14 px-10 bg-navy text-white font-bold text-lg uppercase tracking-wider hover:bg-navy-light rounded-sm transition-all group">
            Post Free Listing
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
