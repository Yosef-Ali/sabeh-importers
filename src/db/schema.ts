import {
  pgTable,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
  json,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================
// ENUMS — Dubizzle-style marketplace + ERP
// ============================================================

export const userRoleEnum = pgEnum('user_role', [
  'ADMIN', 'MANAGER', 'STAFF', 'SELLER', 'BUYER', 'DISTRIBUTOR',
]);

export const currencyEnum = pgEnum('currency', ['ETB', 'USD']);

export const listingStatusEnum = pgEnum('listing_status', [
  'DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'SOLD', 'EXPIRED', 'REJECTED', 'DELETED',
]);

export const listingConditionEnum = pgEnum('listing_condition', [
  'NEW', 'LIKE_NEW', 'USED_GOOD', 'USED_FAIR', 'FOR_PARTS',
]);

export const orderStatusEnum = pgEnum('order_status', [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED',
]);

export const orderTypeEnum = pgEnum('order_type', ['SALES', 'PURCHASE', 'RETURN']);

export const orderSourceEnum = pgEnum('order_source', [
  'DIRECT', 'WHATSAPP', 'PHONE', 'ONLINE', 'DISTRIBUTOR',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'CASH', 'BANK_TRANSFER', 'TELEBIRR', 'CBE_BIRR', 'MPESA', 'CHECK', 'CREDIT', 'STRIPE',
]);

export const customerTypeEnum = pgEnum('customer_type', [
  'RETAIL', 'WHOLESALE', 'DISTRIBUTOR',
]);

export const distributorStatusEnum = pgEnum('distributor_status', [
  'PENDING', 'APPROVED', 'ACTIVE', 'SUSPENDED', 'TERMINATED',
]);

export const movementTypeEnum = pgEnum('movement_type', [
  'IN', 'OUT', 'ADJUSTMENT', 'TRANSFER', 'RETURN', 'DAMAGED',
]);

export const chatStatusEnum = pgEnum('chat_status', [
  'ACTIVE', 'PENDING', 'RESOLVED', 'SPAM',
]);

export const messageTypeEnum = pgEnum('message_type', [
  'TEXT', 'IMAGE', 'DOCUMENT', 'CATALOG', 'ORDER', 'LOCATION', 'OFFER',
]);

export const messageDirectionEnum = pgEnum('message_direction', ['INBOUND', 'OUTBOUND']);

export const messageStatusEnum = pgEnum('message_status', [
  'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED',
]);

export const verificationStatusEnum = pgEnum('verification_status', [
  'UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED',
]);

export const reportStatusEnum = pgEnum('report_status', [
  'PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED',
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'MESSAGE', 'LISTING', 'ORDER', 'REVIEW', 'SYSTEM', 'PRICE_DROP', 'SAVED_SEARCH',
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED',
]);

// ============================================================
// HELPER: reusable timestamp columns
// ============================================================
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

const softDelete = {
  deletedAt: timestamp('deleted_at'),
};

const uid = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID());

// ============================================================
// 1. USERS & AUTH
// ============================================================

export const users = pgTable('users', {
  id: uid(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  nameAmharic: text('name_amharic'),
  phone: text('phone').unique(),
  password: text('password').notNull(),
  role: userRoleEnum('role').default('BUYER').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  isActive: boolean('is_active').default(true).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  isPhoneVerified: boolean('is_phone_verified').default(false).notNull(),
  verificationStatus: verificationStatusEnum('verification_status').default('UNVERIFIED').notNull(),
  // Company fields (for SELLER accounts)
  companyName: text('company_name'),
  companyNameAmharic: text('company_name_amharic'),
  businessLicense: text('business_license'),
  tinNumber: text('tin_number'),
  website: text('website'),
  companyDescription: text('company_description'),
  coverImage: text('cover_image'),
  responseRate: integer('response_rate'), // percentage 0-100
  responseTime: text('response_time'), // "within 1 hour", etc.
  lastLogin: timestamp('last_login'),
  ...timestamps,
  ...softDelete,
}, (table) => [
  index('users_email_idx').on(table.email),
  index('users_phone_idx').on(table.phone),
  index('users_role_idx').on(table.role),
]);

export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  reviews: many(reviews, { relationName: 'reviewee' }),
  writtenReviews: many(reviews, { relationName: 'reviewer' }),
  buyerConversations: many(conversations, { relationName: 'buyer' }),
  sellerConversations: many(conversations, { relationName: 'seller' }),
  wishlists: many(wishlists),
  savedSearches: many(savedSearches),
  notifications: many(notifications),
  orders: many(orders, { relationName: 'orderCreator' }),
  verifications: many(userVerifications),
}));

