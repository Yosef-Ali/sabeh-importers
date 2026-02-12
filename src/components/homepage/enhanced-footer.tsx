import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "About Sabeh",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Careers", href: "/careers" },
      { label: "Press Kit", href: "/press" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Buy",
    links: [
      { label: "All Categories", href: "/search" },
      { label: "Motors", href: "/search?category=motors" },
      { label: "Property", href: "/search?category=property" },
      { label: "Electronics", href: "/search?category=electronics" },
      { label: "How to Buy", href: "/guide/buying" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Place an Ad", href: "/marketplace/create" },
      { label: "Pricing Plans", href: "/pricing" },
      { label: "Seller Tips", href: "/guide/selling" },
      { label: "Premium Features", href: "/premium" },
      { label: "Advertise with Us", href: "/advertise" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Safety Tips", href: "/safety" },
      { label: "FAQs", href: "/faq" },
      { label: "Report Abuse", href: "/report" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
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
    <footer className="bg-[#1a2d4a] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/Sabeh_Logo_Icon.svg"
                alt="Sabeh"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <span className="text-[#FCDD09] text-2xl font-bold tracking-tight uppercase">
                SABEH
              </span>
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              የኢትዮጵያ ልዩ ምርጥ ማርኬትፕሌስ ለፕሪሚየም ተሽከርካሪዎች፣ ንብረቶች እና የልዩ የአኗኗር ዘይቤ ንብረቶች።
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#FCDD09]" />
                <a href="mailto:info@sabeh.et" className="hover:text-[#FCDD09] transition-colors">
                  info@sabeh.et
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#FCDD09]" />
                <a href="tel:+251911234567" className="hover:text-[#FCDD09] transition-colors">
                  +251 91 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#FCDD09]" />
                <span>Bole, Addis Ababa, Ethiopia</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#FCDD09] hover:text-[#1a2d4a] transition-all"
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
              <h3 className="text-[#FCDD09] font-bold uppercase tracking-wide text-xs mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-[#FCDD09] transition-colors text-sm"
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
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <p>© 2024 Sabeh Importers. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-[#FCDD09] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#FCDD09] transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-[#FCDD09] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
