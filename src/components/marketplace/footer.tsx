import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background border-t border-primary/20 pt-20 pb-10 px-8 font-body">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <Image src="/Sabeh_Logo_Icon.svg" alt="" width={48} height={48} className="h-12 w-12" />
            <span className="text-primary text-3xl font-montserrat font-bold tracking-tight uppercase">SABEH</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-10 max-w-sm">
            The definitive platform for Ethiopia&apos;s high-value transactions. From vetted imports to prime real estate, Sabeh connects premium buyers with world-class assets.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            >
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            >
              <span className="material-symbols-outlined text-lg">call</span>
            </a>
          </div>
        </div>

        {/* Marketplace */}
        <div>
          <h5 className="text-foreground text-xs font-bold uppercase tracking-[0.2em] mb-8">Marketplace</h5>
          <ul className="space-y-4 text-sm text-muted-foreground/60">
            <li><Link href="/search?category=motors" className="hover:text-primary transition-colors">Motors Portfolio</Link></li>
            <li><Link href="/search?category=property" className="hover:text-primary transition-colors">Property Listings</Link></li>
            <li><Link href="/search?category=business-for-sale" className="hover:text-primary transition-colors">Commercial Exchange</Link></li>
            <li><Link href="/search?category=fashion-beauty" className="hover:text-primary transition-colors">Luxury Concierge</Link></li>
            <li><Link href="/search" className="hover:text-primary transition-colors">Classifieds</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h5 className="text-foreground text-xs font-bold uppercase tracking-[0.2em] mb-8">Support</h5>
          <ul className="space-y-4 text-sm text-muted-foreground/60">
            <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Safety Tips</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Verification Process</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Advertising</Link></li>
          </ul>
        </div>

        {/* Sabeh.ET */}
        <div>
          <h5 className="text-foreground text-xs font-bold uppercase tracking-[0.2em] mb-8">Sabeh.ET</h5>
          <ul className="space-y-4 text-sm text-muted-foreground/60">
            <li><Link href="#" className="hover:text-primary transition-colors">Our Story</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Press &amp; Media</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">
          © 2024 Sabeh Importers &amp; Marketplace. All Rights Reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold mr-4">Secure Transactions via</span>
          <div className="flex gap-4 opacity-30 invert dark:invert-0 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-foreground text-2xl">payments</span>
            <span className="material-symbols-outlined text-foreground text-2xl">account_balance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