// User Verification (ID, phone, email — like Dubizzle's trust badges)
export const userVerifications = pgTable('user_verifications', {
  id: uid(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'email', 'phone', 'government_id', 'business_license'
  documentUrl: text('document_url'),
  status: verificationStatusEnum('status').default('PENDING').notNull(),
  verifiedAt: timestamp('verified_at'),
  expiresAt: timestamp('expires_at'),
  reviewedBy: text('reviewed_by'),
  notes: text('notes'),
  ...timestamps,
});

export const userVerificationsRelations = relations(userVerifications, ({ one }) => ({
  user: one(users, {
    fields: [userVerifications.userId],
    references: [users.id],
  }),
}));

// NextAuth Accounts (for OAuth)
export const accounts = pgTable('accounts', {
  id: uid(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
});

export const sessions = pgTable('sessions', {
  id: uid(),
  sessionToken: text('session_token').unique().notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

// Email verification tokens (sent on register / resend request)
export const emailVerifications = pgTable('email_verifications', {
  id: uid(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  ...timestamps,
}, (t) => [
  index('ev_user_idx').on(t.userId),
  index('ev_token_idx').on(t.token),
]);

export const emailVerificationsRelations = relations(emailVerifications, ({ one }) => ({
  user: one(users, { fields: [emailVerifications.userId], references: [users.id] }),
}));

// Password reset tokens
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uid(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  ...timestamps,
}, (t) => [
  index('prt_user_idx').on(t.userId),
  index('prt_token_idx').on(t.token),
]);

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.userId], references: [users.id] }),
}));

// ── Subscription plans (defined by admin) ─────────────────────────────────────
export const plans = pgTable('plans', {
  id: uid(),
  name: text('name').notNull(),                    // "Free", "Pro", "Business"
  nameAmharic: text('name_amharic'),
  slug: text('slug').unique().notNull(),           // "free", "pro", "business"
  price: decimal('price', { precision: 10, scale: 2 }).default('0').notNull(),
  currency: currencyEnum('currency').default('ETB').notNull(),
  durationDays: integer('duration_days').default(30).notNull(),
  maxActiveListings: integer('max_active_listings').default(5).notNull(),
  canPromote: boolean('can_promote').default(false).notNull(),
  canFeature: boolean('can_feature').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0),
  ...timestamps,
});

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

// ── User subscriptions ─────────────────────────────────────────────────────────
export const subscriptions = pgTable('subscriptions', {
  id: uid(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: text('plan_id').notNull().references(() => plans.id),
  status: subscriptionStatusEnum('status').default('ACTIVE').notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelledAt: timestamp('cancelled_at'),
  externalId: text('external_id'),           // Chapa/Stripe subscription ID
  ...timestamps,
}, (t) => [
  index('sub_user_idx').on(t.userId),
  index('sub_status_idx').on(t.status),
]);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }),
}));

// ── Subscription payments ──────────────────────────────────────────────────────
export const subscriptionPayments = pgTable('subscription_payments', {
  id: uid(),
  subscriptionId: text('subscription_id').notNull().references(() => subscriptions.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum('currency').default('ETB').notNull(),
  status: paymentStatusEnum('status').default('PENDING').notNull(),
  method: paymentMethodEnum('method'),
  reference: text('reference'),              // bank/Chapa/Telebirr transaction ID
  paidAt: timestamp('paid_at'),
  ...timestamps,
});

export const subscriptionPaymentsRelations = relations(subscriptionPayments, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [subscriptionPayments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

// ============================================================
// 2. CATEGORIES (Dubizzle-style hierarchical)
// ============================================================

export const categories = pgTable('categories', {
  id: uid(),
  name: text('name').notNull(),
  nameAmharic: text('name_amharic'),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  icon: text('icon'),
  image: text('image'),
  parentId: text('parent_id'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true).notNull(),
  // Category-specific fields schema (JSON)
  // e.g., Motors category needs "year", "mileage", "transmission"
  customFields: json('custom_fields').$type<CategoryCustomField[]>(),
  listingCount: integer('listing_count').default(0),
  ...timestamps,
}, (table) => [
  index('categories_slug_idx').on(table.slug),
  index('categories_parent_idx').on(table.parentId),
]);

export type CategoryCustomField = {
  name: string;
  label: string;
  labelAmharic?: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
  required?: boolean;
};

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'subCategories',
  }),
  children: many(categories, { relationName: 'subCategories' }),
  listings: many(listings),
}));

