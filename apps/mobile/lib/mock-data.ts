/**
 * Mock listings for development before the mobile app is wired to the
 * Next.js /api/listings backend. Shape mirrors what /api/marketplace
 * returns (id, title, price, category, location, condition, images).
 */

export type Listing = {
  id: string;
  title: string;
  titleAm?: string;
  price: number;
  currency: "ETB" | "USD";
  category: string;
  location: string;
  condition: "NEW" | "LIKE_NEW" | "USED" | "SALVAGE";
  postedAt: string;
  imageUrl?: string;
  isPremium?: boolean;
  seller: {
    id: string;
    name: string;
    initial: string;
    verified: boolean;
  };
};

export const LISTINGS: Listing[] = [
  {
    id: "a-44219",
    title: "BYD Atto 3 (2024)",
    titleAm: "ቢዋይዲ አቶ 3",
    price: 4_500_000,
    currency: "ETB",
    category: "Motors",
    location: "Addis Ababa",
    condition: "NEW",
    postedAt: "2h ago",
    isPremium: true,
    seller: { id: "s1", name: "Habesha Motors", initial: "H", verified: true },
  },
  {
    id: "a-44218",
    title: "Komatsu PC200 Excavator",
    titleAm: "ኮማትሱ ኤክስካቬተር",
    price: 15_000_000,
    currency: "ETB",
    category: "Machinery",
    location: "Adama",
    condition: "LIKE_NEW",
    postedAt: "5h ago",
    seller: { id: "s2", name: "Industrial Co", initial: "I", verified: true },
  },
  {
    id: "a-44217",
    title: "Toyota Hilux Revo 2022",
    titleAm: "ቶዮታ ሃይሉክስ ሬቮ",
    price: 8_200_000,
    currency: "ETB",
    category: "Motors",
    location: "Addis Ababa",
    condition: "USED",
    postedAt: "1d ago",
    seller: { id: "s3", name: "Selam Auto", initial: "S", verified: false },
  },
  {
    id: "a-44216",
    title: "Industrial Generator 500kVA",
    titleAm: "የኢንዱስትሪ ጄኔሬተር",
    price: 2_100_000,
    currency: "ETB",
    category: "Industrial",
    location: "Bahir Dar",
    condition: "LIKE_NEW",
    postedAt: "2d ago",
    seller: { id: "s4", name: "Power Systems", initial: "P", verified: true },
  },
  {
    id: "a-44215",
    title: "Solar Panel Kit 5kW",
    titleAm: "የፀሐይ ኃይል ፓነል",
    price: 350_000,
    currency: "ETB",
    category: "Industrial",
    location: "Hawassa",
    condition: "NEW",
    postedAt: "3d ago",
    seller: { id: "s5", name: "Green Energy", initial: "G", verified: true },
  },
  {
    id: "a-44214",
    title: "Rebar Steel 12mm (per ton)",
    titleAm: "ብረት 12ሚሜ",
    price: 85_000,
    currency: "ETB",
    category: "Industrial",
    location: "Addis Ababa",
    condition: "NEW",
    postedAt: "4d ago",
    seller: { id: "s6", name: "Construction Supply", initial: "C", verified: false },
  },
];

export const CATEGORIES = [
  "All",
  "Motors",
  "Electronics",
  "Machinery",
  "Property",
  "Industrial",
  "Agriculture",
];

export function formatPrice(price: number, currency: string = "ETB"): string {
  return `${price.toLocaleString("en-US")} ${currency}`;
}
