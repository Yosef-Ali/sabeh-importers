# SABEH IMPORTERS — Professional E-Commerce Marketplace Improvement Plan
## Inspired by Dubizzle.com | Comprehensive Review & Roadmap

---

## EXECUTIVE SUMMARY

**Current State:** Early MVP (Overall Score: 4.4/10)
**Target State:** Production-Ready Professional Marketplace (8+/10)
**Inspiration:** Dubizzle.com — MENA's leading classifieds/marketplace platform
**Estimated Timeline:** 12-16 weeks (3 phases)

The Sabeh Importers platform has strong visual design foundations and a solid tech stack (Next.js 14, TypeScript, Prisma, Tailwind, Shadcn UI) but requires significant development across authentication, marketplace features, performance, and security to reach production quality comparable to Dubizzle.

---

## PHASE 1: FOUNDATION & CRITICAL FIXES (Weeks 1-4)

### 1.1 Authentication & Security (BLOCKING — Week 1-2)

**Current Problem:** No authentication implemented. Hardcoded user ID in marketplace actions. Multiple security vulnerabilities.

**Tasks:**
- [ ] Implement NextAuth.js with credentials + social login (Google, Apple)
- [ ] Add phone/SMS verification (Twilio or local provider)
- [ ] Create login/signup pages with proper validation
- [ ] Remove all hardcoded user IDs (marketplace.ts line 41)
- [ ] Add server-side session validation to ALL API routes
- [ ] Implement role-based access control (ADMIN, SELLER, BUYER, DISTRIBUTOR)
- [ ] Add CSRF protection to all forms
- [ ] Set up rate limiting middleware (express-rate-limit)
- [ ] Add input sanitization (DOMPurify for user content)
- [ ] Configure CORS properly for API routes
- [ ] Add Helmet.js security headers
- [ ] Set up environment variable management (no secrets in code)

**Dubizzle Pattern:** Users sign up with email/phone/social login. Emirates ID verification for trusted sellers. Profile verification badges.

---

### 1.2 Database Schema Completion (Week 1-2)

**Current Problem:** Schema missing critical tables for reviews, payments, disputes, notifications. No soft deletes. No audit trail.

**Tasks:**
- [ ] Add `reviews` table (rating, comment, sellerId, buyerId, listingId)
- [ ] Add `payments` table (amount, method, status, transactionId)
- [ ] Add `disputes` table (reason, status, resolution, buyerId, sellerId)
- [ ] Add `notifications` table (type, message, read, userId)
- [ ] Add `saved_searches` table (query, filters, userId, alertEnabled)
- [ ] Add `wishlists` table (userId, listingId)
- [ ] Add `reports` table (reason, reporterId, listingId, status)
- [ ] Add `user_verifications` table (type, status, documentUrl)
- [ ] Add soft delete (`deletedAt`) to all major tables
- [ ] Add audit fields (`createdBy`, `updatedBy`) to all tables
- [ ] Add proper indexes for search performance
- [ ] Add database constraints and foreign key validations
- [ ] Create seed data script for development

---

### 1.3 Image Upload & Media Management (Week 2)

**Current Problem:** No image upload capability. ListingCard shows placeholder images only.

**Tasks:**
- [ ] Set up Cloudinary (or AWS S3) integration
- [ ] Create `ImageUpload` component with drag-and-drop
- [ ] Add multi-image upload (up to 10 per listing, like Dubizzle)
- [ ] Implement image compression and WebP conversion
- [ ] Add image reordering capability
- [ ] Create image gallery/carousel component for listing detail
- [ ] Replace all `<img>` tags with Next.js `<Image>` component
- [ ] Add responsive image sizes with `srcset`
- [ ] Implement lazy loading for all images

**Dubizzle Pattern:** Multiple high-quality images per listing, gallery view with thumbnail navigation, loading via skeleton placeholders first.

---

### 1.4 Core Form Components (Week 2-3)

**Current Problem:** Forms directory is completely empty despite react-hook-form and Zod being installed.

**Tasks:**
- [ ] Create `FormField` wrapper (label + input + error message)
- [ ] Create `FormSelect` with search capability
- [ ] Create `FormCheckboxGroup` component
- [ ] Create `FormRadioGroup` component
- [ ] Create `FormDatePicker` component
- [ ] Create `FormFileUpload` component
- [ ] Create `FormTextarea` with character counter
- [ ] Create `FormPriceInput` with currency formatting
- [ ] Create `FormLocationPicker` (with map integration)
- [ ] Create `FormPhoneInput` with country code
- [ ] Create `MultiStepForm` wrapper component
- [ ] Add Zod validation schemas for all entity types
- [ ] Create proper TypeScript interfaces (remove all `any` types)

