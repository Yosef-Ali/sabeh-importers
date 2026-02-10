import React from "react";

export function ProposalCover() {
  return (
    <section className="relative mx-auto flex min-h-[297mm] w-full max-w-[210mm] flex-col justify-between overflow-hidden bg-gradient-to-b from-proposal-navy-deep via-proposal-navy-primary to-proposal-navy-light shadow-2xl print:m-0 print:h-screen print:w-screen print:shadow-none">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c9a962\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 p-12 md:p-[60px]">
        <div className="flex items-center gap-4">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-proposal-gold-primary text-proposal-navy-deep shadow-lg">
            <svg
              viewBox="0 0 24 24"
              className="h-[36px] w-[36px] fill-current"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="font-cormorant text-3xl font-bold tracking-[2px] text-white drop-shadow-md">
            YOSEF ALI
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-12 md:px-[60px]">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-[1px] w-12 bg-proposal-gold-primary"></div>
          <div className="text-[11px] font-bold uppercase tracking-[4px] text-proposal-gold-primary">
            Business Proposal
          </div>
        </div>
        
        <h1 className="mb-4 font-cormorant text-[64px] font-bold leading-[1.1] text-white drop-shadow-xl">
          Sabeh Importer
        </h1>
        <p className="mb-12 font-cormorant text-[32px] italic text-proposal-gold-light">
          Web & Mobile Application Development
        </p>
        
        <div className="mb-12 h-0.5 w-full max-w-[200px] bg-gradient-to-r from-proposal-gold-primary to-transparent"></div>

        <div className="grid max-w-[600px] grid-cols-2 gap-[40px] text-white">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-proposal-gold-primary">
              Date
            </div>
            <div className="font-cormorant text-lg text-white/90">January 20, 2026</div>
          </div>
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-proposal-gold-primary">
              Valid Until
            </div>
            <div className="font-cormorant text-lg text-white/90">February 20, 2026</div>
          </div>
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-proposal-gold-primary">
              Project Duration
            </div>
            <div className="font-cormorant text-lg text-white/90">14 Weeks</div>
          </div>
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-proposal-gold-primary">
              Deliverables
            </div>
            <div className="font-cormorant text-lg text-white/90">Web, Android & iOS Apps</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between bg-black/40 backdrop-blur-sm p-10 md:px-[60px] md:py-10 border-t border-white/10">
        <div className="text-sm text-white/80">
          Prepared by <strong className="font-semibold text-white block text-lg font-cormorant">Yosef Ali</strong>
          <span className="text-xs text-proposal-gold-light mt-1 block">Software Development Consultant</span>
        </div>
        <div className="text-right">
          <div className="mb-1 text-[10px] uppercase tracking-[2px] text-proposal-gold-primary font-bold">
            Total Investment
          </div>
          <div className="font-cormorant text-[40px] font-bold text-proposal-gold-light leading-none drop-shadow-lg">
            300,000 <span className="text-2xl font-normal text-white/80">ETB</span>
          </div>
        </div>
      </div>
    </section>
  );
}
