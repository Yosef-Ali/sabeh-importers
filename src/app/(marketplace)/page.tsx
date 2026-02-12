
import Link from "next/link";
import Image from "next/image";
import { getCategories, getListings } from "@/lib/actions/marketplace";
import { ListingCard } from "@/components/marketplace/listing-card";
import { SearchBar } from "@/components/marketplace/search-bar";
import { AnimatedStats } from "@/components/homepage/animated-stats";
import { TrustBadges } from "@/components/homepage/trust-badges";
import { FeaturedSellers } from "@/components/homepage/featured-sellers";
import { PremiumCarousel } from "@/components/homepage/premium-carousel";
import { Testimonials } from "@/components/homepage/testimonials";
import { EnhancedFooter } from "@/components/homepage/enhanced-footer";
import {
  ArrowRight, Car, Home, Smartphone, Briefcase, Wrench,
  Shirt, Building2, Cog, Sofa, Package, ChevronRight,
  Heart, MapPin, Clock, Eye, QrCode,
} from "lucide-react";

export const metadata = {
  title: "ሳቤህ | የኢትዮጵያ ፕሪሚየም ማርኬትፕሌስ",
  description: "የኢትዮጵያ ልዩ ምርጥ ማርኬትፕሌስ ለፕሪሚየም ተሽከርካሪዎች፣ ንብረቶች እና የልዩ የአኗኗር ዘይቤ ንብረቶች።",
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  motors: Car,
  property: Home,
  electronics: Smartphone,
  jobs: Briefcase,
  services: Wrench,
  furniture: Sofa,
  fashion: Shirt,
  business: Building2,
  industrial: Cog,
};

const CATEGORY_MATERIAL_ICONS: Record<string, string> = {
  motors: "directions_car",
  property: "apartment",
  electronics: "devices",
  "furniture-home": "chair",
  jobs: "work",
  services: "build",
  "fashion-beauty": "watch_button_press",
  "business-for-sale": "storefront",
  "industrial-equipment": "precision_manufacturing",
  community: "groups",
};

