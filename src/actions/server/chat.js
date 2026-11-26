'use server';

import { collections, dbConnect } from '@/lib/dbConnect';
import { getAuthSession } from '@/lib/getAuthSession';

export async function getUserChatMessagesAction() {
  try {
    const authSession = await getAuthSession();
    const userEmail = authSession?.user?.email?.trim().toLowerCase();

    if (!userEmail) return [];

    const messages = await dbConnect(collections.CHAT)
      .find({ conversationId: userEmail })
      .sort({ createdAt: 1 })
      .toArray();

    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
}

export async function sendChatMessageAction({ text, targetConversationId }) {
  try {
    const cleanText = text?.trim();
    if (!cleanText) return { success: false, error: 'Message cannot be empty' };

    const authSession = await getAuthSession();
    if (!authSession?.user?.email) {
      return {
        success: false,
        error: 'Please log in or register first to chat with admin.',
      };
    }

    const isAdmin = authSession.user.role === 'admin' && Boolean(targetConversationId);
    const conversationId = isAdmin
      ? targetConversationId
      : authSession.user.email.trim().toLowerCase();

    const doc = {
      conversationId,
      senderRole: isAdmin ? 'admin' : 'user',
      senderName: isAdmin
        ? authSession.user.name || 'BagBazar Admin'
        : authSession.user.name || authSession.user.email,
      userEmail: conversationId,
      text: cleanText,
      createdAt: new Date(),
    };

    await dbConnect(collections.CHAT).insertOne(doc);

    const messages = await dbConnect(collections.CHAT)
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .toArray();

    return {
      success: true,
      messages: JSON.parse(JSON.stringify(messages)),
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

export async function getAdminChatThreadsAction() {
  try {
    const authSession = await getAuthSession();
    if (authSession?.user?.role !== 'admin') {
      return [];
    }

    const allMessages = await dbConnect(collections.CHAT)
      .find()
      .sort({ createdAt: 1 })
      .toArray();

    const threadsMap = {};
    allMessages.forEach((msg) => {
      const cid = msg.conversationId;
      if (!cid) return;
      if (!threadsMap[cid]) {
        threadsMap[cid] = {
          conversationId: cid,
          customerName: msg.senderRole === 'user' ? msg.senderName : 'Customer',
          customerEmail: msg.userEmail || cid,
          messages: [],
          lastMessageAt: msg.createdAt,
        };
      }
      if (msg.senderRole === 'user' && msg.senderName) {
        threadsMap[cid].customerName = msg.senderName;
      }
      threadsMap[cid].messages.push(msg);
      threadsMap[cid].lastMessageAt = msg.createdAt;
    });

    const threads = Object.values(threadsMap).sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    );

    return JSON.parse(JSON.stringify(threads));
  } catch (error) {
    console.error('Error loading admin chat threads:', error);
    return [];
  }
}
