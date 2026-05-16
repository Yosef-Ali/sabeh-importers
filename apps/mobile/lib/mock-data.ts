/**
 * Mock data for development — used until the mobile app is wired to the
 * web's `/api/marketplace` endpoints.
 *
 * Domain types & visual metadata are imported from `@sabeh/shared` so the
 * web (Next.js) and mobile (Expo) stay aligned with the database enums in
 * `src/db/schema.ts`. Adding a status, condition, or category? Do it
 * there — both apps will surface a TS error wherever a new case isn't
 * handled.
 *
 * Re-exports the shared types so existing `import { ... } from "@/lib/mock-data"`
 * call sites keep working without ripple changes.
 */
import {
  type ListingStatus,
  type ListingCondition,
  type Currency,
  type ListingCategory,
  BROWSE_CATEGORIES,
  CONDITION_LABELS,
  STATUS_META,
  formatPrice,
} from "@sabeh/shared";

export {
  type ListingStatus,
  type ListingCondition,
  type Currency,
  STATUS_META,
  formatPrice,
};
/** Backwards-compat alias — older mobile screens still import `Condition`. */
export type Condition = ListingCondition;

// ─── Listing ──────────────────────────────────────────────────────────────────

export type Listing = {
  id: string;
  title: string;
  titleAm?: string;
  description?: string;
  price: number;
  currency: Currency;
  category: ListingCategory;
  location: string;
  condition: ListingCondition;
  status: ListingStatus;
  postedAt: string;
  /**
   * Gallery image URLs — first entry is the card thumbnail. Empty array
   * (or absent) → UI falls back to the navy placeholder block. Demo data
   * uses Unsplash; replace with R2/Cloudinary URLs once upload pipeline ships.
   */
  imageUrls?: string[];
  isPremium?: boolean;
  viewCount: number;
  seller: {
    id: string;
    name: string;
    initial: string;
    verified: boolean;
    /**
     * E.164 phone (Ethiopian sellers: +2519xxxxxxxx). Used for WhatsApp
     * deeplink + tel: fallback. Optional so legacy/mock rows can omit it;
     * UI hides the contact button when absent.
     */
    phone?: string;
  };
};

