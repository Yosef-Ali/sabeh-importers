"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#FCDD09 1px, transparent 1px), linear-gradient(90deg, #FCDD09 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner markers */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-[#FCDD09]/30" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-[#FCDD09]/30" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-[#FCDD09]/30" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-[#FCDD09]/30" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Link href="/">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[#0A192F] border border-[#FCDD09]/40">
                <Image src="/Sabeh_Logo_Icon.svg" alt="Sabeh" width={36} height={36} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white leading-tight">Sabeh Market</p>
                <p className="text-[10px] text-[#FCDD09]/60 font-amharic leading-tight">ሳቤህ ኢምፖርተርስ</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 404 number */}
        <div className="relative mb-2">
          <span
            className="select-none text-[160px] font-black leading-none text-[#FCDD09]/8 tracking-tighter"
            aria-hidden="true"
          >
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[80px] font-black leading-none tracking-tighter text-[#FCDD09]">
            404
          </span>
        </div>

        {/* Status line */}
        <div className="mb-4 inline-flex items-center gap-2 border border-[#FCDD09]/20 bg-[#FCDD09]/5 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FCDD09] animate-pulse" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#FCDD09]">
            Signal Lost — Page Not Found
          </span>
        </div>

        <h1 className="mt-3 text-2xl md:text-3xl font-bold text-white tracking-tight">
          Uncharted Waters
        </h1>
        <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist, has been moved,
          or requires different permissions.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-[#FCDD09] text-[#0A192F] hover:bg-[#FCDD09]/90 font-bold uppercase tracking-widest text-xs px-6 rounded-none h-11">
              <Home className="mr-2 h-4 w-4" />
              Go to Market
            </Button>
          </Link>
          <Link href="/search">
            <Button
              variant="outline"
              className="border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white font-bold uppercase tracking-widest text-xs px-6 rounded-none h-11"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Listings
            </Button>
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-10">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[#FCDD09] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go Back
          </button>
        </div>

        {/* Help links */}
        <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-center gap-6">
          <Link
            href="/dashboard"
            className="text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-white/10">·</span>
          <Link
            href="/login"
            className="text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
          >
            Sign In
          </Link>
          <span className="text-white/10">·</span>
          <Link
            href="/admin"
            className="text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
