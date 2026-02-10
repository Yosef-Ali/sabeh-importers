"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Show navbar only after leaving hero section (hero is 350vh tall)
      // Trigger at 3x viewport height (near end of hero)
      setIsScrolled(window.scrollY > window.innerHeight * 3.2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Products", href: "/products" },
    { label: "Inventory", href: "/inventory" },
    { label: "Distributors", href: "/distributors" },
    { label: "About", href: "#" },
  ];

  return (
    <>
      {/* Navbar - Always visible, background changes on scroll */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 px-6 py-4 transition-all duration-500 ease-out ${
          isScrolled 
            ? "border-b border-white/10 bg-black/90 backdrop-blur-xl" 
            : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* ============================================ */}
          {/* LOGO - Sabeh Brand */}
          {/* ============================================ */}
          <Link href="/" className="group flex items-center gap-3">
            {/* Logo Mark */}
            <div className="flex h-10 items-center border border-amber-400/30 bg-amber-400/5 px-4 transition-all group-hover:border-amber-400/50 group-hover:bg-amber-400/10">
              <span className="font-amharic text-lg font-bold text-amber-400">
                ሳቤህ
              </span>
            </div>
            {/* Text */}
            <div className="hidden flex-col md:flex">
              <span className="text-sm font-medium tracking-wider text-white">
                IMPORTERS
              </span>
              <span className="font-amharic text-xs text-white/40">
                ኢምፖርተርስ
              </span>
            </div>
          </Link>

          {/* ============================================ */}
          {/* NAVIGATION LINKS - Desktop */}
          {/* ============================================ */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-xs font-medium tracking-wider text-white/50 transition-all hover:text-white"
              >
                {item.label.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* ============================================ */}
          {/* ACTION BUTTONS */}
          {/* ============================================ */}
          <div className="flex items-center gap-3">
            {/* Phone - Desktop Only */}
            <a 
              href="tel:+251912345678"
              className="hidden items-center gap-2 px-4 py-2 text-xs tracking-wider text-white/50 transition-all hover:text-amber-400 lg:flex"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+251 91 234 5678</span>
            </a>
            
            {/* Divider */}
            <div className="hidden h-6 w-px bg-white/10 lg:block" />
            
            {/* Sign In */}
            <Link 
              href="/login"
              className="border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium tracking-wider text-white transition-all hover:border-white/20 hover:bg-white/10"
            >
              SIGN IN
            </Link>
            
            {/* Dashboard - Primary CTA */}
            <Link 
              href="/dashboard"
              className="hidden bg-amber-400 px-5 py-2.5 text-xs font-semibold tracking-wider text-black transition-all hover:bg-amber-300 md:block"
            >
              DASHBOARD
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* MOBILE MENU */}
      {/* ============================================ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[73px] z-40 border-b border-white/10 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col p-6">
              {/* Nav Links */}
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 border-b border-white/5 py-4 text-sm font-medium tracking-wider text-white/70 transition-all hover:text-white"
                  >
                    <div className="h-1 w-1 rounded-full bg-amber-400/50" />
                    {item.label.toUpperCase()}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile CTA */}
              <div className="mt-6 flex flex-col gap-3">
                <Link 
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center bg-amber-400 py-3 text-xs font-semibold tracking-wider text-black transition-all hover:bg-amber-300"
                >
                  ACCESS DASHBOARD
                </Link>
                <a 
                  href="tel:+251912345678"
                  className="flex items-center justify-center gap-2 border border-white/10 py-3 text-xs tracking-wider text-white transition-all hover:bg-white/5"
                >
                  <Phone className="h-4 w-4 text-amber-400" />
                  +251 91 234 5678
                </a>
              </div>
              
              {/* Brand Footer */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/30">
                <span className="font-amharic text-amber-400/50">ሳቤህ</span>
                <span>•</span>
                <span className="tracking-wider">ETHIOPIA&apos;S PREMIER IMPORTER</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
