import React from "react";

export function ProjectDeliverables() {
  return (
    <section className="item-center relative mx-auto my-5 min-h-[297mm] w-full max-w-[210mm] bg-white px-12 py-[50px] shadow-2xl print:m-0 print:h-screen print:w-screen print:shadow-none md:px-[60px]">
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
        <span className="font-cormorant text-sm text-proposal-text-muted">03</span>
      </div>

      <h2 className="mb-2 font-cormorant text-[32px] font-semibold text-proposal-navy-primary">
        Project Deliverables
      </h2>
      <p className="mb-[30px] text-[13px] font-normal text-proposal-text-muted">
         Comprehensive digital solutions for your business
      </p>

      <p className="mb-[35px] max-w-[90%] text-[15px] leading-[1.8] text-proposal-text-dark">
        We are pleased to present this proposal for the complete development of a web application
        and native mobile applications for Sabeh Importer. This solution will establish your
        digital presence and provide customers with a seamless experience across all platforms.
      </p>

      <div className="mb-10 grid grid-cols-2 gap-5">
        {[
          {
            title: "Web Application",
            desc: "Responsive e-commerce website with comprehensive admin dashboard for complete business management",
            icon: (
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5z" />
            ),
          },
          {
            title: "Android Application",
            desc: "Native Android app optimized for Google Play Store with full e-commerce functionality",
             icon: (
               <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
            ),
          },
          {
            title: "iOS Application",
            desc: "Native iPhone app designed for Apple App Store with premium user experience",
            icon: (
              <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" />
            ),
          },
           {
            title: "App Store Publishing",
            desc: "Complete deployment to Google Play Store and Apple App Store with optimization",
             icon: (
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
            ),
          },
        ].map((item, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-xl border border-proposal-cream-dark bg-white p-[25px] transition-all duration-300"
          >
              <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-proposal-gold-primary to-proposal-gold-light"></div>
            <div className="mb-[15px] flex h-12 w-12 items-center justify-center rounded-[10px] bg-gradient-to-br from-proposal-navy-primary to-proposal-navy-light text-proposal-gold-primary">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                {item.icon}
              </svg>
            </div>
            <h3 className="mb-2 font-cormorant text-xl font-semibold text-proposal-navy-primary">
              {item.title}
            </h3>
            <p className="text-xs leading-[1.6] text-proposal-text-muted">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mb-5 mt-5 font-cormorant text-2xl font-semibold text-proposal-navy-primary">
        Features Included
      </h2>

      <div className="mb-[30px] grid grid-cols-2 gap-[30px]">
        <div className="rounded-xl border border-proposal-cream-dark bg-white p-[25px]">
          <h4 className="mb-[15px] inline-block border-b-2 border-proposal-gold-primary pb-3 font-cormorant text-lg font-semibold text-proposal-navy-primary">
            Customer Features
          </h4>
          <ul className="list-none space-y-0">
            {[
              "User registration & login (email, phone, social)",
              "Product catalog with categories & search",
              "Shopping cart functionality",
              "Order placement & tracking",
              "Payment integration (TeleBirr, CBE Birr)",
              "Push notifications",
              "Multilingual support (Amharic & English)",
            ].map((feature, i) => (
              <li
                key={i}
                className="relative border-b border-proposal-cream-dark py-2 pl-5 text-xs text-proposal-text-dark last:border-0"
              >
                <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-proposal-gold-primary"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
         <div className="rounded-xl border border-proposal-cream-dark bg-white p-[25px]">
          <h4 className="mb-[15px] inline-block border-b-2 border-proposal-gold-primary pb-3 font-cormorant text-lg font-semibold text-proposal-navy-primary">
            Admin Dashboard
          </h4>
          <ul className="list-none space-y-0">
            {[
              "Product management (add, edit, delete)",
              "Inventory management",
              "Order management & status updates",
              "Customer management",
              "Sales reports & analytics",
               "Promotion & discount management",
              "Content management system",
            ].map((feature, i) => (
               <li
                key={i}
                className="relative border-b border-proposal-cream-dark py-2 pl-5 text-xs text-proposal-text-dark last:border-0"
              >
                <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-proposal-gold-primary"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="mb-12 mt-8 flex justify-center">
        <a href="/investment" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-proposal-navy-primary to-proposal-navy-light px-10 py-4 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
          <span className="relative z-10 font-medium tracking-wide">View Investment & Payment Plan</span>
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
