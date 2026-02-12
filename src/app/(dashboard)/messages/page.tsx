import { getUserConversations } from "@/lib/actions/messages";
import { ConversationList } from "@/components/messages/conversation-list";
import { Inbox } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Messages | Sabeh Market",
  description: "Your conversations with buyers and sellers",
};

export default async function MessagesPage() {
  // In a real app, get userId from session
  const userId = "1";
  const conversations = await getUserConversations(userId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1a2d4a]">Messages</h1>
        <p className="text-muted-foreground">
          Chat with buyers and sellers about your listings
        </p>
      </div>

      {/* Conversations */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {conversations.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf8f5] border border-[#FCDD09]/20">
              <Inbox className="h-10 w-10 text-[#FCDD09]/60" />
            </div>
            <h3 className="text-xl font-bold text-[#1a2d4a] mb-2">No messages yet</h3>
            <p className="text-gray-600 max-w-sm">
              When you start chatting with buyers or sellers, your conversations will appear here.
            </p>
          </div>
        ) : (
          <Suspense fallback={<ConversationListSkeleton />}>
            <ConversationList conversations={conversations} currentUserId={userId} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

function ConversationListSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 animate-pulse">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-3 w-48 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
