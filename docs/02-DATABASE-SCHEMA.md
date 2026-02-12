# SABEH IMPORTERS — Database Schema Reference
## PostgreSQL (Neon) — Managed by Drizzle ORM

**Status:** ✅ 28 tables live in production
**ORM:** Drizzle ORM 0.45.1
**Schema file:** `src/db/schema.ts`
**Config:** `drizzle.config.ts`

---

## ENTITY RELATIONSHIP MAP

```
                    ┌──────────┐
                    │  USERS   │
                    └────┬─────┘
          ┌──────────────┼──────────────┬──────────────┐
          │              │              │              │
    ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼────┐  ┌─────▼──────┐
    │ LISTINGS  │  │ REVIEWS   │  │ ORDERS  │  │ MESSAGES   │
    └─────┬─────┘  └───────────┘  └────┬────┘  └────────────┘
          │                            │
    ┌─────▼─────┐               ┌──────▼──────┐
    │CATEGORIES │               │ ORDER_ITEMS │
    └───────────┘               └──────┬──────┘
                                       │
                                ┌──────▼──────┐
                                │  PRODUCTS   │
                                └──────┬──────┘
                                       │
                                ┌──────▼──────┐
                                │  INVENTORY  │
                                └──────┬──────┘
                                       │
                                ┌──────▼──────┐
                                │ WAREHOUSES  │
                                └─────────────┘
```

---

## TABLE DETAILS

### 1. `users` — Core user accounts
| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) | Primary key, auto-generated |
| email | text | Unique, required |
| name | text | Display name |
| name_amharic | text | Amharic display name |
| phone | text | Unique, Ethiopian format |
| password | text | Hashed with bcrypt |
| role | enum | ADMIN, MANAGER, STAFF, SELLER, BUYER, DISTRIBUTOR |
| avatar | text | URL to profile image |
| bio | text | User bio |
| is_active | boolean | Account enabled |
| is_email_verified | boolean | Email confirmed |
| is_phone_verified | boolean | Phone confirmed |
| verification_status | enum | UNVERIFIED, PENDING, VERIFIED, REJECTED |
| response_rate | integer | 0-100 percentage |
| response_time | text | "within 1 hour" etc. |
| last_login | timestamp | |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | Soft delete |

**Indexes:** email, phone, role

---

### 2. `categories` — Hierarchical category tree
| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) | Primary key |
| name | text | English name |
| name_amharic | text | Amharic name |
| slug | text | URL-safe, unique |
| description | text | |
| icon | text | Lucide icon name |
| image | text | Category image URL |
| parent_id | text | FK → categories.id (self-reference) |
| sort_order | integer | Display order |
| is_active | boolean | |
| custom_fields | json | Category-specific form fields (see below) |
| listing_count | integer | Cached count |

**custom_fields example for "Cars":**
```json
[
  { "name": "year", "label": "Year", "type": "number", "required": true },
  { "name": "mileage", "label": "Mileage (km)", "type": "number" },
  { "name": "transmission", "label": "Transmission", "type": "select", "options": ["Automatic", "Manual"] },
  { "name": "fuel", "label": "Fuel Type", "type": "select", "options": ["Petrol", "Diesel", "Electric", "Hybrid"] },
  { "name": "make", "label": "Make", "type": "text", "required": true },
  { "name": "model", "label": "Model", "type": "text", "required": true }
]
```

**Seeded categories:**
```
Motors (ተሽከርካሪዎች)
├── Cars for Sale
├── Motorcycles
├── Trucks & Heavy Vehicles
└── Auto Parts

Property (ንብረት)
Electronics (ኤሌክትሮኒክስ)
├── Mobile Phones
├── Computers & Laptops
├── TVs & Audio
└── Gaming

Furniture & Home (የቤት ዕቃዎች)
Jobs (ሥራ)
Services (አገልግሎቶች)
Fashion & Beauty (ፋሽን እና ውበት)
Business for Sale (ለሽያጭ የቀረቡ ንግዶች)
Industrial Equipment (የኢንዱስትሪ መሣሪያዎች)
Community (ማህበረሰብ)
```

---