---

### 1.5 Data Table Components (Week 3)

**Current Problem:** Tables directory is empty. Product management uses hardcoded data.

**Tasks:**
- [ ] Create `DataTable` component with TanStack Table
- [ ] Add column sorting (ascending/descending)
- [ ] Add column filtering
- [ ] Add pagination (10/25/50/100 per page)
- [ ] Add row selection with bulk actions
- [ ] Add column visibility toggle
- [ ] Add CSV/Excel export functionality
- [ ] Create loading skeleton for tables
- [ ] Add empty state component
- [ ] Add search within table

---

## PHASE 2: MARKETPLACE FEATURES (Weeks 5-8)

### 2.1 Search & Discovery System (Week 5)

**Current Problem:** Search bar is presentational only. Filters don't work. No sorting.

**Tasks:**
- [ ] Implement full-text search with PostgreSQL `tsvector` or Meilisearch
- [ ] Create `SearchBar` component with autocomplete/suggestions
- [ ] Add search results page with highlight matching
- [ ] Implement filter sidebar with:
  - [ ] Category tree (hierarchical)
  - [ ] Price range slider (with min/max inputs)
  - [ ] Location filter (city/area)
  - [ ] Condition filter (new/used)
  - [ ] Brand filter
  - [ ] Seller type filter (individual/business)
  - [ ] Date posted filter
- [ ] Add sort options (newest, price low-high, price high-low, relevance)
- [ ] Implement URL-based filter state (shareable filtered URLs)
- [ ] Add "Save Search" with email/push notifications
- [ ] Implement search history (recent searches)
- [ ] Add "No Results" page with suggestions

**Dubizzle Pattern:** Advanced multi-filter system with URL persistence. Results load in batches of 20-30 with infinite scroll. Skeleton UI while loading. Saved searches with notifications.

---

### 2.2 Listing Detail Page (Week 5-6)

**Current Problem:** No listing detail page exists.

**Tasks:**
- [ ] Create `/listings/[id]` route (Server Component)
- [ ] Build image gallery with thumbnail navigation
- [ ] Add full-screen image viewer (lightbox)
- [ ] Display seller information with verification badges
- [ ] Show listing metadata (posted date, views, category breadcrumb)
- [ ] Add price display with "Make an Offer" button
- [ ] Create "Contact Seller" button (opens chat)
- [ ] Add WhatsApp contact integration
- [ ] Add phone number reveal (click to show)
- [ ] Build "Report Listing" functionality
- [ ] Add "Save to Wishlist" button
- [ ] Show "Similar Listings" section
- [ ] Add social sharing buttons
- [ ] Implement listing view counter
- [ ] Add structured data (JSON-LD) for SEO
- [ ] Create breadcrumb navigation

**Dubizzle Pattern:** Clean detail page with large gallery, seller info card, contact options (chat, call, WhatsApp), similar listings carousel, and breadcrumb navigation.

---

### 2.3 Seller Dashboard & Profile (Week 6-7)

**Current Problem:** No seller profile or dashboard.

**Tasks:**
- [ ] Create seller profile page (`/sellers/[id]`)
- [ ] Show seller rating and review count
- [ ] Display seller's active listings
- [ ] Add "Member Since" and verification status
- [ ] Create seller dashboard with:
  - [ ] My Listings (active, pending, expired, sold)
  - [ ] Messages inbox
  - [ ] Performance metrics (views, inquiries, conversion)
  - [ ] Reviews received
  - [ ] Account settings
- [ ] Implement listing management (edit, renew, deactivate, delete)
- [ ] Add featured/promoted listing upgrade flow

**Dubizzle Pattern:** Verified seller profiles with rating, response rate, member duration. Dashboard shows listing stats, messages, and performance insights.

---

### 2.4 Real-Time Messaging System (Week 7)

**Current Problem:** Schema exists but no messaging UI or real-time capability.

**Tasks:**
- [ ] Set up WebSocket or Server-Sent Events for real-time messaging
- [ ] Create chat interface component (like WhatsApp/Messenger)
- [ ] Add conversation list with unread indicators
- [ ] Implement message types (text, image, offer)
- [ ] Add typing indicator
- [ ] Create notification system for new messages
- [ ] Add "Make an Offer" flow within chat
- [ ] Implement block/report user functionality
- [ ] Add chat history search
- [ ] Create mobile-optimized chat view

