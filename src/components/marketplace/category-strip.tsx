"use client";

import Link from "next/link";
import { Car, Building2, Factory, Ship, Monitor, Wrench, Briefcase, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { icon: Car, label: "Vehicles", href: "/category/vehicles", active: true },
  { icon: Building2, label: "Real Estate", href: "/category/real-estate" },
  { icon: Factory, label: "Heavy Machinery", href: "/category/heavy-machinery" },
  { icon: Ship, label: "Marine", href: "/category/marine" },
  { icon: Monitor, label: "Electronics", href: "/category/electronics" },
  { icon: Wrench, label: "Services", href: "/category/services" },
  { icon: Briefcase, label: "Jobs", href: "/category/jobs" },
  { icon: Users, label: "Community", href: "/category/community" },
];

export function CategoryStrip() {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-[1440px] mx-auto overflow-x-auto hide-scrollbar">
        <div className="flex min-w-max">
          {CATEGORIES.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className={cn(
                "flex items-center gap-3 px-6 py-4 border-b-2 transition-colors group",
                category.active
                  ? "border-navy bg-cream"
                  : "border-transparent hover:bg-gray-50 hover:border-gray-200"
              )}
            >
              <category.icon 
                className={cn(
                  "h-5 w-5 transition-colors",
                  category.active 
                    ? "text-navy" 
                    : "text-gray-400 group-hover:text-navy"
                )} 
              />
              <span 
                className={cn(
                  "font-display font-medium transition-colors",
                  category.active 
                    ? "text-navy font-bold" 
                    : "text-gray-500 group-hover:text-navy"
                )}
              >
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
