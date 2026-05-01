import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Badge: rounded-none, Space Mono bold uppercase tracking-widest
// No rounded-full — that was the core system violation
const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A192F]",
  {
    variants: {
      variant: {
        // Navy bg, gold-ish foreground
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        // Secondary: muted surface
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Destructive: red
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        // Outline: transparent, inherits text
        outline:
          "border-border text-foreground",
        // Success: verified green
        success:
          "border-transparent bg-[#10B981] text-white hover:bg-[#10B981]/80",
        // Warning: amber — used for pending states
        warning:
          "border-[#fcd34d] bg-[#fffbeb] text-[#92400e] hover:bg-[#fef3c7]",
        // Info: blue
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
        // Gold accent badge — industrial highlight
        gold:
          "border-transparent bg-[#FFD700] text-[#0A192F] hover:bg-[#FFD700]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