### 3. `listings` — Core marketplace listings
| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) | Primary key |
| seller_id | text | FK → users.id |
| title | text | Required |
| title_amharic | text | |
| description | text | Required |
| description_amharic | text | |
| slug | text | Unique, SEO URL |
| price | decimal(12,2) | |
| currency | enum | ETB, USD |
| negotiable | boolean | Default true |
| category_id | text | FK → categories.id |
| condition | enum | NEW, LIKE_NEW, USED_GOOD, USED_FAIR, FOR_PARTS |
| images | text[] | Array of image URLs |
| thumbnail | text | Main thumbnail URL |
| location | text | Free text |
| city | text | For filtering |
| region | text | For filtering |
| latitude | decimal(10,7) | GPS |
| longitude | decimal(10,7) | GPS |
| status | enum | DRAFT, PENDING_REVIEW, ACTIVE, SOLD, EXPIRED, REJECTED, DELETED |
| is_promoted | boolean | Paid promotion |
| is_featured | boolean | Admin featured |
| promoted_until | timestamp | Promotion expiry |
| expires_at | timestamp | Listing expiry |
| attributes | json | Category-specific values (year, mileage, etc.) |
| contact_phone | text | |
| contact_whatsapp | text | |
| show_phone | boolean | Privacy toggle |
| view_count | integer | Auto-incremented |
| favorite_count | integer | Wishlist count |
| inquiry_count | integer | Message count |
| deleted_at | timestamp | Soft delete |

**Indexes:** seller_id, category_id, status, city, price, created_at

---

### 4. `conversations` — Buyer-seller chat threads
| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) | |
| listing_id | text | FK → listings.id |
| buyer_id | text | FK → users.id |
| seller_id | text | FK → users.id |
| last_message_at | timestamp | For sorting |
| buyer_unread | integer | Unread count for buyer |
| seller_unread | integer | Unread count for seller |
| is_archived | boolean | |

### 5. `messages` — Individual messages
| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) | |
| conversation_id | text | FK → conversations.id (CASCADE) |
| sender_id | text | FK → users.id |
| content | text | Message body |
| type | enum | TEXT, IMAGE, DOCUMENT, OFFER |
| media_url | text | For image/doc messages |
| offer_amount | decimal | For OFFER type |
| offer_status | text | pending, accepted, rejected |
| is_read | boolean | |
| read_at | timestamp | |

### 6. `reviews` — Seller/buyer reviews
| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) | |
| reviewer_id | text | FK → users.id (who wrote it) |
| reviewee_id | text | FK → users.id (who receives it) |
| listing_id | text | FK → listings.id (optional) |
| rating | integer | 1-5 stars |
| title | text | |
| comment | text | |
| is_verified_purchase | boolean | Verified transaction |
| helpful_count | integer | "Was this helpful?" votes |
| response | text | Seller's reply |
| responded_at | timestamp | |
| deleted_at | timestamp | Soft delete |

### 7. `wishlists` — Saved/favorited listings
| Column | Type | Notes |
|--------|------|-------|
| user_id | text | FK → users.id |
| listing_id | text | FK → listings.id |
| Unique constraint on (user_id, listing_id) |

### 8. `saved_searches` — Search alerts
| Column | Type | Notes |
|--------|------|-------|
| user_id | text | FK → users.id |
| name | text | "Toyota under 2M" |
| query | text | Search text |
| filters | json | { category, minPrice, maxPrice, city, etc. } |
| alert_enabled | boolean | Send notifications |

### 9. `reports` — Content moderation
| Column | Type | Notes |
|--------|------|-------|
| reporter_id | FK → users.id |
| listing_id | FK → listings.id (optional) |
| reported_user_id | FK → users.id (optional) |
| reason | text | spam, scam, inappropriate, etc. |
| status | enum | PENDING, REVIEWING, RESOLVED, DISMISSED |

### 10. `notifications` — User notifications
| Column | Type | Notes |
|--------|------|-------|
| user_id | FK → users.id |
| type | enum | MESSAGE, LISTING, ORDER, REVIEW, SYSTEM, PRICE_DROP, SAVED_SEARCH |
| title | text | |
| message | text | |
| data | json | { listingId, orderId, etc. } |
| is_read | boolean | |

---