// ============================================================
// 3. LISTINGS (Core marketplace — Dubizzle-style)
// ============================================================

export const listings = pgTable('listings', {
  id: uid(),
  sellerId: text('seller_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  titleAmharic: text('title_amharic'),
  description: text('description').notNull(),
  descriptionAmharic: text('description_amharic'),
  slug: text('slug').unique(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum('currency').default('ETB').notNull(),
  negotiable: boolean('negotiable').default(true),
  categoryId: text('category_id').notNull().references(() => categories.id),
  condition: listingConditionEnum('condition').default('USED_GOOD'),
  images: text('images').array().default([]),
  thumbnail: text('thumbnail'),
  // Location
  location: text('location'),
  city: text('city'),
  region: text('region'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  // Status & visibility
  status: listingStatusEnum('status').default('ACTIVE').notNull(),
  isPromoted: boolean('is_promoted').default(false),
  isFeatured: boolean('is_featured').default(false),
  promotedUntil: timestamp('promoted_until'),
  expiresAt: timestamp('expires_at'),
  // Category-specific attributes stored as JSON
  // e.g., { year: 2024, mileage: 15000, transmission: "automatic" }
  attributes: json('attributes').$type<Record<string, any>>(),
  // Contact preferences
  contactPhone: text('contact_phone'),
  contactWhatsapp: text('contact_whatsapp'),
  showPhone: boolean('show_phone').default(true),
  // Stats
  viewCount: integer('view_count').default(0),
  favoriteCount: integer('favorite_count').default(0),
  inquiryCount: integer('inquiry_count').default(0),
  ...timestamps,
  ...softDelete,
}, (table) => [
  index('listings_seller_idx').on(table.sellerId),
  index('listings_category_idx').on(table.categoryId),
  index('listings_status_idx').on(table.status),
  index('listings_city_idx').on(table.city),
  index('listings_price_idx').on(table.price),
  index('listings_created_idx').on(table.createdAt),
]);

export const listingsRelations = relations(listings, ({ one, many }) => ({
  seller: one(users, {
    fields: [listings.sellerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
  }),
  conversations: many(conversations),
  wishlists: many(wishlists),
  reviews: many(reviews),
}));

// ============================================================
// 4. CONVERSATIONS & MESSAGES (Dubizzle chat system)
// ============================================================

export const conversations = pgTable('conversations', {
  id: uid(),
  listingId: text('listing_id').notNull().references(() => listings.id),
  buyerId: text('buyer_id').notNull().references(() => users.id),
  sellerId: text('seller_id').notNull().references(() => users.id),
  lastMessageAt: timestamp('last_message_at'),
  buyerUnread: integer('buyer_unread').default(0),
  sellerUnread: integer('seller_unread').default(0),
  isArchived: boolean('is_archived').default(false),
  ...timestamps,
}, (table) => [
  index('conversations_buyer_idx').on(table.buyerId),
  index('conversations_seller_idx').on(table.sellerId),
  index('conversations_listing_idx').on(table.listingId),
]);

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  listing: one(listings, {
    fields: [conversations.listingId],
    references: [listings.id],
  }),
  buyer: one(users, {
    fields: [conversations.buyerId],
    references: [users.id],
    relationName: 'buyer',
  }),
  seller: one(users, {
    fields: [conversations.sellerId],
    references: [users.id],
    relationName: 'seller',
  }),
  messages: many(messages),
}));

export const messages = pgTable('messages', {
  id: uid(),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  type: messageTypeEnum('type').default('TEXT').notNull(),
  mediaUrl: text('media_url'),
  // Offer-specific fields
  offerAmount: decimal('offer_amount', { precision: 12, scale: 2 }),
  offerStatus: text('offer_status'), // 'pending', 'accepted', 'rejected', 'countered'
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  ...timestamps,
}, (table) => [
  index('messages_conversation_idx').on(table.conversationId),
  index('messages_sender_idx').on(table.senderId),
]);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// ============================================================
// 5. REVIEWS & RATINGS (Dubizzle trust system)
// ============================================================

export const reviews = pgTable('reviews', {
  id: uid(),
  reviewerId: text('reviewer_id').notNull().references(() => users.id),
  revieweeId: text('reviewee_id').notNull().references(() => users.id),
  listingId: text('listing_id').references(() => listings.id),
  rating: integer('rating').notNull(), // 1-5
  title: text('title'),
  comment: text('comment'),
  isVerifiedPurchase: boolean('is_verified_purchase').default(false),
  helpfulCount: integer('helpful_count').default(0),
  response: text('response'), // Seller's response
  respondedAt: timestamp('responded_at'),
  ...timestamps,
  ...softDelete,
}, (table) => [
  index('reviews_reviewee_idx').on(table.revieweeId),
  index('reviews_listing_idx').on(table.listingId),
]);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: 'reviewer',
  }),
  reviewee: one(users, {
    fields: [reviews.revieweeId],
    references: [users.id],
    relationName: 'reviewee',
  }),
  listing: one(listings, {
    fields: [reviews.listingId],
    references: [listings.id],
  }),
}));