**Dubizzle Pattern:** In-app chat between buyers and sellers. Chat linked to specific listings. Offer/counter-offer flow within conversation. Push notifications for new messages.

---

### 2.5 Category System Enhancement (Week 7-8)

**Current Problem:** Categories are hardcoded. No hierarchical browsing.

**Tasks:**
- [ ] Create category management in admin panel
- [ ] Build hierarchical category tree (main > sub > sub-sub)
- [ ] Create category browsing page with icons
- [ ] Add category-specific listing fields (e.g., "Year" for vehicles, "Bedrooms" for property)
- [ ] Implement category landing pages with featured listings
- [ ] Add popular categories on homepage
- [ ] Create category icon system

**Dubizzle Categories to Implement:**
```
Motors (Cars, Bikes, Boats, Parts)
├── Cars for Sale
├── Motorcycles
├── Boats
└── Auto Parts & Accessories

Property (Buy, Rent, Commercial)
├── Apartments for Sale
├── Villas for Sale
├── Apartments for Rent
└── Commercial Property

Electronics
├── Mobile Phones & Tablets
├── Computers & Laptops
├── Gaming
└── Audio & Video

Jobs
├── Full-time
├── Part-time
├── Freelance
└── Internships

Services
├── Home Services
├── Business Services
├── Events & Entertainment
└── Education & Tutoring

Furniture & Home
Business for Sale
Pets
Community
```

---

### 2.6 Review & Rating System (Week 8)

**Tasks:**
- [ ] Create review submission form (1-5 stars + text)
- [ ] Build review display component with avatar, rating, date
- [ ] Add seller rating calculation (average + count)
- [ ] Implement review moderation for admin
- [ ] Add "Helpful" voting on reviews
- [ ] Create review response capability for sellers
- [ ] Display trust score based on ratings + verification

---

## PHASE 3: PROFESSIONAL POLISH (Weeks 9-12)

### 3.1 Payment & Monetization (Week 9)

**Tasks:**
- [ ] Integrate payment gateway (Stripe/PayPal + TeleBirr/CBE Birr for Ethiopia)
- [ ] Implement featured listing purchase flow
- [ ] Create subscription tiers for sellers
- [ ] Add bump/promote listing functionality
- [ ] Build payment history page
- [ ] Add invoice generation

**Revenue Models (Dubizzle-inspired):**
1. Featured/promoted listings (pay to appear first)
2. Premium seller subscriptions (unlimited listings, analytics)
3. Banner advertising
4. Commission on completed transactions (optional)

---

### 3.2 Performance Optimization (Week 9-10)

**Current Problem:** Estimated Lighthouse score ~50-60. BYD Hero preloads 384 images.

**Tasks:**
- [ ] Implement Skeleton UI loading pattern (Dubizzle loads text first, then images)
- [ ] Add infinite scroll for listing feeds (load 20-30 at a time)
- [ ] Replace frame-sequence hero with optimized video or reduce frames
- [ ] Implement Next.js Image optimization for all product images
- [ ] Add service worker for caching
- [ ] Set up CDN for static assets
- [ ] Implement code splitting per route
- [ ] Use Server Components by default (only "use client" for interactive widgets)
- [ ] Add React.memo for expensive list renders
- [ ] Implement virtual scrolling for long lists
- [ ] Debounce search and filter inputs
- [ ] Add resource prefetching for likely next pages

**Target:** Lighthouse Performance score 85+

---

### 3.3 SEO & Discoverability (Week 10)

**Tasks:**
- [ ] Add proper meta tags for all pages
- [ ] Implement dynamic Open Graph images for listings
- [ ] Create XML sitemap with all listings
- [ ] Add JSON-LD structured data (Product, LocalBusiness, BreadcrumbList)
- [ ] Implement canonical URLs
- [ ] Create human-readable URLs (/cars-for-sale/toyota-corolla-2024)
- [ ] Add robots.txt with proper directives
- [ ] Implement hreflang for Amharic/English
- [ ] Add meta descriptions for category pages
- [ ] Create 404 page with search and popular categories

---

### 3.4 Admin Dashboard (Week 10-11)

**Tasks:**
- [ ] Build admin overview with key metrics (users, listings, revenue)
- [ ] Create user management panel (ban, verify, role assignment)
- [ ] Build listing moderation queue (approve, reject, flag)
- [ ] Add content moderation tools
- [ ] Create analytics dashboard with Recharts:
  - [ ] Daily active users chart
  - [ ] New listings over time
  - [ ] Revenue chart
  - [ ] Top categories pie chart
  - [ ] Geographic distribution map
