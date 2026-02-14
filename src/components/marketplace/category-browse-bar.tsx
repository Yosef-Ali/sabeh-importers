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

// Icon mapping for categories
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  motors: Car,
  property: Home,
  electronics: Smartphone,
  "business-for-sale": Briefcase,
  services: Wrench,
  "fashion-beauty": Shirt,
  "furniture-home": Sofa,
  "industrial-equipment": Factory,
  "food-agriculture": Package,
  energy: Zap,
  "tools-machinery": Hammer,
  retail: ShoppingBag,
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
          {/* All Categories Link */}
          <Link
            href="/search"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-button text-sm font-display font-medium whitespace-nowrap transition-all",
              !activeSlug
                ? "bg-primary text-primary-foreground shadow-hard"
                : "text-foreground hover:bg-muted"
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            {language === "am" ? "ሁሉም ምድቦች" : "All Categories"}
          </Link>

          {/* Category Links */}
          {categories.map((category) => {
            const Icon = ICON_MAP[category.slug] || Package;
            const isActive = activeSlug === category.slug;

            return (
              <Link
                key={category.id}
                href={`/search?categoryId=${category.id}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-button text-sm font-display font-medium whitespace-nowrap transition-all",
                  isActive
                    ? "bg-accent text-primary shadow-hard-navy"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {language === "am" && category.nameAmharic
                  ? category.nameAmharic
                  : category.name}
                {category.listingCount ? (
                  <span className="ml-1 text-xs text-muted-foreground">
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
