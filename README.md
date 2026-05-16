# Sabeh Importers — Marketplace Platform

<div align="center">
  <h3>ሳቤህ ማርኬትፕሌስ</h3>
  <p>A full-featured marketplace and import management platform for Ethiopian businesses</p>
  <p>
    <a href="#features">Features</a> ·
    <a href="#mobile-app">Mobile App</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#getting-started">Getting Started</a> ·
    <a href="#project-structure">Structure</a>
  </p>
</div>

**Tech Stack:** Next.js · TypeScript · Tailwind CSS · PostgreSQL · Supabase

## Screenshots

> Add screenshots to `/screenshots/` folder.

| Screen | File | What to capture |
|--------|------|-----------------|
| Home | `home.png` | Product catalog / landing page |
| Product Detail | `product.png` | Individual product view |
| Dashboard | `dashboard.png` | Admin/management panel |

## Features

### Marketplace

- **Listings** — Create, edit, and manage product listings with image uploads
- **Seller Profiles** — Verified seller cards with ratings and verification badges
- **Search & Filters** — Category browsing, saved searches, wishlist
- **Messaging** — Real-time buyer/seller chat
- **AI-Powered Listings** — Auto-generate descriptions and analyze product images via Gemini

### Admin Dashboard

- **Dashboard Overview** — Stats and analytics at a glance
- **Listings Moderation** — Review, approve, or reject listings
- **User Management** — Ban, verify email, manage roles
- **Verification System** — Review seller verification documents with configurable methods
- **Promotions** — Feature and promote listings
- **Reports** — Handle flagged content
- **Plans** — Subscription plan CRUD with Amharic features support (draggable editor)
- **AI Generator** — Generate ad text (streaming) and product images using Gemini API

### Ethiopian Market Features

- **Bilingual Support** — English and Amharic (አማርኛ)
- **Multi-Currency** — ETB and USD handling
- **Mobile Payments** — Telebirr, CBE Birr integration
- **WhatsApp Integration** — Automated sales funnel and customer support

---

## Mobile App

A native iOS + Android client lives at [`apps/mobile/`](apps/mobile/), built with Expo SDK 54 + Expo Router 6 + NativeWind 4. It shares listing types, status enums, and visual metadata with this web app via the [`@sabeh/shared`](packages/shared/) package — so adding a status to the database surfaces a TypeScript error in both apps until every UI handles the new case.

Highlights of the current mobile build:
- 🇪🇹 Ethiopian-first UX — Amharic eyebrows, ETB/USD, +251 phone formats
- 💬 **WhatsApp deeplinks** on every listing — opens WhatsApp with a pre-filled buyer message; falls back to `wa.me` then `tel:`
- 🎨 Pixel-aligned with the web's Sabeh Authority design system (navy `#0A192F`, gold `#FFD700`, hard 4px shadows)
- ⚡ `expo-image` with blurhash placeholders for smooth, disk-cached image loading

See [`apps/mobile/README.md`](apps/mobile/README.md) for screenshots, status matrix, and run instructions.

