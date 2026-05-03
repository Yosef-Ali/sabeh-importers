import { SabehLogo } from "@/components/sabeh-logo";

/**
 * Wraps every (auth) page: full-height centered surface, brand mark,
 * "Sabeh / ሳቤህ" heading, and copyright footer. Was inlined 4 times across
 * login/register/forgot-password/reset-password (with drift in padding,
 * nested-Link bugs, and 2 ad-hoc local helpers `LogoBlock`/`Footer`/`Shell`
 * — that drift is what triggered this refactor).
 *
 * Pages just supply their <Card> + form as children.
 */
export function AuthShell({
  children,
  /** Smaller variant used by the post-action confirmation states. */
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className={compact ? "w-full max-w-sm text-center" : "w-full max-w-md"}>
        <div className={compact ? "mb-4" : "mb-8 text-center"}>
          <div className="mb-4 flex justify-center">
            <SabehLogo size="lg" />
          </div>
          {!compact && (
            <>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
                Sabeh
              </h1>
              <p className="text-muted-foreground font-amharic text-sm mt-0.5">
                ሳቤህ
              </p>
            </>
          )}
        </div>
        {children}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sabeh. All rights reserved.
        </p>
      </div>
    </div>
  );
}
