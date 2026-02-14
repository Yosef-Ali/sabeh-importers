"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";

const LOCATIONS = [
  { value: "all", label: "All Ethiopia", labelAm: "ሁሉም ኢትዮጵያ" },
  { value: "addis-ababa", label: "Addis Ababa", labelAm: "አዲስ አበባ" },
  { value: "dire-dawa", label: "Dire Dawa", labelAm: "ድሬዳዋ" },
  { value: "mekele", label: "Mekele", labelAm: "መቀሌ" },
  { value: "gondar", label: "Gondar", labelAm: "ጎንደር" },
  { value: "bahir-dar", label: "Bahir Dar", labelAm: "ባህር ዳር" },
  { value: "hawassa", label: "Hawassa", labelAm: "ሀዋሳ" },
  { value: "jimma", label: "Jimma", labelAm: "ጅማ" },
  { value: "adama", label: "Adama", labelAm: "አዳማ" },
];

interface QuickSearchWidgetProps {
  language?: "en" | "am";
}

export function QuickSearchWidget({ language = "en" }: QuickSearchWidgetProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) {
      params.append("query", query.trim());
    }
    if (location && location !== "all") {
      params.append("city", location);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl mx-auto bg-white rounded-button shadow-hard-navy border-2 border-primary overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] divide-y md:divide-y-0 md:divide-x-2 divide-primary/10">
        {/* Search Input */}
        <div className="relative flex items-center px-4 py-3 md:py-0">
          <Search className="absolute left-6 h-5 w-5 text-primary/40" />
          <Input
            type="text"
            placeholder={
              language === "am"
                ? "የምትፈልገውን ፈልግ..."
                : "Search for anything..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base font-display placeholder:text-muted-foreground"
          />
        </div>

        {/* Location Select */}
        <div className="relative flex items-center px-4 py-3 md:py-0 md:w-64">
          <MapPin className="absolute left-6 h-5 w-5 text-primary/40 pointer-events-none z-10" />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="pl-10 border-0 focus:ring-0 focus:ring-offset-0 h-12 text-base font-display">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {language === "am" ? loc.labelAm : loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="p-2">
          <Button
            type="submit"
            size="lg"
            variant="accent"
            className="w-full md:w-auto h-12 px-8 font-display font-semibold text-base rounded-button"
          >
            <Search className="mr-2 h-5 w-5" />
            {language === "am" ? "ፈልግ" : "Search"}
          </Button>
        </div>
      </div>
    </form>
  );
}
