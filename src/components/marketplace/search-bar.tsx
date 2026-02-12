
"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <form onSubmit={handleSearch} className={`flex w-full items-center space-x-2 ${className || "max-w-full md:max-w-sm"}`}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60" />
        <Input
          type="search"
          placeholder="Search luxury assets..."
          className="pl-12 h-12 w-full rounded-full bg-muted/50 backdrop-blur-md border-border focus-visible:ring-primary/30 font-body text-foreground placeholder:text-muted-foreground/50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" className="rounded-full px-6 md:px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-md active:scale-95">Search</Button>
    </form>
  );
}

export function SearchBar({ className }: SearchBarProps) {
  return (
    <Suspense fallback={<div className={`h-10 w-full animate-pulse rounded-md bg-muted ${className}`} />}>
      <SearchBarContent className={className} />
    </Suspense>
  );
}
