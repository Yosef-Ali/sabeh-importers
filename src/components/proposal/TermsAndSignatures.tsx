import React from "react";

export function TermsAndSignatures() {
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
        <span className="font-cormorant text-sm text-proposal-text-muted">05</span>
      </div>

       <h2 className="mb-2 font-cormorant text-2xl font-semibold text-proposal-navy-primary">
        What's Included
      </h2>
      <p className="mb-[30px] text-[13px] font-normal text-proposal-text-muted">
         Complete development package
      </p>

       <div className="mb-[25px] grid grid-cols-2 gap-[30px]">
         <div className="rounded-xl border border-proposal-cream-dark bg-white p-[25px]">
          <h4 className="mb-[15px] inline-block border-b-2 border-proposal-gold-primary pb-3 font-cormorant text-lg font-semibold text-proposal-navy-primary">
            Development
          </h4>
           <ul className="list-none space-y-0">
            {[
              "Complete source code ownership",
              "Custom design tailored to your brand",
              "Responsive design for all screen sizes",
               "SEO & App Store Optimization",
            ].map((item, i) => (
               <li
                key={i}
                className="relative border-b border-proposal-cream-dark py-2 pl-5 text-xs text-proposal-text-dark last:border-0"
              >
                <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-proposal-gold-primary"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
         <div className="rounded-xl border border-proposal-cream-dark bg-white p-[25px]">
          <h4 className="mb-[15px] inline-block border-b-2 border-proposal-gold-primary pb-3 font-cormorant text-lg font-semibold text-proposal-navy-primary">
            Support & Training
          </h4>
           <ul className="list-none space-y-0">
            {[
              "Staff training on admin dashboard",
              "User documentation",
               "3-month free technical support",
              "Bug fixes during support period",
            ].map((item, i) => (
                <li
                key={i}
                className="relative border-b border-proposal-cream-dark py-2 pl-5 text-xs text-proposal-text-dark last:border-0"
              >
                <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-proposal-gold-primary"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
       </div>

      <h2 className="mb-5 font-cormorant text-2xl font-semibold text-proposal-navy-primary">
        Not Included
      </h2>
       <div className="mb-[25px] w-full rounded-xl border border-proposal-cream-dark bg-white p-[25px]">
          <ul className="list-none grid grid-cols-2 gap-x-[30px] gap-y-0">
            {[
              "Domain name registration",
              "Web hosting fees",
              "Third-party API subscription fees",
               "Content creation (photos, descriptions)",
              "Ongoing marketing services",
              "Maintenance after 3-month support",
            ].map((item, i) => (
                <li
                key={i}
                className="relative border-b border-proposal-cream-dark py-2 pl-5 text-xs text-proposal-text-dark last:border-0"
              >
                <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-proposal-gold-primary"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

      <h2 className="mb-5 font-cormorant text-2xl font-semibold text-proposal-navy-primary">
        Terms & Conditions
      </h2>
        <div className="mb-[30px] w-full rounded-xl border border-proposal-cream-dark bg-white p-[25px]">
          <ul className="list-none space-y-0">
            {[
               "This proposal is valid for 30 days from the date above",
              "Project timeline begins upon receipt of initial payment",
              "Client to provide all required content (logos, product images, descriptions)",
               "Changes beyond original scope may require additional fees",
              "Final payment due before source code handover",
            ].map((item, i) => (
                <li
                key={i}
                className="relative border-b border-proposal-cream-dark py-2 pl-5 text-xs text-proposal-text-dark last:border-0"
              >
                <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-proposal-gold-primary"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

      <div className="mt-10 grid grid-cols-2 gap-10">
          <div className="rounded-xl border border-proposal-cream-dark bg-white p-[25px]">
              <h4 className="mb-5 font-cormorant text-base font-semibold text-proposal-navy-primary">Prepared By</h4>
              <div className="mb-2 h-10 border-b border-proposal-navy-primary"></div>
              <p className="mb-[15px] text-[10px] uppercase tracking-widest text-proposal-text-muted">Yosef Ali</p>
               <div className="mb-2 h-10 border-b border-proposal-navy-primary"></div>
               <p className="mb-0 text-[10px] uppercase tracking-widest text-proposal-text-muted">Date</p>
          </div>
          <div className="rounded-xl border border-proposal-cream-dark bg-white p-[25px]">
              <h4 className="mb-5 font-cormorant text-base font-semibold text-proposal-navy-primary">Client Acceptance</h4>
              <div className="mb-2 h-10 border-b border-proposal-navy-primary"></div>
              <p className="mb-[15px] text-[10px] uppercase tracking-widest text-proposal-text-muted">Authorized Signature</p>
               <div className="mb-2 h-10 border-b border-proposal-navy-primary"></div>
               <p className="mb-0 text-[10px] uppercase tracking-widest text-proposal-text-muted">Date</p>
          </div>
      </div>

       <div className="absolute bottom-[30px] left-[60px] right-[60px] flex items-center justify-between border-t border-proposal-cream-dark pt-5">
         <span className="text-[10px] text-proposal-text-muted">
          © 2026 Yosef Ali · Software Development
        </span>
         <span className="rounded-[20px] bg-proposal-navy-primary px-3.5 py-1.5 text-[10px] font-medium text-proposal-gold-light">
          Thank You
        </span>
      </div>
    </section>
  );
}
