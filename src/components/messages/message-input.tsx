"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/lib/actions/messages";
import { toast } from "sonner";
import { Send, DollarSign, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
  listingPrice: number;
}

export function MessageInput({ conversationId, currentUserId, listingPrice }: MessageInputProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");

  async function handleSendMessage() {
    if (!message.trim() && !offerAmount) return;

    setIsSending(true);

    try {
      if (offerAmount) {
        await sendMessage(
          conversationId,
          currentUserId,
          message || `Offer: ${offerAmount} ETB`,
          "OFFER",
          Number(offerAmount)
        );
        setOfferAmount("");
        setShowOfferInput(false);
      } else {
        await sendMessage(conversationId, currentUserId, message, "TEXT");
      }

      setMessage("");
      router.refresh();
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="space-y-3">
      {/* Offer Input */}
      {showOfferInput && (
        <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-navy uppercase tracking-wide">
              💰 Make an Offer
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowOfferInput(false)}
              className="h-6 w-6 text-gray-500 hover:text-navy"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Enter your offer amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="border-gold/30 focus:border-gold focus:ring-gold"
              />
              <p className="text-xs text-gray-600 mt-1">
                Listing price: {listingPrice.toLocaleString()} ETB
              </p>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!offerAmount || isSending}
              className="bg-gold hover:bg-gold/90 text-navy font-bold"
            >
              Send Offer
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex gap-3">
        {!showOfferInput && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowOfferInput(true)}
            className="flex-shrink-0 border-gold/30 text-gold hover:bg-gold/10"
            title="Make an offer"
          >
            <DollarSign className="h-5 w-5" />
          </Button>
        )}

        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="resize-none border-gray-300 focus:border-gold focus:ring-gold"
          disabled={isSending}
        />

        <Button
          onClick={handleSendMessage}
          disabled={(!message.trim() && !offerAmount) || isSending}
          className="flex-shrink-0 h-full bg-gold hover:bg-gold/90 text-navy font-bold px-6"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">Enter</kbd> to send,{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
