import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// Input: rounded-none, DM Sans body font, focus shows hard shadow + navy border
// Previously used rounded-md and focus:ring-2 (blurry) — both fixed
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Layout
          "flex h-10 w-full px-3 py-2",
          // Shape — rounded-none enforced
          "rounded-none",
          // Border — 1px solid, transitions to navy on focus
          "border border-input bg-background",
          // Typography — DM Sans body
          "font-body text-sm text-foreground placeholder:text-muted-foreground",
          // Focus — hard shadow instead of ring-2
          "focus-visible:outline-none focus-visible:border-foreground focus-visible:shadow-hard",
          // File input reset
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Transition
          "transition-all duration-150",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
