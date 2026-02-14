"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: any[];
  currentUserId: string;
}

export function ConversationList({ conversations, currentUserId }: ConversationListProps) {
  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const isCurrentUserBuyer = conversation.buyerId === currentUserId;
        const otherUser = isCurrentUserBuyer ? conversation.seller : conversation.buyer;
        const unreadCount = isCurrentUserBuyer
          ? conversation.buyerUnread
          : conversation.sellerUnread;
        const lastMessage = conversation.messages[0];

        return (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className="flex items-start gap-4 p-4 transition-colors hover:bg-cream"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-xl font-bold text-white shadow-sm">
                {otherUser?.name?.[0] || "U"}
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold border-2 border-white flex items-center justify-center">
                  <span className="text-[10px] font-bold text-navy">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "font-semibold text-navy",
                    unreadCount > 0 && "font-bold"
                  )}>
                    {otherUser?.name || "Unknown User"}
                  </p>
                  {isCurrentUserBuyer && (
                    <Badge variant="outline" className="text-xs border-gold/30 text-navy">
                      Seller
                    </Badge>
                  )}
                </div>
                {lastMessage && (
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>

              {/* Listing Info */}
              <div className="flex items-center gap-2 mb-2">
                {conversation.listing.images?.[0] && (
                  <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={conversation.listing.images[0]}
                      alt={conversation.listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600 truncate">
                  {conversation.listing.title}
                </p>
              </div>

              {/* Last Message */}
              {lastMessage && (
                <p className={cn(
                  "text-sm text-gray-600 truncate",
                  unreadCount > 0 && "font-semibold text-navy"
                )}>
                  {lastMessage.type === "OFFER" ? (
                    <span className="text-gold">💰 Offer: {Number(lastMessage.offerAmount).toLocaleString()} ETB</span>
                  ) : (
                    lastMessage.content
                  )}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
