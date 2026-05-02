import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Canonical Sabeh Authority logo. Renders the navy square with the
 * gold-trimmed Sabeh_Logo_Icon.svg inside, optionally with the SABEH
 * wordmark to the right.
 *
 * Use this everywhere instead of hand-rolling a "ሳቤህ in gold box" in
 * each page header/footer/auth screen.
 */
type SabehLogoProps = {
  /** sm = 32px, default = 40px, lg = 48px */
  size?: "sm" | "default" | "lg";
  /** Show "SABEH" wordmark next to the icon. Default: false (icon only). */
  withWordmark?: boolean;
  /** Override wordmark text (e.g. "SABEH AUTHORITY", "SABEH IMPORTERS"). */
  wordmark?: string;
  /** Wraps in a Link to "/" when true. Default: true. */
  asLink?: boolean;
  /** "light" for navy/gold surfaces (white wordmark), "dark" for light surfaces (navy wordmark). Default: "light". */
  tone?: "light" | "dark";
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
  wordmark = "SABEH",
  asLink = true,
  tone = "light",
  className,
}: SabehLogoProps) {
  const dims = SIZE_MAP[size];
  const wordmarkClass = cn(
    "font-display font-bold uppercase tracking-tighter leading-none",
    dims.wordmark,
    tone === "light" ? "text-white" : "text-[#0A192F]"
  );

  const inner = (
    <span className={cn("flex items-center gap-3", className)}>
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
          priority
        />
      </span>
      {withWordmark && <span className={wordmarkClass}>{wordmark}</span>}
    </span>
  );

  if (!asLink) return inner;

  return (
    <Link href="/" className="inline-flex items-center" aria-label="Sabeh home">
      {inner}
    </Link>
  );
}
