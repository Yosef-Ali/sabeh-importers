"use client";

import { motion } from "framer-motion";
import { Search, MapPin, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function HeroSearch() {
  return (
    <section className="bg-navy h-[600px] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Image */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 hero-premium z-0"></div>

      {/* Abstract Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none z-0" 
        style={{ 
          backgroundImage: "radial-gradient(#FCDD09 1px, transparent 1px)", 
          backgroundSize: "40px 40px" 
        }}
      ></div>
      
      <div className="relative z-10 w-full max-w-[1000px] flex flex-col gap-8 items-center text-center">
        
        {/* Animated Text Content */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 border border-accent/40 bg-accent/10 px-6 py-2 rounded-full mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(252,221,9,0.1)] hover:bg-accent/20 transition-colors cursor-default"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-accent font-mono text-sm uppercase tracking-widest font-bold">
              የኢትዮጵያ ምርጥ የገበያ መድረክ
            </span>
          </motion.div>

          <h1 className="font-amharic font-bold text-6xl md:text-8xl text-white mb-6 leading-tight drop-shadow-2xl">
            የሚፈልጉትን <span className="text-gradient-gold relative inline-block">
              ንብረት
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span> በቀላሉ ያግኙ
          </h1>
          
          <p className="text-white/80 font-body text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            ተሽከርካሪዎች፣ ማሽነሪዎች እና የንግድ እቃዎች በታላቅ ቅናሽ እና በታማኝነት በመገበያየት ጊዜ ይቆጥቡ።
          </p>
        </motion.div>

        {/* Animated Search Bar - Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row w-full shadow-2xl glass-search rounded-lg overflow-hidden z-20 p-2 gap-2 md:gap-0 hover:shadow-gold/5 transition-shadow duration-500"
        >
          <div className="flex-1 flex items-center px-6 h-[72px] bg-white/5 rounded-md md:rounded-r-none border border-white/10 md:border-none focus-within:bg-white/10 transition-all group">
            <Search className="text-white/60 text-2xl mr-4 shrink-0 group-focus-within:text-accent transition-colors" />
            <Input 
              className="w-full h-full border-none focus-visible:ring-0 text-lg font-display placeholder:text-white/40 bg-transparent p-0 text-white selection:bg-accent/30" 
              placeholder="ምን ይፈልጋሉ? (ለምሳሌ፦ መኪና፣ ጄኔሬተር...)" 
              type="text"
            />
          </div>
          
          <div className="h-[72px] md:border-l border-white/10 flex items-center px-6 min-w-[200px] bg-white/5 rounded-md md:rounded-none hover:bg-white/10 transition-colors">
            <MapPin className="text-white/60 mr-3 shrink-0" />
            <Select defaultValue="all">
              <SelectTrigger className="w-full border-none focus:ring-0 text-white font-bold text-lg bg-transparent p-0 shadow-none h-auto">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-navy/95 border-white/10 text-white backdrop-blur-xl">
                <SelectItem value="all" className="focus:bg-white/10 focus:text-accent cursor-pointer">ሁሉም ቦታዎች</SelectItem>
                <SelectItem value="et-aa" className="focus:bg-white/10 focus:text-accent cursor-pointer">አዲስ አበባ</SelectItem>
                <SelectItem value="ae-dxb" className="focus:bg-white/10 focus:text-accent cursor-pointer">ዱባይ</SelectItem>
                <SelectItem value="uk-ldn" className="focus:bg-white/10 focus:text-accent cursor-pointer">ለንደን</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="bg-accent h-[72px] px-12 font-bold text-navy text-lg uppercase tracking-wider hover:bg-accent/90 transition-all rounded-md md:rounded-l-none shadow-lg hover:shadow-accent/20 active:scale-[0.98] hover-lift"
          >
            ፈልግ
          </Button>
        </motion.div>

        {/* Animated CTAs */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex gap-6 mt-4 items-center"
        >
            <Button className="h-12 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full backdrop-blur-sm transition-all hover:scale-105 group">
              <Package className="mr-2 h-5 w-5 group-hover:text-gold transition-colors" /> 
              ንብረት ያስመዝግቡ
            </Button>
            <Button variant="link" className="text-gold hover:text-white text-lg font-medium group">
              ተጨማሪ መረጃ 
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
        </motion.div>

      </div>
    </section>
  );
}
