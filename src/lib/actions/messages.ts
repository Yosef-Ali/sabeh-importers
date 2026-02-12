"use server";

import { db } from "@/lib/db";
import { conversations, messages } from "@/db/schema";
import { desc, eq, and, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get all conversations for a user
export async function getUserConversations(userId: string) {
  const data = await db.query.conversations.findMany({
    where: or(
      eq(conversations.buyerId, userId),
      eq(conversations.sellerId, userId)
    ),
    orderBy: [desc(conversations.lastMessageAt)],
    with: {
      listing: {
        columns: {
          id: true,
          title: true,
          images: true,
          price: true,
          status: true,
        },
      },
      buyer: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      seller: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      messages: {
        limit: 1,
        orderBy: [desc(messages.createdAt)],
      },
    },
  });

  return data;
}

// Get a single conversation with all messages
export async function getConversation(conversationId: string, userId: string) {
  const conversation = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.id, conversationId),
      or(
        eq(conversations.buyerId, userId),
        eq(conversations.sellerId, userId)
      )
    ),
    with: {
      listing: {
        with: {
          seller: {
            columns: {
              id: true,
              name: true,
              avatar: true,
              phone: true,
            },
          },
        },
      },
      buyer: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      seller: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      messages: {
        orderBy: [messages.createdAt],
        with: {
          sender: {
            columns: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  return conversation;
}

// Create or get existing conversation
export async function getOrCreateConversation(
  listingId: string,
  buyerId: string,
  sellerId: string
) {
  // Check if conversation already exists
  const existing = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.listingId, listingId),
      eq(conversations.buyerId, buyerId),
      eq(conversations.sellerId, sellerId)
    ),
  });

  if (existing) {
    return existing;
  }

  // Create new conversation
  const [newConversation] = await db
    .insert(conversations)
    .values({
      listingId,
      buyerId,
      sellerId,
      lastMessageAt: new Date(),
    })
    .returning();

  revalidatePath("/messages");
  return newConversation;
}

// Send a message
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  type: "TEXT" | "OFFER" = "TEXT",
  offerAmount?: number
) {
  // Get conversation to determine recipient
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Create message
  const [message] = await db
    .insert(messages)
    .values({
      conversationId,
      senderId,
      content,
      type,
      offerAmount: offerAmount ? offerAmount.toString() : null,
      offerStatus: offerAmount ? "pending" : null,
    })
    .returning();

  // Update conversation last message time and unread count
  const isBuyer = senderId === conversation.buyerId;
  await db
    .update(conversations)
    .set({
      lastMessageAt: new Date(),
      buyerUnread: isBuyer ? 0 : sql`${conversations.buyerUnread} + 1`,
      sellerUnread: isBuyer ? sql`${conversations.sellerUnread} + 1` : 0,
    })
    .where(eq(conversations.id, conversationId));

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);

  return message;
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string, userId: string) {
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });

  if (!conversation) return;

  const isBuyer = userId === conversation.buyerId;

  // Update unread count
  await db
    .update(conversations)
    .set({
      buyerUnread: isBuyer ? 0 : conversation.buyerUnread,
      sellerUnread: isBuyer ? conversation.sellerUnread : 0,
    })
    .where(eq(conversations.id, conversationId));

  // Mark all messages as read
  await db
    .update(messages)
    .set({
      isRead: true,
      readAt: new Date(),
    })
    .where(
      and(
        eq(messages.conversationId, conversationId),
        eq(messages.isRead, false)
      )
    );

  revalidatePath(`/messages/${conversationId}`);
}

// Respond to offer
export async function respondToOffer(
  messageId: string,
  status: "accepted" | "rejected" | "countered",
  counterAmount?: number
) {
  await db
    .update(messages)
    .set({
      offerStatus: status,
    })
    .where(eq(messages.id, messageId));

  if (status === "countered" && counterAmount) {
    const message = await db.query.messages.findFirst({
      where: eq(messages.id, messageId),
    });

    if (message) {
      await sendMessage(
        message.conversationId,
        message.senderId,
        `Counter offer: ${counterAmount} ETB`,
        "OFFER",
        counterAmount
      );
    }
  }

  revalidatePath("/messages");
}
