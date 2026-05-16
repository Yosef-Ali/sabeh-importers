/**
 * Cross-platform formatting helpers — pure functions, no React/RN deps,
 * safe to import from both Next.js server components and React Native.
 */
import type { Currency } from "./enums";

/**
 * "4500000" + "ETB" → "4,500,000 ETB"
 * Uses en-US grouping to match what both web and mobile already render.
 */
export function formatPrice(price: number, currency: Currency = "ETB"): string {
  return `${price.toLocaleString("en-US")} ${currency}`;
}
