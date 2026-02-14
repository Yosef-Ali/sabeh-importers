"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AiChatAssistant } from "@/components/marketplace/ai-chat-assistant";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 font-ui antialiased">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Header isCollapsed={isCollapsed} />

      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          isCollapsed ? "lg:pl-[68px]" : "lg:pl-[240px]"
        )}
      >
        <div className="container mx-auto p-4 lg:p-6">{children}</div>
      </main>
      
      <AiChatAssistant />
    </div>
  );
}
