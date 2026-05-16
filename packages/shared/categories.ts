/**
 * Marketplace categories — must match the web's `getCategories()` output
 * (currently inlined in `src/app/api/categories/route.ts`). When that
 * endpoint changes, mirror it here.
 *
 * "All" is the marketplace browse sentinel (means "no filter"); listing
 * creation forms should use `LISTING_CATEGORIES` (without "All").
 */
export const LISTING_CATEGORIES = [
  "Motors",
  "Electronics",
  "Machinery",
  "Property",
  "Industrial",
  "Agriculture",
] as const;
export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

export const BROWSE_CATEGORIES = ["All", ...LISTING_CATEGORIES] as const;

import type { ListingCondition } from "./enums";

/**
 * Condition labels, including Amharic translations. Kept here (not in the
 * web/mobile UI layer) so both surfaces show the same wording — and so
 * adding a new condition forces both apps to render a label for it.
 */
export const CONDITION_LABELS: Record<ListingCondition, { en: string; am: string }> = {
  NEW:       { en: "New",        am: "አዲስ" },
  LIKE_NEW:  { en: "Like New",   am: "እንደ አዲስ" },
  USED_GOOD: { en: "Used — Good", am: "ጥቅም ላይ ያለ — ጥሩ" },
  USED_FAIR: { en: "Used — Fair", am: "ጥቅም ላይ ያለ — መካከለኛ" },
  FOR_PARTS: { en: "For Parts",  am: "ለመለዋወጫ" },
};
