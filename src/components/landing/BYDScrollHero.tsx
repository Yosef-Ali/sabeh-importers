"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, Phone, Calendar, ChevronDown, Sparkles, Zap, Shield, Battery, Car, Leaf } from "lucide-react";

// ============================================
// VIDEO/TAB CONFIGURATION
// ============================================
interface VideoConfig {
  id: string;
  name: string;
  nameAmharic: string;
  framePath: string;
  totalFrames: number;
  icon: React.ReactNode;
  color: string;
  tagline: string;
  specs: {
    range: string;
    charge: string;
    feature: string;
  };
}

const VIDEO_CONFIGS: VideoConfig[] = [
  {
    id: "seal",
    name: "BYD Seal",
    nameAmharic: "ቢዋይዲ ሲል",
    framePath: "/frames/byd_",
    totalFrames: 192,
    icon: <Car className="h-4 w-4" />,
    color: "from-cyan-500 to-blue-500",
    tagline: "Premium Electric Sedan",
    specs: { range: "650km", charge: "30min", feature: "Blade Battery" },
  },
  {
    id: "atto3",
    name: "BYD Atto 3",
    nameAmharic: "ቢዋይዲ አቶ 3",
    framePath: "/frames2/byd2_",
    totalFrames: 192,
    icon: <Leaf className="h-4 w-4" />,
    color: "from-green-500 to-emerald-500",
    tagline: "Electric Compact SUV",
    specs: { range: "480km", charge: "35min", feature: "e-Platform 3.0" },
  },
];

const AUTO_SWITCH_INTERVAL = 8000;

interface BYDScrollHeroProps {
  containerHeight?: string;
}

