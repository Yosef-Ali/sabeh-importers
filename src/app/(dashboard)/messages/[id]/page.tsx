import { notFound } from "next/navigation";
import { getConversation, markMessagesAsRead } from "@/lib/actions/messages";
export const dynamic = "force-dynamic";
import { MessageThread } from "@/components/messages/message-thread";
import { MessageInput } from "@/components/messages/message-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, MoreVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata() {
  return {
    title: "Conversation | Sabeh Market",
  };
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  // In a real app, get userId from session
  const userId = "1";

  const conversation = await getConversation(params.id, userId);

  if (!conversation) {
    notFound();
  }

  // Mark messages as read
  await markMessagesAsRead(params.id, userId);

  const isCurrentUserBuyer = conversation.buyerId === userId;
  const otherUser = isCurrentUserBuyer ? conversation.seller : conversation.buyer;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/messages">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-[#1a2d4a]">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#2d4a6f] flex items-center justify-center text-xl font-bold text-white shadow-sm">
              {otherUser?.name?.[0] || "U"}
            </div>
            <div>
              <p className="font-bold text-[#1a2d4a]">{otherUser?.name || "Unknown User"}</p>
              {isCurrentUserBuyer && (
                <Badge variant="outline" className="text-xs border-[#FCDD09]/30 text-[#1a2d4a]">
                  Seller
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {conversation.listing.seller?.phone && isCurrentUserBuyer && (
            <Button variant="outline" size="sm" className="border-[#FCDD09] text-[#1a2d4a] hover:bg-[#FCDD09]/10">
              <Phone className="h-4 w-4 mr-2" />
              Call Seller
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Listing Info Banner */}
      <div className="border-b border-gray-200 bg-[#faf8f5] px-6 py-3">
        <div className="flex items-center gap-4">
          {conversation.listing.images?.[0] && (
            <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
              <Image
                src={conversation.listing.images[0]}
                alt={conversation.listing.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Link
              href={`/listings/${conversation.listingId}`}
              className="font-semibold text-[#1a2d4a] hover:text-[#FCDD09] transition-colors line-clamp-1"
            >
              {conversation.listing.title}
            </Link>
            <p className="text-sm text-gray-600 mt-0.5">
              {Number(conversation.listing.price).toLocaleString()} ETB
            </p>
          </div>
          <Link href={`/listings/${conversation.listingId}`}>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-white">
              View Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto bg-[#faf8f5]">
        <MessageThread
          messages={conversation.messages}
          currentUserId={userId}
        />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <MessageInput
          conversationId={params.id}
          currentUserId={userId}
          listingPrice={Number(conversation.listing.price)}
        />
      </div>
    </div>
  );
}
