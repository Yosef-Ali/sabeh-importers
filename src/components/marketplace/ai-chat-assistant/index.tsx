"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  X, 
  MessageSquare, 
  Image as ImageIcon, 
  Paperclip, 
  Maximize2, 
  Minimize2,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { A2UIRenderer } from "./a2ui-renderer";
import { A2UIResponse } from "@/lib/a2ui-types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  ui?: any;
}

export function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm Sabeh AI. I specialize in Agentic UI (A2UI) to help you manage your imports and listings with intelligence.",
      ui: {
        type: "suggestion_chips",
        props: {
          chips: ["How do I use OCR?", "Analyze my product image", "Write a description for me"]
        }
      }
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const text = overrideInput || input;
    if (!text && !imageUrl) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [...messages, userMessage],
          imageUrl: imageUrl
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        assistantContent += chunk;

        // Try to parse partial or full JSON
        try {
          const parsed: A2UIResponse = JSON.parse(assistantContent);
          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { 
              ...last, 
              content: parsed.message || "", 
              ui: parsed.ui 
            }];
          });
        } catch (e) {
          // If not valid JSON yet (streaming), just show raw (or wait)
          // For A2UI we usually wait for full JSON if model is set to JSON mode
        }
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Chat Error", description: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
      setImageUrl(null);
    }
  };

  const handleAction = (action: string, data: any) => {
    if (action === "input") {
      setInput(data);
      handleSend(data);
    } else if (action === "copy") {
      navigator.clipboard.writeText(data);
      toast({ title: "Copied to clipboard" });
    } else {
      console.log("A2UI Action:", action, data);
      toast({ title: "Action Handled", description: `${action} triggered with data.` });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[380px] h-[600px] bg-background border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Sabeh AI Agent</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] opacity-80">A2UI Protocol Active</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex flex-col gap-2", m.role === "user" ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl p-3 text-sm transition-all",
                    m.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-md" 
                      : "bg-muted/50 border rounded-tl-none"
                  )}>
                    {m.content || (!m.ui && <Loader2 className="h-4 w-4 animate-spin opacity-50" />)}
                  </div>
                  
                  {m.ui && (
                    <div className="w-[90%] animate-in fade-in zoom-in-95 duration-500">
                      <A2UIRenderer element={m.ui} onAction={handleAction} />
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              ))}
              {isLoading && !messages[messages.length - 1].content && (
                <div className="flex items-start gap-2 animate-pulse">
                   <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                     <Bot className="h-4 w-4 text-muted-foreground" />
                   </div>
                   <div className="bg-muted h-12 w-24 rounded-2xl rounded-tl-none" />
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Preview Image */}
          {imageUrl && (
            <div className="px-4 py-2 border-t flex items-center gap-2">
              <div className="relative w-12 h-12 rounded border overflow-hidden">
                <img src={imageUrl} alt="Upload" className="w-full h-full object-cover" />
                <button onClick={() => setImageUrl(null)} className="absolute top-0 right-0 bg-black/50 text-white rounded-full">
                  <X className="h-3 w-3" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground italic">Ready to analyze...</span>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-muted/20">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <label className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                  <Paperclip className="h-4 w-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                <Input
                  placeholder="Ask Sabeh..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="pl-8 bg-background border-none shadow-sm focus-visible:ring-1 ring-primary/30"
                />
              </div>
              <Button type="submit" disabled={isLoading || (!input && !imageUrl)} size="icon" className="shadow-lg shadow-primary/20">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95",
          isOpen ? "bg-muted text-foreground border shadow-none" : "bg-primary text-primary-foreground hover:shadow-primary/40"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : (
          <div className="relative">
            <Bot className="h-7 w-7" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-primary" />
          </div>
        )}
      </Button>
    </div>
  );
}
