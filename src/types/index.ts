// Sabeh Importers - TypeScript Types

// ==================== USER ====================

export type UserRole = "ADMIN" | "MANAGER" | "STAFF" | "DISTRIBUTOR";

export interface User {
  id: string;
  email: string;
  name: string;
  nameAmharic?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== PRODUCT ====================

export type Currency = "ETB" | "USD";

export interface Category {
  id: string;
  name: string;
  nameAmharic?: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameAmharic?: string;
  description?: string;
  descriptionAmharic?: string;
  categoryId: string;
  category?: Category;
  brand?: string;
  unit: string;
  unitAmharic?: string;
  costPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  currency: Currency;
  minStockLevel: number;
  maxStockLevel?: number;
  images: string[];
  thumbnail?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
  inventory?: Inventory[];
}

// ==================== INVENTORY ====================

export type MovementType =
  | "IN"
  | "OUT"
  | "ADJUSTMENT"
  | "TRANSFER"
  | "RETURN"
  | "DAMAGED";

export interface Warehouse {
  id: string;
  name: string;
  nameAmharic?: string;
  code: string;
  address?: string;
  city: string;
  region?: string;
  phone?: string;
  managerId?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  id: string;
  productId: string;
  product?: Product;
  warehouseId: string;
  warehouse?: Warehouse;
  quantity: number;
  reserved: number;
  available: number;
  lastRestock?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  inventoryId: string;
  inventory?: Inventory;
  warehouseId: string;
  warehouse?: Warehouse;
  type: MovementType;
  quantity: number;
  reference?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

// ==================== CUSTOMER ====================

export type CustomerType = "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";

export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  nameAmharic?: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  region?: string;
  tinNumber?: string;
  creditLimit?: number;
  balance: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== DISTRIBUTOR ====================

export type DistributorStatus =
  | "PENDING"
  | "APPROVED"
  | "SUSPENDED"
  | "TERMINATED";

export interface Distributor {
  id: string;
  code: string;
  name: string;
  nameAmharic?: string;
  contactPerson: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  region: string;
  territory: string[];
  tinNumber?: string;
  businessLicense?: string;
  creditLimit: number;
  paymentTerms: number;
  discountRate: number;
  totalOrders: number;
  totalRevenue: number;
  balance: number;
  rating?: number;
  status: DistributorStatus;
  onboardedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== ORDER ====================

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type OrderType = "SALES" | "PURCHASE" | "RETURN";

export type OrderSource =
  | "DIRECT"
  | "WHATSAPP"
  | "PHONE"
  | "ONLINE"
  | "DISTRIBUTOR";

export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED";

export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "TELEBIRR"
  | "CBE_BIRR"
  | "MPESA"
  | "CHECK"
  | "CREDIT";

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customer?: Customer;
  distributorId?: string;
  distributor?: Distributor;
  status: OrderStatus;
  type: OrderType;
  source: OrderSource;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: Currency;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  dueDate?: Date;
  shippingAddress?: string;
  shippingCity?: string;
  shippingRegion?: string;
  shippingPhone?: string;
  trackingNumber?: string;
  notes?: string;
  internalNotes?: string;
  createdById: string;
  createdBy?: User;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  payments?: Payment[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  order?: Order;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  orderId?: string;
  order?: Order;
  customerId?: string;
  customer?: Customer;
  distributorId?: string;
  distributor?: Distributor;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  reference?: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  notes?: string;
  paidAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== WHATSAPP ====================

export type ChatStatus = "ACTIVE" | "PENDING" | "RESOLVED" | "SPAM";

export type MessageDirection = "INBOUND" | "OUTBOUND";

export type MessageType =
  | "TEXT"
  | "IMAGE"
  | "DOCUMENT"
  | "CATALOG"
  | "ORDER"
  | "LOCATION";

export type MessageStatus = "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";

export interface WhatsAppChat {
  id: string;
  customerId?: string;
  customer?: Customer;
  phone: string;
  name?: string;
  status: ChatStatus;
  lastMessage?: Date;
  unreadCount: number;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: WhatsAppMessage[];
}

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  chat?: WhatsAppChat;
  direction: MessageDirection;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  status: MessageStatus;
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
}

// ==================== DASHBOARD ====================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  revenueChange: number;
  ordersChange: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

// ==================== NAVIGATION ====================

export interface NavItem {
  title: string;
  titleAmharic?: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
