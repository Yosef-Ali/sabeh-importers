import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Canonical Sabeh logo. Renders the navy square with the gold-trimmed
 * Sabeh_Logo_Icon.svg inside, optionally with the SABEH wordmark to the
 * right. Use this everywhere instead of hand-rolling a "ሳቤህ in gold box"
 * in each page header/footer/auth screen.
 *
 * `priority` is opt-in (defaults false). Set true ONLY on the
 * above-the-fold instance per page (typically the navbar) — passing it
 * on every render adds competing <link rel="preload"> hints that steal
 * bandwidth from the real LCP image.
 */
type SabehLogoProps = {
  /** sm = 32px, default = 40px, lg = 48px */
  size?: "sm" | "default" | "lg";
  /** Show the SABEH wordmark next to the icon. Default: false (icon only). */
  withWordmark?: boolean;
  /** Wraps in a Link to "/" when true. Default: true. */
  asLink?: boolean;
  /** "light" for dark surfaces (white wordmark), "dark" for light surfaces (navy wordmark). Default: "light". */
  tone?: "light" | "dark";
  /** Pass true ONLY for the LCP-eligible instance (typically the navbar). */
  priority?: boolean;
  className?: string;
};

const SIZE_MAP = {
  sm: { box: "h-8 w-8", icon: 28, wordmark: "text-base" },
  default: { box: "h-10 w-10", icon: 36, wordmark: "text-xl" },
  lg: { box: "h-12 w-12", icon: 44, wordmark: "text-2xl" },
} as const;

export function SabehLogo({
  size = "default",
  withWordmark = false,
  asLink = true,
  tone = "light",
  priority = false,
  className,
}: SabehLogoProps) {
  const dims = SIZE_MAP[size];
  const wordmarkClass = cn(
    "font-display font-bold uppercase tracking-tighter leading-none",
    dims.wordmark,
    tone === "light" ? "text-white" : "text-[#0A192F]"
  );

  const content = (
    <>
      <span
        className={cn(
          "flex items-center justify-center bg-[#0A192F] border border-[#FFD700]/30 rounded-none flex-shrink-0",
          dims.box
        )}
      >
        <Image
          src="/Sabeh_Logo_Icon.svg"
          alt="Sabeh"
          width={dims.icon}
          height={dims.icon}
          priority={priority}
        />
      </span>
      {withWordmark && <span className={wordmarkClass}>SABEH</span>}
    </>
  );

  // When asLink, drop the inner wrapper-span — the <Link> itself is the flex container.
  if (asLink) {
    return (
      <Link
        href="/"
        className={cn("inline-flex items-center gap-3", className)}
        aria-label="Sabeh home"
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {content}
    </span>
  );
}
