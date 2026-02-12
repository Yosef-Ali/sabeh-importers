# SABEH IMPORTERS — System Architecture
## Dubizzle-Inspired E-Commerce Marketplace

---

## 1. HIGH-LEVEL SYSTEM DIAGRAM

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐ │
│  │  Public Site │  │  Seller     │  │  Admin Dashboard         │ │
│  │  (Browse,    │  │  Dashboard  │  │  (Users, Moderation,     │ │
│  │   Search,    │  │  (My Ads,   │  │   Analytics, Settings)   │ │
│  │   Detail)    │  │   Messages) │  │                          │ │
│  └──────┬───────┘  └──────┬──────┘  └────────────┬─────────────┘ │
│         │                 │                      │               │
│         └────────────┬────┴──────────────────────┘               │
│                      │                                           │
│              ┌───────▼────────┐                                  │
│              │   Next.js 14   │                                  │
│              │   App Router   │                                  │
│              └───────┬────────┘                                  │
└──────────────────────┼───────────────────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────────────────┐
│                  SERVER LAYER                                    │
│                      │                                           │
│  ┌───────────────────▼──────────────────────┐                    │
│  │         SERVER ACTIONS + API ROUTES       │                    │
│  │                                           │                    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │                    │
│  │  │ Listings │ │  Users   │ │  Orders  │  │                    │
│  │  │ Actions  │ │ Actions  │ │ Actions  │  │                    │
│  │  └──────────┘ └──────────┘ └──────────┘  │                    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │                    │
│  │  │ Messages │ │ Reviews  │ │ Payments │  │                    │
│  │  │ Actions  │ │ Actions  │ │ Actions  │  │                    │
│  │  └──────────┘ └──────────┘ └──────────┘  │                    │
│  └──────────────────┬───────────────────────┘                    │
│                     │                                            │
│  ┌──────────────────▼──────────────────────┐                     │
│  │          VALIDATION LAYER (Zod)         │                     │
│  └──────────────────┬──────────────────────┘                     │
│                     │                                            │
│  ┌──────────────────▼──────────────────────┐                     │
│  │          DATA ACCESS (Drizzle ORM)      │                     │
│  └──────────────────┬──────────────────────┘                     │
└──────────────────────┼───────────────────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────────────────┐
│                  DATA LAYER                                      │
│                      │                                           │
│  ┌───────────────────▼───────┐  ┌─────────────────────────────┐  │
│  │   PostgreSQL (Neon)       │  │   Cloudflare R2             │  │
│  │   28 tables               │  │   (S3-compatible storage)   │  │
│  │   19 enums                │  │                             │  │
│  │   30+ indexes             │  │   ┌─────────────────────┐   │  │
│  │                           │  │   │ Pre-signed URL Flow │   │  │
│  │   + media_assets table    │  │   │                     │   │  │
│  │     (tracks all uploads)  │  │   │ 1. Client requests  │   │  │
│  │                           │  │   │    upload URL        │   │  │
│  │                           │  │   │ 2. Server generates  │   │  │
│  │                           │  │   │    pre-signed URL    │   │  │
│  │                           │  │   │ 3. Client uploads    │   │  │
│  │                           │  │   │    DIRECTLY to R2    │   │  │
│  │                           │  │   │ 4. Server records    │   │  │
│  │                           │  │   │    metadata in DB    │   │  │
│  │                           │  │   └─────────────────────┘   │  │
│  └───────────────────────────┘  └─────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                                │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │ NextAuth │ │ Stripe / │ │ Resend / │ │ WhatsApp Business  │  │
│  │ (Auth)   │ │ TeleBirr │ │ SendGrid │ │ API               │  │
│  │          │ │ (Pay)    │ │ (Email)  │ │ (Chat)            │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. THREE APPLICATION ZONES

The app has 3 distinct user-facing zones, each with its own layout:

### Zone A — Public Marketplace `/(marketplace)/`
**Who:** Anyone (unauthenticated visitors + logged-in users)
**Purpose:** Browse, search, view listings — like Dubizzle's main site
**Layout:** Marketplace header (logo, search bar, post ad button, auth)

