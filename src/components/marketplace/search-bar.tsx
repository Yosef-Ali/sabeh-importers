"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  className?: string;
}

function SearchBarContent({ className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("query", query);
    else        params.delete("query");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={`flex w-full items-center ${className || ""}`}>
      {/* Wrapper — rounded-none, 1px border, shadow-hard on focus-within */}
      <div className="relative flex flex-1 items-center bg-card border border-border rounded-none focus-within:border-foreground focus-within:shadow-hard transition-all duration-150">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none flex-shrink-0" />

        {/* Input — inherits rounded-none from updated input.tsx, override ring to none */}
        <Input
          type="search"
          placeholder="Search listings..."
          className="pl-11 h-11 w-full rounded-none bg-transparent border-none focus-visible:ring-0 focus-visible:border-none focus-visible:shadow-none font-body text-sm placeholder:text-muted-foreground/50 text-foreground"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Submit — rounded-none, navy bg, gold text, hover translate */}
        <button
          type="submit"
          className="mr-1 flex-shrink-0 px-4 h-9 bg-foreground text-background font-mono text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-[#FFD700] hover:text-[#0A192F] transition-all hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export function SearchBar({ className }: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <div className={`h-11 w-full animate-pulse rounded-none bg-muted ${className}`} />
      }
    >
      <SearchBarContent className={className} />
    </Suspense>
  );
}
