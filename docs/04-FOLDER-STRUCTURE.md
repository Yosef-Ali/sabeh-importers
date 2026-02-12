# SABEH IMPORTERS — Target Folder Structure Blueprint

---

## CURRENT vs TARGET

Files marked with ✅ exist. Files marked with ⬜ need to be created.

```
sabeh-importers/
├── .env                                    ✅ Neon DB connected
├── drizzle.config.ts                       ✅
├── next.config.js                          ✅
├── package.json                            ✅ Scripts updated for Drizzle
├── tailwind.config.ts                      ✅
├── tsconfig.json                           ✅
│
├── docs/                                   ✅ This documentation
│   ├── 01-ARCHITECTURE.md                  ✅
│   ├── 02-DATABASE-SCHEMA.md               ✅
│   ├── 03-API-SPECIFICATION.md             ✅
│   ├── 04-FOLDER-STRUCTURE.md              ✅ (this file)
│   ├── 05-IMPLEMENTATION-PHASES.md         ✅
│   └── 06-UI-WIREFRAMES.md                 ✅
│
├── drizzle/                                ✅ Auto-generated migrations
│
├── public/                                 ✅ Static assets
│
├── src/
│   ├── db/
│   │   ├── schema.ts                       ✅ Complete (28 tables, 19 enums)
│   │   └── seed.ts                         ✅ Sample data seeder
│   │
│   ├── lib/
│   │   ├── db.ts                           ✅ Drizzle client (singleton pool)
│   │   ├── utils.ts                        ✅ cn, formatCurrency, slugify, etc.
│   │   ├── auth.ts                         ⬜ NextAuth configuration
│   │   ├── r2.ts                           ⬜ Cloudflare R2 client (S3-compatible)
│   │   ├── uploadthing.ts                  ❌ TO REMOVE (replaced by R2)
│   │   └── validations/
│   │       ├── index.ts                    ✅ Re-exports all
│   │       ├── listing.ts                  ✅ createListing, searchListings schemas
│   │       ├── user.ts                     ✅ signUp, signIn, updateProfile schemas
│   │       ├── order.ts                    ✅ createOrder, createPayment schemas
│   │       ├── review.ts                   ⬜ createReview schema
│   │       └── message.ts                  ⬜ sendMessage schema
│   │
│   ├── actions/                            Server Actions (main business logic)
│   │   ├── marketplace.ts                  ✅ Listings CRUD, categories, wishlist
│   │   ├── upload.ts                       ⬜ R2 pre-signed URLs, confirm, delete
│   │   ├── auth.ts                         ⬜ signUp, signIn, updateProfile
│   │   ├── messages.ts                     ⬜ conversations, messages, offers
│   │   ├── reviews.ts                      ⬜ create/respond/helpful
│   │   ├── orders.ts                       ⬜ CRUD, status updates, payments
│   │   ├── notifications.ts               ⬜ get, markRead
│   │   ├── admin.ts                        ⬜ moderation, user management
│   │   └── inventory.ts                    ⬜ stock movements, warehouse ops
│   │
│   ├── store/                              Zustand client state
│   │   ├── auth.ts                         ✅ user, isLoggedIn, logout
│   │   ├── ui.ts                           ✅ sidebar, mobileMenu, language
│   │   └── filters.ts                      ✅ query, category, price, sort, page
│   │
│   ├── hooks/                              Custom React hooks
│   │   ├── useDebounce.ts                  ✅
│   │   ├── useInfiniteScroll.ts            ✅
│   │   ├── useAuth.ts                      ⬜ Wrapper around NextAuth session
│   │   └── useListings.ts                  ⬜ React Query wrapper for listings
│   │
│   ├── types/
│   │   └── index.ts                        ✅ All TypeScript types
│   │
│   ├── components/
│   │   ├── ui/                             ✅ shadcn/ui base components (15+)
│   │   │   ├── avatar.tsx                  ✅
│   │   │   ├── badge.tsx                   ✅
│   │   │   ├── button.tsx                  ✅
│   │   │   ├── card.tsx                    ✅
│   │   │   ├── dialog.tsx                  ✅
│   │   │   ├── dropdown-menu.tsx           ✅
│   │   │   ├── image-upload.tsx            ✅ → REFACTOR to use R2 pre-signed URLs
│   │   │   ├── input.tsx                   ✅
│   │   │   ├── label.tsx                   ✅
│   │   │   ├── select.tsx                  ✅
│   │   │   ├── skeleton.tsx               ✅
│   │   │   ├── table.tsx                   ✅
│   │   │   ├── tabs.tsx                    ✅
│   │   │   ├── textarea.tsx               ✅
│   │   │   └── ... (sheet, separator, etc.)
│   │   │
│   │   ├── marketplace/                    Marketplace-specific components
│   │   │   ├── listing-card.tsx            ✅ Single listing card
│   │   │   ├── listing-feed.tsx            ✅ Grid of listing cards
│   │   │   ├── listing-gallery.tsx         ⬜ Image gallery with thumbnails
│   │   │   ├── listing-detail.tsx          ⬜ Full listing detail content
│   │   │   ├── search-bar.tsx              ✅ Search input with suggestions
│   │   │   ├── filters.tsx                 ✅ Filter sidebar
│   │   │   ├── category-grid.tsx           ⬜ Homepage category icons
│   │   │   ├── seller-card.tsx             ⬜ Seller info sidebar
│   │   │   ├── review-card.tsx             ⬜ Single review display
│   │   │   ├── review-form.tsx             ⬜ Write a review
│   │   │   ├── chat-window.tsx             ⬜ Message thread
│   │   │   ├── chat-list.tsx               ⬜ Conversation list
│   │   │   ├── offer-message.tsx           ⬜ Make/respond to offer
│   │   │   ├── wishlist-button.tsx         ⬜ Heart icon toggle
│   │   │   ├── share-button.tsx            ⬜ Social sharing
│   │   │   └── report-dialog.tsx           ⬜ Report listing modal
│   │   │
│   │   ├── forms/                          Reusable form components
│   │   │   ├── listing-form.tsx            ⬜ Create/edit listing form
│   │   │   ├── login-form.tsx              ⬜ Login form
│   │   │   ├── signup-form.tsx             ⬜ Registration form
│   │   │   ├── profile-form.tsx            ⬜ Edit profile form
│   │   │   ├── order-form.tsx              ⬜ Create order form
│   │   │   └── customer-form.tsx           ⬜ Create/edit customer
│   │   │
│   │   ├── tables/                         Data table components
│   │   │   ├── data-table.tsx              ⬜ Generic TanStack table wrapper
│   │   │   ├── listings-table.tsx          ⬜ Admin listings table
│   │   │   ├── orders-table.tsx            ⬜ Orders management table
│   │   │   ├── users-table.tsx             ⬜ User management table
│   │   │   ├── products-table.tsx          ⬜ Products catalog table
│   │   │   └── inventory-table.tsx         ⬜ Stock levels table
│   │   │
│   │   ├── dashboard/
│   │   │   ├── header.tsx                  ✅ Dashboard top bar
│   │   │   ├── sidebar.tsx                 ✅ Dashboard sidebar nav
│   │   │   ├── stat-card.tsx               ⬜ KPI metric card
│   │   │   ├── chart-revenue.tsx           ⬜ Revenue line chart
│   │   │   ├── chart-orders.tsx            ⬜ Orders bar chart
│   │   │   └── recent-activity.tsx         ⬜ Activity feed
│   │   │
│   │   ├── layout/                         Shared layout components
│   │   │   ├── marketplace-header.tsx      ⬜ Public site header (search + nav)
│   │   │   ├── marketplace-footer.tsx      ⬜ Public site footer
│   │   │   ├── mobile-nav.tsx              ⬜ Bottom tab bar for mobile
│   │   │   └── breadcrumb.tsx              ⬜ Breadcrumb navigation
│   │   │
│   │   ├── landing/
│   │   │   ├── Navbar.tsx                  ✅ Landing page navbar
│   │   │   └── BYDScrollHero.tsx           ✅ Scroll animation hero
│   │   │
│   │   └── theme-provider.tsx              ✅ Dark/light mode
│   │
│   └── app/                                Next.js App Router pages
│       ├── layout.tsx                      ✅ Root layout (fonts, providers)
│       ├── page.tsx                        ✅ Landing page (needs redesign → marketplace home)
│       ├── globals.css                     ✅
│       │
│       ├── (marketplace)/                  ZONE A: Public browsing
│       │   ├── layout.tsx                  ✅ Marketplace layout shell
│       │   ├── page.tsx                    ✅ Homepage (categories + featured)
│       │   ├── search/
│       │   │   └── page.tsx                ✅ Search results + filters
│       │   ├── listing/
│       │   │   ├── [id]/
│       │   │   │   └── page.tsx            ⬜ Listing detail page
│       │   │   └── [slug]/
│       │   │       └── page.tsx            ⬜ SEO-friendly listing page
│       │   ├── category/
│       │   │   └── [slug]/
│       │   │       └── page.tsx            ⬜ Category landing page
│       │   └── seller/
│       │       └── [id]/
│       │           └── page.tsx            ⬜ Seller profile page
│       │
│       ├── (auth)/                         Authentication pages
│       │   ├── login/
│       │   │   └── page.tsx                ✅ (needs wiring to NextAuth)
│       │   ├── register/
│       │   │   └── page.tsx                ⬜ Sign up page
│       │   ├── verify/
│       │   │   └── page.tsx                ⬜ Email/phone verification
│       │   └── forgot-password/
│       │       └── page.tsx                ⬜ Password reset
│       │
│       ├── (dashboard)/                    ZONE B: User dashboard
│       │   ├── layout.tsx                  ✅ Sidebar + header
│       │   ├── dashboard/
│       │   │   └── page.tsx                ✅ Overview (mock data → connect)
│       │   ├── marketplace/
│       │   │   ├── page.tsx                ✅ My listings
│       │   │   └── create/
│       │   │       └── page.tsx            ✅ Create listing form
│       │   ├── messages/
│       │   │   └── page.tsx                ⬜ Conversations inbox
│       │   ├── favorites/
│       │   │   └── page.tsx                ⬜ Wishlist / saved items
│       │   ├── reviews/
│       │   │   └── page.tsx                ⬜ Reviews given/received
│       │   ├── orders/
│       │   │   └── page.tsx                ✅ (mock data → connect)
│       │   ├── settings/
│       │   │   └── page.tsx                ✅ (mock → connect)
│       │   ├── customers/
│       │   │   └── page.tsx                ✅ (mock → connect)
│       │   ├── products/
│       │   │   └── page.tsx                ✅ (mock → connect)
│       │   ├── inventory/
│       │   │   └── page.tsx                ✅ (mock → connect)
│       │   ├── distributors/
│       │   │   └── page.tsx                ✅ (mock → connect)
│       │   ├── reports/
│       │   │   └── page.tsx                ✅ (mock → connect)
│       │   └── whatsapp/
│       │       └── page.tsx                ✅ (mock → connect)
│       │
│       ├── (admin)/                        ZONE C: Admin panel
│       │   ├── layout.tsx                  ⬜ Admin layout with role guard
│       │   ├── admin/
│       │   │   └── page.tsx                ⬜ Admin overview
│       │   ├── admin/users/
│       │   │   └── page.tsx                ⬜ User management
│       │   ├── admin/moderation/
│       │   │   └── page.tsx                ⬜ Listing moderation queue
│       │   ├── admin/categories/
│       │   │   └── page.tsx                ⬜ Category management
│       │   └── admin/analytics/
│       │       └── page.tsx                ⬜ Business analytics
│       │
│       └── api/                            REST API routes
│           ├── auth/
│           │   └── [...nextauth]/
│           │       └── route.ts            ⬜ NextAuth handler
│           ├── listings/
│           │   ├── route.ts                ✅ GET (list)
│           │   └── [id]/
│           │       └── route.ts            ✅ GET (detail)
│           ├── categories/
│           │   └── route.ts                ✅ GET
│           ├── products/
│           │   └── route.ts                ✅ GET
│           ├── customers/
│           │   └── route.ts                ✅ GET
│           ├── orders/
│           │   └── route.ts                ✅ GET
│           ├── inventory/
│           │   └── route.ts                ✅ GET
│           ├── distributors/
│           │   └── route.ts                ✅ GET
│           ├── whatsapp/
│           │   └── route.ts                ✅ GET
│           ├── upload/
│           │   ├── presign/
│           │   │   └── route.ts            ⬜ POST: generate pre-signed URL
│           │   ├── confirm/
│           │   │   └── route.ts            ⬜ POST: confirm upload + save to DB
│           │   ├── settings/
│           │   │   └── route.ts            ⬜ GET/PUT: R2 settings (admin)
│           │   └── [id]/
│           │       └── route.ts            ⬜ DELETE: remove from R2 + DB
│           ├── uploadthing/                ❌ TO REMOVE (replaced by R2)
│           │   ├── core.ts                 ❌
│           │   └── route.ts                ❌
│           ├── conversations/
│           │   └── route.ts                ⬜ GET/POST
│           ├── reviews/
│           │   └── route.ts                ⬜ GET/POST
│           ├── notifications/
│           │   └── route.ts                ⬜ GET/PUT
│           └── webhooks/
│               ├── whatsapp/
│               │   └── route.ts            ⬜ Webhook receiver
│               └── payment/
│                   └── route.ts            ⬜ Payment webhook
│
└── middleware.ts                            ⬜ Auth route protection
```

---

## SUMMARY COUNTS

| Category | Exists | To Build | Total |
|----------|--------|----------|-------|
| Database tables | 28 | 0 | **28** |
| Server Actions | 1 file | 6 files | **7** |
| API Routes | 9 | 6 | **15** |
| Pages | 18 | 14 | **32** |
| Components | 25 | 25 | **50** |
| Stores | 3 | 0 | **3** |
| Hooks | 2 | 2 | **4** |
| Validations | 3 | 2 | **5** |
