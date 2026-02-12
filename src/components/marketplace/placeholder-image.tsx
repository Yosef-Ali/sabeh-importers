"use client";

import { Image as ImageIcon, Shirt, Car, Home, Laptop, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  title?: string;
  category?: string;
  className?: string;
  iconClassName?: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  fashion: Shirt,
  vehicles: Car,
  real_estate: Home,
  electronics: Laptop,
  other: Package,
};

export function PlaceholderImage({
  title,
  category,
  className,
  iconClassName,
}: PlaceholderImageProps) {
  const Icon = category ? (CATEGORY_ICONS[category.toLowerCase()] || ImageIcon) : ImageIcon;

  return (
    <div className={cn(
      "flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted/80 via-muted to-muted/60",
      className
    )}>
      <div className="text-center p-4">
        <div className={cn(
          "h-12 w-12 mx-auto rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center mb-3 shadow-inner border border-white/10",
          iconClassName
        )}>
          <Icon className="h-6 w-6 text-muted-foreground/40" />
        </div>
        {title && (
          <p className="text-xs font-medium text-muted-foreground/50 line-clamp-1 max-w-[80%] mx-auto">
            {title}
          </p>
        )}
        {!title && <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">No Image</span>}
      </div>
    </div>
  );
}
