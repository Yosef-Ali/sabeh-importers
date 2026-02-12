# SABEH IMPORTERS — API & Server Actions Specification

---

## APPROACH: Server Actions (Primary) + API Routes (Secondary)

- **Server Actions** → Used by Next.js pages directly (form submissions, data fetching)
- **API Routes** → Used for REST access (mobile app, external integrations, client-side fetch)

---

## MARKETPLACE ACTIONS (`src/actions/marketplace.ts`)

### Listings

| Action | Input | Output | Auth |
|--------|-------|--------|------|
| `createListing(formData)` | FormData with title, description, price, categoryId, images, location, condition | `{ success, listingId }` or `{ error }` | Required (SELLER+) |
| `updateListing(id, formData)` | Same as create + listing ID | `{ success }` or `{ error }` | Required (owner only) |
| `deleteListing(id)` | Listing ID | `{ success }` | Required (owner or ADMIN) |
| `getListings(params)` | query, categoryId, minPrice, maxPrice, condition, city, sortBy, page, limit | `{ listings[], pagination }` | Public |
| `getListingById(id)` | Listing ID | `{ listing }` with seller, category, reviews | Public |
| `getListingBySlug(slug)` | Listing slug | `{ listing }` | Public |
| `toggleWishlist(listingId)` | Listing ID | `{ saved: boolean }` | Required |
| `reportListing(listingId, reason)` | Listing ID + reason | `{ success }` | Required |
| `promoteListing(id, duration)` | Listing ID + days | `{ success }` | Required (owner, payment) |

### Categories

| Action | Input | Output | Auth |
|--------|-------|--------|------|
| `getCategories()` | none | `{ categories[] }` with children | Public |
| `getCategoryBySlug(slug)` | Category slug | `{ category }` with children + listings | Public |
| `createCategory(data)` | name, slug, icon, parentId, customFields | `{ success, categoryId }` | ADMIN only |
| `updateCategory(id, data)` | Category ID + fields | `{ success }` | ADMIN only |

---

## AUTH ACTIONS (`src/actions/auth.ts`) — TO BUILD

| Action | Input | Output | Auth |
|--------|-------|--------|------|
| `signUp(formData)` | name, email, password, phone | `{ success }` or `{ error }` | Public |
| `signIn(formData)` | email, password | Redirects to dashboard | Public |
| `signOut()` | none | Redirects to home | Required |
| `updateProfile(formData)` | name, bio, avatar, phone | `{ success }` | Required |
| `changePassword(formData)` | currentPassword, newPassword | `{ success }` | Required |
| `getProfile()` | none | `{ user }` with listings count, rating | Required |
| `getSellerProfile(id)` | User ID | `{ seller }` with listings, reviews, stats | Public |

---

## MESSAGE ACTIONS (`src/actions/messages.ts`) — TO BUILD

| Action | Input | Output | Auth |
|--------|-------|--------|------|
| `startConversation(listingId, message)` | Listing ID + first message | `{ conversationId }` | Required (BUYER) |
| `sendMessage(conversationId, content, type?)` | Conversation ID + message | `{ messageId }` | Required (participant) |
| `makeOffer(conversationId, amount)` | Conversation ID + price | `{ messageId }` | Required (BUYER) |
| `respondToOffer(messageId, action)` | Message ID + accept/reject/counter | `{ success }` | Required (SELLER) |
| `getConversations()` | none | `{ conversations[] }` with last message | Required |
| `getMessages(conversationId)` | Conversation ID | `{ messages[] }` | Required (participant) |
| `markAsRead(conversationId)` | Conversation ID | `{ success }` | Required |

---

## REVIEW ACTIONS (`src/actions/reviews.ts`) — TO BUILD

| Action | Input | Output | Auth |
|--------|-------|--------|------|
| `createReview(data)` | revieweeId, listingId, rating, comment | `{ success }` | Required (BUYER) |
| `respondToReview(reviewId, response)` | Review ID + text | `{ success }` | Required (reviewee) |
| `getReviewsForUser(userId)` | User ID | `{ reviews[], avgRating, count }` | Public |
| `markReviewHelpful(reviewId)` | Review ID | `{ success }` | Required |

---

## ORDER ACTIONS (`src/actions/orders.ts`) — TO BUILD