// ============================================================
// 6. WISHLISTS & SAVED SEARCHES (Dubizzle favorites)
// ============================================================

export const wishlists = pgTable('wishlists', {
  id: uid(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  listingId: text('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  ...timestamps,
}, (table) => [
  uniqueIndex('wishlists_unique').on(table.userId, table.listingId),
]);

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [wishlists.listingId],
    references: [listings.id],
  }),
}));

export const savedSearches = pgTable('saved_searches', {
  id: uid(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  query: text('query'),
  filters: json('filters').$type<Record<string, any>>(),
  categoryId: text('category_id'),
  alertEnabled: boolean('alert_enabled').default(true),
  lastNotifiedAt: timestamp('last_notified_at'),
  ...timestamps,
});

export const savedSearchesRelations = relations(savedSearches, ({ one }) => ({
  user: one(users, {
    fields: [savedSearches.userId],
    references: [users.id],
  }),
}));

// ============================================================
// 7. REPORTS (Dubizzle content moderation)
// ============================================================

export const reports = pgTable('reports', {
  id: uid(),
  reporterId: text('reporter_id').notNull().references(() => users.id),
  listingId: text('listing_id').references(() => listings.id),
  userId: text('reported_user_id').references(() => users.id),
  reason: text('reason').notNull(),
  description: text('description'),
  status: reportStatusEnum('status').default('PENDING').notNull(),
  resolvedBy: text('resolved_by'),
  resolvedAt: timestamp('resolved_at'),
  resolution: text('resolution'),
  ...timestamps,
  ...softDelete,
});

// ============================================================
// 8. DISPUTES
// ============================================================

export const disputeStatusEnum = pgEnum('dispute_status', [
  'OPEN', 'UNDER_REVIEW', 'RESOLVED_REFUND', 'RESOLVED_NO_REFUND', 'CANCELLED'
]);

export const disputes = pgTable('disputes', {
  id: uid(),
  orderId: text('order_id').notNull().references(() => orders.id),
  initiatorId: text('initiator_id').notNull().references(() => users.id),
  respondentId: text('respondent_id').notNull().references(() => users.id),
  reason: text('reason').notNull(),
  description: text('description').notNull(),
  status: disputeStatusEnum('status').default('OPEN').notNull(),
  resolution: text('resolution'),
  resolvedBy: text('resolved_by').references(() => users.id),
  resolvedAt: timestamp('resolved_at'),
  ...timestamps,
  ...softDelete,
});

export const disputesRelations = relations(disputes, ({ one }) => ({
  order: one(orders, {
    fields: [disputes.orderId],
    references: [orders.id],
  }),
  initiator: one(users, {
    fields: [disputes.initiatorId],
    references: [users.id],
    relationName: 'initiator',
  }),
  respondent: one(users, {
    fields: [disputes.respondentId],
    references: [users.id],
    relationName: 'respondent',
  }),
  resolver: one(users, {
    fields: [disputes.resolvedBy],
    references: [users.id],
    relationName: 'resolver',
  }),
}));

// ============================================================
// 8. NOTIFICATIONS
// ============================================================

export const notifications = pgTable('notifications', {
  id: uid(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: json('data').$type<Record<string, any>>(), // { listingId, orderId, etc. }
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  ...timestamps,
}, (table) => [
  index('notifications_user_idx').on(table.userId),
  index('notifications_unread_idx').on(table.userId, table.isRead),
]);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ============================================================
// 9. PRODUCTS & INVENTORY (ERP / B2B side)
// ============================================================

export const products = pgTable('products', {
  id: uid(),
  sku: text('sku').unique().notNull(),
  name: text('name').notNull(),
  nameAmharic: text('name_amharic'),
  description: text('description'),
  descriptionAmharic: text('description_amharic'),
  categoryId: text('category_id').references(() => categories.id),
  brand: text('brand'),
  unit: text('unit').default('piece').notNull(),
  unitAmharic: text('unit_amharic'),
  costPrice: decimal('cost_price', { precision: 12, scale: 2 }).notNull(),
  wholesalePrice: decimal('wholesale_price', { precision: 12, scale: 2 }).notNull(),
  retailPrice: decimal('retail_price', { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum('currency').default('ETB').notNull(),
  minStockLevel: integer('min_stock_level').default(0).notNull(),
  maxStockLevel: integer('max_stock_level'),
  images: text('images').array().default([]),
  thumbnail: text('thumbnail'),
  barcode: text('barcode'),
  tags: text('tags').array().default([]),
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false),
  ...timestamps,
  ...softDelete,
}, (table) => [
  index('products_sku_idx').on(table.sku),
  index('products_category_idx').on(table.categoryId),
]);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  inventory: many(inventory),
  orderItems: many(orderItems),
}));

