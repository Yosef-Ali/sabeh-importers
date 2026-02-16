"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";
import { Loader2, Copy, Download, Sparkles, ImageIcon, Type, Upload, X, LayoutGrid } from "lucide-react";
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

const TEXT_LENGTHS = [
  { value: "short", label: "Short (~50 words)" },
  { value: "medium", label: "Medium (~150 words)" },
  { value: "long", label: "Long (~300 words)" },
];

const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1 (Square)" },
  { value: "3:4", label: "3:4 (Portrait)" },
  { value: "4:3", label: "4:3 (Landscape)" },
  { value: "9:16", label: "9:16 (Story)" },
  { value: "16:9", label: "16:9 (Wide)" },
];

const IMAGE_SIZES = [
  { value: "1K", label: "1K (Standard)" },
  { value: "2K", label: "2K (High)" },
];

const SAMPLE_PROMPTS = [
  {
    prompt: "ለሽያጭ የተዘጋጀ አዲስ iPhone 15 Pro Max ፣ ንጹህ ነጭ ዳራ ላይ ፣ ፕሮፌሽናል የምርት ፎቶ ፣ ለስላሳ ብርሃን",
    label: "iPhone ምርት ፎቶ",
    category: "Electronics",
    emoji: "📱",
  },
  {
    prompt: "ዘመናዊ የኢትዮጵያ ቤት ውስጣዊ ዲዛይን ፣ ባህላዊ ጥበብ ያለው ሳሎን ፣ ሞቃት ብርሃን ፣ ምቹ ቤት",
    label: "የቤት ውስጥ ዲዛይን",
    category: "Property",
    emoji: "🏠",
  },
  {
    prompt: "አዲስ Toyota Land Cruiser 300 ፣ በአዲስ አበባ ጎዳና ላይ ፣ ፀሐያማ ቀን ፣ ፕሮፌሽናል የመኪና ፎቶ",
    label: "Toyota መኪና ማስታወቂያ",
    category: "Vehicles",
    emoji: "🚗",
  },
  {
    prompt: "ባህላዊ የኢትዮጵያ ልብስ ፣ ነጭ የጥጥ ቀሚስ ከጥለት ጋር ፣ ሞዴል ለብሳ ፣ ንጹህ ዳራ ፣ ፋሽን ፎቶ",
    label: "ባህላዊ ልብስ",
    category: "Fashion",
    emoji: "👗",
  },
  {
    prompt: "ዘመናዊ የቢሮ ዕቃ ፣ ዴስክ እና ወንበር ፣ ሚኒማሊስት ዲዛይን ፣ ብሩህ ክፍል ፣ ፕሮፌሽናል ፎቶ",
    label: "የቢሮ ዕቃ",
    category: "Furniture",
    emoji: "🪑",
  },
  {
    prompt: "የኢትዮጵያ ቡና ስነ-ስርዓት ዕቃዎች ፣ ጀበና ፣ ሲኒ ፣ ረከቦት ፣ ባህላዊ ዳራ ፣ ሞቃት ብርሃን",
    label: "የቡና ዕቃዎች",
    category: "Home & Garden",
    emoji: "☕",
  },
  {
    prompt: "የልጆች አልባሳት ስብስብ ፣ ቀለማት ያሏቸው ልብሶች ፣ ደስተኛ ዲዛይን ፣ ንጹህ ነጭ ዳራ ፣ የምርት ፎቶ",
    label: "የልጆች ልብስ",
    category: "Baby & Kids",
    emoji: "👶",
  },
  {
    prompt: "Samsung Galaxy S24 Ultra ፣ ከስክሪን ጋር ፣ ጨለማ ዳራ ፣ ኒዮን ብርሃን ፣ ቴክ ፕሮዳክት ፎቶግራፊ",
    label: "Samsung ስልክ",
    category: "Electronics",
    emoji: "📲",
  },
  {
    prompt: "Professional gym equipment set, dumbbells and bench, modern fitness studio background, dramatic lighting",
    label: "Gym Equipment",
    category: "Sports & Leisure",
    emoji: "💪",
  },
  {
    prompt: "የኢትዮጵያ ማር ፣ በባህላዊ ማሰሮ ውስጥ ፣ ከአበባ ጋር ፣ ተፈጥሯዊ ብርሃን ፣ organic food photography",
    label: "የማር ምርት",
    category: "Business & Industrial",
    emoji: "🍯",
  },
  {
    prompt: "ዘመናዊ laptop ከአክሰሰሪዎች ጋር ፣ ዴስክ ላይ ፣ minimal workspace ፣ ለስላሳ ብርሃን ፣ top-down view",
    label: "ላፕቶፕ ወርክስፔስ",
    category: "Electronics",
    emoji: "💻",
  },
  {
    prompt: "የኢትዮጵያ ጌጣጌጥ ስብስብ ፣ የወርቅ ቀለበቶች ፣ አንገትላ ፣ ጆሮ ጌጥ ፣ ቬልቬት ዳራ ፣ luxury product photo",
    label: "ጌጣጌጥ",
    category: "Fashion",
    emoji: "💍",
  },
];