export default async function MarketplacePage() {
  const [categories, featuredResult, recentResult] = await Promise.all([
    getCategories(),
    getListings({ limit: 4, sort: "price_desc" }),
    getListings({ limit: 12, sort: "newest" }),
  ]);
  const featuredListings = featuredResult.data;
  const recentListings = recentResult.data;

  return (
    <div className="flex flex-col font-body text-navy-deep selection:bg-gold/30">
      {/* ──── HERO SECTION ──── */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-navy-deep">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/products/motors/mercedes-c-class.png"
            alt="Premium marketplace hero"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-transparent to-cream" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-white text-5xl md:text-7xl font-montserrat font-bold mb-6 tracking-tight leading-tight">
            የአኗኗር ዘይቤዎን <span className="text-gold italic">ከፍ ያድርጉ</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-light mb-12 tracking-wide max-w-2xl mx-auto">
            የኢትዮጵያ ልዩ ምርጥ ማርኬትፕሌስ ለፕሪሚየም ተሽከርካሪዎች፣ ንብረቶች እና የልዩ የአኗኗር ዘይቤ ንብረቶች።
          </p>

          {/* Glass Search Bar */}
          <div className="glass-search p-2 rounded-xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-2xl">
            <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-white/10">
              <span className="material-symbols-outlined text-gold">search</span>
              <input
                className="bg-transparent border-none text-white placeholder:text-white/40 focus:ring-0 focus:outline-none w-full text-sm"
                placeholder="Search luxury assets..."
                type="text"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-white/10">
              <span className="material-symbols-outlined text-gold">location_on</span>
              <select className="bg-transparent border-none text-white focus:ring-0 w-full text-sm appearance-none cursor-pointer">
                <option className="bg-navy-deep">All Ethiopia</option>
                <option className="bg-navy-deep">Addis Ababa</option>
                <option className="bg-navy-deep">Bole</option>
                <option className="bg-navy-deep">Bishoftu</option>
                <option className="bg-navy-deep">Adama</option>
                <option className="bg-navy-deep">Hawassa</option>
              </select>
            </div>
            <Link
              href="/search"
              className="bg-gold hover:bg-white text-navy-deep px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              <span className="uppercase text-xs tracking-widest font-bold">SEARCH</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <TrustBadges />

          {/* Animated Stats */}
          <AnimatedStats />
        </div>
      </section>

      {/* ──── STICKY CATEGORY BAR ──── */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-14 overflow-x-auto no-scrollbar">
          <div className="flex gap-8 whitespace-nowrap">
            <Link href="/search" className="category-chip h-14 flex items-center text-xs font-bold uppercase tracking-widest border-b-2 border-gold text-gold">
              All Categories
            </Link>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/search?categoryId=${cat.id}`}
                className="category-chip h-14 flex items-center text-xs font-bold uppercase tracking-widest border-b-2 border-transparent text-gray-500 hover:text-gold transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-navy-deep">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-gold">trending_up</span>
              Popular
            </span>
          </div>
        </div>
      </section>

      {/* ──── FEATURED SELLERS ──── */}
      <FeaturedSellers />

      {/* ──── PREMIUM CATEGORIES GRID ──── */}
      <section className="py-16 px-8 max-w-7xl mx-auto bg-white">
        <h2 className="text-3xl font-montserrat font-bold text-navy-deep mb-8">ፕሪሚየም ምድቦች</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 5).map((cat) => {
            const materialIcon = CATEGORY_MATERIAL_ICONS[cat.slug] || "grid_view";
            return (
              <Link
                key={cat.id}
                href={`/search?categoryId=${cat.id}`}
                className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/10 transition-colors">
                  <span className="material-symbols-outlined text-3xl text-gold">{materialIcon}</span>
                </div>
                <h3 className="font-bold text-sm text-navy-deep">{cat.name}</h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                  {cat.listingCount || 0} Listings
                </p>
              </Link>
            );
          })}
          <Link
            href="/search"
            className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center"
          >
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/10 transition-colors">
              <span className="material-symbols-outlined text-3xl text-gold">grid_view</span>
            </div>
            <h3 className="font-bold text-sm text-navy-deep">View All</h3>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Explore more</p>
          </Link>
        </div>
      </section>

      {/* ──── PREMIUM CAROUSEL ──── */}
      <PremiumCarousel listings={featuredListings} />

      {/* ──── TESTIMONIALS ──── */}
      <Testimonials />

      {/* ──── FRESH RECOMMENDATIONS ──── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-montserrat font-bold text-navy-deep">አዳዲስ ምርጦች</h2>
              <p className="text-gray-500 text-sm mt-2">በመላ ኢትዮጵያ ያሉ ምርጥ ዝርዝሮች</p>
            </div>
            <Link
              href="/search?sort=newest"
              className="text-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
            >
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="listing-card-premium bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all group"
              >
                <div className="relative h-48">
                  {listing.images && listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cream to-gray-100 flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-navy-deep" />
                  </button>
                  {listing.isFeatured && (
                    <div className="absolute bottom-3 left-3 bg-gold text-navy-deep text-[10px] font-bold px-2 py-1 rounded">FEATURED</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xl font-bold text-navy-deep mb-1 font-montserrat tabular-nums tracking-tight">
                    {new Intl.NumberFormat('en-ET', { style: 'currency', currency: listing.currency || 'ETB', maximumFractionDigits: 0 }).format(Number(listing.price))}
                  </div>
                  <h4 className="text-sm font-medium text-gray-700 truncate mb-2">{listing.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-tighter mb-4">
                    {listing.condition && (
                      <>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          {listing.condition.replace('_', ' ')}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {listing.city || 'ኢትዮጵያ'}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 pt-3 border-t border-gray-50 flex justify-between items-center">
                    <span>{listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-US') : 'recently'}</span>
                    <span className="material-symbols-outlined text-sm">share</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──── APP DOWNLOAD CTA ──── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-8 bg-navy-deep rounded-3xl overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
            <span className="font-display text-[30rem] font-bold text-white leading-none">S</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between p-12 md:p-20 relative z-10">
            <div className="max-w-xl text-center md:text-left mb-12 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-6">
                ሳቤህ በእጅዎ <span className="text-gold italic">ኪስ ውስጥ</span>
              </h2>
              <p className="text-white/70 text-lg font-light mb-10 leading-relaxed">
                የኢትዮጵያን ምርጥ ማርኬትፕሌስ አፕ ያውርዱ። ለፕሪሚየም ተሽከርካሪዎች እና ንብረቶች ወቅታዊ ማሳወቂያ ያግኙ ገበያ ውስጥ ከመግባታቸው በፊት።
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button className="bg-white text-navy-deep px-8 py-3 rounded-lg flex items-center gap-3 hover:bg-gold transition-all">
                  <span className="material-symbols-outlined text-2xl">phone_iphone</span>
                  <div className="text-left">
                    <div className="text-[8px] uppercase tracking-widest leading-none">Download on</div>
                    <div className="text-sm font-bold leading-none">App Store</div>
                  </div>
                </button>
                <button className="bg-white text-navy-deep px-8 py-3 rounded-lg flex items-center gap-3 hover:bg-gold transition-all">
                  <span className="material-symbols-outlined text-2xl">play_arrow</span>
                  <div className="text-left">
                    <div className="text-[8px] uppercase tracking-widest leading-none">Get it on</div>
                    <div className="text-sm font-bold leading-none">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-2xl text-center">
              <div className="w-48 h-48 bg-gray-50 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-200">
                <QrCode className="h-16 w-16 text-gray-200" />
              </div>
              <p className="text-navy-deep text-xs font-bold uppercase tracking-widest">Scan to Download</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──── ENHANCED FOOTER ──── */}
      <EnhancedFooter />
    </div>
  );
}