// Warehouses
export const warehouses = pgTable('warehouses', {
  id: uid(),
  name: text('name').notNull(),
  nameAmharic: text('name_amharic'),
  code: text('code').unique().notNull(),
  address: text('address'),
  city: text('city').notNull(),
  region: text('region'),
  phone: text('phone'),
  managerId: text('manager_id').references(() => users.id),
  isActive: boolean('is_active').default(true).notNull(),
  isDefault: boolean('is_default').default(false),
  ...timestamps,
});

// Inventory
export const inventory = pgTable('inventory', {
  id: uid(),
  productId: text('product_id').notNull().references(() => products.id),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id),
  quantity: integer('quantity').default(0).notNull(),
  reserved: integer('reserved').default(0).notNull(),
  available: integer('available').default(0).notNull(),
  lastRestock: timestamp('last_restock'),
  ...timestamps,
}, (table) => [
  uniqueIndex('inventory_product_warehouse').on(table.productId, table.warehouseId),
]);

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
  warehouse: one(warehouses, {
    fields: [inventory.warehouseId],
    references: [warehouses.id],
  }),
}));

// Stock Movements
export const stockMovements = pgTable('stock_movements', {
  id: uid(),
  inventoryId: text('inventory_id').notNull().references(() => inventory.id),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id),
  type: movementTypeEnum('type').notNull(),
  quantity: integer('quantity').notNull(),
  reference: text('reference'),
  notes: text('notes'),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// 10. CUSTOMERS
// ============================================================

export const customers = pgTable('customers', {
  id: uid(),
  type: customerTypeEnum('type').default('RETAIL').notNull(),
  name: text('name').notNull(),
  nameAmharic: text('name_amharic'),
  email: text('email'),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp'),
  address: text('address'),
  city: text('city'),
  region: text('region'),
  tinNumber: text('tin_number'),
  creditLimit: decimal('credit_limit', { precision: 12, scale: 2 }),
  balance: decimal('balance', { precision: 12, scale: 2 }).default('0'),
  notes: text('notes'),
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps,
  ...softDelete,
}, (table) => [
  index('customers_phone_idx').on(table.phone),
  index('customers_type_idx').on(table.type),
]);

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  payments: many(payments),
}));

// ============================================================
// 11. DISTRIBUTORS
// ============================================================

export const distributors = pgTable('distributors', {
  id: uid(),
  code: text('code').unique().notNull(),
  name: text('name').notNull(),
  nameAmharic: text('name_amharic'),
  contactPerson: text('contact_person').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  region: text('region').notNull(),
  territory: text('territory').array().default([]),
  tinNumber: text('tin_number'),
  businessLicense: text('business_license'),
  creditLimit: decimal('credit_limit', { precision: 12, scale: 2 }).default('0'),
  paymentTerms: integer('payment_terms').default(30), // days
  discountRate: decimal('discount_rate', { precision: 5, scale: 2 }).default('0'),
  totalOrders: integer('total_orders').default(0),
  totalRevenue: decimal('total_revenue', { precision: 14, scale: 2 }).default('0'),
  balance: decimal('balance', { precision: 12, scale: 2 }).default('0'),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  status: distributorStatusEnum('status').default('PENDING').notNull(),
  onboardedAt: timestamp('onboarded_at'),
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps,
  ...softDelete,
});

// ============================================================
// 12. ORDERS & PAYMENTS
// ============================================================

