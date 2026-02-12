# Site: Sabeh Importers
**Stitch Project ID:** 15993632048680359095

## 1. Vision
Ethiopia's Premier Classifieds Marketplace. A digital platform connecting buyers and sellers for Cars, Property, Electronics, and Jobs. Trusted, Localized (Amharic/English), and Professional.

## 2. Architecture (Zones)
- **Zone A: Marketplace `/(marketplace)`:** Public browsing, search, listings. (Dubizzle-style)
- **Zone B: Dashboard `/(dashboard)`:** User area, my listings, messages.
- **Zone C: Admin `/(admin)`:** System management.
- **Proposal `/(proposal)`:** Investment/Business proposal.

## 3. Sitemap (Current Focus: Zone A)
- [ ] `src/app/(marketplace)/layout.tsx` - Main Wrapper (Navbar, Footer)
- [ ] `src/app/(marketplace)/page.tsx` - Homepage (Search, Categories, Featured)
- [x] `src/app/(marketplace)/search/page.tsx` - Search Results & Filters
- [ ] `src/app/(marketplace)/listings/[id]/page.tsx` - Listing Details
- [ ] `src/app/(marketplace)/category/[slug]/page.tsx` - Category Landing

## 4. Roadmap
1. [x] Search & Discovery Implementation.
2. [Next] Redesign Marketplace Layout & Homepage (Stitch/Elegant UI).
3. Build Listing Detail Page.
4. Build Dashboard "My Listings".
5. Integrate Admin Panel.

## 5. Design System
Refers to `DESIGN.md` for visual tokens (Ethiopian Colors, Clean Typography).