export function BYDScrollHero({ containerHeight = "400vh" }: BYDScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [activeTab, setActiveTab] = useState(0);
  const [isAutoSwitching, setIsAutoSwitching] = useState(true);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentConfig = VIDEO_CONFIGS[activeTab];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, currentConfig.totalFrames - 1]);

  // Auto-switch tabs
  useEffect(() => {
    if (!isAutoSwitching) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % VIDEO_CONFIGS.length);
    }, AUTO_SWITCH_INTERVAL);
    return () => clearInterval(interval);
  }, [isAutoSwitching]);

  // Stop auto-switch on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value > 0.05) setIsAutoSwitching(false);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Preload images
  useEffect(() => {
    setIsLoading(true);
    setLoadedCount(0);
    const imageArray: HTMLImageElement[] = [];
    let loadCount = 0;

    for (let i = 1; i <= currentConfig.totalFrames; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(3, "0");
      img.src = `${currentConfig.framePath}${frameNumber}.jpg`;
      img.onload = () => {
        loadCount++;
        setLoadedCount(loadCount);
        if (loadCount === currentConfig.totalFrames) setIsLoading(false);
      };
      img.onerror = () => {
        loadCount++;
        setLoadedCount(loadCount);
        if (loadCount === currentConfig.totalFrames) setIsLoading(false);
      };
      imageArray.push(img);
    }
    setImages(imageArray);
  }, [activeTab, currentConfig]);

  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = images[Math.floor(index)];
    if (!canvas || !ctx || !img || !img.complete) return;

    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  }, [images]);

  useEffect(() => {
    if (images.length === 0) return;
    let animationId: number;
    const unsubscribe = frameIndex.on("change", (latestFrame) => {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(() => renderFrame(latestFrame));
    });
    renderFrame(0);
    return () => { unsubscribe(); cancelAnimationFrame(animationId); };
  }, [frameIndex, images, renderFrame]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(frameIndex.get());
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [frameIndex, renderFrame]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setIsAutoSwitching(false);
  };

  const loadingProgress = Math.round((loadedCount / currentConfig.totalFrames) * 100);

  return (
    <div ref={containerRef} className="relative" style={{ height: containerHeight }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        
        {/* ============================================ */}
        {/* LOADING SCREEN - Sabeh Branded */}
        {/* ============================================ */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
            {/* Ethiopian Pattern Border */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full" style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  #D4AF37 0px,
                  #D4AF37 2px,
                  transparent 2px,
                  transparent 20px
                )`
              }} />
            </div>
            
            {/* Sabeh Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative text-center"
            >
              {/* Amharic Name - Primary */}
              <div className="font-amharic text-5xl font-bold tracking-wide text-amber-400 md:text-7xl">
                ሳቤህ
              </div>
              <div className="mt-1 text-xl font-light tracking-[0.3em] text-white/80 md:text-2xl">
                IMPORTERS
              </div>
              
              {/* Divider */}
              <div className="mx-auto my-6 h-px w-32 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
              
              {/* Loading Product */}
              <div className="text-sm tracking-widest text-gray-500">
                Presenting {currentConfig.name}
              </div>
            </motion.div>

            {/* Loading Bar */}
            <div className="mt-8">
              <div className="h-0.5 w-48 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="mt-3 text-xs tracking-widest text-gray-600">
                {loadingProgress}%
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className={`h-full w-full transition-opacity duration-700 ${isLoading ? "opacity-0" : "opacity-100"}`}
        />

        {/* Tabs moved to bottom NOW FEATURING section */}

        {/* Hero CTA - Sabeh Focused */}
        <SabehHeroCTA 
          scrollProgress={smoothProgress} 
          isLoading={isLoading} 
          config={currentConfig}
          activeTab={activeTab}
          isAutoSwitching={isAutoSwitching}
          onTabClick={handleTabClick}
        />

        {/* Feature Callout */}
        <FeatureCallout scrollProgress={smoothProgress} config={currentConfig} />

        {/* Final CTA */}
        <FinalCTA scrollProgress={smoothProgress} />

        {/* Scroll Indicator */}
        {!isLoading && <ScrollIndicator scrollProgress={smoothProgress} />}
      </div>
    </div>
  );
}

// ============================================
// SABEH HERO CTA - Company is the Star
// ============================================
interface SabehHeroCTAProps {
  scrollProgress: ReturnType<typeof useSpring>;
  isLoading: boolean;
  config: VideoConfig;
  activeTab: number;
  isAutoSwitching: boolean;
  onTabClick: (index: number) => void;
}

function SabehHeroCTA({ scrollProgress, isLoading, config, activeTab, isAutoSwitching, onTabClick }: SabehHeroCTAProps) {
  const opacity = useTransform(scrollProgress, [0, 0.18], [1, 0]);
  const y = useTransform(scrollProgress, [0, 0.18], [0, -80]);

  return (
    <AnimatePresence mode="wait">
      {!isLoading && (
        <motion.div
          key={config.id}
          className="pointer-events-auto absolute inset-0 z-20"
          style={{ opacity, y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          
          {/* Main Content - Left Aligned, Asymmetric */}
          <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 md:px-12 lg:px-20">
            
            {/* Top Badge - Subtle */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="h-px w-12 bg-amber-400" />
              <span className="text-xs font-medium tracking-[0.25em] text-amber-400/80">
                ETHIOPIA&apos;S PREMIER IMPORTER
              </span>
            </motion.div>

            {/* ============================================ */}
            {/* DRAMATIC TYPOGRAPHY - Sabeh as Hero */}
            {/* ============================================ */}
            <div className="max-w-4xl">
              {/* Amharic Name - MASSIVE, Primary Focus */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative"
              >
                <h1 className="font-amharic text-[4rem] font-bold leading-none tracking-wide text-white sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
                  ሳቤህ
                </h1>
                {/* Gold accent line */}
                <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 md:w-32" />
              </motion.div>

              {/* English Name - Secondary but Bold */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-4 md:mt-6"
              >
                <span className="text-2xl font-extralight tracking-[0.4em] text-white/90 sm:text-3xl md:text-4xl lg:text-5xl">
                  IMPORTERS
                </span>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/60 md:mt-8 md:text-lg"
              >
                Bringing the world&apos;s finest electric vehicles to Ethiopia. 
                <span className="font-amharic text-amber-400/80"> የዓለምን ምርጥ የኤሌክትሪክ መኪናዎች ወደ ኢትዮጵያ እናመጣለን።</span>
              </motion.p>
            </div>

            {/* ============================================ */}
            {/* CTA BUTTONS - Premium Feel */}
            {/* ============================================ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-12"
            >
              {/* Primary CTA - WhatsApp */}
              <a
                href="https://wa.me/251912345678?text=Hello%20Sabeh%20Importers!%20I'm%20interested%20in%20your%20electric%20vehicles."
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-none border border-amber-400 bg-amber-400 px-8 py-4 text-sm font-semibold tracking-wider text-black transition-all hover:bg-amber-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>CONTACT US</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              {/* Secondary CTA */}
              <a
                href="tel:+251912345678"
                className="group inline-flex items-center justify-center gap-3 border border-white/20 bg-transparent px-8 py-4 text-sm font-medium tracking-wider text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                <Phone className="h-4 w-4 text-amber-400" />
                <span>+251 91 234 5678</span>
              </a>
            </motion.div>

            {/* ============================================ */}
            {/* PRODUCT TABS - Bottom Section */}
            {/* ============================================ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-12 border-t border-white/10 pt-6 md:mt-16"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Label */}
                <div className="flex items-center gap-4">
                  <div className="text-xs tracking-widest text-white/40">NOW FEATURING</div>
                  <div className="hidden h-px w-12 bg-white/10 sm:block" />
                </div>
                
                {/* Tab Buttons */}
                <div className="flex items-center gap-2">
                  {VIDEO_CONFIGS.map((tabConfig, index) => (
                    <button
                      key={tabConfig.id}
                      onClick={() => onTabClick(index)}
                      className={`group relative flex items-center gap-2 border px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                        activeTab === index
                          ? "border-amber-400/50 bg-amber-400/10 text-white"
                          : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
                      }`}
                    >
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                        activeTab === index 
                          ? `bg-gradient-to-r ${tabConfig.color}` 
                          : "bg-white/30"
                      }`} />
                      <span>{tabConfig.name}</span>
                      <span className="font-amharic text-white/40">{tabConfig.nameAmharic}</span>
                      
                      {/* Auto-switch progress */}
                      {activeTab === index && isAutoSwitching && (
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-amber-400"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: AUTO_SWITCH_INTERVAL / 1000, ease: "linear" }}
                          key={`progress-${index}`}
                        />
                      )}
                    </button>
                  ))}
                  
                  {/* Auto indicator */}
                  {isAutoSwitching && (
                    <div className="ml-2 flex items-center gap-1 text-[10px] text-amber-400/60">
                      <span className="animate-pulse">●</span>
                      <span className="tracking-wider">AUTO</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// FEATURE CALLOUT - Mid Scroll
// ============================================
interface FeatureCalloutProps {
  scrollProgress: ReturnType<typeof useSpring>;
  config: VideoConfig;
}

function FeatureCallout({ scrollProgress, config }: FeatureCalloutProps) {
  const opacity = useTransform(scrollProgress, [0.32, 0.38, 0.58, 0.64], [0, 1, 1, 0]);
  const y = useTransform(scrollProgress, [0.32, 0.38, 0.58, 0.64], [40, 0, 0, -40]);
  const x = useTransform(scrollProgress, [0.32, 0.38, 0.58, 0.64], [60, 0, 0, -60]);

  return (
    <motion.div
      className="pointer-events-auto absolute inset-0 flex items-center justify-end px-6 md:px-12 lg:px-20"
      style={{ opacity, y }}
    >
      <motion.div 
        className="w-full max-w-md border border-white/10 bg-black/80 p-8 backdrop-blur-2xl md:p-10"
        style={{ x }}
      >
        {/* Sabeh Brand Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="font-amharic text-lg font-bold text-amber-400">ሳቤህ</div>
          <div className="h-px flex-1 bg-white/10" />
          <div className="text-xs tracking-widest text-white/40">EXCLUSIVE</div>
        </div>

        {/* Product Name */}
        <h3 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          {config.name}
        </h3>
        <p className="mt-1 font-amharic text-sm text-amber-400/60">
          {config.nameAmharic}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          {config.tagline}. Experience revolutionary technology with exceptional safety and performance.
        </p>

        {/* Specs - Minimal Grid */}
        <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
          <div>
            <div className="text-2xl font-bold text-white">{config.specs.range}</div>
            <div className="mt-1 text-xs tracking-wider text-white/40">RANGE</div>
          </div>
          <div className="border-x border-white/10 px-4">
            <div className="text-2xl font-bold text-white">{config.specs.charge}</div>
            <div className="mt-1 text-xs tracking-wider text-white/40">CHARGE</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">{config.specs.feature}</div>
            <div className="mt-1 text-xs tracking-wider text-white/40">TECH</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex gap-3">
          <a
            href={`https://wa.me/251912345678?text=Hi%20Sabeh!%20I'm%20interested%20in%20the%20${encodeURIComponent(config.name)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 bg-amber-400 px-4 py-3 text-xs font-semibold tracking-wider text-black transition-colors hover:bg-amber-300"
          >
            <MessageCircle className="h-4 w-4" />
            INQUIRE
          </a>
          <a
            href="tel:+251912345678"
            className="flex flex-1 items-center justify-center gap-2 border border-white/20 px-4 py-3 text-xs font-medium tracking-wider text-white transition-colors hover:bg-white/5"
          >
            <Phone className="h-4 w-4" />
            CALL
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// FINAL CTA - Sabeh Closing Statement
// ============================================
interface FinalCTAProps {
  scrollProgress: ReturnType<typeof useSpring>;
}

function FinalCTA({ scrollProgress }: FinalCTAProps) {
  const opacity = useTransform(scrollProgress, [0.78, 0.86, 1], [0, 1, 1]);
  const y = useTransform(scrollProgress, [0.78, 0.86], [60, 0]);
  const scale = useTransform(scrollProgress, [0.78, 0.86], [0.95, 1]);

  return (
    <motion.div
      className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center px-6"
      style={{ opacity, y, scale }}
    >
      {/* Full overlay */}
      <motion.div className="absolute inset-0 bg-black/85 backdrop-blur-sm" style={{ opacity }} />

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center">
        {/* Ethiopian decorative element */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/50" />
          <div className="text-2xl">🇪🇹</div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/50" />
        </div>

        {/* Main Message */}
        <h2 className="font-amharic text-4xl font-bold text-amber-400 md:text-6xl lg:text-7xl">
          ሳቤህ ኢምፖርተርስ
        </h2>
        <p className="mt-4 text-xl font-extralight tracking-[0.3em] text-white/80 md:text-2xl">
          SABEH IMPORTERS
        </p>
        
        <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-white/50">
          Your trusted partner for premium electric vehicles in Ethiopia. 
          Experience the future of mobility with us.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://wa.me/251912345678?text=Hello%20Sabeh%20Importers!%20I%20want%20to%20learn%20more%20about%20your%20electric%20vehicles."
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-amber-400 px-10 py-4 text-sm font-bold tracking-wider text-black transition-all hover:bg-amber-300"
          >
            <MessageCircle className="h-5 w-5" />
            START YOUR JOURNEY
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="tel:+251912345678"
            className="flex items-center gap-3 border border-white/20 px-10 py-4 text-sm font-medium tracking-wider text-white transition-all hover:border-amber-400/50 hover:bg-white/5"
          >
            <Phone className="h-5 w-5 text-amber-400" />
            +251 91 234 5678
          </a>
        </div>

        {/* Trust Elements */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs tracking-wider text-white/30">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400/50" />
            <span>AUTHORIZED DEALER</span>
          </div>
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400/50" />
            <span>FULL WARRANTY</span>
          </div>
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400/50" />
            <span>FREE TEST DRIVE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// SCROLL INDICATOR
// ============================================
interface ScrollIndicatorProps {
  scrollProgress: ReturnType<typeof useSpring>;
}

function ScrollIndicator({ scrollProgress }: ScrollIndicatorProps) {
  const opacity = useTransform(scrollProgress, [0, 0.08], [1, 0]);
  const y = useTransform(scrollProgress, [0, 0.08], [0, 20]);

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      style={{ opacity, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="mb-3 text-[10px] tracking-[0.3em] text-white/30">
          SCROLL TO EXPLORE
        </span>
        <div className="flex flex-col items-center gap-1">
          <div className="h-8 w-px bg-gradient-to-b from-amber-400/50 to-transparent" />
          <ChevronDown className="h-4 w-4 text-amber-400/50" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BYDScrollHero;