export const orders = pgTable('orders', {
  id: uid(),
  orderNumber: text('order_number').unique().notNull(),
  customerId: text('customer_id').references(() => customers.id),
  distributorId: text('distributor_id').references(() => distributors.id),
  status: orderStatusEnum('status').default('PENDING').notNull(),
  type: orderTypeEnum('type').default('SALES').notNull(),
  source: orderSourceEnum('source').default('DIRECT').notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 12, scale: 2 }).default('0'),
  tax: decimal('tax', { precision: 12, scale: 2 }).default('0'),
  shipping: decimal('shipping', { precision: 12, scale: 2 }).default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum('currency').default('ETB').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('PENDING').notNull(),
  paidAmount: decimal('paid_amount', { precision: 12, scale: 2 }).default('0'),
  dueDate: timestamp('due_date'),
  shippingAddress: text('shipping_address'),
  shippingCity: text('shipping_city'),
  shippingRegion: text('shipping_region'),
  shippingPhone: text('shipping_phone'),
  trackingNumber: text('tracking_number'),
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  createdById: text('created_by_id').notNull().references(() => users.id),
  ...timestamps,
  ...softDelete,
}, (table) => [
  index('orders_number_idx').on(table.orderNumber),
  index('orders_customer_idx').on(table.customerId),
  index('orders_status_idx').on(table.status),
]);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  distributor: one(distributors, {
    fields: [orders.distributorId],
    references: [distributors.id],
  }),
  createdBy: one(users, {
    fields: [orders.createdById],
    references: [users.id],
    relationName: 'orderCreator',
  }),
  items: many(orderItems),
  payments: many(payments),
  statusHistory: many(orderStatusHistory),
}));

export const orderItems = pgTable('order_items', {
  id: uid(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 12, scale: 2 }).default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const orderStatusHistory = pgTable('order_status_history', {
  id: uid(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  fromStatus: orderStatusEnum('from_status'),
  toStatus: orderStatusEnum('to_status').notNull(),
  changedBy: text('changed_by').notNull().references(() => users.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: uid(),
  orderId: text('order_id').references(() => orders.id),
  customerId: text('customer_id').references(() => customers.id),
  distributorId: text('distributor_id').references(() => distributors.id),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum('currency').default('ETB').notNull(),
  method: paymentMethodEnum('method').notNull(),
  reference: text('reference'),
  status: paymentStatusEnum('status').default('PENDING').notNull(),
  notes: text('notes'),
  paidAt: timestamp('paid_at'),
  createdBy: text('created_by').notNull().references(() => users.id),
  ...timestamps,
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  customer: one(customers, {
    fields: [payments.customerId],
    references: [customers.id],
  }),
}));

// ============================================================
// 13. WHATSAPP INTEGRATION
// ============================================================

export const whatsappChats = pgTable('whatsapp_chats', {
  id: uid(),
  customerId: text('customer_id').references(() => customers.id),
  phone: text('phone').notNull(),
  name: text('name'),
  status: chatStatusEnum('status').default('ACTIVE').notNull(),
  lastMessage: timestamp('last_message'),
  unreadCount: integer('unread_count').default(0),
  assignedTo: text('assigned_to').references(() => users.id),
  ...timestamps,
});

export const whatsappMessages = pgTable('whatsapp_messages', {
  id: uid(),
  chatId: text('chat_id').notNull().references(() => whatsappChats.id, { onDelete: 'cascade' }),
  direction: messageDirectionEnum('direction').notNull(),
  type: messageTypeEnum('type').default('TEXT').notNull(),
  content: text('content').notNull(),
  mediaUrl: text('media_url'),
  status: messageStatusEnum('status').default('PENDING').notNull(),
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// 14. ACTIVITY LOG & SETTINGS (Audit trail)
// ============================================================

export const activityLogs = pgTable('activity_logs', {
  id: uid(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entity: text('entity').notNull(), // 'listing', 'order', 'user', etc.
  entityId: text('entity_id'),
  details: json('details').$type<Record<string, any>>(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('activity_logs_user_idx').on(table.userId),
  index('activity_logs_entity_idx').on(table.entity, table.entityId),
]);

export const settings = pgTable('settings', {
  id: uid(),
  key: text('key').unique().notNull(),
  value: text('value').notNull(),
  description: text('description'),
  updatedBy: text('updated_by').references(() => users.id),
  ...timestamps,
});

// ============================================================
// LEGACY COMPAT: re-export old name for existing code
// ============================================================
export const listingCategories = categories;