- [ ] Add system settings management
- [ ] Create email template management
- [ ] Build report/abuse handling interface

---

### 3.5 Notifications System (Week 11)

**Tasks:**
- [ ] Implement in-app notification center
- [ ] Add email notifications (SendGrid/Resend):
  - [ ] New message received
  - [ ] Listing approved/rejected
  - [ ] Price drop on saved listings
  - [ ] New listings matching saved search
  - [ ] Account verification reminders
- [ ] Add push notifications (Web Push API)
- [ ] Create notification preferences page
- [ ] Add SMS notifications for critical events (TeleBirr/Twilio)

---

### 3.6 Mobile Optimization & PWA (Week 11-12)

**Tasks:**
- [ ] Create Progressive Web App (PWA) manifest
- [ ] Add service worker for offline capability
- [ ] Optimize touch interactions (swipe gestures, pull-to-refresh)
- [ ] Ensure all tap targets are 44px+ (WCAG)
- [ ] Add mobile-specific navigation (bottom tab bar)
- [ ] Optimize forms for mobile input (proper keyboard types)
- [ ] Test and fix all responsive breakpoints
- [ ] Add "Install App" prompt for mobile users
- [ ] Optimize image loading for 3G networks

---

### 3.7 Accessibility Compliance (Week 12)

**Current Problem:** Score 5/10, multiple WCAG 2.1 violations.

**Tasks:**
- [ ] Add skip navigation links to all pages
- [ ] Ensure all images have descriptive alt text
- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Add visible focus indicators for keyboard navigation
- [ ] Test with screen readers (VoiceOver, NVDA)
- [ ] Add form validation error announcements (aria-live)
- [ ] Ensure all functionality is keyboard-accessible
- [ ] Add high-contrast mode option
- [ ] Create accessibility statement page

---

### 3.8 Testing & Quality Assurance (Week 12)

**Current Problem:** Zero tests.

**Tasks:**
- [ ] Set up Vitest for unit testing
- [ ] Set up Playwright for E2E testing
- [ ] Write unit tests for:
  - [ ] Authentication flows
  - [ ] API route handlers
  - [ ] Zod validation schemas
  - [ ] Utility functions (currency, date formatting)
- [ ] Write component tests for:
  - [ ] ListingCard rendering
  - [ ] SearchBar functionality
  - [ ] Form validation
  - [ ] Filter interactions
- [ ] Write E2E tests for:
  - [ ] User signup/login flow
  - [ ] Create listing flow
  - [ ] Search and filter flow
  - [ ] Messaging flow
  - [ ] Checkout flow
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add pre-commit hooks (lint, type-check, test)

---

## ARCHITECTURE IMPROVEMENTS

### Current vs Target Architecture

```
CURRENT (Monolithic Client-Heavy):
┌─────────────────────────────────┐
│  Next.js App (Client Components)│
│  ┌───────────┐ ┌──────────────┐│
│  │ Shop Page │ │ Marketplace  ││
│  │ (mock data)│ │ (hardcoded) ││
│  └───────────┘ └──────────────┘│
│  ┌───────────────────────────┐ │
│  │  Prisma/Drizzle (unused)  │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │  PostgreSQL (Neon)        │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘

TARGET (Server-First with Clear Layers):
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│  ┌──────────┐ ┌───────┐ ┌───────────┐  │
│  │Server    │ │Client │ │ Shared    │  │
│  │Components│ │Widgets│ │ UI Library│  │
│  │(pages)   │ │(forms)│ │ (shadcn)  │  │
│  └────┬─────┘ └───┬───┘ └───────────┘  │
├───────┼───────────┼─────────────────────┤
│       │ SERVICE LAYER                   │
│  ┌────┴───────────┴───┐ ┌────────────┐ │
│  │  Server Actions    │ │  API Routes│ │
│  │  (validated)       │ │  (REST)    │ │
│  └────────┬───────────┘ └──────┬─────┘ │
├───────────┼────────────────────┼───────-┤
│           │ DATA LAYER         │        │
│  ┌────────┴────────────────────┴─────┐  │
│  │  Prisma ORM (type-safe queries)   │  │
│  └────────────────┬──────────────────┘  │
│  ┌────────────────┴──────────────────┐  │
│  │  PostgreSQL + Redis Cache         │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│           EXTERNAL SERVICES             │
│  ┌─────────┐ ┌──────┐ ┌─────────────┐  │
│  │Cloudinary│ │Stripe│ │ SendGrid    │  │
│  │(images)  │ │(pay) │ │ (email)     │  │
│  └─────────┘ └──────┘ └─────────────┘  │
└─────────────────────────────────────────┘
```

