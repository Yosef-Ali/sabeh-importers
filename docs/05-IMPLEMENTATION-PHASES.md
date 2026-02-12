# SABEH IMPORTERS — Implementation Phases
## Step-by-Step Build Order for AI Agents

---

## HOW TO USE THIS DOCUMENT

Each phase has numbered tasks. Complete them **in order** within each phase.
Phases can overlap slightly but dependencies are noted.

**For each task:**
1. Read the referenced docs (architecture, schema, API spec)
2. Build the code
3. Test it works
4. Move to next task

---

## PHASE 1: AUTHENTICATION (Must be first — everything depends on it)

### 1.1 Configure NextAuth
- **File:** `src/lib/auth.ts`
- **What:** Create NextAuth configuration with Credentials provider
- **Details:**
  - Use JWT session strategy
  - Hash passwords with bcrypt on signup
  - Compare hashed passwords on login
  - Include user role, id, name, email in JWT token
  - Use existing `users`, `accounts`, `sessions` tables (already in DB)
  - Adapter: Use Drizzle adapter or custom queries

### 1.2 Create Auth API Route
- **File:** `src/app/api/auth/[...nextauth]/route.ts`
- **What:** Wire up NextAuth handler
- **Details:** Export GET and POST from NextAuth handler

### 1.3 Create Middleware
- **File:** `src/middleware.ts` (project root)
- **What:** Protect routes by role
- **Rules:**
  ```
  /dashboard/*  → Require any authenticated user
  /admin/*      → Require ADMIN or MANAGER role
  /api/*        → Allow all (auth checked per-route)
  Everything else → Public
  ```

### 1.4 Build Auth Server Actions
- **File:** `src/actions/auth.ts`
- **What:** signUp, updateProfile, changePassword
- **Details:**
  - `signUp`: Validate with Zod (src/lib/validations/user.ts), hash password, insert into users table
  - `updateProfile`: Update name, bio, avatar, phone
  - `changePassword`: Verify old password, hash new one

### 1.5 Build Login Page
- **File:** `src/app/(auth)/login/page.tsx` (already exists, needs wiring)
- **What:** Connect form to NextAuth signIn
- **Details:** Use React Hook Form + Zod, call signIn("credentials"), redirect on success

### 1.6 Build Register Page
- **File:** `src/app/(auth)/register/page.tsx`
- **What:** Sign up form
- **Details:** Name, email, phone, password, confirm password → call signUp action

### 1.7 Create useAuth Hook
- **File:** `src/hooks/useAuth.ts`
- **What:** Convenience hook wrapping useSession from NextAuth
- **Returns:** `{ user, isLoggedIn, isAdmin, isSeller, loading }`

### 1.8 Fix Marketplace Actions Auth
- **File:** `src/actions/marketplace.ts`
- **What:** Replace "TEMPORARY: Use first user" with real auth
- **Details:** Import getServerSession, get user ID from session

**✅ Phase 1 Complete When:** Users can sign up, log in, and protected routes work

---

## PHASE 1B: CLOUDFLARE R2 STORAGE (Must be before image uploads)

