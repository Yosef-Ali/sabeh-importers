"use client";

import React from "react";
import { ProposalCover } from "@/components/proposal/ProposalCover";
import { ExecutiveSummary } from "@/components/proposal/ExecutiveSummary";
import { ProjectDeliverables } from "@/components/proposal/ProjectDeliverables";
import { InvestmentPayment } from "@/components/proposal/InvestmentPayment";
import { TermsAndSignatures } from "@/components/proposal/TermsAndSignatures";

export default function ProposalPage() {
  return (
    <main className="min-h-screen bg-proposal-cream font-montserrat text-proposal-text-dark antialiased">
      {/* Page 1: Cover Page */}
      <ProposalCover />

      {/* Page 2: Executive Summary */}
      <ExecutiveSummary />

      <div id="deliverables"></div>

      {/* Page 2: Deliverables (Note: number mapping might be slightly off in comment but sections are correct) */}
      <ProjectDeliverables />

      {/* Page 3: Investment & Payment */}
      <InvestmentPayment />

      {/* Page 4: Terms & Signatures */}
      <TermsAndSignatures />
    </main>
  );
}