### Recommended File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (marketplace)/
│   │   ├── layout.tsx          ← Marketplace layout with search header
│   │   ├── page.tsx            ← Homepage with categories & featured
│   │   ├── search/page.tsx     ← Search results with filters
│   │   ├── category/
│   │   │   └── [slug]/page.tsx ← Category listing page
│   │   └── listing/
│   │       ├── [id]/page.tsx   ← Listing detail
│   │       └── create/page.tsx ← Create listing form
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx  ← Seller/Admin dashboard
│   │   ├── my-listings/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── settings/page.tsx
│   │   └── admin/              ← Admin-only routes
│   │       ├── users/page.tsx
│   │       ├── moderation/page.tsx
│   │       └── analytics/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── listings/route.ts
│       ├── upload/route.ts
│       ├── search/route.ts
│       └── webhooks/route.ts
├── components/
│   ├── ui/                     ← Shadcn base components (existing)
│   ├── forms/                  ← Reusable form components (NEW)
│   ├── tables/                 ← Data table components (NEW)
│   ├── marketplace/            ← Marketplace-specific components
│   │   ├── ListingCard.tsx
│   │   ├── ListingGallery.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── SellerCard.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ChatWindow.tsx
│   │   └── ListingFeed.tsx
│   ├── dashboard/              ← Dashboard widgets
│   └── layout/                 ← Shared layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Sidebar.tsx
│       └── MobileNav.tsx
├── lib/
│   ├── auth.ts                 ← NextAuth configuration
│   ├── db.ts                   ← Database client
│   ├── validations/            ← Zod schemas
│   │   ├── listing.ts
│   │   ├── user.ts
│   │   └── review.ts
│   ├── upload.ts               ← Cloudinary helpers
│   └── utils.ts                ← Utility functions
├── services/                   ← Business logic layer (NEW)
│   ├── listings.ts
│   ├── users.ts
│   ├── reviews.ts
│   ├── messages.ts
│   └── payments.ts
├── hooks/                      ← Custom React hooks
│   ├── useAuth.ts
│   ├── useSearch.ts
│   ├── useInfiniteScroll.ts
│   └── useDebounce.ts
├── store/                      ← Zustand stores
│   ├── auth.ts
│   ├── cart.ts
│   ├── ui.ts
│   └── filters.ts
└── types/                      ← TypeScript definitions
    ├── listing.ts
    ├── user.ts
    ├── api.ts
    └── index.ts
```

---

## DUBIZZLE-INSPIRED UI/UX PATTERNS TO IMPLEMENT

### 1. Homepage Layout
```
┌────────────────────────────────────────────┐
│ HEADER: Logo | Search Bar | Post Ad | Auth │
├────────────────────────────────────────────┤
│ HERO: Featured listings carousel           │
├────────────────────────────────────────────┤
│ CATEGORIES: Icon grid (8-12 main cats)     │
├────────────────────────────────────────────┤
│ FEATURED: Premium/promoted listings grid   │
├────────────────────────────────────────────┤
│ RECENT: Latest listings (infinite scroll)  │
├────────────────────────────────────────────┤
│ POPULAR: Most viewed listings              │
├────────────────────────────────────────────┤
│ FOOTER: Links, Categories, App Download    │
└────────────────────────────────────────────┘
```

### 2. Search Results Page
```
┌────────────────────────────────────────────┐
│ BREADCRUMB: Home > Category > Subcategory  │
├──────────┬─────────────────────────────────┤
│ FILTERS  │  SORT: Newest | Price ↑↓ | Rel. │
│          ├─────────────────────────────────┤
│ Category │  RESULTS: X items found         │
│ Price    ├─────────────────────────────────┤
│ Location │  ┌──────┐ ┌──────┐ ┌──────┐    │
│ Condition│  │ Card │ │ Card │ │ Card │    │
│ Brand    │  └──────┘ └──────┘ └──────┘    │
│ Seller   │  ┌──────┐ ┌──────┐ ┌──────┐    │
│          │  │ Card │ │ Card │ │ Card │    │
│ [Apply]  │  └──────┘ └──────┘ └──────┘    │
│ [Clear]  │  ─── Load More / Infinite ───   │
└──────────┴─────────────────────────────────┘
```

### 3. Listing Detail Page
```
┌────────────────────────────────────────────┐
│ BREADCRUMB: Home > Motors > Cars > Toyota  │
├─────────────────────┬──────────────────────┤
│                     │ PRICE: ETB 1,200,000 │
│   IMAGE GALLERY     │                      │
│   ┌──┬──┬──┬──┐     │ [Contact Seller]     │
│   │  │  │  │  │     │ [Make an Offer]      │
│   └──┴──┴──┴──┘     │ [WhatsApp]           │
│   (thumbnails)      │ [Save to Wishlist]   │
│                     │                      │
│                     │ SELLER INFO          │
│                     │ ⭐ 4.8 (123 reviews) │
│                     │ ✓ Verified Seller    │
│                     │ Member since 2023    │
├─────────────────────┴──────────────────────┤
│ DETAILS: Description, Specs, Location Map  │
├────────────────────────────────────────────┤
│ SIMILAR LISTINGS (carousel)                │
└────────────────────────────────────────────┘
```

### 4. Tiered Loading Pattern (Dubizzle's Secret)
```
Phase 1 (0.5s):  Skeleton UI + text/filters
Phase 2 (1.0s):  Low-res image placeholders
Phase 3 (1.5s):  High-res images (viewport only)
Phase 4 (scroll): Lazy load next batch (20-30 items)
```

---

## TECHNOLOGY ADDITIONS NEEDED

### New Dependencies to Install
```bash
# Authentication
npm install next-auth @auth/prisma-adapter

