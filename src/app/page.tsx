import React from "react";
import { ProposalCover } from "@/components/proposal/ProposalCover";
import { ExecutiveSummary } from "@/components/proposal/ExecutiveSummary";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-proposal-cream font-montserrat text-proposal-text-dark antialiased">
      {/* Page 1: Cover Page */}
      <ProposalCover />

      {/* Page 2: Executive Summary */}
      <ExecutiveSummary />
    </main>
  );
}

