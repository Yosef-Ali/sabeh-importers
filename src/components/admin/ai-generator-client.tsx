"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";
import { Loader2, Copy, Download, Sparkles, ImageIcon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "USED_GOOD", label: "Used (Good)" },
  { value: "USED_FAIR", label: "Used (Fair)" },
  { value: "FOR_PARTS", label: "For Parts" },
];

const CATEGORIES = [
  "Electronics",
  "Vehicles",
  "Property",
  "Fashion",
  "Home & Garden",
  "Sports & Leisure",
  "Jobs",
  "Services",
  "Furniture",
  "Books & Media",
  "Baby & Kids",
  "Business & Industrial",
];

export function AIGeneratorClient() {
  // Text generation state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState("image/png");
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Text generation via useCompletion
  const {
    complete: streamDescription,
    completion,
    isLoading: isTextLoading,
  } = useCompletion({
    api: "/api/ai/description",
    onError: () => {
      toast.error("Failed to generate description");
    },
  });

  async function handleGenerateText() {
    if (!title || title.length < 3) {
      toast.error("Please enter a title (at least 3 characters)");
      return;
    }

    await streamDescription("", {
      body: { title, category, condition, price, currency: "ETB" },
    });
  }

  function handleCopyText() {
    if (!completion) return;
    navigator.clipboard.writeText(completion);
    toast.success("Copied to clipboard");
  }

  async function handleGenerateImage() {
    if (!imagePrompt.trim()) {
      toast.error("Please enter an image prompt");
      return;
    }

    setIsImageLoading(true);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate image");
      }

      const data = await res.json();
      setGeneratedImage(data.image);
      setImageMimeType(data.mimeType || "image/png");
      toast.success("Image generated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate image");
    } finally {
      setIsImageLoading(false);
    }
  }

  function handleDownloadImage() {
    if (!generatedImage) return;
    const ext = imageMimeType.split("/")[1] || "png";
    const link = document.createElement("a");
    link.href = `data:${imageMimeType};base64,${generatedImage}`;
    link.download = `ai-generated.${ext}`;
    link.click();
    toast.success("Image downloaded");
  }

  return (
    <Tabs defaultValue="text" className="w-full">
      <TabsList>
        <TabsTrigger value="text" className="gap-2">
          <Type className="h-4 w-4" />
          Generate Ad Text
        </TabsTrigger>
        <TabsTrigger value="image" className="gap-2">
          <ImageIcon className="h-4 w-4" />
          Generate Ad Image
        </TabsTrigger>
      </TabsList>

      {/* Text Generation Tab */}
      <TabsContent value="text" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Ad Description</CardTitle>
            <CardDescription>
              Enter listing details and AI will write a compelling description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. iPhone 15 Pro Max 256GB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (ETB)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g. 50000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateText}
              disabled={isTextLoading}
              className="gap-2"
            >
              {isTextLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isTextLoading ? "Generating..." : "Generate Description"}
            </Button>

            {completion && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Generated Description</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyText}
                    className="gap-1.5 text-xs"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  readOnly
                  value={completion}
                  className="min-h-[200px] resize-y"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Image Generation Tab */}
      <TabsContent value="image" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Ad Image</CardTitle>
            <CardDescription>
              Describe the image you want and AI will generate it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imagePrompt">Image Prompt</Label>
              <Textarea
                id="imagePrompt"
                placeholder="e.g. A professional product photo of a brand new iPhone 15 Pro Max on a clean white background with soft lighting"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleGenerateImage}
              disabled={isImageLoading}
              className="gap-2"
            >
              {isImageLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isImageLoading ? "Generating..." : "Generate Image"}
            </Button>

            {generatedImage && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Generated Image</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownloadImage}
                    className="gap-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
                <div className="overflow-hidden rounded-lg border bg-muted/50">
                  <img
                    src={`data:${imageMimeType};base64,${generatedImage}`}
                    alt="AI Generated"
                    className="mx-auto max-h-[512px] w-auto object-contain"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
