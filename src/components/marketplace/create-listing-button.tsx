"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingSheet } from "@/components/marketplace/listing-sheet";

interface CreateListingButtonProps {
  categories: { id: string; name: string }[];
  language?: "en" | "am";
}

export function CreateListingButton({
  categories,
  language = "en",
}: CreateListingButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="accent"
        size="lg"
        className="font-display font-bold shadow-hard-navy"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-5 w-5" />
        {language === "am" ? "ዝርዝር ፍጠር" : "Create Listing"}
      </Button>

      <ListingSheet
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        language={language}
      />
    </>
  );
}
