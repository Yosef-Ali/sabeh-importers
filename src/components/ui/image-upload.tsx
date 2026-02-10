
"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint?: "listingImage" | "avatar";
}

export const ImageUpload = ({
  onChange,
  value,
  endpoint = "listingImage",
}: ImageUploadProps) => {
  if (value) {
    return (
      <div className="relative h-40 w-40">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-md object-cover"
        />
        <button
          onClick={() => onChange("")}
          className="absolute right-0 top-0 -mr-2 -mt-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
        toast.success("Image uploaded");
      }}
      onUploadError={(error: Error) => {
        toast.error(`ERROR! ${error.message}`);
      }}
    />
  );
};
