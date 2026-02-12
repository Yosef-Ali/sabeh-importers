"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { CheckCheck, Clock } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: string;
  offerAmount: string | null;
  offerStatus: string | null;
  isRead: boolean | null;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <p className="text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === currentUserId;
        const showDate =
          index === 0 ||
          new Date(message.createdAt).toDateString() !==
            new Date(messages[index - 1].createdAt).toDateString();

        return (
          <div key={message.id}>
            {/* Date Separator */}
            {showDate && (
              <div className="flex items-center justify-center my-6">
                <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {new Date(message.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Message */}
            <div
              className={cn(
                "flex gap-3",
                isCurrentUser ? "justify-end" : "justify-start"
              )}
            >
              {!isCurrentUser && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#2d4a6f] flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0">
                  {message.sender.name[0]}
                </div>
              )}

              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                  isCurrentUser
                    ? "bg-[#FCDD09] text-[#1a2d4a]"
                    : "bg-white border border-gray-200 text-gray-800"
                )}
              >
                {/* Offer Message */}
                {message.type === "OFFER" && message.offerAmount && (
                  <div className="mb-2">
                    <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                      💰 Price Offer
                    </p>
                    <p className="text-2xl font-bold mt-1 tabular-nums">
                      {Number(message.offerAmount).toLocaleString()} ETB
                    </p>
                    {message.offerStatus && (
                      <p className="text-xs mt-1 opacity-80 capitalize">
                        Status: {message.offerStatus}
                      </p>
                    )}
                  </div>
                )}

                {/* Message Content */}
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>

                {/* Time & Read Status */}
                <div
                  className={cn(
                    "flex items-center gap-1 mt-2 text-xs",
                    isCurrentUser ? "opacity-80" : "text-gray-500"
                  )}
                >
                  <span>
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {isCurrentUser && (
                    <>
                      <span>•</span>
                      {message.isRead === true ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </>
                  )}
                </div>
              </div>

              {isCurrentUser && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FCDD09] to-[#e5c908] flex items-center justify-center text-sm font-bold text-[#1a2d4a] shadow-sm flex-shrink-0">
                  {message.sender.name[0]}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
