"use client";

import { useState, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ImageAnalysisResult } from "@/lib/ai-utils";
import { ScanText, Loader2, Copy, Check, Sparkles, Image as ImageIcon, Tag } from "lucide-react";
import { z } from "zod";

interface ImageOcrDialogProps {
  onTextExtracted: (text: string) => void;
  onAnalysisResult?: (data: ImageAnalysisResult) => void;
  existingImages?: string[];
}

// Mirroring the schema for useObject
const analysisSchema = z.object({
  description: z.string(),
  features: z.array(z.string()),
  tags: z.array(z.string()),
  altText: z.string(),
  suggestedTitle: z.string(),
});

export function ImageOcrDialog({ 
  onTextExtracted, 
  onAnalysisResult,
  existingImages = [] 
}: ImageOcrDialogProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState("ocr");
  const [copied, setCopied] = useState(false);

  // useCompletion for OCR Streaming
  const { 
    complete: runOcr, 
    completion: extractedText, 
    isLoading: isOcrLoading,
    error: ocrError
  } = useCompletion({
    api: "/api/ai/ocr",
  });

  // useObject for Image Enhancement Streaming
  const {
    submit: runAnalyze,
    object: analysis,
    isLoading: isAnalyzeLoading,
    error: analyzeError
  } = useObject({
    api: "/api/ai/analyze",
    schema: analysisSchema,
  });

  const handleExtract = async (url: string) => {
    if (!url) return;
    runOcr("", { body: { imageUrl: url } });
  };

  const handleAnalyze = async (url: string) => {
    if (!url) return;
    runAnalyze({ imageUrl: url });
  };

  const handleInsert = () => {
    let textToInsert = extractedText;
    if (analysis) {
       textToInsert += `\n\nAI Insights:\n${analysis.description}\nKey Features: ${analysis.features?.join(", ")}`;
    }
    onTextExtracted(textToInsert);
    if (onAnalysisResult && analysis) onAnalysisResult(analysis as ImageAnalysisResult);
    setOpen(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = isOcrLoading || isAnalyzeLoading;
  const error = ocrError?.message || analyzeError?.message;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Image Intelligence
          </DialogTitle>
          <DialogDescription>
            Extract text from documents/labels or enhance your listing with AI image analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {existingImages.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-3">Select from listing images:</p>
              <div className="flex gap-3 flex-wrap">
                {existingImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(img);
                      if (activeTab === "ocr") handleExtract(img);
                      else handleAnalyze(img);
                    }}
                    className={`relative w-20 h-20 rounded-lg border-2 overflow-hidden hover:scale-105 transition-all ${imageUrl === img ? 'border-primary shadow-md' : 'border-border'}`}
                  >
                    <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                    {imageUrl === img && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="text-white h-8 w-8 drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ocr" className="flex items-center gap-2">
                <ScanText className="h-4 w-4" />
                OCR Text
              </TabsTrigger>
              <TabsTrigger value="enhance" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Enhancement
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ocr" className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Paste image URL for OCR..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => handleExtract(imageUrl)}
                  disabled={!imageUrl || isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Extract"}
                </Button>
              </div>
              
              {extractedText && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Extracted Text (Amharic/English):</p>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleCopy(extractedText)}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Textarea
                    value={extractedText}
                    rows={6}
                    readOnly
                    className="resize-none bg-muted/50 font-ui"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="enhance" className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Paste image URL for Analysis..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => handleAnalyze(imageUrl)}
                  disabled={!imageUrl || isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
                </Button>
              </div>

              {analysis && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      <Sparkles className="h-4 w-4" />
                      AI Visual Summary
                    </div>
                    {analysis.description && (
                      <p className="text-sm font-display text-foreground leading-relaxed italic">
                        "{analysis.description}"
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {analysis.features?.map((f, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-wider font-bold">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Tag className="h-4 w-4" />
                      Suggested Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.tags?.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] uppercase font-mono">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          {(extractedText || analysis) && (
            <Button type="button" onClick={handleInsert} className="w-full h-12 text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all">
              Apply AI Insights to Listing
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
