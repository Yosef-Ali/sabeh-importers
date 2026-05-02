import { Navbar } from "@/components/marketplace/navbar";
import { EnhancedFooter } from "@/components/homepage/enhanced-footer";
import { AiChatAssistant } from "@/components/marketplace/ai-chat-assistant";

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
