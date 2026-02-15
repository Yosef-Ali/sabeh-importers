
"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";
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
              className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
            >
              <div className="z-10 absolute top-2 right-2">
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
        <UploadDropzone
          key={`dropzone-${value.length}`}
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            const newUrls = res?.map((file) => (file as any).ufsUrl ?? file.url) || [];
            onChange([...value, ...newUrls]);
            toast.success("Images uploaded successfully");
          }}
          onUploadError={(error: Error) => {
            toast.error(`ERROR! ${error.message}`);
          }}
          config={{
            mode: "auto",
          }}
          appearance={{
            container: "border-2 border-dashed border-border bg-muted/20 hover:bg-muted/30 transition-colors p-8 rounded-lg cursor-pointer",
            label: "text-muted-foreground hover:text-primary transition-colors cursor-pointer",
            button: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ut-uploading:bg-primary/70 ut-readying:bg-primary/50",
            allowedContent: "text-muted-foreground/80 text-xs",
          }}
          content={{
            label: "Drop images here or click to browse",
            allowedContent: `${value.length}/${maxFiles} uploaded (4MB each)`,
          }}
        />
      ) : (
        <p className="text-xs text-center text-muted-foreground">
          Maximum of {maxFiles} images reached. Remove some to upload more.
        </p>
      )}
    </div>
  );
};
