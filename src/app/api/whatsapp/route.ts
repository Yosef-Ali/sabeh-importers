import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { whatsappChats } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(whatsappChats)
      .orderBy(desc(whatsappChats.lastMessage));

    return NextResponse.json({ chats: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load chats' }, { status: 500 });
  }
}
