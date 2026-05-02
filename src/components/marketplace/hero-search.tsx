"use client";

import { motion } from "framer-motion";
import { Search, MapPin, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function HeroSearch() {
  return (
    <section className="bg-[#0A192F] h-[600px] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Blueprint dot-grid background — replaces glassmorphism/radial gradients */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,215,0,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Subtle navy-to-navy vignette — industrial, not luxury */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(10,25,47,0) 0%, rgba(10,25,47,0.6) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1000px] flex flex-col gap-8 items-center text-center">

        {/* Status badge — rounded-none, border-only, Space Mono */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 border border-accent/40 bg-transparent px-6 py-2 rounded-none cursor-default"
        >
          <span className="w-2 h-2 rounded-none bg-accent animate-pulse inline-block" />
          <span className="text-accent font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
            የኢትዮጵያ ምርጥ የገበያ መድረክ
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="font-amharic font-bold text-5xl md:text-7xl text-white leading-tight">
            የሚፈልጉትን{" "}
            <span className="text-[#FFD700] relative inline-block">
              የንግድ እቃዎች
              {/* Underline accent line — SVG kept minimal, just a straight line */}
              <svg
                className="absolute w-full h-2 -bottom-1 left-0"
                viewBox="0 0 100 4"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="2" x2="100" y2="2" stroke="#FFD700" strokeWidth="2" />
              </svg>
            </span>{" "}
            በቀላሉ ያግኙ
          </h1>
          <p className="text-white/70 font-body text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            ተሽከርካሪዎች፣ ማሽነሪዎች እና የንግድ እቃዎች በታላቅ ቅናሽ እና በታማኝነት በመገበያየት ጊዜ ይቆጥቡ።
          </p>
        </motion.div>

        {/* Search bar — rounded-none, solid border, shadow-hard-yellow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col md:flex-row w-full rounded-none border border-white/20 overflow-hidden z-20"
          style={{ boxShadow: "4px 4px 0px #FFD700" }}
        >
          {/* Keyword input */}
          <div className="flex-1 flex items-center px-5 h-[68px] bg-white/4 border-b md:border-b-0 md:border-r border-white/10 group focus-within:bg-white/8 transition-colors">
            <Search className="text-white/50 h-5 w-5 mr-3 flex-shrink-0 group-focus-within:text-accent transition-colors" />
            <Input
              className="w-full h-full border-none focus-visible:ring-0 focus-visible:border-none focus-visible:shadow-none text-base font-display placeholder:text-white/35 bg-transparent p-0 text-white"
              placeholder="ምን ይፈልጋሉ? (ለምሳሌ፦ መኪና፣ ጄኔሬተር...)"
              type="text"
            />
          </div>

          {/* Location select */}
          <div className="h-[68px] flex items-center px-5 min-w-[200px] bg-white/4 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/8 transition-colors">
            <MapPin className="text-white/50 h-4 w-4 mr-2 flex-shrink-0" />
            <Select defaultValue="all">
              <SelectTrigger className="w-full border-none focus:shadow-none focus:border-none text-white font-display font-bold text-base bg-transparent p-0 h-auto shadow-none rounded-none">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A192F] border-white/10 text-white rounded-none">
                <SelectItem value="all"  className="focus:bg-white/10 focus:text-accent">ሁሉም ቦታዎች</SelectItem>
                <SelectItem value="et-aa" className="focus:bg-white/10 focus:text-accent">አዲስ አበባ</SelectItem>
                <SelectItem value="ae-dxb" className="focus:bg-white/10 focus:text-accent">ዱባይ</SelectItem>
                <SelectItem value="uk-ldn" className="focus:bg-white/10 focus:text-accent">ለንደን</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search button — rounded-none, hover translate not scale */}
          <button
            className="bg-accent h-[68px] px-12 font-display font-bold text-primary text-sm uppercase tracking-wider rounded-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:opacity-90 flex-shrink-0"
          >
            ፈልግ
          </button>
        </motion.div>

        {/* Secondary CTAs — rounded-none, no rounded-full */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex gap-4 mt-2 items-center flex-wrap justify-center"
        >
          <button className="h-11 px-8 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-none font-display font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2">
            <Package className="h-4 w-4" />
            የንግድ እቃዎች ያስመዝግቡ
          </button>
          <button className="text-accent hover:text-white text-sm font-display font-bold uppercase tracking-wider transition-colors flex items-center gap-2 group">
            ተጨማሪ መረጃ
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
