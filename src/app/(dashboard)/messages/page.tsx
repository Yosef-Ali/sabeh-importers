import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getUserConversations } from "@/lib/actions/messages";
import { ConversationList } from "@/components/messages/conversation-list";
import { Inbox } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Messages | Sabeh Market",
  description: "Your conversations with buyers and sellers",
};

export default async function MessagesPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/api/auth/clear-session");

  const conversations = await getUserConversations(currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Chat with buyers and sellers about your listings
        </p>
      </div>

      {/* Conversations */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {conversations.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-accent/20">
              <Inbox className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No messages yet</h3>
            <p className="text-muted-foreground max-w-sm">
              When you start chatting with buyers or sellers, your conversations will appear here.
            </p>
          </div>
        ) : (
          <Suspense fallback={<ConversationListSkeleton />}>
            <ConversationList conversations={conversations} currentUserId={currentUser.id} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

function ConversationListSkeleton() {
  return (
    <div className="divide-y divide-border">
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