export function AIGeneratorClient() {
  // Text generation state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [outputLength, setOutputLength] = useState("medium");

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState("image/png");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1K");

  // Reference image state
  const [refImage, setRefImage] = useState<string | null>(null);
  const [refImageMimeType, setRefImageMimeType] = useState("image/jpeg");
  const [refImageName, setRefImageName] = useState("");

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
      body: { title, category, condition, price, currency: "ETB", outputLength },
    });
  }

  function handleCopyText() {
    if (!completion) return;
    navigator.clipboard.writeText(completion);
    toast.success("Copied to clipboard");
  }

  function handleRefImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be under 4MB");
      return;
    }
    setRefImageName(file.name);
    setRefImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setRefImage(base64);
    };
    reader.readAsDataURL(file);
  }

  function clearRefImage() {
    setRefImage(null);
    setRefImageName("");
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
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio,
          imageSize,
          ...(refImage && { referenceImage: refImage, referenceImageMimeType: refImageMimeType }),
        }),
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
        <TabsTrigger value="gallery" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          Prompt Gallery
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

            <div className="space-y-2">
              <Label htmlFor="outputLength">Output Length</Label>
              <Select value={outputLength} onValueChange={setOutputLength}>
                <SelectTrigger id="outputLength" className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEXT_LENGTHS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* Size & Quality Options */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger id="aspectRatio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPECT_RATIOS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageSize">Resolution</Label>
                <Select value={imageSize} onValueChange={setImageSize}>
                  <SelectTrigger id="imageSize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_SIZES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reference Image Upload */}
            <div className="space-y-2">
              <Label>Reference Image (optional)</Label>
              {refImage ? (
                <div className="relative inline-block">
                  <img
                    src={`data:${refImageMimeType};base64,${refImage}`}
                    alt="Reference"
                    className="h-32 w-auto rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearRefImage}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="mt-1 text-xs text-muted-foreground truncate max-w-[200px]">{refImageName}</p>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground hover:bg-muted/40 transition-colors w-fit">
                  <Upload className="h-4 w-4" />
                  Upload reference image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleRefImageSelect}
                  />
                </label>
              )}
              <p className="text-xs text-muted-foreground">
                Upload a product photo for AI to use as reference when generating.
              </p>
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
      {/* Prompt Gallery Tab */}
      <TabsContent value="gallery" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Prompt Gallery / የጥያቄ ማዕከል</CardTitle>
            <CardDescription>
              Sample prompts for generating product images. Click &quot;Use Prompt&quot; to load it into the image generator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SAMPLE_PROMPTS.map((sample, i) => (
                <div
                  key={i}
                  className="group flex flex-col gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{sample.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{sample.label}</p>
                      <p className="text-xs text-muted-foreground">{sample.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {sample.prompt}
                  </p>
                  <div className="mt-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(sample.prompt);
                        toast.success("Prompt copied");
                      }}
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => {
                        setImagePrompt(sample.prompt);
                        toast.success("Prompt loaded — switch to Generate Ad Image tab");
                      }}
                    >
                      <Sparkles className="h-3 w-3" />
                      Use Prompt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
