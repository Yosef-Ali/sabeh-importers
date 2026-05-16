/**
 * Visual metadata for listing statuses — color, background tint, label.
 * Used by both the web `STATUS_COLORS` (currently inlined in
 * `src/app/(dashboard)/dashboard/page.tsx`) and the mobile dashboard.
 *
 * The `color` is the foreground hex; `bg` is a low-opacity tint of the
 * same hue suitable for badge backgrounds on white.
 */
import type { ListingStatus } from "./enums";

export const STATUS_META: Record<ListingStatus, { label: string; color: string; bg: string }> = {
  DRAFT:          { label: "Draft",          color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  PENDING_REVIEW: { label: "Pending Review", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  ACTIVE:         { label: "Active",         color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  SOLD:           { label: "Sold",           color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  EXPIRED:        { label: "Expired",        color: "#64748B", bg: "rgba(100,116,139,0.1)" },
  REJECTED:       { label: "Rejected",       color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  DELETED:        { label: "Deleted",        color: "#94A3B8", bg: "rgba(148,163,184,0.1)" },
};
