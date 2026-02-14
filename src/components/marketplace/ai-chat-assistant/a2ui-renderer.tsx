"use client";

import React from "react";
import { A2UIElement } from "@/lib/a2ui-types";
import { useAiStore } from "@/lib/store/ai-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Sparkles, Tag, ScanText } from "lucide-react";

interface A2UIRendererProps {
  element: A2UIElement;
  onAction?: (action: string, data: any) => void;
}

export function A2UIRenderer({ element, onAction }: A2UIRendererProps) {
  const { type, props } = element;
  const setExtractedText = useAiStore((state) => state.setExtractedText);
  const setAnalysisResult = useAiStore((state) => state.setAnalysisResult);

  const handleApplyOcr = (text: string) => {
    setExtractedText(text);
    onAction?.("apply_ocr", text);
  };

  const handleApplyAnalysis = (result: any) => {
    setAnalysisResult(result);
    onAction?.("apply_analysis", result);
  };

  switch (type) {
    case "text":
      return <p className="text-sm text-foreground/80 leading-relaxed">{props.value}</p>;

    case "heading":
      return <h4 className="text-sm font-bold uppercase tracking-tight text-primary">{props.value}</h4>;

    case "ocr_result":
      return (
        <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
              <ScanText className="h-3 w-3" />
              OCR Text Extracted
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAction?.("copy", props.text)}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <pre className="text-xs font-mono bg-background/50 p-2 rounded border overflow-x-auto whitespace-pre-wrap">
            {props.text}
          </pre>
          <Button size="sm" className="w-full text-[10px] uppercase font-bold" onClick={() => handleApplyOcr(props.text)}>
            Apply to Description
          </Button>
        </div>
      );

    case "image_analysis":
      return (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-xs flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-primary" />
                AI Visual Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <p className="text-sm italic text-foreground/90 leading-tight">"{props.description}"</p>
              <div className="flex flex-wrap gap-1">
                {props.features?.map((f: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-[9px] uppercase font-bold py-0 h-4">
                    {f}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap gap-1.5">
            {props.tags?.map((tag: string, i: number) => (
              <Badge key={i} variant="outline" className="text-[9px] lowercase font-mono">
                #{tag}
              </Badge>
            ))}
          </div>
          
          <Button size="sm" variant="default" className="w-full h-8 text-[10px] font-bold" onClick={() => handleApplyAnalysis(props)}>
            Apply Analysis to Listing
          </Button>
        </div>
      );

    case "suggestion_chips":
      return (
        <div className="flex flex-wrap gap-2 py-1">
          {props.chips?.map((chip: string, i: number) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="rounded-full px-3 h-7 text-[10px] bg-background hover:bg-primary/5 hover:border-primary/30"
              onClick={() => onAction?.("input", chip)}
            >
              {chip}
            </Button>
          ))}
        </div>
      );

    case "card":
      return (
        <Card className="border-border">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">{props.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-sm text-muted-foreground">{props.content}</p>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}