```bash
cd apps/mobile && pnpm install && pnpm start
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Web Frontend** | Next.js 14, React 18, TypeScript |
| **Mobile Frontend** | Expo SDK 54, React Native 0.81, Expo Router 6, NativeWind 4 |
| **Shared Code** | `@sabeh/shared` package — types, enums, status metadata, formatters |
| **Styling** | Tailwind CSS, shadcn/ui (web); NativeWind (mobile) |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Drizzle ORM |
| **Auth** | NextAuth.js (web); phone-OTP + JWT (mobile, planned) |
| **AI** | Google Gemini (`@google/genai`), Vercel AI SDK (`ai`, `@ai-sdk/react`) |
| **File Uploads** | UploadThing (web), Cloudflare R2 (planned for mobile) |
| **State** | Zustand |
| **Forms** | React Hook Form, Zod |
| **Charts** | Recharts |
| **Notifications** | Sonner (toasts) |

---

## Getting Started

```bash
npm install
npm run dev
```

---

## Project Structure

```
sabeh-importers/
├── apps/
│   └── mobile/                  # Expo / React Native app — see apps/mobile/README.md
├── packages/
│   └── shared/                  # @sabeh/shared — types/enums/format helpers
│       ├── enums.ts             # ListingStatus, ListingCondition, Currency
│       ├── status-meta.ts       # Visual metadata for status badges
│       ├── categories.ts        # Marketplace categories + condition labels
│       └── format.ts            # formatPrice() helper
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, register
│   │   ├── (admin)/admin/       # Admin dashboard
│   │   │   ├── ai-generator/    # AI text & image generator
│   │   │   ├── listings/        # Listing moderation
│   │   │   ├── users/           # User management
│   │   │   ├── verifications/   # Seller verification review
│   │   │   ├── promotions/      # Listing promotions
│   │   │   ├── reports/         # Flagged content
│   │   │   ├── plans/           # Subscription plans CRUD
│   │   │   └── settings/        # Admin settings
│   │   ├── (dashboard)/         # Seller/buyer dashboard
│   │   │   ├── dashboard/       # Overview + settings
│   │   │   ├── marketplace/     # Browse listings
│   │   │   ├── my-listings/     # Manage own listings
│   │   │   ├── messages/        # Chat threads
│   │   │   ├── saved-searches/  # Saved search alerts
│   │   │   ├── wishlist/        # Wishlisted items
│   │   │   └── onboarding/      # New user onboarding
│   │   └── api/
│   │       ├── ai/              # AI endpoints
│   │       │   ├── analyze/     # Image analysis (Gemini)
│   │       │   ├── description/ # Streaming text generation
│   │       │   ├── generate-image/ # Image generation (gemini-2.5-flash-image)
│   │       │   └── ocr/         # OCR extraction
│   │       ├── auth/            # NextAuth routes
│   │       ├── listings/        # Listing CRUD
│   │       ├── chat/            # Messaging
│   │       ├── uploadthing/     # File upload handler
│   │       └── whatsapp/        # WhatsApp webhook
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── admin/               # Admin-specific components
│   │   ├── dashboard/           # Dashboard components
│   │   └── marketplace/         # Marketplace components
│   ├── db/
│   │   └── schema.ts            # Drizzle schema (PostgreSQL)
│   ├── lib/
│   │   ├── actions/             # Server actions
│   │   ├── validations/         # Zod schemas
│   │   └── store/               # Zustand stores
│   └── hooks/                   # Custom React hooks
├── scripts/                     # Utility scripts
├── public/
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Authentication & Roles

NextAuth.js with role-based access control:

| Role | Access |
|------|--------|
| **Admin** | Full admin dashboard, all management |
| **Manager** | Listings, users, reports |
| **Staff** | Listings, orders |
| **Seller** | Own listings, messages, dashboard |
| **Buyer** | Browse, wishlist, messages |
| **Distributor** | Limited portal access |

---

## AI Features

The platform integrates Google Gemini for AI-powered capabilities:

| Feature | Endpoint | Model |
|---------|----------|-------|
| **Ad Text Generation** | `/api/ai/description` | `gemini-3-pro-preview` (streaming) |
| **Image Analysis** | `/api/ai/analyze` | `gemini-3-flash-preview` |
| **Image Generation** | `/api/ai/generate-image` | `gemini-2.5-flash-image` |
| **OCR Extraction** | `/api/ai/ocr` | Gemini vision |

The **AI Generator** admin page (`/admin/ai-generator`) provides a UI with two tabs:
- **Generate Ad Text** — Input title, category, condition, price; streams a marketplace description
- **Generate Ad Image** — Input a text prompt; generates a product/ad image with download

Requires `GOOGLE_GENERATIVE_AI_API_KEY` in `.env`.

---

## Database Schema (Drizzle ORM)

Key tables defined in `src/db/schema.ts`:

- **users** — Accounts with roles (Admin, Seller, Buyer, etc.)
- **categories** — Hierarchical product categories with Amharic names
- **listings** — Marketplace listings with images, pricing, conditions
- **orders** — Sales orders with items and payment tracking
- **messages / conversations** — Buyer/seller messaging
- **subscriptions / plans** — Subscription tiers with features
- **saved_searches** — Search alerts for buyers
- **wishlists** — Saved listings
- **verifications** — Seller identity verification documents

---

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle client
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/description` | Stream ad description (Gemini) |
| POST | `/api/ai/generate-image` | Generate product image (Gemini) |
| POST | `/api/ai/analyze` | Analyze product image |
| POST | `/api/ai/ocr` | Extract text from image |
| GET/POST | `/api/listings` | List / create listings |
| GET/POST | `/api/orders` | List / create orders |
| GET | `/api/categories` | List categories |
| POST | `/api/chat` | Send message |
| POST | `/api/uploadthing` | File upload handler |
| POST | `/api/whatsapp/webhook` | WhatsApp webhook |
| GET/POST | `/api/admin/*` | Admin management endpoints |

---

## Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_GENERATIVE_AI_API_KEY="..."
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

---

## License

MIT