/** Marketplace browse listings */
export const LISTINGS: Listing[] = [
  {
    id: "a-44219",
    title: "BYD Atto 3 (2024)",
    titleAm: "ቢዋይዲ አቶ 3",
    description: "Brand new electric SUV, imported directly. Full warranty. Range 420km.",
    price: 4_500_000,
    currency: "ETB",
    category: "Motors",
    location: "Addis Ababa",
    condition: "NEW",
    status: "ACTIVE",
    postedAt: "2h ago",
    isPremium: true,
    viewCount: 342,
    imageUrls: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop&q=75",
    ],
    seller: { id: "s1", name: "Habesha Motors", initial: "H", verified: true, phone: "+251911234567" },
  },
  {
    id: "a-44218",
    title: "Komatsu PC200 Excavator",
    titleAm: "ኮማትሱ ኤክስካቬተር",
    description: "2020 model, low hours. Serviced and ready. Located in Adama.",
    price: 15_000_000,
    currency: "ETB",
    category: "Machinery",
    location: "Adama",
    condition: "LIKE_NEW",
    status: "ACTIVE",
    postedAt: "5h ago",
    viewCount: 211,
    imageUrls: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=75",
    ],
    seller: { id: "s2", name: "Industrial Co", initial: "I", verified: true, phone: "+251922345678" },
  },
  {
    id: "a-44217",
    title: "Toyota Hilux Revo 2022",
    titleAm: "ቶዮታ ሃይሉክስ ሬቮ",
    description: "Double cab, 4x4. Slight body scratches. Service history available.",
    price: 8_200_000,
    currency: "ETB",
    category: "Motors",
    location: "Addis Ababa",
    condition: "USED_GOOD",
    status: "ACTIVE",
    postedAt: "1d ago",
    viewCount: 97,
    imageUrls: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&auto=format&fit=crop&q=75",
    ],
    seller: { id: "s3", name: "Selam Auto", initial: "S", verified: false, phone: "+251933456789" },
  },
  {
    id: "a-44216",
    title: "Industrial Generator 500kVA",
    titleAm: "የኢንዱስትሪ ጄኔሬተር",
    description: "Perkins engine, 500kVA. One owner. Ideal for factories and hospitals.",
    price: 2_100_000,
    currency: "ETB",
    category: "Industrial",
    location: "Bahir Dar",
    condition: "LIKE_NEW",
    status: "ACTIVE",
    postedAt: "2d ago",
    viewCount: 188,
    imageUrls: [
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=75",
    ],
    seller: { id: "s4", name: "Power Systems", initial: "P", verified: true, phone: "+251944567890" },
  },
  {
    id: "a-44215",
    title: "Solar Panel Kit 5kW",
    titleAm: "የፀሐይ ኃይል ፓነል",
    description: "Complete off-grid kit. 10 x 500W panels, inverter, batteries.",
    price: 350_000,
    currency: "ETB",
    category: "Industrial",
    location: "Hawassa",
    condition: "NEW",
    status: "ACTIVE",
    postedAt: "3d ago",
    viewCount: 73,
    imageUrls: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=75",
    ],
    seller: { id: "s5", name: "Green Energy", initial: "G", verified: true, phone: "+251955678901" },
  },
  {
    id: "a-44214",
    title: "Rebar Steel 12mm (per ton)",
    titleAm: "ብረት 12ሚሜ",
    description: "Grade 60 deformed rebar. Minimum order 5 tons. Delivery available.",
    price: 85_000,
    currency: "ETB",
    category: "Industrial",
    location: "Addis Ababa",
    condition: "NEW",
    status: "ACTIVE",
    postedAt: "4d ago",
    viewCount: 44,
    imageUrls: [
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=75",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=75",
    ],
    seller: { id: "s6", name: "Construction Supply", initial: "C", verified: false, phone: "+251966789012" },
  },
];

/**
 * The logged-in user's own listings — covers all 5 user-visible statuses
 * so the dashboard status breakdown matches the web's behaviour.
 */
export const MY_LISTINGS: Listing[] = [
  {
    id: "my-001",
    title: "BYD Atto 3 (2024)",
    titleAm: "ቢዋይዲ አቶ 3",
    price: 4_500_000,
    currency: "ETB",
    category: "Motors",
    location: "Addis Ababa",
    condition: "NEW",
    status: "ACTIVE",
    postedAt: "2h ago",
    isPremium: true,
    viewCount: 342,
    imageUrls: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=75"],
    seller: { id: "me", name: "Abebe Girma", initial: "A", verified: false },
  },
  {
    id: "my-002",
    title: "Komatsu PC200 Excavator",
    titleAm: "ኮማትሱ ኤክስካቬተር",
    price: 15_000_000,
    currency: "ETB",
    category: "Machinery",
    location: "Adama",
    condition: "LIKE_NEW",
    status: "PENDING_REVIEW",
    postedAt: "1d ago",
    viewCount: 0,
    imageUrls: ["https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop&q=75"],
    seller: { id: "me", name: "Abebe Girma", initial: "A", verified: false },
  },
  {
    id: "my-003",
    title: "Toyota Hilux Revo 2022",
    titleAm: "ቶዮታ ሃይሉክስ ሬቮ",
    price: 8_200_000,
    currency: "ETB",
    category: "Motors",
    location: "Addis Ababa",
    condition: "USED_GOOD",
    status: "SOLD",
    postedAt: "2w ago",
    viewCount: 891,
    imageUrls: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop&q=75"],
    seller: { id: "me", name: "Abebe Girma", initial: "A", verified: false },
  },
  {
    id: "my-004",
    title: "Industrial Generator 500kVA",
    titleAm: "የኢንዱስትሪ ጄኔሬተር",
    price: 2_100_000,
    currency: "ETB",
    category: "Industrial",
    location: "Bahir Dar",
    condition: "LIKE_NEW",
    status: "EXPIRED",
    postedAt: "3mo ago",
    viewCount: 204,
    imageUrls: ["https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=75"],
    seller: { id: "me", name: "Abebe Girma", initial: "A", verified: false },
  },
  {
    id: "my-005",
    title: "Solar Panel Kit 5kW",
    titleAm: "የፀሐይ ኃይል ፓነል",
    price: 350_000,
    currency: "ETB",
    category: "Industrial",
    location: "Hawassa",
    condition: "NEW",
    status: "DRAFT",
    postedAt: "—",
    viewCount: 0,
    imageUrls: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=75"],
    seller: { id: "me", name: "Abebe Girma", initial: "A", verified: false },
  },
];