```
Pages:
  /                          → Homepage (categories + featured listings)
  /search                    → Search results with filter sidebar
  /search?category=motors    → Category-filtered results
  /listing/[id]              → Listing detail page
  /listing/[slug]            → SEO-friendly listing URL
  /seller/[id]               → Seller profile + their listings
  /category/[slug]           → Category landing page
```

### Zone B — User Dashboard `/(dashboard)/`
**Who:** Authenticated users (sellers, buyers, staff)
**Purpose:** Manage listings, messages, orders, profile
**Layout:** Sidebar + header (like current dashboard)

```
Pages:
  /dashboard                 → Overview stats
  /dashboard/my-listings     → Seller's listings (CRUD)
  /dashboard/messages        → Conversations inbox
  /dashboard/favorites       → Saved/wishlisted items
  /dashboard/saved-searches  → Saved search alerts
  /dashboard/reviews         → Reviews given/received
  /dashboard/orders          → Order history
  /dashboard/settings        → Profile, notifications, password
```

### Zone C — Admin Panel `/(admin)/`
**Who:** ADMIN and MANAGER roles only
**Purpose:** Full system management
**Layout:** Admin sidebar with expanded navigation

```
Pages:
  /admin                     → Admin overview (charts, KPIs)
  /admin/users               → User management (ban, verify, roles)
  /admin/listings            → Listing moderation queue
  /admin/categories          → Category CRUD (hierarchical)
  /admin/orders              → All orders management
  /admin/products            → Product catalog (B2B)
  /admin/inventory           → Warehouse stock management
  /admin/customers           → Customer CRM
  /admin/distributors        → Distributor management
  /admin/payments            → Payment records
  /admin/reports             → Abuse/spam reports queue
  /admin/analytics           → Business analytics
  /admin/settings            → System configuration
  /admin/whatsapp            → WhatsApp chat management
```

---

## 3. TECHNOLOGY STACK (LOCKED)

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Framework | Next.js (App Router) | 14.2.21 | ✅ Installed |
| Language | TypeScript | 5.x | ✅ Installed |
| Database | PostgreSQL (Neon) | - | ✅ Connected, 28 tables live |
| ORM | Drizzle ORM | 0.45.1 | ✅ Schema pushed |
| Auth | NextAuth.js | 4.24.0 | ⬜ Installed, not configured |
| UI Components | shadcn/ui + Radix | - | ✅ 15+ components |
| Styling | Tailwind CSS | 3.4.1 | ✅ Configured |
| State | Zustand | 5.0.0 | ✅ 3 stores created |
| Data Fetching | TanStack React Query | 5.60.0 | ⬜ Installed, not used |
| Tables | TanStack React Table | 8.20.0 | ⬜ Installed, not used |
| Forms | React Hook Form + Zod | 7.53 / 3.23 | ✅ Validations created |
| Charts | Recharts | 2.13.0 | ⬜ Installed, not used |
| Animations | Framer Motion | 12.26.1 | ✅ Used in landing |
| File Storage | Cloudflare R2 | - | ⬜ To configure (replaces UploadThing) |
| R2 SDK | @aws-sdk/client-s3 | 3.x | ⬜ To install |
| Icons | Lucide React | 0.460.0 | ✅ Used |
| Toasts | Sonner | 1.7.0 | ✅ Installed |

---

## 4. DATA FLOW PATTERNS

### Pattern A: Server Component (Read-Only Pages)
```
Browser Request
  → Next.js Server Component
    → Server Action (getListings, getCategories)
      → Drizzle ORM query
        → PostgreSQL
      ← Returns typed data
    ← Returns JSX with data
  ← HTML streamed to browser
```
**Use for:** Homepage, search results, listing detail, category pages