### 10a. `media_assets` — Cloudflare R2 file tracking (NEW TABLE)
| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) | Primary key |
| user_id | text | FK → users.id (who uploaded) |
| listing_id | text | FK → listings.id (optional, linked after) |
| r2_key | text | R2 object key (e.g. `listings/uuid/image-1.webp`) |
| public_url | text | Full public URL for display |
| original_name | text | Original filename |
| mime_type | text | `image/jpeg`, `image/webp`, etc. |
| size_bytes | integer | File size in bytes |
| width | integer | Image width (optional) |
| height | integer | Image height (optional) |
| bucket | text | R2 bucket name (`sabeh-uploads`) |
| entity_type | text | `listing`, `avatar`, `message`, `product` |
| sort_order | integer | For image gallery ordering |
| is_thumbnail | boolean | Default false, one per listing |
| created_at | timestamp | |
| deleted_at | timestamp | Soft delete |

**Indexes:** user_id, listing_id, entity_type, r2_key (unique)

**Why this table:**
- Track every uploaded file with its R2 location
- Link images to listings/products/users
- Support image reordering in galleries
- Enable cleanup of orphaned uploads (uploaded but never linked)
- Store dimensions for responsive image optimization

---

### ERP TABLES (B2B Side)

### 11. `products` — Warehouse product catalog
Price tiers: cost_price, wholesale_price, retail_price
Bilingual: name + name_amharic
Soft delete supported

### 12. `warehouses` — Physical warehouse locations

### 13. `inventory` — Stock per product per warehouse
Unique constraint: (product_id, warehouse_id)
Tracks: quantity, reserved, available

### 14. `stock_movements` — Audit trail for inventory changes
Types: IN, OUT, ADJUSTMENT, TRANSFER, RETURN, DAMAGED

### 15. `customers` — CRM contacts
Types: RETAIL, WHOLESALE, DISTRIBUTOR
Tracks: credit_limit, balance, TIN number

### 16. `distributors` — Distribution partners
Status flow: PENDING → APPROVED → ACTIVE → SUSPENDED/TERMINATED
Tracks: territory[], credit_limit, payment_terms, discount_rate

### 17-19. `orders`, `order_items`, `order_status_history`
Full order lifecycle with audit trail
Status: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED

### 20. `payments` — Transaction records
Methods: CASH, BANK_TRANSFER, TELEBIRR, CBE_BIRR, MPESA, CHECK, CREDIT, STRIPE

### 21-22. `whatsapp_chats`, `whatsapp_messages` — WhatsApp integration

### 23. `activity_logs` — System audit trail

### 24. `settings` — Key-value app configuration

### 25-26. `accounts`, `sessions` — NextAuth tables

### 27. `user_verifications` — ID/document verification

---

## ENUMS REFERENCE

```
user_role:           ADMIN, MANAGER, STAFF, SELLER, BUYER, DISTRIBUTOR
currency:            ETB, USD
listing_status:      DRAFT, PENDING_REVIEW, ACTIVE, SOLD, EXPIRED, REJECTED, DELETED
listing_condition:   NEW, LIKE_NEW, USED_GOOD, USED_FAIR, FOR_PARTS
order_status:        PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED
order_type:          SALES, PURCHASE, RETURN
order_source:        DIRECT, WHATSAPP, PHONE, ONLINE, DISTRIBUTOR
payment_status:      PENDING, COMPLETED, FAILED, REFUNDED
payment_method:      CASH, BANK_TRANSFER, TELEBIRR, CBE_BIRR, MPESA, CHECK, CREDIT, STRIPE
customer_type:       RETAIL, WHOLESALE, DISTRIBUTOR
distributor_status:  PENDING, APPROVED, ACTIVE, SUSPENDED, TERMINATED
movement_type:       IN, OUT, ADJUSTMENT, TRANSFER, RETURN, DAMAGED
chat_status:         ACTIVE, PENDING, RESOLVED, SPAM
message_type:        TEXT, IMAGE, DOCUMENT, CATALOG, ORDER, LOCATION, OFFER
message_direction:   INBOUND, OUTBOUND
message_status:      PENDING, SENT, DELIVERED, READ, FAILED
verification_status: UNVERIFIED, PENDING, VERIFIED, REJECTED
report_status:       PENDING, REVIEWING, RESOLVED, DISMISSED
notification_type:   MESSAGE, LISTING, ORDER, REVIEW, SYSTEM, PRICE_DROP, SAVED_SEARCH
```

---

## DRIZZLE COMMANDS

```bash
npm run db:push      # Push schema changes to database (no migration file)
npm run db:generate  # Generate SQL migration file
npm run db:migrate   # Run pending migrations
npm run db:studio    # Open visual database browser
npm run db:seed      # Seed sample data (src/db/seed.ts)
```
