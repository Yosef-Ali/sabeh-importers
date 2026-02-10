import React from "react";

export function ExecutiveSummary() {
  return (
    <section className="relative mx-auto my-5 flex min-h-[297mm] w-full max-w-[210mm] flex-col bg-white px-12 py-20 shadow-2xl print:m-0 print:h-screen print:w-screen print:shadow-none md:px-[60px]">
      {/* Decor - Top Right */}
      <div className="absolute right-0 top-0 h-[150px] w-[150px] bg-gradient-to-bl from-proposal-navy-primary/5 to-transparent"></div>
      
      {/* Header */}
      <div className="mb-16 flex items-center justify-between border-b border-proposal-cream-dark pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-proposal-navy-primary text-proposal-gold-primary">
            <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px] fill-current"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-proposal-navy-primary">
            Sabeh Importer Proposal
          </span>
        </div>
        <span className="font-cormorant text-sm font-semibold text-proposal-text-muted">02</span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h2 className="mb-8 font-cormorant text-[42px] font-bold leading-tight text-proposal-navy-primary">
          Executive Summary
        </h2>
        
        <div className="space-y-6 text-[16px] leading-[1.8] text-proposal-text-muted font-light">
          <p>
            We are pleased to submit this proposal for the comprehensive development of Sabeh Importer’s digital ecosystem. In today's rapidly evolving market, establishing a robust digital presence is not just an option but a necessity for growth and customer retention.
          </p>
          <p>
            Our objective is to deliver a <strong className="font-semibold text-proposal-navy-primary">state-of-the-art E-commerce platform</strong> that seamlessly integrates a high-performance Web Application with native Android and iOS mobile apps. This solution is designed to empower Sabeh Importer to streamline operations, expand market reach, and provide an exceptional user experience to your customers.
          </p>
          <p>
            By leveraging modern technologies and Ethiopian-centric design principles, we aim to create a digital identity that reflects the prestige of your brand while ensuring practical utility for your logistics and sales operations.
          </p>
        </div>

        <div className="mt-12 rounded-xl bg-proposal-cream p-8 border border-proposal-gold-light/30">
          <h3 className="mb-4 font-cormorant text-2xl font-semibold text-proposal-navy-primary">
             Why This Solution?
          </h3>
          <ul className="space-y-3">
             {[
               "Unified system for Web, Android, and iOS.",
               "Tailored specifically for the Ethiopian market (Bilingual, Local Payments).",
               "Scalable architecture prepared for future growth.",
               "Premium, brand-aligned user interface design."
             ].map((item, i) => (
               <li key={i} className="flex items-start gap-3 text-sm text-proposal-text-dark">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-proposal-gold-primary flex-shrink-0"></span>
                  {item}
               </li>
             ))}
          </ul>
        </div>
      </div>

      {/* Action Button (Visual only for print/pdf context, but interactive for web) */}
      <div className="mt-12 flex justify-center">
        <a href="/deliverables" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-proposal-navy-primary to-proposal-navy-light px-10 py-4 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
          <span className="relative z-10 font-medium tracking-wide">View Deliverables</span>
          <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <div className="absolute inset-0 bg-white/20 translate-y-full skew-y-12 transition-transform group-hover:translate-y-0"></div>
        </a>
      </div>

      {/* Footer Footer */}
      <div className="mt-auto flex items-center justify-between opacity-60 pt-10">
        <span className="text-[10px] text-proposal-text-muted">
          Confidential Business Proposal
        </span>
        <span className="text-[10px] text-proposal-text-muted">
          Sabeh Importer
        </span>
      </div>
    </section>
  );
}