### 1B.1 Install R2 Dependencies
- **Command:** `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
- **Remove:** `npm uninstall uploadthing @uploadthing/react`
- **What:** Replace UploadThing with S3-compatible Cloudflare R2

### 1B.2 Create R2 Client
- **File:** `src/lib/r2.ts`
- **What:** Initialize S3Client pointing to Cloudflare R2
- **Details:**
  ```
  - Read from env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
  - Endpoint: https://{ACCOUNT_ID}.r2.cloudflarestorage.com
  - Region: "auto"
  - Export: s3Client, BUCKET_NAME, getPublicUrl(key)
  ```

### 1B.3 Add media_assets Table to Schema
- **File:** `src/db/schema.ts`
- **What:** Add new `media_assets` table (see 02-DATABASE-SCHEMA.md)
- **Then:** Run `npm run db:push` to create table in Neon

### 1B.4 Create Upload Server Actions
- **File:** `src/actions/upload.ts`
- **What:** Pre-signed URL generation + upload confirmation
- **Functions:**
  - `getPresignedUploadUrl(fileName, fileType, fileSize, entityType)`
    → Validates file type/size → generates unique R2 key → returns pre-signed PUT URL (15min expiry)
  - `confirmUpload(key, listingId?, entityType, sortOrder?)`
    → Verifies file exists in R2 → inserts into media_assets table → returns publicUrl
  - `deleteUpload(assetId)`
    → Deletes from R2 + marks deleted_at in DB
  - `reorderImages(listingId, assetIds[])`
    → Updates sort_order for each asset

### 1B.5 Create Upload API Routes
- **Files:**
  - `src/app/api/upload/presign/route.ts` → POST handler
  - `src/app/api/upload/confirm/route.ts` → POST handler
  - `src/app/api/upload/[id]/route.ts` → DELETE handler

### 1B.6 Refactor ImageUpload Component
- **File:** `src/components/ui/image-upload.tsx`
- **What:** Replace UploadThing dropzone with custom R2 direct upload
- **Flow:**
  1. User drops/selects files
  2. Client validates (type, size, count)
  3. For each file: call `getPresignedUploadUrl()` → PUT to R2 → call `confirmUpload()`
  4. Show progress bar per file
  5. Return array of publicUrls via onChange callback
- **Features:** Drag & drop, multi-file, progress, preview, reorder, delete

### 1B.7 R2 Admin Settings (Optional)
- **File:** `src/app/(admin)/admin/settings/page.tsx`
- **What:** Settings dialog to configure + test R2 credentials
- **Details:** Input fields for Account ID, Access Key, Secret Key, Bucket → "Test Connection" button

### 1B.8 Add .env Variables
- **File:** `.env`
- **Add:**
  ```
  R2_ACCOUNT_ID=your_cloudflare_account_id
  R2_ACCESS_KEY_ID=your_r2_access_key
  R2_SECRET_ACCESS_KEY=your_r2_secret_key
  R2_BUCKET_NAME=sabeh-uploads
  R2_PUBLIC_URL=https://pub-xxx.r2.dev
  ```

### 1B.9 Remove UploadThing
- **Delete:** `src/app/api/uploadthing/core.ts`, `src/app/api/uploadthing/route.ts`
- **Delete:** `src/lib/uploadthing.ts`
- **Remove from `.env`:** `UPLOADTHING_TOKEN`

**✅ Phase 1B Complete When:** Images upload directly to R2 via pre-signed URLs, metadata saved in DB

**FREE TIER:** 10GB storage + 0 egress fees + 1M writes/month + 10M reads/month

---

## PHASE 2: PUBLIC MARKETPLACE PAGES (The Dubizzle-style frontend)

### 2.1 Marketplace Homepage
- **File:** `src/app/(marketplace)/page.tsx` (exists, needs redesign)
- **What:** Dubizzle-style homepage
- **Sections:**
  1. Hero search bar (large, centered)
  2. Category grid (10 icons with names in EN + AM)
  3. Featured/promoted listings carousel
  4. Recent listings grid (4 columns, 20 items)
  5. Footer
- **Data:** Call `getCategories()` + `getListings({ limit: 20, sortBy: 'newest' })`

### 2.2 Category Grid Component
- **File:** `src/components/marketplace/category-grid.tsx`
- **What:** Grid of category icons linking to filtered search
- **Details:** Map Lucide icons from category.icon field, show name + nameAmharic

### 2.3 Search Results Page
- **File:** `src/app/(marketplace)/search/page.tsx` (exists, needs real data)
- **What:** Full search results with filter sidebar
- **Layout:** See wireframe in 06-UI-WIREFRAMES.md
- **Details:**
  - Read filters from URL searchParams
  - Call `getListings(filters)` server action
  - Show filter sidebar (category tree, price range, condition, city)
  - Sort dropdown (newest, price asc, price desc)
  - Pagination or infinite scroll
  - "X results found" count

### 2.4 Listing Detail Page
- **File:** `src/app/(marketplace)/listing/[id]/page.tsx`
- **What:** Full listing detail (most important page)
- **Sections:**
  1. Breadcrumb: Home > Category > Subcategory
  2. Image gallery with thumbnails
  3. Title, price, negotiable badge, condition badge
  4. Description
  5. Category-specific attributes (year, mileage for cars)
  6. Location (text + optional map)
  7. Seller card (name, avatar, rating, verification badge, member since)
  8. Contact buttons: Chat, Call, WhatsApp
  9. Action buttons: Save to wishlist, Share, Report
  10. Similar listings carousel
- **Data:** Call `getListingById(id)`

### 2.5 Listing Gallery Component
- **File:** `src/components/marketplace/listing-gallery.tsx`
- **What:** Image carousel with thumbnail strip
- **Details:** Click thumbnail to change main image, full-screen lightbox on click

### 2.6 Seller Card Component
- **File:** `src/components/marketplace/seller-card.tsx`
- **What:** Sidebar card showing seller info
- **Shows:** Avatar, name, verification badge, rating stars, response rate, member since date

### 2.7 Seller Profile Page
- **File:** `src/app/(marketplace)/seller/[id]/page.tsx`
- **What:** Public seller profile
- **Sections:** Seller info, their active listings, reviews received

### 2.8 Category Landing Page
- **File:** `src/app/(marketplace)/category/[slug]/page.tsx`
- **What:** Category page with subcategory links + listings

### 2.9 Marketplace Header Component
- **File:** `src/components/layout/marketplace-header.tsx`
- **What:** Top bar for public pages
- **Contains:** Logo, search bar, "Post Your Ad" button, login/signup (or user avatar if logged in)

### 2.10 Marketplace Footer Component
- **File:** `src/components/layout/marketplace-footer.tsx`
- **What:** Footer with category links, company info, social links

**✅ Phase 2 Complete When:** Users can browse, search, filter, and view listing details

---

## PHASE 3: LISTING MANAGEMENT (Post & manage ads)

### 3.1 Create Listing Form (Redesign)
- **File:** `src/app/(dashboard)/marketplace/create/page.tsx` (exists, needs upgrade)
- **What:** Multi-step listing creation form
- **Steps:**
  1. Select category (loads category-specific custom fields)
  2. Fill details (title, description, price, condition)
  3. Upload images (up to 10, drag & drop, reorder)
  4. Set location (city, region, optional map pin)
  5. Contact preferences (phone, WhatsApp, show/hide)
  6. Preview & publish

### 3.2 My Listings Page
- **File:** `src/app/(dashboard)/marketplace/page.tsx` (exists, needs real data)
- **What:** Seller's listing management
- **Features:**
  - Tabs: Active, Pending, Expired, Sold, Drafts
  - Each listing: thumbnail, title, price, views, messages count, status badge
  - Actions: Edit, Promote, Deactivate, Delete
  - "Post New Ad" button

### 3.3 Edit Listing Page
- **File:** `src/app/(dashboard)/marketplace/edit/[id]/page.tsx`
- **What:** Same form as create but pre-filled with existing data

### 3.4 Image Upload Integration
- **File:** `src/components/ui/image-upload.tsx` (refactored in Phase 1B)
- **What:** Drag & drop image uploader using Cloudflare R2 pre-signed URLs
- **Features:** Multiple files (up to 10), preview, drag-to-reorder, delete, progress bar
- **Note:** Component was rebuilt in Phase 1B. This step integrates it into listing forms

**✅ Phase 3 Complete When:** Sellers can create, edit, and manage their listings

---

## PHASE 4: MESSAGING SYSTEM

### 4.1 Message Server Actions
- **File:** `src/actions/messages.ts`
- **What:** startConversation, sendMessage, getConversations, getMessages, markAsRead

### 4.2 Conversations Inbox Page
- **File:** `src/app/(dashboard)/messages/page.tsx`
- **What:** List of conversations with last message preview
- **Layout:** Left sidebar (conversation list) + right panel (active chat)

### 4.3 Chat Window Component
- **File:** `src/components/marketplace/chat-window.tsx`
- **What:** Message thread display
- **Features:** Message bubbles (sent/received), timestamps, read receipts

### 4.4 "Contact Seller" Flow
- **What:** When buyer clicks "Chat" on listing detail:
  1. Check if conversation exists for this listing + buyer
  2. If yes → open existing conversation
  3. If no → create new conversation with auto-message

### 4.5 Make an Offer Flow
- **File:** `src/components/marketplace/offer-message.tsx`
- **What:** Special message type for price offers
- **Details:** Amount input → creates OFFER message → seller sees Accept/Reject/Counter buttons

**✅ Phase 4 Complete When:** Buyers and sellers can chat and negotiate

---

## PHASE 5: REVIEWS & TRUST

### 5.1 Review Server Actions
- **File:** `src/actions/reviews.ts`

### 5.2 Review Form
- **File:** `src/components/marketplace/review-form.tsx`
- **What:** Star rating (1-5) + title + comment

### 5.3 Review Display
- **File:** `src/components/marketplace/review-card.tsx`
- **What:** Shows reviewer name, avatar, stars, comment, date, seller response

### 5.4 Wishlist / Favorites Page
- **File:** `src/app/(dashboard)/favorites/page.tsx`
- **What:** Grid of wishlisted listings

### 5.5 Saved Searches Page
- **File:** `src/app/(dashboard)/saved-searches/page.tsx`
- **What:** List of saved search alerts

**✅ Phase 5 Complete When:** Users can review sellers and save favorites

---

## PHASE 6: ADMIN PANEL

### 6.1 Admin Layout
- **File:** `src/app/(admin)/layout.tsx`
- **What:** Admin sidebar with role guard (redirect if not ADMIN)

### 6.2 Admin Dashboard
- **File:** `src/app/(admin)/admin/page.tsx`
- **What:** KPI cards + charts (users, listings, revenue, orders)
- **Charts:** Use Recharts (already installed)

### 6.3 User Management
- **File:** `src/app/(admin)/admin/users/page.tsx`
- **What:** TanStack Table with all users
- **Actions:** View, edit role, verify, ban/unban, delete

### 6.4 Listing Moderation
- **File:** `src/app/(admin)/admin/moderation/page.tsx`
- **What:** Queue of reported/pending listings
- **Actions:** Approve, reject, delete, warn seller

### 6.5 Category Management
- **File:** `src/app/(admin)/admin/categories/page.tsx`
- **What:** CRUD for categories with hierarchical tree view
- **Features:** Add/edit/delete, set icon, set custom fields, reorder

### 6.6 Analytics Page
- **File:** `src/app/(admin)/admin/analytics/page.tsx`
- **What:** Charts for listings posted, user growth, popular categories, revenue

**✅ Phase 6 Complete When:** Admins can manage all content and users

---

## PHASE 7: ERP PAGES (Connect existing mock pages to real data)

### 7.1 Connect Products Page
- **File:** `src/app/(dashboard)/products/page.tsx` (exists with mock data)
- **What:** Replace mock data with `GET /api/products`, add CRUD

### 7.2 Connect Inventory Page
- **What:** Replace mock data, add stock movement recording

### 7.3 Connect Orders Page
- **What:** Replace mock data, add create order flow, status updates

### 7.4 Connect Customers Page
- **What:** Replace mock data, add CRUD

### 7.5 Connect Distributors Page
- **What:** Replace mock data, add onboarding flow

### 7.6 Build Payments Tracking
- **What:** Payment recording and history for orders

**✅ Phase 7 Complete When:** All dashboard pages show real database data

---

## PHASE 8: POLISH & DEPLOY

### 8.1 Notifications System
- In-app notification bell with unread count
- Notification center page

### 8.2 SEO
- Meta tags, Open Graph, JSON-LD structured data
- XML sitemap, robots.txt
- Human-readable listing URLs (/listing/toyota-corolla-2022-xyz)

### 8.3 Performance
- Skeleton loading states
- Image optimization with Next.js Image
- Infinite scroll for listing feeds

### 8.4 Mobile
- Responsive testing all pages
- Bottom tab bar for mobile
- Touch-friendly interactions

### 8.5 Testing
- Vitest unit tests for server actions
- Playwright E2E for critical flows (signup → post ad → search → message)

### 8.6 Deploy
- Vercel deployment
- Environment variables
- Custom domain

---

## DEPENDENCY CHAIN

```
Phase 1 (Auth)
  ↓
Phase 1B (Cloudflare R2 Storage) ←── Must be before Phase 3
  ↓
Phase 2 (Public Pages) ←── Can start in parallel with Phase 1B
  ↓
Phase 3 (Listing Management) ←── Requires Auth + R2
  ↓
Phase 4 (Messaging) ←── Requires Auth + Listings
  ↓
Phase 5 (Reviews & Trust) ←── Requires Auth + Listings
  ↓
Phase 6 (Admin) ←── Requires Auth
  ↓
Phase 7 (ERP) ←── Requires Auth
  ↓
Phase 8 (Polish & Deploy)
```

**Parallel tracks possible:**
- Phase 1B + Phase 2 (R2 setup + public browsing pages)
- Phase 2 + Phase 3 (public browsing + listing creation)
- Phase 6 + Phase 7 (admin + ERP)
- Phase 4 + Phase 5 (messaging + reviews)
