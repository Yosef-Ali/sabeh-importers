import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "About Sabeh",
    links: [
      { label: "What Is Sabeh", href: "/guide#what-is-sabeh" },
      { label: "How It Works", href: "/guide" },
      { label: "Verified Partners", href: "/search?featured=true" },
      { label: "Pricing Plans", href: "/pricing" },
      { label: "Admin Panel", href: "/admin" },
    ],
  },
  {
    title: "Buy",
    links: [
      { label: "All Listings", href: "/search" },
      { label: "Motors", href: "/search?category=motors" },
      { label: "Property", href: "/search?category=property" },
      { label: "Electronics", href: "/search?category=electronics" },
      { label: "Industrial", href: "/search?category=industrial-equipment" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Post a Listing", href: "/dashboard/marketplace/create" },
      { label: "Seller Guide", href: "/guide#seller-guide" },
      { label: "Get Verified", href: "/guide#get-verified" },
      { label: "Boost Visibility", href: "/guide#promotions" },
      { label: "Pricing Plans", href: "/pricing" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help & FAQs", href: "/guide" },
      { label: "Safety Tips", href: "/guide#get-verified" },
      { label: "Report a Listing", href: "/search" },
      { label: "Platform Guide", href: "/guide" },
      { label: "Contact Sabeh", href: "mailto:ops@sabeh.authority" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com/sabeh", label: "Facebook" },
  { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com/sabeh", label: "Twitter" },
  { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com/sabeh", label: "Instagram" },
  { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com/company/sabeh", label: "LinkedIn" },
  { icon: <Youtube className="h-5 w-5" />, href: "https://youtube.com/sabeh", label: "YouTube" },
];

export function EnhancedFooter() {
  return (
    <footer className="bg-navy text-white border-t-4 border-gold">
      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gold flex items-center justify-center rounded-none shadow-hard-navy">
                <span className="material-symbols-outlined text-navy font-bold text-2xl">anchor</span>
              </div>
              <span className="text-white text-3xl font-display font-bold tracking-tighter uppercase leading-none">
                Sabeh <br/>Authority
              </span>
            </Link>
            <p className="text-white/50 mb-8 leading-relaxed font-mono text-xs uppercase tracking-wider">
              Authoritative commerce for the modern seafarer. High-trust trading platform for verified industrial and maritime assets.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold" />
                <a href="mailto:ops@sabeh.authority" className="hover:text-gold transition-colors">
                  OPS@SABEH.AUTHORITY
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold" />
                <a href="tel:+251911234567" className="hover:text-gold transition-colors">
                  +251 91 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gold" />
                <span>Registry Hub, Addis Ababa</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-10">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-none bg-white/5 text-white/40 border border-white/10 hover:bg-gold hover:text-navy transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-gold font-mono font-bold uppercase tracking-[0.3em] text-[10px] mb-8 border-b border-white/10 pb-2 inline-block">
                {section.title}
              </h3>
              <ul className="space-y-4 font-display text-sm uppercase tracking-wide">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="max-w-[1440px] mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
            <p>© 2024 All Rights Reserved. Unified Registry Protocol.</p>
            <div className="flex gap-8">
              <Link href="/guide" className="hover:text-white transition-colors">
                Platform_Guide
              </Link>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing_Plans
              </Link>
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin_Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
