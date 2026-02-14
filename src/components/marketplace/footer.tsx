"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#0A192F] text-white pt-24 pb-12 font-body border-t-4 border-accent">
      <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
        {/* Brand Column */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-accent flex items-center justify-center rounded-none">
              <span className="material-symbols-outlined text-primary font-bold">anchor</span>
            </div>
            <span className="text-white text-2xl font-display font-bold uppercase tracking-tighter">Sabeh Authority</span>
          </div>
          <div className="space-y-4 mb-10">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-white/50 uppercase">Active Inventory:</span>
              <span className="font-mono text-xl font-bold text-accent">124,592</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-white/50 uppercase">Authority Status:</span>
              <span className="font-mono text-xl font-bold text-accent uppercase">Operational</span>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 border border-white/10 rounded-none flex items-center justify-center text-white/40 hover:text-accent hover:border-accent transition-all"
            >
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 border border-white/10 rounded-none flex items-center justify-center text-white/40 hover:text-accent hover:border-accent transition-all"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 border border-white/10 rounded-none flex items-center justify-center text-white/40 hover:text-accent hover:border-accent transition-all"
            >
              <span className="material-symbols-outlined text-lg">call</span>
            </a>
          </div>
        </div>

        {/* Marketplace */}
        <div className="md:col-span-2">
          <h5 className="font-mono text-xs font-bold uppercase text-accent mb-6">Manifest</h5>
          <ul className="space-y-3 font-display text-sm uppercase tracking-wide">
            <li><Link href="/search?category=motors" className="hover:text-accent transition-colors">Vessels</Link></li>
            <li><Link href="/search?category=industrial-equipment" className="hover:text-accent transition-colors">Equipment</Link></li>
            <li><Link href="/search?category=property" className="hover:text-accent transition-colors">Real Estate</Link></li>
            <li><Link href="/search" className="hover:text-accent transition-colors">Fleet Services</Link></li>
          </ul>
        </div>

        {/* Protocol */}
        <div className="md:col-span-2">
          <h5 className="font-mono text-xs font-bold uppercase text-accent mb-6">Protocol</h5>
          <ul className="space-y-3 font-display text-sm uppercase tracking-wide">
            <li><Link href="#" className="hover:text-accent transition-colors">Verification</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Arbitration</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Escrow</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Terms of Command</Link></li>
          </ul>
        </div>

        {/* Fleet Dispatch */}
        <div className="md:col-span-4 bg-white/5 p-8 border border-white/10">
          <h5 className="font-mono text-xs font-bold uppercase text-accent mb-6">Fleet Dispatch</h5>
          <p className="text-xs text-white/60 mb-6 font-mono leading-relaxed">Subscribe to the central command frequency for real-time asset liquidation alerts.</p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              className="bg-transparent border border-white/30 px-4 py-2 text-xs font-mono w-full focus:ring-0 focus:border-accent outline-none" 
              placeholder="COMMS_CHANNEL@MAIL.COM"
            />
            <button className="bg-accent text-primary px-4 font-bold uppercase text-[10px]">Signal</button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
        <p>© 2024 Sabeh Maritime Authority. All Rights Reserved. International Waters Registry.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Manual</Link>
          <Link href="#" className="hover:text-white transition-colors">Encryption</Link>
          <Link href="#" className="hover:text-white transition-colors">Protocols</Link>
        </div>
      </div>
    </footer>
  );
}
