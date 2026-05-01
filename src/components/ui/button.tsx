import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: rounded-none, Space Grotesk bold uppercase, no blurry ring, translate transition
  "inline-flex items-center justify-center whitespace-nowrap rounded-none font-display font-bold uppercase tracking-wider transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A192F] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary CTA: gold bg, navy text, hard shadow, hover translate
        default:
          "bg-[#FFD700] text-[#0A192F] shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        // Destructive: red bg, hard shadow
        destructive:
          "bg-destructive text-destructive-foreground shadow-[4px_4px_0px_#7f1d1d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        // Outline: transparent, navy border
        outline:
          "border border-foreground bg-transparent text-foreground hover:bg-foreground/5",
        // Secondary: navy bg, gold text, hard gold shadow
        secondary:
          "bg-primary text-primary-foreground shadow-hard-navy hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        // Ghost: no bg, no border, no shadow
        ghost:
          "hover:bg-accent/10 hover:text-foreground text-muted-foreground",
        // Link: text only
        link:
          "text-primary underline-offset-4 hover:underline shadow-none",
        // Accent: gold bg, navy text, hard navy shadow (same as default — semantic alias)
        accent:
          "bg-[#FFD700] text-[#0A192F] shadow-hard-navy hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
      },
      size: {
        xs:      "h-7 px-2 text-[10px]",
        sm:      "h-9 px-3 text-xs",
        default: "h-10 px-4 py-2 text-sm",
        lg:      "h-11 px-8 text-sm",
        xl:      "h-12 px-10 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
