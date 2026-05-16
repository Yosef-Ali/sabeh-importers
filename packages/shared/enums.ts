/**
 * Listing-domain enums, derived from the Drizzle schema in
 * `src/db/schema.ts` (the database is the source of truth). When you add
 * a status/condition value to the DB enum, update it here too — both
 * apps will then surface a TypeScript error at any place that hasn't
 * handled the new case.
 *
 * Mirrors:
 *   - listingStatusEnum     → ListingStatus
 *   - listingConditionEnum  → ListingCondition
 *   - currencyEnum          → Currency
 */

export const LISTING_STATUSES = [
  "DRAFT",
  "PENDING_REVIEW",
  "ACTIVE",
  "SOLD",
  "EXPIRED",
  "REJECTED",
  "DELETED",
] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const LISTING_CONDITIONS = [
  "NEW",
  "LIKE_NEW",
  "USED_GOOD",
  "USED_FAIR",
  "FOR_PARTS",
] as const;
export type ListingCondition = (typeof LISTING_CONDITIONS)[number];

export const CURRENCIES = ["ETB", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];
