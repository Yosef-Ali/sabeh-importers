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
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={`flex w-full items-center ${className || ""}`}>
      <div className="relative flex flex-1 items-center bg-card border border-border rounded-sm shadow-sm focus-within:border-foreground/40 transition-colors">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none flex-shrink-0" />
        <Input
          type="search"
          placeholder="Search listings..."
          className="pl-11 h-11 w-full rounded-sm bg-transparent border-none focus-visible:ring-0 font-display text-sm placeholder:text-muted-foreground/50 text-foreground"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="mr-1 flex-shrink-0 px-4 h-9 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-foreground/80 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export function SearchBar({ className }: SearchBarProps) {
  return (
    <Suspense fallback={<div className={`h-11 w-full animate-pulse rounded-sm bg-muted ${className}`} />}>
      <SearchBarContent className={className} />
    </Suspense>
  );
}
