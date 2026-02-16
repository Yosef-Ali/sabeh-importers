# Sabeh Importers — Marketplace Platform

<div align="center">
  <h3>ሳቤህ ማርኬትፕሌስ</h3>
  <p>A full-featured marketplace and import management platform for Ethiopian businesses</p>
</div>

---

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

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Drizzle ORM |
| **Auth** | NextAuth.js |
| **AI** | Google Gemini (`@google/genai`), Vercel AI SDK (`ai`, `@ai-sdk/react`) |
| **File Uploads** | UploadThing |
| **State** | Zustand |
| **Forms** | React Hook Form, Zod |
| **Charts** | Recharts |
| **Notifications** | Sonner (toasts) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)

### Installation

```bash
git clone https://github.com/Yosef-Ali/sabeh-importers.git
cd sabeh-importers
npm install
cp .env.example .env   # Edit with your credentials
npm run db:push         # Push Drizzle schema to database
npm run dev             # http://localhost:3000
```

---

## Project Structure

```
sabeh-importers/
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

Proprietary software for Sabeh Importers.

---

<div align="center">
  <p>Built for Ethiopian businesses</p>
  <p>&copy; 2026 Sabeh Importers</p>
</div>
