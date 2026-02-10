"use client";

import React, { useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  Image,
  FileText,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  Clock,
  ShoppingCart,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const chats = [
  {
    id: "1",
    name: "Abebe Trading",
    phone: "+251 91 234 5678",
    lastMessage: "Yes, I need 50 cartons of cooking oil",
    time: "10:30 AM",
    unread: 3,
    status: "active",
  },
  {
    id: "2",
    name: "Mulatu Store",
    phone: "+251 92 345 6789",
    lastMessage: "When can you deliver?",
    time: "9:45 AM",
    unread: 1,
    status: "active",
  },
  {
    id: "3",
    name: "Haile Wholesale",
    phone: "+251 93 456 7890",
    lastMessage: "Order confirmed. Thank you!",
    time: "Yesterday",
    unread: 0,
    status: "resolved",
  },
  {
    id: "4",
    name: "Tigist Mini Market",
    phone: "+251 94 567 8901",
    lastMessage: "Do you have sugar in stock?",
    time: "Yesterday",
    unread: 0,
    status: "pending",
  },
  {
    id: "5",
    name: "+251 95 678 9012",
    phone: "+251 95 678 9012",
    lastMessage: "Hello, I want to place an order",
    time: "2 days ago",
    unread: 0,
    status: "active",
  },
];

const messages = [
  {
    id: "1",
    direction: "inbound",
    type: "text",
    content: "Hello, I want to order some products",
    time: "10:00 AM",
    status: "read",
  },
  {
    id: "2",
    direction: "outbound",
    type: "text",
    content: "Hello! Welcome to Sabeh Importers. What products are you looking for?",
    time: "10:02 AM",
    status: "read",
  },
  {
    id: "3",
    direction: "inbound",
    type: "text",
    content: "I need cooking oil and rice",
    time: "10:05 AM",
    status: "read",
  },
  {
    id: "4",
    direction: "outbound",
    type: "text",
    content: "Great choice! We have Golden Cooking Oil (5L) at ETB 1,500 and Basmati Rice (25kg) at ETB 1,600. How many would you like?",
    time: "10:08 AM",
    status: "read",
  },
  {
    id: "5",
    direction: "inbound",
    type: "text",
    content: "Yes, I need 50 cartons of cooking oil",
    time: "10:30 AM",
    status: "read",
  },
];

const quickReplies = [
  "Thank you for your order!",
  "Your order has been confirmed",
  "We'll deliver within 24 hours",
  "Please check our latest catalog",
  "What quantities do you need?",
];

export default function WhatsAppPage() {
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.phone.includes(searchQuery)
  );

  const handleSend = () => {
    if (messageText.trim()) {
      // Handle send message
      setMessageText("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp</h1>
        <p className="text-muted-foreground">Manage customer conversations</p>
      </div>

      <div className="grid h-[calc(100vh-220px)] gap-4 lg:grid-cols-3">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-340px)]">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 border-b p-4 transition-colors hover:bg-muted/50",
                    selectedChat.id === chat.id && "bg-muted"
                  )}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {chat.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.unread > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{chat.name}</p>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="flex flex-col lg:col-span-2">
          {/* Chat Header */}
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-green-100 text-green-700">
                  {selectedChat.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{selectedChat.name}</p>
                <p className="text-sm text-muted-foreground">{selectedChat.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-[calc(100vh-500px)] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.direction === "outbound" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2",
                        message.direction === "outbound"
                          ? "bg-green-500 text-white"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-[10px]",
                          message.direction === "outbound"
                            ? "text-green-100"
                            : "text-muted-foreground"
                        )}
                      >
                        <span>{message.time}</span>
                        {message.direction === "outbound" && (
                          message.status === "read" ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : message.status === "delivered" ? (
                            <CheckCheck className="h-3 w-3 opacity-50" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Quick Replies */}
          <div className="border-t p-2">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setMessageText(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} className="bg-green-500 hover:bg-green-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
