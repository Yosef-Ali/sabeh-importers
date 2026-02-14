"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HeartButtonProps {
  title?: string;
  className?: string;
}

export function HeartButton({ title, className }: HeartButtonProps) {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
        if (!liked) {
          toast.success("Log: Favorite Entry Created", { description: title });
        } else {
          toast("Log: Favorite Entry Removed");
        }
      }}
      className={cn(
        "absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:text-accent transition-colors shadow-sm",
        className
      )}
    >
      <Heart className={cn("h-4 w-4 transition-all", liked && "fill-current text-accent")} />
    </button>
  );
}