| Action | Input | Output | Auth |
|--------|-------|--------|------|
| `createOrder(data)` | customerId, items[], source, notes | `{ success, orderId, orderNumber }` | Required (STAFF+) |
| `updateOrderStatus(id, status, notes)` | Order ID + new status | `{ success }` | Required (STAFF+) |
| `getOrders(filters)` | status, customerId, page | `{ orders[], pagination }` | Required (STAFF+) |
| `getOrderById(id)` | Order ID | `{ order }` with items, payments, history | Required |
| `createPayment(data)` | orderId, amount, method, reference | `{ success, paymentId }` | Required (STAFF+) |

---

## UPLOAD ACTIONS (`src/actions/upload.ts`) — TO BUILD (Cloudflare R2)

### Pre-signed URL Upload Flow (replaces UploadThing)

| Action | Input | Output | Auth |
|--------|-------|--------|------|
| `getPresignedUploadUrl(data)` | fileName, fileType, fileSize, entityType | `{ uploadUrl, publicUrl, key }` | Required |
| `confirmUpload(data)` | key, listingId?, entityType, sortOrder? | `{ success, assetId, publicUrl }` | Required |
| `deleteUpload(assetId)` | Asset ID | `{ success }` | Required (owner or ADMIN) |
| `reorderImages(listingId, assetIds[])` | Listing ID + ordered asset IDs | `{ success }` | Required (owner) |
| `setThumbnail(listingId, assetId)` | Listing ID + Asset ID | `{ success }` | Required (owner) |
| `getR2Settings()` | none | `{ configured: boolean, bucketName, storageUsed }` | ADMIN only |
| `updateR2Settings(data)` | accountId, accessKeyId, secretAccessKey, bucketName | `{ success, testResult }` | ADMIN only |

**Upload validation rules:**
- Max file size: **10MB** per image
- Max files per listing: **10 images**
- Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`
- Pre-signed URL expires: **15 minutes**
- Orphan cleanup: Files uploaded but not linked within 24h are deleted

---

## NOTIFICATION ACTIONS (`src/actions/notifications.ts`) — TO BUILD

| Action | Input | Output | Auth |
|--------|-------|--------|------|
| `getNotifications(page)` | page number | `{ notifications[], unreadCount }` | Required |
| `markAsRead(id)` | Notification ID | `{ success }` | Required |
| `markAllAsRead()` | none | `{ success }` | Required |

---

## REST API ROUTES

### Existing Routes (Built)
```
GET  /api/listings              → List with filters & pagination
GET  /api/listings/[id]         → Single listing detail
GET  /api/categories            → Category tree
GET  /api/products              → Product catalog
GET  /api/customers             → Customer list
GET  /api/orders                → Order list
GET  /api/inventory             → Inventory levels
GET  /api/distributors          → Distributor list
GET  /api/whatsapp              → WhatsApp chats
```

### Routes To Build
```
POST /api/listings              → Create listing
PUT  /api/listings/[id]         → Update listing
DEL  /api/listings/[id]         → Delete listing

POST /api/auth/register         → Sign up
POST /api/auth/login            → Sign in
GET  /api/auth/me               → Current user

POST /api/messages              → Send message
GET  /api/conversations         → User's conversations
GET  /api/conversations/[id]    → Messages in conversation

POST /api/reviews               → Create review
GET  /api/reviews/user/[id]     → Reviews for a user

POST /api/upload/presign         → Get pre-signed URL for R2 direct upload
POST /api/upload/confirm         → Confirm upload + save metadata to DB
DEL  /api/upload/[id]            → Delete file from R2 + DB
GET  /api/upload/settings        → R2 settings (admin)
PUT  /api/upload/settings        → Update R2 credentials (admin)

POST /api/orders                → Create order
PUT  /api/orders/[id]/status    → Update order status
POST /api/payments              → Record payment

GET  /api/notifications         → User notifications
PUT  /api/notifications/[id]    → Mark as read

POST /api/webhooks/whatsapp     → WhatsApp webhook receiver
POST /api/webhooks/payment      → Payment provider webhook
```

---

## RESPONSE FORMAT STANDARD

All API responses follow this shape:

**Success:**
```json
{
  "listings": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

**Error:**
```json
{
  "error": "Human-readable error message"
}
```

**Mutation success:**
```json
{
  "success": true,
  "listingId": "uuid-here"
}
```
