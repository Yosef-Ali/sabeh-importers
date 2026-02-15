
"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
  endpoint?: "listingImage" | "avatar";
  maxFiles?: number;
}

export const ImageUpload = ({
  onChange,
  value,
  endpoint = "listingImage",
  maxFiles = 10,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  const remaining = maxFiles - value.length;

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url) => (
            <div
              key={url}
              className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted group"
            >
              <div className="z-10 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm hover:bg-rose-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <Image
                fill
                src={url}
                alt="Listing Image"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {remaining > 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/20 p-6">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {value.length}/{maxFiles} images uploaded
          </p>
          <UploadButton
            key={`upload-btn-${value.length}`}
            endpoint={endpoint}
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              setIsUploading(false);
              const newUrls = res?.map((file) => (file as any).ufsUrl ?? file.url) || [];
              onChange([...value, ...newUrls]);
              toast.success(`${newUrls.length} image(s) uploaded`);
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              toast.error(`Upload failed: ${error.message}`);
            }}
            appearance={{
              button: "bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium px-4 py-2 ut-uploading:bg-primary/70",
              allowedContent: "text-muted-foreground/60 text-xs mt-1",
            }}
            content={{
              button: isUploading ? "Uploading..." : "Choose Images",
              allowedContent: `Up to ${remaining} more (4MB each)`,
            }}
          />
        </div>
      ) : (
        <p className="text-xs text-center text-muted-foreground">
          Maximum of {maxFiles} images reached. Remove some to upload more.
        </p>
      )}
    </div>
  );
};
