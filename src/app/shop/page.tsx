import { redirect } from "next/navigation";

/**
 * /shop is a permanent redirect to /search.
 *
 * Why: /shop, /search, and the homepage browse feed were three different
 * "browse the catalog" surfaces. Per the Option A IA decision, /search is
 * the canonical catalog browse with filters. /shop kept as a redirect for
 * existing inbound links and bookmarks.
 *
 * History: the original /shop page was an off-brand emerald/slate parallel
 * design system that was rebuilt into Sabeh before being collapsed
 * into /search.
 */
export default function ShopPage() {
  redirect("/search");
}