# Image Management
npm install cloudinary next-cloudinary

# Search
npm install meilisearch  # or use PostgreSQL full-text search

# Real-time
npm install socket.io socket.io-client  # or use Ably/Pusher

# Payment
npm install stripe @stripe/stripe-js

# Email
npm install @sendgrid/mail  # or resend

# Validation & Security
npm install dompurify helmet

# Performance
npm install sharp  # image optimization (Next.js uses this)

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom playwright

# PWA
npm install next-pwa

# Maps
npm install @react-google-maps/api  # or leaflet
```

---

## DEPLOYMENT CHECKLIST

### Pre-Launch Requirements
- [ ] Production PostgreSQL database (Neon/Supabase/PlanetScale)
- [ ] CDN configured (Vercel Edge Network or Cloudflare)
- [ ] SSL/TLS certificates
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog/Plausible + Google Analytics)
- [ ] Monitoring & alerting (Vercel Analytics)
- [ ] Automated backups
- [ ] Load testing completed (k6 or Artillery)
- [ ] Security audit passed
- [ ] Accessibility audit completed
- [ ] SEO audit completed
- [ ] Legal pages (Terms, Privacy Policy, Cookie Policy)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Domain & DNS configuration

---

## SUCCESS METRICS

### KPIs to Track
| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | 85+ | Chrome DevTools |
| Lighthouse Accessibility | 90+ | Chrome DevTools |
| Lighthouse SEO | 90+ | Chrome DevTools |
| First Contentful Paint | < 1.5s | Web Vitals |
| Largest Contentful Paint | < 2.5s | Web Vitals |
| Cumulative Layout Shift | < 0.1 | Web Vitals |
| Time to Interactive | < 3.5s | Web Vitals |
| Test Coverage | > 70% | Vitest |
| Uptime | 99.9% | Monitoring |
| Error Rate | < 0.1% | Sentry |

---

## PRIORITY EXECUTION ORDER

### Week 1-2: FOUNDATION
1. Authentication (NextAuth + phone verification)
2. Database schema completion
3. Security hardening

### Week 3-4: CORE COMPONENTS
4. Image upload system
5. Form components library
6. Data table components

### Week 5-6: MARKETPLACE CORE
7. Search & filter system
8. Listing detail page
9. Category system

### Week 7-8: ENGAGEMENT
10. Messaging system
11. Review & rating system
12. Seller dashboard

### Week 9-10: MONETIZATION & PERFORMANCE
13. Payment integration
14. Performance optimization
15. SEO implementation

### Week 11-12: POLISH
16. Admin dashboard
17. Notifications system
18. Mobile PWA + accessibility
19. Testing & QA
20. Deployment preparation

---

*This plan provides a structured roadmap to transform Sabeh Importers from an early MVP into a production-ready professional marketplace comparable to Dubizzle. Each phase builds on the previous, with the most critical blocking items addressed first.*
