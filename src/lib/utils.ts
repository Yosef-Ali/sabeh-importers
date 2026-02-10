import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: "ETB" | "USD" = "ETB"
): string {
  const formatter = new Intl.NumberFormat(currency === "ETB" ? "am-ET" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export function formatDate(date: Date | string, locale: "en" | "am" = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "am" ? "am-ET" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatPhoneNumber(phone: string): string {
  // Ethiopian phone format: +251 9X XXX XXXX
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("251")) {
    return `+251 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `SAB-${year}${month}-${random}`;
}

export function calculateTax(amount: number, taxRate: number = 15): number {
  return amount * (taxRate / 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
