import dynamic from "next/dynamic";
import { Navbar } from "@/components/marketplace/navbar";
import { EnhancedFooter } from "@/components/homepage/enhanced-footer";

// Lazy-load: ~376 LOC of client JS + transitive icon imports for a feature
// most users never open. Keeps the marketplace bundle slim — the chat button
// hydrates after the rest of the page is interactive.
const AiChatAssistant = dynamic(
  () => import("@/components/marketplace/ai-chat-assistant").then((m) => m.AiChatAssistant),
  { ssr: false }
);

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-ui antialiased">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <EnhancedFooter />
      <AiChatAssistant />
    </div>
  );
}
