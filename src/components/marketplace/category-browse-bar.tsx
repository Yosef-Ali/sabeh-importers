import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Car,
  Home,
  Smartphone,
  Briefcase,
  Wrench,
  Shirt,
  Sofa,
  Factory,
  Package,
  Zap,
  Hammer,
  ShoppingBag,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  motors:                  Car,
  property:                Home,
  electronics:             Smartphone,
  "business-for-sale":     Briefcase,
  services:                Wrench,
  "fashion-beauty":        Shirt,
  "furniture-home":        Sofa,
  "industrial-equipment":  Factory,
  "food-agriculture":      Package,
  energy:                  Zap,
  "tools-machinery":       Hammer,
  retail:                  ShoppingBag,
};

interface Category {
  id: string;
  name: string;
  nameAmharic?: string | null;
  slug: string;
  icon?: string | null;
  listingCount?: number | null;
}

interface CategoryBrowseBarProps {
  categories: Category[];
  language?: "en" | "am";
  activeSlug?: string;
}

export function CategoryBrowseBar({
  categories,
  language = "en",
  activeSlug,
}: CategoryBrowseBarProps) {
  return (
    <div className="category-nav dark:bg-background">
      <div className="container">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar py-3">

          {/* All Categories */}
          <Link
            href="/search"
            className={cn(
              // rounded-none replaces rounded-none, Space Grotesk bold uppercase
              "flex items-center gap-2 px-4 py-2 rounded-none font-display font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all border border-transparent",
              !activeSlug
                ? "bg-accent text-primary shadow-hard-navy border-primary"
                : "text-foreground hover:bg-muted hover:border-border"
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            {language === "am" ? "ሁሉም ምድቦች" : "All Categories"}
          </Link>

          {/* Category pills */}
          {categories.map((category) => {
            const Icon = ICON_MAP[category.slug] || Package;
            const isActive = activeSlug === category.slug;

            return (
              <Link
                key={category.id}
                href={`/search?categoryId=${category.id}`}
                className={cn(
                  // rounded-none replaces rounded-none
                  "flex items-center gap-2 px-4 py-2 rounded-none font-display font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all border border-transparent",
                  isActive
                    ? "bg-accent text-primary shadow-hard-navy border-primary"
                    : "text-foreground hover:bg-muted hover:border-border"
                )}
              >
                <Icon className="h-4 w-4" />
                {language === "am" && category.nameAmharic
                  ? category.nameAmharic
                  : category.name}
                {category.listingCount ? (
                  <span className="ml-1 text-[10px] font-mono text-muted-foreground">
                    ({category.listingCount})
                  </span>
                ) : null}
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
}
