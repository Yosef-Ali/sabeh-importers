"use client";

import { Button } from "@/components/ui/button";

/**
 * Mobile App section — Sabeh command-on-the-move story.
 *
 * Rewritten 2026-05 (FINDING-009): the previous version hit 4 of 7 hard
 * rejection triggers (4-up icon-grid + decorative blobs + rounded-full
 * CTAs + generic "Trade Anywhere" copy). The new section follows the
 * "one job per section" rule: one anchor (phone mock with the actual
 * app aesthetic), one headline, three specific specs, one primary CTA.
 */

const SPECS = [
  {
    num: "01",
    label: "Live Tracking",
    body: "GPS-grade asset position. Refresh interval under 60 seconds across the verified fleet.",
  },
  {
    num: "02",
    label: "Escrow-Released Payment",
    body: "Funds release only when the asset is verified received. No floating cash, no disputes.",
  },
  {
    num: "03",
    label: "Bid & Status Alerts",
    body: "Push notifications the moment an offer lands or the listing state changes. No inbox lag.",
  },
];

export function AppFeaturesSection() {
  return (
    <section className="bg-[#0A192F] overflow-hidden relative">
      {/* Blueprint dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#FFD700 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* ── Text column (7/12) ── */}
          <div className="lg:col-span-7 space-y-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 border border-[#FFD700]/40 px-4 py-1.5">
              <span className="h-1.5 w-1.5 bg-[#FFD700]" />
              <span className="text-[#FFD700] font-mono text-[10px] font-bold uppercase tracking-[0.25em]">
                Section 09 / Mobile Command
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-bold uppercase tracking-tight leading-[0.95]">
              Command from
              <br />
              <span className="text-[#FFD700]">any port.</span>
            </h2>

            {/* Supporting line — specific, not aspirational */}
            <p className="font-body text-base md:text-lg text-white/70 max-w-xl leading-relaxed">
              The Sabeh app puts your verified inventory, escrowed
              payments, and live status feed in your hand. Built for operators
              who can&apos;t sit at a desk all day.
            </p>

            {/* Numbered specs — Authority command-list, no icon-circle decoration */}
            <ul className="border-t border-white/10 divide-y divide-white/10">
              {SPECS.map((spec) => (
                <li key={spec.num} className="grid grid-cols-12 gap-6 py-6">
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFD700]">
                      {spec.num}
                    </span>
                  </div>
                  <div className="col-span-10 md:col-span-11">
                    <h3 className="font-display text-lg md:text-xl text-white font-bold uppercase tracking-tight mb-1.5">
                      {spec.label}
                    </h3>
                    <p className="font-body text-sm md:text-base text-white/60 leading-relaxed max-w-lg">
                      {spec.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Single primary CTA — one job per section */}
            <div className="pt-2">
              <Button size="lg">Get the app</Button>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mt-3">
                iOS &amp; Android · ~12 MB
              </p>
            </div>
          </div>

          {/* ── Phone mock column (5/12) ── */}
          <div className="lg:col-span-5 relative h-[640px] flex items-center justify-center">
            {/* Phone bezel — iPhone-like outline. Round corners are real
                hardware geometry, not Tailwind ornament. */}
            <div className="relative w-[300px] h-[600px] bg-[#0A0F1A] rounded-[42px] border-[10px] border-[#1a2332] shadow-hard-yellow overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-b-2xl z-10" />

              {/* Screen — Sabeh app surface (rounded-none everywhere, matches the design system) */}
              <div className="w-full h-full bg-[#0A192F] pt-10 px-4 pb-4 flex flex-col gap-3">
                {/* Status bar */}
                <div className="flex items-center justify-between font-mono text-[8px] font-bold uppercase tracking-widest text-white/60 px-1">
                  <span>9:41</span>
                  <span>SABEH · LIVE</span>
                </div>

                {/* Section eyebrow */}
                <div className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-[#FFD700] mt-2">
                  Active Inventory
                </div>

                {/* Headline KPI tile */}
                <div className="bg-[#FFD700] text-[#0A192F] p-3">
                  <div className="font-mono text-[8px] font-bold uppercase tracking-widest opacity-70">
                    Verified Assets
                  </div>
                  <div className="font-display text-2xl font-bold tracking-tight leading-none mt-1">
                    124,592
                  </div>
                </div>

                {/* Two list rows */}
                <div className="border border-white/10 p-3 space-y-1">
                  <div className="font-mono text-[8px] uppercase tracking-widest text-white/50">
                    Listing #A-44219
                  </div>
                  <div className="font-display text-xs font-bold text-white uppercase tracking-tight">
                    BYD Atto 3 · 2024
                  </div>
                  <div className="font-mono text-[8px] uppercase tracking-widest text-[#FFD700]">
                    Bid Received
                  </div>
                </div>
                <div className="border border-white/10 p-3 space-y-1">
                  <div className="font-mono text-[8px] uppercase tracking-widest text-white/50">
                    Listing #A-44218
                  </div>
                  <div className="font-display text-xs font-bold text-white uppercase tracking-tight">
                    Komatsu PC200
                  </div>
                  <div className="font-mono text-[8px] uppercase tracking-widest text-white/50">
                    In Transit
                  </div>
                </div>

                {/* Footer CTA — sharp corners, matches Sabeh button */}
                <div className="mt-auto bg-[#FFD700] text-[#0A192F] py-3 flex items-center justify-center font-display font-bold uppercase tracking-wider text-xs">
                  Open Bid Sheet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
