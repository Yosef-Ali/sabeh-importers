import React from "react";

export function InvestmentPayment() {
  return (
    <section className="relative mx-auto my-5 min-h-[297mm] w-full max-w-[210mm] bg-white px-12 py-[50px] shadow-2xl print:m-0 print:h-screen print:w-screen print:shadow-none md:px-[60px]">
        {/* Decor Corner */}
      <div className="absolute right-0 top-0 h-[100px] w-[100px] bg-gradient-to-bl from-proposal-gold-primary/50 to-transparent opacity-10"></div>
      <div className="absolute bottom-0 left-[8px] h-[100px] w-[100px] bg-gradient-to-tr from-proposal-gold-primary/50 to-transparent opacity-10"></div>
        {/* Left Border Accent */}
      <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-proposal-gold-primary to-proposal-gold-dark text-proposal-text-dark"></div>

        {/* Header */}
      <div className="mb-[35px] flex items-center justify-between border-b border-proposal-cream-dark pb-[25px]">
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
        <span className="font-cormorant text-sm text-proposal-text-muted">04</span>
      </div>

      <h2 className="mb-2 font-cormorant text-[32px] font-semibold text-proposal-navy-primary">
        Investment
      </h2>
      <p className="mb-[30px] text-[13px] font-normal text-proposal-text-muted">
         Transparent pricing for complete digital solution
      </p>

        <div className="mb-[30px] overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-br from-proposal-navy-primary to-proposal-navy-light">
              <th className="px-[25px] py-[18px] text-left text-[11px] font-semibold uppercase tracking-[1.5px] text-proposal-gold-light">
                Item
              </th>
              <th className="px-[25px] py-[18px] text-right text-[11px] font-semibold uppercase tracking-[1.5px] text-proposal-gold-light">
                Cost (ETB)
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { item: "Web Application Development", cost: "110,000" },
              { item: "Android Application Development", cost: "75,000" },
               { item: "iOS Application Development", cost: "75,000" },
              { item: "UI/UX Design (All Platforms)", cost: "25,000" },
               { item: "Backend & API Development", cost: "15,000" },
            ].map((row, i) => (
              <tr key={i} className="border-b border-proposal-cream-dark last:border-0">
                <td className="px-[25px] py-4 text-[13px] text-proposal-text-dark">
                  {row.item}
                </td>
                <td className="px-[25px] py-4 text-right text-[13px] font-bold text-proposal-navy-primary">
                  {row.cost}
                </td>
              </tr>
            ))}
            <tr className="bg-proposal-cream-dark">
               <td className="px-[25px] py-4 text-[15px] font-bold text-proposal-navy-primary">
                  Total Investment
                </td>
                <td className="px-[25px] py-4 text-right font-cormorant text-xl font-bold text-proposal-gold-dark">
                  300,000 ETB
                </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mb-2 font-cormorant text-2xl font-semibold text-proposal-navy-primary">
        Payment Schedule
      </h2>
      <p className="mb-0 text-[13px] font-normal text-proposal-text-muted">
         Structured in 3 convenient phases
      </p>

      <div className="relative my-10 flex justify-between px-5">
          <div className="absolute left-[60px] right-[60px] top-[35px] h-[3px] bg-proposal-cream-dark"></div>
          {[
              { pct: "40%", label: "Phase 1", title: "Project Kickoff", amt: "120,000 ETB", sub: "Upon contract signing" },
               { pct: "30%", label: "Phase 2", title: "Development Midpoint", amt: "90,000 ETB", sub: "After web completion" },
              { pct: "30%", label: "Phase 3", title: "Final Delivery", amt: "90,000 ETB", sub: "After full deployment" },
          ].map((phase, i) => (
              <div key={i} className="relative z-10 flex flex-1 flex-col items-center text-center">
                  <div className="mb-[15px] flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full border-4 border-proposal-gold-primary bg-gradient-to-br from-proposal-navy-primary to-proposal-navy-light text-white">
                      <span className="font-cormorant text-[22px] font-bold leading-none">{phase.pct}</span>
                      <span className="text-[8px] uppercase tracking-widest text-proposal-gold-light">{phase.label}</span>
                  </div>
                  <h4 className="mb-[5px] font-cormorant text-base font-semibold text-proposal-navy-primary">{phase.title}</h4>
                  <div className="mb-[3px] text-sm font-semibold text-proposal-gold-dark">{phase.amt}</div>
                   <p className="text-[10px] text-proposal-text-muted">{phase.sub}</p>
              </div>
          ))}
      </div>

        <h2 className="mt-10 mb-2 font-cormorant text-2xl font-semibold text-proposal-navy-primary">
         Project Timeline
      </h2>
       <p className="mb-0 text-[13px] font-normal text-proposal-text-muted">
         14 weeks to complete delivery
      </p>

      <div className="my-[30px]">
        {[
            { step: "1", title: "Planning & Design", dur: "2 Weeks", desc: "Requirements gathering, UI/UX design, wireframes" },
             { step: "2", title: "Web Development", dur: "4 Weeks", desc: "Full web application with admin panel" },
             { step: "3", title: "Mobile Development", dur: "4 Weeks", desc: "Android & iOS applications" },
              { step: "4", title: "Testing, Deployment & Handover", dur: "4 Weeks", desc: "QA, app store submissions, training, documentation" },
        ].map((time, i, arr) => (
            <div key={i} className="mb-5 flex gap-5 last:mb-0">
                <div className="relative flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-proposal-navy-primary font-cormorant text-base font-semibold text-proposal-gold-primary">
                        {time.step}
                    </div>
                     {i !== arr.length - 1 && (
                         <div className="absolute bottom-[-20px] left-[19px] top-10 w-[2px] bg-proposal-cream-dark"></div>
                     )}
                </div>
                <div className="flex-1 rounded-[10px] border border-proposal-cream-dark bg-white px-5 py-[15px]">
                     <h4 className="mb-[3px] text-sm font-semibold text-proposal-navy-primary">{time.title}</h4>
                     <div className="text-[11px] font-medium text-proposal-gold-dark">{time.dur}</div>
                    <p className="mt-[5px] text-[11px] text-proposal-text-muted">{time.desc}</p>
                </div>
            </div>
        ))}
      </div>

       {/* Navigation Button */}
      <div className="mb-12 mt-8 flex justify-center">
        <a href="/terms" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-proposal-navy-primary to-proposal-navy-light px-10 py-4 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
          <span className="relative z-10 font-medium tracking-wide">View Terms & Signatures</span>
          <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <div className="absolute inset-0 bg-white/20 translate-y-full skew-y-12 transition-transform group-hover:translate-y-0"></div>
        </a>
      </div>

      <div className="absolute bottom-[30px] left-[60px] right-[60px] flex items-center justify-between border-t border-proposal-cream-dark pt-5">
         <span className="text-[10px] text-proposal-text-muted">
          Confidential Business Proposal
        </span>
         <span className="rounded-[20px] bg-proposal-navy-primary px-3.5 py-1.5 text-[10px] font-medium text-proposal-gold-light">
          Valid for 30 Days
        </span>
      </div>
    </section>
  );
}
