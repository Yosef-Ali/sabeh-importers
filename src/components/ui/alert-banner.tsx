import { AlertCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sabeh-system alert banner. Sharp left rule + tinted bg + mono uppercase
 * label + body. Replaces the 4× hand-rolled `border-l-4 border-destructive
 * bg-destructive/10 ...` patterns scattered across the auth pages and
 * elsewhere — and keeps padding/typography drift from creeping back in.
 */
type Tone = "destructive" | "warning";

const TONES: Record<Tone, string> = {
  destructive:
    "border-destructive bg-destructive/10 dark:bg-destructive/20 text-destructive",
  warning:
    "border-[#FCD34D] bg-[#FFFBEB] dark:bg-[#FCD34D]/10 text-[#92400e] dark:text-[#FCD34D]",
};

export type AlertBannerProps = {
  tone?: Tone;
  /** Optional eyebrow above the body — rendered mono uppercase. */
  label?: string;
  /** Lucide icon. Defaults to AlertCircle. */
  icon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
};

export function AlertBanner({
  tone = "destructive",
  label,
  icon: Icon = AlertCircle,
  className,
  children,
}: AlertBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-none border-l-4 p-4 font-body text-sm",
        TONES[tone],
        className
      )}
      role="alert"
    >
      <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <div className="space-y-1 min-w-0">
        {label && (
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
            {label}
          </p>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