### Pattern B: Client Interaction (Forms, Filters)
```
User interaction (click, type, submit)
  → Client Component (React state / Zustand store)
    → Server Action (via useFormState or fetch)
      → Zod validation
        → Drizzle ORM mutation
          → PostgreSQL
        ← Returns success/error
      ← Returns result
    ← UI updates (revalidatePath or setState)
```
**Use for:** Create listing, filters, messages, profile edits

### Pattern C: REST API (External / Mobile)
```
HTTP Request (GET/POST/PUT/DELETE)
  → API Route Handler (/api/...)
    → Zod validation (body/params)
      → Drizzle ORM
        → PostgreSQL
      ← Returns data
    ← JSON Response
```
**Use for:** Mobile app, third-party integrations, webhook receivers

### Pattern D: Direct Upload (Large Images → Cloudflare R2)
```
User selects image file(s)
  → Client Component validates (type, size)
    → POST /api/upload/presign (Server Action)
      → Generates pre-signed PUT URL via @aws-sdk/client-s3
      ← Returns { uploadUrl, publicUrl, key }
    → Client uploads file DIRECTLY to R2 (PUT to pre-signed URL)
      → Cloudflare R2 stores the file
    → Client confirms upload complete
      → POST /api/upload/confirm (Server Action)
        → Insert into media_assets table (DB)
        ← Returns { assetId, publicUrl }
    ← UI shows uploaded image preview
```
**Why this pattern:**
- **Bypasses Next.js server** — large files don't hit your 4.5MB serverless limit
- **No timeouts** — uploads go straight to R2, no proxy needed
- **Free 10GB** — Cloudflare R2 free tier: 10GB storage, 0 egress fees
- **S3-compatible** — uses standard @aws-sdk/client-s3 (same API as AWS S3)

---

## 5. AUTHENTICATION ARCHITECTURE

```
┌─────────────────────────────────────────┐
│             NextAuth.js                 │
│                                         │
│  Providers:                             │
│  ├── Credentials (email + password)     │
│  ├── Google OAuth (optional)            │
│  └── Phone/SMS (future)                 │
│                                         │
│  Session Strategy: JWT                  │
│                                         │
│  Database Tables:                       │
│  ├── users (main user record)           │
│  ├── accounts (OAuth provider links)    │
│  └── sessions (active sessions)         │
│                                         │
│  Middleware:                             │
│  ├── /dashboard/* → require auth        │
│  ├── /admin/*     → require ADMIN role  │
│  ├── /api/*       → optional auth       │
│  └── /*           → public              │
└─────────────────────────────────────────┘
```

**Role Hierarchy:**
```
ADMIN       → Full system access
MANAGER     → Dashboard + moderation (no system settings)
STAFF       → Dashboard read-only + process orders
SELLER      → Post listings + manage own ads + messages
BUYER       → Browse + message + wishlist + reviews
DISTRIBUTOR → Distributor portal + orders + catalog
```

---

## 6. STATE MANAGEMENT MAP

```
┌──────────────────────────────────────────────────────┐
│                  STATE SOURCES                       │
│                                                      │
│  SERVER STATE (React Query / Server Components):     │
│  ├── Listings data                                   │
│  ├── Categories                                      │
│  ├── User profile                                    │
│  ├── Messages                                        │
│  ├── Orders                                          │
│  └── Reviews                                         │
│                                                      │
│  CLIENT STATE (Zustand stores):                      │
│  ├── auth.ts  → user, isLoggedIn, logout()           │
│  ├── ui.ts    → sidebar, mobileMenu, language        │
│  └── filters.ts → query, category, price, sort, page │
│                                                      │
│  FORM STATE (React Hook Form):                       │
│  ├── Create/edit listing form                        │
│  ├── Login/signup forms                              │
│  ├── Message composer                                │
│  └── Review form                                     │
│                                                      │
│  URL STATE (searchParams):                           │
│  ├── /search?q=toyota&category=motors&sort=price_asc │
│  ├── /search?minPrice=1000&maxPrice=50000            │
│  └── Shareable filtered URLs                         │
└──────────────────────────────────────────────────────┘
```