// ─── Conversations ─────────────────────────────────────────────────────────────

export type Message = {
  id: string;
  text: string;
  isMine: boolean;
  time: string;
};

export type Conversation = {
  id: string;
  listingId: string;
  listingTitle: string;
  otherParty: { name: string; initial: string; verified: boolean };
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: Message[];
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    listingId: "my-001",
    listingTitle: "BYD Atto 3 (2024)",
    otherParty: { name: "Tadesse Bekele", initial: "T", verified: false },
    lastMessage: "Still available — when can you visit?",
    lastTime: "2m",
    unreadCount: 2,
    messages: [
      { id: "m1", text: "Is this still available?", isMine: false, time: "10:21" },
      { id: "m2", text: "Yes, available for viewing Mon–Sat.", isMine: true, time: "10:34" },
      { id: "m3", text: "Great! Still available — when can you visit?", isMine: false, time: "10:36" },
    ],
  },
  {
    id: "conv-2",
    listingId: "my-002",
    listingTitle: "Komatsu PC200 Excavator",
    otherParty: { name: "Mulugeta Haile", initial: "M", verified: true },
    lastMessage: "Price negotiable for cash buyers.",
    lastTime: "1h",
    unreadCount: 0,
    messages: [
      { id: "m1", text: "What's the best price for immediate cash payment?", isMine: false, time: "09:00" },
      { id: "m2", text: "Price negotiable for cash buyers.", isMine: true, time: "09:15" },
    ],
  },
  {
    id: "conv-3",
    listingId: "my-003",
    listingTitle: "Toyota Hilux Revo 2022",
    otherParty: { name: "Selam Tesfaye", initial: "S", verified: false },
    lastMessage: "Sent the inspection report.",
    lastTime: "Yesterday",
    unreadCount: 1,
    messages: [
      { id: "m1", text: "Can you share a full inspection report?", isMine: true, time: "Yesterday 14:00" },
      { id: "m2", text: "Of course, sent the inspection report.", isMine: false, time: "Yesterday 16:30" },
    ],
  },
];

// ─── Categories & helpers (re-exported from shared) ──────────────────────────

/** Category list for marketplace browse (includes "All" sentinel). */
export const CATEGORIES = BROWSE_CATEGORIES;

/** Condition picker options for the post-listing wizard. */
export const CONDITIONS: Array<{ value: ListingCondition; label: string; labelAm: string }> =
  (Object.entries(CONDITION_LABELS) as Array<[ListingCondition, { en: string; am: string }]>)
    .map(([value, { en, am }]) => ({ value, label: en, labelAm: am }));

/**
 * Count entries by status in a single reduce pass.
 * Returns a Record<ListingStatus, number> (missing statuses default to 0 at call sites).
 */
export function countByStatus(
  listings: Listing[],
): Record<ListingStatus, number> {
  return listings.reduce(
    (acc, l) => {
      acc[l.status] = (acc[l.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<ListingStatus, number>,
  );
}

/** Derive dashboard stats from MY_LISTINGS + CONVERSATIONS — mirrors web logic */
export function getMyStats() {
  const total = MY_LISTINGS.length;
  const active = MY_LISTINGS.filter((l) => l.status === "ACTIVE").length;
  const totalViews = MY_LISTINGS.reduce((sum, l) => sum + l.viewCount, 0);
  const unreadMessages = CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0);
  return { total, active, totalViews, unreadMessages };
}
