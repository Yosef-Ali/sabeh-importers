# Sabeh Importers Management System

<div align="center">
  <h3>ሳቤህ ኢምፖርተርስ</h3>
  <p>A comprehensive import & distribution management system for Ethiopian businesses</p>
</div>

---

## 🌟 Features

### Core Modules

- **📦 Inventory Management** - Track stock levels across multiple warehouses
- **🛒 Order Management** - Process sales orders with multi-currency support
- **👥 Customer CRM** - Manage retail, wholesale, and distributor relationships
- **🚚 Distributor Portal** - Onboard and manage distribution partners
- **📱 WhatsApp Integration** - Automated sales funnel and customer support
- **📊 Reports & Analytics** - Business insights and performance metrics
- **📚 Digital Catalog** - Create and share product catalogs

### Ethiopian Market Features

- **🇪🇹 Bilingual Support** - English and Amharic (አማርኛ)
- **💰 Multi-Currency** - ETB and USD handling
- **📲 Mobile Payments** - Telebirr, CBE Birr integration
- **📡 Offline-First** - Works with intermittent connectivity
- **📱 SMS Fallback** - For areas without WhatsApp

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js |
| **State** | Zustand, React Query |
| **Forms** | React Hook Form, Zod |
| **Charts** | Recharts |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/sabeh-importers.git
   cd sabeh-importers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
sabeh-importers/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/         # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/    # Main application
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── inventory/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── distributors/
│   │   │   ├── whatsapp/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── api/            # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── forms/          # Form components
│   │   └── tables/         # Table components
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   └── types/              # TypeScript types
├── public/
│   └── images/
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔐 Authentication

The system uses NextAuth.js for authentication with support for:
- Email/Password login
- Role-based access control (Admin, Manager, Staff, Distributor)

### User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access |
| **Manager** | All except settings |
| **Staff** | Orders, inventory, customers |
| **Distributor** | Limited portal access |

---

## 📱 WhatsApp Integration

### Setting Up WhatsApp Business API

1. Create a Meta Business Account
2. Set up WhatsApp Business API
3. Add credentials to `.env`:
   ```env
   WHATSAPP_API_URL="https://graph.facebook.com/v18.0"
   WHATSAPP_ACCESS_TOKEN="your-token"
   WHATSAPP_PHONE_NUMBER_ID="your-phone-id"
   ```

### WhatsApp Sales Funnel

```
Customer Inquiry → Auto-Response → Catalog Link
        ↓
   Order Placement → Confirmation → Payment Link
        ↓
   Delivery Tracking → Feedback Collection
```

---

## 💳 Payment Integrations

### Telebirr Setup
```env
TELEBIRR_APP_ID="your-app-id"
TELEBIRR_APP_KEY="your-app-key"
TELEBIRR_SHORT_CODE="your-short-code"
```

### CBE Birr Setup
```env
CBE_BIRR_API_KEY="your-api-key"
CBE_BIRR_MERCHANT_ID="your-merchant-id"
```

---

## 🌍 Localization

The app supports:
- **English** (default)
- **Amharic** (አማርኛ)

### Adding Translations

Amharic text is supported via:
- `nameAmharic` fields in database
- `font-amharic` CSS class for proper rendering
- Noto Sans Ethiopic font

---

## 📊 Database Schema

### Key Models

- **User** - System users with roles
- **Product** - Product catalog with pricing tiers
- **Inventory** - Stock tracking per warehouse
- **Customer** - Customer profiles (retail/wholesale)
- **Distributor** - Distribution partners
- **Order** - Sales orders with items
- **Payment** - Payment transactions
- **WhatsAppChat** - Customer conversations

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

### Code Style

- ESLint + Prettier for formatting
- TypeScript strict mode
- Import aliases using `@/*`

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📝 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| GET | `/api/customers` | List customers |
| POST | `/api/whatsapp/webhook` | WhatsApp webhook |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

---

## 📄 License

This project is proprietary software for Sabeh Importers.

---

## 📞 Support

For support, contact:
- Email: support@sabehimporters.com
- Phone: +251 91 234 5678

---

<div align="center">
  <p>Built with ❤️ for Ethiopian businesses</p>
  <p>© 2026 Sabeh Importers</p>
</div>
