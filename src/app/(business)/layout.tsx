import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SabehLogo } from "@/components/sabeh-logo";

/**
 * Layout for business documents (proposal, deliverables, investment).
 * Minimal "command bar" header with the Sabeh logo and a back-to-home link.
 *
 * These pages are sales artifacts — readers land via direct link and need
 * exactly one navigation affordance: the way back to the marketing site.
 * No category nav, no search, no CTAs. Stay out of the document's way.
 */
export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body antialiased">
      <header className="sticky top-0 z-40 w-full bg-[#0A192F] border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <SabehLogo withWordmark priority />
          <Link
            href="/"
            className="group flex items-center gap-2 text-white/70 hover:text-[#FFD700] font-mono text-[11px] font-bold uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Sabeh</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
