"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Smartphone, Route, ShieldCheck, Map } from "lucide-react";

export function AppFeaturesSection() {
  return (
    <section className="bg-navy overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: "radial-gradient(#FCDD09 1px, transparent 1px)", 
          backgroundSize: "32px 32px" 
        }}
      ></div>

      <div className="max-w-[1440px] mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-block border border-gold/30 bg-gold/10 px-4 py-1 rounded-full">
              <span className="text-gold font-mono text-xs uppercase tracking-widest font-bold">
                የሞባይል መተግበሪያ / Mobile App
              </span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-none uppercase">
              ንግድዎን <span className="text-gold">በየትኛውም ቦታ</span> ተቆጣጠሩ።
              <br/> 
              <span className="text-2xl md:text-3xl text-gray-400 mt-2 block normal-case font-light">Trade Anywhere, Monitor Everything.</span>
            </h2>
            
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              የሳቤህ ባለስልጣን የሞባይል መተግበሪያ ሙሉ የንግድ ስርዓቱን በእጅዎ ያደርጋል። ንብረቶችን ይከታተሉ፣ ግብይቶችን ይፈጽሙ እና መረጃዎችን በቅጽበት ያግኙ።
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <Route className="text-gold h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">ቀጥታ ክትትል (Live Tracking)</h3>
                  <p className="text-gray-400 text-sm">የንብረትዎን እንቅስቃሴ በጂፒኤስ ይከታተሉ።</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <ShieldCheck className="text-gold h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">ደህንነቱ የተጠበቀ (Secure)</h3>
                  <p className="text-gray-400 text-sm">ክፍያ የሚለቀቀው ንብረቱ ሲረጋገጥ ብቻ ነው።</p>
                </div>
              </div>

               <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <Smartphone className="text-gold h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">ፈጣን መልዕክት (Instant Alerts)</h3>
                  <p className="text-gray-400 text-sm">ስለ ጨረታ እና ሁኔታ ለውጦች ወዲያውኑ ይወቁ።</p>
                </div>
              </div>

               <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <Map className="text-gold h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">ካርታ (Interactive Map)</h3>
                  <p className="text-gray-400 text-sm">ንብረቶችን በዓለም አቀፍ ካርታ ላይ ይመልከቱ።</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button className="h-14 px-8 bg-gold hover:bg-gold-light text-navy font-bold text-lg rounded-full shadow-hard-yellow transition-transform hover:-translate-y-1">
                Download for iOS
              </Button>
              <Button variant="outline" className="h-14 px-8 border-2 border-white/20 text-white hover:bg-white/10 font-bold text-lg rounded-full backdrop-blur-sm transition-transform hover:-translate-y-1">
                Get Android App
              </Button>
            </div>
          </div>

          {/* Image/Phone Mockup Placeholder */}
          <div className="relative h-[600px] w-full flex items-center justify-center">
             {/* Abstract Phone Shape using CSS/Divs for now, typically an image */}
             <div className="relative w-[320px] h-[640px] bg-black rounded-[48px] border-[8px] border-gray-800 shadow-2xl overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-all duration-500 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl"></div>
                {/* Screen Content Simulation */}
                <div className="w-full h-full bg-slate-900 pt-12 px-4 pb-4 flex flex-col gap-4">
                   <div className="h-8 w-2/3 bg-white/10 rounded-full animate-pulse"></div>
                   <div className="h-32 w-full bg-navy rounded-xl border border-gold/20 p-4">
                      <div className="h-4 w-1/2 bg-white/20 rounded mb-2"></div>
                      <div className="h-8 w-3/4 bg-gold/20 rounded"></div>
                   </div>
                   <div className="h-20 w-full bg-white/5 rounded-xl border border-white/5"></div>
                   <div className="h-20 w-full bg-white/5 rounded-xl border border-white/5"></div>
                   <div className="mt-auto h-16 w-full bg-gold rounded-full flex items-center justify-center text-navy font-bold shadow-lg">
                      Start Trading
                   </div>
                </div>
             </div>
             
             {/* Decorative Elements around phone */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl -z-10"></div>
             <div className="absolute bottom-10 -right-10 w-40 h-40 bg-navy-light rounded-2xl rotate-12 -z-10 border border-white/5"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
